<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
  *{
    margin: 0;padding: 0;
  }
  html,body{
    width: 100%;
    height: 100%;
  }
  #app {
    font-family: '微软雅黑', Helvetica, Arial, sans-serif;
    width: 100%;
    height: 100%;
    //  ui框架样式补丁
    .mu-expansion-panel-container{
      padding:0;
    }
  }
  .mu-expansion-panel-content{
    padding: 0 !important;
  }
</style>
