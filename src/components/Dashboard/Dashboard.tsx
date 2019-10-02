import React from 'react';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import AssessmentIcon from '@material-ui/icons/Assessment';
import PeopleIcon from '@material-ui/icons/People';
import Person from '@material-ui/icons/Person';
import AssignmentIcon from '@material-ui/icons/Assignment';
import ClassIcon from '@material-ui/icons/Class';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Theme, WithStyles, Divider } from '@material-ui/core';
import { hexToRgbA } from '../../Helpers';
import { getDashboardInfo, getGradesWithCurrentSchoolYear } from '../../redux/ActionCreators/MiscActions';
import clsx from 'clsx';

const DashboardInfo: any[] = [
  {
    label: "Jumlah Siswa",
    key: "student_count",
    icon: Person,
    color: "#d32f2f",
    role: 1
  },
  {
    label: "Jumlah Guru",
    key: "teacher_count",
    icon: PeopleIcon,
    color: "#2f2fd3",
    role: 1,
  },
  {
    label: "Jumlah Mapel",
    key: "mapel_count",
    icon: AssignmentIcon,
    color: "#d3d32f",
    role: 1,
  },
  {
    label: "Jumlah Kelas",
    key: "class_count",
    icon: ClassIcon,
    color: "#2fd32f",
    role: 1,
  },
]

class Dashboard extends React.Component<DashboardProps> {
  state = {
    tabValue: 0,
    isLoading: true,
  }
  
  componentDidMount() {
    this.setState({isLoading: false})
  }

  componentDidUpdate(prevProps: DashboardProps, prevState: any) {
    if (this.state.isLoading !== prevState.isLoading) {
      !this.props.dashboard_info.is_requested && this.props.getDashboardInfo(this.props.app_setting.tahun_ajaran)
      !this.props.class_on_school_year.is_requested && this.props.getClassOnSchoolYear()
    }
  }

  change_tab = (event: React.ChangeEvent<{}>, newTabValue: number): void => {
    this.setState({tabValue: newTabValue})
  }

  fc_upper_case = (word: string): string => {
    word = word.split("_").join(" ")
    word = word.charAt(0).toUpperCase() + word.slice(1)
    return word
  }

