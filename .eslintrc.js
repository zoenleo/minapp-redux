module.exports = {
  "env": { //脚本目标的运行环境
      "es6": true,
      "commonjs": true
  },
  "parser": "babel-eslint",
  //全局变量
  "globals": {
      "__DEV__": true,
      "__WECHAT__": true,
      "__ALIPAY__": true,
      "App": true,
      "Page": true,
      "Component": true,
      "Behavior": true,
      "wx": true,
      "getApp": true,
  },
  "extends": [
      "prettier",
      "prettier/standard"
  ],
  //插件
  "plugins": [
      "prettier",
  ],
  //规则
  "rules": {
      "prettier/prettier": "error",
  }
}
