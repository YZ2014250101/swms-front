# SWMS 系统 API 接口文档

> 前后端分离 · 后端 Spring Boot + JWT · 前端 Vue

---

## 通用说明

### Base URL

```
http://localhost:8080
```

### JWT 认证

除 `登录`、`注册`、`健康检查` 外，所有接口 **必须在请求头携带 JWT token**：

```
Authorization: Bearer <token>
```

token 在登录接口返回数据中的 `token` 字段获取，有效期 24 小时。

token 过期或无效时返回：

```json
{ "code": 401, "msg": "未登录或token已失效，请重新登录", "data": null }
```

### 统一返回格式

所有接口（文件下载除外）统一返回 `Result` 对象：

```json
{
  "code": 200,       // 200=成功, 400=业务失败, 401=未登录, 403=无权限, 500=系统异常
  "msg": "操作成功",  // 提示消息
  "data": {          // 业务数据（可能是对象、数组、null）
    "key": "value"
  }
}
```

### 参数传递方式

| 方式 | 说明 | Content-Type |
|------|------|-------------|
| Query 参数 | GET 请求拼接在 URL 上，POST 也可用 | - |
| 表单参数 | POST 请求，Spring 自动绑定到实体对象或基本类型 | `application/x-www-form-urlencoded` |
| JSON Body | 仅 `PUT /api/common/password/change` 使用 | `application/json` |
| 文件上传 | POST 请求带文件 | `multipart/form-data` |

---

## 一、通用接口

### 1.1 健康检查

| 方法 | URL | 参数 | 返回 data | 说明 |
|------|-----|------|-----------|------|
| GET | `/api/health` | 无 | `{status, service}` | 无需鉴权 |

### 1.2 修改密码（三角色共用）

| 方法 | URL | 参数 | 返回 data | 说明 |
|------|-----|------|-----------|------|
| PUT | `/api/common/password/change` | `JSON Body: {oldPassword, newPassword}` | `{msg}` | 后端根据 token 中的 role 自动判断角色 |

---

## 二、登录认证接口

### 2.1 学生

| 方法 | URL | 参数 | 返回 data | 说明 |
|------|-----|------|-----------|------|
| POST | `/api/student/doLogin` | `username`, `password` | `{token, role, userId, name, studentId}` | 登录成功返回 token |
| POST | `/api/student/doRegister` | `studentId`, `username`, `password`, `name`, `gender`, `major`, ... | `{msg}` | 注册 |
| GET | `/api/student/logout` | 无 | `{msg}` | 前端丢弃 token 即可 |
| GET | `/api/student/checkLogin` | 无（需带 token） | `{login, role, userId}` | 检查登录状态 |

### 2.2 教师

| 方法 | URL | 参数 | 返回 data | 说明 |
|------|-----|------|-----------|------|
| POST | `/api/teacher/doLogin` | `username`, `password` | `{token, role, userId, name, teacherId}` | 登录 |
| POST | `/api/teacher/doRegister` | `teacherId`, `username`, `password`, `name`, `department`, `title`, ... | `{msg}` | 注册 |
| GET | `/api/teacher/logout` | 无 | `{msg}` | 退出 |
| GET | `/api/teacher/checkLogin` | 无（需带 token） | `{login, role, userId}` | 检查登录 |

### 2.3 管理员

| 方法 | URL | 参数 | 返回 data | 说明 |
|------|-----|------|-----------|------|
| POST | `/api/admin/doLogin` | `username`, `password` | `{token, role, userId, name, adminId}` | 登录 |
| GET | `/api/admin/logout` | 无 | `{msg}` | 退出 |
| GET | `/api/admin/checkLogin` | 无（需带 token） | `{login, role, userId}` | 检查登录 |

---

## 三、学生端接口（`/api/student`）

### 3.1 个人信息

| 方法 | URL | 参数 | 返回 data | 说明 |
|------|-----|------|-----------|------|
| GET | `/api/student/myInfo` | 无 | `{studentId, name, gender, major}` | 个人信息 |

### 3.2 选课

