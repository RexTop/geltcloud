import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {CreateTransferOperationModel, TransferOperationModel} from "../../../models/TransferOperationModel";
import {API, graphqlOperation} from "aws-amplify";
import {createTransferOperation, updateTransferOperation} from "../../../graphql/mutations";
import {CreateTransferOperationInput, UpdateTransferOperationInput} from "../../../API";
import {showAlert} from "../../../utils/ui";
import moment from 'moment';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {CashAccountModel} from "../../../models/CashAccountModel";
import FormControl from '@material-ui/core/FormControl';
import {Transition} from "../../../components/common/Transition";
import {FlowType} from '../../../models/FlowType';
import accounting from 'accounting';
import {NumberFormatCustom} from '../../../components/common/NumberFormatCusrom';
import {notStonksTextColor, stonksTextColor} from '../../../theme/colors';
import {ToggleFlowType} from '../../../components/ToggleFlowType';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {AccountPicker} from '../../FlowOperationList/components/AccountPicker';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        cardRoot: {
            minWidth: 275,
            margin: theme.spacing(1, 0, 1, 0),
        },
        cardTitle: {
            fontSize: 14,
        },
        formControl: {
            margin: theme.spacing(1, 0, 1, 0),
            minWidth: 120,
        },
        stonks: {
            color: stonksTextColor,
        },
        notStonks: {
            color: notStonksTextColor,
        },
    }),
);

type Props = {
    open: boolean,
    handleClose: () => void,
    model: TransferOperationModel,
    dropDownDataForCashAccounts: CashAccountModel[],
};

