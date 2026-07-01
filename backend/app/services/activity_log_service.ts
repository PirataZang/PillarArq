import ActivityLog from '#models/activity_log'
import User from '#models/user'

type ActivityLogFilters = {
  subjectType?: string
  subjectId?: string
  event?: 'created' | 'updated' | 'deleted'
  userId?: string
  page?: number
  perPage?: number
}

async function attachUsers(logs: ActivityLog[]) {
  const userIds = [...new Set(logs.map((log) => log.userId).filter(Boolean))] as string[]
  const users = userIds.length ? await User.query().whereIn('id', userIds) : []
  const byId = new Map(users.map((user) => [String(user.id), { id: user.id, name: user.name, email: user.email }]))

  return logs.map((log) => ({
    ...log.serialize(),
    user: log.userId ? (byId.get(String(log.userId)) ?? null) : null,
  }))
}

export default class ActivityLogService {
  async index(companyId: string, filters: ActivityLogFilters = {}) {
    const query = ActivityLog.forCompany(companyId)

    if (filters.subjectType) {
      query.where('subjectType', filters.subjectType)
    }
    if (filters.subjectId) {
      query.where('subjectId', filters.subjectId)
    }
    if (filters.event) {
      query.where('event', filters.event)
    }
    if (filters.userId) {
      query.where('userId', filters.userId)
    }

    const page = filters.page ?? 1
    const perPage = Math.min(filters.perPage ?? 25, 100)
    const paginated = await query.paginate(page, perPage)
    const result = paginated.serialize()
    result.data = await attachUsers(paginated.all())
    return result
  }

  async forSubject(subjectType: string, subjectId: string) {
    const logs = await ActivityLog.forSubject(subjectType, subjectId)
    return attachUsers(logs)
  }
}
