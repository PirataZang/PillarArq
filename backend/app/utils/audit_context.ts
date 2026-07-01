import { AsyncLocalStorage } from 'node:async_hooks'

export type AuditContext = {
  userId?: string
  companyId?: string
  ipAddress?: string
}

const storage = new AsyncLocalStorage<AuditContext>()

export function runWithAuditContext<T>(ctx: AuditContext, fn: () => T): T {
  return storage.run(ctx, fn)
}

export function getAuditContext(): AuditContext {
  return storage.getStore() ?? {}
}

export function setAuditCompanyId(companyId: string) {
  const store = storage.getStore()
  if (store) {
    store.companyId = companyId
  }
}
