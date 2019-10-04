import * as Type from "./ActionType";
import * as Action from "./ActionCreator";
import * as Interface from "./ReduxInterfaces";
import { SelectCookie, DeleteCookie, CheckPath, SetCookies, checkCookieValue } from "../Helpers";
import { ActionTypes } from "./ReduxInterfaces";
import { Dispatch } from "redux";
import axios, { AxiosResponse } from "axios";

const Middleware = ({dispatch, getState}: any) => (next: any) => async (action: ActionTypes) => {
        
    if (action.type === Type.SUCCESS_AUTHENTICATION_REQUEST) {
        var date = new Date(action.payload.http_data.Expires)
        document.cookie = `${action.payload.http_data.Name}=${action.payload.http_data.Value}; expires=${date}; path=/`
        dispatch(Action.readAppSetting("application"))
    }
    if (action.type === Type.START_REQUEST_REFRESH_TOKEN) {
        if (await SelectCookie("token").length > 1) {  
            var PathName: string = CheckPath(window.location.pathname)
            DeleteCookie(["token"], [PathName])
        }
    }
    if (action.type === Type.MAKE_LOGOUT_REQUEST_WITH_TOKEN) DeleteCookie(["token"], ["/", "/dashboard"])
    if (action.type === Type.ERROR_VALIDATING_CLIENT_TOKEN) DeleteCookie(["token"], ["/", "/dashboard"])
    if (action.type === Type.START_READ_REPORT_RESULT) dispatch({type: Type.RESET_REPORT_RESULT_STATE})
    if (action.type === Type.SUCCESS_VALIDATING_CLIENT_TOKEN) {
        var dt = new Date(action.payload.expires_at)
        var Cookie = {
            Name: "token",
            Value: action.payload.token,
            Expires: dt,
            Path: "/"
        }
        dispatch(Action.readAppSetting("application"))
        if (await SelectCookie("token").length == 1) await SetCookies(Cookie)
    }
    if ((0
        || action.type === Type.START_UPDATE_SETTING_RECORD 
        || action.type === Type.START_READ_GRADE_RECORD 
        // Remedy
        || action.type === Type.START_INSERT_REMEDY_SCORE
        || action.type === Type.START_READ_REMEDY_MATERIAL 
        || action.type === Type.START_READ_REMEDY_SCORE
        || action.type === Type.START_READ_REMEDY_STUDENT
        || action.type === Type.START_READ_REMEDY_SUBJECT
        // Exam
        || action.type === Type.START_INSERT_EXAM_SCORE
        || action.type === Type.START_READ_EXAM_SCORE 
        || action.type === Type.START_READ_EXAM_DATA 
        || action.type === Type.START_READ_EXAM_SCORE_PER_MAPEL
        || action.type === Type.START_READ_EXAM_TYPES 
        || action.type === Type.START_READ_EXAM_MATERIAL
        || action.type === Type.START_READ_EXAM_STUDENT
        || action.type === Type.START_READ_EXAM_SUBJECT
        // Task
        || action.type === Type.START_READ_TASK_RESULT
        || action.type === Type.START_READ_TASK_SUBJECT
        || action.type === Type.START_READ_TASK_STUDENT
        || action.type === Type.START_INSERT_TASK_RESULT
        // Report
        || action.type === Type.START_READ_REPORT_STUDENT
        || action.type === Type.START_READ_REPORT_SUBJECT
        || action.type === Type.START_READ_REPORT_MATERIAL
        || action.type === Type.START_READ_REPORT_TASK_NAME
        || action.type === Type.START_READ_REPORT_RESULT
        // Misc
        || action.type === Type.GET_GRADE_WITH_CURRENT_SCHOOL_YEAR
        || action.type === Type.GET_DASHBOARD_INFO
        // Teacher
        || action.type === Type.GET_HOMEROOM_TEACHER
		|| action.type === Type.START_READ_TEACHER_RECORDS
		// Class
		|| action.type === Type.START_READ_CLASS_RECORDS
		// Ekstra
		|| action.type === Type.START_READ_EKSTRA_DATA
		|| action.type === Type.START_UPDATE_EKSTRA_DATA
		|| action.type === Type.START_DELETE_EKSTRA_DATA
        ) 
        && (getState().settings.application.tahun_ajaran !== 0 && getState().settings.application.semester != 0) 
        || action.type === Type.START_READ_SETTINGS_RECORD 
        || action.type === Type.START_INSERT_SETTING_RECORD) {
        APIMiddleware(dispatch, action.payload)
    } 
    next(action)
}

const APIMiddleware = (
    dispatch: Dispatch, 
    payload: Interface.ActionPayload) => {
    const { method, url, data: datas, header, config, type } = payload
    if (checkCookieValue("token")){
        axios({
            method: method,
            url: url+"&id="+Math.random().toString(36).replace(/[^a-z]+/g, ''),
            data: datas!,
            headers: {"Authorization": "Bearer " + SelectCookie("token")[0], ...header!},
            ...config!
        }).then(({data}: AxiosResponse) => {
			dispatch({type: type.success, payload: data})
		})
        .then(() => dispatch({type: Type.RESET_REQUEST_STATE}))
        .catch(({response}: any) => dispatch({type: type.error, payload: response}))
    }
} 

export const Middlewares = [Middleware]
