import * as Type from './../ActionType';
import * as Interface from './../ReduxInterfaces';

export const inputTugas = (state: Interface.TaskInterface = {
    siswa: { data: [], loading: false },
    mapel: { data: [], loading: false },
    result: { data: [], loading: false }
}, action: Interface.ActionTypes) => {
    switch (action.type) {
        case Type.START_READ_TASK_STUDENT:
            return { ...state, siswa: { data: [], loading: true } }
        case Type.START_READ_TASK_SUBJECT:
            return { ...state, mapel: { data: [], loading: true } }
        case Type.FAILED_READ_TASK_STUDENT:
            return { ...state, siswa: { data: [], loading: false } }
        case Type.FAILED_READ_TASK_SUBJECT:
            return { ...state, mapel: { data: [], loading: false } }
        case Type.READ_TASK_STUDENT:
            return { ...state, siswa: { data: action.payload || [], loading: false } }
        case Type.READ_TASK_SUBJECT:
            return { ...state, mapel: { data: action.payload || [], loading: false } }
        case Type.READ_TASK_RESULT:
            return { ...state, result: { data: action.payload || [], loading: false } }
        case Type.START_READ_TASK_RESULT:
            return { ...state, result: { data: [], loading: true } }
        case Type.FAILED_READ_TASK_RESULT:
            return { ...state, result: { data: [], loading: false } }
        default:
            return state
    }
}