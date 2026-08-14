// src/api/modules/teacher/material.js
// 教师端资料接口
import request from '../../request'

// 获取资料列表
export function getMaterialList(params) {
  return request({
    url: '/teacher/material/list',
    method: 'get',
    params
  })
}

// 上传资料（formData）
export function uploadMaterial(data) {
  return request({
    url: '/teacher/material/upload',
    method: 'post',
    data,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// 删除资料
export function deleteMaterial(id) {
  return request({
    url: `/teacher/material/${id}`,
    method: 'delete'
  })
}
