import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';
import Close from '@material-ui/icons/Close';
import { LineChart, AreaChart, Area, PieChart, Pie, Line, YAxis, XAxis, Legend, ResponsiveContainer, CartesianGrid, Tooltip as TooltipChart } from 'recharts'
import { makeStyles, createStyles } from '@material-ui/styles';
import Appbar from '@material-ui/core/AppBar';
import { Theme, Table, TableHead, TableRow, TableCell, Paper, TableBody } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles'
import { AntTab, AntTabs } from './AntTab';
import Divider from '@material-ui/core/Divider';
import { hexToRgbA } from '../../Helpers';
import { readExamRecordPerSubject } from '../../redux/ActionCreator';
import Months from './Months.json';
import { getGradesWithCurrentSchoolYear } from '../../redux/ActionCreators/MiscActions';

interface DetailExam {
    isOpen: boolean;
    appSetting: any;
    setOpen: Function;
    currentData: DataNilai;
    setCurrentData: Function;
    grade_on_school_year: Array<any>;
    readExamRecordPerSubject: Function;
    dataPerMapel: {data: any[]; loading: boolean;};
}
interface DaftarUlanganPerMapel {
    _id: number;
    data_mapel: DataMapelPerUlangan[]
}
interface DataMapelPerUlangan {
    avg_data: any[];
    mapel: string;
    urai_data: any[];
}
export interface DataNilai {
    _id: number;
    remidi: number;
    kelas: {jurusan: string; tahun: number};
    nama: string;
    avg_uh: number;
    jml_uh: number;
    data_uh: DaftarMapel[]
  }
export interface DaftarMapel {
    nilai_uh: number;
    kkm: number;
    tanggal_uh: string;
}

