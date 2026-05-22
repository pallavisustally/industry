import { NextResponse } from 'next/server'

import { calculate } from '@/lib/engine/calculate'
import type { InputPayload } from '@/lib/engine/types'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  let payload: InputPayload
  try {
    payload = (await req.json()) as InputPayload
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  let result
  try {
    result = calculate(payload)
  } catch (err) {
    return NextResponse.json(
      { error: 'Calculation engine error', detail: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    )
  }

  const url = new URL(req.url)
  if (url.searchParams.get('save') === 'true') {
    try {
      const { getPayload } = await import('payload')
      const config = (await import('@/payload.config')).default
      const cms = await getPayload({ config })

      let orgId: string | undefined = undefined
      if (payload.organization?.name) {
        const existingOrg = await cms.find({
          collection: 'organizations',
          where: {
            name: {
              equals: payload.organization.name,
            },
          },
          limit: 1,
        })

        const boundaryMethod = (payload.organizationBoundary?.boundaryMethod?.toLowerCase() || 'operational_control') as 'operational_control' | 'financial_control' | 'equity_share'
        const gwpSet = (payload.calculationContext?.gwpSet || 'AR6') as 'AR5' | 'AR6'
        const baseYear = payload.calculationContext?.reportingPeriod?.year || 2025
        const sector = (payload.sector?.sectorCode?.toLowerCase() || 'cement') as 'cement'

        if (existingOrg.docs.length > 0) {
          orgId = existingOrg.docs[0].id as string
          await cms.update({
            collection: 'organizations',
            id: orgId,
            data: {
              boundaryMethod,
              gwpSet,
              baseYear,
              sector,
            },
          })
        } else {
          const newOrg = await cms.create({
            collection: 'organizations',
            data: {
              name: payload.organization.name,
              boundaryMethod,
              gwpSet,
              baseYear,
              sector,
            },
          })
          orgId = newOrg.id as string
        }
      }

      let facilityId: string | undefined = undefined
      if (payload.facility?.name && orgId) {
        const existingFacility = await cms.find({
          collection: 'facilities',
          where: {
            and: [
              {
                name: {
                  equals: payload.facility.name,
                },
              },
              {
                organization: {
                  equals: orgId,
                },
              },
            ],
          },
          limit: 1,
        })

        const facilityType = (payload.facility?.facilityType?.toLowerCase() || 'integrated_cement') as 'integrated_cement' | 'clinker_unit' | 'grinding_unit'
        const equitySharePercent = payload.organizationBoundary?.ownershipSharePercent || 100

        if (existingFacility.docs.length > 0) {
          facilityId = existingFacility.docs[0].id as string
          await cms.update({
            collection: 'facilities',
            id: facilityId,
            data: {
              facilityType,
              equitySharePercent,
            },
          })
        } else {
          const newFacility = await cms.create({
            collection: 'facilities',
            data: {
              name: payload.facility.name,
              organization: orgId,
              facilityType,
              equitySharePercent,
            },
          })
          facilityId = newFacility.id as string
        }
      }

      const saved = await cms.create({
        collection: 'calculations',
        data: {
          name: `${payload.organization?.name ?? 'Org'} — ${payload.facility?.name ?? 'Facility'} — FY ${payload.calculationContext?.reportingPeriod?.year}`,
          organization: orgId,
          facility: facilityId,
          reportingYear: payload.calculationContext?.reportingPeriod?.year ?? new Date().getFullYear(),
          status:
            result.status === 'BLOCKED'
              ? 'blocked'
              : result.status === 'SUCCESS_WITH_WARNINGS'
                ? 'success_with_warnings'
                : 'calculated',
          sectorCode: 'CEMENT',
          gwpSet: payload.calculationContext?.gwpSet ?? 'AR6',
          grossScope1Tonnes: result.scope1.grossScope1CO2Tonnes,
          biomassMemoTonnes: result.memoItems.biomassCO2Tonnes,
          supportingScope2Tonnes: result.supportingScope2.purchasedElectricityCO2Tonnes,
          supportingScope3Tonnes: result.supportingScope3.boughtClinkerCO2Tonnes,
          inputPayload: payload as unknown as Record<string, unknown>,
          result: result as unknown as Record<string, unknown>,
          calculationTrace: result.calculationTrace as unknown as Record<string, unknown>,
          factorSnapshots: result.factorSnapshots as unknown as Record<string, unknown>,
          calculatedAt: new Date().toISOString(),
        },
      })
      return NextResponse.json({ result, calculationId: saved.id })
    } catch (err) {
      // Persistence is best-effort: never block returning a correct result.
      return NextResponse.json({
        result,
        calculationId: null,
        persistenceWarning: err instanceof Error ? err.message : String(err),
      })
    }
  }

  return NextResponse.json({ result, calculationId: null })
}
