<!-- src/components/base/BaseDialog.vue -->
<!-- 通用弹窗组件：封装 el-dialog 的开关与标题，统一样式 -->
<template>
  <el-dialog
    :model-value="modelValue"
    :title="title"
    :width="width"
    :close-on-click-modal="false"
    @update:model-value="(val) => emit('update:modelValue', val)"
  >
    <slot />
    <template #footer>
      <slot name="footer">
        <el-button @click="emit('update:modelValue', false)">取消</el-button>
        <el-button type="primary" :loading="loading" @click="emit('confirm')">
          确定
        </el-button>
      </slot>
    </template>
  </el-dialog>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  width: { type: String, default: '500px' },
  loading: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue', 'confirm'])
</script>