| 方法 | URL | 参数 | 返回 data | 说明 |
|------|-----|------|-----------|------|
| GET | `/api/student/courseList` | 无 | `{courseList, globalSelectable, selectStartTime, selectEndTime, inSelectTimeRange}` | 全部课程列表 + 选课开关 |
| GET | `/api/student/selectCourse` | `courseId` | `{msg}` | 选课，失败返回 400 |
| GET | `/api/student/myCourse` | 无 | `{myCourseList, canDrop, dropHint?}` | 已选课程 |
| GET | `/api/student/dropCourse` | `courseId` | `{msg}` | 退课 |

### 3.3 公告

| 方法 | URL | 参数 | 返回 data | 说明 |
|------|-----|------|-----------|------|
| GET | `/api/student/announcementList` | 无 | `{announcementList, tab}` | 全部公告 |
| GET | `/api/student/courseAnnouncementList` | 无 | `{announcementList, myCourses, tab}` | 课程公告 |
| GET | `/api/student/announcementDetail` | `id` | `{announcement}` | 公告详情 |

### 3.4 成绩

| 方法 | URL | 参数 | 返回 data | 说明 |
|------|-----|------|-----------|------|
| GET | `/api/student/gradeList` | 无 | `{gradeList, gpaInfo, allGrades}` | 已发布成绩 + GPA |
| GET | `/api/student/gradeHistory` | 无 | `{gradeList, gpaInfo}` | 全部成绩历史 |
| GET | `/api/student/exportGrade` | 无 | **文件下载** | 导出 CSV 成绩单 |
| GET | `/api/student/toAppeal` | `gradeId` | `{grade}` | 申诉页数据 |
| POST | `/api/student/submitAppeal` | `gradeId`, `appealReason` | `{msg}` | 提交申诉 |

### 3.5 考勤

| 方法 | URL | 参数 | 返回 data | 说明 |
|------|-----|------|-----------|------|
| GET | `/api/student/myAttendance` | 无 | `{attendanceList, stats}` | 考勤记录 + 统计 |
| GET | `/api/student/attendanceStats` | 无 | `{stats, courseStats, attendanceList}` | 分课程考勤统计 |

### 3.6 作业

| 方法 | URL | 参数 | 返回 data | 说明 |
|------|-----|------|-----------|------|
| GET | `/api/student/myHomework` | 无 | `{courseList}` | 我的课程列表 |
| GET | `/api/student/homeworkByCourse` | `courseId` | `{course, homeworkList}` | 课程作业列表 |
| GET | `/api/student/homeworkDetail` | `homeworkId` | `{homework, submission}` | 作业详情 + 提交状态 |
| GET | `/api/student/submitHomework` | `homeworkId` | `{homework, submission, isOverdue}` | 提交作业页数据 |
| POST | `/api/student/doSubmitHomework` | `homeworkId`, `content`(可选), `file`(可选,文件) | `{msg}` | 提交/重新提交作业 |
| GET | `/api/student/downloadHomework` | `homeworkId` | **文件下载** | 下载作业附件 |

### 3.7 考试

| 方法 | URL | 参数 | 返回 data | 说明 |
|------|-----|------|-----------|------|
| GET | `/api/student/examScheduleList` | 无 | `{examList}` | 考试安排 |
| GET | `/api/student/examScheduleByDate` | `examDate`(可选) | `{examList, examDate}` | 按日期筛选 |

### 3.8 课表

| 方法 | URL | 参数 | 返回 data | 说明 |
|------|-----|------|-----------|------|
| GET | `/api/student/mySchedule` | `week`(可选) | `{sectionTimeMap, scheduleMap, validWeeks, currentWeek, autoSwitched, hasSchedules, weekScheduleCount, maxWeek, selectedCourses}` | 个人课表网格 |

### 3.9 学习中心（`/api/student/study`）

| 方法 | URL | 参数 | 返回 data | 说明 |
|------|-----|------|-----------|------|
| GET | `/api/student/study/timetable` | 无 | `{scheduleList}` | 课表列表 |
| GET | `/api/student/study/courseDetail` | `courseId` | `{course, scheduleList, fileList}` | 课程详情 + 资料 |
| GET | `/api/student/study/download` | `fileId` | **文件下载** | 下载课程资料 |

