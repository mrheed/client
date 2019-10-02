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
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Label from '@material-ui/core/FormLabel';
import { hexToRgbA } from '../../Helpers';
import { readReportStudent, readReportTaskName, readReportSubject } from '../../redux/ActionCreators/CetakActions';

class CetakRapor extends React.Component<CetakRaporProps> {
    definitor = {
        ld: [{value: "l", label: "Sedang mengambil data..."}],
        nf: [{value: "404nf", label: "Maaf, data tidak tersedia"}]
    }
    state = {
        selectedAll: false,
        values: {
            kelas: "",
            siswa: [],
        },
        arrSiswa: this.definitor.nf,
        arrKelas: this.props.state.grades.map((x: string) => 
                  this.props.state.kelas.map((z: any) => ({value: x+" "+z.kode_kelas, label: x+" "+z.nama_kelas}))).flat(1)
    }
    componentDidUpdate(pp: CetakRaporProps, ps: any){
        const { semester, tahun_ajaran } = this.props.appSetting
        const { kelas, siswa } = this.state.values
        const { ld, nf } = this.definitor
        if (ps.values.kelas !== kelas) {
            var kls = kelas.split(" ")[0]
            var thnMasuk = kls === "X" ? tahun_ajaran + 1 : kls === "XI" ? tahun_ajaran : kls === "XII" ? tahun_ajaran - 1 : -1
            kelas !== "" && this.props.readReportTaskStudent(`&tahun_masuk=${thnMasuk}&jurusan=${kelas.split(" ")[1]}`)
        }
        
        if (pp.report.siswa.loading !== this.props.report.siswa.loading) {
            var loading = this.props.report.siswa.loading = this.props.report.siswa.data.length,
                len = this.props.report.siswa.data.length
            this.setState((x: any) => ({
                values: {
                    ...x.values,
                    siswa: loading ? ["l"] : len ? [this.props.report.siswa.data[0]["value"]] : ["404nf"]
                },
                arrSiswa: loading ? ld : len ? this.props.report.siswa.data : nf
            }))
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
        const { kelas, siswa } = this.state.values
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
        return {kelasForm, siswaForm}
    }
    render(){
        return(
            <Grid container className={this.props.classes.wrapper}>
                <Grid>
                    <Typography variant="h6" className={this.props.classes.title}>Form Rapor</Typography>
                </Grid>
                {this.getSection().kelasForm}
                {this.getSection().siswaForm}
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

interface CetakRaporProps extends WithStyles<typeof styles> {
    refresh: (name: string, values: any, selectedOption: any) => void;
    readReportTaskName: (opt?: string) => void;
    readReportTaskStudent: (opt?: string) => void;
    readReportTaskSubject: (opt?: string) => void;
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
    readReportTaskName: (opt?: string) => dispatch(readReportTaskName(opt))
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(CetakRapor))
