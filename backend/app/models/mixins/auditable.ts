import { afterCreate, beforeUpdate, afterDelete, BaseModel } from '@adonisjs/lucid/orm'
import type { LucidRow } from '@adonisjs/lucid/types/model'
import ActivityLog from '#models/activity_log'
import { logModelEvent } from '#utils/audit_logger'

export function Auditable<T extends typeof BaseModel>(superclass: T) {
  class AuditableModel extends superclass {
    activities() {
      return ActivityLog.forSubject(this.constructor.name, String(this.$primaryKeyValue))
    }

    @afterCreate()
    static async auditCreated(model: LucidRow) {
      await logModelEvent(model, 'created')
    }

    @beforeUpdate()
    static async auditUpdated(model: LucidRow) {
      const isSoftDelete =
        'deletedAt' in model.$dirty && (model as { deletedAt?: unknown }).deletedAt

      await logModelEvent(model, isSoftDelete ? 'deleted' : 'updated')
    }

    @afterDelete()
    static async auditDeleted(model: LucidRow) {
      await logModelEvent(model, 'deleted')
    }
  }

  return AuditableModel
}
