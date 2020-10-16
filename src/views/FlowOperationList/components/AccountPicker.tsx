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
    open: boolean,
    handleClose: () => void,
    dropDownDataForCashAccounts: CashAccountModel[],
};

const Branch = ({tree, baseKey}: { tree: TreefyObject, baseKey: string }) => {
    if (!Object.keys(tree).length) return null;
    return (
        <>
            {Object.keys(tree).map(key => (
                <TreeItem key={`${baseKey}-${key}`} nodeId={`${baseKey}-${key}`} label={key}>
                    {Object.keys(tree[key]).map(subKey =>
                        <Branch
                            key={`${baseKey}-${key}-${subKey}`}
                            tree={{[subKey]: tree[key][subKey]}}
                            baseKey={`${baseKey}-${key}`}
                        />)}
                </TreeItem>
            ))}
        </>
    );
};

const TreefyExample = ({accountNames}: { accountNames: string[] }) => {
    const classes = useStyles();
    const tree = treefy({stringArray: accountNames, separator: '/'});
    return (
        <TreeView
            className={classes.treeRoot}
            defaultCollapseIcon={<ExpandMoreIcon/>}
            defaultExpandIcon={<ChevronRightIcon/>}
        >
            <Branch tree={tree} baseKey={'account-picker-tree'}/>
        </TreeView>
    );
};

export const AccountPicker = ({open, handleClose, dropDownDataForCashAccounts: accounts}: Props) => {
    const classes = useStyles();

    return (
        <Dialog open={open} onClose={handleClose} TransitionComponent={Transition} className={classes.dialogRoot}>
            <DialogTitle>Account</DialogTitle>
            <DialogContent>
                <TreefyExample accountNames={accounts.map(account => account.name)}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
};