  render() {
    return (
      <>
      <Typography variant="h6">Informasi Data</Typography>
      <Grid container className={this.props.classes.gridContainer}>
        {DashboardInfo.map((x:any) => (
          <Box className={this.props.classes.box} >
            <Typography variant="body1">
              {x.label}
            </Typography>
            <Typography variant="h6">
              {this.props.dashboard_info[x.key] || 0}
            </Typography>
            <Divider className={this.props.classes.divider}/>
            <Grid className={this.props.classes.dgrid}>
              <Typography variant="caption">Data berubah secara berkala</Typography><AssessmentIcon style={{opacity: 0.5}} />
            </Grid>
            <Box className={this.props.classes.floatBox} style={{color: hexToRgbA(x.color, 0.6), backgroundColor: x.color}}>
              <x.icon className={this.props.classes.floatIcon}/>
            </Box>
          </Box>
        ))}

        </Grid>
        <Typography variant="h6">Tabel Ranking 10 Besar</Typography>
        <AppBar className={this.props.classes.tableWrapper} position="static">
          <Tabs
            value={this.state.tabValue}
            onChange={this.change_tab}  
          >
          {(!this.props.dashboard_info.is_loading && !this.props.class_on_school_year.is_loading) && this.props.dashboard_info.rank_data
              .map((x: any, i: number) => {
                return (
                  <Tab value={i} label={`Kelas ${this.props.class_on_school_year.grade_on_school_year[x._id]}`} />
                )
              }) 
          }
          </Tabs>
        </AppBar>
        {(!this.props.dashboard_info.is_loading && !this.props.class_on_school_year.is_loading) && this.props.dashboard_info.rank_data
            .map((x: any, i: number) => {
          return (
            this.state.tabValue === i && 
              <Paper className={clsx(this.props.classes.tableContainer)}>
                <Table className={this.props.classes.tableContainer}>
                  <TableHead>
                    <TableRow>
                      <TableCell rowSpan={2} className={this.props.classes.pone} >Rank</TableCell>
                      <TableCell className={this.props.classes.addBorder} rowSpan={2}>NIS</TableCell>
                      <TableCell className={this.props.classes.addBorder} rowSpan={2}>Nama</TableCell>
                      <TableCell className={this.props.classes.addBorder} rowSpan={2}>Rata - rata</TableCell>
                      <TableCell className={this.props.classes.addBorder} rowSpan={2}>Kelas</TableCell>
                      <TableCell className={this.props.classes.addBorder} rowSpan={2}>Wali Kelas</TableCell>
                      <TableCell className={this.props.classes.addBorder} colSpan={3} align="center">Info Jumlah</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={this.props.classes.addBorder}>UH</TableCell>
                      <TableCell className={this.props.classes.addBorder}>Tugas</TableCell>
                      <TableCell className={this.props.classes.addBorder}>PTS/PAS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {x.data.map((z: any) => {
                      return (
                        <TableRow>
                          <TableCell className={this.props.classes.pone} align="center" >{z.rank}</TableCell>
                          <TableCell className={this.props.classes.addBorder}>{z.nis}</TableCell>
                          <TableCell className={this.props.classes.addBorder}>{z.nama}</TableCell>
                          <TableCell className={this.props.classes.addBorder}>{z.rata_rata}</TableCell>
                          <TableCell className={this.props.classes.addBorder}>{z.kelas}</TableCell>
                          <TableCell className={this.props.classes.addBorder}>{z.wali_kelas}</TableCell>
                          <TableCell className={this.props.classes.addBorder}>{z.jumlah_uh}</TableCell>
                          <TableCell className={this.props.classes.addBorder}>{z.jumlah_tugas}</TableCell>
                          <TableCell className={this.props.classes.addBorder}>{z.jumlah_ptpas}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </Paper>
          )
        })}
      </>
    )
  }
}

const styles = (theme: Theme) => createStyles({
  tableContainer: {
    width: "100%"
  },
  gridContainer: {
    flexWrap: "wrap",
    width: "100%",
    marginTop: theme.spacing(2),
    justifyContent: "space-between"
  },
  tableWrapper: {
    marginTop: theme.spacing(2)
  },
  addBorder: {
    borderLeft: "1px solid rgba(0,0,0,0.1)"
  },
  pone: {
    padding: theme.spacing(0, 2),
    backgroundColor: hexToRgbA(theme.palette.primary.dark, 0.1),
    width: theme.spacing(1)
  },
  floatBox: {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "5px 5px 10px ",
    top: -theme.spacing(2),
    left: "68%",
    width: theme.spacing(9),
    height: theme.spacing(9),
    borderRadius: theme.spacing(0.5)
  },
  floatIcon: {
    color: hexToRgbA("#FFFFFF", 0.9),
    width: theme.spacing(3.5),
    height: theme.spacing(3.5)
  },
  dgrid: {
    display: "flex", 
    alignItems: "center",
    justifyContent: "space-between"
  },
  divider: {
    marginBottom: theme.spacing(1.5),
    marginTop: theme.spacing(1.5)
  },
  box: {
    // "&:first-child": {marginLeft: 0},
    // "&:last-child": {marginRight: 0},
    marginBottom: theme.spacing(4),
    position: "relative",
    width: "23.33%",
    padding: theme.spacing(2.5),
    color: hexToRgbA("#000000", 0.7),
    backgroundColor: theme.palette.secondary.contrastText,
    borderRadius: theme.spacing(0.5) ,
    boxShadow: "5px 5px 10px " + hexToRgbA("#000000", 0.1)
  },
  chartContainer: {
    marginLeft: -22,
  },
})

interface DashboardProps extends WithStyles<typeof styles> {
  getDashboardInfo: (tahun_ajaran: number) => void;
  getClassOnSchoolYear: () => void;
  class_on_school_year: any;
  dashboard_info: any;
  app_setting: any;
}


const mapDispatchToProps = (dispatch: any) => ({
  getClassOnSchoolYear: () => dispatch(getGradesWithCurrentSchoolYear()),
  getDashboardInfo: (tahun_ajaran: number) => dispatch(getDashboardInfo(tahun_ajaran)),
})

const mapStateToProps = (state: any) => ({
  dashboard_info: state.dashboard_info,
  class_on_school_year: state.classOnSchoolYear,
  app_setting: state.settings.application
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Dashboard));