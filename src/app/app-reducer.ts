const initialSlate: InitialStateType = {
    status: 'idle',
    error: 'some error'
}

export const appReducer = (state: InitialStateType = initialSlate, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        default:
            return {...state}
    }
}

export const setError = (error: null | string) => ({type: 'APP/SET-ERROR', error} as const)

export const setStatus = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    status: RequestStatusType
    error: null | string
}
type ActionsType = ReturnType<typeof setError>
    | ReturnType<typeof setStatus>