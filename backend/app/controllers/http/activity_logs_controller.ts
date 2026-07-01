import type { HttpContext } from '@adonisjs/core/http'
import ActivityLogService from '#services/activity_log_service'
import { listActivityLogsValidator } from '#validators/activity_log_validator'
import User from '#models/user'

export default class ActivityLogsController {
  private activityLogService = new ActivityLogService()

  async index({ auth, request, response }: HttpContext) {
    const companyId = (auth.user as User).companyId
    const filters = await request.validateUsing(listActivityLogsValidator)

    const logs = await this.activityLogService.index(companyId, {
      subjectType: filters.subject_type,
      subjectId: filters.subject_id,
      event: filters.event,
      userId: filters.user_id,
      page: filters.page,
      perPage: filters.per_page,
    })

    return response.ok({
      success: true,
      message: 'Activity logs listed successfully',
      data: logs,
    })
  }

  async forSubject({ params, response }: HttpContext) {
    const logs = await this.activityLogService.forSubject(params.subjectType, params.subjectId)

    return response.ok({
      success: true,
      message: 'Activity logs retrieved successfully',
      data: logs,
    })
  }
}
