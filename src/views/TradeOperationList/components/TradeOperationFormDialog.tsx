import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {CreateTradeOperationModel, TradeOperationModel} from "../../../models/TradeOperationModel";
import {API, graphqlOperation} from "aws-amplify";
import {createTradeOperation, updateTradeOperation} from "../../../graphql/mutations";
import {CreateTradeOperationInput, UpdateTradeOperationInput} from "../../../API";
import {showAlert} from "../../../utils/ui";
import moment from 'moment';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {CashAccountModel} from "../../../models/CashAccountModel";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

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
    item: TradeOperationModel,
    dropDownDataForCashAccounts: CashAccountModel[],
};

export const TradeOperationFormDialog = ({open, handleClose, dropDownDataForCashAccounts, item}: Props) => {

    const [dirty, setDirty] = React.useState(item);

    React.useEffect(() => {
        setDirty(item);
    }, [item]);

    const onTextFieldChange = (value: string, key: keyof TradeOperationModel) => {
        setDirty({...dirty, [key]: value});
    };

    const onNumericFieldChange = (value: number, key: keyof TradeOperationModel) => {
        setDirty({...dirty, [key]: value});
    };

    const isDirty = () => {
        if (item.note !== dirty.note) return true;
        if (item.issuerNote !== dirty.issuerNote) return true;
        if (item.acquirerNote !== dirty.acquirerNote) return true;
        if (item.issuerCashAccountID !== dirty.issuerCashAccountID) return true;
        if (item.issuerCurrency !== dirty.issuerCurrency) return true;
        if (item.acquirerCashAccountID !== dirty.acquirerCashAccountID) return true;
        if (item.acquirerCurrency !== dirty.acquirerCurrency) return true;
        if (item.amount !== dirty.amount) return true;
        if (item.price !== dirty.price) return true;
        if (item.fee !== dirty.fee) return true;
        if (item.exchangeRate !== dirty.exchangeRate) return true;
        if (item.issuerExchangeRateInUsd !== dirty.issuerExchangeRateInUsd) return true;
        if (item.acquirerExchangeRateInUsd !== dirty.acquirerExchangeRateInUsd) return true;
        if (item.dateIssued !== dirty.dateIssued) return true;
        if (item.dateAcquired !== dirty.dateAcquired) return true;
        return false;
    };

    const onSaveClick = async () => {
        console.log("Save", dirty);
        try {
            handleClose();
            if (dirty.id) {
                const input: UpdateTradeOperationInput = {
                    id: dirty.id,
                    note: dirty.note || '-',
                    issuerNote: dirty.issuerNote || '-',
                    acquirerNote: dirty.acquirerNote || '-',
                    issuerCashAccountID: dirty.issuerCashAccountID,
                    issuerCurrency: dirty.issuerCurrency,
                    acquirerCashAccountID: dirty.acquirerCashAccountID,
                    acquirerCurrency: dirty.acquirerCurrency,
                    amount: dirty.amount,
                    price: dirty.price,
                    fee: dirty.fee,
                    exchangeRate: dirty.exchangeRate,
                    issuerExchangeRateInUsd: dirty.issuerExchangeRateInUsd,
                    acquirerExchangeRateInUsd: dirty.acquirerExchangeRateInUsd,
                    dateIssued: moment(dirty.dateIssued).utc().format(),
                    dateAcquired: moment(dirty.dateAcquired).utc().format(),
                };
                await API.graphql(graphqlOperation(updateTradeOperation, {input}));
                setDirty(CreateTradeOperationModel());
                showAlert({message: 'Trade operation updated', severity: 'success'});
            } else {
                const input: CreateTradeOperationInput = {
                    note: dirty.note || '-',
                    issuerNote: dirty.issuerNote || '-',
                    acquirerNote: dirty.acquirerNote || '-',
                    issuerCashAccountID: dirty.issuerCashAccountID,
                    issuerCurrency: dirty.issuerCurrency,
                    acquirerCashAccountID: dirty.acquirerCashAccountID,
                    acquirerCurrency: dirty.acquirerCurrency,
                    amount: dirty.amount,
                    price: dirty.price,
                    fee: dirty.fee,
                    exchangeRate: dirty.exchangeRate,
                    issuerExchangeRateInUsd: dirty.issuerExchangeRateInUsd,
                    acquirerExchangeRateInUsd: dirty.acquirerExchangeRateInUsd,
                    dateIssued: moment(dirty.dateIssued).utc().format(),
                    dateAcquired: moment(dirty.dateAcquired).utc().format(),
                };
                await API.graphql(graphqlOperation(createTradeOperation, {input}));
                setDirty(CreateTradeOperationModel());
                showAlert({message: 'Trade operation created', severity: 'success'});
            }
        } catch (error) {
            showAlert({message: 'Can not create trade operation', severity: 'error'});
            console.error('Error adding item', {error});
        }
    };

    const classes = useStyles();

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{item.id ? 'Update' : 'Create'} trade operation</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {item.id ? 'Update' : 'Create'} trade operation
                </DialogContentText>
                <FormControl className={classes.formControl}>
                    <InputLabel id="TradeOperationFromDialog-IssuerCashAccountId-Label">Issuer</InputLabel>
                    <Select
                        labelId="TradeOperationFromDialog-IssuerCashAccountId-Label"
                        value={dirty.issuerCashAccountID}
                        onChange={e => onTextFieldChange(e.target.value + '', 'issuerCashAccountID')}
                    >
                        {dropDownDataForCashAccounts.map(cashAccount => (
                            <MenuItem key={`TradeOperationFormDialog-Issuer-${cashAccount.id}`}
                                      value={cashAccount.id}>
                                {cashAccount.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <InputLabel id="TradeOperationFromDialog-AcquirerCashAccountId-Label">Acquirer</InputLabel>
                    <Select
                        labelId="TradeOperationFromDialog-AcquirerCashAccountId-Label"
                        value={dirty.acquirerCashAccountID}
                        onChange={e => onTextFieldChange(e.target.value + '', 'acquirerCashAccountID')}
                    >
                        {dropDownDataForCashAccounts.map(cashAccount => (
                            <MenuItem key={`TradeOperationFormDialog-Acquirer-${cashAccount.id}`}
                                      value={cashAccount.id}>
                                {cashAccount.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Description"
                    type="text"
                    fullWidth
                    value={dirty.note}
                    onChange={e => onTextFieldChange(e.target.value, 'note')}
                />
                <FormControl className={classes.formControl}>
                    <TextField
                        margin="dense"
                        label="Amount"
                        type="number"
                        value={dirty.amount}
                        onChange={e => onNumericFieldChange(+e.target.value, 'amount')}
                    />
                </FormControl>
                <FormControl className={classes.formControl}>
                    <TextField
                        margin="dense"
                        label="Fee"
                        type="number"
                        value={dirty.fee}
                        onChange={e => onNumericFieldChange(+e.target.value, 'fee')}
                    />
                </FormControl>
                <TextField
                    margin="dense"
                    label="Issuer Note"
                    type="text"
                    fullWidth
                    value={dirty.issuerNote}
                    onChange={e => onTextFieldChange(e.target.value, 'issuerNote')}
                />
                <TextField
                    margin="dense"
                    label="Acquirer Note"
                    type="text"
                    fullWidth
                    value={dirty.acquirerNote}
                    onChange={e => onTextFieldChange(e.target.value, 'acquirerNote')}
                />
                <TextField
                    margin="dense"
                    label="Date Issued"
                    type="date"
                    fullWidth
                    value={moment(dirty.dateIssued).format('YYYY-MM-DD')}
                    onChange={e => onTextFieldChange(e.target.value, 'dateIssued')}
                />
                <TextField
                    margin="dense"
                    label="Date Acquired"
                    type="date"
                    fullWidth
                    value={moment(dirty.dateAcquired).format('YYYY-MM-DD')}
                    onChange={e => onTextFieldChange(e.target.value, 'dateAcquired')}
                />
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
