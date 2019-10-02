import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom'
import { createStyles, Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/core/styles/makeStyles'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { connect } from 'react-redux';

import * as Action from '../redux/ActionCreator';
import * as Interface from '../redux/ReduxInterfaces';

const SignIn = (props: any) => {

	const [ username, __setUsername ] = useState<string | null>(null);
	const [ password, __setPassword ] = useState<string | null>(null);
	const classes = styles()
	
	const __handleLogin = (x: any) => {
		x.preventDefault();
		props.MakeAuthRequest({username: username, password: password})
	}

  useEffect(() => {
	props.isAuthenticated && (props.history.push('/dashboard'))
	props.isSuccessRefreshResult && (props.RefreshToken())
    document.title = props.appName;
  }, [])

	return (
	<main className={classes.main}>
	  <CssBaseline />
	  <Paper className={classes.paper}>
	    <Avatar className={classes.avatar}>
	      <LockOutlinedIcon />
	    </Avatar>
	    <Typography component="h1" variant="h5">
	      Sign in
	    </Typography>
	    <form className={classes.form} onSubmit={__handleLogin} >
	      <FormControl margin="normal" required fullWidth>
	        <InputLabel htmlFor="email">Email Address</InputLabel>
	        <Input id="email" name="email" autoComplete="email" autoFocus onChange={e => __setUsername(e.target.value)} />
	      </FormControl>
	      <FormControl margin="normal" required fullWidth>
	        <InputLabel htmlFor="password">Password</InputLabel>
	        <Input name="password" type="password" id="password" autoComplete="current-password" onChange={e => __setPassword(e.target.value)} />
	      </FormControl>
	      <FormControlLabel
	        control={<Checkbox value="remember" color="secondary" />}
	        label="Remember me"
	      />
	      <Button type="submit" fullWidth variant="contained"color="secondary" className={classes.submit} >
	        Sign in
	      </Button>
	    </form>
	  </Paper>
	</main>
	);
}


const styles = makeStyles((theme: Theme) => createStyles({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(400 + theme.spacing(3 * 2))]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    marginTop: theme.spacing(3),
  },
}));

const mapStateToProps = (state: any) => ({
	isAuthenticated: state.isAuthenticated,
	isSuccessRefreshResult: state.successRefreshResult
})

const mapDispatchToProps = (dispatch: any) => ({
	MakeAuthRequest: (data: Interface.AuthData) => dispatch(Action.makeAuthenticationRequest(data)),
	RefreshToken: () => dispatch(Action.sendClientTokenToServer())
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SignIn));