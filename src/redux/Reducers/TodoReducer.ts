import * as Type from './../ActionType';
import * as Interface from './../ReduxInterfaces';

export const todoRequest = (state: Interface.TodoSetting = {
    loading: false,
    status: "",
    message: ""
}, action: Interface.ActionTypes) => {
	switch (action.type) {
        case Type.START_INSERT_REMEDY_SCORE:
        case Type.START_UPDATE_SETTING_RECORD:
        case Type.START_INSERT_EXAM_SCORE:
        case Type.START_INSERT_SETTING_RECORD:
		case Type.START_INSERT_TASK_RESULT:
		case Type.START_INSERT_EKSTRA_DATA:
		case Type.START_UPDATE_EKSTRA_DATA:
            return {
                ...state,
                status: "loading"
            }
        case Type.FAILED_INSERT_REMEDY_SCORE:
        case Type.FAILED_UPDATE_SETTING_RECORD:
        case Type.FAILED_INSERT_EXAM_SCORE:
        case Type.FAILED_INSERT_SETTING_RECORD:
		case Type.FAILED_INSERT_TASK_RESULT:
		case Type.FAILED_INSERT_EKSTRA_DATA:
		case Type.FAILED_UPDATE_EKSTRA_DATA:
            return {
                ...state,
                ...action.payload.data
            }
        case Type.INSERT_REMEDY_SCORE:
        case Type.UPDATE_SETTING_RECORD:
        case Type.INSERT_EXAM_SCORE:
        case Type.INSERT_SETTING_RECORD:
		case Type.INSERT_TASK_RESULT:
		case Type.SUCCESS_INSERT_EKSTRA_DATA:
		case Type.SUCCESS_UPDATE_EKSTRA_DATA:
            return {
                ...state,
                ...action.payload
            }
        case Type.RESET_REQUEST_STATE:
            return state
        default:
            return state
    }
}
