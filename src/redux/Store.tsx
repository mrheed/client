import { combineReducers, applyMiddleware, createStore } from "redux";
import thunk from 'redux-thunk'
import { classOnSchoolYear, dashboardInfo } from './Reducers/MiscReducer';
import { waliKelas, teacherData } from './Reducers/TeacherReducer';
import { ekstraReducer } from './Reducers/EkstraReducer';
import { reportReducer } from './Reducers/ReportReducer';
import { todoRequest } from './Reducers/TodoReducer';
import { inputTugas } from './Reducers/TaskReducer';
import { 
    personReducer, 
    classData, 
    competenceData,
    requestReducer, 
    activityReducer, 
    refreshLoading,
    authReducer, 
    refreshResult, 
    subjectData,
    UserInformationReducer,
    inputRemedy,
    studentScore,
    uhPerMapel,
    inputNilai,
    miscData,
    settingsReducer
} from './Reducer'
import { Middlewares } from './Middleware'

export const rootReducer = combineReducers({
    activity: activityReducer,
    class: classData,
    competence: competenceData,
	ekstra: ekstraReducer,
    requestResponse: requestReducer,
    isAuthenticated: authReducer,
    isLoadingToken: refreshLoading,
    remedy: inputRemedy,
    student: personReducer,
    studentScore: studentScore,
    subject: subjectData,
    successRefreshResult: refreshResult,
    uhPerMapel: uhPerMapel,
    teacher: teacherData,
    misc: miscData,
    exam: inputNilai,
    task: inputTugas,
    settings: settingsReducer,
    todoRequest: todoRequest,
    report: reportReducer,
    classOnSchoolYear: classOnSchoolYear,
    dashboard_info: dashboardInfo,
    wali_kelas: waliKelas,
    ...UserInformationReducer
})

export default createStore(
        rootReducer,
        applyMiddleware(thunk, ...Middlewares)
    )
