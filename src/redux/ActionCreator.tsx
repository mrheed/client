import axios, { AxiosResponse } from 'axios';
import { Dispatch } from 'react';
import { SelectCookie, DeleteCookie, checkCookieValue } from "../Helpers";
import * as Type from './ActionType';
import * as Interface from './ReduxInterfaces';
import * as url from './ActionCreators/ActionURL';

function catchDispatch(type: string, response: any, dispatch: Dispatch<any>) {
    dispatch({type: Type.RESET_REQUEST_STATE})
    dispatch({type: type, payload: response.data})
    dispatch({type: Type.RESET_REQUEST_STATE})
}

export function makeAuthenticationRequest(data: Interface.AuthData) {
    return (dispatch: Dispatch<any>): void => {
        dispatch({type: Type.START_REQUEST_AUTH_DATA})
        axios.post(url.auth, JSON.stringify(data))
            .then((response: AxiosResponse<any>): Function | void => 
                dispatch({type: Type.SUCCESS_AUTHENTICATION_REQUEST, payload: response.data}))
            .catch(({response}: any): Function | void => 
                dispatch({type: Type.ERROR_AUTHENTICATION_REQUEST, payload: response ? response.data : "Gagal terhubung, cek koneksi anda!"}))
    }
}

export function removeSessionClient(token: string){
    return (dispatch: Dispatch<any>): any => {
        dispatch({type: Type.MAKE_LOGOUT_REQUEST_WITH_TOKEN})
        axios.post(url.purge, null, {headers: {"Authorization": "Bearer " + token}})
        .then(async ({data}: AxiosResponse): Promise<string[][]> => DeleteCookie(["token"], ["/", "/dashboard"]))
        .then(() => window.location.reload())
        .catch((error: any): string[][] => DeleteCookie(["token"], ["/", "/dashboard"]))
    }
}

export function sendClientTokenToServer() {
    return (dispatch: Dispatch<any>): any => {
        var Token = SelectCookie("token")[0]
        if (SelectCookie("token").length == 0 || Token == "") return false
        dispatch({type: Type.START_REQUEST_REFRESH_TOKEN})
        return axios.post(url.refresh, null, {headers: {"Authorization": "Bearer " + Token}})
        .then(async ({data}: AxiosResponse): Promise<Function | void> => dispatch({type: Type.SUCCESS_VALIDATING_CLIENT_TOKEN, payload: data}))
        .catch((error: any): Function | void => dispatch({type: Type.ERROR_VALIDATING_CLIENT_TOKEN, payload: error})) 
    }
}

export function makeStudentRequest() {
    return (dispatch: Dispatch<any>): any => {
        dispatch({type: Type.START_REQUEST_PERSON_DATA})
        if (checkCookieValue("token")) {
        return axios.get(url.student, {headers: {"Authorization": "Bearer " + SelectCookie("token")[0]}})
        .then(async ({data}: AxiosResponse): Promise<Function | void> => dispatch({type: Type.SUCCESS_REQUEST_PERSON_DATA, payload: data}))
        .catch(({response}: any) => dispatch({type: Type.ERROR_REQUEST_PERSON_DATA, payload: response.data}))
    }}
}

export function deleteStudentRecords(data: any) {
    return (dispatch: Dispatch<any>) => {
        var Token = SelectCookie("token")[0]
        if (SelectCookie("token").length === 0 || Token === "" || Token === undefined) return false
        dispatch({type: Type.START_TODO_REQUEST})
        return axios.delete(url.student, {
            data: data,
            headers: {
                "Authorization": "Bearer " + Token
            }
        })
        .then(({data}: AxiosResponse) => dispatch({type: Type.DELETE_STUDENT_RECORDS, payload: data}))
        .then(() => dispatch({type: Type.RESET_REQUEST_STATE}))
        .catch(({response}: any) => catchDispatch(Type.FAILED_DELETE_STUDENT_RECORDS, response, dispatch))
    }
}