function DetailExam({
        currentData, 
        setCurrentData, 
        setOpen, 
        appSetting, 
        isOpen, 
        dataPerMapel, 
        readExamRecordPerSubject, 
        grade_on_school_year
    }: DetailExam) {
    const classes = styles(DetailExam)
    const theme = useTheme()
    const [tab, setTab] = useState<number>(0)
    const [fetching, setFetching] = useState<boolean>(true)
    const [data] = useState(() => currentData.data_uh.map((x: DaftarMapel) => ({tanggal: new Date(x.tanggal_uh).toLocaleString(), nilai: x.nilai_uh, ...x})))
    const [dataMapel, setDataMapel] = useState<{avg: any[], data_mapel: any[]}>({avg: [], data_mapel: []})
    useEffect(() => {
        fetching && setFetching(false)
        if (!fetching) {
			!dataPerMapel.data.map((x: any) => x._id === currentData._id).includes(true) && readExamRecordPerSubject({
                nis: currentData._id
			})
        }
    }, [fetching])
    useEffect(() => {
		(dataPerMapel.data.length !== 0 && dataPerMapel.data.map((x: any) => x._id === currentData._id).includes(true))
			&& setDataMapel(dataPerMapel.data.filter((x: any) => x._id === currentData._id)[0])
		console.log(dataPerMapel)
    }, [dataPerMapel.data])
    function filterMonth(indexMonth: number) {
        return Months.filter((x: any, i: number) => i === indexMonth)[0]
    }
    function handleTabChange(event: React.ChangeEvent<{}>, newVal: number){
        setTab(newVal)
    }
    return (
        <Dialog fullScreen open={isOpen}>
            <Appbar color="primary" className={classes.appbar}>
                <Grid container alignItems="center" justify="space-between">
                  <Typography variant="h6">Detail nilai siswa</Typography>
                  <Tooltip title="Keluar" onClick={() => {
                    setOpen(false)
                    setCurrentData({
                        _id: 0,
                        remidi: 0,
                        kelas: {jurusan: "", tahun: 0},
                        nama: "",
                        avg_uh: 0,
                        jml_uh: 0,
                        data_uh: []
                      })
                  }}><IconButton color="inherit"><Close/></IconButton></Tooltip>
                </Grid>
            </Appbar>
            <DialogContent className={classes.content}>
            <Grid container justify="space-between">
            <Grid className={classes.mainGraph}>
            <Typography variant="h6" className={classes.typ1}>Grafik nilai (Semua mapel) </Typography>
            <ResponsiveContainer width="100%" height={300} >
                <AreaChart data={data} margin={{left: -24}}>
                    <CartesianGrid strokeDasharray="3 2" />
                    <XAxis dataKey="tanggal" />
                    <YAxis  />
                    <TooltipChart />
                    <Legend />
                    <Area dataKey="nilai" stroke="#8884d8" fill={hexToRgbA("#8884d8", 0.1)} activeDot={{ r: 8 }} />
                    <Area dataKey="kkm" stroke="#42f545" fill={hexToRgbA("#42f545", 0.1)} activeDot={{ r: 8 }} />
                </AreaChart>
            </ResponsiveContainer>
            </Grid>
            <Grid className={classes.leftInfo}>
                <Typography variant="h6">Detail siswa</Typography>
                <Typography variant="body1" className={classes.detailSiswa}>Nama siswa : {currentData.nama}</Typography>
                <Typography variant="body1" className={classes.detailSiswa}>Rata-rata ulangan : {currentData.avg_uh}</Typography>
                <Typography variant="body1" className={classes.detailSiswa}>Kelas : {(grade_on_school_year[currentData.kelas.tahun] || "Other") + " " + currentData.kelas.jurusan}</Typography>
                <Typography variant="body1" className={classes.detailSiswa}>Total remidi : {currentData.remidi} kali</Typography>
                <Typography variant="body1" className={classes.detailSiswa}>Total ulangan yang diikuti : {currentData.jml_uh} kali</Typography>
                <Typography variant="h6">Rata-rata nilai per mapel</Typography>
                {!dataPerMapel.loading ? dataPerMapel.data.length !== 0 && 
                <ResponsiveContainer width="100%" height={150} >
                <PieChart>
                    <Pie dataKey="Rata-rata" label nameKey="mapel" data={dataMapel["avg"]} cx="50%" cy="50%" fill={hexToRgbA("#35f29d", 0.9)} />
                    <TooltipChart />
                </PieChart>
            </ResponsiveContainer>: <div>Loading</div>}
            </Grid>
            </Grid>
            <Grid container className={classes.titleMapelInfo}>
                <Typography variant="body1" color="inherit">Informasi nilai setiap mata pelajaran</Typography>
            </Grid>
            <Grid container className={classes.mapelInfo}>
                <AntTabs value={tab} variant="scrollable" scrollButtons="auto" onChange={handleTabChange}>
                    {
                        !dataPerMapel.loading 
                        ? dataPerMapel.data.length !== 0 && 
                            dataMapel["data_mapel"].map((x: any) => {
                                return (
                                    <AntTab key={x.mapel} label={x.mapel}/>
                                )
                            })
                        : <AntTab label="Loading" />
                    }
                </AntTabs>
                    {
                        !dataPerMapel.loading
                        ? dataPerMapel.data.length !== 0 ?
                            dataMapel["data_mapel"].map((x: any, i: number) => {
                                return ( 
                                    tab === i && (
                                        <React.Fragment key={i}>
                                        <Grid container dir={theme.direction} justify="space-between" className={classes.expanDetails}>
                                            <div className={classes.graphMapel}>
                                                <ResponsiveContainer width="100%" height={220} >
                                                <PieChart>
                                                <Pie 
                                                    dataKey="Rata-rata" 
                                                    label 
                                                    nameKey="month" 
                                                    cx="50%" 
                                                    cy="50%" 
                                                    fill={hexToRgbA("#8884d8", 0.9)}
                                                    data={x.avg_data.map((z: any) => ({["Rata-rata"]: z.avg, month: filterMonth(z.month-1)["abbreviation"]}))} />
                                                <TooltipChart />
                                                </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                            <div className={classes.infoRightGraphMapelWrapper}>
                                            <Typography variant="caption" >Tabel data ulangan</Typography>
                                            <Table className={classes.infoRightGraphMapel}>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell className={classes.rowFirst}>Bulan</TableCell>
                                                        {x.avg_data.map((z: any) => <TableCell key={z.month}>{filterMonth(z.month-1)["name"]+" "+ new Date(z.date[0]).getFullYear()}</TableCell>)}
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell className={classes.rowFirst}>Rata-rata</TableCell>
                                                        {x.avg_data.map((z: any) => <TableCell key={z.month}>{z.avg}</TableCell>)}
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className={classes.rowFirst}>Total remidi</TableCell>
                                                        {x.avg_data.map((z: any) => <TableCell key={z.month}>{z.jumlah_remidi}</TableCell>)}
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell className={classes.rowFirst}>Total ulangan</TableCell>
                                                        {x.avg_data.map((z: any) => <TableCell key={z.month}>{z.jumlah_ulangan}</TableCell>)}
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                            </div>
                                        </Grid>
                                        <Grid container className={classes.tableBtm}>
                                        <Typography variant="body2" style={{marginLeft: 20}}>Uraian data setiap ulangan</Typography>
                                        <Divider />
                                        <Table >
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Materi</TableCell>
                                                    <TableCell>Nilai ulangan</TableCell>
                                                    <TableCell>Kriteria Ketuntasan Minimal (KKM)</TableCell>
                                                    <TableCell>Tanggal ulangan</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {x.urai_data.map((z: any) => 
                                                    <React.Fragment key={z.bulan}>
                                                        <TableRow>
                                                            <TableCell align="center" className={classes.rowDivider} colSpan={99}>Data pada bulan {filterMonth(z.bulan-1)["name"] + " Tahun " + new Date(z.date[0]).getFullYear()}</TableCell>
                                                        </TableRow>
                                                        {z.data.map((y: any) => 
                                                            <TableRow key={y.materi}>
                                                                <TableCell>{y.materi}</TableCell>
                                                                <TableCell>{y.nilai_ulangan}</TableCell>
                                                                <TableCell>{y.kkm}</TableCell>
                                                                <TableCell>{new Date(y.tanggal_ulangan).toLocaleString()}</TableCell>
                                                            </TableRow>    
                                                        )}
                                                    </React.Fragment>
                                                )}
                                            </TableBody>
                                        </Table>
                                        </Grid>
                                        </React.Fragment>
                                    )
                                )
                            }) : <div>Data didn't found</div>
                        : <div>Loading</div>
                    }
            </Grid>
            </DialogContent>
          </Dialog>
    )
}

