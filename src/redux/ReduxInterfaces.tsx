
export interface StateInterface {
	readonly data: Readonly<any[]>;
	readonly loading: Readonly<boolean>;
}

export interface RemedyInterface extends InputInterface {
	materi: StateInterface;
	scoreData: StateInterface;
}

export interface ExamInterface extends InputInterface {
	materi: StateInterface;
	examStd: StateInterface;
}

export interface InputInterface {
	siswa: StateInterface;
	mapel: StateInterface;
}

export interface ReportInterface extends InputInterface {
	task_name: StateInterface;
	materi: StateInterface;
	result: StateInterface;
}

export interface TaskInterface extends InputInterface {
	result: StateInterface;
}

export interface MiscInterface {
	grades: StateInterface;
	examTypes: StateInterface;
}

export interface LabVal {
	label: any;
	value: any;
}

export interface SettingInterface {
	application: AppSetting;
	loading: boolean;
	error: boolean;
	errorMsg: string;
}

export interface TodoSetting extends CrudResponse {
	tab?: string;
}

export interface AppSetting {
	tahun_ajaran: number;
	deskripsi_sekolah: string;
	semester: number;
	nama_sekolah: string;
}

export interface TokenInterface {
	token: string;
}

export interface CrudResponse {
	status: string;
	message: string;
	loading: boolean;
}

export interface ActionTypes {
    readonly type: string;
    readonly payload: any; 
}

export interface AuthData {
	readonly username: string | null;
	readonly password: string | null;
}

export interface ActionPayload {
	method: string;
	url: string;
	data?: any;
	type: {
		success: string;
		error: string;
	}
	header?: any;
	config?: any;
}
