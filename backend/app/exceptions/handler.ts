import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import type { StatusPageRange, StatusPageRenderer } from '@adonisjs/core/types/http'
import { errors as vineErrors } from '@vinejs/vine'

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display detailed errors
   * with a stack trace to the browser or CLI.
   */
  protected debug = !app.inProduction

  /**
   * Override status pages to always return JSON in API mode
   */
  protected renderStatusPages = app.inProduction

  protected statusPages: Record<StatusPageRange, StatusPageRenderer> = {
    '404': (error, { response }) => {
      return response.status(error.status).send({
        success: false,
        message: 'Rota não encontrada',
        errors: []
      })
    },
    '500..599': (error, { response }) => {
      return response.status(error.status).send({
        success: false,
        message: 'Erro interno no servidor',
        errors: [error.message]
      })
    },
  }

  /**
   * Override the handle method to standardize JSON responses
   */
  async handle(error: unknown, ctx: HttpContext) {
    if (error instanceof vineErrors.E_VALIDATION_ERROR) {
      return ctx.response.status(422).send({
        success: false,
        message: 'Erro de validação',
        errors: error.messages
      })
    }

    const err = error as { status?: number; message?: string; code?: string; stack?: string; constraint?: string }
    const status = err.status || 500
    let message = err.message || 'Ocorreu um erro inesperado'

    if (
      err.code === '23505' &&
      (err.constraint?.includes('email') || message.includes('users_email'))
    ) {
      return ctx.response.status(422).send({
        success: false,
        message: 'Este e-mail já está em uso por outro usuário.',
        errors: [{ field: 'email', message: 'Este e-mail já está em uso por outro usuário.' }],
      })
    }

    return ctx.response.status(status).send({
      success: false,
      message,
      errors: app.inProduction ? [] : [err.stack]
    })
  }

  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
