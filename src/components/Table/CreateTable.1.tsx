import React, { useState, useEffect } from "react";
import { createStyles, Theme } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import clsx from 'clsx';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Paper from '@material-ui/core/Paper';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TablePagination from '@material-ui/core/TablePagination';
import TableFooter from '@material-ui/core/TableFooter';
import FormHelperText from "@material-ui/core/FormHelperText";
import TableHead from "@material-ui/core/TableHead";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import { amber, green } from '@material-ui/core/colors';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import IconButton from '@material-ui/core/IconButton';
import TableRow from "@material-ui/core/TableRow";
import Chip from '@material-ui/core/Chip';
import FormControl from "@material-ui/core/FormControl";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CreatePaginationActions from './CreatePagination';
import EnhancedTableToolbar from './EnhancedToolbar';
import EnhancedTableHead, { ComponentProps, Order } from './EnhancedHeader';
import { TextField } from "@material-ui/core";
import CustomSelect from '../Input/Select';
import { any } from "prop-types";

interface CreateTableProps {
  componentProps: ComponentProps;
  data: any[];
  loadingData: boolean;
  rowsPerPageArr: Array<number>;
  tableTitle: string;
  rowKey?: string[];
  className?: any;
  collisonState?: CollisonStateProps;
  filterProps?: any;
  inputProps?: InputProps[];
  insertProps?: InsertProps;
  onDelete?: TodoInterface;
  onUpdate?: TodoInterface;
  primaryKey?: string;
  multiValKey?: string;
  withFilter?: boolean;
  withCheckbox?: boolean;
  withActions?: boolean;
  withMultival?: boolean;
}

export interface TodoInterface {
  todoFunction?: Function;
  status?: string;
  message?: string;
  loading?: boolean;
}

interface CollisonStateProps {
  collisonKeys?: string[];
  collisonIndex?: number;
  collisonSeparator?: string;
  collisonChangeRowsValue?: Function;
  changeRowsKey?: string;
}

interface InsertProps {
  insertState: any[];
  onInsert: TodoInterface;
}

interface InputProps {
  name: string;
  id: string;
  items: any[];
}

interface Data {
  calories: number;
  carbs: number;
  fat: number;
  name: string;
  protein: number;
}

type VariantSnackbar = "success" | "warning" | "error" | "info";

