import { connectComponent } from '../../../../libs/minapp-redux'

const userInfo = {
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

const ConnectedComponent = connectComponent(state => {
    const { userInfo } = state
    return {
        hasLogin: userInfo.hasLogin,
        userName: userInfo.userName
    }
})(userInfo)

Component(ConnectedComponent)
