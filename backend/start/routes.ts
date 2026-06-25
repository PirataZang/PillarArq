import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/http/auth_controller')
const UsersController = () => import('#controllers/http/users_controller')
const CompaniesController = () => import('#controllers/http/companies_controller')

router.group(() => {

  router.group(() => {
    router.post('/login', [AuthController, 'login'])
    router.post('/refresh', [AuthController, 'refresh'])
  }).prefix('/auth')

  router.post('/companies', [CompaniesController, 'store'])

  // Rotas protegidas (Requer autenticação JWT)
  router.group(() => {
    
    router.group(() => {
      router.post('/logout', [AuthController, 'logout'])
      router.get('/me', [AuthController, 'me'])
    }).prefix('/auth')

    // Rotas de Tenant (Empresa) - Garante isolamento Multi-Tenant
    router.group(() => {
      
      router.get('/users', [UsersController, 'index'])
      router.get('/users/:id', [UsersController, 'show'])
      router.post('/users', [UsersController, 'store'])
      router.put('/users/:id', [UsersController, 'update'])
      router.delete('/users/:id', [UsersController, 'destroy'])

    }).use(middleware.tenant())

  }).use(middleware.jwtAuth())

}).prefix('/api/v1')
