import * as Type from './../ActionType';
import * as Interface from './../ReduxInterfaces';

export const waliKelas = (state: Interface.StateInterface = {data: [], loading: false}, action: Interface.ActionTypes) => {
    switch (action.type) {
        case Type.GET_HOMEROOM_TEACHER:
            return {...state, loading: true}
        case Type.PROCESS_HOMEROOM_TEACHER:
            return {...state, loading: false, data: action.payload}
        case Type.ERROR_GET_HOMEROOM_TEACHER:
            return {...state, loading: false}
        default:
            return state
    }
}

export const teacherData = (state: Interface.StateInterface = {data: [], loading: false}, action: Interface.ActionTypes) => {
	switch (action.type) {
		case Type.START_READ_TEACHER_RECORDS:
			return { ...state, data: [], loading: true }
			case Type.READ_TEACHER_RECORDS:
			return { ...state, data: action.payload || [], loading: false }
		case Type.FAILED_READ_TEACHER_RECORDS:
			return { ...state }
		default:
			return state
		}
}