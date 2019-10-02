import * as Type from './../ActionType';
import * as Interface from './../ReduxInterfaces';

export const reportReducer = (state: Interface.ReportInterface = {
    siswa: { data: [], loading: false },
    mapel: { data: [], loading: false },
    materi: { data: [], loading: false },
    task_name: { data: [], loading: false },
    result: { data: [], loading: false },
}, action: Interface.ActionTypes) => {
    switch (action.type) {
        case Type.START_READ_REPORT_STUDENT:
            return { ...state, siswa: { data: [], loading: true } }
        case Type.START_READ_REPORT_MATERIAL:
            return { ...state, materi: { data: [], loading: true } }
        case Type.START_READ_REPORT_SUBJECT:
            return { ...state, mapel: { data: [], loading: true } }
        case Type.FAILED_READ_REPORT_STUDENT:
            return { ...state, siswa: { data: [], loading: false } }
        case Type.FAILED_READ_REPORT_MATERIAL:
            return { ...state, materi: { data: [], loading: false } }
        case Type.FAILED_READ_REPORT_SUBJECT:
            return { ...state, mapel: { data: [], loading: false } }
        case Type.READ_REPORT_STUDENT:
            return { ...state, siswa: { data: action.payload || [], loading: false } }
        case Type.READ_REPORT_SUBJECT:
            return { ...state, mapel: { data: action.payload || [], loading: false } }
        case Type.READ_REPORT_MATERIAL:
            return { ...state, materi: { data: action.payload || [], loading: false } }
        case Type.START_READ_REPORT_TASK_NAME:
            return { ...state, task_name: { data: [], loading: true } }
        case Type.READ_REPORT_TASK_NAME:
            return { ...state, task_name: { data: action.payload || [], loading: false } }
        case Type.FAILED_READ_REPORT_TASK_NAME:
            return { ...state, task_name: { data: [], loading: false } }
        case Type.START_READ_REPORT_RESULT:
            return { ...state, result: { data: [], loading: true } }
        case Type.READ_REPORT_RESULT:
            return { ...state, result: { data: action.payload || [], loading: false } }
        case Type.FAILED_READ_REPORT_RESULT:
            return { ...state, result: { data: [], loading: false } }
        case Type.RESET_REPORT_RESULT_STATE:
            return { ...state, result: { data: [], loading: false } }
        default:
            return state
    }
}