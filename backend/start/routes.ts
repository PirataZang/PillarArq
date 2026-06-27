import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/http/auth_controller')
const UsersController = () => import('#controllers/http/users_controller')
const CompaniesController = () => import('#controllers/http/companies_controller')
const ClientsController = () => import('#controllers/http/clients_controller')
const ProjectsController = () => import('#controllers/http/projects_controller')
const ProjectMaterialsController = () => import('#controllers/http/project_materials_controller')
const ProjectExpensesController = () => import('#controllers/http/project_expenses_controller')
const ProjectPhasesController = () => import('#controllers/http/project_phases_controller')
const ProjectNotesController = () => import('#controllers/http/project_notes_controller')

router.group(() => {

  // Rotas públicas de autenticação
  router.group(() => {
    router.post('/login', [AuthController, 'login'])
    router.post('/refresh', [AuthController, 'refresh'])
  }).prefix('/auth')

  // Rotas autenticadas genéricas (fora do contexto de um tenant específico)
  router.group(() => {
    
    router.group(() => {
      router.post('/logout', [AuthController, 'logout'])
      router.get('/me', [AuthController, 'me'])
    }).prefix('/auth')

    // Gerenciamento de empresas (apenas para master)
    router.group(() => {
      router.get('/companies', [CompaniesController, 'index'])
      router.get('/companies/:id', [CompaniesController, 'show'])
      router.post('/companies', [CompaniesController, 'store'])
      router.put('/companies/:id', [CompaniesController, 'update'])
      router.delete('/companies/:id', [CompaniesController, 'destroy'])
    }).use(middleware.master())

    // Rotas de recursos associados a um tenant específico
    router.group(() => {
      
      router.get('/permissions', [UsersController, 'permissionsList'])

      router.get('/users', [UsersController, 'index']).use(middleware.permission(['user.list']))
      router.get('/users/:id', [UsersController, 'show']).use(middleware.permission(['user.list']))
      router.post('/users', [UsersController, 'store']).use(middleware.permission(['user.create']))
      router.put('/users/:id', [UsersController, 'update']).use(middleware.permission(['user.update']))
      router.delete('/users/:id', [UsersController, 'destroy']).use(middleware.permission(['user.delete']))

      router.get('/clients', [ClientsController, 'index'])
      router.get('/clients/:id', [ClientsController, 'show'])
      router.post('/clients', [ClientsController, 'store'])
      router.put('/clients/:id', [ClientsController, 'update'])
      router.delete('/clients/:id', [ClientsController, 'destroy'])

      router.get('/projects', [ProjectsController, 'index'])
      router.post('/projects', [ProjectsController, 'store'])

      router.get('/projects/:projectId/materials', [ProjectMaterialsController, 'index'])
      router.post('/projects/:projectId/materials', [ProjectMaterialsController, 'store'])
      router.put('/projects/:projectId/materials/:id', [ProjectMaterialsController, 'update'])
      router.delete('/projects/:projectId/materials/:id', [ProjectMaterialsController, 'destroy'])

      router.get('/projects/:projectId/expenses', [ProjectExpensesController, 'index'])
      router.post('/projects/:projectId/expenses', [ProjectExpensesController, 'store'])
      router.put('/projects/:projectId/expenses/:id', [ProjectExpensesController, 'update'])
      router.delete('/projects/:projectId/expenses/:id', [ProjectExpensesController, 'destroy'])

      router.get('/projects/:projectId/phases', [ProjectPhasesController, 'index'])
      router.patch('/projects/:projectId/phases/:id', [ProjectPhasesController, 'update'])

      router.get('/projects/:projectId/notes', [ProjectNotesController, 'index'])
      router.post('/projects/:projectId/notes', [ProjectNotesController, 'store'])
      router.delete('/projects/:projectId/notes/:id', [ProjectNotesController, 'destroy'])

      router.get('/projects/:id', [ProjectsController, 'show'])
      router.put('/projects/:id', [ProjectsController, 'update'])
      router.delete('/projects/:id', [ProjectsController, 'destroy'])

    }).use(middleware.tenant())

  }).use(middleware.jwtAuth())

}).prefix('/api/v1')
