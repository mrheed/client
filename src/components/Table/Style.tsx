import { Theme } from '@material-ui/core/styles';
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import amber from '@material-ui/core/colors/amber';
import green from '@material-ui/core/colors/green';
import { hexToRgbA } from "../../Helpers";

export const tblStyle = makeStyles((theme: Theme) => createStyles({
    root: {
      width: '100%',
      marginTop: theme.spacing(3),
      overflowX: 'auto',
    },
    deleteIcon: {
      color: theme.palette.error.dark
    },
    editIcon: {
      color: theme.palette.primary.dark
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
    stripped: {
      '&>tr:nth-child(odd)': {
        backgroundColor: hexToRgbA("#000000", 0.03)
      },
      '&>tr:nth-child(even)': {
        backgroundColor: "#FFF"
      },
      '&>tr, td, th': {
        border: "none"
      }
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
      overflowX: "auto",
      minWidth: 700,
    },
    search: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
    },
    progress: {
      margin: theme.spacing(2)
    },
    troot: {      
      padding: theme.spacing(0, 4),
    },
    proot: {
      width: '100%',
      marginTop: theme.spacing(3),
      overflowX: 'auto',
    },
    inputInput: {
        padding: theme.spacing(1.2, 1, 1.2, 6),
        transition: theme.transitions.create('width'),
        width: '100%',
        fontSize: "0.875rem",
        [theme.breakpoints.up('sm')]: {
          width: 130,
          '&:focus': {
            width: 160,
          },
        },
      },
    searchIcon: {
        width: theme.spacing(6),
        height: 40,
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
  })
)