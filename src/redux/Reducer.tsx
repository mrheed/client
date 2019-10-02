import * as Type from './ActionType';
import * as Interface from './ReduxInterfaces';

export const personReducer = (state: Readonly<Interface.StateInterface> = {data: [], loading: false}, action: Interface.ActionTypes) => {
	switch (action.type) {
		case Type.START_REQUEST_PERSON_DATA:
			return {
                ...state, 
                data: [], 
                loading: true
            }
		case Type.SUCCESS_REQUEST_PERSON_DATA:
			return {
                ...state, 
                data: action.payload || [], 
                loading: false
            }
		case Type.ERROR_REQUEST_PERSON_DATA:
			return {
                ...state, 
                data: [], 
                loading: false
            }
        default:
        return state;
    }
}

export const UserInformationReducer = (state: any = {}, action: Interface.ActionTypes) => {
	switch (action.type) {
		case Type.SUCCESS_AUTHENTICATION_REQUEST:
			return action.payload
		case Type.ERROR_AUTHENTICATION_REQUEST:
			return action.payload
		default:
			return state
	}
}

export const settingsReducer = (state: Interface.SettingInterface = {
	application: {
		deskripsi_sekolah: "",
		semester: 0,
		nama_sekolah: "School",
		tahun_ajaran: 0
	},
	loading: false,
	error: false,
	errorMsg: ""
}, action: Interface.ActionTypes) => {
	switch (action.type) {
		case Type.START_READ_SETTINGS_RECORD:
			return {... state, loading: true}
		case Type.READ_SETTINGS_RECORD:
			return { ...state, ...action.payload, error: false, errorMsg: "", loading: false }
		case Type.FAILED_READ_SETTINGS_RECORD:
			return { ...state, error: true, errorMsg: action.payload.data.message, loading: false }
		default:
			return state
	}
}

export const activityReducer = (state: any = [], action: Interface.ActionTypes) => {
	switch (action.type) {
        case Type.ADD_STATE:
            return [
                ...state
            ]
		default:
			return state;
	}
};

export const authReducer = (state: Readonly<boolean> = false, action: Interface.ActionTypes): boolean => {
	switch (action.type) {
		case Type.SUCCESS_AUTHENTICATION_REQUEST: return true;
		case Type.SUCCESS_VALIDATING_CLIENT_TOKEN: return true;
		case Type.ERROR_AUTHENTICATION_REQUEST: return false
		default: return state;
	}
}

export const refreshLoading = (state: boolean = false, action: Interface.ActionTypes): boolean => {
	switch (action.type) {
		case Type.START_REQUEST_REFRESH_TOKEN: return true
		case Type.SUCCESS_VALIDATING_CLIENT_TOKEN: return false
		case Type.ERROR_VALIDATING_CLIENT_TOKEN: return false
		default: return state
	}
}

export const refreshResult = (state: boolean = true, action: Interface.ActionTypes): boolean => {
	switch (action.type) {
		case Type.START_REQUEST_REFRESH_TOKEN: return true
		case Type.SUCCESS_VALIDATING_CLIENT_TOKEN: return true
		case Type.ERROR_VALIDATING_CLIENT_TOKEN: return false
		default: return state
	}
}

export const classData = (state: Interface.StateInterface = {data: [], loading: false}, action: Interface.ActionTypes) => {
	switch (action.type) {
		case Type.START_READ_CLASS_RECORDS:
			return {
				...state,
				data: [],
				loading: true
			}
			case Type.READ_CLASS_RECORDS:
			return {
				...state,
				data: action.payload || [],
				loading: false
			}
		case Type.FAILED_READ_CLASS_RECORDS:
			return {
				...state,
				data: [],
				loading: false
			}
		default:
			return state
		}
}

export const studentScore = (state: Interface.StateInterface = {data: [], loading: false}, action: Interface.ActionTypes) => {
	switch (action.type) {
		case Type.START_READ_EXAM_SCORE: {
			return {
				...state, data: [], loading: true
			}
		}
		case Type.READ_EXAM_SCORE: {
			return {
				...state, data: action.payload || [], loading: false
			}
		}
		case Type.FAILED_READ_EXAM_SCORE: {
			return {
				...state, data: [], loading: false
			}
		}
		default: return state
	}
}

