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
