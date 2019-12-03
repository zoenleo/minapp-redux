//index.js
//获取应用实例
import { connectComponent } from '../../../../libs/minapp-redux'

const stateMap = state => {
    const { user } = state
    return {
        userName: user.userInfo.userName
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
