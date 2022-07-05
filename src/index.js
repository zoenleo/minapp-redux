const _toString = Object.prototype.toString

/**
 * is function
 * @param {*} obj
 * @return {Boolean}
 */
function isFunction(obj) {
    return typeof obj === 'function' || false
}

/**
 * is object
 * @param {*} obj
 * @return {Boolean}
 */
function isObject(obj) {
    return _toString.call(obj) === '[object Object]' || false
}

/**
 * console warn
 * @param {String} str
 */
function warn(str) {
    console.warn(str)
}

/**
 * throw error
 * @param {String} str
 */
function err(str) {
    throw new Error(str)
}

/**
 * 浅比较当前date和新的stateMap，并返回更小粒度的更新
 * @param {String} data
 * @param {Object} stateMap
 * @return {Object | false}
 */

function shallowDiffData(data, stateMap) {
    if (!isObject(stateMap)) return false
    let newMap = {}
    let hasDiff = false
    for (let key in stateMap) {
        if (stateMap[key] !== data[key]) {
            hasDiff = true
            newMap[key] = stateMap[key]
        }
    }
    return hasDiff && newMap
}

/**
 * redux store实例
 */
let _store

/**
 * 连接器
 * @param {Function} mapStateToData
 * @param {Function} mapMethodToPage
 * @return {Function}
 */
export function connect(mapStateToData, mapMethodToPage) {
    if (mapStateToData !== undefined && !isFunction(mapStateToData)) {
        err(
            `connect first param accept a function, but got a ${typeof mapStateToData}`
        )
    }
    if (mapMethodToPage !== undefined && !isFunction(mapMethodToPage)) {
        err(
            `connect second param accept a function, but got a ${typeof mapMethodToPage}`
        )
    }
    return function(pageObject) {
        if (!isObject(pageObject)) {
            err(
                `page object connect accept a page object, but got a ${typeof pageObject}`
            )
        }
        // map state to data
        const dataMap = mapStateToData ? mapStateToData(_store.getState()) : {}
        if (!pageObject.data) pageObject.data = {}
        for (const dataKey in dataMap) {
            if (pageObject.data.hasOwnProperty(dataKey)) {
                warn(
                    `page object had data ${dataKey}, connect map will cover this prop.`
                )
            }
            pageObject.data[dataKey] = dataMap[dataKey]
        }
        // map method to page
        const methodMap = mapMethodToPage
            ? mapMethodToPage(_store.dispatch, _store.getState())
            : {}
        for (const methodKey in methodMap) {
            if (pageObject.hasOwnProperty(methodKey)) {
                warn(
                    `page object had method ${methodKey}, connect map will cover this method.`
                )
            }
            pageObject[methodKey] = methodMap[methodKey]
        }
        const onLoad = pageObject.onLoad
        const onUnload = pageObject.onUnload
        let unsubscribe
        pageObject.onLoad = function(options) {
            const updateData = () => {
                const stateMap = shallowDiffData(
                    this.data || {},
                    mapStateToData(_store.getState())
                )
                stateMap && this.setData(stateMap)
            }
            updateData()
            unsubscribe = _store.subscribe(updateData)
            onLoad && onLoad.call(this, options)
        }
        pageObject.onUnload = function() {
            unsubscribe && unsubscribe()
            onUnload && onUnload.call(this)
        }
        return pageObject
    }
}

/**
 * 组件连接器
 * @param {Function} mapStateToData
 * @param {Function} mapMethodToPage
 * @return {Function}
 */
