<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
  #app {
    font-family: '微软雅黑', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 100%;
    height: 100%;
    //  ui框架样式补丁
    .mu-expansion-panel-container{
      padding:0;
    }
  }
  *{
    margin: 0;padding: 0;
  }
  html,body{
    width: 100%;
    height: 100%;
  }
</style>
