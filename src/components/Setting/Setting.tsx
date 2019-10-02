import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import withStyles from '@material-ui/core/styles/withStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Grow from '@material-ui/core/Grow';   
import Error from '@material-ui/icons/Error';
import SnackbarContent from '@material-ui/core/SnackbarContent'
import Snackbar from '@material-ui/core/Snackbar';
import Close from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { VerticalTab, VerticalTabs } from './VerticalTab';
import { amber, green } from '@material-ui/core/colors';
import { Theme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { WithStyles } from '@material-ui/styles';
import AppSetting from './AppSetting';
import { readAppSetting, insertAppSetting, updateAppSetting } from '../../redux/ActionCreator';

class Setting extends React.Component<SettingProps> {
    state = {
        tab: 0,
        editable: {
            tahun_ajaran: false
        },
        snackOpen: false
    }
    todoFn = {
        insertAppSetting: (data: any) => this.props.insertAppSetting(data),
        updateAppSetting: (data: any) => this.props.updateAppSetting(data),
        readAppSetting: (type: string) => this.props.readAppSetting(type)
    }
    componentDidUpdate(prevProps: SettingProps, prevState: React.ComponentState){
        if (prevProps.todoSetting.status !== this.props.todoSetting.status) {
            if (!!this.props.todoSetting.status) {
                this.setState({snackOpen: true})
            } else {
                this.setState({snackOpen: false})
            }
            if (this.props.todoSetting.status === "success") {
                this.props.readAppSetting("application")
            }
        }
    }
    handleChangeTab = (event: React.ChangeEvent<{}>, newIndex: number) => {
        this.setState({tab: newIndex})
    }
    handleEditable = (state: string) => {
        this.setState((oldState: any) => ({
            editable: {
                ...oldState.editable,
                [state]: !oldState.editable.tahun_ajaran,
            }
        }))
    }
    onClose = () => {
        this.setState({snackOpen: false})
    }
    render() {
        return (
            <Paper>
                <Typography variant="subtitle1" className={this.props.classes.title}>Settings Navigation</Typography>
                <Grid container className={this.props.classes.wrapper}>
                    <Grid container>
                        <VerticalTabs value={this.state.tab} onChange={this.handleChangeTab}>
                            <VerticalTab label="Application" />
                            <VerticalTab label="Profile" />
                            <VerticalTab label="Options" />
                        </VerticalTabs>
                        
                            {this.state.tab === 0 && 
                            <AppSetting 
                                todoFn={this.todoFn}
                                todoSetting={this.props.todoSetting}
                                appSetting={this.props.setting} 
                                tab={this.state.tab} 
                            />}
                            {this.state.tab === 1 && 
                            <Grow in={this.state.tab === 1}>
                                <Typography variant="caption">Profile Setting</Typography>
                            </Grow>}
                            {this.state.tab === 2 && 
                            <Grow in={this.state.tab === 2}>
                                <Typography variant="caption">Options Setting</Typography>
                            </Grow>
                            }
                    </Grid>
                </Grid>
                {!!this.props.todoSetting.status && 
                    <Snackbar anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        open={this.state.snackOpen} autoHideDuration={2000}>
                        <SnackbarContent 
                            className={(this.props.classes as any)[this.props.todoSetting.status as any]}
                            message={
                                <span className={this.props.classes.message}>
                                    {this.props.todoSetting.status === "loading" 
                                        ? <>
                                            <CircularProgress color="inherit" className={this.props.classes.circProgress} />
                                            <Typography variant="body1">Sedang memproses data...</Typography>
                                        </>
                                        : <>
                                            {this.props.todoSetting.status === "error" 
                                                ? <Error className={this.props.classes.iconVariant} /> 
                                                : <CheckCircleIcon className={this.props.classes.iconVariant} />} 
                                            {this.props.todoSetting.message}
                                        </>
                                    }
                                </span>
                            }
                            action={[
                                <IconButton key="close" aria-label="Close" color="inherit" onClick={this.onClose}>
                                <Close className={this.props.classes.icon} />
                                </IconButton>,
                            ]}
                        />
                    </Snackbar>
                }
            </Paper>
        )
    }
}
const styles = ((theme: Theme) => createStyles({
    wrapper: {
        padding: theme.spacing(0, 2),
    },
    icon: {
      fontSize: 20,
    },
    circProgress: {
        margin: theme.spacing(0, 1)
    },
    iconVariant: {
      opacity: 0.9,
      marginRight: theme.spacing(1),
    },
    thnAjaran: {
        marginRight: theme.spacing(6)
    },
    gridOpt: {
        marginLeft: theme.spacing(2),
        padding: theme.spacing(0, 2)
    },
    error: {
        backgroundColor: theme.palette.error.main,
    },
    loading: {
        backgroundColor: theme.palette.primary.main
    },
    success: {
        backgroundColor: green[600]
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
    title: {
        padding: theme.spacing(2, 6),
        letterSpacing: -0.5,
        fontSize: theme.typography.h6.fontSize,
        fontWeight: 300,
    }
}))

interface SettingProps extends WithStyles<typeof styles> {
    setting: any;
    todoSetting: any;
    insertAppSetting: (data: any) => void;
    updateAppSetting: (data: any) => void;
    readAppSetting: (type: string) => void;
}

const mapStateToProps = (state: any) => ({
    setting: state.settings,
    todoSetting: state.todoRequest
})

const mapDispatchToProps = (dispatch: any) => ({
    insertAppSetting: (data: any) => dispatch(insertAppSetting(data)),
    updateAppSetting: (data: any) => dispatch(updateAppSetting(data)),
    readAppSetting: (type: string) => dispatch(readAppSetting(type)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Setting))