import type { LucidRow } from '@adonisjs/lucid/types/model'
import { DateTime } from 'luxon'
import ActivityLog from '#models/activity_log'
import { getAuditContext } from '#utils/audit_context'

const IGNORED = new Set([
  'password',
  'token',
  'createdAt',
  'updatedAt',
  'created_at',
  'updated_at',
  'lastLoginAt',
  'last_login_at',
])

export type AuditEvent = 'created' | 'updated' | 'deleted'

export function getModelLogName(model: LucidRow): string {
  return model.constructor.name
}

function pickAuditableAttributes(model: LucidRow): Record<string, unknown> {
  const hidden = new Set(
    ((model.constructor as { hidden?: string[] }).hidden ?? []).map((field) =>
      field.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())
    )
  )

  const attrs: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(model.$attributes)) {
    if (IGNORED.has(key) || hidden.has(key)) {
      continue
    }
    attrs[key] = value
  }
  return attrs
}

function buildChangedValues(model: LucidRow) {
  const hidden = new Set(
    ((model.constructor as { hidden?: string[] }).hidden ?? []).map((field) =>
      field.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase())
    )
  )

  const oldValues: Record<string, unknown> = {}
  const newValues: Record<string, unknown> = {}

  for (const key of Object.keys(model.$dirty)) {
    if (IGNORED.has(key) || hidden.has(key)) {
      continue
    }
    oldValues[key] = model.$original[key as keyof typeof model.$original]
    newValues[key] = model.$attributes[key as keyof typeof model.$attributes]
  }

  return { oldValues, newValues }
}

function resolveCompanyId(model: LucidRow, ctxCompanyId?: string): string | null {
  if ('companyId' in model && model.companyId) {
    return String(model.companyId)
  }
  if ('id' in model && getModelLogName(model) === 'Company') {
    return String(model.id)
  }
  return ctxCompanyId ?? null
}

export async function logModelEvent(model: LucidRow, event: AuditEvent) {
  const ctx = getAuditContext()
  let oldValues: Record<string, unknown> | null = null
  let newValues: Record<string, unknown> | null = null

  if (event === 'created') {
    newValues = pickAuditableAttributes(model)
  } else if (event === 'deleted') {
    oldValues = pickAuditableAttributes(model)
  } else {
    const changed = buildChangedValues(model)
    if (Object.keys(changed.oldValues).length === 0) {
      return
    }
    oldValues = changed.oldValues
    newValues = changed.newValues
  }

  await logSubjectChange(getModelLogName(model), String(model.$primaryKeyValue), event, oldValues, newValues, resolveCompanyId(model, ctx.companyId))
}

export async function logSubjectChange(
  subjectType: string,
  subjectId: string,
  event: AuditEvent,
  oldValues: Record<string, unknown> | null,
  newValues: Record<string, unknown> | null,
  companyId?: string | null
) {
  const ctx = getAuditContext()

  await ActivityLog.create({
    event,
    subjectType,
    subjectId: String(subjectId),
    userId: ctx.userId ?? null,
    companyId: companyId ?? ctx.companyId ?? null,
    ipAddress: ctx.ipAddress ?? null,
    oldValues,
    newValues,
    updateDate: DateTime.now(),
  })
}
