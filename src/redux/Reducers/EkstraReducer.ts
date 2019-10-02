import * as Type from './../ActionType';
import * as Interface from './../ReduxInterfaces';

export const ekstraReducer = (state: any = {
	data: [],
	is_loading: false,
	is_requested: false,
}, action: Interface.ActionTypes) => {
	switch (action.type) {
		case Type.START_READ_EKSTRA_DATA:
			return {...state, is_loading: true, is_requested: true}
		case Type.SUCCESS_READ_EKSTRA_DATA:
			return {...state, data: action.payload || [], is_loading: false, is_requested: false}
		case Type.FAILED_READ_EKSTRA_DATA:
			return {...state, data: [], is_loading: false, is_requested: false}
		default:
			return state
	}
}

