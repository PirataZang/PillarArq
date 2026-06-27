import type { HttpContext } from '@adonisjs/core/http'
import ProjectExpenseService from '#services/project_expense_service'
import {
  createProjectExpenseValidator,
  updateProjectExpenseValidator,
} from '#validators/project_validator'
import User from '#models/user'

export default class ProjectExpensesController {
  private expenseService = new ProjectExpenseService()

  async index({ auth, params, response }: HttpContext) {
    const companyId = (auth.user as User).companyId
    const expenses = await this.expenseService.index(companyId, params.projectId)

    return response.ok({
      success: true,
      message: 'Project expenses listed successfully',
      data: expenses,
    })
  }

  async store({ auth, request, params, response }: HttpContext) {
    const companyId = (auth.user as User).companyId
    const payload = await request.validateUsing(createProjectExpenseValidator)
    const expense = await this.expenseService.store(companyId, params.projectId, payload)

    return response.created({
      success: true,
      message: 'Project expense created successfully',
      data: expense,
    })
  }

  async update({ auth, request, params, response }: HttpContext) {
    const companyId = (auth.user as User).companyId
    const payload = await request.validateUsing(updateProjectExpenseValidator)
    const expense = await this.expenseService.update(
      companyId,
      params.projectId,
      params.id,
      payload
    )

    return response.ok({
      success: true,
      message: 'Project expense updated successfully',
      data: expense,
    })
  }

  async destroy({ auth, params, response }: HttpContext) {
    const companyId = (auth.user as User).companyId
    await this.expenseService.destroy(companyId, params.projectId, params.id)

    return response.ok({
      success: true,
      message: 'Project expense deleted successfully',
      data: {},
    })
  }
}
