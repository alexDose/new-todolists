import {Dispatch} from "redux";
import {authAPI} from "../api/todolists-api";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import {handleServerAppError} from "../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialSlate: InitialStateType = {
    status: 'idle',
    error: null,
    isInitialized: false
}

const slice = createSlice({
    name: 'app',
    initialState: initialSlate,
    reducers: {
        setAppError(state, action: PayloadAction<{ error: null | string }>) {
            state.error = action.payload.error
        },
        setAppStatus(state, action: PayloadAction<{ status: RequestStatusType }>) {
            state.status = action.payload.status
        },
        setInitialized(state, action: PayloadAction<{ initialized: boolean }>) {
            state.isInitialized = action.payload.initialized
        }
    }
})

export const appReducer = slice.reducer
export const {setInitialized, setAppStatus, setAppError} = slice.actions

/*
export const appReducer = (state: InitialStateType = initialSlate, action: ActionsAppType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case 'APP/SET-INITIALIZED':
            return {...state, isInitialized: action.initialized}
        default:
            return {...state}
    }
}

export const setAppError = (error: null | string) => ({type: 'APP/SET-ERROR', error} as const)

export const setAppStatus = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setInitialized = (initialized: boolean) => ({type: 'APP/SET-INITIALIZED', initialized} as const)
*/

export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.me().then(res => {
        if (res.data.resultCode === 0) {
            dispatch(setInitialized({initialized: true}))
            dispatch(setIsLoggedInAC({value: true}));
        } else {
            handleServerAppError(res.data, dispatch)
        }
    })
        .catch(error => {
            handleServerAppError(error, dispatch)
        })
        .finally(() => {
            dispatch(setInitialized({initialized: true}))
        })
}

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    status: RequestStatusType
    error: null | string
    isInitialized: boolean
}
/*
export type ActionsAppType = ReturnType<typeof setAppError>
    | ReturnType<typeof setAppStatus>
    | ReturnType<typeof setInitialized>*/