export function insertStudentRecords(data: any) {
    return (dispatch: Dispatch<any>) => {
        if (checkCookieValue("token")) {
            dispatch({type: Type.START_TODO_REQUEST})
            return axios.post(url.student, JSON.stringify(data), {headers: {"Authorization": "Bearer " + SelectCookie("token")[0]}})
                .then(({data}: AxiosResponse) => dispatch({type: Type.INSERT_STUDENT_RECORDS, payload: data}))
                .then(() => dispatch({type: Type.RESET_REQUEST_STATE}))
                .catch(({response}: any) => catchDispatch(Type.FAILED_INSERT_SUDENT_RECORDS, response, dispatch))
        }
        
        return false
    }
}

export function updateStudentRecords(data: any) {
    return (dispatch: Dispatch<any>) => {
        if (checkCookieValue("token")) {
            dispatch({type: Type.START_TODO_REQUEST})
            return axios.put(url.student, JSON.stringify(data), {headers: {"Authorization": "Bearer " + SelectCookie("token")[0]}})
                .then(({data}: AxiosResponse) => dispatch({type: Type.UPDATE_STUDENT_RECORDS, payload: data}))
                .then(() => dispatch({type: Type.RESET_REQUEST_STATE}))
                .catch(({response}: any) => catchDispatch(Type.FAILED_UPDATE_STUDENT_RECORDS, response, dispatch))
        }
        return false
    }
}

export function readTeacherRecords() {
    return (dispatch: any) => {
        dispatch({type: Type.START_READ_TEACHER_RECORDS, payload: {
            method: "get",
            url: url.teacher+url.date,
            type: {
                success: Type.READ_TEACHER_RECORDS,
                error: Type.FAILED_READ_TEACHER_RECORDS
            }
        }})
    }
}

export function deleteTeacherRecords(data: any) {
    return (dispatch: Dispatch<any>) => {
        if (checkCookieValue("token")) {
            dispatch({type: Type.START_TODO_REQUEST})
            return axios.delete(url.teacher+url.date, {headers: {"Authorization": "Bearer " + SelectCookie("token")[0]}, data: data})
                .then(({data}: AxiosResponse) => dispatch({type: Type.DELETE_TEACHER_RECORDS, payload: data}))
                .then(() => dispatch({type: Type.RESET_REQUEST_STATE}))
                .catch(({response}: any) => catchDispatch(Type.FAILED_DELETE_TEACHER_RECORDS, response, dispatch)) 
        }
        return false
    }
}

export function insertTeacherRecords(data: any) {
    return (dispatch: Dispatch<any>) => {
        if (checkCookieValue("token")) {
            dispatch({type: Type.START_TODO_REQUEST})
            return axios.post(url.teacher+url.date, JSON.stringify(data), {headers: {"Authorization": "Bearer " + SelectCookie("token")[0]}})
                .then(({data}: AxiosResponse) => dispatch({type: Type.INSERT_TEACHER_RECORDS, payload: data}))
                .then(() => dispatch({type: Type.RESET_REQUEST_STATE}))
                .catch(({response}: any) => catchDispatch(Type.FAILED_INSERT_TEACHER_RECORDS, response, dispatch)) 
        }
        return false
    }
}

export function updateTeacherRecords(data: any) {
    return (dispatch: Dispatch<any>) => {
        if (checkCookieValue("token")) {
            dispatch({type: Type.START_TODO_REQUEST})
            return axios.put(url.teacher+url.date, JSON.stringify(data), {headers: {"Authorization": "Bearer " + SelectCookie("token")[0]}})
                .then(({data}: AxiosResponse) => dispatch({type: Type.UPDATE_TEACHER_RECORDS, payload: data}))
                .then(() => dispatch({type: Type.RESET_REQUEST_STATE}))
                .catch(({response}: any) => catchDispatch(Type.FAILED_UPDATE_TEACHER_RECORDS, response, dispatch)) 
        }
        return false
    }
}
export function readClassRecords() {
    return (dispatch: any) => {
        dispatch({type: Type.START_READ_CLASS_RECORDS, payload: {
            method: "get",
            url: url.kelas+url.date,
            type: {
                success: Type.READ_CLASS_RECORDS,
                error: Type.FAILED_READ_CLASS_RECORDS
            }
        }})
    }
}