function desc<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort<T>(array: T[], cmp: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => { 
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  
  return stabilizedThis.map(el => el[0]);
}

function getSorting<K extends keyof any>(
  order: Order,
  orderBy: K,
): (a: { [key in K]: number | string }, b: { [key in K]: number | string }) => number {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

// CreateTable function, wraps the entire enhanced component, parent functions and components that will mounted

function CreateTable(props: CreateTableProps) {
    
    const classes = styles();
    const { 
      data,
      componentProps, 
      filterProps, 
      inputProps,
      insertProps, 
      onDelete,
      onUpdate,
      primaryKey, 
      rowsPerPageArr, 
      withCheckbox, 
      withActions, 
      withFilter, 
      withMultival,
      multiValKey,
      tableTitle, 
      collisonState 
    } = props;
    const {
      collisonChangeRowsValue, 
      changeRowsKey, 
      collisonKeys, 
      collisonSeparator
    }: any = collisonState! || {
      collisonChangeRowsValue: () => "",
      changeRowsKey: "",
      collisonKeys: [],
      collisonSeparator: ""
    }
    const [page, setPage] = useState<number>(0);
    const [filter, setFilter] = useState<any[]>([]);
    const [search, setSearch] = useState<string>("");
    const [selected, setSelected] = useState<any[]>([]);
    const [editState, setEditState] = useState<any>({})
    const [order, setOrder] = React.useState<Order>('asc');
    const [states, setStates] = useState(filterProps || "");
    const [snackOpen, setSnackOpen] = useState<boolean>(false);
    const [targetEdit, setTargetEdit] = useState<keyof any>("")
    const [resStatus, setResStatus] = useState({status: "" , message: "" , loading: false })
    const [rowsPerPage, setRowsPerPage] = useState<number>(rowsPerPageArr[0]);
    const [orderBy, setOrderBy] = React.useState<keyof any>(componentProps.head[0].key);
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, filter.length - page * rowsPerPage);
    const status = {status: "", message: "", loading: false} 
    const Icon = (props: any) => variantIcon[resStatus!.status! as VariantSnackbar] || <CircularProgress color="inherit" style={{marginRight: 16}} />;
    if (onUpdate !== undefined || onDelete !== undefined || insertProps !== undefined) {
      Object.assign(status, {
        status: onDelete!.status! || onUpdate!.status! || insertProps!.onInsert.status! || "",
        message: onDelete!.message! || onUpdate!.message! || insertProps!.onInsert.message! || "",
        loading: onDelete!.loading! || onUpdate!.loading! || insertProps!.onInsert.loading! || false,
      })
    }

    useEffect(() => { 
      setFilter(withMultival ? alterArrayValue(data) :data)
    }, [data]);

    // Make data to filtered to organize the data easily
    useEffect(() => {
      setFilter(filterDataHandle(withMultival ? alterArrayValue(data) : data))
    }, [states, search]); 

    useEffect(() => {
      if (onUpdate !== undefined || onDelete !== undefined || insertProps !== undefined) {
        if (status.status === "error" || status.status === "success" || status.status === "danger") {
          setResStatus(status)
          setSnackOpen(true)
        }
        if (status.status === "loading") {
          setResStatus({...status!, loading: true})
          setSnackOpen(false)
        }
        if (onUpdate!.status !== "") {
          setPage(0)
          setTargetEdit("")
        }
      }
    }, [status.status])

    function handleSelectAllClick(event: React.ChangeEvent<HTMLInputElement>) {
      if (event.target.checked) {
        const newSelecteds = filter.map(n => n[primaryKey!]);
        setSelected(newSelecteds);
        return;
      }

      setSelected([]);
    }

    function isSelected(name: string) {return selected.indexOf(name) !== -1};

    function handleRequestSort(event: React.MouseEvent<unknown>, property: keyof Data) {
      const isDesc = orderBy === property && order === 'desc';
      setOrder(isDesc ? 'asc' : 'desc');
      setOrderBy(property);
    }

    function getTableKey() {
      const arrKey: string[] = []
      componentProps.head.map(x => {
        arrKey.push(x.key)
      })
      return arrKey
    }

    function handleCheckClick(event: React.MouseEvent<unknown>, name: string) {
      const selectedIndex = selected.indexOf(name);
      let newSelected: string[] = [];
  
      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, name);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1),
        );
      }
  
      setSelected(newSelected);
    }

    function filterDataHandle(data: any[]) {
      return data.filter((data: any) => {
        var bool: Array<number> = [];

        for (const key in states) {
          if (states.hasOwnProperty(key)) {
            if (states[key] === "") continue;
            if (states[key] !== data[key]) { 
              bool.push(0);
            } else { 
              bool.push(1);
            }
            continue;
          }
        }

        setPage(0);

        if (search === "") { 
          return bool.every((bool: number) => bool === 1);
        } else { 
          return bool.every((bool: number) => bool === 1) && matchObjBasedOnKeys(data, search); 
        }
      })
    }
    
    function matchObjBasedOnKeys(obj: any, matchString: string, bool: boolean = true) {

        var arrs: any[] = Object.keys(obj).map((a: any) => {
        var returnVal = (collisonState !== undefined && collisonState!.collisonKeys! ) 
          ? String(collisonState!.collisonKeys!.map(x => a === x).includes(true) 
            ? changeRowsValue(obj, collisonState!.collisonKeys!, collisonState!.collisonSeparator!) 
            : obj[a]).toLowerCase().match(matchString.toLowerCase()) 
          : String(obj[a]).toLowerCase().match(matchString.toLowerCase())
    
          return bool ? !!returnVal : returnVal
        })

        if (bool) {
          return arrs.includes(true)
        }
        return arrs
    }

    function deletedArrCollisonObjectKeys(obj: any) {
      const { collisonKeys, collisonIndex } = collisonState!;
      var collisonCheck: number[] = []
      var collisonKey: string = "";
      var ObjectKeys: string[] = [];

      ObjectKeys = ObjectKeys.concat(Object.keys(obj).filter((objRow: string) => {
        if (objRow === "_id") return false
        if (collisonKeys!.includes(objRow)) {
          collisonKey = objRow;
          return false
        }

        if (collisonCheck.includes(1) && collisonKeys!.includes(objRow)) return false
        return true
      }))

      if (collisonKey !== "") ObjectKeys.splice(collisonIndex!, 0, collisonKey)
      return ObjectKeys
    }

    function changeArrayValue(arr: any[]) {
      
      var newArray: any[] = [];
      arr.map(row => {
        var replacedRowWithFunction = collisonChangeRowsValue!(row, changeRowsKey);
        var replacedRow: string = collisonKeys || collisonSeparator ? changeRowsValue(row, collisonKeys!, collisonSeparator!) : ""
        var replacedObj: any = {}
        Object.keys(row).map(x => {
          if (collisonKeys && collisonKeys!.includes(x) && collisonKeys!.length !== 0) {
            Object.assign(replacedObj, {
              [x as string]: replacedRow
            })
            return false
          }

          if (changeRowsKey === x && changeRowsKey) {
            Object.assign(replacedObj, {
              [x as string]: replacedRowWithFunction
            })
            return false
          }

          Object.assign(replacedObj, {
            [x as string]: row[x]
          })
        })
        
        return newArray.push(replacedObj);
      })
      return newArray
    }

    function alterArrayValue(arr: any[]) {
      var newArray: any[] = [];
      for (let i = 0; i < arr.length; i++) {
        var newObj = {}
        Object.assign(newObj, {
          ...arr[i],
          [multiValKey!]: (arr[i][multiValKey!] !== null ? arr[i][multiValKey!] : [{label: "", value: ""}]).map((marr: any) => marr["label"]).join(", ")
        })
        newArray.push(newObj)
      }
      return newArray
    }
    
    function changeRowsValue(obj: any, keys: string[], separator: string = ""): string {
      var newValue: string[] = [];
      Object.keys(obj).map(x => keys.includes(x) && (keys.map((z: string, i: number) => newValue.length < keys.length && newValue.splice(i, 0, String(obj[z])))));
      return newValue.join(separator);
    }

    function handleDeleteBulkData(event: React.MouseEvent<HTMLButtonElement | MouseEvent, MouseEvent> | null) {
      var arrayData: any[] = []
      for (let i = 0; i < selected.length; i++) {
        arrayData.push({[primaryKey as string]: selected[i]})        
      }
      onDelete!.todoFunction!(arrayData)
      setSelected([])
    }

    function handleDeleteSingleData(event: React.MouseEvent<HTMLButtonElement | MouseEvent, MouseEvent> | null, key: keyof any) {
      onDelete!.todoFunction!([{[primaryKey!]: key}])
    }

    function handleChangeEditState(event: React.ChangeEvent<{name?: string, value: unknown} | unknown> | any, e?: any) {
      var typeNumber: string[] = []
      var newVal = {}
      for (let index1 = 0; index1 < insertProps!.insertState.length; index1++) {
        if (insertProps!.insertState[index1]["formType"] === "inputNumber") typeNumber.push(insertProps!.insertState[index1]["key"])
        Object.assign(newVal, editState, {
          [(event.target !== undefined ? (event.target as HTMLInputElement) : e).name!]: typeNumber.includes((event.target !== undefined ? (event.target as HTMLInputElement) : e).name!)
          ? parseInt(event.target !== undefined 
            ? (event.target as HTMLInputElement).value as string 
            : event) 
          : event.target !== undefined 
            ? (event.target as HTMLInputElement).value as string 
            : event })
        }
        setEditState(newVal)
    }

    function handleChangeMultiEditState(event: React.ChangeEvent<{name?: string, value: unknown} | unknown> | any, e?: any) {
      const Obj = {
        ...editState,
        value: event,
    }
    setEditState((oldValues: any) => ({
        ...oldValues,
        [e.name as string]: event
    }));
    }

    function handleClearTargetEdit(event: React.MouseEvent<HTMLButtonElement | MouseEvent, MouseEvent> | null) {
      setTargetEdit("")
    }

    function handleEditData(event: React.MouseEvent<HTMLButtonElement | MouseEvent, MouseEvent> | null, key: keyof any) {
      setTargetEdit(key)
      collisonState === undefined ? 
      setEditState(changeArrayValue(data).filter(x => x[primaryKey!] === key)[0]) 
      : setEditState(data.filter(x => x[primaryKey!] === key)[0])
    }
    
    function handleRequestEditData(event: React.MouseEvent<HTMLButtonElement | MouseEvent, MouseEvent> | null) {
      onUpdate!.todoFunction!({filter: {"_id": filter.filter(x => x[primaryKey!] === targetEdit)[0]["_id"]}, update: editState})
    }

    function handleChangePage(event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) {
      setPage(newPage)
    }

    function handleChangeRows(event: React.ChangeEvent<HTMLInputElement>) {
      setRowsPerPage(parseInt(event.target.value, 10))
    }

    function handleSnackClose(event?: React.SyntheticEvent) {
      setSnackOpen(false)
    }

    function handleSearchTable(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
      setSearch(event.target.value)
    }
    
    function handleFilterTable(event: React.ChangeEvent<{name?: string, value: unknown}>) {
      setStates((oldStates: any) => ({
        ...oldStates,
        [event.target.name as string]: event.target.value
      }))
      }

    const component: {
        showTable: Function; 
        showLoadingTable: Function;
        showInputProps: Function;
      } = {
        showTable: (): JSX.Element[] | JSX.Element => {
          return filter.length !== 0
          ? stableSort(changeArrayValue(filter), getSorting(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: any, index: number) => {
              const isItemSelected = isSelected(row[primaryKey!]);
              const labelId = `enhanced-table-checkbox-${index}`;
              return (
                <TableRow
                  aria-checked={withCheckbox && isItemSelected}
                  selected={withCheckbox && isItemSelected}
                  role={withCheckbox ? "checkbox" : undefined}
                  hover={withCheckbox}
                  tabIndex={-1}
                  key={index}>
                  {withCheckbox && 
                  <TableCell 
                  onClick={(event: any) => withCheckbox ? handleCheckClick(event, row[primaryKey!]) : event.preventDefault()}
                  padding="checkbox">
                    <Checkbox checked={isItemSelected} inputProps={{ 'aria-labelledby': labelId }}/>
                  </TableCell>}
                  {getTableKey().map((objRow: string, i: number) => {
                    // filter.filter((fclx: any) => fclx[primaryKey!] === targetEdit)[0][collisonState!.collisonKeys![clsn]]
                    const checkType = (type: string) => {
                      return insertProps !== undefined && insertProps!.insertState
                        .filter(insertstt => insertstt.formType === type )!
                        .filter(insertstt => insertstt!.key === objRow).length === 1
                    }
                    const checkCollison = (num: number) => collisonState !== undefined && (collisonState!.collisonKeys!) && (collisonState!.collisonKeys!.includes(objRow)) 
                      ? collisonState!.collisonKeys![num]
                      : objRow
                    const selectElement = (
                      insertProps !== undefined && insertProps!.insertState.filter((insertstt: any) => insertstt.formType === "inputSelect" )
                        .map((filteredInsertState: any, filteredInsertStateNumber: number) => 
                          <>
                          <CustomSelect
                            key={filteredInsertStateNumber}
                            singleValue={editState[checkCollison(filteredInsertStateNumber)]
                            }
                            value={filteredInsertState.formValue === null ? [{label: "", value: ""}] : filteredInsertState.formValue  }
                            props={{
                              inputId: checkCollison(filteredInsertStateNumber),
                              placeholder: filteredInsertState.label,
                            }}
                            isMulti={filteredInsertState.multi}
                            onChange={filteredInsertState.multi ? handleChangeMultiEditState : handleChangeEditState}
                          />
                          </>
                        )
                    ) 
                    const textField = ( <TextField name={objRow} value={editState[objRow as any]} onChange={handleChangeEditState} /> )
                    const radioElement = checkType("inputRadio") ? (
                      <RadioGroup name={objRow} style={{flexDirection: "row"}} value={editState[objRow]} onChange={handleChangeEditState} >
                        {insertProps!.insertState
                          .filter(insertstt => insertstt.formType === "inputRadio" )! 
                          .filter(insertstt => insertstt!.key === objRow)![0]!['formValue'] 
                          .map((insertstt: any) => <FormControlLabel key={insertstt} value={insertstt} control={<Radio />} label={insertstt} />)}
                      </RadioGroup>
                    ) : textField
                    var returnedElement = (
                      targetEdit === row[primaryKey!] 
                      ? checkType("inputSelect") 
                        ? selectElement 
                        : radioElement 
                        // Nek misale ono array ng tabel
                      : row[objRow] === "" || row[objRow] === null || row[objRow] === undefined 
                        ? "Tidak ada"
                        : Array.isArray(row[objRow]) 
                          ? row[objRow].map((ttf: any) => <Chip label={ttf.label} style={{margin: 1}}/>) 
                          : typeof row[objRow] === "object"
                            ? row[objRow]["label"]
                            : row[objRow]
                      )
                      console.log(row);
                    return i === 0 && withCheckbox
                    ? <TableCell key={i} component="th" id={labelId} scope="row" padding="none">
                        {returnedElement}
                      </TableCell> 
                    : <TableCell key={i} align="left">
                        {returnedElement}
                      </TableCell>
                      })}
                  {withActions && 
                    <TableCell align="center">
                      {targetEdit === row[primaryKey!] 
                        ? <>
                        <IconButton onClick={handleRequestEditData}><CheckIcon/></IconButton>
                        <IconButton onClick={handleClearTargetEdit}><CloseIcon/></IconButton>
                        </> 
                        : <>
                        <IconButton onClick={e => handleEditData(e, row[primaryKey!])}><EditIcon/></IconButton>
                        <IconButton onClick={e => handleDeleteSingleData(e, row[primaryKey!])}><DeleteIcon/></IconButton>
                        </>}
                      </TableCell>
                  }
                </TableRow>
              )
            }
          )
          : 
          <TableRow>
            <TableCell align="center" component="th" scope="row" rowSpan={rowsPerPage} colSpan={99}>
              <Typography variant="body1" style={{color: "rgba(0,0,0,0.7)"}}>
                Tidak ada data tersedia
              </Typography>
            </TableCell>
          </TableRow>
        },
        showInputProps: (): JSX.Element[] | undefined => {
            return filterProps ? (inputProps || []).map((input: InputProps, index: number) => {
                var name: string[] = input.name.split("");
                var upLetter: string = name[0].toUpperCase();
                name.shift();
                name.unshift(upLetter);
                return (
                  <FormControl key={index} className={classes.formControl}>
                    <InputLabel style={{fontSize: "0.85rem", letterSpacing: 0, color: "rgba(0,0,0,0.75)"}} htmlFor={input.id}>{name}</InputLabel>
                    <Select value={states[input.name]} onChange={handleFilterTable} inputProps={inputProps![index]}>
                    <MenuItem value=""><em>None</em></MenuItem>
                    {input.items.map((item: any, index2: number) => <MenuItem key={index2} value={item}>{item}</MenuItem>)}
                    </Select>
                    <FormHelperText>Filter with {name}</FormHelperText>
                </FormControl>)
            }) : undefined
        },
        showLoadingTable: (): JSX.Element => (
          <TableRow><TableCell rowSpan={rowsPerPage} align="center" component="th" scope="row" colSpan={99}>
            <Grid>
              <CircularProgress className={classes.progress} color="secondary" />
              <Typography variant="body1" style={{color: "rgba(0,0,0,0.7)"}}>Sedang memuat data, silahkan tunggu...</Typography>
            </Grid>
          </TableCell></TableRow>
          )
      }
    
    return (
        <ThemeProvider theme={customTheme}>
        <Paper className={classes.root}>
        <EnhancedTableToolbar 
          inputProps={component.showInputProps()} 
          insertState={insertProps !== undefined && insertProps.insertState || []}
          numSelected={selected.length} 
          onChange={handleSearchTable}
          onDelete={handleDeleteBulkData}
          onInsert={insertProps !== undefined ? insertProps.onInsert : undefined}
          rowKey={props.rowKey}
          tableTitle={tableTitle}
          withActions={withActions}
          withFilter={withFilter}
        />
        <Divider />
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <EnhancedTableHead
                componentProps={componentProps}
                data={data.length}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={filter.length}
                withActions={withActions}
                withCheckbox={withCheckbox}
              />
            </TableRow>
          </TableHead>
          <TableBody>
            {!props.loadingData ? component.showTable() : component.showLoadingTable()}
            {emptyRows > 0 && (<TableRow style={{ height: 48 * emptyRows }}><TableCell colSpan={6} /></TableRow>)}
          </TableBody>
            <TableFooter><TableRow>
            <TablePagination
                rowsPerPageOptions={rowsPerPageArr}
                colSpan={99}
                count={filter.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{native: true}}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRows}
                ActionsComponent={CreatePaginationActions}
              />
            </TableRow></TableFooter></Table></Paper>
            <Snackbar
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              open={snackOpen}
              autoHideDuration={4000}
              onClose={handleSnackClose}
            >
            <SnackbarContent
              className={clsx(classes[resStatus.status as VariantSnackbar])}
              aria-describedby="client-snackbar"
              message={
                <span id="client-snackbar" className={classes.message || ""}>
                  <Icon className={clsx(classes.icon, classes.iconVariant)} />
                  {resStatus.message || ""}
                </span>
              }
              action={[
                <IconButton key="close" aria-label="Close" color="inherit" onClick={handleSnackClose}>
                  <CloseIcon />
                </IconButton>,
              ]}
            />
          </Snackbar>
          <Snackbar
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              open={resStatus.loading}
            >
            <SnackbarContent
              className={clsx(classes["info"])}
              aria-describedby="client-snackbar"
              message={
                <span id="client-snackbar" className={classes.message}>
                  <CircularProgress color="inherit" style={{marginRight: 16}} />
                  Sedang mengirim request ke database...
                </span>
              }
            />
          </Snackbar>
        </ThemeProvider>
    )
}