const styles = makeStyles((theme: Theme) => createStyles({
    typ1: {
        marginBottom: theme.spacing(2),
    },
    rowFirst: {
        paddingRight: theme.spacing(1),
        width: theme.spacing(24)
    },
    rowDivider: {
        backgroundColor: hexToRgbA("#000000", 0.03)
    },
    tableBtm: {
        backgroundColor: "white"
    },
    infoRightGraphMapelWrapper: {
        width: "80%",
    },
    infoRightGraphMapel: {
        marginTop: theme.spacing(1),
        "& > td, td, table, th": {
            border: "1px solid " + hexToRgbA("#000000", 0.2)
        },
    },
    graphMapel: {
        width: "20%"
    },
    expanDetails: {
        width: "100%",
        backgroundColor: 'white',
        padding: theme.spacing(1, 2)
    },
    mapelInfo: {
        display: "flex",
        flexWrap: "wrap",
        boxShadow: "3px 3px 8px " + hexToRgbA("#000000", 0.1)
    },
    mapelInfoMapelTitle: {
        padding: theme.spacing(0.3, 1, 1, 1),
        fontWeight: 500
    },
    avatarCard: {
        margin: theme.spacing(1, 0),
        background: theme.palette.primary.dark
    },
    titleMapelInfo: {
        justifyContent: "center",
        marginTop: theme.spacing(2),
        padding: theme.spacing(1, 2),
        color: "white!important",
        boxShadow: "3px 3px 8px " + hexToRgbA(theme.palette.primary.main, 0.3),
        backgroundColor: theme.palette.primary.main
    },
    mapelInfoChild: {
        boxShadow: "3px 3px 8px " + hexToRgbA("#000000", 0.1),
        backgroundColor: "white",
        padding: theme.spacing(1, 2),
        width: "24%",
        margin: "0 0.5%",
        "&:first-child": {marginLeft: 0},
        "&:last-child": {marginRight: 0}
    },
    leftInfo: {
        width: "29%",
        padding: theme.spacing(2.5),
        backgroundColor: "white",
        boxShadow: "3px 3px 8px " + hexToRgbA("#000000", 0.1)
    },
    detailSiswa: {
        opacity: 0.8,
        marginBottom: theme.spacing(0.45)
    },
    content: {
        backgroundColor: hexToRgbA("#000000", 0.03),
        marginTop: theme.spacing(9)
    },
    appbar: {
        padding: theme.spacing(1, 2)
    },
    mainGraph: {
        width: "70%",
        backgroundColor: "white",
        padding: theme.spacing(2),
        boxShadow: "3px 3px 8px " + hexToRgbA("#000000", 0.1)
    },
    mainTitle: {
        padding: theme.spacing(1, 2),
        marginBottom: theme.spacing(1),
        backgroundColor: "white",
        width: "100%",
        textAlign: "center",
        boxShadow: "3px 3px 8px " + hexToRgbA("#000000", 0.1)
    }
}))

export default connect(
    (state: any) => ({
        dataPerMapel: state.uhPerMapel,
        appSetting: state.settings.application,
    }), 
    (dispatch: any) => ({
        readExamRecordPerSubject: (data: any) => dispatch(readExamRecordPerSubject(data)),
    })
)(DetailExam)
