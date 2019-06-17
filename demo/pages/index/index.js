import { connect } from '../../libs/minapp-redux'

const stateMap = state => {
    const { userInfo } = state
    return {
        hasLogin: userInfo.hasLogin,
        userName: userInfo.userName
    }
}

const page = {
    data: {}
}

Page(connect(stateMap)(page))
