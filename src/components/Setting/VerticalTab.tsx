import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import { Theme } from '@material-ui/core/styles'
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { hexToRgbA } from '../../Helpers';

export const VerticalTabs = withStyles((theme: Theme) => createStyles({
    root: {
    },
    flexContainer: {
        flexDirection: "column",
        alignItems: "center",
        padding: theme.spacing(1.5)
    },
    indicator: {
        backgroundColor: "inherit",
    }
}))(Tabs)

export const VerticalTab = withStyles((theme: Theme) => createStyles({
    root: {
        padding: theme.spacing(1, 0),
        margin: theme.spacing(1, 0),
        borderRadius: theme.spacing(3),
        "&$selected": {
            color: "white",
            backgroundColor: theme.palette.primary.dark
        }
    },
    selected: {
        boxShadow: '0 4px 20px 0px rgba(0, 0, 0, 0.14), 0 7px 10px -5px ' + hexToRgbA(theme.palette.primary.dark, 0.4),
        color: "white",
        backgroundColor: theme.palette.primary.dark,
        transition: theme.transitions.create(["color", "background-color"], {duration: theme.transitions.duration.complex})
    }
}))(Tab)
