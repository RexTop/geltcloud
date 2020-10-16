import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {CashAccountModel} from "../../../models/CashAccountModel";
import {Transition} from "../../../components/common/Transition";
import {treefy} from '../../../lib/Treefy';
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
    title: string
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

/*
TODO: Extend tree by default to show currently selected item.
TODO: Highlight currently selected item in tree.
TODO: Add custom styles to tree.
TODO: Min width to account picker modal.
TODO: Animations to account picker modal and trees (see animations of https://material-ui.com/components/tree-view/#customized-tree-view).
TODO: Make tree branches wider to ease usage in mobile devices.
TODO: Search functionality to easily find items in tree.
TODO: Fee currency input in "Update transfer operation" should use a mask. (Find other currency inputs and update them).
TODO: New design to display "from account" and "to account" in list of transfers and flows.
TODO: Apply new design to forms (see Adobe XD mockups).
TODO: Handle when an account matches the partial route of another. e.g. 'Cash` and `Cash / Car`.
TODO: New interface to manage accounts in a folder-like view. Remember to trim spaces.
 */
const normalizePathRegex = /(\s*\/\s*)/gm;
const normalizePath = (value: string) => value.replace(normalizePathRegex, '/');

export const AccountPicker = ({open, handleClose, dropDownDataForCashAccounts: accounts, onAccountPicked, value, title}: Props) => {
    const classes = useStyles();

    return (
        <Dialog open={open} onClose={handleClose} TransitionComponent={Transition} className={classes.dialogRoot}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <AccountPickerTree
                    accountNames={accounts.map(account => account.name)} separator={'/'}
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
