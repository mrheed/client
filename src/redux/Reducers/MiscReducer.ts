import * as Type from './../ActionType';
import * as Interface from './../ReduxInterfaces';

export const classOnSchoolYear = (state: any = {
    is_loading: false,
    is_requested: false,
    grade_on_school_year: {},
    school_year_on_grade: {}
}, action: Interface.ActionTypes) => {
    switch (action.type) {
        case Type.GET_GRADE_WITH_CURRENT_SCHOOL_YEAR:
            return {...state, is_loading: true}
        case Type.PROCESS_GRADE_WITH_CURRENT_SCHOOL_YEAR:
            return {...state, ...action.payload, is_loading: false, is_requested: true}
        case Type.ERROR_GET_GRADE_WITH_CURRENT_SCHOOL_YEAR:
            return {...state, is_loading: false, is_requested: false}
        default:
            return state
    }

}

export const dashboardInfo = (state: any = {
    is_loading: false,
    is_requested: false,
    teacher_count: 0,
    student_count: 0,
    class_count: 0,
    rank_data: [{_id: 0, data: [{kelas: "tidak ada", nama: "tidak ada", nis: 0, rank: 0, rata_rata: 0}]}]
}, action: Interface.ActionTypes) => {
    switch (action.type) {
        case Type.GET_DASHBOARD_INFO:
            return {...state, is_loading: true}
        case Type.PROCESS_DASHBOARD_INFO:
            return {...state, ...action.payload, is_loading: false, is_requested: true}
        case Type.ERROR_GET_DASHBOARD_INFO:
            return {...state, is_loading: false, is_requested: false}
        default:
            return state
    }
}