---

## 四、教师端接口（`/api/teacher`）

### 4.1 个人信息

| 方法 | URL | 参数 | 返回 data | 说明 |
|------|-----|------|-----------|------|
| GET | `/api/teacher/myInfo` | 无 | `{name, teacherId, department, title}` | 个人信息 |

### 4.2 学生管理

| 方法 | URL | 参数 | 返回 data | 说明 |
|------|-----|------|-----------|------|
| GET | `/api/teacher/myCourse` | 无 | `{courseList}` | 我的授课列表 |
| GET | `/api/teacher/studentList` | `courseId` | `{studentList, course}` | 选课学生名单 |
| POST | `/api/teacher/addStudent` | `Student`(表单: studentId, name, gender, major, ...) | `{msg}` | 新增学生 |
| GET | `/api/teacher/toEdit` | `id` | `{stu}` | 学生编辑回显 |
| POST | `/api/teacher/update` | `Student`(表单: id, name, gender, ...) | `{msg}` | 更新学生信息 |
| GET | `/api/teacher/deleteStudent` | `studentId`, `courseId` | `{msg}` | 从课程中移除学生 |
| POST | `/api/teacher/addStudentToCourse` | `courseId`, `studentNo` | `{msg}` | 按学号添加学生到课程 |

### 4.3 公告管理

| 方法 | URL | 参数 | 返回 data | 说明 |
|------|-----|------|-----------|------|
| GET | `/api/teacher/myAnnouncementList` | 无 | `{announcementList}` | 我发布的公告 |
| POST | `/api/teacher/addAnnouncement` | `Announcement`(表单: title, content, courseId, ...) | `{msg}` | 发布公告 |
| POST | `/api/teacher/updateAnnouncement` | `Announcement`(表单: id, title, content, ...) | `{msg}` | 修改公告 |
| GET | `/api/teacher/deleteAnnouncement` | `id` | `{msg}` | 删除公告 |
| GET | `/api/teacher/announcementDetail` | `id` | `{announcement}` | 公告详情 |

### 4.4 成绩管理

| 方法 | URL | 参数 | 返回 data | 说明 |
|------|-----|------|-----------|------|
| GET | `/api/teacher/studentListForGrade` | `courseId` | `{studentList, course, gradeInputAllowed, gradeInputMsg}` | 成绩录入页数据 |
| GET | `/api/teacher/gradeInput` | `courseId` | `{studentList, course, gradeList, gradeInputAllowed, gradeInputMsg}` | 成绩录入（含权限校验） |
| POST | `/api/teacher/saveGrade` | `Grade`(表单: studentId, courseId, dailyScore, finalScore) | `{msg}` | 保存单个成绩 |
| POST | `/api/teacher/batchSaveGrade` | `studentIds`(数组), `courseId`, `dailyScores`(数组,可选), `finalScores`(数组,可选) | `{msg}` | 批量保存成绩 |
| GET | `/api/teacher/publishGrade` | `id` | `{msg, grade}` | 发布成绩 |
| POST | `/api/teacher/batchPublishGrade` | `ids`(数组), `courseId`(可选) | `{msg}` | 批量发布成绩 |
| GET | `/api/teacher/deleteGrade` | `id` | `{msg}` | 删除成绩 |
| GET | `/api/teacher/exportStudentList` | `courseId` | **文件下载** | 导出学生名单 CSV |
| GET | `/api/teacher/exportGrade` | `courseId` | **文件下载** | 导出成绩 CSV |
| GET | `/api/teacher/downloadGradeTemplate` | 无 | **文件下载** | 下载成绩导入模板 |
| POST | `/api/teacher/importGrade` | `file`(文件), `courseId` | `{msg}` | 导入成绩 |

### 4.5 成绩申诉与审核

