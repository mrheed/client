import React, { useEffect } from 'react';
import { connect } from 'react-redux'
import { Route, Switch, withRouter, Redirect, RouteComponentProps } from 'react-router-dom';
import { 
	Login, 
	Dashboard, 
	Cetak, 
	Loading, 
	Student, 
	Teacher, 
	Class, 
	Subject, 
	Competence, 
	InputNilai,
	Ekstra,
	ListExam, 
	Setting,
	AppContainer 
} from './components';
import PDF from './components/Cetak/PDF/PDFUlangan'
import * as Action from './redux/ActionCreator';

declare global {
	interface Window {
		__PREVIOUS_PATH__: string;
		__CURRENT_TITLE__: string | undefined;
		__TITLE_PREFIX__: string;
		__APP_NAME__: string;
	}
	interface DashboardRouterProps {
		
	}
	interface DashboardProps extends RouteComponentProps<DashboardRouterProps> {
		classes?: Object;

	}
	interface StudentData {
		_id: string;
		nama: string;
		
	}
	interface PrivateProps {
		is: IsPayload,
		component: any,
		path: string,
		title?: string,
		exact?: boolean,
	}
	interface LeftDrawerNavInterface {
		name: string;
		path: string;
		component?: Function | JSX.Element | {} ;
		exact?: boolean;
		icon?: React.Component;
	}
	interface IsPayload {
		Authenticated: boolean;
		LoadingToken: boolean;
		LoadingSetting: boolean;
	}
}


export const Private = ({component: Component, path, exact, title, is}: PrivateProps) => {
	const PrivateComponent = (<Route path={path} exact={exact} render={ (x: any) => {
			const Comps = React.forwardRef((props, ref) => {
					return <Component ref={ref} {...x} />
				} 
			)
			window.__CURRENT_TITLE__ = title;
			// if (is.LoadingToken && is.LoadingSetting) return <Loading isAuthenticated={is.Authenticated} />
			// if (!is.Authenticated) return <Login appName={window.__APP_NAME__ || "E-Rapor"} />
			return <Comps />  
		}
	 }/>
	)
	return PrivateComponent
}

class Routes extends React.Component<RoutesProps> {
	componentDidMount(){
		window.__APP_NAME__ = "E-Rapor"
		window.__TITLE_PREFIX__ = window.__APP_NAME__ + " |"
	}
	componentDidUpdate(prevProps: RoutesProps, prevState: React.ComponentState){
		if (this.props.isAuthenticated !== prevProps.isAuthenticated) {
			if (this.props.isAuthenticated) {
				window.__PREVIOUS_PATH__ = this.props.location.pathname
				this.props.history.push(window.__PREVIOUS_PATH__ === "/" ? "/dashboard" : window.__PREVIOUS_PATH__ || '/dashboard')
			}
		}
	}
	render() {
		const isPayload: IsPayload = {
			Authenticated: this.props.isAuthenticated,
			LoadingToken: this.props.isLoadingToken,
			LoadingSetting: true
		}
		return (
			<Switch location={this.props.location}>
			<Route exact path="/" render={(props: any) => <Login appName={window.__APP_NAME__ || "E-Rapor"} />} />
			<Route exact path="/pdf" render={(props: any) => <PDF />} />
				<AppContainer isAuthenticated={this.props.isAuthenticated} isLoading={this.props.isLoadingToken}>
					<Private path="/dashboard/kelas" component={Class} title={"Kelas"} is={isPayload} />
					<Private path="/dashboard/pdf" component={PDF} title={"Kelas"} is={isPayload} />
					<Private path="/dashboard/siswa" component={Student} title={"Murid"} is={isPayload} />
					<Private path="/dashboard/cetak" component={Cetak} title={"Cetak"} is={isPayload} />
					<Private path="/dashboard/guru" component={Teacher} exact title={"Guru"} is={isPayload} />
					<Private path="/dashboard/settings" component={Setting} title={"Settings"} is={isPayload} />
					<Private path="/dashboard" component={Dashboard} exact title={"Dashboard"} is={isPayload} />
					<Private path="/dashboard/mapel" component={Subject} title={"Mata Pelajaran"} is={isPayload} />
					<Private path="/dashboard/input_nilai" exact component={InputNilai} title={"Input nilai"} is={isPayload} />
					<Private path="/dashboard/input_nilai/:tipe" component={InputNilai} title={"Input nilai"} is={isPayload} />
					<Private path="/dashboard/daftar_nilai" component={ListExam} exact title={"Daftar nilai"} is={isPayload} />
					<Private path="/dashboard/materi_pelajaran" component={Competence} title={"Materi Pelajaran"} is={isPayload} />
					<Private path="/dashboard/ekstrakulikuler" component={Ekstra} title={"Ekstrakulikuler"} is={isPayload} />
				</AppContainer>
				<Route render={(x: any) => <Redirect to={this.props.isAuthenticated ? "/dashboard" : "/"} /> } />
			</Switch>
		)
	}
}

interface RoutesProps extends RouteComponentProps {
	isAuthenticated: boolean;
	isLoadingToken: boolean;
	isLoadingSetting: boolean;
	readAppSetting: (type: string) => void;
} 

const mapStateToProps = (state: any) => ({
	isAuthenticated: state.isAuthenticated,
	isLoadingToken: state.isLoadingToken,
	isLoadingSetting: state.settings.loading
})
const mapDispatchToProps = (dispatch: any) => ({
	RefreshToken: () => dispatch(Action.sendClientTokenToServer()),
	readAppSetting: (type: string) => dispatch(Action.readAppSetting(type))
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Routes));