export function deleteClassRecords(data: any) {
    return (dispatch: Dispatch<any>) => {
        if (checkCookieValue("token")) {
            dispatch({type: Type.START_TODO_REQUEST})
            return axios.delete(url.kelas, {headers: {"Authorization": "Bearer " + SelectCookie("token")[0]}, data: data})
                .then(({data}: AxiosResponse) => dispatch({type: Type.DELETE_CLASS_RECORDS, payload: data}))
                .then(() => dispatch({type: Type.RESET_REQUEST_STATE}))
                .catch(({response}: any) => catchDispatch(Type.FAILED_DELETE_CLASS_RECORDS, response, dispatch)) 
        }
        return false
    }
}

export function insertClassRecords(data: any) {
    return (dispatch: Dispatch<any>) => {
        if (checkCookieValue("token")) {
            dispatch({type: Type.START_TODO_REQUEST})
            return axios.post(url.kelas, JSON.stringify(data), {headers: {"Authorization": "Bearer " + SelectCookie("token")[0]}})
                .then(({data}: AxiosResponse) => dispatch({type: Type.INSERT_CLASS_RECORDS, payload: data}))
                .then(() => dispatch({type: Type.RESET_REQUEST_STATE}))
                .catch(({response}: any) => catchDispatch(Type.FAILED_INSERT_CLASS_RECORDS, response, dispatch)) 
        }
        return false
    }
}
export function updateClassRecords(data: any) {
    return (dispatch: Dispatch<any>) => {
        if (checkCookieValue("token")) {
            dispatch({type: Type.START_TODO_REQUEST})
            return axios.put(url.kelas, JSON.stringify(data), {headers: {"Authorization": "Bearer " + SelectCookie("token")[0]}})
                .then(({data}: AxiosResponse) => dispatch({type: Type.UPDATE_CLASS_RECORDS, payload: data}))
                .then(() => dispatch({type: Type.RESET_REQUEST_STATE}))
                .catch(({response}: any) => catchDispatch(Type.FAILED_UPDATE_CLASS_RECORDS, response, dispatch)) 
        }
        return false
    }
}
export function readSubjectRecords() {
    return (dispatch: Dispatch<any>) => {
        if (checkCookieValue("token")) {
            dispatch({type: Type.START_READ_SUBJECT_RECORDS})
            return axios.get(url.subject, {headers: {"Authorization": "Bearer " + SelectCookie("token")[0]}})
                .then(({data}: AxiosResponse) => dispatch({type: Type.READ_SUBJECT_RECORDS, payload: data}))
                .catch(({response}: any) => dispatch({type: Type.FAILED_READ_SUBJECT_RECORDS, payload: response})) 
        }
        return false
    }
}
export function deleteSubjectRecords(data: any) {
    return (dispatch: Dispatch<any>) => {
        if (checkCookieValue("token")) {
            dispatch({type: Type.START_TODO_REQUEST})
            return axios.delete(url.subject, {headers: {"Authorization": "Bearer " + SelectCookie("token")[0]}, data: data})
                .then(({data}: AxiosResponse) => dispatch({type: Type.DELETE_SUBJECT_RECORDS, payload: data}))
                .then(() => dispatch({type: Type.RESET_REQUEST_STATE}))
                .catch(({response}: any) => catchDispatch(Type.FAILED_DELETE_SUBJECT_RECORDS, response, dispatch)) 
        }
        return false
    }
}
export function insertSubjectRecords(data: any) {
    return (dispatch: Dispatch<any>) => {
        if (checkCookieValue("token")) {
            dispatch({type: Type.START_TODO_REQUEST})
            return axios.post(url.subject, JSON.stringify(data), {headers: {"Authorization": "Bearer " + SelectCookie("token")[0]}})
                .then(({data}: AxiosResponse) => dispatch({type: Type.INSERT_SUBJECT_RECORDS, payload: data}))
                .then(() => dispatch({type: Type.RESET_REQUEST_STATE}))
                .catch(({response}: any) => catchDispatch(Type.FAILED_INSERT_SUBJECT_RECORDS, response, dispatch)) 
        }
        return false
    }
}