| 方法 | URL | 参数 | 返回 data | 说明 |
|------|-----|------|-----------|------|
| GET | `/api/teacher/gradeReviewList` | 无 | `{gradeList}` | 待审核成绩列表 |
| GET | `/api/teacher/appealList` | 无 | `{appealList}` | 申诉列表 |
| POST | `/api/teacher/handleAppeal` | `id`, `appealStatus`, `appealReason` | `{msg}` | 处理申诉 |
| GET | `/api/teacher/rejectGrade` | `id`, `rejectReason` | `{msg}` | 驳回成绩 |
| GET | `/api/teacher/gradeStats` | `courseId` | `{stats}` | 成绩统计 |
| GET | `/api/teacher/gradeManagement` | 无 | `{courseList}` | 成绩管理首页 |

### 4.6 考勤管理

| 方法 | URL | 参数 | 返回 data | 说明 |
|------|-----|------|-----------|------|
| GET | `/api/teacher/attendanceManagement` | 无 | `{courseList}` | 考勤管理首页 |
| GET | `/api/teacher/attendanceCheck` | `courseId` | `{studentList, course, attendanceList}` | 考勤点名页 |
| POST | `/api/teacher/saveAttendance` | `Attendance`(表单: studentId, courseId, attendanceDate, status) | `{msg}` | 保存单条考勤 |
| POST | `/api/teacher/batchSaveAttendance` | `studentIds`(数组), `courseId`, `attendanceDate`, `statuses`(数组,可选) | `{msg}` | 批量保存考勤 |
| GET | `/api/teacher/editAttendance` | `id` | `{attendance}` | 考勤编辑回显 |
| POST | `/api/teacher/updateAttendance` | `Attendance`(表单: id, status, ...) | `{msg}` | 修改考勤 |
| GET | `/api/teacher/deleteAttendance` | `id` | `{msg}` | 删除考勤 |
| GET | `/api/teacher/attendanceStats` | `courseId` | `{stats, attendanceList}` | 考勤统计 |
| GET | `/api/teacher/exportAttendance` | `courseId` | **文件下载** | 导出考勤 CSV |

### 4.7 作业管理

| 方法 | URL | 参数 | 返回 data | 说明 |
|------|-----|------|-----------|------|
| GET | `/api/teacher/homeworkManagement` | 无 | `{courseList}` | 作业管理首页 |
| GET | `/api/teacher/homeworkList` | `courseId` | `{homeworkList, course}` | 课程作业列表 |
| POST | `/api/teacher/saveHomework` | `Homework`(表单: courseId, title, content, deadline, ...), `attachment`(可选,文件) | `{msg}` | 发布作业 |
| POST | `/api/teacher/updateHomework` | `Homework`(表单: id, title, content, ...), `attachment`(可选,文件) | `{msg}` | 修改作业 |
| GET | `/api/teacher/deleteHomework` | `id` | `{msg}` | 删除作业 |
| GET | `/api/teacher/downloadHomeworkAttachment` | `id` | **文件下载** | 下载作业附件 |
| GET | `/api/teacher/homeworkSubmissions` | `homeworkId` | `{submissionList, homework}` | 学生提交列表 |
| POST | `/api/teacher/saveHomeworkGrade` | `submissionId`, `score`, `comment` | `{msg, homeworkId}` | 批改作业 |
| GET | `/api/teacher/downloadSubmission` | `submissionId` | **文件下载** | 下载学生提交的作业 |

---

## 五、管理员端接口（`/api/admin`）

### 5.1 个人信息

| 方法 | URL | 参数 | 返回 data | 说明 |
|------|-----|------|-----------|------|
| GET | `/api/admin/myInfo` | 无 | `{name, adminId, ...}` | 管理员信息 |

### 5.2 学生管理

| 方法 | URL | 参数 | 返回 data | 说明 |
|------|-----|------|-----------|------|
| GET | `/api/admin/studentList` | 无 | `{studentList}` | 全部学生列表 |
| POST | `/api/admin/addStudent` | `Student`(表单: studentId, username, password, name, ...) | `{msg}` | 新增学生 |
| GET | `/api/admin/toEdit` | `id` | `{stu}` | 学生编辑回显 |
| POST | `/api/admin/update` | `Student`(表单: id, ...) | `{msg}` | 更新学生 |
| GET | `/api/admin/updateStuStatus` | `id`, `status` | `{msg}` | 启用/禁用学生 |
| GET | `/api/admin/resetStuPwd` | `id` | `{msg}` | 重置学生密码 |
| GET | `/api/admin/delete` | `id` | `{msg}` | 删除学生 |
| POST | `/api/admin/importStudent` | `file`(文件) | `{msg}` | 批量导入学生 |

