// src/utils/validate.js
// 表单校验规则

// 手机号校验
export function isPhone(value) {
  return /^1[3-9]\d{9}$/.test(value)
}

// 邮箱校验
export function isEmail(value) {
  return /^[\w.-]+@[\w-]+(\.[\w-]+)+$/.test(value)
}

// 学号 / 工号校验（数字字母组合，6-20位）
export function isUserId(value) {
  return /^[A-Za-z0-9]{6,20}$/.test(value)
}

// Element Plus 表单校验器：手机号
export const phoneValidator = (rule, value, callback) => {
  if (!value) {
    callback()
  } else if (!isPhone(value)) {
    callback(new Error('请输入正确的手机号'))
  } else {
    callback()
  }
}

// Element Plus 表单校验器：邮箱
export const emailValidator = (rule, value, callback) => {
  if (!value) {
    callback()
  } else if (!isEmail(value)) {
    callback(new Error('请输入正确的邮箱'))
  } else {
    callback()
  }
}
