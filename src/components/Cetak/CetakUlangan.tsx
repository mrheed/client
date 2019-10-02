import React from 'react';
import { WithStyles } from '@material-ui/styles';
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import { connect } from 'react-redux';
import { Theme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Label from '@material-ui/core/FormLabel';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import PDF from './PDF/PDFUlangan';
import { hexToRgbA } from '../../Helpers';
import { readReportStudent, readReportTaskName, readReportExamMaterial, readReportSubject, readReportExamResult } from '../../redux/ActionCreators/CetakActions';

class CetakUlangan extends React.Component<CetakUlanganProps> {
    definitor = {
        ld: [{value: "l", label: "Sedang mengambil data..."}],
        nf: [{value: "404nf", label: "Maaf, data tidak tersedia"}]
    }
    state = {
        openModal: false,
        selectedAll: false,
        values: {
            kelas: "",
            tipe: "",
            siswa: [],
            mapel: "",
            materi: "",
        },
        arrSiswa: this.definitor.nf,
        arrMapel: this.definitor.nf,
        arrMateri: this.definitor.nf,
        arrTipe: this.props.state.exType,
        arrKelas: this.props.state.grades.map((x: string) => 
                  this.props.state.kelas.map((z: any) => ({value: x+" "+z.kode_kelas, label: x+" "+z.nama_kelas}))).flat(1)
    }
    componentDidUpdate(pp: CetakUlanganProps, ps: any){
        const { kelas, siswa, tipe, materi, mapel } = this.state.values
        const { ld, nf } = this.definitor
        const { semester, tahun_ajaran } = this.props.appSetting
		console.log("=======================Materi======================")
		console.log(ps.values.materi, materi)
		console.log("=======================Mapel=====================")
		console.log(ps.values.mapel, mapel)
        if (ps.values.tipe !== tipe || ps.values.kelas !== kelas){
			var kls = kelas.split(" ")[0]
            tipe !== "" && this.props.readReportExamStudent(tipe, `&jurusan=${kelas.split(" ")[1]}&tahun_masuk=${this.props.state.class_on_school_year.school_year_on_grade[kls] || 1}`)
        }
        if (tipe === "UH" ? (ps.values.materi !== materi) : (ps.values.mapel !== mapel)) {
            (tipe === "UH" ? (materi !== "" && materi !== "l") : (mapel !== "" && mapel !== "l")) && 
				this.props.readReportExamResult(`&jurusan=${kelas}&nis=${siswa.join(",")}&mapel=${mapel}${tipe === "UH" ? `&materi=${materi}` : ``}&tipe=${tipe}`)
        }   
        if (tipe) {
            if (ps.values.siswa !== siswa && !this.props.report.siswa.loading){
                (siswa.length && !siswa.includes("404nf" as never)) && this.props.readReportExamSubject(tipe, `&jurusan=${kelas.split(" ")[1]}&tahun_ajaran=${this.props.state.class_on_school_year.school_year_on_grade[kelas.split(" ")[0]]}`)
            }
            if (tipe === "UH" && ps.values.mapel !== mapel && !this.props.report.mapel.loading) {
                (mapel !== "" && mapel !== "404nf") && this.props.readReportExamMaterial(tipe, `&mapel=${mapel}`)
            }
            if (pp.report.siswa.loading !== this.props.report.siswa.loading) {
                var loading = this.props.report.siswa.loading
                var len = this.props.report.siswa.data.length
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
            if (tipe === "UH" && pp.report.materi.loading !== this.props.report.materi.loading) {
                var loading = this.props.report.materi.loading,
                    len = this.props.report.materi.data.length
                this.setState((x: any) => ({
                    values: {
                        ...x.values,
                        materi: loading ? "l" : len ? "" : "404nf"
                    },
                    arrMateri: loading ? ld : len ? this.props.report.materi.data : nf
                }))
            }
        }
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
    handleOpenModal = () => {
        this.setState({openModal: true})
    }
    handleCloseModal = () => {
        this.setState({openModal: false})
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
        const { kelas, tipe, siswa, mapel, materi } = this.state.values
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
        const tipeForm = (
            <Grid container className={this.props.classes.formWrapper}>
                <Grid item xs={12} sm={2} className={this.props.classes.inputLabel}>
                    <Label className={this.props.classes.labelClass}>Tipe Ulangan</Label>
                </Grid>
                <Grid item xs={12} sm={10} className={this.props.classes.inputLabel}>
                    <FormControl fullWidth>
                        <Select 
                            value={tipe} 
                            name="tipe"
                            className={this.props.classes.input} 
                            onChange={this.handleChange}>
                            {this.state.arrTipe.map((x: any) => <MenuItem key={x.value} value={x.value}>{x.label}</MenuItem>)}
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
        const materiForm = (
            <Grid container className={this.props.classes.formWrapper}>
                <Grid item xs={12} sm={2} className={this.props.classes.inputLabel}>
                    <Label className={this.props.classes.labelClass}>Materi mapel</Label>
                </Grid>
                <Grid item xs={12} sm={10} className={this.props.classes.inputLabel}>
                    <FormControl fullWidth>
                        <Select 
                            value={materi} 
                            readOnly={this.props.report.materi.loading}
                            name="materi"
                            className={this.props.classes.input} 
                            onChange={this.handleChange}>
                            {this.state.arrMateri.map((x: any) => <MenuItem key={x.value} value={x.value}>{x.label}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        )
        return {kelasForm, tipeForm, siswaForm, mapelForm, materiForm}
    }
    render(){
        return(
            <Grid container className={this.props.classes.wrapper}>
                <Grid>
                    <Typography variant="h6" className={this.props.classes.title}>Form Ulangan</Typography>
                </Grid>
                {this.getSection().kelasForm}
                {this.state.values.kelas !== "" && this.getSection().tipeForm}
                {this.state.values.tipe !== "" && this.getSection().siswaForm}
                {(this.state.values.siswa.length && !this.state.values.siswa.includes("404nf" as never)) ? this.getSection().mapelForm : ""}
                {(this.state.values.mapel !== "" && this.state.values.tipe === "UH") && this.getSection().materiForm}
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
				{console.log(this.props.report)}
                {this.props.report.result.data && 
                    <Dialog 
                        open={this.state.openModal}
                        onEscapeKeyDown={this.handleCloseModal}
                        onBackdropClick={this.handleCloseModal}
                        fullWidth
                        maxWidth="lg"    
                    >
                        <DialogContent>
                            <PDF tipe={this.state.values.tipe} data={this.props.report.result.data} />
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

interface CetakUlanganProps extends WithStyles<typeof styles> {
	refresh: (name: string, values: any, selectedOption: any) => void;
    readReportExamMaterial: (type: string, opt?: string) => void;
    readReportExamStudent: (type: string, opt?: string) => void;
    readReportExamSubject: (type: string, opt?: string) => void;
	readReportExamResult: (type: string, opt?: string) => void;
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
    readReportExamResult: (opt?: string) => dispatch(readReportExamResult(opt)),
    readReportExamStudent: (type: string, opt?: string) => dispatch(readReportStudent(type, opt)),
    readReportExamSubject: (type: string, opt?: string) => dispatch(readReportSubject(type, opt)),
	readReportExamMaterial: (type: string, opt?: string) => dispatch(readReportExamMaterial(type, opt)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CetakUlangan))
