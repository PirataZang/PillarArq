import { Exception } from '@adonisjs/core/exceptions'

export default class LimitException extends Exception {
  constructor(message: string) {
    super(message, { status: 400, code: 'E_LIMIT_EXCEEDED' })
  }
}
