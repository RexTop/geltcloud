import React, {ChangeEvent} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {CashAccountModel, CreateCashAccountModel} from "../../../models/CashAccountModel";
import {API, graphqlOperation} from "aws-amplify";
import {createCashAccount, updateCashAccount} from "../../../graphql/mutations";
import {CashAccountType, CreateCashAccountInput, UpdateCashAccountInput} from "../../../API";
import {showAlert} from "../../../utils/ui";
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Grid} from "@material-ui/core";
import {Transition} from "../../../components/common/Transition";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
    }),
);

type Props = {
    open: boolean,
    handleClose: () => void,
    item: CashAccountModel,
};

export const CashAccountFormDialog = ({open, handleClose, item}: Props) => {

    const [dirty, setDirty] = React.useState(item);

    React.useEffect(() => {
        setDirty(item);
    }, [item]);

    const onNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setDirty({...dirty, name: event.target.value});
    };

    const onBalanceChange = (event: ChangeEvent<HTMLInputElement>) => {
        setDirty({...dirty, balance: +event.target.value});
    };

    const onActiveChange = (event: ChangeEvent<HTMLInputElement>) => {
        setDirty({...dirty, active: event.target.checked});
    };

    const onTextFieldChange = (value: string, key: keyof CashAccountModel) => {
        setDirty({...dirty, [key]: value});
    };

    const onNumericFieldChange = (value: number, key: keyof CashAccountModel) => {
        setDirty({...dirty, [key]: value});
    };

    const isDirty = () => {
        if (item.name !== dirty.name) return true;
        if (item.balance !== dirty.balance) return true;
        if (item.active !== dirty.active) return true;
        if (item.type !== dirty.type) return true;
        if (item.credit !== dirty.credit) return true;
        if (item.last4 !== dirty.last4) return true;
        if (item.paymentDay !== dirty.paymentDay) return true;
        if (item.closingDay !== dirty.closingDay) return true;
        if (item.currency !== dirty.currency) return true;
        return false;
    };

    const onSaveClick = async () => {
        try {
            handleClose();
            if (dirty.id) {
                const input: UpdateCashAccountInput = {
                    id: dirty.id,
                    name: dirty.name,
                    balance: dirty.balance,
                    active: dirty.active,
                    type: dirty.type,
                    credit: dirty.credit,
                    last4: dirty.last4 || '-',
                    paymentDay: dirty.paymentDay,
                    closingDay: dirty.closingDay,
                    currency: dirty.currency,
                };
                await API.graphql(graphqlOperation(updateCashAccount, {input}));
                setDirty(CreateCashAccountModel());
                showAlert({message: 'Cash account updated', severity: 'success'});
            } else {
                const input: CreateCashAccountInput = {
                    name: dirty.name,
                    balance: dirty.balance,
                    active: dirty.active,
                    type: dirty.type,
                    credit: dirty.credit,
                    last4: dirty.last4 || '-',
                    paymentDay: dirty.paymentDay,
                    closingDay: dirty.closingDay,
                    currency: dirty.currency,
                };
                await API.graphql(graphqlOperation(createCashAccount, {input}));
                setDirty(CreateCashAccountModel());
                showAlert({message: 'Cash account created', severity: 'success'});
            }
        } catch (error) {
            showAlert({message: 'Can not create cash account', severity: 'error'});
            console.error('Error adding item', {error});
        }
    };

    const classes = useStyles();

    return (
        <Dialog fullScreen open={open} onClose={handleClose} aria-labelledby="form-dialog-title"
                TransitionComponent={Transition}>
            <DialogTitle id="form-dialog-title">{item.id ? 'Update' : 'Create'} cash account</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {item.id ? 'Update' : 'Create'} cash account
                </DialogContentText>
                <Grid container justify="space-between">
                    <FormControl className={classes.formControl}>
                        <InputLabel id="CashAccountFromDialog-Type-Label">Type</InputLabel>
                        <Select
                            labelId="CashAccountFromDialog-Type-Label"
                            value={dirty.type}
                            onChange={e => onTextFieldChange(e.target.value + '', 'type')}
                        >
                            <MenuItem value={CashAccountType.CASH_ACCOUNT}>
                                {CashAccountType.CASH_ACCOUNT}
                            </MenuItem>
                            <MenuItem value={CashAccountType.CREDIT_CARD}>
                                {CashAccountType.CREDIT_CARD}
                            </MenuItem>
                            <MenuItem value={CashAccountType.GIFT_CARD}>
                                {CashAccountType.GIFT_CARD}
                            </MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        margin="dense"
                        label="Balance $"
                        type="number"
                        value={dirty.balance}
                        onChange={onBalanceChange}
                    />
                </Grid>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Name"
                    type="text"
                    fullWidth
                    value={dirty.name}
                    onChange={onNameChange}
                />
                <Grid container justify="space-between">
                    {/*TODO: Add a dropdown of valid currencies with an option to add a custom currency if it's not present in the dropdown*/}
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Currency"
                        type="text"
                        value={dirty.currency}
                        onChange={e => onTextFieldChange(e.target.value, 'currency')}
                    />
                </Grid>
                {dirty.type === CashAccountType.CREDIT_CARD && (
                    <>
                        <TextField
                            margin="dense"
                            label="Credit $"
                            type="number"
                            fullWidth
                            value={dirty.credit}
                            onChange={e => onNumericFieldChange(+e.target.value, 'credit')}
                        />
                        <TextField
                            margin="dense"
                            label="Last 4 digits"
                            type="text"
                            fullWidth
                            value={dirty.last4}
                            onChange={e => onTextFieldChange(e.target.value, 'last4')}
                        />
                        <TextField
                            margin="dense"
                            label="Closing Day"
                            type="number"
                            fullWidth
                            value={dirty.closingDay}
                            onChange={e => onNumericFieldChange(+e.target.value, 'closingDay')}
                        />
                        <TextField
                            margin="dense"
                            label="Payment Day"
                            type="number"
                            fullWidth
                            value={dirty.paymentDay}
                            onChange={e => onNumericFieldChange(+e.target.value, 'paymentDay')}
                        />
                    </>
                )}
                <FormGroup row>
                    <FormControlLabel
                        control={<Switch checked={dirty.active} onChange={onActiveChange}/>}
                        label="Active"
                    />
                </FormGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={onSaveClick} color="primary" disabled={!isDirty()}>
                    {item.id ? 'Update' : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
