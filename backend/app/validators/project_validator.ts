import vine from '@vinejs/vine'
import { PROJECT_STATUSES } from '#constants/project_status'

const sqlDate = () => vine.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/)

export const createProjectValidator = vine.compile(
  vine.object({
    client_id: vine.string().trim(),
    name: vine.string().trim().minLength(2),
    description: vine.string().trim().optional(),
    address: vine.string().trim().optional(),
    area_m2: vine.number().min(0),
    status: vine.enum(PROJECT_STATUSES).optional(),
    service_rate_override: vine.number().min(0).optional(),
    extra_amount: vine.number().min(0).optional(),
    assigned_user_id: vine.string().trim().optional(),
    start_date: sqlDate().optional(),
    expected_end_date: sqlDate().optional(),
  })
)

export const updateProjectValidator = vine.compile(
  vine.object({
    client_id: vine.string().trim().optional(),
    name: vine.string().trim().minLength(2).optional(),
    description: vine.string().trim().optional(),
    address: vine.string().trim().optional(),
    area_m2: vine.number().min(0).optional(),
    status: vine.enum(PROJECT_STATUSES).optional(),
    service_rate_override: vine.number().min(0).nullable().optional(),
    extra_amount: vine.number().min(0).optional(),
    assigned_user_id: vine.string().trim().nullable().optional(),
    start_date: sqlDate().nullable().optional(),
    expected_end_date: sqlDate().nullable().optional(),
  })
)

export const createProjectMaterialValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1),
    quantity: vine.number().min(0),
    unit: vine.string().trim().minLength(1),
    unit_price: vine.number().min(0),
    supplier: vine.string().trim().optional(),
    sort_order: vine.number().optional(),
  })
)

export const updateProjectMaterialValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(1).optional(),
    quantity: vine.number().min(0).optional(),
    unit: vine.string().trim().minLength(1).optional(),
    unit_price: vine.number().min(0).optional(),
    supplier: vine.string().trim().nullable().optional(),
    sort_order: vine.number().optional(),
  })
)

export const createProjectExpenseValidator = vine.compile(
  vine.object({
    expense_date: sqlDate(),
    category: vine.string().trim().optional(),
    description: vine.string().trim().minLength(1),
    amount: vine.number().min(0),
  })
)

export const updateProjectExpenseValidator = vine.compile(
  vine.object({
    expense_date: sqlDate().optional(),
    category: vine.string().trim().optional(),
    description: vine.string().trim().minLength(1).optional(),
    amount: vine.number().min(0).optional(),
  })
)

export const updateProjectPhaseValidator = vine.compile(
  vine.object({
    is_completed: vine.boolean(),
  })
)

export const createProjectNoteValidator = vine.compile(
  vine.object({
    content: vine.string().trim().minLength(1),
  })
)
