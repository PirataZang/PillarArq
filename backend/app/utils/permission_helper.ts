import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const configPath = path.join(__dirname, '..', '..', 'config', 'permissions.json')

export function getDefaultPermissions() {
  try {
    const raw = fs.readFileSync(configPath, 'utf-8')
    return JSON.parse(raw)
  } catch (err) {
    console.error('Error reading permissions.json:', err)
    return {}
  }
}

/**
 * Filtra as permissões enviadas no payload (objeto com estrutura de ações e values) e retorna um array das chaves ativas (true).
 */
export function syncPermissions(inputPermissions: any): string[] {
  const activePermissions: string[] = []
  const defaultPermissions = getDefaultPermissions()

  for (const module of Object.keys(defaultPermissions)) {
    const actionsObj = inputPermissions?.[module]?.actions
    if (!actionsObj) continue

    for (const action of Object.keys(actionsObj)) {
      const isAllowed = actionsObj[action]?.value === true
      if (isAllowed) {
        activePermissions.push(`${module}.${action}`)
      }
    }
  }

  return activePermissions
}

/**
 * Reconstrói o objeto estruturado completo de permissões com base no array de chaves vindas do BD.
 */
export function unserializePermissions(dbPermissions: string[]): any {
  const defaultPermissions = getDefaultPermissions()
  const permissionsObj = JSON.parse(JSON.stringify(defaultPermissions))

  for (const perm of dbPermissions) {
    const [module, action] = perm.split('.')
    if (permissionsObj[module]?.actions?.[action] !== undefined) {
      permissionsObj[module].actions[action].value = true
    }
  }

  return permissionsObj
}
