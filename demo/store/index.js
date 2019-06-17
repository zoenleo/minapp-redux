import { createStore, combineReducers } from '../libs/redux'
import userInfo from './userInfo/reducer.js'

const reducers = combineReducers({ userInfo })

const Store = createStore(reducers)

export default Store
