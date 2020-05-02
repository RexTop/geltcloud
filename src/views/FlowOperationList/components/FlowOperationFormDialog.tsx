import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {CreateFlowOperationModel, FlowOperationModel} from "../../../models/FlowOperationModel";
import {API, graphqlOperation} from "aws-amplify";
import {createFlowOperation, updateFlowOperation} from "../../../graphql/mutations";
import {CreateFlowOperationInput, UpdateFlowOperationInput} from "../../../API";
import {showAlert} from "../../../utils/ui";
import moment from 'moment';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {CashAccountModel} from "../../../models/CashAccountModel";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {ToggleFlowType} from "../../../components/ToggleFlowType";

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
    item: FlowOperationModel,
    dropDownDataForCashAccounts: CashAccountModel[],
};

export const FlowOperationFormDialog = ({open, handleClose, dropDownDataForCashAccounts, item}: Props) => {

    const [dirty, setDirty] = React.useState(item);

    React.useEffect(() => {
        setDirty(item);
    }, [item]);

    const onTextFieldChange = (value: string, key: keyof FlowOperationModel) => {
        setDirty({...dirty, [key]: value});
    };

    const onNumericFieldChange = (value: number, key: keyof FlowOperationModel) => {
        setDirty({...dirty, [key]: value});
    };

    const isDirty = () => {
        if (item.amount !== dirty.amount) return true;
        if (item.dateIssued !== dirty.dateIssued) return true;
        if (item.description !== dirty.description) return true;
        if (item.bankNote !== dirty.bankNote) return true;
        if (item.issuerCashAccountID !== dirty.issuerCashAccountID) return true;
        if (JSON.stringify(item.tags) !== JSON.stringify(dirty.tags)) return true;
        return false;
    };

    const onSaveClick = async () => {
        try {
            handleClose();
            if (dirty.id) {
                const input: UpdateFlowOperationInput = {
                    id: dirty.id,
                    amount: dirty.amount,
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
                    amount: dirty.amount,
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
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">{item.id ? 'Update' : 'Create'} flow operation</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {item.id ? 'Update' : 'Create'} flow operation
                </DialogContentText>
                <FormControl className={classes.formControl}>
                    <InputLabel id="FlowOperationFromDialog-IssuerCashAccountId-Label">Account</InputLabel>
                    <Select
                        labelId="FlowOperationFromDialog-IssuerCashAccountId-Label"
                        value={dirty.issuerCashAccountID}
                        onChange={e => onTextFieldChange(e.target.value + '', 'issuerCashAccountID')}
                    >
                        {dropDownDataForCashAccounts.map(cashAccount => (
                            <MenuItem key={`FlowOperationFormDialog-${cashAccount.id}`} value={cashAccount.id}>
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
                    value={dirty.description}
                    onChange={e => onTextFieldChange(e.target.value, 'description')}
                />
                <TextField
                    margin="dense"
                    label="Amount"
                    type="number"
                    fullWidth
                    value={dirty.amount}
                    onChange={e => onNumericFieldChange(+e.target.value, 'amount')}
                />
                <ToggleFlowType amount={dirty.amount} onChange={amount => setDirty({...dirty, amount})}/>
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
                    {item.id ? 'Update' : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