export function updateSubjectRecords(data: any) {
    return (dispatch: Dispatch<any>) => {
        if (checkCookieValue("token")) {
            dispatch({type: Type.START_TODO_REQUEST})
            return axios.put(url.subject, JSON.stringify(data), {headers: {"Authorization": "Bearer " + SelectCookie("token")[0]}})
                .then(({data}: AxiosResponse) => dispatch({type: Type.UPDATE_SUBJECT_RECORDS, payload: data}))
                .then(() => dispatch({type: Type.RESET_REQUEST_STATE}))
                .catch(({response}: any) => catchDispatch(Type.FAILED_UPDATE_SUBJECT_RECORDS, response, dispatch)) 
        }
        return false
    }
}

export function readCompetenceRecords() {
    return (dispatch: Dispatch<any>) => {
        if (checkCookieValue("token")) {
            dispatch({type: Type.START_READ_COMPETENCE_RECORDS})
            return axios.get(url.competence, {headers: {"Authorization": "Bearer " + SelectCookie("token")[0]}})
                .then(({data}: AxiosResponse) => dispatch({type: Type.READ_COMPETENCE_RECORDS, payload: data}))
                .catch(({response}: any) => dispatch({type: Type.FAILED_READ_COMPETENCE_RECORDS, payload: response})) 
        }
        return false
    }
}
export function deleteCompetenceRecords(data: any) {
    return (dispatch: Dispatch<any>) => {
        if (checkCookieValue("token")) {
            dispatch({type: Type.START_TODO_REQUEST})
            return axios.delete(url.competence, {headers: {"Authorization": "Bearer " + SelectCookie("token")[0]}, data: data})
                .then(({data}: AxiosResponse) => dispatch({type: Type.DELETE_COMPETENCE_RECORDS, payload: data}))
                .then(() => dispatch({type: Type.RESET_REQUEST_STATE}))
                .catch(({response}: any) => catchDispatch(Type.FAILED_DELETE_COMPETENCE_RECORDS, response, dispatch)) 
        }
        return false
    }
}
export function insertCompetenceRecords(data: any) {
    return (dispatch: Dispatch<any>) => {
        if (checkCookieValue("token")) {
            dispatch({type: Type.START_TODO_REQUEST})
            return axios.post(url.competence, JSON.stringify(data), {headers: {"Authorization": "Bearer " + SelectCookie("token")[0]}})
                .then(({data}: AxiosResponse) => dispatch({type: Type.INSERT_COMPETENCE_RECORDS, payload: data}))
                .then(() => dispatch({type: Type.RESET_REQUEST_STATE}))
                .catch(({response}: any) => catchDispatch(Type.FAILED_INSERT_COMPETENCE_RECORDS, response, dispatch)) 
        }
        return false
    }
}

export function updateCompetenceRecords(data: any) {
    return (dispatch: Dispatch<any>) => {
        if (checkCookieValue("token")) {
            dispatch({type: Type.START_TODO_REQUEST})
            return axios.put(url.competence, JSON.stringify(data), {headers: {"Authorization": "Bearer " + SelectCookie("token")[0]}})
                .then(({data}: AxiosResponse) => dispatch({type: Type.UPDATE_COMPETENCE_RECORDS, payload: data}))
                .then(() => dispatch({type: Type.RESET_REQUEST_STATE}))
                .catch(({response}: any) => catchDispatch(Type.FAILED_UPDATE_COMPETENCE_RECORDS, response, dispatch)) 
        }
        return false
    }
}

