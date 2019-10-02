import React, {useState, useEffect, useRef} from 'react';
import clsx from 'clsx';
import { createStyles, Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Toolbar from '@material-ui/core/Toolbar';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from "@material-ui/core/Typography";
import InputBase from '@material-ui/core/InputBase';
import Grid from '@material-ui/core/Grid';
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from '@material-ui/icons/FilterList';
import AddIcon from '@material-ui/icons/Add';
import ExportIcon from '@material-ui/icons/ImportExport';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import GetIcon from '@material-ui/icons/GetApp';
import Slide from '@material-ui/core/Slide';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import { lighten, fade } from '@material-ui/core/styles/colorManipulator';
import { TransitionProps } from '@material-ui/core/transitions';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import * as XLSX from 'xlsx';
import { TodoInterface } from './CreateTable';
import { saveAs } from 'file-saver';
import CustomSelect from '../Input/Select';

interface EnhancedTableToolbarProps {
    inputProps?: Function | any;
    insertState: any[];
    numSelected: number;
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => any | void;
    onDelete?: (event: React.MouseEvent<HTMLButtonElement | MouseEvent>) => void;
    onExport?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
    onInsert?: TodoInterface;
    rowKey?: string[];
    tableTitle: string;
    withActions?: boolean;
    withFilter?: boolean;
    removeAdd?: boolean;
}

const Transition = React.forwardRef<unknown, TransitionProps>(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
    const { 
        inputProps,
        insertState, 
        numSelected, 
        onChange,
        onDelete,
        onExport,
        onInsert,
        rowKey,
        tableTitle,
        removeAdd,
        withActions,
        withFilter 
    } = props;
    const classes = useToolbarStyles();
    const [loaded, setLoaded] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false)
    const [openDelete, setOpenDelete] = useState<boolean>(false)
    const [fullScreenDialogOpen, setFullScreenDialogOpen] = useState<boolean>(false)
    const [insertValue, setInsertValue] = useState<any>([])
    const deleteChoice = numSelected > 1 ? "records" : "record"
    const inputItemRef = useRef(null)
    useEffect(() => {
        var obj: any = {}
        for (let index1 = 0; index1 < insertState.length; index1++) {
          Object.assign(obj, {[insertState[index1]["key"] as string]: insertState[index1]["formType"] === "inputNumber" 
            ? 0 
            : insertState[index1]["multi"] 
            ? []
            : ""})          
        }
        setInsertValue([obj])
      !loaded && setLoaded(true)
    }, [])
    
    function handleClickOpen() {
      setOpen(true)
    }
  
    function handleDeleteAlertOpen() {
      setOpenDelete(true)
    }
  
    function handleDeleteAlertClose() {
      setOpenDelete(false)
    }
  
    function handleOpenFullDialog() {
      setFullScreenDialogOpen(true)
    }
  
    function handleCloseFullDialog() {
      setFullScreenDialogOpen(false)
    }
  
    function handleClose() {
      setOpen(false)
    }

    function handleUploadContent(event: React.ChangeEvent<HTMLInputElement>) {
      var targetFile = event.target.files![0]
      var fileReader = new FileReader()
      fileReader.readAsArrayBuffer(targetFile)
      fileReader.onload = function(e: ProgressEvent) {
        var arrayBuffer: Uint8Array = new Uint8Array(fileReader.result! as ArrayBuffer)
        var workBook = XLSX.read(arrayBuffer, {type: 'array'})
        var files_sheet_name = workBook.SheetNames[0]
        var workSheet = workBook.Sheets[files_sheet_name]
        var json_value = XLSX.utils.sheet_to_json(workSheet)
        var changedVals = json_value.map((x: any) => {
          // Define empty object
          var obj: any = {}
          // Manipulate the object keys
          Object.keys(x).map((z: string) => {
            Object.assign(obj, {[z.split(" ").join("") as string] : x[z]})
          })
          // return the manipulated object
          return obj 
        })
        onInsert!.todoFunction!(changedVals)
      }
      
      event.target.value = ""
      
    }

    function handleGetDefaultDocument() {
      var wb = XLSX.utils.book_new();
        wb.Props = {
          Title: tableTitle + " Document",
          Subject: tableTitle,
          Author: "User",
          CreatedDate: new Date()
        };
        
        wb.SheetNames.push(tableTitle + " Sheet");
        var ws_data = [rowKey!];
        var ws = XLSX.utils.aoa_to_sheet(ws_data);
        wb.Sheets[tableTitle + " Sheet"] = ws;
        var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
        function s2ab(s: any) {
          var buf = new ArrayBuffer(s.length);
          var view = new Uint8Array(buf);
          for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
          return buf;
                
        }
      saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), tableTitle + '.xlsx');
    }

    function handleChangeInsertValue(event: React.ChangeEvent<{name?: string, value: unknown} | {}> | any, e?: any) {
      var typeNumber: string[] = []
      for (let index1 = 0; index1 < insertState.length; index1++) {
      if (insertState[index1]["formType"] === "inputNumber") typeNumber.push(insertState[index1]["key"])
       Object.assign(insertValue[0], {[(event.target !== undefined ? (event.target as HTMLInputElement) : e).name!]
        : typeNumber.includes((event.target !== undefined ? (event.target as HTMLInputElement) : e).name!)
          ? parseInt(event.target !== undefined ? (event.target as HTMLInputElement).value :event) 
          : event.target !== undefined ? (event.target as HTMLInputElement).value :  event })
      }
      
      setInsertValue([].concat(insertValue))
    }
    function handleSingleInsert() {
      onInsert!.todoFunction!(insertValue)
    }
  
    function handleDelete(event: React.MouseEvent<MouseEvent | HTMLButtonElement, MouseEvent>) {
      onDelete!(event)
      setOpenDelete(false)
    }

    const DeleteDialog = () => (
        <Dialog
            open={openDelete}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleDeleteAlertClose}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
            >
            <DialogTitle id="alert-dialog-slide-title">{`Delete ${deleteChoice}`}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                Are you sure want to delete the selected {deleteChoice}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDeleteAlertClose} color="primary">
                Cancel
                </Button>
                <Button onClick={handleDelete} color="secondary">
                Delete
                </Button>
            </DialogActions>
        </Dialog>
    )
    
  
    return (
      <Toolbar
        className={clsx(classes.root, {
          [classes.highlight]: numSelected > 0,
        })}
      >
        {numSelected > 0 ? (
          <React.Fragment>
            <div className={classes.title}>
              <Typography color="inherit" variant="subtitle1">
                {numSelected === 1 ? numSelected + " row selected" : numSelected + " rows selected"}
              </Typography>
            </div>
            <div className={classes.spacer} />
            <div className={classes.actions}>
              <Tooltip title="Delete">
                <IconButton aria-label="Delete" onClick={handleDeleteAlertOpen}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
              <DeleteDialog />
            </div>
          </React.Fragment>
          ) : (
              <Grid container alignItems="center" justify="space-between">
                <Typography variant="h6">
                  {tableTitle}
                </Typography>
                <Grid style={{display: "flex", alignItems: "center"}}>
                  {withActions && (
                    <>
                    {!removeAdd && <Tooltip onClick={handleOpenFullDialog} title="Add item">
                      <IconButton aria-label="Add item">
                        <AddIcon />
                      </IconButton>
                    </Tooltip>}
					{onExport && <Tooltip onClick={onExport!} title="Export to Excel">
                      <IconButton aria-label="Export to Excel">
                        <ExportIcon />
                      </IconButton>
                    </Tooltip>}
                    </>
                  )}
                  {withFilter && (
                    <Tooltip onClick={handleClickOpen} title="Filter list">
                      <IconButton aria-label="Filter list">
                        <FilterListIcon />
                      </IconButton>
                    </Tooltip>
                  )}
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
                    onChange={onChange}
                  />
                </div>
                {open && <Dialog disableBackdropClick disableEscapeKeyDown open={open} onClose={handleClose}>
                    <DialogTitle>Filter form</DialogTitle>
                    <DialogContent>
                    <Grid>{inputProps}</Grid>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Ok
                    </Button>
                    </DialogActions>
                </Dialog>}
                { fullScreenDialogOpen && <Dialog scroll="body" open={fullScreenDialogOpen} onClose={handleCloseFullDialog} TransitionComponent={Transition}>
                    <DialogTitle>Insert Form</DialogTitle>
                    <DialogActions style={{justifyContent: "flex-start", marginLeft: "8px"}}>
                    <input accept=".xlsx, .xls, .csv" className={classes.input} id="raised-button-file" onChange={handleUploadContent} multiple ref={inputItemRef} type="file" />
                    <label htmlFor="raised-button-file">
                      <Button variant="outlined" component="span" color="primary">Import</Button>
                    </label>
                      <Tooltip title="Unduh Dokumen awal" onClick={handleGetDefaultDocument}>
                        <IconButton aria-label="Unduh">
                          <GetIcon />
                        </IconButton>
                      </Tooltip>
                    </DialogActions>
                    <DialogContent>
                      <DialogContentText>
                        Fill the form below to insert specified data
                      </DialogContentText>
                    <ThemeProvider theme={theme}>
                      <RenderedInputForms onChange={handleChangeInsertValue} data={insertValue} propsData={insertState} />
                    </ThemeProvider>
                    </DialogContent>
                    <DialogActions style={{marginBottom: "24px", marginRight: "16px"}}>
                      <Button color="secondary" component="span" onClick={handleCloseFullDialog}>
                        Cancel
                      </Button>
                      <Button variant="outlined" color="primary" component="span" onClick={handleSingleInsert}>
                        Save
                      </Button>
                    </DialogActions>
                </Dialog> }
                </Grid>
              </Grid>
          )}
      </Toolbar>
    );
  };