### 5.3 教师管理

| 方法 | URL | 参数 | 返回 data | 说明 |
|------|-----|------|-----------|------|
| GET | `/api/admin/teacherList` | 无 | `{teacherList}` | 全部教师列表 |
| POST | `/api/admin/addTeacher` | `teacherId`, `username`, `password`, `name`, `age`, `gender`, `department`, `title` | `{msg}` | 新增教师 |
| GET | `/api/admin/toEditTea` | `id` | `{tea}` | 教师编辑回显 |
| POST | `/api/admin/updateTea` | `Teacher`(表单: id, ...) | `{msg}` | 更新教师 |
| GET | `/api/admin/updateTeaStatus` | `id`, `status` | `{msg}` | 启用/禁用教师 |
| GET | `/api/admin/resetTeaPwd` | `id` | `{msg}` | 重置教师密码 |

### 5.4 课程管理

| 方法 | URL | 参数 | 返回 data | 说明 |
|------|-----|------|-----------|------|
| GET | `/api/admin/courseList` | 无 | `{courseList}` | 全部课程列表 |
| GET | `/api/admin/toAddCourse` | 无 | `{teacherList}` | 新增课程页数据 |
| POST | `/api/admin/addCourse` | `courseNo`, `courseName`, `teacherId`, `credit`, `maxNum`, `weekDay`, `startSection`, `endSection`, `classroom`, `weekRange` | `{msg}` | 新增课程 |
| GET | `/api/admin/toggleSelectable` | `id`, `selectable` | `{msg}` | 开关单课程选课 |
| GET | `/api/admin/toggleGlobalSelectable` | `enabled` | `{msg}` | 全局选课开关 |
| GET | `/api/admin/toSetSelectTime` | 无 | `{selectStartTime, selectEndTime, globalSelectable}` | 选课时间设置页 |
| POST | `/api/admin/setSelectTime` | `startTime`, `endTime` | `{msg}` | 设置选课时间段 |
| GET | `/api/admin/clearSelectTime` | 无 | `{msg}` | 清空选课时间 |
| GET | `/api/admin/toSetExamTime` | `id` | `{course}` | 考试时间设置页 |
| POST | `/api/admin/saveExamTime` | `id`, `examStartTime`, `examEndTime` | `{msg}` | 保存考试时间 |

### 5.5 学期管理

| 方法 | URL | 参数 | 返回 data | 说明 |
|------|-----|------|-----------|------|
| GET | `/api/admin/semesterList` | 无 | `{semesterList}` | 学期列表 |
| POST | `/api/admin/addSemester` | `Semester`(表单: name, startDate, endDate, ...) | `{msg}` | 新增学期 |
| GET | `/api/admin/toEditSemester` | `id` | `{semester}` | 学期编辑回显 |
| POST | `/api/admin/updateSemester` | `Semester`(表单: id, ...) | `{msg}` | 更新学期 |
| GET | `/api/admin/deleteSemester` | `id` | `{msg}` | 删除学期 |
| GET | `/api/admin/setCurrentSemester` | `id` | `{msg}` | 设为当前学期 |
| GET | `/api/admin/updateSemesterStatus` | `id`, `status` | `{msg}` | 更新学期状态 |
| GET | `/api/admin/toggleGradeInput` | `id`, `enabled` | `{msg}` | 开关成绩录入 |

### 5.6 考试安排管理

