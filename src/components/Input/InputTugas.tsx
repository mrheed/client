import React from 'react';
import { connect } from 'react-redux';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { WithStyles } from '@material-ui/styles';
import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns'
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText'
import Dialog from '@material-ui/core/Dialog';
import { hexToRgbA } from '../../Helpers';
import Select from './Select';
import Loading from '../Loading/Snackbar';
import { 
    readTaskResult,
    readTaskStudent,
    readTaskSubject,
    insertTaskResult,
} from '../../redux/ActionCreators/TugasActions';

class InputTugas extends React.Component<InputProps> {
    state: any = {
        values: {
            kelas: {
                label: "Kelas",
                value: null,
                type: "single"
            },
            siswa: {
                label: "Siswa",
                value: null,
                type: "multi"
            },
            mapel: {
                label: "Mapel",
                value: null,
                type: "single"
            }
        },
        options: {
            kelas: [],
            siswa: [],
            mapel: [],
        },
        nama_tugas: "",
        tanggal_tugas: {
            haError: false,
            value: null
        },
        skipped: new Set<number>(),
        activeStep: 0,
        result: [],
        tahun_masuk: 0,
        hasError: {state: false, message: ""}
    }
    componentDidMount() {
        this.setState((prevState: any) => ({
            options: {...prevState.options, 
                kelas: this.props.misc.grades.data.map((k: string) => 
                    this.props.class.data.map((x: any) => ({label: k + " " + x.nama_kelas, value: k + " " + x.kode_kelas}))
                ).flat(1).sort((a: any, b: any) => a.label > b.label ? 1 : -1)
            },
        }))
    }
    componentDidUpdate(prevProps: InputProps, prevState: React.ComponentState) {
        // Check if kelas state isn't equal to previous state
        const { tahun_ajaran, semester } = this.props.appSetting,
            { kelas, mapel, siswa } = this.state.values
            if (prevState.values.siswa.value !== siswa.value && (Array.isArray(siswa.value) ? siswa.value.length !== 0 : siswa.value !== null)) {
                this.props.readTaskSubject(`&jurusan=${kelas.value.value}`)
            }
            if (prevState.values.kelas.value !== kelas.value && kelas.value.value !== null) {
                var kls = kelas.value.value.split(" ")[0]
                var thn_masuk = this.props.classOnSchoolYear.school_year_on_grade[kls] || 0
                this.setState({tahun_masuk: thn_masuk})
                this.props.readTaskStudent(`&jurusan=${kelas.value.value.split(" ")[1]}&tahun_masuk=${thn_masuk}`)
            }

            if (this.props.task.siswa.data.length !== prevProps.task.siswa.data.length) {
                this.setState({
                    options: {
                        ...prevState.options,
                        siswa: this.props.task.siswa.data
                    }
                })
            }
            if (this.props.task.mapel.data.length !== prevProps.task.mapel.data.length) {
                this.setState({
                    options: {
                        ...prevState.options,
                        mapel: this.props.task.mapel.data
                    }
                })
            }
            if (this.state.result === prevState.result && mapel.value !== null && this.state.tanggal_tugas !== null) {
                this.setState({
                    result: siswa.value.map((x: any) => ({
                        nis: x.value,
                        nama: x.label,
                        nilai_tugas: -1,
                        nama_tugas: this.state.nama_tugas,
                        semester: semester,
                        tahun_ajaran: tahun_ajaran,
                        tanggal_tugas: this.state.tanggal_tugas.value,
                        mapel: mapel.value.value
                    }))
                })
            }
            if (this.props.state.import !== prevProps.state.import) {
                this.props.state.import.length !== 0 && this.setState({
                    result: this.props.state.import.map((x: any) => ({
                        nis: x.NIS,
                        nama: x.Nama,
                        nilai_tugas: x.Nilai,
                        nama_tugas: this.state.nama_tugas,
                        semester: semester,
                        tahun_ajaran: tahun_ajaran,
                        tanggal_tugas: this.state.tanggal_tugas.value,
                        mapel: mapel.value.value
                    }))
                })
            }
    }
    handleChangeTaskName = (event: any) => {
        this.setState({nama_tugas: event.target.value})
    }
    handleDateChange = (date: Date | null) => {
        this.setState({tanggal_tugas: {hasError: false, value: date}, hasError: {state: false, message: ""}})
    }
    handleChangeStateTask = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        this.setState({
            result: this.state.result.map((x: any) => x.nis === parseInt(event.target.name) ? ({
                ...x,
                nilai_tugas: parseInt(event.target.value)
            }) : x )
        })
    }
    handleInsertExamScore = () => {
        var filteredScore: any[] = this.state.result.filter((x: any) => !x.nilai_tugas)
        filteredScore.length === 0 
            ? this.props.insertTaskResult(this.state.result)
            : this.setState({hasError: {
                state: true, 
                message: "Kolom nilai remidi pada siswa dengan nama " 
                + filteredScore.map((x: any) => x.nama).join(`, `) 
                + " tidak terisi, jika anda berniat untuk tidak mengisinya, hapus siswa dalam daftar siswa di atas"
            }})
        filteredScore.length !== 0 
            && this.setState({result: 
                this.state.result.map((x: any) => 
                    ({...x, hasError: filteredScore.map((z: any) => z.nis).includes(x.nis) && true})
                )
            })
        this.state.tanggal_tugas.value === null && this.setState({
            tanggal_tugas: {value: null, hasError: true},
            hasError: {state: true, message: "Tentukan tanggal remidi dilakukan dengan mengisi kolom di atas pada waktu remidi dilaksanakan"}
        })
    }
    handleChangeSelect = (selectedOption: any, e: any) => {
        const { values } = this.state
        this.props.handleChangeCheck(e.name, values, this.setState, selectedOption)
        this.state.tanggal_tugas.value = null
        const Obj = {
            ...this.state.values[e.name as string],
            value: selectedOption,
        }
        this.setState((oldState: any) => ({
            values: {
                ...oldState.values,
                [e.name as string]: Obj
            }
        }))
      }
    inputSelect = () => {
        const arrBool: any[] = [...Array(Object.keys(this.state.values).length)]
        arrBool.shift()
        arrBool.unshift(true)
        const keys: string[] = Object.keys(this.state.values)
        const elem = keys.map((x: any, i: number) => {
            for (let i2 = i+1; i2 > 0; i2--) {
                if ((this.state.values[keys[i2-1]]["type"] === "single" && this.state.values[keys[i2-1]]["value"] !== null)
                || (this.state.values[keys[i2-1]]["type"] === "multi" && (this.state.values[keys[i2-1]]["value"] !== null && this.state.values[keys[i2-1]]["value"].length !== 0))) {
                    arrBool.splice(i2, 1, true)
                }
                if (this.state.values[keys[0]]["value"] === null) {
                    arrBool[i2] = false 
                }
            }
            return arrBool[i] && (
                <Select 
                key={i}
                value={this.state.options[x]}
                singleValue={this.state.values[x].value}
                allowAllSelect={this.state.values[x].type === "multi"}
                isLoading={(x !== "kelas" && x !== "tipe") && this.props.task[x].loading}
                isSearchable
                isClearable
                props={{
                    label: this.state.values[x].label,
                    inputId: x,
                    placeholder: "Pilih Data " + this.state.values[x].label,
                }}
                onChange={this.handleChangeSelect}
                isMulti={this.state.values[x].type === "multi"}
            />
            )
        })
        return elem
    }
    inputData = () => {
        const xlsData = {
            header: ["No", "NIS", "Nama", "Nilai"],
            rows: this.state.result.map((x: any, i: number) => [i+1, x.nis, x.nama, 0])
        }
        const table: JSX.Element = (
            <Table>
            <TableHead>
                <TableRow>
                    {["No", "NIS", "Nama", "Nilai Tugas"]
                        .map((x: string) => <TableCell key={x}>{x}</TableCell>)}
                </TableRow>
            </TableHead>
            <TableBody>
                {this.state.result.length ? this.state.result.map((x: any, i: number) => 
                    <TableRow key={i}>
                        <TableCell>{i+1}</TableCell>
                        <TableCell>{x.nis}</TableCell>
                        <TableCell>{x.nama}</TableCell>
                        <TableCell>
                            <TextField error={!!x.hasError} value={x.nilai_tugas === -1 ? undefined : x.nilai_tugas} placeholder="Nilai remidi" name={String(x.nis)} type="number" onChange={this.handleChangeStateTask} />
                        </TableCell>
                        <TableCell>{new Date(x.tanggal_tugas).toLocaleString()}</TableCell>
                    </TableRow>)
                    : <TableRow><TableCell><Typography variant="caption">Maaf data tidak ditemukan</Typography></TableCell></TableRow>}
            </TableBody>
        </Table>)
        return this.state.tanggal_tugas.value ? (
            this.props.mode === "Manual" ? table : (
                <>
                {this.props.showExcelStepper(xlsData, "Tugas : " + this.state.nama_tugas)}
                {this.props.state.import.length !== 0 && table}
                </>
            )
        ) : <></>
    }

    render() {
        return (
            <>
            <Grid id="containerRmd" container className={this.props.classes.wrapper}>
                <Typography variant="h6" style={{marginBottom: 20}}>{this.props.children}</Typography>
                {this.inputSelect()}
                {this.state.values.mapel.value !== null &&
                <TextField 
                    value={this.state.nama_tugas}
                    style={{marginTop: 4, marginBottom: 4}}
                    label="Nama tugas"
                    onChange={this.handleChangeTaskName}
                />
                }
                {this.state.nama_tugas !== "" &&
                <Grid className={this.props.classes.dateWrapper}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDateTimePicker
                            value={this.state.tanggal_tugas.value} 
                            error={this.state.tanggal_tugas.hasError}
                            onChange={this.handleDateChange}
                            margin="normal"
                            label="Pilih tanggal dan waktu tugas"   
                            className={this.props.classes.dateKkmChildren}
                        />
                    </MuiPickersUtilsProvider>
                </Grid>
                }
                {this.inputData()}
                <Grid className={this.props.classes.bottomInfoNBtn}>
                    <Typography variant="caption" style={{opacity: 0.7}}>Pastikan data di kolom benar-benar valid dengan data asli!</Typography>
                    <Button variant="contained" color="primary" onClick={this.handleInsertExamScore} className={this.props.classes.buttonSubmit}>Tambah Data</Button>
                </Grid>
                {this.state.hasError.state && <Dialog open onClose={() => this.setState({hasError: {state: false, message: ""}})}>
                <DialogTitle>Warning! Sepertinya terdapat kolom yang belum terisi</DialogTitle>
                <DialogContent>
                    <DialogContentText>{this.state.hasError.message}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={() => this.setState({hasError: {state: false, message: ""}})}>Agree</Button>
                </DialogActions>
            </Dialog>}
            </Grid>
            {this.props.todoRequest.status !== "" && <Loading todoRequest={this.props.todoRequest} />}
            </>
        )
    }
}

