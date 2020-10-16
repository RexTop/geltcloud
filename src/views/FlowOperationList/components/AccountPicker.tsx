import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {CashAccountModel} from "../../../models/CashAccountModel";
import {Transition} from "../../../components/common/Transition";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
    }),
);

type Props = {
    open: boolean,
    handleClose: () => void,
    dropDownDataForCashAccounts: CashAccountModel[],
};

export const AccountPicker = ({open, handleClose, dropDownDataForCashAccounts}: Props) => {
    const classes = useStyles();

    return (
        <Dialog open={open} onClose={handleClose} TransitionComponent={Transition} className={classes.root}>
            <DialogTitle>Account</DialogTitle>
            <DialogContent>
                xxxxxxxxxxxxxxxxxx
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
};
