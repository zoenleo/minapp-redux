import { LOGIN } from './actionType'

const initialState = {
    hasLogin: false,
    userName: 'Tom'
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case LOGIN:
            console.warn('action', action)
            return Object.assign({}, state, {
                ...action.payload
            })
        default:
            return state
    }
}
