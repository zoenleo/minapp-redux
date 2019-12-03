import { connect } from '../../libs/minapp-redux'
import { actions } from '../../store/index'

const stateMap = state => {
    const { user } = state
    return {
        userName: user.userInfo.userName
    }
}

const methodMap = (dispatch, state) => ({
    login(userName) {
        dispatch(actions.user.getUserInfo(userName))
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
