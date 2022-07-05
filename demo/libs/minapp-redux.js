module.exports = /******/ (function(modules) {
    // webpackBootstrap
    /******/ // The module cache
    /******/ var installedModules = {} // The require function
    /******/
    /******/ /******/ function __webpack_require__(moduleId) {
        /******/
        /******/ // Check if module is in cache
        /******/ if (installedModules[moduleId]) {
            /******/ return installedModules[moduleId].exports
            /******/
        } // Create a new module (and put it into the cache)
        /******/ /******/ var module = (installedModules[moduleId] = {
            /******/ i: moduleId,
            /******/ l: false,
            /******/ exports: {}
            /******/
        }) // Execute the module function
        /******/
        /******/ /******/ modules[moduleId].call(
            module.exports,
            module,
            module.exports,
            __webpack_require__
        ) // Flag the module as loaded
        /******/
        /******/ /******/ module.l = true // Return the exports of the module
        /******/
        /******/ /******/ return module.exports
        /******/
    } // expose the modules object (__webpack_modules__)
    /******/
    /******/
    /******/ /******/ __webpack_require__.m = modules // expose the module cache
    /******/
    /******/ /******/ __webpack_require__.c = installedModules // define getter function for harmony exports
    /******/
    /******/ /******/ __webpack_require__.d = function(exports, name, getter) {
        /******/ if (!__webpack_require__.o(exports, name)) {
            /******/ Object.defineProperty(exports, name, {
                enumerable: true,
                get: getter
            })
            /******/
        }
        /******/
    } // define __esModule on exports
    /******/
    /******/ /******/ __webpack_require__.r = function(exports) {
        /******/ if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
            /******/ Object.defineProperty(exports, Symbol.toStringTag, {
                value: 'Module'
            })
            /******/
        }
        /******/ Object.defineProperty(exports, '__esModule', { value: true })
        /******/
    } // create a fake namespace object // mode & 1: value is a module id, require it // mode & 2: merge all properties of value into the ns // mode & 4: return value when already ns object // mode & 8|1: behave like require
    /******/
    /******/ /******/ /******/ /******/ /******/ /******/ __webpack_require__.t = function(
        value,
        mode
    ) {
        /******/ if (mode & 1) value = __webpack_require__(value)
        /******/ if (mode & 8) return value
        /******/ if (
            mode & 4 &&
            typeof value === 'object' &&
            value &&
            value.__esModule
        )
            return value
        /******/ var ns = Object.create(null)
        /******/ __webpack_require__.r(ns)
        /******/ Object.defineProperty(ns, 'default', {
            enumerable: true,
            value: value
        })
        /******/ if (mode & 2 && typeof value != 'string')
            for (var key in value)
                __webpack_require__.d(
                    ns,
                    key,
                    function(key) {
                        return value[key]
                    }.bind(null, key)
                )
        /******/ return ns
        /******/
    } // getDefaultExport function for compatibility with non-harmony modules
    /******/
    /******/ /******/ __webpack_require__.n = function(module) {
        /******/ var getter =
            module && module.__esModule
                ? /******/ function getDefault() {
                      return module['default']
                  }
                : /******/ function getModuleExports() {
                      return module
                  }
        /******/ __webpack_require__.d(getter, 'a', getter)
        /******/ return getter
        /******/
    } // Object.prototype.hasOwnProperty.call
    /******/
    /******/ /******/ __webpack_require__.o = function(object, property) {
        return Object.prototype.hasOwnProperty.call(object, property)
    } // __webpack_public_path__
    /******/
    /******/ /******/ __webpack_require__.p = '' // Load entry module and return exports
    /******/
    /******/
    /******/ /******/ return __webpack_require__((__webpack_require__.s = 0))
    /******/
})(
    /************************************************************************/
    /******/ [
        /* 0 */
        /***/ function(module, exports, __webpack_require__) {
            'use strict'

            var _typeof =
                typeof Symbol === 'function' &&
                typeof Symbol.iterator === 'symbol'
                    ? function(obj) {
                          return typeof obj
                      }
                    : function(obj) {
                          return obj &&
                              typeof Symbol === 'function' &&
                              obj.constructor === Symbol &&
                              obj !== Symbol.prototype
                              ? 'symbol'
                              : typeof obj
                      }

            var __assign =
                (undefined && undefined.__assign) ||
                function() {
                    __assign =
                        Object.assign ||
                        function(t) {
                            for (
                                var s, i = 1, n = arguments.length;
                                i < n;
                                i++
                            ) {
                                s = arguments[i]
                                for (var p in s) {
                                    if (
                                        Object.prototype.hasOwnProperty.call(
                                            s,
                                            p
                                        )
                                    )
                                        t[p] = s[p]
                                }
                            }
                            return t
                        }
                    return __assign.apply(this, arguments)
                }
            Object.defineProperty(exports, '__esModule', { value: true })
            exports.use = exports.combineModules = exports.createModule = exports.connectComponent = exports.connect = void 0
            var _toString = Object.prototype.toString
            function isFunction(obj) {
                return typeof obj === 'function' || false
            }
            function isObject(obj) {
                return _toString.call(obj) === '[object Object]' || false
            }
            function warn(str) {
                console.warn(str)
            }
            function err(str) {
                throw new Error(str)
            }
            function shallowDiffData(data, stateMap) {
                if (!isObject(stateMap)) return false
                var newMap = {}
                var hasDiff = false
                for (var key in stateMap) {
                    if (stateMap[key] !== data[key]) {
                        hasDiff = true
                        newMap[key] = stateMap[key]
                    }
                }
                return hasDiff && newMap
            }
            var _store
            function connect(mapStateToData, mapMethodToPage) {
                if (
                    mapStateToData !== undefined &&
                    !isFunction(mapStateToData)
                ) {
                    err(
                        'connect first param accept a function, but got a '.concat(
                            typeof mapStateToData === 'undefined'
                                ? 'undefined'
                                : _typeof(mapStateToData)
                        )
                    )
                }
                if (
                    mapMethodToPage !== undefined &&
                    !isFunction(mapMethodToPage)
                ) {
                    err(
                        'connect second param accept a function, but got a '.concat(
                            typeof mapMethodToPage === 'undefined'
                                ? 'undefined'
                                : _typeof(mapMethodToPage)
                        )
                    )
                }
                return function(pageObject) {
                    if (!isObject(pageObject)) {
                        err(
                            'page object connect accept a page object, but got a '.concat(
                                typeof pageObject === 'undefined'
                                    ? 'undefined'
                                    : _typeof(pageObject)
                            )
                        )
                    }
                    var dataMap = mapStateToData
                        ? mapStateToData(_store.getState())
                        : {}
                    if (!pageObject.data) pageObject.data = {}
                    for (var dataKey in dataMap) {
                        if (pageObject.data.hasOwnProperty(dataKey)) {
                            warn(
                                'page object had data '.concat(
                                    dataKey,
                                    ', connect map will cover this prop.'
                                )
                            )
                        }
                        pageObject.data[dataKey] = dataMap[dataKey]
                    }
                    var methodMap = mapMethodToPage
                        ? mapMethodToPage(_store.dispatch, _store.getState())
                        : {}
                    for (var methodKey in methodMap) {
                        if (pageObject.hasOwnProperty(methodKey)) {
                            warn(
                                'page object had method '.concat(
                                    methodKey,
                                    ', connect map will cover this method.'
                                )
                            )
                        }
                        pageObject[methodKey] = methodMap[methodKey]
                    }
                    var onLoad = pageObject.onLoad
                    var onUnload = pageObject.onUnload
                    var unsubscribe
                    pageObject.onLoad = function(options) {
                        var _this = this
                        var updateData = function updateData() {
                            var stateMap = shallowDiffData(
                                _this.data || {},
                                mapStateToData(_store.getState())
                            )
                            stateMap && _this.setData(stateMap)
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
            exports.connect = connect
            function connectComponent(mapStateToData, mapMethodToPage) {
                if (
                    mapStateToData !== undefined &&
                    !isFunction(mapStateToData)
                ) {
                    err(
                        'connect first param accept a function, but got a '.concat(
                            typeof mapStateToData === 'undefined'
                                ? 'undefined'
                                : _typeof(mapStateToData)
                        )
                    )
                }
                if (
                    mapMethodToPage !== undefined &&
                    !isFunction(mapMethodToPage)
                ) {
                    err(
                        'connect second param accept a function, but got a '.concat(
                            typeof mapMethodToPage === 'undefined'
                                ? 'undefined'
                                : _typeof(mapMethodToPage)
                        )
                    )
                }
                return function(componentObject) {
                    if (!isObject(componentObject)) {
                        err(
                            'component object connect accept a component object, but got a '.concat(
                                typeof componentObject === 'undefined'
                                    ? 'undefined'
                                    : _typeof(componentObject)
                            )
                        )
                    }
                    var dataMap = mapStateToData
                        ? mapStateToData(_store.getState())
                        : {}
                    if (!componentObject.data) componentObject.data = {}
                    for (var dataKey in dataMap) {
                        if (componentObject.data.hasOwnProperty(dataKey)) {
                            warn(
                                'component object had data '.concat(
                                    dataKey,
                                    ', connect map will cover this prop.'
                                )
                            )
                        }
                        componentObject.data[dataKey] = dataMap[dataKey]
                    }
                    var methodMap = mapMethodToPage
                        ? mapMethodToPage(_store.dispatch, _store.getState())
                        : {}
                    if (!componentObject.methods) componentObject.methods = {}
                    for (var methodKey in methodMap) {
                        if (componentObject.hasOwnProperty(methodKey)) {
                            warn(
                                'component object had method '.concat(
                                    methodKey,
                                    ', connect map will cover this method.'
                                )
                            )
                        }
                        componentObject.methods[methodKey] =
                            methodMap[methodKey]
                    }
                    var attached =
                        (componentObject.lifetimes &&
                            componentObject.lifetimes.attached) ||
                        componentObject.attached
                    var detached =
                        (componentObject.lifetimes &&
                            componentObject.lifetimes.detached) ||
                        componentObject.detached
                    var unsubscribe
                    var attachedCache = function attachedCache() {
                        var _this = this
                        var updateData = function updateData() {
                            var stateMap = shallowDiffData(
                                _this.data || {},
                                mapStateToData(_store.getState())
                            )
                            stateMap && _this.setData(stateMap)
                        }
                        updateData()
                        unsubscribe = _store.subscribe(updateData)
                        attached && attached.call(this)
                    }
                    var detachedCache = function detachedCache() {
                        unsubscribe && unsubscribe()
                        detached && detached.call(this)
                    }
                    if (
                        componentObject.lifetimes &&
                        componentObject.lifetimes.attached
                    ) {
                        componentObject.lifetimes.attached = attachedCache
                    } else {
                        componentObject.attached = attachedCache
                    }
                    if (
                        componentObject.lifetimes &&
                        componentObject.lifetimes.detached
                    ) {
                        componentObject.lifetimes.detached = detachedCache
                    } else {
                        componentObject.detached = detachedCache
                    }
                    return componentObject
                }
            }
            exports.connectComponent = connectComponent
            var createModule = function createModule(options) {
                var name = options.name,
                    initialState = options.initialState,
                    reducers = options.reducers,
                    asyncActions = options.asyncActions
                var actions = {}
                var _actions = {}
                var reducersNameSpaceMap = {}
                var _loop_1 = function _loop_1(key) {
                    if (reducers.hasOwnProperty(key)) {
                        var namespace_1 = ''.concat(name, '_').concat(key)
                        _actions[key] = function(payload) {
                            return {
                                type: namespace_1,
                                payload: payload
                            }
                        }
                        reducersNameSpaceMap[namespace_1] = reducers[key]
                    }
                }
                for (var key in reducers) {
                    _loop_1(key)
                }
                var reducer = function reducer(state, action) {
                    if (state === void 0) {
                        state = initialState
                    }
                    return reducersNameSpaceMap[action.type]
                        ? reducersNameSpaceMap[action.type](state, action)
                        : state
                }
                var _asyncActions = asyncActions(_actions)
                for (var key in _asyncActions) {
                    if (
                        _asyncActions.hasOwnProperty(key) &&
                        _actions.hasOwnProperty(key)
                    ) {
                        warn(
                            'The '.concat(
                                key,
                                ' in "asyncActions" already exists in the "reducer",\n              key in reducer will be overwritten'
                            )
                        )
                    }
                }
                actions = __assign(__assign({}, _actions), _asyncActions)
                return {
                    name: name,
                    actions: actions,
                    reducer: reducer
                }
            }
            exports.createModule = createModule
            var combineModules = function combineModules(modules) {
                var _actions = {}
                var _reducers = {}
                for (var key in modules) {
                    if (modules.hasOwnProperty(key)) {
                        var _a = modules[key],
                            moduleActions = _a.actions,
                            reducer = _a.reducer
                        _actions[key] = moduleActions
                        _reducers[key] = reducer
                    }
                }
                return { actions: _actions, reducers: _reducers }
            }
            exports.combineModules = combineModules
            function use(Store) {
                if (!isObject(Store))
                    err(
                        'init state accept a redux instance, but got a '.concat(
                            typeof Store === 'undefined'
                                ? 'undefined'
                                : _typeof(Store)
                        )
                    )
                if (_store) {
                    warn(
                        'there are multiple store active. This might lead to unexpected results.'
                    )
                }
                _store = Store
            }
            exports.use = use
            module.exports = {
                connect: connect,
                connectComponent: connectComponent,
                createModule: exports.createModule,
                combineModules: exports.combineModules,
                use: use
            }

            /***/
        }
        /******/
    ]
)
