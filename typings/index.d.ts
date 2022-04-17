/// <reference path="../node_modules/@types/wechat-miniprogram/index.d.ts" />
import { Store, Dispatch } from 'redux'

export type PageObject = WechatMiniprogram.Page.Options<
    WechatMiniprogram.Page.DataOption,
    WechatMiniprogram.Page.CustomOption
>

export type ComponentObject = WechatMiniprogram.Component.Options<
    WechatMiniprogram.Component.DataOption,
    WechatMiniprogram.Component.PropertyOption,
    WechatMiniprogram.Component.MethodOption
>

export interface Action<P extends any, T extends string = string> {
    type: T
    payload: P
}

export type AsyncActionCreator<T extends any> = (
    payload: T
) => (dispatch: Dispatch, getState: Store['getState']) => any

export type AsyncActionCreatorMap<T extends Record<string, any>> = {
    [key in keyof T]: AsyncActionCreator<T[key]>
}

export type ActionCreator<K extends any> = (
    paylod: K
) => {
    type: string
    payload: K
}

export type ActionCreatorMap<K extends Record<string, any>> = {
    [key in keyof K]: ActionCreator<K[key]>
}
export interface ModuleOptions<
    N extends string,
    S extends Record<string, any> | undefined,
    K extends Record<string, any>,
    T extends Record<string, any>
> {
    name: N
    initialState: S
    reducers: {
        [key in keyof K]: (state: S, action: Action<K[key]>) => S
    }
    asyncActions(
        actions: {
            [key in keyof K]: (payload: K[key]) => Action<K[key]>
        }
    ): AsyncActionCreatorMap<T>
}

export interface ModuleOutPut<
    N extends string,
    S extends Record<string, any> | undefined,
    K extends Record<string, any>,
    T extends Record<string, any>
> {
    name: N
    actions: ActionCreatorMap<K> | AsyncActionCreatorMap<T>
    reducer(state: S | undefined, action: any): S
}
