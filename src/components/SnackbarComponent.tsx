import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, {AlertProps, Color} from '@material-ui/lab/Alert';
import {makeStyles, Theme} from '@material-ui/core/styles';
import {subscribe, unsubscribe} from "../lib/GenericEvent";
import {UIShowAlertMessageEvent, UIShowAlertMessageEventArgs} from "../custom-events/EventTypes";

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

export const SnackbarComponent = () => {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [severity, setSeverity] = React.useState(void 0 as (Color | undefined));

    const showMessage = (event: CustomEvent<UIShowAlertMessageEventArgs>) => {
        setMessage(event.detail.message);
        setSeverity(event.detail.severity);
        setOpen(true);
    };

    React.useEffect(() => {
        subscribe(UIShowAlertMessageEvent, showMessage);
        return () => {
            unsubscribe(UIShowAlertMessageEvent, showMessage);
        };
    }, []);

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    return (
        <div className={classes.root}>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
};
