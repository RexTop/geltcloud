import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import {green} from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            alignItems: 'center',
            marginTop: theme.spacing(3),
            width: '100%',
        },
        wrapper: {
            position: 'relative',
        },
        buttonProgress: {
            color: green[500],
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: -12,
            marginLeft: -12,
        },
    }),
);

type Props = {
    loading: boolean,
    disabled: boolean,
    onClick: () => void,
};

export const FetchLoadingButton = ({loading, disabled, onClick}: Props) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div className={classes.wrapper}>
                <Button variant="contained" color="primary" disabled={disabled || loading} onClick={onClick}>Load
                    more</Button>
                {loading && <CircularProgress size={24} className={classes.buttonProgress}/>}
            </div>
        </div>
    );
};