| 方法 | URL | 参数 | 返回 data | 说明 |
|------|-----|------|-----------|------|
| GET | `/api/admin/examScheduleList` | 无 | `{examList}` | 考试安排列表 |
| GET | `/api/admin/examScheduleByDate` | `examDate`(可选) | `{examList, examDate}` | 按日期筛选 |
| GET | `/api/admin/toAddExamSchedule` | 无 | `{courseList, semesterList}` | 新增考试页数据 |
| POST | `/api/admin/addExamSchedule` | `ExamSchedule`(表单: courseId, examDate, startTime, endTime, classroom, ...) | `{msg}` | 新增考试安排 |
| GET | `/api/admin/toEditExamSchedule` | `id` | `{examSchedule, courseList}` | 编辑回显 |
| POST | `/api/admin/updateExamSchedule` | `ExamSchedule`(表单: id, ...) | `{msg}` | 更新考试安排 |
| GET | `/api/admin/deleteExamSchedule` | `id` | `{msg}` | 删除考试安排 |
| POST | `/api/admin/batchDeleteExamSchedule` | `ids`(数组) | `{msg}` | 批量删除 |
| GET | `/api/admin/exportExamSchedule` | 无 | **文件下载** | 导出考试安排 CSV |

### 5.7 公告管理

| 方法 | URL | 参数 | 返回 data | 说明 |
|------|-----|------|-----------|------|
| GET | `/api/admin/announcementList` | 无 | `{announcementList}` | 公告列表 |
| GET | `/api/admin/announcementSearch` | `categoryId`(可选), `status`(可选), `keyword`(可选) | `{announcementList, categoryList, categoryId, status, keyword}` | 搜索公告 |
| GET | `/api/admin/toAddAnnouncement` | 无 | `{categoryList, courseList}` | 新增公告页数据 |
| POST | `/api/admin/addAnnouncement` | `Announcement`(表单: title, content, categoryId, ...) | `{msg}` | 发布公告 |
| GET | `/api/admin/toEditAnnouncement` | `id` | `{announcement, categoryList, courseList}` | 编辑回显 |
| POST | `/api/admin/updateAnnouncement` | `Announcement`(表单: id, ...) | `{msg}` | 修改公告 |
| GET | `/api/admin/deleteAnnouncement` | `id` | `{msg}` | 删除公告 |
| POST | `/api/admin/batchDeleteAnnouncement` | `ids`(数组) | `{msg}` | 批量删除 |
| GET | `/api/admin/topAnnouncement` | `id` | `{msg}` | 置顶 |
| GET | `/api/admin/cancelTopAnnouncement` | `id` | `{msg}` | 取消置顶 |
| GET | `/api/admin/offlineAnnouncement` | `id` | `{msg}` | 下架 |
| GET | `/api/admin/onlineAnnouncement` | `id` | `{msg}` | 上架 |

### 5.8 公告审核

| 方法 | URL | 参数 | 返回 data | 说明 |
|------|-----|------|-----------|------|
| GET | `/api/admin/announcementReviewList` | 无 | `{announcementList}` | 待审核列表 |
| GET | `/api/admin/approveAnnouncement` | `id` | `{msg}` | 审核通过 |
| GET | `/api/admin/toRejectAnnouncement` | `id` | `{announcement}` | 驳回回显 |
| POST | `/api/admin/rejectAnnouncement` | `id`, `rejectReason` | `{msg}` | 驳回公告 |

### 5.9 公告分类管理

| 方法 | URL | 参数 | 返回 data | 说明 |
|------|-----|------|-----------|------|
| GET | `/api/admin/announcementCategoryList` | 无 | `{categoryList}` | 分类列表 |
| POST | `/api/admin/addAnnouncementCategory` | `AnnouncementCategory`(表单: name, ...) | `{msg}` | 新增分类 |
| GET | `/api/admin/toEditAnnouncementCategory` | `id` | `{category}` | 编辑回显 |
| POST | `/api/admin/updateAnnouncementCategory` | `AnnouncementCategory`(表单: id, ...) | `{msg}` | 更新分类 |
| GET | `/api/admin/deleteAnnouncementCategory` | `id` | `{msg}` | 删除分类 |
| GET | `/api/admin/toggleAnnouncementCategoryStatus` | `id` | `{msg}` | 切换分类状态 |

