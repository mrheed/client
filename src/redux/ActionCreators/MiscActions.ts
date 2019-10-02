import { Dispatch } from 'react';
import * as Type from '../ActionType';
import * as url from './ActionURL';

export function getGradesWithCurrentSchoolYear() {
    return (dispatch: Dispatch<any>) => {
        dispatch({type: Type.GET_GRADE_WITH_CURRENT_SCHOOL_YEAR, payload: {
            method: "get",
            url: url.misc+"/class_on_school_year"+url.date,
            type: {
                success: Type.PROCESS_GRADE_WITH_CURRENT_SCHOOL_YEAR,
                error: Type.ERROR_GET_GRADE_WITH_CURRENT_SCHOOL_YEAR
            }
        }})
    }
}

export function getDashboardInfo(tahun_ajaran: number = 0) {
    return (dispatch: Dispatch<any>) => {
        dispatch({type: Type.GET_DASHBOARD_INFO, payload: {
            method: "get",
            url: url.misc+"/dashboard_info"+url.date+"&tahun_ajaran="+tahun_ajaran,
            type: {
                success: Type.PROCESS_DASHBOARD_INFO,
                error: Type.ERROR_GET_DASHBOARD_INFO
            }
        }})
    }
}

export function readExamTypes() {
    return (dispatch: Dispatch<any>) => {
        dispatch({type: Type.START_READ_EXAM_TYPES, payload: {
            method: "get",
            url: url.misc+"/extype"+url.date,
            type: {
                success: Type.READ_EXAM_TYPES,
                error: Type.FAILED_READ_EXAM_TYPES
            }
        }})
    }
}

export function readGradesList() {
    return (dispatch: Dispatch<any>) => {
        dispatch({type: Type.START_READ_GRADE_RECORD, payload: {
            method: "get",
            url: url.misc+"/grades"+url.date,
            type: {
                success: Type.READ_GRADE_RECORD,
                error: Type.FAILED_READ_GRADE_RECORD
            }
        }})
    }
}