const variantIcon = {
  success: <CheckCircleIcon/>,
  warning: <WarningIcon/>,
  error: <ErrorIcon/>,
  info: <InfoIcon/>,
  "": <InfoIcon/>
};

const styles = makeStyles((theme: Theme) => createStyles({
    root: {
      width: '100%',
      marginTop: theme.spacing(3),
      overflowX: 'auto',
    },
    success: {
      backgroundColor: green[600],
    },
    error: {
      backgroundColor: theme.palette.error.dark,
    },
    info: {
      backgroundColor: theme.palette.primary.dark,
    },
    warning: {
      backgroundColor: amber[700],
    },
    icon: {
      fontSize: 20,
    },
    iconVariant: {
      opacity: 0.9,
      marginRight: theme.spacing(1),
    },
    message: {
      display: 'flex',
      alignItems: 'center',
    },
    formControl: {
      marginRight: 25,
      minWidth: 120
    },
    table: {
      minWidth: 700,
    },
    search: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
    },
    progress: {
      margin: theme.spacing(2)
    }
  })
)

var fontSize: string = "0.875rem";

const customTheme = createMuiTheme({
  overrides: {
    MuiSelect: {
      select: {
        fontSize: fontSize
      }
    },
    MuiMenuItem: {
      root: {
        fontSize: fontSize
      }
    },
    MuiFormHelperText: {
      root: {
        letterSpacing: 0
      }
    },
    MuiInputLabel: {
      shrink: {
        fontSize: fontSize + "!important"
      }
    },
    MuiTypography: {
      body1: {
        fontSize: fontSize,
        letterSpacing: 0
      }
    },
    MuiInputBase: {
      root: {
        fontSize: fontSize,
        letterSpacing: 0.8,
      },
    },
    // MuiTableRow: {
    //   root: {
    //     height: 50
    //   }
    // }
  }
})