export const miscData = (state: Interface.MiscInterface = {
	grades: {data: [], loading: false},
	examTypes: {data: [], loading: false}
}, action: Interface.ActionTypes) => {
	switch (action.type) {
		case Type.READ_GRADE_RECORD:
			return { ...state, grades: {data: action.payload, loading: false}}
		case Type.READ_EXAM_TYPES:
			return { ...state, examTypes: {data: action.payload, loading: false}}
		case Type.FAILED_READ_EXAM_TYPES:
			return { ...state, examTypes: {data: [], loading: false}}
		case Type.START_READ_EXAM_TYPES:
			return { ...state, examTypes: {data: [], loading: true}}
		case Type.FAILED_READ_GRADE_RECORD:
			return { ...state, grades: {data: [], loading: false}}
		case Type.START_READ_GRADE_RECORD:
			return {...state, grades: {data: [], loading: true}}
        default:
			return state;
	}
}

export const subjectData = (state: Interface.StateInterface = {data: [], loading: false}, action: Interface.ActionTypes) => {
	switch (action.type) {
		case Type.START_READ_SUBJECT_RECORDS:
			return {
				...state,
				data: [],
				loading: true
			}
			case Type.READ_SUBJECT_RECORDS:
			return {
				...state,
				data: action.payload || [],
				loading: false
			}
		case Type.FAILED_READ_SUBJECT_RECORDS:
			return {
				...state,
				data: [],
				loading: false
			}
		default:
			return state
		}
}


export const competenceData = (state: Interface.StateInterface = {data: [], loading: false}, action: Interface.ActionTypes) => {
	switch (action.type) {
		case Type.START_READ_COMPETENCE_RECORDS:
			return { ...state, data: [], loading: true }
			case Type.READ_COMPETENCE_RECORDS:
			return { ...state, data: action.payload || [], loading: false }
		case Type.FAILED_READ_COMPETENCE_RECORDS:
			return { ...state, data: [], loading: false }
		default:
			return state
		}
}

export const uhPerMapel = (state: Interface.StateInterface = {data: [], loading: false}, action: Interface.ActionTypes) => {
	switch (action.type) {
		case Type.START_READ_EXAM_SCORE_PER_MAPEL:
			return { ...state, data: state.data, loading: true }
		case Type.READ_EXAM_SCORE_PER_MAPEL:
			return { ...state, data: [...state.data, ...action.payload] || [], loading: false }
		case Type.FAILED_READ_EXAM_SCORE_PER_MAPEL:
			return { ...state, data: [], loading: false }
		default:
			return state
	}
}

export const inputNilai = (state: Interface.ExamInterface = {
	siswa: {data: [], loading: false},
	mapel: {data: [], loading: false},
	materi: {data: [], loading: false},
	examStd: {data: [], loading: false}
}, action: Interface.ActionTypes) => {
	switch (action.type) {
		case Type.START_READ_EXAM_STUDENT:
			return {...state, siswa: {data: [], loading: true}}
		case Type.READ_EXAM_STUDENT:
			return {...state, siswa: {data: action.payload || [], loading: false}}
		case Type.FAILED_READ_EXAM_STUDENT:
			return {...state, siswa: {data: [], loading: false}}
		case Type.START_READ_EXAM_DATA:
			return {...state, examStd: {data: [], loading: true}}
		case Type.READ_EXAM_DATA:
			return {...state, examStd: {data: action.payload || [], loading: false}}
		case Type.FAILED_READ_EXAM_DATA:
			return {...state, examStd: {data: [], loading: false}}
		case Type.START_READ_EXAM_SUBJECT:
			return {...state, mapel: {data: [], loading: true}}
		case Type.READ_EXAM_SUBJECT:
			return {...state, mapel: {data: action.payload || [], loading: false}}
		case Type.FAILED_READ_EXAM_SUBJECT:
			return {...state, mapel: {data: [], loading: false}}
		case Type.START_READ_EXAM_MATERIAL:
			return {...state, materi: {data: [], loading: true}}
		case Type.READ_EXAM_MATERIAL:
			return {...state, materi: {data: action.payload || [], loading: false}}
		case Type.FAILED_READ_EXAM_MATERIAL:
			return {...state, materi: {data: [], loading: false}}
		default:
			return state
	}
}

