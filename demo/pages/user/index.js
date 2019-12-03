import { connect } from '../../libs/minapp-redux'

const stateMap = state => {
    const { user } = state
    return {
        userName: user.userInfo.userName
    }
}

const page = {
    onLoad() {
        console.warn('page load')
    },
    onShow() {},
    onUnload() {
        console.warn('page unload')
    },
    bindLogin() {
        wx.navigateTo({
            url: '../login/index'
        })
    }
}

Page(connect(stateMap)(page))
