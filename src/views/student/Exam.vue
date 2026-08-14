<!-- src/views/student/Exam.vue -->
<!-- 考试安排查询，含考试须知提示 -->
<template>
  <el-card shadow="never">
    <el-table :data="tableData" border stripe style="width: 100%">
      <el-table-column prop="courseName" label="课程名称" min-width="160" />
      <el-table-column label="考试类型" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.type === '期中' ? 'warning' : 'danger'">{{ row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="examDate" label="考试日期" width="130" align="center" />
      <el-table-column prop="examTime" label="考试时间" width="150" align="center" />
      <el-table-column prop="location" label="考试地点" width="140" />
      <el-table-column prop="room" label="考场" width="110" align="center" />
      <el-table-column prop="seat" label="座位号" width="90" align="center" />
    </el-table>

    <!-- 考试须知 -->
    <el-alert
      title="考试须知"
      type="info"
      show-icon
      :closable="false"
      style="margin-top: 16px"
    >
      <template #default>
        <ol class="notice-list">
          <li>请提前 15 分钟到达指定考场，凭学生证或一卡通入场，按座位号就座。</li>
          <li>除允许的文具外，书包、资料、手机等物品须放在考场指定位置，严禁随身携带。</li>
          <li>考试期间严禁使用任何通讯工具及电子设备，违者按作弊处理。</li>
          <li>开考 30 分钟后不得入场，开考 30 分钟内不得交卷出场。</li>
          <li>如有特殊情况需缓考，请提前向教务处提交书面申请并附相关证明。</li>
        </ol>
      </template>
    </el-alert>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'

// mock 考试安排数据
// TODO: 对接后端 考试安排查询接口
const tableData = ref([
  { courseName: '数据结构', type: '期中', examDate: '2025-11-10', examTime: '08:30 - 10:30', location: '教学楼A301', room: '第一考场', seat: 'A015' },
  { courseName: '高等数学', type: '期中', examDate: '2025-11-12', examTime: '14:00 - 16:00', location: '教学楼A101', room: '第三考场', seat: 'C022' },
  { courseName: '计算机网络', type: '期末', examDate: '2026-01-08', examTime: '08:30 - 10:30', location: '教学楼B205', room: '第二考场', seat: 'B008' },
  { courseName: '软件工程', type: '期末', examDate: '2026-01-10', examTime: '14:00 - 16:00', location: '教学楼C102', room: '第一考场', seat: 'A003' },
  { courseName: '大学英语', type: '期末', examDate: '2026-01-12', examTime: '10:00 - 12:00', location: '教学楼D301', room: '第四考场', seat: 'D011' }
])
</script>

<style scoped>
.notice-list {
  margin: 8px 0 0;
  padding-left: 18px;
  line-height: 1.9;
  color: #606266;
}
</style>
