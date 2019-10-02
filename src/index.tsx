import React from 'react';
import ReactDOM from 'react-dom';
import { createMuiTheme, useTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux'

import Routes from './Routes';
import store from './redux/Store';
import GlobalState from './Contexts/GlobalState';
import { hexToRgbA } from './Helpers';

const App: React.FC = () => {
  const theme = useTheme()
  const THEME = createMuiTheme({
    // palette: {
    //   primary: {
    //     main : "#f44336"
    //   }
    // },
    overrides: {
      MuiTypography: {
        body1: {letterSpacing: 0, fontSize: "0.875rem"},
        caption: {letterSpacing: 0}
      },
      MuiSelect: {
        select: {
          "&:focus": {
            backgroundColor: "inherit"
          }
        }
      },
      MuiMenuItem:{
        root: {
          transition: "all 0.1s ease-in",
          borderRadius: theme.spacing(0.5),
          margin: theme.spacing(0, 1),
          "&:hover": {
            boxShadow: `0 4px 20px 0 rgba(0, 0, 0,.14), 0 7px 10px -5px ${hexToRgbA(theme.palette.primary.main, 0.4)}`,
            backgroundColor: theme.palette.primary.main+"!important",
            color: "white",
          }
        }
      },
      MuiSvgIcon: {
        root: {fontSize: "1.4rem"}
      },
      MuiFormHelperText: {
        root: {fontSize: "0.83rem", letterSpacing: -0.3}
      },
    },
  });
  return (
    <Provider store={store}>
      <Router>
        <ThemeProvider theme={THEME}>
          <Routes />
        </ThemeProvider>
      </Router>
    </Provider>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