export const TransferOperationFormDialog = ({open, handleClose, dropDownDataForCashAccounts, model}: Props) => {

    const [dirty, setDirty] = React.useState<Omit<TransferOperationModel, 'amount'>>(model);
    const [amount, setAmount] = React.useState(`${Math.abs(model.amount)}`);
    const [type, setType] = React.useState<FlowType>(model.amount < 0 ? 'expense' : 'income');
    const [showIssuerAccountPicker, setShowIssuerAccountPicker] = useState(false);
    const [showAcquirerAccountPicker, setShowAcquirerAccountPicker] = useState(false);

    const amountAsNumber = () => {
        const absAmount = Math.abs(accounting.unformat(amount, '.'));
        return type === 'income' ? absAmount : -absAmount;
    }

    React.useEffect(() => {
        setDirty(model);
    }, [model]);

    React.useEffect(() => {
        setAmount(`${Math.abs(model.amount)}`);
        setType(model.amount < 0 ? 'expense' : 'income');
    }, [model.amount]);

    const onTextFieldChange = (value: string, key: keyof TransferOperationModel) => {
        setDirty({...dirty, [key]: value});
    };

    const onAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(event.target.value);
    };

    const onNumericFieldChange = (value: number, key: keyof TransferOperationModel) => {
        setDirty({...dirty, [key]: value});
    };

    const isDirty = () => {
        if (model.amount !== amountAsNumber()) return true;
        if (model.dateIssued !== dirty.dateIssued) return true;
        if (model.description !== dirty.description) return true;
        if (model.acquirerBankNote !== dirty.acquirerBankNote) return true;
        if (model.issuerBankNote !== dirty.issuerBankNote) return true;
        if (model.issuerCashAccountID !== dirty.issuerCashAccountID) return true;
        if (model.acquirerCashAccountID !== dirty.acquirerCashAccountID) return true;
        if (model.dateAcquired !== dirty.dateAcquired) return true;
        if (model.fee !== dirty.fee) return true;
        if (JSON.stringify(model.tags) !== JSON.stringify(dirty.tags)) return true;
        return false;
    };

    const onSaveClick = async () => {
        try {
            handleClose();
            if (dirty.id) {
                const input: UpdateTransferOperationInput = {
                    id: dirty.id,
                    amount: amountAsNumber(),
                    dateIssued: moment(dirty.dateIssued).utc().format(),
                    description: dirty.description,
                    acquirerBankNote: dirty.acquirerBankNote || '-',
                    issuerBankNote: dirty.issuerBankNote || '-',
                    issuerCashAccountID: dirty.issuerCashAccountID,
                    tags: dirty.tags,
                    acquirerCashAccountID: dirty.acquirerCashAccountID,
                    dateAcquired: moment(dirty.dateAcquired).utc().format(),
                    fee: dirty.fee,
                };
                await API.graphql(graphqlOperation(updateTransferOperation, {input}));
                setDirty(CreateTransferOperationModel());
                showAlert({message: 'Transfer operation updated', severity: 'success'});
            } else {
                const input: CreateTransferOperationInput = {
                    amount: amountAsNumber(),
                    dateIssued: moment(dirty.dateIssued).utc().format(),
                    description: dirty.description,
                    acquirerBankNote: dirty.acquirerBankNote || '-',
                    issuerBankNote: dirty.issuerBankNote || '-',
                    issuerCashAccountID: dirty.issuerCashAccountID,
                    tags: dirty.tags,
                    acquirerCashAccountID: dirty.acquirerCashAccountID,
                    dateAcquired: moment(dirty.dateAcquired).utc().format(),
                    fee: dirty.fee,
                };
                await API.graphql(graphqlOperation(createTransferOperation, {input}));
                setDirty(CreateTransferOperationModel());
                showAlert({message: 'Transfer operation created', severity: 'success'});
            }
        } catch (error) {
            showAlert({message: 'Can not create transfer operation', severity: 'error'});
            console.error('Error adding item', {error});
        }
    };

    const classes = useStyles();

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title"
                TransitionComponent={Transition}>
            <DialogTitle id="form-dialog-title">{model.id ? 'Update' : 'New'} transfer operation</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Amount"
                    type="text"
                    fullWidth
                    value={amount}
                    onChange={onAmountChange}
                    InputProps={{
                        inputComponent: NumberFormatCustom as any,
                        className: type === 'income' ? classes.stonks : classes.notStonks,
                    }}
                />
                {/*Issuer Account*/}
                <Card className={classes.cardRoot}>
                    <CardContent onClick={() => setShowIssuerAccountPicker(true)}>
                        <Typography className={classes.cardTitle} color="textSecondary" gutterBottom>
                            From
                        </Typography>
                        <Typography variant="h5" component="h2">
                            {dropDownDataForCashAccounts.find(x => x.id === dirty.issuerCashAccountID)?.name || ''}
                        </Typography>
                    </CardContent>
                </Card>
                <AccountPicker
                    open={showIssuerAccountPicker}
                    handleClose={() => setShowIssuerAccountPicker(false)}
                    dropDownDataForCashAccounts={dropDownDataForCashAccounts}
                    onAccountPicked={account => onTextFieldChange(account.id, 'issuerCashAccountID')}
                    value={dirty.issuerCashAccountID}
                />
                {/*Acquirer Account*/}
                <Card className={classes.cardRoot}>
                    <CardContent onClick={() => setShowAcquirerAccountPicker(true)}>
                        <Typography className={classes.cardTitle} color="textSecondary" gutterBottom>
                            To
                        </Typography>
                        <Typography variant="h5" component="h2">
                            {dropDownDataForCashAccounts.find(x => x.id === dirty.acquirerCashAccountID)?.name || ''}
                        </Typography>
                    </CardContent>
                </Card>
                <AccountPicker
                    open={showAcquirerAccountPicker}
                    handleClose={() => setShowAcquirerAccountPicker(false)}
                    dropDownDataForCashAccounts={dropDownDataForCashAccounts}
                    onAccountPicked={account => onTextFieldChange(account.id, 'acquirerCashAccountID')}
                    value={dirty.acquirerCashAccountID}
                />
                <TextField
                    margin="dense"
                    label="Description"
                    type="text"
                    fullWidth
                    value={dirty.description}
                    onChange={e => onTextFieldChange(e.target.value, 'description')}
                />
                <FormControl className={classes.formControl}>
                    <TextField
                        margin="dense"
                        label="Fee"
                        type="number"
                        value={dirty.fee}
                        onChange={e => onNumericFieldChange(+e.target.value, 'fee')}
                    />
                </FormControl>
                <ToggleFlowType type={type} onChange={value => setType(value)}/>
                <TextField
                    margin="dense"
                    label="Issuer Note"
                    type="text"
                    fullWidth
                    value={dirty.issuerBankNote}
                    onChange={e => onTextFieldChange(e.target.value, 'issuerBankNote')}
                />
                <TextField
                    margin="dense"
                    label="Acquirer Note"
                    type="text"
                    fullWidth
                    value={dirty.acquirerBankNote}
                    onChange={e => onTextFieldChange(e.target.value, 'acquirerBankNote')}
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
                    {model.id ? 'Update' : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