export default CreateTable;

/*
collisonState!.collisonKeys!.includes(objRow) ? 
                          insertProps!.insertState.filter((insertstt: any) => insertstt.formType === "inputSelect" )
                          .map((filteredInsertState: any, filteredInsertStateNumber: number) => 
                            <Select
                              key={filteredInsertStateNumber}
                              value={editState[collisonState!.collisonKeys![filteredInsertStateNumber]]}
                              inputProps={{
                                name: collisonState!.collisonKeys![filteredInsertStateNumber]
                              }}
                              onChange={handleChangeEditState}
                            >
                            {filteredInsertState.formValue.map((fv: any) => <MenuItem key={fv} value={fv}>{fv}</MenuItem>)}   
                            </Select>
                          )
                        : insertProps!.insertState
                            .filter(insertstt => insertstt.formType === "inputRadio" )!
                            .filter(insertstt => insertstt!.key === objRow).length === 1
                          ? 
                        <RadioGroup
                          name={objRow}
                          style={{flexDirection: "row"}}
                          value={editState[objRow]}
                          onChange={handleChangeEditState}
                        >
                          {insertProps!.insertState
                            .filter(insertstt => insertstt.formType === "inputRadio" )!
                            .filter(insertstt => insertstt!.key === objRow)![0]!['formValue']
                            .map((insertstt: any) => <FormControlLabel key={insertstt} value={insertstt} control={<Radio />} label={insertstt} />)
                          }
                        </RadioGroup>
                          : <TextField name={objRow} value={editState[objRow as any]} onChange={handleChangeEditState} />
*/