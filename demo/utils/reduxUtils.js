/**
 * 创建模块 模块对象必须为一个标准对象
 * {
    name: 'xxx',
    initialState: {
    },
    actions: {
    },
    asyncActions: actions => ({
    }),
    reducers: {
    }
  }
 * 返回一个redux模块
 * @param {Object} module
 * @returns {Object}
 */
export const createModule = module => {
    const { initialState, reducers, name, actions, asyncActions } = module
    const _reducer = {}
    for (let key in reducers) {
        _reducer[`${name}_${key}`] = reducers[key]
    }
    let _actions = {}
    for (let key in actions) {
        _actions[key] = function(v) {
            return {
                type: `${name}_${key}`,
                payload: actions[key](v)
            }
        }
    }
    let _asyncActions = asyncActions(_actions)
    for (let key in _asyncActions) {
        _actions[key] = _asyncActions[key]
    }
    return {
        reducer(state = initialState, action) {
            let _state = _reducer[action.type]
                ? _reducer[action.type](state, action)
                : state
            return _state
        },
        actions: _actions,
        name
    }
}

/**
 * 合并 modules
 * @param {Object} modules
 * @returns {Object}
 */
export const combineModules = modules => {
    let _actions = {}
    let _reducers = {}
    for (let key in modules) {
        let { name, actions, reducer } = modules[key]
        ;(_actions[name] = actions), (_reducers[name] = reducer)
    }
    return {
        actions: _actions,
        reducers: _reducers
    }
}
