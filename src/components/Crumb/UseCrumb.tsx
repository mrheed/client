import React, { useEffect, useState, PropsWithChildren } from 'react';
import withStyles from '@material-ui/styles/withStyles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { emphasize } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import { Link } from 'react-router-dom';
import { NavListItems, NavListItemsInterface } from '../NavItems'
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import { hexToRgbA } from '../../Helpers';

function Breadcrumb(props: any) {
    const classes = styles()
    const [breadPath, setBreadPath] = useState<Array<{label: string; path: string; icon: JSX.Element}>>([])
    useEffect(() => {
        var path: string[] = props.location.pathname.split("/").filter((x: string) => x !== "#" && !!x)
        var arrPath: any[] = []
        for (let i = 0; i < path.length; i++) {
          var name: string[] = path[i].split("_");
            for (let i2 = 0; i2 < name.length; i2++) {
              var name2: string[] = name[i2].split("")
              var upLetter: string = name[i2][0].toUpperCase();
              name2.shift();
              name2.unshift(upLetter);
              name.splice(i2, 1, name2.join(""))
            }
          var pth: string = "/" + path.slice(0, i+1).join("/")
          var icon = i < 2 && NavListItems.filter((x: NavListItemsInterface) => x.path === pth)[0]["icon"]
          arrPath.push(i < 2 ? {path: pth, label: name.join(" "), icon: icon} : {path: pth, label: name.join(" ")})        
        }
        setBreadPath(arrPath)
      },[])

    return (
        <>
        {breadPath.length > 1 && (
            <Breadcrumbs separator="/" className={classes.breadCrumb} aria-label="Breadcrumb">
              {breadPath.map((x: any, i: number) => {
                const AdapterLink = React.forwardRef((props: PropsWithChildren<any>, ref: React.Ref<HTMLAnchorElement>) => (
                  <Link innerRef={ref} {...props} to={x.path} />
                ))
                return (
                  <StyledBreadcrumb
                    key={x.path}
                    component={AdapterLink}
                    label={x.label}
                    avatar={
                      x.icon && (
                        <Avatar className={classes.avatar}>
                        {x.icon}
                        </Avatar>
                      )
                    }
                  />
                )
              })}
            </Breadcrumbs>
          )}
        </>
    )
}

const StyledBreadcrumb = withStyles((theme: Theme) => ({
    root: {
      backgroundColor: "white",
      padding: theme.spacing(0.5),
      color: hexToRgbA("#000000", 0.7),
      fontWeight: theme.typography.fontWeightRegular,
      transition: "all 0.2 linear",
      boxShadow: `0 2px 10px 0 rgba(0, 0, 0,.14), 0 4px 5px -5px ${hexToRgbA("#000000", 0.4)}`,
      '&:hover, &:focus': {
        backgroundColor: theme.palette.grey[300],
        boxShadow: "none",
        cursor: 'pointer'
      },
      '&:active': {
        boxShadow: theme.shadows[1],
        backgroundColor: emphasize(theme.palette.grey[300], 0.12),
      },
    },
  }))(Chip) as typeof Chip;

const styles = makeStyles((theme: Theme) => createStyles({
  breadCrumb: {
    borderRadius: theme.spacing(1),
    // padding: theme.spacing(1.5, 2)
  },
  avatar: {
    background: 'none',
    marginRight: -theme.spacing(1.5),
    color: hexToRgbA("#000000", 0.7)
  },
})) 

export default Breadcrumb
