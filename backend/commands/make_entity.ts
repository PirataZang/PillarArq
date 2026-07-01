import { BaseCommand, args } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import fs from 'node:fs/promises'
import path from 'node:path'
import stringHelpers from '@adonisjs/core/helpers/string'
import { fileURLToPath } from 'node:url'

export default class MakeEntity extends BaseCommand {
  static commandName = 'make:entity'
  static description = 'Cria model, migration, service, controller e validators com auditoria'

  static options: CommandOptions = {
    startApp: false,
    allowUnknownFlags: false,
    staysAlive: false,
  }

  @args.string({ description: 'Nome da entidade (ex: Product)' })
  declare name: string

  async run() {
    const entityName = stringHelpers.pascalCase(stringHelpers.singular(this.name))
    const entityPlural = stringHelpers.plural(entityName)
    const tableName = stringHelpers.snakeCase(entityPlural)
    const routePath = stringHelpers.dashCase(entityPlural)
    const varName = stringHelpers.camelCase(entityName)

    const baseDir = fileURLToPath(this.app.appRoot)

    const files = {
      model: path.join(baseDir, 'app', 'models', `${stringHelpers.snakeCase(entityName)}.ts`),
      controller: path.join(baseDir, 'app', 'controllers', 'http', `${tableName}_controller.ts`),
      service: path.join(baseDir, 'app', 'services', `${stringHelpers.snakeCase(entityName)}_service.ts`),
      createValidator: path.join(baseDir, 'app', 'validators', `${stringHelpers.snakeCase(entityName)}_validator.ts`),
      migration: path.join(baseDir, 'database', 'migrations', `${Date.now()}_create_${tableName}_table.ts`),
    }

    const writeFile = async (filePath: string, content: string) => {
      await fs.mkdir(path.dirname(filePath), { recursive: true })
      await fs.writeFile(filePath, content.trim() + '\n')
      this.logger.success(`CREATED ${path.relative(baseDir, filePath)}`)
    }

    const modelTemplate = `
import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Company from './company.js'
import { Auditable } from './mixins/auditable.js'

export default class ${entityName} extends Auditable(BaseModel) {
  @column({ isPrimary: true })
  declare id: string

  @column({ serializeAs: 'company_id' })
  declare companyId: string

  @column({ serializeAs: 'created_by' })
  declare createdBy: string | null

  @column({ serializeAs: 'updated_by' })
  declare updatedBy: string | null

  @column.dateTime({ autoCreate: true, serializeAs: 'created_at' })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: 'updated_at' })
  declare updatedAt: DateTime

  @column.dateTime({ serializeAs: 'deleted_at' })
  declare deletedAt: DateTime | null

  @belongsTo(() => Company)
  declare company: BelongsTo<typeof Company>
}
`

    const controllerTemplate = `
import type { HttpContext } from '@adonisjs/core/http'
import ${entityName}Service from '#services/${stringHelpers.snakeCase(entityName)}_service'
import { create${entityName}Validator, update${entityName}Validator } from '#validators/${stringHelpers.snakeCase(entityName)}_validator'
import User from '#models/user'

export default class ${entityPlural}Controller {
  private ${varName}Service = new ${entityName}Service()

  async index({ auth, response }: HttpContext) {
    const companyId = (auth.user as User).companyId
    const items = await this.${varName}Service.index(companyId)
    return response.ok({ success: true, message: '${entityPlural} listed successfully', data: items })
  }

  async show({ auth, params, response }: HttpContext) {
    const companyId = (auth.user as User).companyId
    const item = await this.${varName}Service.show(companyId, params.id)
    return response.ok({ success: true, message: '${entityName} retrieved successfully', data: item })
  }

  async store({ auth, request, response }: HttpContext) {
    const user = auth.user as User
    const payload = await request.validateUsing(create${entityName}Validator)
    const item = await this.${varName}Service.store(user.companyId, payload, user.id)
    return response.created({ success: true, message: '${entityName} created successfully', data: item })
  }

  async update({ auth, request, params, response }: HttpContext) {
    const user = auth.user as User
    const payload = await request.validateUsing(update${entityName}Validator)
    const item = await this.${varName}Service.update(user.companyId, params.id, payload, user.id)
    return response.ok({ success: true, message: '${entityName} updated successfully', data: item })
  }

  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.user as User
    await this.${varName}Service.destroy(user.companyId, params.id, user.id)
    return response.ok({ success: true, message: '${entityName} deleted successfully', data: {} })
  }
}
`

    const serviceTemplate = `
import { DateTime } from 'luxon'
import ${entityName} from '#models/${stringHelpers.snakeCase(entityName)}'
import type { Infer } from '@vinejs/vine/types'
import type { create${entityName}Validator, update${entityName}Validator } from '#validators/${stringHelpers.snakeCase(entityName)}_validator'

type CreatePayload = Infer<typeof create${entityName}Validator>
type UpdatePayload = Infer<typeof update${entityName}Validator>

export default class ${entityName}Service {
  async index(companyId: string) {
    return ${entityName}.query().where('companyId', companyId).whereNull('deletedAt').orderBy('id', 'desc')
  }

  async show(companyId: string, id: string) {
    return ${entityName}.query().where('id', id).where('companyId', companyId).whereNull('deletedAt').firstOrFail()
  }

  async store(companyId: string, payload: CreatePayload, userId?: string) {
    return ${entityName}.create({ ...payload, companyId, createdBy: userId ?? null })
  }

  async update(companyId: string, id: string, payload: UpdatePayload, userId?: string) {
    const ${varName} = await this.show(companyId, id)
    ${varName}.merge({ ...payload, updatedBy: userId ?? null })
    await ${varName}.save()
    return ${varName}
  }

  async destroy(companyId: string, id: string, userId?: string) {
    const ${varName} = await this.show(companyId, id)
    ${varName}.deletedAt = DateTime.now()
    ${varName}.updatedBy = userId ?? null
    await ${varName}.save()
  }
}
`

    const validatorTemplate = `
import vine from '@vinejs/vine'

export const create${entityName}Validator = vine.compile(
  vine.object({
    // adicione os campos da entidade
  })
)

export const update${entityName}Validator = vine.compile(
  vine.object({
    // adicione os campos da entidade (opcionais)
  })
)
`

    const migrationTemplate = `
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = '${tableName}'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').primary()
      table.bigInteger('company_id').notNullable().references('id').inTable('companies').onDelete('CASCADE')
      table.bigInteger('created_by').nullable().references('id').inTable('users').onDelete('SET NULL')
      table.bigInteger('updated_by').nullable().references('id').inTable('users').onDelete('SET NULL')
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
      table.timestamp('deleted_at', { useTz: true }).nullable()

      table.index(['company_id'])
      table.index(['company_id', 'id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
`

    await writeFile(files.model, modelTemplate)
    await writeFile(files.controller, controllerTemplate)
    await writeFile(files.service, serviceTemplate)
    await writeFile(files.createValidator, validatorTemplate)
    await writeFile(files.migration, migrationTemplate)

    this.logger.info('')
    this.logger.info('Auditoria: model já estende Auditable(BaseModel) — logs automáticos em create/update/delete.')
    this.logger.info(`Rotas sugeridas em start/routes.ts (grupo tenant):`)
    this.logger.info(`  router.get('/${routePath}', [${entityPlural}Controller, 'index'])`)
    this.logger.info(`  router.get('/${routePath}/:id', [${entityPlural}Controller, 'show'])`)
    this.logger.info(`  router.post('/${routePath}', [${entityPlural}Controller, 'store'])`)
    this.logger.info(`  router.put('/${routePath}/:id', [${entityPlural}Controller, 'update'])`)
    this.logger.info(`  router.delete('/${routePath}/:id', [${entityPlural}Controller, 'destroy'])`)
    this.logger.info(`Logs: GET /api/v1/activity-logs/${entityName}/:id`)
    this.logger.success(`Entity ${entityName} criada com auditoria.`)
  }
}