export function readExamRecords(data: any){
    return (dispatch: Dispatch<any>) => {
        dispatch({type: Type.START_READ_EXAM_SCORE, payload: {
            method: "get",
            url: url.nilai+"/aggregate"+url.date+"&type=total_mapel",
            type: {
                success: Type.READ_EXAM_SCORE,
                error: Type.FAILED_READ_EXAM_SCORE
            }
        }})
    }
}

export function readExamRecordPerSubject(data: any){
    return (dispatch: Dispatch<any>) => {
        dispatch({type: Type.START_READ_EXAM_SCORE_PER_MAPEL, payload: {
            method: "get",
            url: url.nilai+"/aggregate"+url.date+"&type=per_mapel&siswa="+data.nis,
            type: {
                success: Type.READ_EXAM_SCORE_PER_MAPEL,
                error: Type.FAILED_READ_EXAM_SCORE_PER_MAPEL
            }
        }})
    }
}

export function readRemedyData(variety: string, optionalParameter?: string){
    return (dispatch: Dispatch<any>) => {
        if (checkCookieValue("token")) {
            dispatch({type: "START_" + variety})
            return axios.get(url.exam_score+"&status=remedy&variety="+variety.toLowerCase()+optionalParameter, {headers: {"Authorization": "Bearer " + SelectCookie("token")[0]}})
                .then(({data}: AxiosResponse) => dispatch({type: variety, payload: data}))
                .catch(({response}: any) => dispatch({type: "FAILED_" + variety, payload: response}))
        }
    }
}

export function insertRemedyScore(type:string, data: any){
    return (dispatch: Dispatch<any>) => {
        dispatch({type: Type.START_INSERT_REMEDY_SCORE, payload: {
            method: "put",
            url: url.nilai+"/"+type+url.date,
            data: data,
            type: {
                success: Type.INSERT_REMEDY_SCORE, 
                error: Type.FAILED_INSERT_REMEDY_SCORE
            }
        }})
    }
}

export function readAppSetting(type: string){
    return (dispatch: Dispatch<any>) => {
        dispatch({type: Type.START_READ_SETTINGS_RECORD, payload: {
            method: 'get',
            url: url.setting+url.date+"&type="+type,
            type: {
                success: Type.READ_SETTINGS_RECORD,
                error: Type.FAILED_READ_SETTINGS_RECORD
            }
        }})
    }
}

export function insertAppSetting(data: any){
    return (dispatch: Dispatch<any>) => {
        dispatch({type: Type.START_INSERT_SETTING_RECORD, payload: {
            method: 'post',
            url: url.setting+"/"+data.tab+url.date,
            data: data.data,
            type: {
                success: Type.INSERT_SETTING_RECORD,
                error: Type.FAILED_INSERT_SETTING_RECORD
            }
        }})
    }
}

export function updateAppSetting(data: any){
    return (dispatch: Dispatch<any>) => {
        dispatch({type: Type.START_UPDATE_SETTING_RECORD, payload: {
            method: "put",
            url: url.setting+"/"+data.tab+"/"+data.type+url.date,
            data: data.data,
            type: {
                success: Type.UPDATE_SETTING_RECORD,
                error: Type.FAILED_UPDATE_SETTING_RECORD
            }
        }})
    }
}

export function insertExamScore(type: string, data: any) {
    return (dispatch: Dispatch<any>) => {
        dispatch({type: Type.START_INSERT_EXAM_SCORE, payload: {
            method: "post",
            url: url.nilai+"/"+type+url.date,
            data: data,
            type: {
                success: Type.INSERT_EXAM_SCORE,
                error: Type.FAILED_INSERT_EXAM_SCORE
            }
        }})
    }
}

export function readPTPASData(type: string, data: any){
    return (dispatch: Dispatch<any>) => {
        dispatch({type: (Type as any)[type === "student" 
                ? "START_READ_PTPAS_STD_RECORD"
                : "START_READ_PTPAS_SUBJECT_RECORD"
            ], payload: {
            method: "get",
            url: (url as any)[type]+"&jurusan="+data.jurusan+`${data.tahun_masuk 
                ? "&tahun_masuk="+data.tahun_masuk
                : ""}`,
            type: {
                success: (Type as any)[type === "student" 
                ? "READ_PTPAS_STD_RECORD"
                : "READ_PTPAS_SUBJECT_RECORD"
            ],
                error: (Type as any)[type === "student" 
                ? "FAILED_READ_PTPAS_STD_RECORD"
                : "FAILED_READ_PTPAS_SUBJECT_RECORD"
            ]
            }
        }})
    }
}