### 5.10 院系管理

| 方法 | URL | 参数 | 返回 data | 说明 |
|------|-----|------|-----------|------|
| GET | `/api/admin/departmentList` | 无 | `{deptList}` | 院系列表 |
| POST | `/api/admin/addDepartment` | `Department`(表单: name, ...) | `{msg}` | 新增院系 |
| GET | `/api/admin/toEditDepartment` | `id` | `{department}` | 编辑回显 |
| POST | `/api/admin/updateDepartment` | `Department`(表单: id, ...) | `{msg}` | 更新院系 |
| GET | `/api/admin/deleteDepartment` | `id` | `{msg}` | 删除院系 |

### 5.11 专业管理

| 方法 | URL | 参数 | 返回 data | 说明 |
|------|-----|------|-----------|------|
| GET | `/api/admin/majorList` | 无 | `{majorList, deptList}` | 专业列表 |
| GET | `/api/admin/toAddMajor` | 无 | `{deptList}` | 新增专业页数据 |
| POST | `/api/admin/addMajor` | `Major`(表单: name, departmentId, ...) | `{msg}` | 新增专业 |
| GET | `/api/admin/toEditMajor` | `id` | `{major, deptList}` | 编辑回显 |
| POST | `/api/admin/updateMajor` | `Major`(表单: id, ...) | `{msg}` | 更新专业 |
| GET | `/api/admin/deleteMajor` | `id` | `{msg}` | 删除专业 |

### 5.12 班级管理

| 方法 | URL | 参数 | 返回 data | 说明 |
|------|-----|------|-----------|------|
| GET | `/api/admin/classList` | 无 | `{classList, majorList, teacherList}` | 班级列表 |
| GET | `/api/admin/toAddClass` | 无 | `{deptList, majorList, teacherList}` | 新增班级页数据 |
| POST | `/api/admin/addClass` | `ClassInfo`(表单: name, majorId, teacherId, ...) | `{msg}` | 新增班级 |
| GET | `/api/admin/toEditClass` | `id` | `{classInfo, deptList, majorList, teacherList}` | 编辑回显 |
| POST | `/api/admin/updateClass` | `ClassInfo`(表单: id, ...) | `{msg}` | 更新班级 |
| GET | `/api/admin/deleteClass` | `id` | `{msg}` | 删除班级 |

### 5.13 数据统计

| 方法 | URL | 参数 | 返回 data | 说明 |
|------|-----|------|-----------|------|
| GET | `/api/admin/statistics` | 无 | `{studentCount, teacherCount, courseCount, selectionRate}` | 首页统计 |

### 5.14 系统日志

| 方法 | URL | 参数 | 返回 data | 说明 |
|------|-----|------|-----------|------|
| GET | `/api/admin/systemLogList` | 无 | `{logList}` | 系统日志列表 |
| GET | `/api/admin/cleanSystemLog` | 无 | `{msg}` | 清空日志 |

### 5.15 系统设置

| 方法 | URL | 参数 | 返回 data | 说明 |
|------|-----|------|-----------|------|
| GET | `/api/admin/systemSettings` | 无 | `{config}` | 获取系统配置 |
| POST | `/api/admin/saveSystemSettings` | `SystemConfig`(表单: ...) | `{msg}` | 保存系统配置 |

### 5.16 流量统计

| 方法 | URL | 参数 | 返回 data | 说明 |
|------|-----|------|-----------|------|
| GET | `/api/admin/visitStats` | 无 | `{totalVisits, todayVisits, weekVisits, monthVisits, yearVisits, hourlyStats, dailyStats, monthlyStats, yearlyStats}` | 访问统计 |
| GET | `/api/admin/userVisitLog` | `userId`(可选), `role`(可选) | `{visitLogs, searchUserId, searchRole}` | 用户访问日志 |

---

## 附录：返回码说明

| code | 含义 |
|------|------|
| 200 | 操作成功 |
| 400 | 业务失败（如密码错误、参数校验失败等） |
| 401 | 未登录或 token 已失效 |
| 403 | 无权限 |
| 500 | 系统异常 |
