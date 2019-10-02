import React, { useReducer, Props, Dispatch, Reducer } from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { combineReducers, applyMiddleware } from 'redux'
import * as Type from './Type';

import { activityReducer, authReducer, UserInformationReducer, personReducer } from './Reducer';
import { GlobalContext } from './Context';

interface AuthData {
	username: string;
	password: string;
}

const middleware = (store: any) => (next: any) => (action: any) => {
	console.log(action)
	console.log(store)
}

const __globalState = (props: Props<any>): JSX.Element => {

	const rootReducer: any = combineReducers({
		personState: personReducer, 
		isAuthenticated: authReducer, 
		actState: activityReducer,
		user_info: UserInformationReducer
	})
	
	const [ state, dispatch ] = useStore(rootReducer)
	const { Provider } = GlobalContext
	
	const apiRequests: object = {
		callPersonData: callPersonApiData,
	}
	
	
	const useMy = applyMiddleware(state, middleware)

	const actionChange: object = {
		makeLoginAuth: makeAuthenticationRequest,
		addActivity: addActivity
	}

	const state_value: any = {
		state: state,
		apiRequests: apiRequests,
		actionFunc: actionChange
	}
	

	function __makeApiRequest(url: string, action: {onError: string, onSuccess: string, request_type: string}, options?: any): Promise<void | Function> {

		dispatch({type: action.request_type})

		return fetch(url, options)
			.then((response: Response): Promise<Response> => response.json())
			.then((res: Response): Function | void => dispatch({type: action.onSuccess, payload: res}))
			.catch((error: any): Function | void => dispatch({type: action.onError, payload: error}))

	}
	
	function addActivity(activity: any) {
		dispatch({type: Type.ADD_STATE, state: activity});
	}	

	// Request persons data from the server
	function callPersonApiData(): void {

		let actions = { 
			request_type: Type.START_REQUEST_PERSON_DATA,
			onError: Type.ERROR_REQUEST_PERSON_DATA, 
			onSuccess: Type.SUCCESS_REQUEST_PERSON_DATA
		}

		__makeApiRequest("http://localhost:8000/api/user", actions, {method: "GET", mode: "cors"
		})
	}

	async function makeAuthenticationRequest(data: AuthData): Promise<void> {

		await dispatch({type: Type.START_REQUEST_AUTH_DATA})

		axios.post("http://localhost:8000/api/auth", JSON.stringify(data))
			.then((response: AxiosResponse<any>): Function | void => 
				dispatch({type: Type.SUCCESS_AUTHENTICATION_REQUEST, payload: response.data}))
			.catch((error: any): Function | void => 
				dispatch({type: Type.ERROR_AUTHENTICATION_REQUEST, payload: error.response.data}))

	}
	console.log(useMy)

	return <Provider value={{val: state_value, an: useMy(state)}}>{props.children}</Provider>
}

// Get initial state 
function __getInitialState(r: any): object {

	return Object.keys(r).reduce((accumulator: any, currentVal: any): any => {
		const slice: any = r[currentVal](undefined, {type: undefined});
		return {...accumulator, [currentVal]: slice};		
	}, {})
}

// Use store function
function useStore(reducer: Reducer<any, any>, state?: any): any {
	// Define init state
	const __initialState = state || reducer(undefined, { type: undefined })
	// Use reducer hook
	return useReducer(reducer, __initialState)

}

// Combine reducers handler
function combineReducerss(r: any): Function {
	// Define init state
	const __initialState = __getInitialState(r);
	// return function
	return function(state: any = __initialState, action: any): any {
		return Object.keys(r).reduce((accumulator: any, currentVal: any): any => {
			let slice = r[currentVal](state[currentVal], action);
			return {...accumulator, [currentVal]: slice}
		}, state)
	}
	
}

export default __globalState;