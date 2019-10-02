import { Dispatch } from 'react';
import * as Type from '../ActionType';
import * as url from './ActionURL';

export function getEkstraData() {
	return (dispatch: Dispatch<any>) => {
		dispatch({
			type: Type.START_READ_EKSTRA_DATA ,
			payload: {
				url: url.ekstra+url.date,
				method: "get",
				type: {
					success: Type.SUCCESS_READ_EKSTRA_DATA,
					error: Type.FAILED_READ_EKSTRA_DATA
				}
			}
		})
	}
}

export function insertEkstraData(data: any) {
	return (dispatch: Dispatch<any>) => {
		dispatch({
			type: Type.START_INSERT_EKSTRA_DATA,
			payload: {
				url: url.ekstra+url.date,
				method: "post",
				data: data,
				type: {
					success: Type.SUCCESS_INSERT_EKSTRA_DATA,
					error: Type.FAILED_INSERT_EKSTRA_DATA
				}
			}
		})
	}
}

export function updateEkstraData(data: any) {
	return (dispatch: Dispatch<any>) => {
		dispatch({
			type: Type.START_UPDATE_EKSTRA_DATA,
			payload: {
				url: url.ekstra+url.date,
				method: "put",
				data: data,
				type: {
					success: Type.SUCCESS_UPDATE_EKSTRA_DATA,
					error: Type.FAILED_UPDATE_EKSTRA_DATA
				}
			}
		})
	}
}

export function deleteEkstraData(data: any) {
	return (dispatch: Dispatch<any>) => {
		dispatch({
			type: Type.START_DELETE_EKSTRA_DATA,
			payload: {
				url: url.ekstra+url.date,
				method: "delete",
				data: data,
				type: {
					success: Type.SUCCESS_DELETE_EKSTRA_DATA,
					error: Type.FAILED_DELETE_EKSTRA_DATA
				}
			}
		})
	}
}
