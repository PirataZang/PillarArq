import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.refresh': { paramsTuple?: []; params?: {} }
    'companies.store': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'auth.me': { paramsTuple?: []; params?: {} }
    'users.index': { paramsTuple?: []; params?: {} }
    'users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.store': { paramsTuple?: []; params?: {} }
    'users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'clients.index': { paramsTuple?: []; params?: {} }
    'clients.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'clients.store': { paramsTuple?: []; params?: {} }
    'clients.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'clients.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.index': { paramsTuple?: []; params?: {} }
    'projects.store': { paramsTuple?: []; params?: {} }
    'project_materials.index': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'project_materials.store': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'project_materials.update': { paramsTuple: [ParamValue,ParamValue]; params: {'projectId': ParamValue,'id': ParamValue} }
    'project_materials.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'projectId': ParamValue,'id': ParamValue} }
    'project_expenses.index': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'project_expenses.store': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'project_expenses.update': { paramsTuple: [ParamValue,ParamValue]; params: {'projectId': ParamValue,'id': ParamValue} }
    'project_expenses.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'projectId': ParamValue,'id': ParamValue} }
    'project_phases.index': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'project_phases.update': { paramsTuple: [ParamValue,ParamValue]; params: {'projectId': ParamValue,'id': ParamValue} }
    'project_notes.index': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'project_notes.store': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'project_notes.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'projectId': ParamValue,'id': ParamValue} }
    'projects.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  POST: {
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.refresh': { paramsTuple?: []; params?: {} }
    'companies.store': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'users.store': { paramsTuple?: []; params?: {} }
    'clients.store': { paramsTuple?: []; params?: {} }
    'projects.store': { paramsTuple?: []; params?: {} }
    'project_materials.store': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'project_expenses.store': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'project_notes.store': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
  }
  GET: {
    'auth.me': { paramsTuple?: []; params?: {} }
    'users.index': { paramsTuple?: []; params?: {} }
    'users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'clients.index': { paramsTuple?: []; params?: {} }
    'clients.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.index': { paramsTuple?: []; params?: {} }
    'project_materials.index': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'project_expenses.index': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'project_phases.index': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'project_notes.index': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'projects.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  HEAD: {
    'auth.me': { paramsTuple?: []; params?: {} }
    'users.index': { paramsTuple?: []; params?: {} }
    'users.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'clients.index': { paramsTuple?: []; params?: {} }
    'clients.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'projects.index': { paramsTuple?: []; params?: {} }
    'project_materials.index': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'project_expenses.index': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'project_phases.index': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'project_notes.index': { paramsTuple: [ParamValue]; params: {'projectId': ParamValue} }
    'projects.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PUT: {
    'users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'clients.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'project_materials.update': { paramsTuple: [ParamValue,ParamValue]; params: {'projectId': ParamValue,'id': ParamValue} }
    'project_expenses.update': { paramsTuple: [ParamValue,ParamValue]; params: {'projectId': ParamValue,'id': ParamValue} }
    'projects.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'clients.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'project_materials.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'projectId': ParamValue,'id': ParamValue} }
    'project_expenses.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'projectId': ParamValue,'id': ParamValue} }
    'project_notes.destroy': { paramsTuple: [ParamValue,ParamValue]; params: {'projectId': ParamValue,'id': ParamValue} }
    'projects.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'project_phases.update': { paramsTuple: [ParamValue,ParamValue]; params: {'projectId': ParamValue,'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}