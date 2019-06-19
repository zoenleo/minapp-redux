# minapp-redux - 微信小程序redux支持库
> 最新版本redux支持（模块化、异步数据流）、类react-redux api（易于移植、学习成本低）、连接原生小程序（更优的状态管理方案）、diff比对（高性能）！

## 使用

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