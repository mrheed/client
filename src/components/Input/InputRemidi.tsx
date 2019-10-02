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
    readRemedyData, 
    insertRemedyScore, 
    readRemedyStudent, 
    readRemedyMaterial, 
    readRemedyScore, 
    readRemedySubject 
} from '../../redux/ActionCreator';

class InputRemidi extends React.Component<InputProps> {
    state: any = {
        values: {
            kelas: {
                label: "Kelas",
                value: null,
                type: "single"
            },
            tipe: {
                label: "Jenis ulangan",
                value: null,
                type: 'single'
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
            },
            materi: {
                label: "Materi",
                value: null,
                type: "single"
            },
        },
        options: {
            kelas: [],
            siswa: [],
            mapel: [],
            materi: [],
            tipe: this.props.misc.examTypes.data
        },
        tanggal_remidi: {
            haError: false,
            value: null
        },
        splittedStd: undefined,
        scoreData: [],
        tahun_masuk: 0,
        arBool: [],
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
            { tipe, kelas, materi, mapel, siswa } = this.state.values

        if (tipe.value !== null) {
            if (tipe.value !== prevState.values.tipe.value) {
                var jurusan = kelas.value.value.split(" ")[1],
                    kls = kelas.value.value.split(" ")[0],
                    thn_masuk = this.props.classOnSchoolYear.school_year_on_grade[kls] || 0
                this.setState({tahun_masuk: thn_masuk})
                kelas.value !== null && this.props.readRemedyStudent(tipe.value.value, `&jurusan=${jurusan}&tahun_masuk=${thn_masuk}`)
            }
            if (siswa.value !== prevState.values.siswa.value) {
                if (siswa.value !== null || (Array.isArray(siswa.value) && siswa.value.length !== 0)) {
                    let splitted: string = siswa.value.map((x: any) => x.value).join(",")
                    this.setState({splittedStd: splitted})
                    this.props.readRemedySubject(tipe.value.value, `&siswa=${splitted}`)
                }
            }
            if (mapel.value !== prevState.values.mapel.value && (mapel.value !== null && tipe.value.value === "UH")) {
                this.props.readRemedyMaterial(tipe.value.value, `&siswa=${this.state.splittedStd}&mapel=${mapel.value.value}`)
            }
            if (prevState.tanggal_remidi.value !== this.state.tanggal_remidi.value) {
                this.props.readRemedyScore(tipe.value.value, `&siswa=${this.state.splittedStd}&mapel=${mapel.value.value}${tipe.value.value === "UH" ? "&materi="+materi.value.value : ""}`)
            }
            if (this.props.remedy.siswa.data.length !== prevProps.remedy.siswa.data.length) {
                this.setState({
                    options: {
                        ...prevState.options,
                        siswa: this.props.remedy.siswa.data
                    }
                })
            }
            if (this.props.remedy.mapel.data.length !== prevProps.remedy.mapel.data.length) {
                this.setState({
                    options: {
                        ...prevState.options,
                        mapel: this.props.remedy.mapel.data
                    }
                })
            }
            if (this.props.remedy.materi.data.length !== prevProps.remedy.materi.data.length) {
                this.setState({
                    options: {
                        ...prevState.options,
                        materi: this.props.remedy.materi.data
                    }
                })
            }
            if (this.props.remedy.scoreData.data.length !== prevProps.remedy.scoreData.data.length) {
                this.setState({
                    ...prevState,
                    scoreData: this.props.remedy.scoreData.data.map((x: any) => ({
                        mapel: mapel.value.value,
                        nilai_remidi: -1,
                        tahun_ajaran: tahun_ajaran,
                        tanggal_remidi: this.state.tanggal_remidi.value,
                        kkm: x.kkm,
                        semester: semester,
                        nilai_ulangan: x.nilai_ulangan,
                        tanggal_ulangan: x.tanggal_ulangan,
                        nama: x.nama,
                        _id: x._id,
                        materi: tipe.value.value === "UH" 
                            ? materi.value.value
                            : String(tahun_ajaran + semester)
                    }))
                })
            }
            if (this.props.state.import !== prevProps.state.import) {
                this.props.state.import.length !== 0 && this.setState({
                    scoreData: this.state.scoreData.map((x: any, i: number) => ({
                        mapel: mapel.value.value,
                        nilai_remidi: this.props.state.import.filter((z: any) => z.NIS === x._id)[0]["Nilai"],
                        tahun_ajaran: tahun_ajaran,
                        tanggal_remidi: this.state.tanggal_remidi.value,
                        semester: semester,
                        kkm: x.kkm,
                        nilai_ulangan: x.nilai_ulangan,
                        tanggal_ulangan: x.tanggal_ulangan,
                        nama: x.nama,
                        _id: x._id,
                        materi: tipe.value.value === "UH" 
                            ? materi.value.value
                            : String(tahun_ajaran + semester)
                    }))
                })
            }
        }
    }
    handleDateChange = (date: Date | null) => {
        this.setState({tanggal_remidi: {hasError: false, value: date}, hasError: {state: false, message: ""}})
    }
    handleChangeSetRemidi = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        var data = this.state.scoreData.map((x: any) => { 
            const obj = {
                ...x,
                nilai_remidi: parseInt(event.target.value),
                hasError: !parseInt(event.target.value),
            }
            return x._id === parseInt(event.target.name) ? obj : x 
        })
        this.setState({scoreData: data})
    }
    handleInsertExamScore = () => {
        var filteredScore: any[] = this.state.scoreData.filter((x: any) => !x.nilai_remidi)
        filteredScore.length === 0 
            ? this.props.insertRemedyScore(this.state.values.tipe.value.value, this.state.scoreData)
            : this.setState({hasError: {
                state: true, 
                message: "Kolom nilai remidi pada siswa dengan nama " 
                + filteredScore.map((x: any) => x.nama).join(`, `) 
                + " tidak terisi, jika anda berniat untuk tidak mengisinya, hapus siswa dalam daftar siswa di atas"
            }})
        filteredScore.length !== 0 
            && this.setState({scoreData: 
                this.state.scoreData.map((x: any) => 
                    ({...x, hasError: filteredScore.map((z: any) => z._id).includes(x._id) && true})
                )
            })
        this.state.tanggal_remidi.value === null && this.setState({
            tanggal_remidi: {value: null, hasError: true},
            hasError: {state: true, message: "Tentukan tanggal remidi dilakukan dengan mengisi kolom di atas pada waktu remidi dilaksanakan"}
        })
    }
    handleChangeSelect = (selectedOption: any, e: any) => {
        const { values } = this.state
        this.props.handleChangeCheck(e.name, values, this.setState, selectedOption)
        this.state.tanggal_remidi.value = null
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
        const check = this.state.values.tipe.value && this.state.values.tipe.value.value === "UH"
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
            var moreCheck = !check && x === "materi" 
            return moreCheck ? false : arrBool[i] && (
                <Select 
                key={i}
                value={this.state.options[x]}
                singleValue={this.state.values[x].value}
                allowAllSelect={this.state.values[x].type === "multi"}
                isLoading={(x !== "kelas" && x !== "tipe") && this.props.remedy[x].loading}
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
        const AddedElem = () => {
            return (
                <Grid className={this.props.classes.dateKkmWrapper}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDateTimePicker
                            value={this.state.tanggal_remidi.value} 
                            error={this.state.tanggal_remidi.hasError}
                            onChange={this.handleDateChange}
                            margin="normal"
                            label="Pilih tanggal dan waktu remidi"   
                            className={this.props.classes.dateKkmChildren}
                        />
                    </MuiPickersUtilsProvider>
                    <Typography variant="caption">Menampilkan {this.state.scoreData.length} siswa remidi dari {this.state.values.siswa.value.length} siswa yang dipilih</Typography>
                </Grid>
            )
        }
        return <>{elem}{arrBool.every((x: boolean) => x) && (check ? this.state.values.materi.value !== null : true) ? <AddedElem/> : <></>}</>
    }
    inputData = () => {
        const xlsData = {
            header: ["No", "NIS", "Nama", "Nilai"],
            rows: this.state.scoreData.map((x: any, i: number) => [i+1, x._id, x.nama, 0])
        }
        const table = (
            <Table>
                <TableHead>
                    <TableRow>
                        {["No", "NIS", "Nama", "Nilai Ulangan", "Nilai Remidi", "KKM", "Tanggal Ulangan"]
                            .map((x: string) => <TableCell key={x}>{x}</TableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {!this.props.remedy.scoreData.loading && this.props.remedy.scoreData.length !== 0 
                        ? this.state.scoreData.map((x: any, i: number) => 
                        <TableRow key={i}>
                            <TableCell>{i+1}</TableCell>
                            <TableCell>{x._id}</TableCell>
                            <TableCell>{x.nama}</TableCell>
                            <TableCell>{x.nilai_ulangan}</TableCell>
                            <TableCell>
                                {this.props.mode === "Exam" 
                                    ? x.nilai_remidi 
                                    : <TextField error={!!x.hasError} placeholder="Nilai remidi" name={String(x._id)} defaultValue={0} type="number" onBlur={this.handleChangeSetRemidi} />
                                }
                            </TableCell>
                            <TableCell>{x.kkm}</TableCell>
                            <TableCell>{new Date(x.tanggal_ulangan).toLocaleString()}</TableCell>
                        </TableRow>)
                        : <TableRow><TableCell><Typography variant="caption">Maaf data tidak ditemukan</Typography></TableCell></TableRow>}
                </TableBody>
            </Table>
        )
        return this.state.tanggal_remidi.value ? (
            this.props.mode === "Manual" ? table : (
                <>
                {this.props.showExcelStepper(xlsData, this.state.values.tipe.value.value + "Remidi : " + this.state.values.tipe.value.value === "UH" 
                    ? this.state.values.materi.value.label 
                    : this.state.values.mapel.value.label)
                }
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
    dateKkmWrapper: {
        marginTop: theme.spacing(1),
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
    readRemedyStudent: (type: string, opt?: string) => void;
    readRemedySubject: (type: string, opt?: string) => void;
    readRemedyMaterial: (type: string, opt?: string) => void;
    readRemedyScore: (type: string, opt?: string) => void;
    insertRemedyScore: (type: string, data: any) => void;
    readRemedyData: Function;
    remedy: any;
    state: any;
    mode: string;
    appSetting: any;
    todoRequest: any;
    classOnSchoolYear: any;
    misc: {grades: any, examTypes: any};
    class: {data: any[]; loading: boolean};
}

const mapDispatchToProps = (dispatch: any) => ({
    readRemedyData: (variety: string, data: any) => dispatch(readRemedyData(variety, data)),
    insertRemedyScore: (type: string, data: any) => dispatch(insertRemedyScore(type, data)),
    readRemedyStudent: (type: string, opt?: string) => dispatch(readRemedyStudent(type, opt)),
    readRemedySubject: (type: string, opt?: string) => dispatch(readRemedySubject(type, opt)),
    readRemedyMaterial: (type: string, opt?: string) => dispatch(readRemedyMaterial(type, opt)),
    readRemedyScore: (type: string, opt?: string) => dispatch(readRemedyScore(type, opt)),
})

const mapStateToProps = (state: any) => ({
    class: state.class,
    remedy: state.remedy,
    appSetting: state.settings.application,
    todoRequest: state.todoRequest  
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(InputRemidi))