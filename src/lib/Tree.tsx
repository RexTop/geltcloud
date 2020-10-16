import TreeItem from '@material-ui/lab/TreeItem';
import React from 'react';
import {TreefyObject} from './Treefy';

export type BranchClickArgs = {
    subBranches: string[]
    currentBranch: string
    separator: string
    tree: TreefyObject
    baseNodeId: string
    parentBranch: string
    fullPath: string
    nodeId: string
}

type TreeProps = {
    tree: TreefyObject
    baseNodeId: string
    separator: string
    onClick: (data: BranchClickArgs) => void
}

type TreeInternalProps = TreeProps & {
    parentBranch: string
}

const TreeInternal = ({tree, baseNodeId, parentBranch, separator, onClick}: TreeInternalProps) => {
    if (!Object.keys(tree).length) return null;
    return (
        <>
            {Object.keys(tree).map(currentBranch => {
                const nodeId = `${baseNodeId}${separator}${currentBranch}`;
                const subBranches = Object.keys(tree[currentBranch]);
                const fullPath = (parentBranch ? parentBranch + separator : '') + currentBranch;
                return (
                    <TreeItem
                        key={nodeId}
                        nodeId={nodeId}
                        onClick={() => onClick({
                            subBranches,
                            currentBranch,
                            separator,
                            tree,
                            baseNodeId,
                            parentBranch,
                            fullPath,
                            nodeId,
                        })}
                        label={(
                            <>
                                {currentBranch}
                            </>
                        )}>
                        {subBranches.map(subBranch =>
                            <TreeInternal
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

export const Tree = (props: TreeProps) => {
    return <TreeInternal {...props} parentBranch={''}/>;
};
