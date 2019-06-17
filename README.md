# minapp-redux
原生小程序使用redux支持库，类react-redux api。

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

```js
// app.js
import { use } from 'minapp-redux'

// redux store
import Store from '../../store/index'

use(Store)

App({
    onLaunch() {}
})

```

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