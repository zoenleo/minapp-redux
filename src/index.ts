import { Store, Unsubscribe } from 'redux'

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
  use
}
