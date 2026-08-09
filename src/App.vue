<template>
  <!-- 顶部导航菜单 -->
  <nav class="nav-bar">
    <!-- router-link 代替a标签，点击不会整页刷新 -->
    <router-link to="/myinfo">个人信息</router-link>
    <router-link to="/schedule">我的课表</router-link>
  </nav>

  <!-- 路由出口：匹配到的页面在这里渲染 -->
  <router-view></router-view>
</template>

<script setup>
// 无需写代码
</script>

<style scoped>
.nav-bar {
  background-color: #165DFF;
  padding: 16px 30px;
  display: flex;
  gap: 30px;
}
.nav-bar a {
  color: #fff;
  text-decoration: none;
  font-size: 16px;
}
/* 当前激活的菜单高亮 */
.nav-bar a.router-link-active {
  border-bottom: 3px solid #fff;
}
</style>