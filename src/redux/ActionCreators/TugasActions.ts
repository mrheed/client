import { Dispatch } from 'react';
import * as Type from '../ActionType';
import * as url from './ActionURL';

export function readTaskStudent(opt?: string) {
    return (dispatch: Dispatch<any>) => {
        dispatch({
            type: Type.START_READ_TASK_STUDENT, payload: {
                method: "get",
                url: url.nilai + "/tugas" + url.date + "&state=task&var=student" + opt!,
                type: {
                    success: Type.READ_TASK_STUDENT,
                    error: Type.FAILED_READ_TASK_STUDENT
                }
            }
        })
    }
}

export function readTaskSubject(opt?: string) {
    return (dispatch: any) => {
        dispatch({
            type: Type.START_READ_TASK_SUBJECT, payload: {
                method: "get",
                url: url.nilai + "/tugas" + url.date + "&state=task&var=subject" + opt!,
                type: {
                    success: Type.READ_TASK_SUBJECT,
                    error: Type.FAILED_READ_TASK_SUBJECT
                }
            }
        })
    }
}


export function readTaskResult(opt?: string) {
    return (dispatch: any) => {
        dispatch({
            type: Type.START_READ_TASK_RESULT, payload: {
                method: "get",
                url: url.nilai + "/tugas" + url.date + "&state=task&var=result" + opt!,
                type: {
                    success: Type.READ_TASK_RESULT,
                    error: Type.FAILED_READ_TASK_RESULT
                }
            }
        })
    }
}

export function insertTaskResult(data: any) {
    return (dispatch: any) => {
        dispatch({
            type: Type.START_INSERT_TASK_RESULT, payload: {
                method: "post",
                url: url.nilai + "/tugas" + url.date,
                data: data,
                type: {
                    success: Type.INSERT_TASK_RESULT,
                    error: Type.FAILED_INSERT_TASK_RESULT
                }
            }
        })
    }
}