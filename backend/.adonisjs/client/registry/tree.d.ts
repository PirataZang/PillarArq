/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    login: typeof routes['auth.login']
    refresh: typeof routes['auth.refresh']
    logout: typeof routes['auth.logout']
    me: typeof routes['auth.me']
  }
  companies: {
    store: typeof routes['companies.store']
  }
  users: {
    index: typeof routes['users.index']
    show: typeof routes['users.show']
    store: typeof routes['users.store']
    update: typeof routes['users.update']
    destroy: typeof routes['users.destroy']
  }
  clients: {
    index: typeof routes['clients.index']
    show: typeof routes['clients.show']
    store: typeof routes['clients.store']
    update: typeof routes['clients.update']
    destroy: typeof routes['clients.destroy']
  }
  projects: {
    index: typeof routes['projects.index']
    store: typeof routes['projects.store']
    show: typeof routes['projects.show']
    update: typeof routes['projects.update']
    destroy: typeof routes['projects.destroy']
  }
  projectMaterials: {
    index: typeof routes['project_materials.index']
    store: typeof routes['project_materials.store']
    update: typeof routes['project_materials.update']
    destroy: typeof routes['project_materials.destroy']
  }
  projectExpenses: {
    index: typeof routes['project_expenses.index']
    store: typeof routes['project_expenses.store']
    update: typeof routes['project_expenses.update']
    destroy: typeof routes['project_expenses.destroy']
  }
  projectPhases: {
    index: typeof routes['project_phases.index']
    update: typeof routes['project_phases.update']
  }
  projectNotes: {
    index: typeof routes['project_notes.index']
    store: typeof routes['project_notes.store']
    destroy: typeof routes['project_notes.destroy']
  }
}