const styles = (theme: Theme) => createStyles({
    wrapper: {
        flexDirection: "column",
        backgroundColor: "white",
        padding: theme.spacing(2),
        borderRadius: theme.spacing(0.5),
        boxShadow: theme.shadows[1]
    },
    buttonSubmit: {
      boxShadow: "0px 6px 10px " + hexToRgbA(theme.palette.primary.main, 0.4),
    },
    bottomInfoNBtn: {
      marginTop: theme.spacing(1),
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    },
    dateWrapper: {
        marginTop: -theme.spacing(1.5),
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    dateKkmChildren: {
        width: "49%",
    }
})

interface InputProps extends WithStyles<typeof styles> {
    children?: JSX.Element[] | JSX.Element | string;
    showExcelStepper: (data: any, title: string) => JSX.Element;
    handleChangeCheck: (name: string, values: any, setState: Function, selectedOption: any) => void;
    readTaskStudent: (opt?: string) => void;
    readTaskSubject: (opt?: string) => void;
    readTaskResult: (opt?: string) => void;
    insertTaskResult: (data: any) => void;
    mode: string;
    task: any;
    state: any;
    appSetting: any;
    todoRequest: any;
    misc: {grades: any, examTypes: any};
    class: {data: any[]; loading: boolean};
    classOnSchoolYear: any;
}

const mapDispatchToProps = (dispatch: any) => ({
    insertTaskResult: (data: any) => dispatch(insertTaskResult(data)),
    readTaskStudent: (opt?: string) => dispatch(readTaskStudent(opt)),
    readTaskSubject: (opt?: string) => dispatch(readTaskSubject(opt)),
    readTaskResult: (opt?: string) => dispatch(readTaskResult(opt)),
})

const mapStateToProps = (state: any) => ({
    class: state.class,
    task: state.task,
    appSetting: state.settings.application,
    todoRequest: state.todoRequest  
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(InputTugas))