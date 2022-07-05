import { createStore, combineReducers, applyMiddleware } from '../libs/redux'
import thunk from '../libs/redux-thunk.js'
import logger from '../libs/redux-logger'
import { combineModules } from '../libs/minapp-redux'

import user from './modules/user'

let modules = combineModules({
    user
})

let middleware = [thunk, logger]

const Store = createStore(
    combineReducers(modules.reducers),
    applyMiddleware(...middleware)
)

export const actions = modules.actions

export default Store
