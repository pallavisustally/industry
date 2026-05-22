import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, Activity, Beaker, Calculator } from 'lucide-react'
import type { CalculationResult, TraceEntry } from '@/lib/engine/types'

export function ProvenanceModal({
  result,
  categoryKey,
  onClose,
}: {
  result: CalculationResult
  categoryKey: string | null
  onClose: () => void
}) {
  if (!result || !categoryKey) return null

  // A loose heuristic to find relevant trace entries
  const keyword = categoryKey.replace(/CO2e?Tonnes$/, '').toLowerCase()
  let filteredTrace = result.calculationTrace.filter((t) => {
    const text = (t.step + ' ' + t.category + ' ' + (t.method || '')).toLowerCase()
    if (keyword === 'clinkercalcination') return text.includes('calcination') && !text.includes('bypass')
    if (keyword === 'bypassdust') return text.includes('bypass')
    if (keyword === 'ckd') return text.includes('ckd')
    if (keyword === 'rawmealtoc') return text.includes('toc')
    if (keyword === 'conventionalkilnfuel') return text.includes('kiln') && !text.includes('alternative') && !text.includes('non-kiln')
    if (keyword === 'alternativefossilklinfuel') return text.includes('alternative')
    if (keyword === 'nonkilnfossil') return text.includes('non-kiln')
    if (keyword === 'mobilecombustion') return text.includes('mobile')
    if (keyword === 'fugitive') return text.includes('fugitive')
    return text.includes(keyword)
  })

  // Fallback if filter is too strict
  if (filteredTrace.length === 0) {
    filteredTrace = result.calculationTrace
  }

  const fmt = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 })

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-content provenance-modal"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <header className="modal-header">
            <div>
              <h2>Factor Provenance Map</h2>
              <p>Lineage of exactly how activity data and emission factors combined.</p>
            </div>
            <button className="icon-button" onClick={onClose}>
              <X size={20} />
            </button>
          </header>

          <div className="modal-body">
            {filteredTrace.map((trace, i) => (
              <div key={i} className="provenance-flow">
                <h3>{trace.step} <span className="badge">{trace.method}</span></h3>
                
                <div className="flow-diagram">
                  <div className="flow-nodes">
                    {/* Activity Data Node */}
                    <div className="flow-node activity-node">
                      <div className="node-icon"><Activity size={16} /></div>
                      <div className="node-content">
                        <strong>Activity Data</strong>
                        <ul>
                          {Object.entries(trace.inputs).map(([k, v]) => (
                            <li key={k}>
                              <span>{k}:</span> {v}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Factor Node */}
                    {trace.factorSnapshots.length > 0 && (
                      <div className="flow-node factor-node">
                        <div className="node-icon"><Beaker size={16} /></div>
                        <div className="node-content">
                          <strong>Emission Factors</strong>
                          <ul>
                            {trace.factorSnapshots.map((f) => (
                              <li key={f.factorCode}>
                                <span>{f.factorName}:</span> {f.value} {f.unit}
                                <div className="factor-source">Source: {f.source}</div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flow-arrow">
                    <ArrowRight size={24} className="text-muted" />
                  </div>

                  {/* Formula Node */}
                  <div className="flow-node formula-node">
                    <div className="node-icon"><Calculator size={16} /></div>
                    <div className="node-content">
                      <strong>Formula</strong>
                      <code>{trace.formula}</code>
                    </div>
                  </div>

                  <div className="flow-arrow">
                    <ArrowRight size={24} className="text-muted" />
                  </div>

                  {/* Result Node */}
                  <div className="flow-node result-node">
                    <div className="node-content text-center">
                      <strong>Result</strong>
                      <div className="result-value">{fmt.format(trace.outputTonnesCO2)}</div>
                      <small>tCO₂e</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
