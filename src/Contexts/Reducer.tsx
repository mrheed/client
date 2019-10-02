import * as Type from './Type';

interface StateInterface{
	data: Readonly<any[]>;
	loading: Readonly<boolean>;
}

export const personReducer = (state: Readonly<StateInterface> = {data: [], loading: false}, action: any) => {
	switch (action.type) {
		case Type.START_REQUEST_PERSON_DATA:
			return {...state, data: [], loading: false}
			break;
		case Type.SUCCESS_REQUEST_PERSON_DATA:
			return {...state, data: action.payload, loading: true}
			break;
		case Type.ERROR_REQUEST_PERSON_DATA:
			return {...state, data: action.payload, loading: true}
		}
	return state;
}

export const UserInformationReducer = (state: any = {}, action: any) => {
	switch (action.type) {
		case Type.SUCCESS_AUTHENTICATION_REQUEST:
			var date = new Date(action.payload.http_data.Expires)
			document.cookie = `${action.payload.http_data.Name}=${action.payload.http_data.Value}; expires=${date};`
			console.log(action.payload)
			return action.payload
			break;
		case Type.ERROR_AUTHENTICATION_REQUEST:
			console.log(action.payload)
			return action.payload
			break;
		default:
			return state
			break;
	}
}

export const activityReducer = (state: any = [], action: any) => {
	switch (action.type) {
		case Type.ADD_STATE:
			return [...state, action.state]
			// return addState(action.state);
			// break;
		default:
			return state;
			// break;
	}
};

export const authReducer = (state: boolean = false, action: any) => {
	switch (action.type) {
		case Type.SUCCESS_AUTHENTICATION_REQUEST:
			console.log(action)
			return true;
		case Type.ERROR_AUTHENTICATION_REQUEST:
			return false
		default:
			return state;
	}
}