// src/directives/permission.js
// v-permission 自定义指令：按权限码控制元素显示隐藏
// 用法：<el-button v-permission="['admin:add']">新增</el-button>
import { hasPermission } from '@/utils/permission'

export const permissionDirective = {
  mounted(el, binding) {
    const { value } = binding
    if (!value) return
    if (!hasPermission(value)) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}
