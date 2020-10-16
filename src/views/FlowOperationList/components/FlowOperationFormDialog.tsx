import React, {ChangeEvent, useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {CreateFlowOperationModel, FlowOperationModel} from "../../../models/FlowOperationModel";
import {API, graphqlOperation} from "aws-amplify";
import {createFlowOperation, updateFlowOperation} from "../../../graphql/mutations";
import {CreateFlowOperationInput, UpdateFlowOperationInput} from "../../../API";
import {showAlert} from "../../../utils/ui";
import moment from 'moment';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {CashAccountModel} from "../../../models/CashAccountModel";
import {Transition} from "../../../components/common/Transition";
import accounting from 'accounting';
import {NumberFormatCustom} from '../../../components/common/NumberFormatCusrom';
import {ToggleFlowType} from '../../../components/ToggleFlowType';
import {FlowType} from '../../../models/FlowType';
import {notStonksTextColor, stonksTextColor} from '../../../theme/colors';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {AccountPicker} from './AccountPicker';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        cardRoot: {
            minWidth: 275,
            margin: theme.spacing(1, 0, 1, 0),
        },
        cardTitle: {
            fontSize: 14,
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
    model: FlowOperationModel,
    dropDownDataForCashAccounts: CashAccountModel[],
};

export const FlowOperationFormDialog = ({open, handleClose, dropDownDataForCashAccounts, model}: Props) => {

    const [dirty, setDirty] = useState<Omit<FlowOperationModel, 'amount'>>(model);
    const [amount, setAmount] = useState(`${Math.abs(model.amount)}`);
    const [type, setType] = useState<FlowType>(model.amount < 0 ? 'expense' : 'income');
    const [showAccountPicker, setShowAccountPicker] = useState(false);

    const amountAsNumber = () => {
        const absAmount = Math.abs(accounting.unformat(amount, '.'));
        return type === 'income' ? absAmount : -absAmount;
    }

    useEffect(() => {
        setDirty(model);
    }, [model]);

    useEffect(() => {
        setAmount(`${Math.abs(model.amount)}`);
        setType(model.amount < 0 ? 'expense' : 'income');
    }, [model.amount]);

    const onTextFieldChange = (value: string, key: keyof FlowOperationModel) => {
        setDirty({...dirty, [key]: value});
    };

    const onAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
        setAmount(event.target.value);
    };

    const isDirty = () => {
        if (model.amount !== amountAsNumber()) return true;
        if (model.dateIssued !== dirty.dateIssued) return true;
        if (model.description !== dirty.description) return true;
        if (model.bankNote !== dirty.bankNote) return true;
        if (model.issuerCashAccountID !== dirty.issuerCashAccountID) return true;
        if (JSON.stringify(model.tags) !== JSON.stringify(dirty.tags)) return true;
        return false;
    };

    const onSaveClick = async () => {
        try {
            handleClose();
            if (dirty.id) {
                const input: UpdateFlowOperationInput = {
                    id: dirty.id,
                    amount: amountAsNumber(),
                    dateIssued: moment(dirty.dateIssued).utc().format(),
                    description: dirty.description,
                    bankNote: dirty.bankNote || '-',
                    issuerCashAccountID: dirty.issuerCashAccountID,
                    tags: dirty.tags,
                };
                await API.graphql(graphqlOperation(updateFlowOperation, {input}));
                setDirty(CreateFlowOperationModel());
                showAlert({message: 'Flow operation updated', severity: 'success'});
            } else {
                const input: CreateFlowOperationInput = {
                    amount: amountAsNumber(),
                    dateIssued: moment(dirty.dateIssued).utc().format(),
                    description: dirty.description,
                    bankNote: dirty.bankNote || '-',
                    issuerCashAccountID: dirty.issuerCashAccountID,
                    tags: dirty.tags,
                };
                await API.graphql(graphqlOperation(createFlowOperation, {input}));
                setDirty(CreateFlowOperationModel());
                showAlert({message: 'Flow operation created', severity: 'success'});
            }
        } catch (error) {
            showAlert({message: 'Can not create flow operation', severity: 'error'});
            console.error('Error adding item', {error});
        }
    };

    const classes = useStyles();

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title"
                TransitionComponent={Transition}>
            <DialogTitle id="form-dialog-title">{model.id ? 'Update' : 'New'} flow operation</DialogTitle>
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
                <Card className={classes.cardRoot}>
                    <CardContent onClick={() => setShowAccountPicker(true)}>
                        <Typography className={classes.cardTitle} color="textSecondary" gutterBottom>
                            Account
                        </Typography>
                        <Typography variant="h5" component="h2">
                            {dropDownDataForCashAccounts.find(x => x.id === dirty.issuerCashAccountID)?.name || ''}
                        </Typography>
                    </CardContent>
                </Card>
                <AccountPicker
                    title="Account"
                    open={showAccountPicker}
                    handleClose={() => setShowAccountPicker(false)}
                    dropDownDataForCashAccounts={dropDownDataForCashAccounts}
                    onAccountPicked={account => onTextFieldChange(account.id, 'issuerCashAccountID')}
                    value={dirty.issuerCashAccountID}
                />
                <TextField
                    margin="dense"
                    label="Description"
                    type="text"
                    fullWidth
                    value={dirty.description}
                    onChange={e => onTextFieldChange(e.target.value, 'description')}
                />
                <ToggleFlowType type={type} onChange={value => setType(value)}/>
                <TextField
                    margin="dense"
                    label="Note"
                    type="text"
                    fullWidth
                    value={dirty.bankNote}
                    onChange={e => onTextFieldChange(e.target.value, 'bankNote')}
                />
                <TextField
                    margin="dense"
                    label="Date Issued"
                    type="date"
                    fullWidth
                    value={moment(dirty.dateIssued).format('YYYY-MM-DD')}
                    onChange={e => onTextFieldChange(e.target.value, 'dateIssued')}
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
