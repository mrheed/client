import React, { useState, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { MuiPickersUtilsProvider, KeyboardDateTimePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns'
import { hexToRgbA } from '../../Helpers';
import CustomSelect from './Select';
import * as Action from '../../redux/ActionCreator';
import { Table, TableHead, TableRow, TableBody, TableCell, TextField, FormControl, Button, WithStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';

class InputUlagan extends React.Component {
  state = {
    values: {
      kelas: {
        label: "Kelas",
        value: null,
        key: "kelas",
        type: "single"
      },
      siswa: {
        label: "Siswa",
        value: null,
        key: "siswa",
        type: "single"
      },
      mapel: {
        label: "Mapel",
        value: null,
        key: "mapel",
        type: "single"
      },
      materi: {
        label: "Materi",
        value: null,
        key: "materi",
        type: "single"
      }
    },
    options: {},
    loaded: false
  }
  componentDidMount(){
    this.setState({loaded: true})
  }
  componentDidUpdate(prevProps: InputUlanganProps, prevState: React.ComponentState) {
    if (prevState.loaded !== this.state.loaded) {
      
    }
  }
  render() {
    return (
      <div>RR</div>
    )
  }
}

interface InputUlanganProps extends WithStyles<typeof styles> {
  
}

const styles = (theme:Theme) => createStyles({

})

function InputComponent(props: any) {

    const classes = useStyles()
    const [isFetching, setFetching] = useState<boolean>(true)
    const [values, setValues] = React.useState<any>({
        kelas: {
            label: "Kelas",
            value: null,
            key: "kelas",
            type: "single",
        },
        siswa: {
            label: "Siswa",
            value: [],
            key: "siswa",
            type: "multiple",
            allowAllSelect: true,
        },
        mapel: {
            label: "Mapel",
            value: null,
            key: "mapel",
            type: "single",
        },
        kd: {
            label: "Materi",
            value: null,
            key: "kd",
            type: "single",
        },
    });
    const [nilaiSiswa, setNilaiSiswa] = useState<any[]>([])
    const [options, setOptions] = useState<{mapel: any; kelas: any; siswa: any;} | any>({mapel: [], kelas: [], siswa: []})
    const [date, setDate] = useState<Date | null>(new Date())
    const [kkm, setKkm] = useState<string>("0")
    useEffect(() => {
        setFetching(false)
    }, [])
    useEffect(() => {
        if (!isFetching) {
            props.subject.data.length === 0 && props.readSubjectRecords()
            props.class.data.length === 0 && props.readClassRecords()
            props.student.data.length === 0 && props.readStudentRecords()
            props.competence.data.length === 0 && props.readCompetenceRecords()
        }
      }, [props.request, isFetching])
    useEffect(() => {
      if (options.kelas.length !== 0 && props.student.data.length !== 0 && values.kelas.value !== null) {
        setOptions((oldState: any) => ({
          ...oldState,
          siswa: props.student.data
            .filter((a: any) => (a.tahun_masuk === props.appSetting.tahun_ajaran 
                ? "XI" 
                : a.tahun_masuk === props.appSetting.tahun_ajaran+1 
                  ? "X"
                  : a.tahun_masuk === props.appSetting.tahun_ajaran-1
                    ? "XII"
                    : "Unknown")
              + " " + a.jurusan.value === values.kelas.value.value)
            .map((a: any) => ({label: a.nama, value: a.nis}))
        }));
      }
    }, [values.kelas])
    useEffect(() => {
      props.competence.data.length !== 0 && values.mapel.value !== null && (
        setOptions((oldState: any) => ({
          ...oldState,
          kd: props.competence.data
            .filter((x: any) => x.nama_mapel.value === values.mapel.value.value)
            .map((x: any) => ({label: x.nama_materi, value: x.kode_materi}))
        }))
      )
    }, [values.mapel])
    useEffect(() => {
      if (props.subject.data.length !== 0 && values.kelas.value !== null) {
        setOptions((oldState: any) => ({
          ...oldState,
          mapel: props.subject.data
            .filter((x: any) => x.mapel_kelas.map((a: any) => a.value).includes(values.kelas.value.value) || x.mapel_kelas.map((a: any) => a.value).includes("semua kelas") )
            .map((x: any) => ({label: x.nama_mapel, value: x.kode_mapel}))
        }))
      }
    }, [values.siswa])
    useEffect(() => {
      if (values.kd.value !== null && (Array.isArray(values.siswa.value) ? values.siswa.value.length !== 0 : values.siswa.value !== null)) {
        setNilaiSiswa(values.siswa.value.map((x: any) => ({
          [x.value]: {
            nis: x.value,
            mapel: values.mapel.value.value,
            materi: values.kd.value.value,
            tanggal_ulangan: new Date(date!),
            nilai_ulangan: 0
          }
        })))
      }
    }, [values.kd])
    useEffect(() => {
      if (!isFetching) {
        setOptions({
          kelas: props.class.data
            .map((row: any) => ["X", "XI", "XII"]
            .map((crow: any) => ({label: crow + " " + row.nama_kelas, value: crow + " " + row.kode_kelas })))
            .flat(1).sort((a: any, b: any) => a.label > b.label ? 1 : -1),
        })
      }
    }, [props.class, props.student, props.competence, props.subject, isFetching])
    function handleChange(selectedOption: any, e: any) {
      !Object.keys(values)
        .map((x: string) => Array.isArray(values[x].value) 
          ? values[x].value.length === 0 
          : values[x].value === null).includes(true) && (setKkm("0"))
      for (let i2 = 0; i2 < Object.keys(values).length; i2++) {
        if (e.name === Object.keys(values)[i2] && i2 + 1 !== Object.keys(values).length) {
          setValues((oldState: any) => ({
            ...oldState,
            [Object.keys(values)[i2+1]]: {
              ...values[Object.keys(values)[i2+1]],
              value: Array.isArray(values[Object.keys(values)[i2+1]]) ? [] : null
            }
          }))
        }
        if (Array.isArray(values[Object.keys(values)[i2]]["value"]) 
          ? values[Object.keys(values)[i2]]["value"].length === 0 
          : values[Object.keys(values)[i2]]["value"] === null) {
            if (i2 + 1 !== Object.keys(values).length) {
              setValues((oldState: any) => ({
                ...oldState,
                [Object.keys(values)[i2+1]]: {
                  ...values[Object.keys(values)[i2+1]],
                  value: Array.isArray(values[Object.keys(values)[i2+1]]) ? [] : null
                }
              }))
            }
          }
        }
      const Obj = {
          ...values[e.name as string],
          value: selectedOption,
      }
      setValues((oldValues: any) => ({
          ...oldValues,
          [e.name as string]: Obj
      }));
    }
    function handleDateChange(date: Date | null) {
      setDate(date)
    }
    function handleChangeStateSiswa(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
      var filter = nilaiSiswa.map((x: any) => {
        if (Object.keys(x)[0] === event.target.name) {
          return {
            [event.target.name]: {
              ...x[event.target.name],
              kkm: parseInt(kkm),
              nilai_ulangan: parseInt(event.target.value),
              semester: props.appSetting.semester,
              tahun_ajaran: props.appSetting.tahun_ajaran
            }
          }
        }
        return x
      }) 
      setNilaiSiswa(filter)
    }
    function handleInsertExamScore(event: React.MouseEvent<HTMLButtonElement | null>) {
      props.insertExamScore(nilaiSiswa.map((x: any) => ({...x[Object.keys(x)[0]]})))
    }
    const inputSelect = () => {
        const arrBool: any[] = [...Array(Object.keys(values).length)]
        arrBool.shift()
        arrBool.unshift(true)
        var keys: any = Object.keys(values)
        
        return (
            <>
              {keys.map((x: string, i: number) => {
                for (let i2 = i+1; i2 > 0; i2--) {
                    if ((values[keys[i2-1]]["type"] === "single" && values[keys[i2-1]]["value"] !== null)
                    || (values[keys[i2-1]]["type"] === "multiple" && (values[keys[i2-1]]["value"] !== null && values[keys[i2-1]]["value"].length !== 0))) {
                        arrBool.splice(i2, 1, true)
                    }
                    if (values[keys[0]]["value"] === null) {
                        arrBool[i2] = false 
                    }
                }
                return arrBool[i] && (
                    <CustomSelect
                        key={i}
                        value={options[x]}
                        isSearchable
                        isClearable
                        allowAllSelect={values[x].allowAllSelect}
                        singleValue={values[x].value}
                        onChange={handleChange}
                        props={{
                            label: values[x].label,
                            inputId: x,
                            placeholder: "Pilih Data " + values[x].label,
                        }}
                        isMulti={values[x]["type"] === "multiple"}
                    />
                )
            })}
            {
              !keys.map((x: string) => Array.isArray(values[x].value) ? values[x].value.length !== 0 : values[x].value !== null ).includes(false) 
                &&
              <FormControl className={classes.kkmPickControl}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDateTimePicker 
                  value={date}
                  onChange={handleDateChange}
                  margin="normal"
                  label="Pilih tanggal dan waktu Ulangan"
                  style={{width: "50%", paddingRight: 8}}
                />
                </MuiPickersUtilsProvider> 
                <TextField 
                  type="number"
                  label="Kriteria Ketuntasan Minimal (KKM)"
                  placeholder="Nilai KKM"
                  inputProps={{min: 0, max: 100}}
                  defaultValue="0"
                  onChange={(e) => setKkm(e.target.value)}
                  className={classes.kkmField}
                />
              </FormControl>
            }
            </>
        )
    }
    const inputData = () => {
      const kys = Object.keys(values)
      return !kys.map((x: string) => Array.isArray(values[x].value) ? values[x].value.length === 0 : values[x].value === null).includes(true) && (kkm !== "0" && kkm !== "")
      && 
      (
        <Paper className={classes.tableNilai}>
        <Table style={{border: "none"}}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">No</TableCell>
              <TableCell style={{width: 150, padding: 8, paddingLeft: 0}}>NIS</TableCell>
              <TableCell style={{width: 300, padding: 8, paddingLeft: 0}}>Nama</TableCell>
              <TableCell style={{padding: 8, paddingLeft: 0}}>Form Nilai</TableCell>
              <TableCell style={{padding: 8, paddingLeft: 0}}>Kriteria Ketuntasan Minimal (KKM)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody> 
          {values.siswa.value
            .sort((a: any, b: any) => a.label > b.label ? 1 : -1)
            .map((x: any, i: number) => 
              <TableRow key={i}>
                <TableCell padding="checkbox">{i+1}</TableCell>
                <TableCell style={{width: 150, padding: 8, paddingLeft: 0}}>{x.value}</TableCell>
                <TableCell style={{width: 300, padding: 8, paddingLeft: 0}}>{x.label}</TableCell>
                <TableCell style={{padding: 8, paddingLeft: 0}}>
                  <TextField 
                    onBlur={handleChangeStateSiswa}
                    style={{width: 250}}
                    type="number"
                    name={String(x.value)}
                    defaultValue="0"
                    placeholder={"Nilai " + x.label.split(" ")[0]} 
                  />
                </TableCell>
                <TableCell style={{padding: 8, paddingLeft: 0}}>{kkm}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </Paper>
      )
    }
    return (
        <>
        <Grid container className={classes.formWrapper}>
            <Typography variant="h6" style={{marginBottom: 20}}>
                Input nilai ulangan
            </Typography>
            {inputSelect()}
            {inputData()}
            <Grid className={classes.bottomInfoNBtn}>
              <Typography variant="caption" style={{opacity: 0.7}}>Pastikan data di kolom benar-benar valid dengan data asli!</Typography>
              <Button variant="contained" color="primary" onClick={handleInsertExamScore} className={classes.buttonSubmit}>Tambah Data</Button>
            </Grid>
        </Grid>
        </>
    )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tableNilai: {
      width: "100%",
      overflowX: "auto",
      boxShadow: "none"
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
    kkmPickControl: {
      flexDirection: "row"
    },
    kkmField: {
      width: "50%",
      justifyContent: "center",
      marginBottom: -7,
      paddingLeft: 8,
      "&>label": {left: "auto", top: 16}
    },
    formWrapper: {
        flexDirection: "column",
        backgroundColor: "white",
        padding: theme.spacing(2),
        borderRadius: theme.spacing(0.5),
        boxShadow: theme.shadows[1]
    },
    formControl: {
        marginTop: theme.spacing(1), 
        marginBottom: theme.spacing(1), 
        minWidth: "100%",
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }),
);

const mapStateToProps = (state: any) => ({
    subject: state.subject,
    class: state.class,
    student: state.student,
    competence: state.competence,
    request: state.requestResponse,
    appSetting: state.settings.application,
}) 

const mapDispatchToProps = (dispatch: any) => ({
    readSubjectRecords: () => dispatch(Action.readSubjectRecords()),
    readClassRecords: () => dispatch(Action.readClassRecords()),
    readStudentRecords: () => dispatch(Action.makeStudentRequest()),
    readCompetenceRecords: () => dispatch(Action.readCompetenceRecords()),
    insertExamScore: (data: any) => dispatch(Action.insertExamScore(data, data))
})

export default connect(mapStateToProps, mapDispatchToProps)(InputComponent)
