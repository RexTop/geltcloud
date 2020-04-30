import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {TransferOperationModel, CreateTransferOperationModel} from "../../../models/TransferOperationModel";
import {API, graphqlOperation} from "aws-amplify";
import {createTransferOperation, updateTransferOperation} from "../../../graphql/mutations";
import {CreateTransferOperationInput, UpdateTransferOperationInput} from "../../../API";
import {showAlert} from "../../../utils/ui";
import moment from 'moment';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {CashAccountModel} from "../../../models/CashAccountModel";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import {FormControlLabel, Radio, RadioGroup} from "@material-ui/core";
import {notStonksTextColor, stonksTextColor} from "../../../theme/colors";

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
  item: TransferOperationModel,
  dropDownDataForCashAccounts: CashAccountModel[],
};

export const TransferOperationFormDialog = ({open, handleClose, dropDownDataForCashAccounts, item}: Props) => {

  const [dirty, setDirty] = React.useState(item);

  React.useEffect(() => {
    setDirty(item);
  }, [item]);

  const onTextFieldChange = (value: string, key: keyof TransferOperationModel) => {
    setDirty({...dirty, [key]: value});
  };

  const onNumericFieldChange = (value: number, key: keyof TransferOperationModel) => {
    setDirty({...dirty, [key]: value});
  };

  const isDirty = () => {
    if (item.amount !== dirty.amount) return true;
    if (item.dateIssued !== dirty.dateIssued) return true;
    if (item.description !== dirty.description) return true;
    if (item.acquirerBankNote !== dirty.acquirerBankNote) return true;
    if (item.issuerBankNote !== dirty.issuerBankNote) return true;
    if (item.issuerCashAccountID !== dirty.issuerCashAccountID) return true;
    if (item.acquirerCashAccountID !== dirty.acquirerCashAccountID) return true;
    if (item.dateAcquired !== dirty.dateAcquired) return true;
    if (JSON.stringify(item.tags) !== JSON.stringify(dirty.tags)) return true;
    return false;
  };

  const onSaveClick = async () => {
    console.log("Save", dirty);
    try {
      handleClose();
      if (dirty.id) {
        const input: UpdateTransferOperationInput = {
          id: dirty.id,
          amount: dirty.amount,
          dateIssued: moment(dirty.dateIssued).utc().format(),
          description: dirty.description,
          acquirerBankNote: dirty.acquirerBankNote || '-',
          issuerBankNote: dirty.issuerBankNote || '-',
          issuerCashAccountID: dirty.issuerCashAccountID,
          tags: dirty.tags,
          acquirerCashAccountID: dirty.acquirerCashAccountID,
          dateAcquired: moment(dirty.dateAcquired).utc().format(),
        };
        await API.graphql(graphqlOperation(updateTransferOperation, {input}));
        setDirty(CreateTransferOperationModel());
        showAlert({message: 'Transfer operation updated', severity: 'success'});
      } else {
        const input: CreateTransferOperationInput = {
          amount: dirty.amount,
          dateIssued: moment(dirty.dateIssued).utc().format(),
          description: dirty.description,
          acquirerBankNote: dirty.acquirerBankNote || '-',
          issuerBankNote: dirty.issuerBankNote || '-',
          issuerCashAccountID: dirty.issuerCashAccountID,
          tags: dirty.tags,
          acquirerCashAccountID: dirty.acquirerCashAccountID,
          dateAcquired: moment(dirty.dateAcquired).utc().format(),
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
    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{item.id ? 'Update' : 'Create'} transfer operation</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {item.id ? 'Update' : 'Create'} transfer operation
        </DialogContentText>
        <FormControl className={classes.formControl}>
          <InputLabel id="TransferOperationFromDialog-IssuerCashAccountId-Label">Issuer</InputLabel>
          <Select
            labelId="TransferOperationFromDialog-IssuerCashAccountId-Label"
            value={dirty.issuerCashAccountID}
            onChange={e => onTextFieldChange(e.target.value + '', 'issuerCashAccountID')}
          >
            {dropDownDataForCashAccounts.map(cashAccount => (
              <MenuItem key={`TransferOperationFormDialog-Issuer-${cashAccount.id}`} value={cashAccount.id}>
                {cashAccount.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel id="TransferOperationFromDialog-AcquirerCashAccountId-Label">Acquirer</InputLabel>
          <Select
            labelId="TransferOperationFromDialog-AcquirerCashAccountId-Label"
            value={dirty.acquirerCashAccountID}
            onChange={e => onTextFieldChange(e.target.value + '', 'acquirerCashAccountID')}
          >
            {dropDownDataForCashAccounts.map(cashAccount => (
              <MenuItem key={`TransferOperationFormDialog-Acquirer-${cashAccount.id}`} value={cashAccount.id}>
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
        <RadioGroup row aria-label="position" name="position" defaultValue="top">
          <FormControlLabel
              control={<Radio color="primary" checked={dirty.amount >= 0} onChange={e => setDirty({...dirty, amount: e.target.checked ? Math.abs(dirty.amount) : -Math.abs(dirty.amount)})}/>}
              label={<span style={{color: stonksTextColor}}>
                Income
              </span>}
          />
          <FormControlLabel
              control={<Radio color="primary" checked={dirty.amount < 0} onChange={e => setDirty({...dirty, amount: e.target.checked ? -Math.abs(dirty.amount) : Math.abs(dirty.amount)})}/>}
              label={<span style={{color: notStonksTextColor}}>
                Expense
              </span>}
          />
        </RadioGroup>
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
          {item.id ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
