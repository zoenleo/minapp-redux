# minapp-redux - 微信小程序redux支持库

## 使用100行代码，你就可以拥有：

+ 完整redux支持（模块化、异步数据流流、强大的生态）🔥🔥

+ 原生page对象结构的connect,类似react-redux（较低的学习成本、便捷的移植方案）🔥🔥

+ 最小的diff更新 🔥🔥

+ 理论上可以实现时间旅行，但是微信开发者工具不支持

## 实现理念

+ 为什么是redux

redux作为一个最好的flux最好的实现之一，他拥有庞大的社区支持与完善的插件支持。并且相对于vuex的定制化，redux作为一个极简的状态管理系统（通过插件实现定制化），天生有易于移植、适用于任何框架的基因。事实上，本文介绍的`minapp-redux`也可以归属于redux的定制化插件之一。

+ 状态如何映射到视图

 小程序框架没有类似react的props语法，并且由于桥接语法的存在，使得JS层只有data数据才能map到wxml。所以`minapp-redux`的connect语法会将第一参数`(stateMapFunction)`返回的对象并入page对象定义的data中，使用是需要注意不能有属性重名，否则会有告警：stateMap数据会覆盖page对象中定义的重名data属性。
 
+ 运行时

由于小程序规范，data中的数据必须在初始化page对象时存在，`minapp-redux`提供的connect语法会在小程序初始化时调用，使用`Page(connect(stateMapFun, methodMapFun)(pageObject))`语法，pageObject保持了你原本page对象的完整性，便于项目移植或移除`minapp-redux`。在后续redux状态改变的时候，redux api `subscribe`监听状态变化，并通过保存store实例使用setData更新到视图。

+ 最小的diff更新

`minapp-redux`使用了专属于小程序的diff更新机制，在有属性变化的时候会比较新store返回的stateMap与page对象中当前data的属性，并且抽取出变化属性的集合（丢弃相同值的属性），保证最小粒度的更新。值得注意的一点是，有时候我们会使用特别复杂的store对象作为map属性，而对这些复杂对象的diff对比会带来比较大的开销，所以`minapp-redux`使用<b>浅比较</b>，当遇到map数据类型为Object时，会将整个对象直接赋值更新。

+ 完整的Redux支持

前面说过`minapp-redux`只是作为一个redux的定制化插件存在，它没有改变任何的redux原有功能，任何你需要用到的无浏览器支持的redux插件你都可以无缝使用到把你的`minapp-redux`项目中，例如：redux-logger、redux-thunk等等。你也可以基于自己对redux的理解实现自己的模块化管理redux，例如我github项目中的demo，使用reduxUtils模块化封装redux。

## 使用

#### 引入

+ npm构建

`npm install minapp-redux --save`

+ 直接引入

复制项目src文件夹下index.js到项目中

#### API

```
const { use, connect, connectComponent } = require(' minapp-redux')

 /**
 * use
 * @param {Object} Store
 */

/**
* connect
* @param {Function} mapStateToData
* @param {Function} mapMethodToPage
* @return {Function}
*/

/**
 * connectComponent
 * @param {Function} mapStateToData
 * @param {Function} mapMethodToPage
 * @return {Function}
 */

```

#### use

#### 注入redux
```js
// app.js
import { use } from 'minapp-redux'

// redux Store
import Store from '../../store/index'

//inject Store
use(Store)

App({
    onLaunch() {}
})

```
#### page连接
```js
// pages/login/index.js
import { connect } from '../../libs/minapp-redux'
import * as Actions from '../../store/userInfo/actions.js'

const stateMap = state => {
    const { userInfo } = state
    return {
        hasLogin: userInfo.hasLogin,
        userName: userInfo.userName
    }
}

const methodMap = (dispatch, state) => ({
    login(userName) {
        dispatch(
            Actions.login({
                hasLogin: true,
                userName
            })
        )
    }
})

const page = {
    data: {
        username: ''
    },
    bindUserNameChange(e) {
        this.setData({
            username: e.detail.value
        })
    },
    bindLogin() {
        if (!this.data.username) return
        this.login(this.data.username)
        wx.navigateBack({
            delta: 1
        })
    }
}

Page(
    connect(
        stateMap,
        methodMap
    )(page)
)

```

更具体使用可查看[demo](https://github.com/zoenleo/minapp-redux/tree/master/demo)

```
