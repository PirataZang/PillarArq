import Project from '#models/project'
import ProjectExpense from '#models/project_expense'
import type { Infer } from '@vinejs/vine/types'
import type {
  createProjectExpenseValidator,
  updateProjectExpenseValidator,
} from '#validators/project_validator'
import type { ExpenseCategory } from '#constants/expense_category'
import { parseSqlDate } from '#utils/parse_sql_date'

type CreatePayload = Infer<typeof createProjectExpenseValidator>
type UpdatePayload = Infer<typeof updateProjectExpenseValidator>

export default class ProjectExpenseService {
  private async ensureProject(companyId: string, projectId: string) {
    return Project.query()
      .where('id', projectId)
      .where('companyId', companyId)
      .whereNull('deletedAt')
      .firstOrFail()
  }

  async index(companyId: string, projectId: string) {
    await this.ensureProject(companyId, projectId)

    return ProjectExpense.query()
      .where('companyId', companyId)
      .where('projectId', projectId)
      .orderBy('expenseDate', 'desc')
  }

  async store(companyId: string, projectId: string, payload: CreatePayload) {
    await this.ensureProject(companyId, projectId)

    return ProjectExpense.create({
      companyId,
      projectId,
      expenseDate: parseSqlDate(payload.expense_date)!,
      category: (payload.category ?? 'OTHER') as ExpenseCategory,
      description: payload.description,
      amount: payload.amount,
    })
  }

  async update(
    companyId: string,
    projectId: string,
    expenseId: string,
    payload: UpdatePayload
  ) {
    const expense = await ProjectExpense.query()
      .where('id', expenseId)
      .where('projectId', projectId)
      .where('companyId', companyId)
      .firstOrFail()

    const { expense_date, ...rest } = payload

    expense.merge({
      ...rest,
      ...(expense_date !== undefined ? { expenseDate: parseSqlDate(expense_date) } : {}),
      ...(rest.category !== undefined
        ? { category: rest.category as ExpenseCategory }
        : {}),
    })

    await expense.save()
    return expense
  }

  async destroy(companyId: string, projectId: string, expenseId: string) {
    const expense = await ProjectExpense.query()
      .where('id', expenseId)
      .where('projectId', projectId)
      .where('companyId', companyId)
      .firstOrFail()

    await expense.delete()
  }
}
