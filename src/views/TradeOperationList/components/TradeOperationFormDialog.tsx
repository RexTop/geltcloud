import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
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
import {Divider, Grid} from "@material-ui/core";
import AnimateHeight from "react-animate-height";

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
    model: TradeOperationModel,
    dropDownDataForCashAccounts: CashAccountModel[],
};

export const TradeOperationFormDialog = ({open, handleClose, dropDownDataForCashAccounts, model}: Props) => {

    const [dirty, setDirty] = React.useState(model);
    const [sectionOneHeight, setSectionOneHeight] = React.useState('auto' as string | number);
    const [sectionTwoHeight, setSectionTwoHeight] = React.useState(0 as string | number);

    React.useEffect(() => {
        setDirty(model);
    }, [model]);

    const onTextFieldChange = (value: string, key: keyof TradeOperationModel) => {
        const updatedDirty = {...dirty, [key]: value};

        if (key === "acquirerCashAccountID") {
            const account = dropDownDataForCashAccounts.find(account => account.id === value);
            if (account) {
                updatedDirty.amountCurrency = account.currency;
            }
        } else if (key === "issuerCashAccountID") {
            const account = dropDownDataForCashAccounts.find(account => account.id === value);
            if (account) {
                updatedDirty.priceCurrency = account.currency;
            }
        }

        setDirty(updatedDirty);
    };

    const onNumericFieldChange = (value: number, key: keyof TradeOperationModel) => {
        setDirty({...dirty, [key]: value});
    };

    const isDirty = () => {
        if (model.note !== dirty.note) return true;
        if (model.issuerNote !== dirty.issuerNote) return true;
        if (model.acquirerNote !== dirty.acquirerNote) return true;
        if (model.issuerCashAccountID !== dirty.issuerCashAccountID) return true;
        if (model.amountCurrency !== dirty.amountCurrency) return true;
        if (model.acquirerCashAccountID !== dirty.acquirerCashAccountID) return true;
        if (model.priceCurrency !== dirty.priceCurrency) return true;
        if (model.amount !== dirty.amount) return true;
        if (model.price !== dirty.price) return true;
        if (model.amountFee !== dirty.amountFee) return true;
        if (model.priceFee !== dirty.priceFee) return true;
        if (model.exchangeRate !== dirty.exchangeRate) return true;
        if (model.issuerExchangeRateInUsd !== dirty.issuerExchangeRateInUsd) return true;
        if (model.acquirerExchangeRateInUsd !== dirty.acquirerExchangeRateInUsd) return true;
        if (model.date !== dirty.date) return true;
        return false;
    };

    const onSaveClick = async () => {
        try {
            handleClose();
            if (dirty.id) {
                const input: UpdateTradeOperationInput = {
                    id: dirty.id,
                    note: dirty.note || '-',
                    issuerNote: dirty.issuerNote || '-',
                    acquirerNote: dirty.acquirerNote || '-',
                    issuerCashAccountID: dirty.issuerCashAccountID,
                    priceCurrency: dirty.priceCurrency,
                    acquirerCashAccountID: dirty.acquirerCashAccountID,
                    amountCurrency: dirty.amountCurrency,
                    amount: dirty.amount,
                    price: dirty.price,
                    amountFee: dirty.amountFee,
                    priceFee: dirty.priceFee,
                    exchangeRate: dirty.exchangeRate,
                    issuerExchangeRateInUsd: dirty.issuerExchangeRateInUsd,
                    acquirerExchangeRateInUsd: dirty.acquirerExchangeRateInUsd,
                    date: moment(dirty.date).utc().format(),
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
                    priceCurrency: dirty.priceCurrency,
                    acquirerCashAccountID: dirty.acquirerCashAccountID,
                    amountCurrency: dirty.amountCurrency,
                    amount: dirty.amount,
                    price: dirty.price,
                    amountFee: dirty.amountFee,
                    priceFee: dirty.priceFee,
                    exchangeRate: dirty.exchangeRate,
                    issuerExchangeRateInUsd: dirty.issuerExchangeRateInUsd,
                    acquirerExchangeRateInUsd: dirty.acquirerExchangeRateInUsd,
                    date: moment(dirty.date).utc().format(),
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
            <DialogTitle id="form-dialog-title">{model.id ? 'Update' : 'Create'} trade operation</DialogTitle>
            <DialogContent>

                <h2 style={{cursor: 'pointer'}}
                    onClick={() => setSectionOneHeight(sectionOneHeight === 0 ? 'auto' : 0)}>Amounts</h2>
                <Divider/>
                <AnimateHeight duration={500} height={sectionOneHeight}>
                    <Grid container justify="flex-start">
                        {/*Issuer*/}
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
                            <TextField
                                margin="dense"
                                label="Price"
                                type="number"
                                value={dirty.price}
                                onChange={e => onNumericFieldChange(+e.target.value, 'price')}
                            />
                        </FormControl>
                        <TextField
                            disabled
                            margin="dense"
                            label="Price currency"
                            type="text"
                            value={dirty.priceCurrency}
                            onChange={() => void 0}
                        />
                        <FormControl className={classes.formControl}>
                            <TextField
                                margin="dense"
                                label="Price fee"
                                type="number"
                                value={dirty.priceFee}
                                onChange={e => onNumericFieldChange(+e.target.value, 'priceFee')}
                            />

                        </FormControl>
                    </Grid>

                    <Grid container justify="flex-start">
                        {/*Acquirer*/}
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
                        <FormControl className={classes.formControl}>
                            <TextField
                                margin="dense"
                                label="Amount"
                                type="number"
                                value={dirty.amount}
                                onChange={e => onNumericFieldChange(+e.target.value, 'amount')}
                            />
                        </FormControl>
                        <TextField
                            disabled
                            margin="dense"
                            label="Amount currency"
                            type="text"
                            value={dirty.amountCurrency}
                            onChange={() => void 0}
                        />
                        <TextField
                            margin="dense"
                            label="Amount fee"
                            type="number"
                            value={dirty.amountFee}
                            onChange={e => onNumericFieldChange(+e.target.value, 'amountFee')}
                        />
                    </Grid>

                    <TextField
                        margin="dense"
                        label="Date"
                        type="date"
                        fullWidth
                        value={moment(dirty.date).format('YYYY-MM-DD')}
                        onChange={e => onTextFieldChange(e.target.value, 'date')}
                    />

                    <FormControl className={classes.formControl}>
                        <TextField
                            margin="dense"
                            label="Exchange rate"
                            type="number"
                            value={dirty.exchangeRate}
                            onChange={e => onNumericFieldChange(+e.target.value, 'exchangeRate')}
                        />
                    </FormControl>
                </AnimateHeight>

                <h2 style={{cursor: 'pointer'}}
                    onClick={() => setSectionTwoHeight(sectionTwoHeight === 0 ? 'auto' : 0)}>Details</h2>
                <Divider/>

                <AnimateHeight duration={500} height={sectionTwoHeight}>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Note"
                        type="text"
                        fullWidth
                        value={dirty.note}
                        onChange={e => onTextFieldChange(e.target.value, 'note')}
                    />
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
                    <FormControl className={classes.formControl}>
                        <TextField
                            margin="dense"
                            label="Issuer exchange rate (USD)"
                            type="number"
                            value={dirty.issuerExchangeRateInUsd}
                            onChange={e => onNumericFieldChange(+e.target.value, 'issuerExchangeRateInUsd')}
                        />
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <TextField
                            margin="dense"
                            label="Acquirer exchange rate (USD)"
                            type="number"
                            value={dirty.acquirerExchangeRateInUsd}
                            onChange={e => onNumericFieldChange(+e.target.value, 'acquirerExchangeRateInUsd')}
                        />
                    </FormControl>
                </AnimateHeight>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={onSaveClick} color="primary" disabled={!isDirty()}>
                    {model.id ? 'Update' : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
