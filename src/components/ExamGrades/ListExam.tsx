import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import InputBase from '@material-ui/core/InputBase';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';
import Detail from '@material-ui/icons/Receipt';
import * as Action from '../../redux/ActionCreator';
import Pagination from '../Table/CreatePagination';
import TableHeader from '../Table/EnhancedHeader';
import { getSorting, stableSort } from '../Table/Tool';
import { Order } from '../Table/EnhancedHeader';
import { tblStyle } from '../Table/Style';
import DetailExam, {DaftarMapel, DataNilai} from './DetailExam';
import { Crumb } from '..';
import { getGradesWithCurrentSchoolYear } from '../../redux/ActionCreators/MiscActions';

const Header = [
  {key: "rank_sekolah", label: "Rank"},
  {key: "_id", label: "NIS"}, 
  {key: "nama", label: "Nama siswa"}, 
  {key: "kelas", label: "Kelas"}, 
  {key: "rank_kelas", label: "Rank kelas"}, 
  {key: "avg_uh", label: "Rata-rata"}, 
  {key: "jml_uh", label: "Jumlah ulangan"}, 
  {key: "remidi", label: "Jumlah remidi"}, 
  {key: "Detail ulangan", label: "Detail ulangan"}
]
function ListExam(props: any) {
    const classes = tblStyle()
    const [page, setPage] = useState<number>(0)
    const [filter, setFilter] = useState<any[]>([])
    const [search, setSearch] = useState<string>("")
    const [order, setOrder] = useState<Order>("asc")
    const [selected, setSelected] = useState<any[]>([])
    const [d1Open, setD1Open] = useState<boolean>(false)
    const [isFetching, setFetching] = useState<boolean>(true)
    const [rowsPerPage, setRowsPerPage] = useState<number>(5)
    const [currentData, setCurrentData] = useState<DataNilai>({
      _id: 0,
      remidi: 0,
      kelas: {jurusan: "", tahun: 0},
      nama: "",
      avg_uh: 0,
      jml_uh: 0,
      data_uh: []
    })
    const [orderBy, setOrderBy] = useState<string>(Header[0].key)
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, filter.length - page * rowsPerPage);
    useEffect(() => {
      setFetching(false)
    }, [])
    useEffect(() => {
      if (!isFetching) {
        props.score.data.length === 0 && (props.readExamScore())
        !props.class_on_school_year.is_requested && props.getClassOnSchoolYear()
      }
    }, [isFetching])
    useEffect(() => {
      setFilter(filterDataHandle(props.score.data))
    }, [search])
    useEffect(() => {
      props.score.data.length !== 0 && setFilter(props.score.data)
    }, [props.score.data])
    function filterDataHandle(data: any[]) {
      return data.filter((data: any) => {
          return matchObjBasedOnKeys(data, search); 
      })
    }
    function matchObjBasedOnKeys(obj: any, matchString: string, bool: boolean = true) {

      var arrs: any[] = Object.keys(obj).map((a: any) => {
      var returnVal = String(obj[a]).toLowerCase().match(matchString.toLowerCase())
        return bool ? !!returnVal : returnVal
      })

      if (bool) {
        return arrs.includes(true)
      }
      return bool ? arrs.includes(true) : arrs
    }
    function handleRequestSort(event: React.MouseEvent<unknown>, property: string) {
      const isDesc = orderBy === property && order === 'desc';
      setOrder(isDesc ? 'asc' : 'desc');
      setOrderBy(property);
    }
    function handleSearchTable(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {setSearch(event.target.value)}
    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => {setPage(newPage)}
    const handleChangeRows = (event: React.ChangeEvent<HTMLInputElement>) => {setRowsPerPage(parseInt(event.target.value, 10))}
    function handleSelectAllClick(event: React.ChangeEvent<HTMLInputElement>) {
      if (event.target.checked) {
        const newSelecteds = filter.map(n => n._id);
        setSelected(newSelecteds);
        return;
      }

      setSelected([]);
    }
    const mapTableBody = () => {
      return filter.length !== 0 ? 
      stableSort(filter, getSorting(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((x: any) => {
        return (
          <TableRow key={x._id}>
          <TableCell>{x.rank_sekolah}</TableCell>
          <TableCell>{x._id}</TableCell>
          <TableCell>{x.nama}</TableCell>
          <TableCell>{(props.class_on_school_year.grade_on_school_year[x.kelas.tahun] || "Other") + " " + x.kelas.jurusan}</TableCell>
          <TableCell>{x.rank_kelas}</TableCell>
          <TableCell>{x.avg_uh}</TableCell>
          <TableCell>{x.jml_uh} kali</TableCell>
          <TableCell>{x.remidi} mapel</TableCell>
          <TableCell>
            <Tooltip title={`Detail ${x.nama}`} onClick={() => {
              setD1Open(true)
              setCurrentData(x)
              }}>
              <IconButton color="primary"><Detail/></IconButton>
            </Tooltip>
          </TableCell>
          </TableRow>
        )
      }) : (
        <TableRow style={{ height: 48 * emptyRows }}>
          <TableCell align="center" component="th" scope="row" rowSpan={rowsPerPage} colSpan={99}>
            <Typography variant="body1" style={{color: "rgba(0,0,0,0.7)"}}>
              Tidak ada data tersedia
            </Typography>
          </TableCell>  
        </TableRow> 
      )
    }
    // Return element
    return (
        <>
          <Crumb {...props} />
          <Paper className={classes.proot}>
            <Toolbar className={classes.troot}>
            <Grid container alignItems="center" justify="space-between">
            <Typography variant="h6">
              Daftar nilai
            </Typography>
            <Grid style={{display: "flex", alignItems: "center"}}>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search here"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                onChange={handleSearchTable}
              />
            </div>
            </Grid>
            </Grid>
            </Toolbar>
            <Divider/>
            <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableHeader
                      componentProps={{head: Header}}
                      data={filter.length}
                      numSelected={selected.length}
                      order={order}
                      orderBy={orderBy}
                      onSelectAllClick={handleSelectAllClick}
                      onRequestSort={handleRequestSort}
                      rowCount={filter.length}
                    />
                  </TableRow>
                </TableHead>
              <TableBody className={classes.stripped}>
                {mapTableBody()}
                {emptyRows > 0 && filter.length !== 0 && (<TableRow style={{ height: 48 * emptyRows }}><TableCell colSpan={99} /></TableRow>)}
              </TableBody>
              <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 15]}
                  colSpan={99}
                  count={filter.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{native: true}}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRows}
                  ActionsComponent={Pagination}
                />
              </TableRow>
            </TableFooter>
            </Table>
          </Paper>
          {d1Open && <DetailExam 
            currentData={currentData}
            grade_on_school_year={props.class_on_school_year.grade_on_school_year}
            setCurrentData={setCurrentData}
            isOpen={d1Open}
            setOpen={setD1Open}
          /> }
        </>
    )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      marginTop: theme.spacing(3),
      overflowX: 'auto',
    },
    table: {
      minWidth: 650,
    },
  }),
);

const mapDispatchToProps = (dispatch: any) => ({
  getClassOnSchoolYear: () => dispatch(getGradesWithCurrentSchoolYear()),
  readExamScore: (data: any) => dispatch(Action.readExamRecords(data)),
})
const mapStateToProps = (state: any) => ({
  score: state.studentScore,
  appSetting: state.settings.application,
  class_on_school_year: state.classOnSchoolYear,
})

export default connect(mapStateToProps, mapDispatchToProps)(ListExam);