export function connectComponent(mapStateToData, mapMethodToPage) {
    if (mapStateToData !== undefined && !isFunction(mapStateToData)) {
        err(
            `connect first param accept a function, but got a ${typeof mapStateToData}`
        )
    }
    if (mapMethodToPage !== undefined && !isFunction(mapMethodToPage)) {
        err(
            `connect second param accept a function, but got a ${typeof mapMethodToPage}`
        )
    }
    return function(componentObject) {
        if (!isObject(componentObject)) {
            err(
                `component object connect accept a component object, but got a ${typeof componentObject}`
            )
        }
        // map state to data
        const dataMap = mapStateToData ? mapStateToData(_store.getState()) : {}
        if (!componentObject.data) componentObject.data = {}
        for (const dataKey in dataMap) {
            if (componentObject.data.hasOwnProperty(dataKey)) {
                warn(
                    `component object had data ${dataKey}, connect map will cover this prop.`
                )
            }
            componentObject.data[dataKey] = dataMap[dataKey]
        }
        // map method to component
        const methodMap = mapMethodToPage
            ? mapMethodToPage(_store.dispatch, _store.getState())
            : {}
        if (!componentObject.methods) componentObject.methods = {}
        for (const methodKey in methodMap) {
            if (componentObject.hasOwnProperty(methodKey)) {
                warn(
                    `component object had method ${methodKey}, connect map will cover this method.`
                )
            }
            componentObject.methods[methodKey] = methodMap[methodKey]
        }

        const attached =
            (componentObject.lifetimes && componentObject.lifetimes.attached) ||
            componentObject.attached

        const detached =
            (componentObject.lifetimes && componentObject.lifetimes.detached) ||
            componentObject.detached

        let unsubscribe

        const attachedCache = function() {
            const updateData = () => {
                const stateMap = shallowDiffData(
                    this.data || {},
                    mapStateToData(_store.getState())
                )
                stateMap && this.setData(stateMap)
            }
            updateData()
            unsubscribe = _store.subscribe(updateData)
            attached && attached.call(this)
        }

        const detachedCache = function() {
            unsubscribe && unsubscribe()
            detached && detached.call(this)
        }

        /**
         * 兼容2.2.3以下版本
         */
        if (componentObject.lifetimes && componentObject.lifetimes.attached) {
            componentObject.lifetimes.attached = attachedCache
        } else {
            componentObject.attached = attachedCache
        }
        if (componentObject.lifetimes && componentObject.lifetimes.detached) {
            componentObject.lifetimes.detached = detachedCache
        } else {
            componentObject.detached = detachedCache
        }

        return componentObject
    }
}

/**
 * 创建模块 模块对象必须为一个标准对象
 * {
    name: 'xxx',
    initialState: {
    },
    asyncActions: actions => ({
      xxx: (payload: any) {
        return (dispatch, getState) => any
      }
    }),
    reducers: {
      xxx: (state, action) {
        return { ...state, ...any}
      }
    }
  }
 * 返回一个redux模块
 * @param {Object} options
 * @returns {Object}
 */
export const createModule = options => {
    const { name, initialState, reducers, asyncActions } = options

    let actions = {}
    const _actions = {}

    const reducersNameSpaceMap = {}

    for (const key in reducers) {
        if (reducers.hasOwnProperty(key)) {
            // tips: 这里把模块对象的actions属性去掉了，直接在这里根据reducer自动生成
            // 根据reducer动态关联生成action
            const namespace = `${name}_${key}`

            _actions[key] = payload => {
                return {
                    type: namespace,
                    payload
                }
            }

            reducersNameSpaceMap[namespace] = reducers[key]
        }
    }

    const reducer = (state = initialState, action) => {
        return reducersNameSpaceMap[action.type]
            ? reducersNameSpaceMap[action.type](state, action)
            : state
    }

    // 合并异步action
    const _asyncActions = asyncActions(_actions)

    for (const key in _asyncActions) {
        if (_asyncActions.hasOwnProperty(key) && _actions.hasOwnProperty(key)) {
            warn(
                `The ${key} in "asyncActions" already exists in the "reducer",
              key in reducer will be overwritten`
            )
        }
    }

    actions = {
        ..._actions,
        ..._asyncActions
    }

    return {
        name,
        actions,
        reducer
    }
}

/**
 * 合并 modules
 * @param {Object} modules
 * @returns {Object}
 */
export const combineModules = modules => {
    // ActionsMapObject
    const _actions = {}

    // ReducersMapObject
    const _reducers = {}

    for (const key in modules) {
        if (modules.hasOwnProperty(key)) {
            // tips: 为了跟好的类型提示，这里 _actions, reducers 的索引选择与 modules 的 key 同步
            const { actions: moduleActions, reducer } = modules[key]
            _actions[key] = moduleActions
            _reducers[key] = reducer
        }
    }

    return { actions: _actions, reducers: _reducers }
}

/**
 * use Store
 * @param {Object} Store
 */
export function use(Store) {
    if (!isObject(Store))
        err(`init state accept a redux instance, but got a ${typeof Store}`)
    if (_store) {
        warn(
            'there are multiple store active. This might lead to unexpected results.'
        )
    }
    _store = Store
}

module.exports = {
    connect,
    connectComponent,
    createModule,
    combineModules,
    use
}
