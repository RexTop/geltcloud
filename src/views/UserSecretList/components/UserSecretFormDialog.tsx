import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {CreateUserSecretModel, UserSecretModel} from "../../../models/UserSecretModel";
import {API, graphqlOperation} from "aws-amplify";
import {createUserSecret, updateUserSecret} from "../../../graphql/mutations";
import {CreateUserSecretInput, UpdateUserSecretInput} from "../../../API";
import {showAlert} from "../../../utils/ui";
import {CashAccountModel} from "../../../models/CashAccountModel";
import {Transition} from "../../../components/common/Transition";
import {decrypt, encrypt} from "../../../utils/crypto-util";

type Props = {
    open: boolean,
    handleClose: () => void,
    model: UserSecretModel,
    dropDownDataForCashAccounts: CashAccountModel[],
};

export const UserSecretFormDialog = ({open, handleClose, dropDownDataForCashAccounts, model}: Props) => {

    const [dirty, setDirty] = React.useState(model);

    React.useEffect(() => {
        setDirty(model);
    }, [model]);

    const onTextFieldChange = (value: string, key: keyof UserSecretModel) => {
        setDirty({...dirty, [key]: value});
    };

    const onDecryptedTextFieldChange = (decryptedValue: string, key: keyof UserSecretModel) => {
        setDirty({...dirty, [key]: encrypt(decryptedValue)});
    };

    const isDirty = () => {
        if (model.key !== dirty.key) return true;
        if (model.value !== dirty.value) return true;
        return false;
    };

    const onSaveClick = async () => {
        try {
            handleClose();
            if (dirty.id) {
                const input: UpdateUserSecretInput = {
                    id: dirty.id,
                    key: dirty.key,
                    value: dirty.value,
                };
                await API.graphql(graphqlOperation(updateUserSecret, {input}));
                setDirty(CreateUserSecretModel());
                showAlert({message: 'Secret updated', severity: 'success'});
            } else {
                const input: CreateUserSecretInput = {
                    key: dirty.key,
                    value: dirty.value,
                };
                await API.graphql(graphqlOperation(createUserSecret, {input}));
                setDirty(CreateUserSecretModel());
                showAlert({message: 'Secret created', severity: 'success'});
            }
        } catch (error) {
            showAlert({message: 'Can not create user secret', severity: 'error'});
            console.error('Error adding item', {error});
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title"
                TransitionComponent={Transition}>
            <DialogTitle id="form-dialog-title">{model.id ? 'Update' : 'New'} user secret</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    fullWidth
                    label="Key"
                    type="text"
                    value={dirty.key}
                    onChange={e => onTextFieldChange(e.target.value, 'key')}
                />
                <TextField
                    margin="dense"
                    fullWidth
                    label="Value"
                    type="text"
                    value={decrypt(dirty.value || '')}
                    onChange={e => onDecryptedTextFieldChange(e.target.value, 'value')}
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
