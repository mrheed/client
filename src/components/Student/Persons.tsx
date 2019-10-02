import React, { useEffect, useState, ChangeEvent } from "react";
import { connect } from 'react-redux';
import { createStyles, Theme, useTheme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TablePagination from '@material-ui/core/TablePagination';
import TableFooter from '@material-ui/core/TableFooter';
import FormHelperText from "@material-ui/core/FormHelperText";
import TableHead from "@material-ui/core/TableHead";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import Paper from "@material-ui/core/Paper";
import TableRow from "@material-ui/core/TableRow";
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import SearchIcon from "@material-ui/icons/Search";
import { AppContainer as Wrapper} from '..';
import * as Action from '../../redux/ActionCreator';
import TablePaginationActions from '../Table/CreatePagination';

  const Student = (props: any) => {    
    const classes = styles();
    const rowsPerPageArr: Array<number> = [8, 16, 24]
    const [page, setPage] = useState<number>(0);
    const [filter, setFilter] = useState<any[]>([]);
    const [search, setSearch] = useState<string>("");
    const [rowsPerPage, setRowsPerPage] = useState<number>(rowsPerPageArr[0]);
    const [states, setStates] = useState<{class: string; grade: string}>({class: "", grade: ""});
    const stt: any = states;
    useEffect(() => {props.person.data.length == 0 && props.makeStudentRequest()}, []);
    useEffect(() => {setFilter(props.person.data)}, [props.person.data]);
    useEffect(() => {

      var makeAFilter: any[] = props.person.data.filter((data: any) => {
        var bool: Array<number> = []
        for (const key in stt) {
          if (stt.hasOwnProperty(key)) {
            if (stt[key] === "") continue;
            if (stt[key] !== data[key]) {
              bool.push(0)
            } else {
              bool.push(1)
            }
            continue;
          }
        }
        setPage(0)
        if (search == "") {
          return bool.every((bool: number) => bool === 1);
        }else{
          return bool.every((bool: number) => bool === 1) && matchObjBasedOnKeys(data, search);
        }
      })
      setFilter(makeAFilter)
    
    }, [states, search]);

    function matchObjBasedOnKeys(obj: any, matchString: string) {
      return Object.keys(obj).map(a => !!String(a == "class" || a == "grade" ? obj.grade + " " + obj.class : obj[a]).toLowerCase().match(matchString.toLowerCase())).includes(true)
    }
    
    function handleChangePage(event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) {
      setPage(newPage)
    }

    function handleChangeRows(event: React.ChangeEvent<HTMLInputElement>) {
      setRowsPerPage(parseInt(event.target.value, 10))
    }

    function handleSearchTable(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
      setSearch(event.target.value)
    }

    function handleFilterTable(event: React.ChangeEvent<{name?: string, value: unknown}>) {
      setStates(oldStates => ({
        ...oldStates,
        [event.target.name as string]: event.target.value
      }))
    }
    const head = (row: any, index: number) => (
      <TableRow key={index}>
        <TableCell align="left">{row.nis}</TableCell>
        <TableCell align="left">{row.name}</TableCell>
        <TableCell align="left">{row.grade + " " + row.class}</TableCell>
        <TableCell align="left">{row.gender == "L" ? "Laki-Laki" : "Other"}</TableCell>
      </TableRow>
    )
    const component: {
      showTable: Function; 
      showLoadingTable: Function;
    } = {
      showTable: (): Array<JSX.Element> | JSX.Element => {
        return filter.length != 0
          ? filter.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(head)
          : <TableRow>
              <TableCell align="center" component="th" scope="row" colSpan={99}>
                <Typography variant="body1" style={{color: "rgba(0,0,0,0.7)"}}>
                  Data is empty
                </Typography>
              </TableCell>
            </TableRow>
      },
      showLoadingTable: (): JSX.Element => {
        return (
          <TableRow>
            <TableCell align="center" component="th" scope="row" colSpan={99}>
              <Typography variant="body1" style={{color: "rgba(0,0,0,0.7)"}}>
                Loading data, please wait...
              </Typography>
            </TableCell>
          </TableRow>
        )
      }
    }

    return (
      <Wrapper>
        <form className={classes.formClass}>
          <Grid>
          <FormControl className={classes.formControl}>
          <InputLabel style={{fontSize: "0.85rem", letterSpacing: 0, color: "rgba(0,0,0,0.75)"}} htmlFor="filter-kelas">Kelas</InputLabel>
            <Select
              value={states.grade}
              onChange={handleFilterTable}
              inputProps={{
                name: 'grade',
                id: 'filter-kelas',
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="X">Kelas X</MenuItem>
              <MenuItem value="XI">Kelas XI</MenuItem>
              <MenuItem value="XII">Kelas XII</MenuItem>
            </Select>
            <FormHelperText>Filter dengan kelas</FormHelperText>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel style={{fontSize: "0.85rem", letterSpacing: 0, color: "rgba(0,0,0,0.75)"}} htmlFor="filter-jurusan">Jurusan</InputLabel>
              <Select
                value={states.class}
                onChange={handleFilterTable}
                inputProps={{
                  name: 'class',
                  id: 'filter-jurusan',
                }}
              >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="KJ">KJ</MenuItem>
              <MenuItem value="MM">MM</MenuItem>
              <MenuItem value={30}>MA</MenuItem>
            </Select>
            <FormHelperText>Filter dengan jurusan</FormHelperText>
          </FormControl>
          </Grid>
            <div style={{position: 'relative', display: 'inline-block'}}>
              <SearchIcon style={{position: 'absolute', bottom: 0, left: 0, top: 23, width: 20, height: 20}}/>
              <TextField
                    style={{textIndent: 25, paddingLeft: 25}}
                    label="Search here"
                    InputLabelProps={{
                      style: {fontSize: "0.85rem", letterSpacing: 0, color: "rgba(0,0,0,0.75)"}
                    }}
                    inputProps={{
                      name: 'search',
                      style: {
                        fontSize: 14
                      }
                    }}
                    onChange={handleSearchTable}
              />
              <FormHelperText style={{paddingLeft: 25}}>Type and searching</FormHelperText>
            </div>
        </form>
        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell align="left">NIS</TableCell>
                <TableCell align="left">Nama</TableCell>
                <TableCell align="left">Kelas</TableCell>
                <TableCell align="left">Jenis Kelamin</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.person.loading ? component.showTable() : component.showLoadingTable()}
            </TableBody>
            <TableFooter>
              <TableRow>
              <TablePagination
                  rowsPerPageOptions={rowsPerPageArr}
                  colSpan={99}
                  count={filter.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    native: true,
                  }}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRows}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </Paper>
      </Wrapper>
    );
  }

  const styles = makeStyles((theme: Theme) => createStyles({
    root: {
      width: '100%',
      marginTop: theme.spacing(3),
      overflowX: 'auto',
    },
    formControl: {
      marginRight: 25,
      minWidth: 120
    },
    formClass: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between'
    },
    table: {
      minWidth: 700,
    },
    search: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",

    }
  }))

  const useStyles1 = makeStyles((theme: Theme) => createStyles({
    root: {
      flexShrink: 0,
      color: theme.palette.text.secondary,
      marginLeft: theme.spacing(2.5),
    }
  }))

  const mapStateToProps = (state: any) => ({
    ...state
  })

  const mapDispatchToProps = (dispatch: any) => ({
    makeStudentRequest: () => dispatch(Action.makeStudentRequest())
  })
  
  export default connect(mapStateToProps, mapDispatchToProps)(Student); 
