import React, { PropsWithChildren } from 'react';
import { NavLink } from 'react-router-dom';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Theme, Tooltip } from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { NavListItems, NavListItemsInterface } from './NavItems'
import { hexToRgbA } from '../Helpers';

const MainListItems = (props: any): JSX.Element => {

  const classes = styles();

  const Navs = NavListItems.map((x: NavListItemsInterface, index: number) => {
    const AdapterLink = React.forwardRef((props: PropsWithChildren<any>, ref: React.Ref<HTMLAnchorElement>) => (
      <NavLink innerRef={ref} {...props} exact={x.exact} activeClassName={classes.active} to={x.path} />
    ));
      return (
          <ListItem key={index} component={AdapterLink} className={classes.btnBs} button color="secondary">
            <Tooltip title={x.name}>
              <ListItemIcon className={classes.listText}>{x.icon}</ListItemIcon>
            </Tooltip>
            <ListItemText disableTypography primary={<Typography className={classes.listText}>{x.name}</Typography> }/>
          </ListItem> 
      )
  })
  return (<List component="nav" className={classes.nav}>{Navs}</List>)
}

const styles = makeStyles((theme: Theme) => createStyles({
  root: {
    display: 'block!important'
  },
  btnBs: {
    display: 'flex!important',
    "&>div>p" : {color: "#ffffff!important"},
    "&>div" : {color: "#ffffff!important"},
    justifyContent: 'unset!important',
    margin: "4px 8px!important",
    width: "auto",
    borderRadius: theme.spacing(0.5),
  },
  nav: {
    paddingTop: '4px',
  },
  buttonnRipple: {
    color: 'rgba(0,0,0,0.7)'
  },
  active: {
    "&:hover": {backgroundColor: theme.palette.primary.main},
    "&>div" : {color: "white!important"},
    "&>div>p" : {color: "white!important"},
    boxShadow: "0 12px 20px -10px "+hexToRgbA(theme.palette.primary.main, 0.6)+", 0 4px 20px 0 rgba(0, 0, 0,.12), 0 7px 8px -5px "+hexToRgbA(theme.palette.primary.main, 0.2),
    color: 'rgba(121, 134, 203, 0.6)!important',
    backgroundColor: theme.palette.primary.main,
    // borderLeft: '5px solid ' + theme.palette.primary.main + "!important",
    zIndex: 100
  },
  listText: {
      color: 'rgba(0,0,0,0.7)!important',
  }
}))


export default MainListItems