export const inputRemedy = (state: Interface.RemedyInterface = {
	siswa: {data: [], loading: false},
	mapel: {data: [], loading: false},
	materi: {data: [], loading: false},
	scoreData: {data: [], loading: false}
}, action: Interface.ActionTypes) => {
	switch (action.type) {
		case Type.START_READ_REMEDY_STUDENT:
			return {...state, siswa: {data: [], loading: true}}
		case Type.START_READ_REMEDY_MATERIAL:
			return {...state, materi: {data: [], loading: true}}
		case Type.START_READ_REMEDY_SUBJECT:
			return {...state, mapel: {data: [], loading: true}}
		case Type.FAILED_READ_REMEDY_STUDENT:
			return {...state, siswa: {data: [], loading: false}}
		case Type.FAILED_READ_REMEDY_MATERIAL:
			return {...state, materi: {data: [], loading: false}}
		case Type.FAILED_READ_REMEDY_SUBJECT:
			return {...state, mapel: {data: [], loading: false}}
		case Type.READ_REMEDY_STUDENT:
			return {...state, siswa: {data: action.payload || [], loading: false}}
		case Type.READ_REMEDY_SUBJECT:
			return {...state, mapel: {data: action.payload || [], loading: false}}
		case Type.READ_REMEDY_MATERIAL:
			return {...state, materi: {data: action.payload || [], loading: false}}
		case Type.READ_REMEDY_SCORE:
			return {...state, scoreData: {data: action.payload || [], loading: false}}
		case Type.START_READ_REMEDY_SCORE:
			return {...state, scoreData: {data: [], loading: true}}
		case Type.FAILED_READ_REMEDY_SCORE:
			return {...state, scoreData: {data: [], loading: false}}
		default:
			return state
	}
}

export const requestReducer = (state: Interface.CrudResponse = {status: "", message: "", loading: false}, action: Interface.ActionTypes) => {
	if (action.type === Type.INSERT_TEACHER_RECORDS 
		|| action.type === Type.INSERT_STUDENT_RECORDS
		|| action.type === Type.INSERT_COMPETENCE_RECORDS
		|| action.type === Type.INSERT_CLASS_RECORDS
		|| action.type === Type.INSERT_SUBJECT_RECORDS
		|| action.type === Type.UPDATE_TEACHER_RECORDS
		|| action.type === Type.UPDATE_CLASS_RECORDS
		|| action.type === Type.UPDATE_COMPETENCE_RECORDS
		|| action.type === Type.UPDATE_SUBJECT_RECORDS
		|| action.type === Type.UPDATE_STUDENT_RECORDS
		|| action.type === Type.DELETE_TEACHER_RECORDS
		|| action.type === Type.DELETE_SUBJECT_RECORDS
		|| action.type === Type.DELETE_COMPETENCE_RECORDS
		|| action.type === Type.DELETE_CLASS_RECORDS
		|| action.type === Type.DELETE_STUDENT_RECORDS
		|| action.type === Type.FAILED_INSERT_TEACHER_RECORDS 
		|| action.type === Type.FAILED_INSERT_COMPETENCE_RECORDS
		|| action.type === Type.FAILED_INSERT_CLASS_RECORDS 
		|| action.type === Type.FAILED_INSERT_SUBJECT_RECORDS
		|| action.type === Type.FAILED_INSERT_SUDENT_RECORDS
		|| action.type === Type.FAILED_UPDATE_TEACHER_RECORDS
		|| action.type === Type.FAILED_UPDATE_COMPETENCE_RECORDS
		|| action.type === Type.FAILED_UPDATE_SUBJECT_RECORDS
		|| action.type === Type.FAILED_UPDATE_CLASS_RECORDS 
		|| action.type === Type.FAILED_UPDATE_STUDENT_RECORDS
		|| action.type === Type.FAILED_DELETE_TEACHER_RECORDS
		|| action.type === Type.FAILED_DELETE_SUBJECT_RECORDS
		|| action.type === Type.FAILED_DELETE_COMPETENCE_RECORDS
		|| action.type === Type.FAILED_DELETE_CLASS_RECORDS 
		|| action.type === Type.FAILED_DELETE_STUDENT_RECORDS
		) {
		return {
			...state,
			status: action.payload.status,
			message: action.payload.message,
			loading: false
		}
	} else if (action.type === Type.RESET_REQUEST_STATE) {
		return {
			...state,
			status: "",
			message: "",
			loading: false
		}
	} else if (action.type === Type.START_TODO_REQUEST) {
		return {
			...state,
			status: "loading",
			loading: true
		}
	}else {
		return state
	}
	
}
