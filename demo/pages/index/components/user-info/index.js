//index.js
//获取应用实例
import { connectComponent } from '../../../../libs/minapp-redux'

const stateMap = state => {
    const { userInfo } = state
    return {
        hasLogin: userInfo.hasLogin,
        userName: userInfo.userName
    }
}

const component = {
    data: {},
    lifetimes: {
        attached() {
            console.warn('component attached')
        }
    },
    detached() {
        console.warn('component detached')
    }
}

Component(connectComponent(stateMap)(component))