export function readExamStudent(type: string, opt?: string) {
    return (dispatch: Dispatch<any>) => {
        dispatch({type: Type.START_READ_EXAM_STUDENT, payload: {
            method: "get",
            url: url.nilai+"/"+type+url.date+"&state=exam&var=student"+opt!,
            type: {
                success: Type.READ_EXAM_STUDENT,
                error: Type.FAILED_READ_EXAM_STUDENT
            }
        }})
    }
}

export function readExamSubject(type: string, opt?: string) {
    return (dispatch: Dispatch<any>) => {
        dispatch({type: Type.START_READ_EXAM_SUBJECT, payload: {
            method: "get",
            url: url.nilai+"/"+type+url.date+"&state=exam&var=subject"+opt!,
            type: {
                success: Type.READ_EXAM_SUBJECT,
                error: Type.FAILED_READ_EXAM_SUBJECT
            }
        }})
    }
}

export function readExamMaterial(type: string, opt?: string) {
    return (dispatch: Dispatch<any>) => {
        dispatch({type: Type.START_READ_EXAM_MATERIAL, payload: {
            method: "get",
            url: url.nilai+"/"+type+url.date+"&state=exam&var=material"+opt!,
            type: {
                success: Type.READ_EXAM_MATERIAL,
                error: Type.FAILED_READ_EXAM_MATERIAL
            }
        }})
    }
}

export function readExamScore(type: string, opt?: string) {
    return (dispatch: Dispatch<any>) => {
        dispatch({type: Type.START_READ_EXAM_DATA, payload: {
            method: "get",
            url: url.nilai+"/"+type+url.date+"&state=exam&var=result"+opt!,
            type: {
                success: Type.READ_EXAM_DATA,
                error: Type.FAILED_READ_EXAM_DATA
            }
        }})
    }
}

export function readRemedyStudent(type: string, opt?: string) {
    return (dispatch: Dispatch<any>) => {
        dispatch({type: Type.START_READ_REMEDY_STUDENT, payload: {
            method: "get",
            url: url.nilai+"/"+type+url.date+"&state=remedy&var=student"+opt!,
            type: {
                success: Type.READ_REMEDY_STUDENT,
                error: Type.FAILED_READ_REMEDY_STUDENT
            }
        }})
    }
}

export function readRemedySubject(type: string, opt?: string) {
    return (dispatch: any) => {
        dispatch({type: Type.START_READ_REMEDY_SUBJECT, payload: {
            method: "get",
            url: url.nilai+"/"+type+url.date+"&state=remedy&var=subject"+opt!,
            type: {
                success: Type.READ_REMEDY_SUBJECT,
                error: Type.FAILED_READ_REMEDY_SUBJECT
            }
        }})
    }
}

export function readRemedyMaterial(type: string, opt?: string) {
    return (dispatch: any) => {
        dispatch({type: Type.START_READ_REMEDY_MATERIAL, payload: {
            method: "get",
            url: url.nilai+"/"+type+url.date+"&state=remedy&var=material"+opt!,
            type: {
                success: Type.READ_REMEDY_MATERIAL,
                error: Type.FAILED_READ_REMEDY_MATERIAL
            }
        }})
    }
}


export function readRemedyScore(type: string, opt?: string) {
    return (dispatch: any) => {
        dispatch({type: Type.START_READ_REMEDY_SCORE, payload: {
            method: "get",
            url: url.nilai+"/"+type+url.date+"&state=remedy&var=result"+opt!,
            type: {
                success: Type.READ_REMEDY_SCORE,
                error: Type.FAILED_READ_REMEDY_SCORE
            }
        }})
    }
}
