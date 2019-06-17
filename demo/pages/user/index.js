const app = getApp()
import { connect } from '../../libs/minapp-redux'

const UserPages = {
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

const ConnectPage = connect(state => {
    const { userInfo } = state
    return {
        hasLogin: userInfo.hasLogin,
        userName: userInfo.userName
    }
})(UserPages)

Page(ConnectPage)
