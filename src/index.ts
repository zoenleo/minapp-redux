import { Store, Unsubscribe } from 'redux'
import {
    Action,
    ActionCreatorMap,
    AsyncActionCreatorMap,
    ModuleOutPut,
    ModuleOptions,
    PageObject,
    ComponentObject
} from '../typings/index'

const _toString = Object.prototype.toString

/**
 * is function
 * @param {*} obj
 * @return {Boolean}
 */
function isFunction(obj: any) {
    return typeof obj === 'function' || false
}

/**
 * is object
 * @param {*} obj
 * @return {Boolean}
 */
function isObject(obj: any) {
    return _toString.call(obj) === '[object Object]' || false
}

/**
 * console warn
 * @param {String} str
 */
function warn(str: string) {
    console.warn(str)
}

/**
 * throw error
 * @param {String} str
 */
function err(str: string) {
    throw new Error(str)
}

/**
 * 浅比较当前date和新的stateMap，并返回更小粒度的更新
 * @param {String} data
 * @param {String} stateMap
 * @return {Object | false}
 */

function shallowDiffData(
    data: Record<string, any>,
    stateMap: Record<string, any>
) {
    if (!isObject(stateMap)) return false
    let newMap: Record<string, any> = {}
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
let _store: Store

/**
 * 连接器
 * @param {Function} mapStateToData
 * @param {Function} mapMethodToPage
 * @return {Function}
 */
function connect(mapStateToData: any, mapMethodToPage: any) {
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
    return function(pageObject: PageObject) {
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
        let unsubscribe: Unsubscribe
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
function connectComponent(mapStateToData: any, mapMethodToPage: any) {
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
    return function(componentObject: ComponentObject) {
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

        let unsubscribe: Unsubscribe

        const attachedCache = function(
            this: WechatMiniprogram.Component.Instance<
                WechatMiniprogram.Component.DataOption,
                WechatMiniprogram.Component.PropertyOption,
                WechatMiniprogram.Component.MethodOption
            >
        ) {
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

        const detachedCache = function(
            this: WechatMiniprogram.Component.Instance<
                WechatMiniprogram.Component.DataOption,
                WechatMiniprogram.Component.PropertyOption,
                WechatMiniprogram.Component.MethodOption
            >
        ) {
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
 * @param {Object} mudule
 * @returns {Object}
 */
export const createModule = <
    N extends string,
    S extends Record<string, any>,
    K extends Record<string, any>,
    T extends Record<string, any>
>(
    options: ModuleOptions<N, S, K, T>
): ModuleOutPut<N, S, K, T> => {
    const { name, initialState, reducers, asyncActions } = options

    let actions: ActionCreatorMap<K> | AsyncActionCreatorMap<T> = {} as any
    const _actions: ActionCreatorMap<K> = {} as any

    const reducersNameSpaceMap: {
        [key: string]: (state: S, action: Action<any>) => S
    } = {}

    for (const key in reducers) {
        if (reducers.hasOwnProperty(key)) {
            // tips: 这里把模块对象的actions属性去掉了，直接在这里根据reducer自动生成
            // 根据reducer动态关联生成action
            const namespace = `${name}_${key}`

            _actions[key] = (payload: K[typeof key]) => {
                return {
                    type: namespace,
                    payload
                }
            }

            reducersNameSpaceMap[namespace] = reducers[key]
        }
    }

    const reducer = (state: S = initialState, action: any) => {
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
export const combineMudules = <
    T extends Record<string, ModuleOutPut<string, any, any, any>>
>(
    modules: T
) => {
    // ActionsMapObject
    const _actions: {
        [key in keyof T]: T[key]['actions']
    } = {} as any

    // ReducersMapObject
    const _reducers: {
        [key in keyof T]: T[key]['reducer']
    } = {} as any

    for (const key in modules) {
        if (modules.hasOwnProperty(key)) {
            // tips: 为了跟好的类型提示，这里 _actions, reducers 的索引选择与 modules 的 key 同步
            const { actions: moduleActions, reducer } = modules[key]
            _actions[key] = moduleActions
            _reducers[key] = reducer
        }
    }

    return { _actions, _reducers }
}

/**
 * use Store
 * @param {Object} Store
 */
function use(Store: Store) {
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
    combineMudules,
    use
}
