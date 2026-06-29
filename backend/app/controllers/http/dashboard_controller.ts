import type { HttpContext } from '@adonisjs/core/http'
import { DateTime } from 'luxon'
import DashboardService from '#services/dashboard_service'
import { dashboardStatsValidator } from '#validators/dashboard_validator'
import type { DashboardFilters } from '#services/dashboard_service'
import User from '#models/user'

export default class DashboardController {
  private dashboardService = new DashboardService()

  async index({ auth, request, response }: HttpContext) {
    const companyId = (auth.user as User).companyId
    const payload = await request.validateUsing(dashboardStatsValidator)
    const now = DateTime.now()

    const filters: DashboardFilters = {
      period_from: payload.period_from ?? now.startOf('month').toISODate()!,
      period_to: payload.period_to ?? now.toISODate()!,
      status: payload.status,
    }

    const data = await this.dashboardService.getStats(companyId, filters)

    return response.ok({
      success: true,
      message: 'Dashboard stats retrieved successfully',
      data,
    })
  }
}
