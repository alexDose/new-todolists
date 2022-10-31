import {Dispatch} from 'redux'
import {authAPI, FieldErrorType} from "../../api/todolists-api";
import {handleServerAppError} from "../../utils/error-utils";
import {clearTodosDataAC} from "../TodolistsList/todolists-reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {setAppStatus} from "../../app/app-reducer";

export const loginTC = createAsyncThunk<{isLoggedIn: boolean}, LoginDataType, {rejectValue: {errors: Array<string>, fieldsErrors?: Array<FieldErrorType>}}>('auth/login', async (data, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: 'loading'}))
    const res = await authAPI.login(data)
    try {
        if (res.data.resultCode === 0) {
            thunkAPI.dispatch(setIsLoggedInAC({value: true}))
            return {isLoggedIn: true}
        } else {
            handleServerAppError(res.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({errors: res.data.messages, fieldsErrors: res.data.fieldsErrors})
        }
    } catch (error: any) {
        handleServerAppError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})
    }
})

const slice = createSlice({
    name: 'auth',
    initialState: {isLoggedIn: false},
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginTC.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            }
        )
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
// export const loginTC = (data: LoginDataType) => (dispatch: Dispatch) => {
//     dispatch(setAppStatus({status: 'loading'}))
//     authAPI.login(data)
//         .then(res => {
//             if (res.data.resultCode === 0) {
//                 dispatch(setIsLoggedInAC({value: true}))
//             } else {
//                 handleServerAppError(res.data, dispatch)
//             }
//         })
//         .catch(error => {
//             handleServerAppError(error, dispatch)
//         })
//         .finally(() => {
//             dispatch(setAppStatus({status: 'idle'}))
//         })
// }
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
