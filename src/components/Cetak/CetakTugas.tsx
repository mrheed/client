import React from 'react';
import { WithStyles } from '@material-ui/styles';
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import { connect } from 'react-redux';
import { Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Label from '@material-ui/core/FormLabel';
import PDF from './PDF/PDFTugas';
import { hexToRgbA } from '../../Helpers';
import { readReportTaskResult, readReportStudent, readReportTaskName, readReportSubject } from '../../redux/ActionCreators/CetakActions';

class CetakTugas extends React.Component<CetakTugasProps> {
    definitor = {
        ld: [{value: "l", label: "Sedang mengambil data..."}],
        nf: [{value: "404nf", label: "Maaf, data tidak tersedia"}]
    }
    state = {
        selectedAll: false,
		openModal: false,
        values: {
            kelas: "",
            siswa: [],
            mapel: "",
            tugas: "",
        },
        arrSiswa: this.definitor.nf,
        arrMapel: this.definitor.nf,
        arrTugas: this.definitor.nf,
        arrKelas: this.props.state.grades.map((x: string) => 
                  this.props.state.kelas.map((z: any) => ({value: x+" "+z.kode_kelas, label: x+" "+z.nama_kelas}))).flat(1)
    }
    componentDidUpdate(pp: CetakTugasProps, ps: any){
        const { semester, tahun_ajaran } = this.props.appSetting
        const { kelas, siswa, tugas, mapel } = this.state.values
        const { ld, nf } = this.definitor
        if (ps.values.kelas !== kelas) {
            var kls = kelas.split(" ")[0]
            kelas !== "" && this.props.readReportTaskStudent(`&tahun_masuk=${this.props.state.class_on_school_year.school_year_on_grade[kls]}&jurusan=${kelas.split(" ")[1]}`)
        }
        if (ps.values.siswa !== siswa && !this.props.report.siswa.loading) {
            (!siswa.includes("404nf" as never) && siswa.length) && 
				this.props.readReportTaskSubject(`&jurusan=${kelas.split(" ")[1]}&tahun_ajaran=${this.props.state.class_on_school_year.school_year_on_grade[kelas.split(" ")[0]]}`)
        }
        if (ps.values.mapel !== mapel && !this.props.report.mapel.loading) {
            (mapel !== "" && mapel !== "404nf") && this.props.readReportTaskName(`&mapel=${mapel}`)
        }
        if (ps.values.tugas !== tugas && !this.props.report.task_name.loading) {
            (tugas && tugas !== "404nf") && this.props.readReportTaskResult(`&nis=${siswa.join(",")}&jurusan=${kelas}&mapel=${mapel}&nama_tugas=${tugas}`)
        }
        if (pp.report.siswa.loading !== this.props.report.siswa.loading) {
            var loading = this.props.report.siswa.loading,
                len = this.props.report.siswa.data.length
            this.setState((x: any) => ({
                values: {
                    ...x.values,
                    siswa: loading ? ["l"] : len ? [] : ["404nf"]
                },
                arrSiswa: loading ? ld : len ? this.props.report.siswa.data : nf
            }))
        }
        if (pp.report.mapel.loading !== this.props.report.mapel.loading) {
            var loading = this.props.report.mapel.loading,
                len = this.props.report.mapel.data.length
            this.setState((x: any) => ({
                values: {
                    ...x.values,
                    mapel: loading ? "l" : len ? "" : "404nf"
                },
                arrMapel: loading ? ld : len ? this.props.report.mapel.data : nf
            }))
        }
        if (pp.report.task_name.loading !== this.props.report.task_name.loading) {
            var loading = this.props.report.task_name.loading,
                len = this.props.report.task_name.data.length
            this.setState((x: any) => ({
                values: {
                    ...x.values,
                    tugas: loading ? "l" : len ? [] : "404nf"
                },
                arrTugas: loading ? ld : len ? this.props.report.task_name.data : nf
            }))
        }
    }
	handleOpenModal = () => {
		this.setState({openModal: true})
	}
	handleCloseModal = () => {
		this.setState({openModal: false})
	}
    handleChange = (event: React.ChangeEvent<{ name?: string | undefined; value: unknown; }>) => {
        this.props.refresh(event.target.name as string, this.state.values, event.target.value)
        if (event.target.value === "404nf" || (event.target.value as Array<any>)[0] === "404nf") return false
        if (event.target.name === "siswa" && (event.target.value as any[]).includes("*")) {
            this.selectAll()
            return false
        }
        this.setState((prev: any) => ({
            values: {
                ...prev.values,
                [event.target.name as string] : event.target.value
            }
        }))
    }
    selectAll = () => {
        if (!this.state.selectedAll) {
            this.setState((prev: any) => ({
                selectedAll: !prev.selectedAll,
                values: {
                    ...prev.values,
                    siswa: this.state.arrSiswa.map((x: any) => x.value)
                }
            }))
        } else {
            this.setState((prev: any) => ({
                selectedAll: !prev.selectedAll,
                values: {...prev.values, siswa: []}
            }))
        }
    }
    getSection = () => {
        const { kelas, siswa, mapel, tugas } = this.state.values
        const kelasForm = (
            <Grid container className={this.props.classes.formWrapper}>
                <Grid item xs={12} sm={2} className={this.props.classes.inputLabel}>
                    <Label className={this.props.classes.labelClass}>Kelas</Label>
                </Grid>
                <Grid item xs={12} sm={10} className={this.props.classes.inputLabel}>
                    <FormControl fullWidth>
                        <Select 
                            value={kelas} 
                            name="kelas"
                            className={this.props.classes.input} 
                            onChange={this.handleChange}>
                            {this.state.arrKelas.map((x: any) => <MenuItem key={x.value} value={x.value}>{x.label}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        )
        const siswaForm = (
            <Grid container className={this.props.classes.formWrapper}>
                <Grid item xs={12} sm={2} className={this.props.classes.inputLabel}>
                    <Label className={this.props.classes.labelClass}>Siswa</Label>
                </Grid>
                <Grid item xs={12} sm={10} className={this.props.classes.inputLabel}>
                    <FormControl fullWidth>
                        <Select 
                            value={siswa} 
                            name="siswa"
                            readOnly={this.props.report.siswa.loading}
                            multiple
                            className={this.props.classes.input} 
                            onChange={this.handleChange}>
                            {this.state.arrSiswa.map((x: any) => x.value !== "404nf")[0] && 
                                <MenuItem value="*">{!this.state.selectedAll ? "Pilih semua" : "Hapus semua pilihan"}</MenuItem>
                            }
                            {this.state.arrSiswa.map((x: any) => <MenuItem key={x.value} value={x.value}>{x.label}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        )
        const mapelForm = (
            <Grid container className={this.props.classes.formWrapper}>
                <Grid item xs={12} sm={2} className={this.props.classes.inputLabel}>
                    <Label className={this.props.classes.labelClass}>Mata pelajaran</Label>
                </Grid>
                <Grid item xs={12} sm={10} className={this.props.classes.inputLabel}>
                    <FormControl fullWidth>
                        <Select 
                            value={mapel} 
                            readOnly={this.props.report.mapel.loading}
                            name="mapel"
                            className={this.props.classes.input} 
                            onChange={this.handleChange}>
                            {this.state.arrMapel.map((x: any) => <MenuItem key={x.value} value={x.value}>{x.label}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        )
        const tugasForm = (
            <Grid container className={this.props.classes.formWrapper}>
                <Grid item xs={12} sm={2} className={this.props.classes.inputLabel}>
                    <Label className={this.props.classes.labelClass}>Nama tugas</Label>
                </Grid>
                <Grid item xs={12} sm={10} className={this.props.classes.inputLabel}>
                    <FormControl fullWidth>
                        <Select 
                            value={tugas} 
                            readOnly={this.props.report.task_name.loading}
                            name="tugas"
                            className={this.props.classes.input} 
                            onChange={this.handleChange}>
                            {this.state.arrTugas.map((x: any) => <MenuItem key={x.value} value={x.value}>{x.label}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        )
        return {kelasForm, siswaForm, mapelForm, tugasForm}
    }
    render(){
        return(
			<Grid container className={this.props.classes.wrapper}>
                <Grid>
                    <Typography variant="h6" className={this.props.classes.title}>Form Tugas</Typography>
                </Grid>
                {this.getSection().kelasForm}
                {(this.state.values.kelas && this.state.values.kelas !== "404nf") ? this.getSection().siswaForm : ""}
                {(this.state.values.siswa.length && !this.state.values.siswa.includes("404nf" as never)) ? this.getSection().mapelForm : ""}
                {(this.state.values.mapel && this.state.values.mapel !== "404nf") && this.getSection().tugasForm}
                <Grid container alignItems="center" justify="space-between">
                    <Grid item md={11}>
                        <Typography variant="caption">Note: tombol berfungsi jika semua data terisi dan request ke server berhasil</Typography>
                    </Grid>
                    <Grid item md={1}>
                        <Button variant="contained" color="primary" onClick={() => {
                            if (this.props.report.result.data.length) {
                                this.handleOpenModal()
                            }
                        }}>Preview</Button>
                    </Grid>
                </Grid>
                {this.props.report.result.data && 
                    <Dialog 
                        open={this.state.openModal}
                        onEscapeKeyDown={this.handleCloseModal}
                        onBackdropClick={this.handleCloseModal}
                        fullWidth
                        maxWidth="lg"    
                    >
                        <DialogContent>
                            <PDF data={this.props.report.result.data} />
                        </DialogContent>
                    </Dialog>
                }
            </Grid>
        )
    }
}

const styles = (theme: Theme) => createStyles({
    wrapper: {
        flexDirection: "column",
        backgroundColor: "white",
        borderRadius: theme.spacing(1),
        padding: theme.spacing(0, 3, 3),
        boxShadow: theme.shadows[1]
    },
    formWrapper: {

    },
    title: {
        padding: theme.spacing(2.5),
        marginTop: -theme.spacing(2.5),
        borderRadius: theme.spacing(0.5),
        boxShadow: `0 4px 20px 0 rgba(0, 0, 0,.14), 0 7px 10px -5px ${hexToRgbA(theme.palette.primary.main, 0.4)}`,
        display: "inline-block",
        fontSize: "1.3em",
        color: "white",
        fontWeight: 300,
        background: `linear-gradient(60deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
    },
    input: {
        "&:hover::before": {
            borderBottom: "1px solid rgba(0, 0, 0, 0.42)!important"
        },
        marginBottom: theme.spacing(2)
    },
    inputLabel: {
        padding: theme.spacing(0, 2),
        paddingTop: theme.spacing(3)    
    },
    labelClass: {
        fontSize: "1em",
        float: "right",
        paddingTop: theme.spacing(2)
    }
}) 

interface CetakTugasProps extends WithStyles<typeof styles> {
    refresh: (name: string, values: any, selectedOption: any) => void;
    readReportTaskStudent: (opt?: string) => void;
    readReportTaskSubject: (opt?: string) => void;
    readReportTaskResult: (opt?: string) => void;
    readReportTaskName: (opt?: string) => void;
    appSetting: any;
    report: any;
    class: any;
    state: any;
}

const mapStateToProps = (state: any) => ({
    appSetting: state.settings.application,
    class: state.class,
    report: state.report
})

const mapDispatchToProps = (dispatch: any) => ({
    readReportTaskStudent: (opt?: string) => dispatch(readReportStudent("assignment", opt)),
    readReportTaskSubject: (opt?: string) => dispatch(readReportSubject("assignment", opt)),
    readReportTaskResult: (opt?: string) => dispatch(readReportTaskResult(opt)),
    readReportTaskName: (opt?: string) => dispatch(readReportTaskName(opt))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CetakTugas))
