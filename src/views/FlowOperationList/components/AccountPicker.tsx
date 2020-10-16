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

type BranchClickArgs = {
    subBranches: string[]
    currentBranch: string
    separator: string
    tree: TreefyObject
    baseNodeId: string
    parentBranch: string
    fullPath: string
    nodeId: string
}

type BranchProps = {
    tree: TreefyObject
    baseNodeId: string
    parentBranch: string
    separator: string
    onClick: (data: BranchClickArgs) => void
}

const Branch = ({tree, baseNodeId, parentBranch, separator, onClick}: BranchProps) => {
    if (!Object.keys(tree).length) return null;
    return (
        <>
            {Object.keys(tree).map(currentBranch => {
                const nodeId = `${baseNodeId}${separator}${currentBranch}`;
                const subBranches = Object.keys(tree[currentBranch]);
                const fullPath = (parentBranch ? parentBranch + separator : '') + currentBranch;
                return (
                    <TreeItem key={nodeId} nodeId={nodeId} label={(
                        <div onClick={() => {
                            onClick({
                                subBranches, currentBranch, separator, tree, baseNodeId, parentBranch, fullPath, nodeId,
                            });
                        }}>
                            {currentBranch}
                        </div>
                    )}>
                        {subBranches.map(subBranch =>
                            <Branch
                                key={`${baseNodeId}${separator}${currentBranch}${separator}${subBranch}`}
                                tree={{[subBranch]: tree[currentBranch][subBranch]}}
                                baseNodeId={nodeId}
                                parentBranch={(parentBranch ? parentBranch + separator : '') + currentBranch}
                                separator={separator}
                                onClick={onClick}
                            />)}
                    </TreeItem>
                );
            })}
        </>
    );
};

const TreefyExample = ({accountNames, separator}: { accountNames: string[], separator: string }) => {
    const classes = useStyles();
    const tree = treefy({stringArray: accountNames, separator});
    return (
        <TreeView
            className={classes.treeRoot}
            defaultCollapseIcon={<ExpandMoreIcon/>}
            defaultExpandIcon={<ChevronRightIcon/>}
        >
            <Branch tree={tree} baseNodeId={'account-picker-tree'} parentBranch={''} separator={separator}
                    onClick={data => console.log('%c click', 'background: white; color: black', data)}/>
        </TreeView>
    );
};

export const AccountPicker = ({open, handleClose, dropDownDataForCashAccounts: accounts}: Props) => {
    const classes = useStyles();

    return (
        <Dialog open={open} onClose={handleClose} TransitionComponent={Transition} className={classes.dialogRoot}>
            <DialogTitle>Account</DialogTitle>
            <DialogContent>
                <TreefyExample accountNames={accounts.map(account => account.name)} separator={'/'}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
};
