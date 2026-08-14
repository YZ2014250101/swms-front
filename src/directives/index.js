// src/directives/index.js
// 统一注册自定义指令
import { permissionDirective } from './permission'

export function setupDirectives(app) {
  app.directive('permission', permissionDirective)
}
