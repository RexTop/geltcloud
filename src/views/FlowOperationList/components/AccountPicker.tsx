import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {CashAccountModel} from "../../../models/CashAccountModel";
import {Transition} from "../../../components/common/Transition";
import {treefy, TreefyObject} from '../../../lib/Treefy';
import TreeItem from '@material-ui/lab/TreeItem';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import {BranchClickArgs, Tree} from '../../../lib/Tree';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        dialogRoot: {},
        treeRoot: {
            height: 240,
            flexGrow: 1,
            maxWidth: 400,
        },
    }),
);

type Props = {
    open: boolean
    handleClose: () => void
    dropDownDataForCashAccounts: CashAccountModel[]
    onAccountPicked: (account: CashAccountModel) => void
    value: string
};

const AccountPickerTree = ({accountNames, separator, onClick}: { accountNames: string[], separator: string, onClick: (data: BranchClickArgs) => void }) => {
    const classes = useStyles();
    const tree = treefy({stringArray: accountNames, separator});
    return (
        <TreeView
            className={classes.treeRoot}
            defaultCollapseIcon={<ExpandMoreIcon/>}
            defaultExpandIcon={<ChevronRightIcon/>}
        >
            <Tree tree={tree} baseNodeId={'account-picker-tree'} separator={separator} onClick={onClick}/>
        </TreeView>
    );
};

const normalizePathRegex = /(\s*\/\s*)/gm;
const normalizePath = (value: string) => value.replace(normalizePathRegex, '/');

export const AccountPicker = ({open, handleClose, dropDownDataForCashAccounts: accounts, onAccountPicked, value}: Props) => {
    const classes = useStyles();

    return (
        <Dialog open={open} onClose={handleClose} TransitionComponent={Transition} className={classes.dialogRoot}>
            <DialogTitle>Account</DialogTitle>
            <DialogContent>
                <AccountPickerTree accountNames={accounts.map(account => account.name)} separator={'/'}
                                   onClick={data => {
                                       const isLeaf = !data.subBranches.length;
                                       if (isLeaf) {
                                           const account = accounts.find(account => normalizePath(account.name) === data.fullPath);
                                           if (account) {
                                               onAccountPicked(account);
                                           } else {
                                               console.error('Could not find account', {account, data, accounts});
                                           }
                                       }
                                   }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
};
