import { Dispatch } from 'react';
import * as Type from '../ActionType';
import * as url from './ActionURL';

export function getWaliKelas() {
    return (dispatch: any) => {
        dispatch({type: Type.GET_HOMEROOM_TEACHER, payload: {
            method: "get",
            url: url.teacher + "/wali_kelas" + url.date,
            type: {
                success: Type.PROCESS_HOMEROOM_TEACHER,
                error: Type.ERROR_GET_HOMEROOM_TEACHER
            }
        }})
    }
}