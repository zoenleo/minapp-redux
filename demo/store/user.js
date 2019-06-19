import { createModule } from '../utils/reduxUtils'
import { WeApi, CGI } from '../api/index'

export default createModule({
    name: 'user',
    initialState: {
        userInfo: {}
    },
    actions: {
        setPreCheck: v => v
    },
    asyncActions: actions => ({
        getPreCheck() {
            return function(dispatch, getState) {
                return WeApi.request({
                    cgi: CGI.preCheck
                }).then(
                    res => {
                        dispatch(actions.setPreCheck(res.ret_data))
                        return res
                    },
                    err => Promise.reject(err)
                )
            }
        }
    }),
    reducers: {
        setPreCheck(state, action) {
            return { ...state, preCheck: action.payload }
        }
    }
})
