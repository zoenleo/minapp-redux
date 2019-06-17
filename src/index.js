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
function Warn(str) {
    console.warn(str)
}

/**
 * throw Error
 * @param {String} str
 */
function Err(str) {
    throw new Error(str)
}

/**
 * 浅比较当前date和新的stateMap，并返回更小粒度的更新
 * @param {String} data
 * @param {String} stateMap
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
    console.log('%c this is colored', hasDiff && newMap)
    return hasDiff && newMap
}

/**
 * redux store实例
 */
let _store = null

/**
 * 连接器
 * @param {Function} mapStateToData
 * @param {Function} mapMethodToPage
 * @return {Function}
 */
function connect(mapStateToData, mapMethodToPage) {
    if (mapStateToData !== undefined && !isFunction(mapStateToData)) {
        Err(
            `connect first param accept a function, but got a ${typeof mapStateToData}`
        )
    }
    if (mapMethodToPage !== undefined && !isFunction(mapMethodToPage)) {
        Err(
            `connect second param accept a function, but got a ${typeof mapMethodToPage}`
        )
    }
    return function(pageObject) {
        if (!isObject(pageObject)) {
            Err(
                `page object connect accept a page object, but got a ${typeof pageObject}`
            )
        }
        const dataMap = mapStateToData ? mapStateToData(_store.getState()) : {}
        const methodMap = mapMethodToPage
            ? mapMethodToPage(_store.dispatch, _store.getState())
            : {}
        for (const dataKey in dataMap) {
            if (pageObject.data) {
                if (pageObject.data.hasOwnProperty(dataKey)) {
                    Warn(
                        `page object had data ${dataKey}, connect map will cover this prop.`
                    )
                }
                pageObject.data[dataKey] = dataMap[dataKey]
            } else {
                pageObject.data = {
                    [dataKey]: dataMap[dataKey]
                }
            }
        }
        for (const methodKey in methodMap) {
            if (pageObject.hasOwnProperty(methodKey)) {
                Warn(
                    `page object had method ${methodKey}, connect map will cover this method.`
                )
            }
            pageObject[methodKey] = methodMap[methodKey]
        }
        const onLoad = pageObject.onLoad
        const onUnload = pageObject.onUnload
        let unsubscribe = null
        pageObject.onLoad = function(options) {
            const stateMap = shallowDiffData(
                this.data,
                mapStateToData(_store.getState())
            )
            stateMap && this.setData(stateMap)
            unsubscribe = _store.subscribe(() => {
                const stateMap = shallowDiffData(
                    this.data,
                    mapStateToData(_store.getState())
                )
                stateMap && this.setData(stateMap)
            })
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
function connectComponent(mapStateToData, mapMethodToPage) {
    if (mapStateToData !== undefined && !isFunction(mapStateToData)) {
        Err(
            `connect first param accept a function, but got a ${typeof mapStateToData}`
        )
    }
    if (mapMethodToPage !== undefined && !isFunction(mapMethodToPage)) {
        Err(
            `connect second param accept a function, but got a ${typeof mapMethodToPage}`
        )
    }
    return function(pageObject) {
        if (!isObject(pageObject)) {
            Err(
                `page object connect accept a page object, but got a ${typeof pageObject}`
            )
        }
        const dataMap = mapStateToData ? mapStateToData(_store.getState()) : {}
        const methodMap = mapMethodToPage
            ? mapMethodToPage(_store.dispatch, _store.getState())
            : {}
        for (const dataKey in dataMap) {
            if (pageObject.hasOwnProperty('data')) {
                if (pageObject.data.hasOwnProperty(dataKey)) {
                    Warn(
                        `page object had data ${dataKey}, connect map will cover this prop.`
                    )
                }
                pageObject.data[dataKey] = dataMap[dataKey]
            } else {
                pageObject.data = {
                    [dataKey]: dataMap[dataKey]
                }
            }
        }
        for (const methodKey in methodMap) {
            if (methodMap.hasOwnProperty('mothods')) {
                if (pageObject.hasOwnProperty(methodKey)) {
                    Warn(
                        `page object had method ${methodKey}, connect map will cover this method.`
                    )
                }
                pageObject.mothods[methodKey] = methodMap[methodKey]
            } else {
                pageObject.mothods = {
                    [methodKey]: methodMap[methodKey]
                }
            }
        }
        const attached =
            (pageObject.hasOwnProperty('lifetimes') &&
                pageObject.lifetimes.attached) ||
            pageObject.attached
        const detached =
            (pageObject.hasOwnProperty('lifetimes') &&
                pageObject.lifetimes.detached) ||
            pageObject.detached
        let unsubscribe = null
        const attachedCache = function() {
            const stateMap = shallowDiffData(
                this.data,
                mapStateToData(_store.getState())
            )
            stateMap && this.setData(stateMap)
            unsubscribe = _store.subscribe(() => {
                const stateMap = shallowDiffData(
                    this.data,
                    mapStateToData(_store.getState())
                )
                stateMap && this.setData(stateMap)
            })
            attached && attached.call(this)
        }
        const detachedCache = function() {
            unsubscribe && unsubscribe()
            detached && detached.call(this)
        }

        /**
         * 兼容2.2.3以下版本
         */
        if (
            pageObject.hasOwnProperty('lifetimes') &&
            pageObject.lifetimes.attached
        ) {
            pageObject.lifetimes.attached = attachedCache
        } else {
            pageObject.attached = attachedCache
        }
        if (
            pageObject.hasOwnProperty('lifetimes') &&
            pageObject.lifetimes.detached
        ) {
            pageObject.lifetimes.detached = detachedCache
        } else {
            pageObject.detached = detachedCache
        }
        return pageObject
    }
}

/**
 * use Store
 * @param {Object} Store
 */
function use(Store) {
    if (!isObject(Store))
        Err(`init state accept a redux instance, but got a ${typeof Store}`)
    if (_store) {
        Warn(
            'there are multiple store active. This might lead to unexpected results.'
        )
    }
    _store = Store
}

module.exports = {
    connect,
    connectComponent,
    use
}
