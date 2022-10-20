import {Dispatch} from 'redux'
import {authAPI} from "../../api/todolists-api";
import {handleServerAppError} from "../../utils/error-utils";
import {clearTodosDataAC} from "../TodolistsList/todolists-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {setAppStatus} from "../../app/app-reducer";

const initialState = {
    isLoggedIn: false
}

const slice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value
        }
    }
})

export const authReducer = slice.reducer
export const {setIsLoggedInAC} = slice.actions

export type LoginDataType = {
    email: string
    password: string
    rememberMe?: boolean
    captcha?: string
}

/*
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}

// actions
export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)
*/

// thunks
export const loginTC = (data: LoginDataType) => (dispatch: Dispatch) => {
    dispatch(setAppStatus({status: 'loading'}))
    authAPI.login(data)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: true}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => {
            handleServerAppError(error, dispatch)
        })
        .finally(() => {
            dispatch(setAppStatus({status: 'idle'}))
        })
}
export const logoutTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatus({status: 'loading'}))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: false}))
                dispatch(setAppStatus({status: 'succeeded'}))
                dispatch(clearTodosDataAC({}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => {
            handleServerAppError(error, dispatch)
        })
        .finally(() => {
            dispatch(setAppStatus({status: 'idle'}))
        })
}

/*
// types
type ActionsType = ReturnType<typeof setIsLoggedInAC> | ActionsAppType | ReturnType<typeof clearTodosDataAC>
*/
