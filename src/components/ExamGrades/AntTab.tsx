import React from 'react';
import { withStyles, createStyles, Theme } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { hexToRgbA } from '../../Helpers';

export const AntTabs = withStyles((theme: Theme) => createStyles({
    root: {
      borderBottom: '1px solid #e8e8e8',
      backgroundColor: "white",
      width: "100%",
      boxShadow: theme.shadows[1]
    },
    indicator: {
      backgroundColor: theme.palette.primary.dark,
    },
}))(Tabs);
  
export const AntTab = withStyles((theme: Theme) =>
createStyles({
    root: {
    padding: theme.spacing(2),
    textTransform: 'none',
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover': {
        color: theme.palette.primary.dark,
        opacity: 1,
    },
    '&$selected': {
        color: theme.palette.primary.dark
    },
    '&:focus': {
        color: theme.palette.primary.dark,
    },
    },
    selected: {
    },
}),
)((props: StyledTabProps) => <Tab disableRipple {...props} />);

interface StyledTabProps {
    label: string;
}
  