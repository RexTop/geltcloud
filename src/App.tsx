import React from 'react';
import {default as Amplify} from 'aws-amplify';
import awsconfig from './aws-exports';
import './App.css';
import {withAuthenticator} from 'aws-amplify-react';
import CssBaseline from '@material-ui/core/CssBaseline';
import {SnackbarComponent} from "./components/SnackbarComponent";
import {ThemeProvider} from '@material-ui/styles';
import theme from './theme';
import {Router} from 'react-router-dom';
import {createBrowserHistory} from "history";
import {Routes} from "./Routes";

Amplify.configure(awsconfig);

const browserHistory = createBrowserHistory();

class App extends React.Component {
    render() {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <Router history={browserHistory}>
                    <Routes/>
                </Router>
                <SnackbarComponent/>
            </ThemeProvider>
        );
    }
}

export default withAuthenticator(App);
