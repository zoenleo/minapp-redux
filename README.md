# minapp-redux - 微信小程序 redux 支持库

## 使用 100 行代码，你就可以拥有：

-   完整 redux 支持（模块化、异步数据流流、强大的生态）🔥🔥

-   原生 page 对象结构的 connect,类似 react-redux（较低的学习成本、便捷的移植方案）🔥🔥

-   最小的 diff 更新 🔥🔥

## 实现理念

-   为什么是 redux

redux 作为一个最好的 flux 最好的实现之一，他拥有庞大的社区支持与完善的插件支持。并且相对于 vuex 的定制化，redux 作为一个极简的状态管理系统（通过插件实现定制化），天生有易于移植、适用于任何框架的基因。事实上，本文介绍的`minapp-redux`也可以归属于 redux 的定制化插件之一。

-   状态如何映射到视图

小程序框架没有类似 react 的 props 语法，并且由于桥接语法的存在，使得 JS 层只有 data 数据才能 map 到 wxml。所以`minapp-redux`的 connect 语法会将第一参数`(stateMapFunction)`返回的对象并入 page 对象定义的 data 中，使用是需要注意不能有属性重名，否则会有告警：stateMap 数据会覆盖 page 对象中定义的重名 data 属性。

-   运行时

由于小程序规范，data 中的数据必须在初始化 page 对象时存在，`minapp-redux`提供的 connect 语法会在小程序初始化时调用，使用`Page(connect(stateMapFun, methodMapFun)(pageObject))`语法，pageObject 保持了你原本 page 对象的完整性，便于项目移植或移除`minapp-redux`。在后续 redux 状态改变的时候，redux api `subscribe`监听状态变化，并通过保存 store 实例使用 setData 更新到视图。

-   最小的 diff 更新

`minapp-redux`使用了专属于小程序的 diff 更新机制，在有属性变化的时候会比较新 store 返回的 stateMap 与 page 对象中当前 data 的属性，并且抽取出变化属性的集合（丢弃相同值的属性），保证最小粒度的更新。值得注意的一点是，有时候我们会使用特别复杂的 store 对象作为 map 属性，而对这些复杂对象的 diff 对比会带来比较大的开销，所以`minapp-redux`使用<b>浅比较</b>，当遇到 map 数据类型为 Object 时，会将整个对象直接赋值更新。

-   完整的 Redux 支持

前面说过`minapp-redux`只是作为一个 redux 的定制化插件存在，它没有改变任何的 redux 原有功能，任何你需要用到的无浏览器支持的 redux 插件你都可以无缝使用到把你的`minapp-redux`项目中，例如：redux-logger、redux-thunk 等等。你也可以基于自己对 redux 的理解实现自己的模块化管理 redux，例如我 github 项目中的 demo，使用 reduxUtils 模块化封装 redux。

## 使用

#### 引入

-   npm 构建

`npm install minapp-redux --save`

-   直接引入

复制项目 src 文件夹下 index.js 到项目中

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

#### 注入 redux

```js
// app.js
import { use } from 'minapp-redux'

// redux Store
import Store from '../../store/index'

//inject Store
use(Store)

App({
    onLaunch() {},
})
```

#### page 连接

```js
// pages/login/index.js
import { connect } from '../../libs/minapp-redux'
import * as Actions from '../../store/userInfo/actions.js'

const stateMap = (state) => {
    const { userInfo } = state
    return {
        hasLogin: userInfo.hasLogin,
        userName: userInfo.userName,
    }
}

const methodMap = (dispatch, state) => ({
    login(userName) {
        dispatch(
            Actions.login({
                hasLogin: true,
                userName,
            })
        )
    },
})

const page = {
    data: {
        username: '',
    },
    bindUserNameChange(e) {
        this.setData({
            username: e.detail.value,
        })
    },
    bindLogin() {
        if (!this.data.username) return
        this.login(this.data.username)
        wx.navigateBack({
            delta: 1,
        })
    },
}

Page(connect(stateMap, methodMap)(page))
```

更具体使用可查看[demo](https://github.com/zoenleo/minapp-redux/tree/master/demo)

```

```
