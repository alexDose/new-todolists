import {ActionsAppType, setAppError, setAppStatus} from "../app/app-reducer";
import {ResponseType} from "../api/todolists-api";
import {Dispatch} from "redux";

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch<ActionsAppType>) => {
    if (data.messages.length) {
        dispatch(setAppError(data.messages[0]))
    } else {
        dispatch(setAppError('Some error occurred'))
    }
    dispatch(setAppStatus('failed'))
}

export const handleServerNetworkError = (error: any, dispatch: Dispatch<ActionsAppType>) => {
    dispatch(setAppError(error.message ? error.message : 'some error occurred'))
    dispatch(setAppStatus('failed'))
}