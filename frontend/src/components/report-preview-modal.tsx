import { motion, AnimatePresence } from 'framer-motion'
import { Download, X } from 'lucide-react'
import type { CalculationResult, InputPayload } from '@/lib/engine/types'

export function ReportPreviewModal({
  result,
  payload,
  onClose,
  onDownload,
}: {
  result: CalculationResult
  payload: InputPayload
  onClose: () => void
  onDownload: () => void
}) {
  if (!result || !payload) return null

  const fmt = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 })

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay preview-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="report-preview-container"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="preview-toolbar">
            <div className="toolbar-title">Report Preview</div>
            <div className="toolbar-actions">
              <button className="btn primary" onClick={onDownload}>
                <Download size={15} /> Download PDF
              </button>
              <button className="icon-button" onClick={onClose}>
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="preview-canvas">
            <div className="a4-page">
              <header className="report-header">
                <img src="/brand/logomark-white.svg" alt="Sustally Logo" className="report-logo" />
                <div className="report-title-block">
                  <h1>Scope 1 Emissions Inventory</h1>
                  <h2>{payload.facility.name || 'Unnamed Facility'}</h2>
                  <p>Reporting Period: FY {result.reportingPeriod.year}</p>
                </div>
              </header>

              <section className="report-section">
                <h3>Executive Summary</h3>
                <div className="summary-grid">
                  <div className="summary-box">
                    <span>Gross Scope 1 Emissions</span>
                    <strong>{fmt.format(result.scope1.grossScope1CO2Tonnes)} tCO₂e</strong>
                  </div>
                  <div className="summary-box">
                    <span>Data Quality</span>
                    <strong>{result.dataQuality.overall.replace('_', ' ')}</strong>
                  </div>
                  <div className="summary-box">
                    <span>Methodology Pack</span>
                    <strong>{result.methodologyPack}</strong>
                  </div>
                </div>
              </section>

              <section className="report-section">
                <h3>Boundary & Context</h3>
                <table className="report-table">
                  <tbody>
                    <tr>
                      <th>Organization</th>
                      <td>{payload.organization.name} ({payload.organization.country})</td>
                    </tr>
                    <tr>
                      <th>Boundary Method</th>
                      <td>{payload.organizationBoundary.boundaryMethod.replace('_', ' ')}</td>
                    </tr>
                    <tr>
                      <th>Sector</th>
                      <td>{result.sectorCode}</td>
                    </tr>
                    <tr>
                      <th>GWP Set</th>
                      <td>{payload.calculationContext.gwpSet}</td>
                    </tr>
                  </tbody>
                </table>
              </section>

              <section className="report-section">
                <h3>Detailed Scope 1 Breakdown</h3>
                <table className="report-table breakdown-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th className="text-right">Emissions (tCO₂e)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(result.scope1.components).map(([k, v]) => (
                      <tr key={k}>
                        <td>{k.replace(/CO2e?Tonnes$/, '').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</td>
                        <td className="text-right">{fmt.format(v)}</td>
                      </tr>
                    ))}
                    <tr className="total-row">
                      <th>Total Gross Scope 1</th>
                      <th className="text-right">{fmt.format(result.scope1.grossScope1CO2Tonnes)}</th>
                    </tr>
                  </tbody>
                </table>
              </section>

              <section className="report-section">
                <h3>Out of Scope / Memo Items</h3>
                <table className="report-table">
                  <tbody>
                    <tr>
                      <th>Biomass CO₂ (Memo)</th>
                      <td className="text-right">{fmt.format(result.memoItems.biomassCO2Tonnes)} tCO₂</td>
                    </tr>
                    <tr>
                      <th>Combustion CH₄/N₂O (CO₂e)</th>
                      <td className="text-right">{fmt.format(result.nonCsiCombustionGhg.ch4N2oCO2eTonnes)} tCO₂e</td>
                    </tr>
                  </tbody>
                </table>
              </section>
              
              <footer className="report-footer">
                Generated by Sustally · {new Date().toLocaleDateString()}
              </footer>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
