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
import { readExamStudent, readExamMaterial, readExamSubject, insertExamScore, readExamScore } from '../../redux/ActionCreator';

class InputNilai extends React.Component<InputProps> {
    state: any = {
        values: {
            kelas: {
                label: "Kelas",
                value: null,
                type: "single"
            },
            tipe: {
                label: "Tipe ulangan",
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
            },
            materi: {
                label: "Materi",
                value: null,
                type: "single"
            }
        },
        options: {
            kelas: [],
            siswa: [],
            mapel: [],
            tipe: this.props.misc.examTypes.data
        },
        examData: [],
        tanggal_ulangan: {
            haError: false,
            value: null
        },
        kkm: 0,
        splittedStd: "",
        tahun_masuk: 0,
        hasError: {state: false, message: ""},
        loaded: false
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
        const { kelas, materi, mapel, tipe, siswa } = this.state.values
        const { tahun_ajaran, semester } = this.props.appSetting
        
        if (prevState.values.kelas.value !== kelas.value) {
            if (kelas.value !== null) {
                var splitted = kelas.value.value.split(" ")[0],
                    tahun_msk = this.props.classOnSchoolYear.school_year_on_grade[splitted] || 0
                this.setState({tahun_masuk: tahun_msk})
            }
        }
        if (tipe.value !== null){
            if (prevState.values.tipe.value !== tipe.value) {
                this.props.readExamStudent(tipe.value.value, `&jurusan=${kelas.value.value.split(" ")[1]}&tahun_masuk=${this.state.tahun_masuk}`)
            }
            if (prevState.values.siswa.value !== siswa.value) {
                const check = Array.isArray(siswa.value) ? siswa.value.length !== 0 : siswa.value !== null
                check && this.props.readExamSubject(tipe.value.value, `&jurusan=${kelas.value.value}`)
            }
            if (tipe.value.value === "UH") {
                prevState.values.mapel.value !== mapel.value && this.props.readExamMaterial(tipe.value.value, `&mapel=${mapel.value.value}`)
                prevProps.exam.materi.data !== this.props.exam.materi.data && this.setState({options: {...prevState.options, materi: this.props.exam.materi.data}})
            }
            if ((tipe.value.value === "UH" 
                ? (materi.value !== null) 
                : (mapel.value !== null)) 
                    && ((prevState.kkm !== this.state.kkm) 
                    || (prevState.tanggal_ulangan.value !== this.state.tanggal_ulangan.value))
                    && this.state.kkm && this.state.tanggal_ulangan.value !== null) {
                        !this.props.exam.examStd.loading 
                        && this.props.readExamScore(tipe.value.value, `&siswa=${this.state.splittedStd}&tahun_masuk=${this.state.tahun_masuk}&jurusan=${kelas.value.value.split(" ")[1]}&mapel=${mapel.value.value}${tipe.value.value === "UH" 
                        ? `&materi=${materi.value.value}`: ""}`)
                    }
        }
        if (prevProps.exam.siswa.data !== this.props.exam.siswa.data) {
            this.setState({options: {...prevState.options, siswa: this.props.exam.siswa.data}})
        }
        if (prevState.values.siswa.value !== siswa.value) {
            (Array.isArray(siswa.value) ? siswa.value.length !== 0 : siswa.value !== null) 
                && this.setState({splittedStd: siswa.value.map((x: any) => x.value).join(",")}) 
        }
        if (prevProps.exam.mapel.data !== this.props.exam.mapel.data) {
            this.setState({options: {...prevState.options, mapel: this.props.exam.mapel.data}})
        }
        if (prevProps.exam.examStd.loading !== this.props.exam.examStd.loading) {
            this.setState({examData: this.props.exam.examStd.data.map((x: any) => ({
                ...x,
                mapel: mapel.value.value,
                semester: semester,
                kkm: parseInt(this.state.kkm),
                materi: tipe.value.value === "UH" ? materi.value.value : "Materi " + tipe.value.value,
                tahun_ajaran: tahun_ajaran,
                nilai_ulangan: -1,
                tipe: tipe.value.value,
                tanggal_ulangan: this.state.tanggal_ulangan.value
            }))})
        }
        if (prevProps.state.import !== this.props.state.import) {
            this.props.state.import.length !== 0 && this.setState({examData: this.props.state.import.map((x: any) => ({
                    nama: x.Nama,
                    nis: x.NIS,
                    mapel: mapel.value.value,
                    semester: semester,
                    kkm: parseInt(this.state.kkm),
                    materi: tipe.value.value === "UH" ? materi.value.value : "Materi " + tipe.value.value,
                    tahun_ajaran: tahun_ajaran,
                    nilai_ulangan: x.Nilai,
                    tipe: tipe.value.value,
                    tanggal_ulangan: this.state.tanggal_ulangan.value
                }))
            })
        }
    }
    handleChangeKKM = (event: any) => {
        this.setState({kkm: event.target.value})
    }
    handleDateChange = (date: Date | null) => {
        this.setState({tanggal_ulangan: {hasError: false, value: date}, hasError: {state: false, message: ""}})
    }
    _handleChangeExamexamData = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        var data = this.state.examData.map((x: any) =>
            x.nis === parseInt(event.target.name) 
            ? ({...x, 
                hasError: parseInt(event.target.value) 
                    ? false 
                    : true,
                nilai_ulangan: parseInt(event.target.value)
            }) 
            : x )
        this.setState({examData: data})
    }
    _handleInsertExamScore = () => {
        var filteredScore: any[] = this.state.examData.filter((x: any) => x.nilai_ulangan === -1)
        filteredScore.length === 0 
            ? this.props.insertExamScore(this.state.values.tipe.value.value, this.state.examData)
            : this.setState({hasError: {
                state: true, 
                message: "Kolom nilai pada siswa dengan nama " 
                + filteredScore.map((x: any) => x.nama).join(`, `) 
                + " tidak terisi, jika anda berniat untuk tidak mengisinya, hapus siswa dalam daftar siswa di atas"
            }})
        filteredScore.length !== 0 
            && this.setState({examData: 
                this.state.examData.map((x: any) => 
                    ({...x, hasError: filteredScore.map((z: any) => z.nis).includes(x.nis) && true})
                )
            })
        this.state.tanggal_ulangan.value === null && this.setState({
            tanggal_ulangan: {value: null, hasError: true},
            hasError: {state: true, message: "Tentukan tanggal ulangan dilakukan dengan mengisi kolom di atas pada waktu ulangan dilaksanakan"}
        })
    }
    handleChangeSelect = (selectedOption: any, e: any) => {
        this.props.handleChangeCheck(e.name, this.state.values, this.setState, selectedOption)
        const Obj = {
            ...this.state.values[e.name as string],
            value: selectedOption,
        }
        this.setState((oldState: any) => ({
            values: {
                ...oldState.values,
                [e.name as string]: Obj
            },
            kkm: 0,
            tanggal_ulangan: {value: null, hasError: false}
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
                isLoading={(x !== "kelas" && x !== "tipe") && (this.props.exam as any)[x].loading}
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
        return <>{elem}</>
    }
    inputData = () => {
        const xlsData = {
            header: ["No", "NIS", "Nama", "Nilai"],
            rows: this.state.examData.map((x: any, i: number) => [i+1, x.nis, x.nama, 0])
        }
        const table = this.state.kkm && this.state.tanggal_ulangan.value && (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="center" colSpan={99}>
                            <Typography variant="caption">{`Menampilkan ${this.state.examData.length} data dari ${this.state.values.siswa.value.length} siswa yang dipilih`}</Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        {["No", "NIS", "Nama", "Nilai Ulangan", "KKM", "Tanggal Ulangan"]
                            .map((x: string) => <TableCell key={x}>{x}</TableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.state.examData.length !== 0
                        ? this.state.examData.map((x: any, i: number) => 
                        <TableRow key={i}>
                            <TableCell>{i+1}</TableCell>
                            <TableCell>{x.nis}</TableCell>
                            <TableCell>{x.nama}</TableCell>
                            <TableCell>
                                <TextField 
                                    required 
                                    placeholder="Nilai ulangan" 
                                    value={x.nilai_ulangan === -1 ? undefined : x.nilai_ulangan} 
                                    name={String(x.nis)} 
                                    type="number" 
                                    onChange={this._handleChangeExamexamData} 
                                />
                            </TableCell>
                            <TableCell>{this.state.kkm}</TableCell>
                            <TableCell>{new Date(this.state.tanggal_ulangan.value).toLocaleString()}</TableCell>
                        </TableRow>)
                        : <TableRow><TableCell><Typography variant="caption">Maaf data tidak ditemukan</Typography></TableCell></TableRow>}
                </TableBody>
            </Table>
        )
        return this.state.kkm && this.state.tanggal_ulangan.value ? (
            this.props.mode === "Manual" ? table : (
                <>
                {this.props.showExcelStepper(xlsData, this.state.values.tipe.value.value + " : " + this.state.values.tipe.value.value === "UH" 
                    ? this.state.values.materi.value.label 
                    : this.state.values.mapel.value.label)
                }
                {this.props.state.import.length !== 0 && table}
                </>
            )
           
        ) : <></>
    }

    render() {
        const { materi, mapel, tipe } = this.state.values
        return (
            <>
            <Grid id="containerRmd" component="form" onSubmit={e => {
                e.preventDefault()
                this.state.kkm !== 0 && this._handleInsertExamScore()
            }} container className={this.props.classes.wrapper}>
                <Typography variant="h6" style={{marginBottom: 20}}>{this.props.children}</Typography>
                {this.inputSelect()}
                {(tipe.value !== null && (tipe.value.value === "UH" ? materi.value !== null : mapel.value !== null)) &&
                    <Grid className={this.props.classes.dateKkmWrapper}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDateTimePicker
                                value={this.state.tanggal_ulangan.value} 
                                error={this.state.tanggal_ulangan.hasError}
                                onChange={this.handleDateChange}
                                margin="normal"
                                label="Pilih tanggal dan waktu remidi"   
                                className={this.props.classes.dateKkmChildren}
                            />
                        </MuiPickersUtilsProvider>
                        <TextField 
                            type="number"
                            value={this.state.kkm}
                            onChange={this.handleChangeKKM}
                            label="Kriteria Ketuntasan Minimal (KKM)"
                            className={this.props.classes.dateKkmChildren}
                            style={{marginBottom: -5}}
                        />
                    </Grid>
                    }
                {this.inputData()}
                <Grid className={this.props.classes.bottomInfoNBtn}>
                    <Typography variant="caption" style={{opacity: 0.7}}>Pastikan data di kolom benar-benar valid dengan data asli!</Typography>
                    <Button variant="contained" type="submit" color="primary" className={this.props.classes.buttonSubmit}>Tambah Data</Button>
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
        alignItems: "center",
        justifyContent: "space-between",
    },
    dateKkmChildren: {
        width: "49%",
    }
})

interface InputProps extends WithStyles<typeof styles> {
    children?: JSX.Element[] | JSX.Element | string;
    showExcelStepper: (data: any, title: string) => JSX.Element;
    handleChangeCheck: (name: string, values: any, setState: Function, selectedOption: any) => void;
    insertExamScore: (type: string, data: any) => void;
    readExamScore: (type: string, opt?: string) => void;
    readExamStudent: (type: string, opt?: string) => void;
    readExamMaterial: (type: string, opt?: string) => void;
    readExamSubject: (type: string, opt?: string) => void;
    state: any;
    mode: string;
    appSetting: any;
    classOnSchoolYear: any;
    misc: {grades: any, examTypes: any};
    class: {data: any[]; loading: boolean};
    exam: {siswa: any; mapel: any; materi: any; examStd: any};
    todoRequest: {message: string; status: string; loading: boolean};
}

const mapDispatchToProps = (dispatch: any) => ({
    readExamScore: (type: string, opt?: string) => dispatch(readExamScore(type, opt)),
    readExamStudent: (type: string, opt?: string) => dispatch(readExamStudent(type, opt)),
    readExamMaterial: (type: string, opt?: string) => dispatch(readExamMaterial(type, opt)),
    readExamSubject: (type: string, opt?: string) => dispatch(readExamSubject(type, opt)),
    insertExamScore: (type: string, data: any) => dispatch(insertExamScore(type, data))
})

const mapStateToProps = (state: any) => ({
    class: state.class,
    exam: state.exam,
    appSetting: state.settings.application,
    todoRequest: state.todoRequest
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(InputNilai))