import React from 'react';
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { hexToRgbA } from '../../Helpers';

export const CetakTabs = withStyles((theme: Theme) => createStyles({
    root: {
      backgroundColor: "inherit",
      width: "100%",
    },
    flexContainer: {
      flexDirection: "column",
      padding: theme.spacing(1.5)
    },
    indicator: {
      backgroundColor: "inherit",
    },
}))(Tabs);
  
export const CetakTab = withStyles((theme: Theme) =>
createStyles({
    root: {
    padding: theme.spacing(1, 2),
    borderRadius: theme.spacing(0.5),
    textTransform: 'none',
    backgroundColor: hexToRgbA("#000000", 0),
    minWidth: 72,
    transition: "all 0.2 linear",
    fontWeight: theme.typography.fontWeightLight,
    fontSize: "1em",
    },
    selected: {
        boxShadow: `0 4px 20px 0 rgba(0, 0, 0,.14), 0 7px 10px -5px ${hexToRgbA(theme.palette.primary.main, 0.4)}`,
        backgroundColor: theme.palette.primary.main,
        color: "white",
        borderBottom: "0px"
    },
}),
)((props: StyledTabProps) => <Tab {...props} />);

interface StyledTabProps {
    label: string;
}
  