interface RenderedInputProps {
  data: any[];
  propsData: any[];
  onChange: (event: React.ChangeEvent<{name?: string; value: unknown} | {}> | any, e?: any) => void;
}

function RenderedInputForms(props: RenderedInputProps) {
  const {
    data,
    onChange,
    propsData,
  } = props;
  const classes = useToolbarStyles()
  return (
      <FormControl style={{display: "flex"}}>
      {propsData.map((x: any, i: number) => { 
          if (x.formType === "inputString" || x.formType === "inputNumber") {
              return (
                  <TextField 
                    key={i}
                    className={classes.formMargin}
                    label={x.label}
                    name={x.key}
                    onChange={onChange}
                    type={x.formType === "inputString" ? "string" : "number"}
                    margin="normal"
                  />
              )
          }
          if (x.formType === "inputSelect") {
              return (
                <CustomSelect 
                  key={i}
                  onChange={onChange}
                  props={{
                    inputId: x.key,
                    placeholder: x.label
                  }}
                  singleValue={data[0][x.key]!}
                  value={x.formValue}
                  isMulti={x.multi}
                />
            )
          }
          if (x.formType === "inputRadio") {
            return (
            <FormControl key={i} style={{marginTop: "8px"}} className={classes.formMargin}>
              <FormLabel component="legend">{x.label}</FormLabel>
                <RadioGroup
                  name={x.key}
                  value={data[0][x.key]!}
                  onChange={onChange}
                  style={{flexDirection: 'row', marginTop: "8px"}}
                >
                  {x.formValue.map((fvalue: string | number) => <FormControlLabel key={fvalue} value={fvalue} control={<Radio />} label={fvalue} />)}
                </RadioGroup> 
            </FormControl>
          )
        }
        })}
      </FormControl>
  )
}

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: "0 20px",
    },
    appBar: {
      position: 'relative',
    },
    formControl: {
      margin: theme.spacing(1),
    },
    titleFD: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    topTable: {
      display: "block",
      width: '100%'
    },
    formMargin: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    formGroup: {
      marginBottom: theme.spacing(1),
    },
    formClass: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between'
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    spacer: {
      flex: '1 1 100%',
    },
    actions: {
      color: theme.palette.text.secondary,
    },
    title: {
      flex: '0 0 auto',
    },
    search: {
      position: 'relative',
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
      marginRight: 0,
      marginLeft: theme.spacing(1),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
      },
    },
    searchIcon: {
      width: theme.spacing(6),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'rgba(0,0,0,0.6)'
    },
    inputRoot: {
      color: 'inherit',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: 'rgba(0,0,0,0.05)',
    },
    button: {
      marginTop: theme.spacing(2.2),
      marginLeft: theme.spacing(2),
    },
    input: {
      display: 'none',
    },
    inputInput: {
      padding: theme.spacing(1.2, 1, 1.2, 6),
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: 130,
        '&:focus': {
          width: 160,
        },
      },
    },
  }),
);

const theme = createMuiTheme({
  overrides: {
    MuiFormLabel: {
      root: {
        fontSize: "0.875rem",
        
      }
    },
    MuiOutlinedInput: {
      input: {
        padding: 12
      }
    }
  }
})

export default EnhancedTableToolbar
