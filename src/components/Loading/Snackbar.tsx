import React from 'react';
import { Theme } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import withStyles from '@material-ui/core/styles/withStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors'
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Error from '@material-ui/icons/Error';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Close from '@material-ui/icons/Close';
import { WithStyles } from '@material-ui/styles';

class SnackLoading extends React.Component<SnackLoadingProps> {
    state = {
        open: false
    }
    componentDidUpdate(prevProps: SnackLoadingProps, prevState: React.ComponentState) {
        if (prevProps.todoRequest.status !== this.props.todoRequest.status) {
            if (this.props.todoRequest.status !== "") {
                this.setState({open: true})
            }
        }
    }
    onClose = () => {
        this.setState({open: false})
    }
    render() {
        return(
            <Snackbar anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            open={this.state.open} autoHideDuration={2000}>
            <SnackbarContent 
                className={(this.props.classes as any)[this.props.todoRequest.status as any]}
                message={
                    <span className={this.props.classes.message}>
                        {this.props.todoRequest.status === "loading" 
                            ? <>
                                <CircularProgress color="inherit" className={this.props.classes.circProgress} />
                                <Typography variant="body1">Sedang memproses data...</Typography>
                            </>
                            : <>
                                {this.props.todoRequest.status === "error" 
                                    ? <Error className={this.props.classes.iconVariant} /> 
                                    : <CheckCircleIcon className={this.props.classes.iconVariant} />} 
                                {this.props.todoRequest.message}
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
        )
    }
}

interface SnackLoadingProps extends WithStyles<typeof styles> {
    todoRequest: {message: string; status: string; loading: boolean};
}

const styles = (theme: Theme) => createStyles({
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
    }
})

export default withStyles(styles)(SnackLoading);