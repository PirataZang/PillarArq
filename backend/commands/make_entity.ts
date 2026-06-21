import { BaseCommand, args } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import fs from 'node:fs/promises'
import path from 'node:path'
import stringHelpers from '@adonisjs/core/helpers/string'

export default class MakeEntity extends BaseCommand {
  static commandName = 'make:entity'
  static description = 'Creates a complete architectural boilerplate for a given entity'
  
  static options: CommandOptions = {
    startApp: false,
    allowUnknownFlags: false,
    staysAlive: false,
  }

  @args.string({ description: 'Name of the entity (e.g., Project)' })
  declare name: string

  async run() {
    const entityName = stringHelpers.pascalCase(stringHelpers.singular(this.name))
    const entityNamePlural = stringHelpers.pascalCase(stringHelpers.plural(this.name))
    const tableName = stringHelpers.snakeCase(stringHelpers.plural(this.name))
    const varName = stringHelpers.camelCase(entityName)

    const baseDir = this.app.appRoot
    
    // Define all file paths
    const files = {
      model: path.join(baseDir, 'app', 'Models', `${entityName}.ts`),
      controller: path.join(baseDir, 'app', 'Controllers', 'Http', `${entityNamePlural}Controller.ts`),
      service: path.join(baseDir, 'app', 'Services', entityName, `${entityName}Service.ts`),
      createValidator: path.join(baseDir, 'app', 'Validators', entityName, `Create${entityName}Validator.ts`),
      updateValidator: path.join(baseDir, 'app', 'Validators', entityName, `Update${entityName}Validator.ts`),
      createDto: path.join(baseDir, 'app', 'DTOs', entityName, `Create${entityName}DTO.ts`),
      updateDto: path.join(baseDir, 'app', 'DTOs', entityName, `Update${entityName}DTO.ts`),
      filters: path.join(baseDir, 'app', 'Interfaces', entityName, `${entityName}Filters.ts`),
      migration: path.join(baseDir, 'database', 'migrations', `${Date.now()}_create_${tableName}_table.ts`),
    }

    // Helper to write file
    const writeFile = async (filePath: string, content: string) => {
      await fs.mkdir(path.dirname(filePath), { recursive: true })
      await fs.writeFile(filePath, content.trim() + '\n')
      this.logger.success(`CREATED ${path.relative(baseDir, filePath)}`)
    }

    // --- TEMPLATES ---
    const modelTemplate = `
import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ${entityName} extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare companyId: string

  @column()
  declare createdBy: string | null

  @column()
  declare updatedBy: string | null

  @column.dateTime()
  declare deletedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
`

    const controllerTemplate = `
import type { HttpContext } from '@adonisjs/core/http'
import ${entityName}Service from '../../Services/${entityName}/${entityName}Service.js'
import { create${entityName}Validator } from '../../Validators/${entityName}/Create${entityName}Validator.js'
import { update${entityName}Validator } from '../../Validators/${entityName}/Update${entityName}Validator.js'

export default class ${entityNamePlural}Controller {
  public async index({ request, response }: HttpContext) {
    const filters = request.qs()
    const result = await ${entityName}Service.paginate(filters)
    return response.ok(result)
  }

  public async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(create${entityName}Validator)
    const result = await ${entityName}Service.create(data)
    return response.created(result)
  }

  public async show({ params, response }: HttpContext) {
    const result = await ${entityName}Service.findById(params.id)
    return response.ok(result)
  }

  public async update({ params, request, response }: HttpContext) {
    const data = await request.validateUsing(update${entityName}Validator)
    const result = await ${entityName}Service.update(params.id, data)
    return response.ok(result)
  }

  public async destroy({ params, response }: HttpContext) {
    await ${entityName}Service.delete(params.id)
    return response.noContent()
  }
}
`

    const serviceTemplate = `
import ${entityName} from '../../Models/${entityName}.js'
import type { Create${entityName}DTO } from '../../DTOs/${entityName}/Create${entityName}DTO.js'
import type { Update${entityName}DTO } from '../../DTOs/${entityName}/Update${entityName}DTO.js'
import type { ${entityName}Filters } from '../../Interfaces/${entityName}/${entityName}Filters.js'

class ${entityName}Service {
  public async paginate(filters: ${entityName}Filters) {
    const page = filters.page || 1
    const limit = filters.limit || 10
    
    const query = ${entityName}.query()
    
    if (filters.companyId) {
      query.where('companyId', filters.companyId)
    }

    return await query.paginate(page, limit)
  }

  public async create(data: Create${entityName}DTO) {
    return await ${entityName}.create(data)
  }

  public async findById(id: string | number) {
    return await ${entityName}.findOrFail(id)
  }

  public async update(id: string | number, data: Update${entityName}DTO) {
    const ${varName} = await this.findById(id)
    ${varName}.merge(data)
    return await ${varName}.save()
  }

  public async delete(id: string | number) {
    const ${varName} = await this.findById(id)
    await ${varName}.delete()
  }
}

export default new ${entityName}Service()
`

    const createValidatorTemplate = `
import vine from '@vinejs/vine'

export const create${entityName}Validator = vine.compile(
  vine.object({
    companyId: vine.string().trim(),
    // Add additional validation fields here
  })
)
`

    const updateValidatorTemplate = `
import vine from '@vinejs/vine'

export const update${entityName}Validator = vine.compile(
  vine.object({
    companyId: vine.string().trim().optional(),
    // Add additional validation fields here
  })
)
`

    const createDtoTemplate = `
export interface Create${entityName}DTO {
  companyId: string
  // Add additional properties here
}
`

    const updateDtoTemplate = `
export interface Update${entityName}DTO {
  companyId?: string
  // Add additional properties here
}
`

    const filtersTemplate = `
export interface ${entityName}Filters {
  page?: number
  limit?: number
  companyId?: string
}
`

    const migrationTemplate = `
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = '${tableName}'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').primary()
      table.bigInteger('company_id').notNullable()
      table.bigInteger('created_by').nullable()
      table.bigInteger('updated_by').nullable()
      
      table.timestamp('deleted_at').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')

      // Indexes
      table.index(['company_id'])
      table.index(['company_id', 'id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
`

    // --- WRITE FILES ---
    await writeFile(files.model, modelTemplate)
    await writeFile(files.controller, controllerTemplate)
    await writeFile(files.service, serviceTemplate)
    await writeFile(files.createValidator, createValidatorTemplate)
    await writeFile(files.updateValidator, updateValidatorTemplate)
    await writeFile(files.createDto, createDtoTemplate)
    await writeFile(files.updateDto, updateDtoTemplate)
    await writeFile(files.filters, filtersTemplate)
    await writeFile(files.migration, migrationTemplate)

    this.logger.success(\`Entity \${entityName} boilerplate created successfully!\`)
  }
}
