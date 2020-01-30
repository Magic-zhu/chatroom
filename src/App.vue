<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}
html,
body {
  width: 100%;
  height: 100%;
}
#app {
  font-family: "微软雅黑", Helvetica, Arial, sans-serif;
  width: 100%;
  height: 100%;
  //  ui框架样式补丁
  .mu-expansion-panel-container {
    padding: 0;
  }
}
.mu-expansion-panel-content {
  padding: 0 !important;
}
.w-e-text-container {
  height: 97px !important; /*!important是重点，因为原div是行内样式设置的高度300px*/
}
//  muse ui 图标不显示的补丁
@font-face {
  font-family: "Material Icons";
  font-style: normal;
  font-weight: 400;
  src: url(http://cdn.bootcss.com/material-design-icons/3.0.1/iconfont/MaterialIcons-Regular.eot); /* For IE6-8 */
  src: local("Material Icons"), local("MaterialIcons-Regular"),
    url(http://cdn.bootcss.com/material-design-icons/3.0.1/iconfont/MaterialIcons-Regular.woff2)
      format("woff2"),
    url(http://cdn.bootcss.com/material-design-icons/3.0.1/iconfont/MaterialIcons-Regular.woff)
      format("woff"),
    url(http://cdn.bootcss.com/material-design-icons/3.0.1/iconfont/MaterialIcons-Regular.ttf)
      format("truetype");
}

.material-icons {
  font-family: "Material Icons";
  font-weight: normal;
  font-style: normal;
  font-size: 24px; /* Preferred icon size */
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;

  /* Support for all WebKit browsers. */
  -webkit-font-smoothing: antialiased;
  /* Support for Safari and Chrome. */
  text-rendering: optimizeLegibility;

  /* Support for Firefox. */
  -moz-osx-font-smoothing: grayscale;

  /* Support for IE. */
  font-feature-settings: "liga";
}
</style>
