import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Theme } from '@material-ui/core/styles';
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import classNames from 'classnames';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Grid from '@material-ui/core/Grid';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Avatar from '@material-ui/core/Avatar';
import MainListItems from '../LeftDrawer';
import img from '../img2.jpg'
import { SelectCookie, hexToRgbA } from '../../Helpers';
import * as Action from '../../redux/ActionCreator';
import { Login, Loading } from '..'

const drawerWidth: string = '230px';

const AppContainer = (props: any): JSX.Element => {

  const [open, setOpen] = useState<boolean>(true);
  const [currentTitle, setTitle] = useState<string | undefined>(undefined);
  const { makeLogoutRequest } = props;
  const classes = styles()

  useEffect(() => {
    window.__CURRENT_TITLE__ !== undefined && (setTitle(window.__CURRENT_TITLE__));
    if (props.isAuthenticated){
      document.title = `${window.__TITLE_PREFIX__} ${currentTitle || "Dashboard"}`;
    }
  })

  const handleLogout = (x: Object) => {
    makeLogoutRequest(SelectCookie('token'));
  }
  const handleDrawerOpen = (x: Object) => setOpen(true);
  const handleDrawerClose = (x: Object) => setOpen(false);
  
	return props.isAuthenticated ? (
		<div className={classes.root}>
      <CssBaseline />
      
      
			<AppBar position="relative" className={classNames(classes.appBar, open && classes.appBarShift)} >
			<Toolbar disableGutters={!open} className={classes.toolbar}>
			<IconButton color="inherit" aria-label="Open drawer" onClick={handleDrawerOpen} className={classNames( classes.menuButton, open && classes.menuButtonHidden,)}>
			<MenuIcon />
			</IconButton>
      <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>{currentTitle || "Dashboard"}</Typography>
      <IconButton color="inherit">
      <Badge badgeContent={4} color="secondary">
        <NotificationsIcon/>
      </Badge>
      </IconButton>
			</Toolbar>
      </AppBar>
      

        <Drawer variant="permanent" classes={{paper: classNames(classes.drawerPaper, !open && classes.drawerPaperClose),}} open={open}>
        {open ? (
          <div className={classes.toolbarIcon}>
            <Typography className={classes.titleClass} variant="h6">{window.__APP_NAME__}</Typography>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon className={classes.titleClass} />
            </IconButton>
          </div>
        ) : 
        <div className={classes.toolbarIcon}>
        </div>}  
        {open ?
              (<React.Fragment>
                <Divider className={classes.dividerClass} />
                <Grid container alignItems="center" style={{backgroundImage: `url("${img}")`}} className={classes.profile}>  
                <Grid container justify="flex-start" className={classNames(classes.profDivider, classes.bringToFront)}>
                  <Avatar className={classes.accountIcon}>SN</Avatar>
                  <div className={classNames(classes.detailProfile, classes.bringToFront)}>
                  <Typography variant="body1" className={classes.forceWhiteFont}>Syahid Nurrohim</Typography>
                  <Typography variant="caption" className={classNames(classes.forceWhiteFont, classes.captionProfile)}>syahid@gmail.com</Typography>
                  </div>
                </Grid>
                <br/>
                <Grid container justify="space-between" className={classes.bringToFront}>
                <Typography className={classes.belowProfile}>Administrator</Typography>
                <Typography component="button" className={classNames(classes.logoutBtn, classes.forceWhiteFont)} onClick={handleLogout}>Logout</Typography>
                </Grid>
                </Grid>
              </React.Fragment>)
        :
        ""
        }
          <MainListItems />
        </Drawer>
			<main className={classes.content}>
        <div className={classes.appBarSpacer} />
        {props.children}
			</main>
    </div>
	) : props.isLoading ? <Loading /> : <Login appName={window.__APP_NAME__ || "E-Rapor"} />
}

const styles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'flex',
  },
  titleClass: {
    color: '#ffffff',
    zIndex: 100
  },
  dividerClass: {
    backgroundColor: 'rgba(0,0,0,0.12)'
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  forceWhiteFont: {
    color: 'rgba(255,255,255,0.8)!important'
  },
  logoutBtn: {
    '&:hover': {
      cursor: 'pointer',
      opacity: 0.6
    },
    '&:focus': {
      outline: 'none',
      cursor: 'progress'
    },
    background: 'transparent',
    border: 'none',
    fontSize: '0.8rem!important'
  },
  profDivider: { marginBottom: '-4px' },
  bringToFront: { zIndex: 99 },
  captionProfile: {
    opacity: 0.8
  },
  belowProfile: {
    color: theme.palette.primary.light,
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.8rem!important',
    '&::after': {
      content: "''",
      marginLeft: '5px',
      width: '7px',
      height: '7px',
      backgroundColor: '#45f442',
      borderRadius: '50%',
    }
  },
  profile: {
    padding: '16px',
    flexDirection: 'column',
    backgroundAttachment: 'fixed',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    position: 'relative',
    backgroundPosition: 'center',
    '&::after': {
      content: '""',
      top: 0,
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: "rgba(0,0,0,0.4)"
    }
  },
  detailProfile: {
    marginLeft: '16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  },
  accountIcon: {
    width: '50px',
    height: '50px'
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 8px 0 15px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    boxShadow: "none!important",
    backgroundColor: theme.palette.primary.dark + "!important",
    color: "white!important",
    position: 'absolute',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }) + "!important",
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth})`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: "12px!important",
    marginRight: "36px!important",
  },
  menuButtonHidden: {
    display: 'none!important',
  },
  title: {
    flexGrow: 1,
  },
  personPin: {
    clear: "both",
    marginLeft: "30px"
  },
  drawerPaper: {
    boxShadow: '0 10px 30px -12px rgba(0, 0, 0, 0.42), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)!important',
    height: '100vh',
    overflow: 'auto',
    position: 'relative',
    backgroundColor: "#333",
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(4, 6),
    height: '100vh',
    overflow: 'auto',
    backgroundColor: "#eeeeee"
  },
  h5: {
    marginBottom: theme.spacing(2),
  },
}));

const mapDispatchToProps = (dispatch: any) => ({
	readAppSetting: (type: string) => dispatch(Action.readAppSetting(type)),
  makeLogoutRequest: (token: string) => dispatch(Action.removeSessionClient(token))
})
const mapStateToProps = (state: any) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AppContainer));