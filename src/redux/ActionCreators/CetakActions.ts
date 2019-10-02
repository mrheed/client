import { Dispatch } from 'react';
import * as Type from '../ActionType';
import * as url from './ActionURL';

export function readReportStudent(type: string, opt?: string) {
    return (dispatch: Dispatch<any>) => {
        dispatch({
            type: Type.START_READ_REPORT_STUDENT, payload: {
                method: "get",
                url: url.cetak + "/" + type + "/student" + url.date + opt!,
                type: {
                    success: Type.READ_REPORT_STUDENT,
                    error: Type.FAILED_READ_REPORT_STUDENT
                }
            }
        })
    }
}

export function readReportSubject(type: string, opt?: string) {
    return (dispatch: Dispatch<any>) => {
        dispatch({
            type: Type.START_READ_REPORT_SUBJECT, payload: {
                method: "get",
                url: url.cetak + "/" + type + "/subject" + url.date + opt!,
                type: {
                    success: Type.READ_REPORT_SUBJECT,
                    error: Type.FAILED_READ_REPORT_SUBJECT
                }
            }
        })
    }
}

export function readReportExamMaterial(type: string, opt?: string) {
    return (dispatch: Dispatch<any>) => {
        dispatch({
            type: Type.START_READ_REPORT_MATERIAL, payload: {
                method: "get",
                url: url.cetak + "/" + type + "/material" + url.date + opt!,
                type: {
                    success: Type.READ_REPORT_MATERIAL,
                    error: Type.FAILED_READ_REPORT_MATERIAL
                }
            }
        })
    }
}

export function readReportTaskName(opt?: string) {
    return (dispatch: Dispatch<any>) => {
        dispatch({
            type: Type.START_READ_REPORT_TASK_NAME, payload: {
                method: "get",
                url: url.cetak + "/assignment/task_name" + url.date + opt!,
                type: {
                    success: Type.READ_REPORT_TASK_NAME,
                    error: Type.FAILED_READ_REPORT_TASK_NAME
                }
            }
        })
    }
}

export function readReportExamResult(opt?: string) {
    return (dispatch: Dispatch<any>) => {
        dispatch({
            type: Type.START_READ_REPORT_RESULT, payload: {
                method: "get",
                url: url.cetak + "/result_rapor/exam_result" + url.date + opt!,
                type: {
                    success: Type.READ_REPORT_RESULT,
                    error: Type.FAILED_READ_REPORT_RESULT
                }
            }
        })
    }
}

export function readReportTaskResult(opt?: string) {
    return (dispatch: Dispatch<any>) => {
        dispatch({
            type: Type.START_READ_REPORT_RESULT, payload: {
                method: "get",
                url: url.cetak + "/result_rapor/task_result" + url.date + opt!,
                type: {
                    success: Type.READ_REPORT_RESULT,
                    error: Type.FAILED_READ_REPORT_RESULT
                }
            }
        })
    }
}

export function readReportResult(opt?: string) {
    return (dispatch: Dispatch<any>) => {
        dispatch({
            type: Type.START_READ_REPORT_RESULT, payload: {
                method: "get",
                url: url.cetak + "/result_rapor/final_result" + url.date + opt!,
                type: {
                    success: Type.READ_REPORT_RESULT,
                    error: Type.FAILED_READ_REPORT_RESULT
                }
            }
        })
    }
}