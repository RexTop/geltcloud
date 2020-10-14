import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import {treefy, TreefyObject} from '../../lib/Treefy';

const useStyles = makeStyles({
    root: {
        height: 240,
        flexGrow: 1,
        maxWidth: 400,
    },
});

const slashSeparatedValues = [
    'Bitso / TUSD',
    'Cash / MXN',
    'Banamex / Credit',
    'Mercado Pago',
    'Cold Wallet / One / LTC 1 (segwit)',
    'Cold Wallet / One / BTC 1 (native segwit)',
    'Bitso / ETH',
    'Santander / Credit',
    'Banamex / Premia / One',
    'Banamex / Premia / Two',
    'Car Cash',
    'Santander / Debit',
    'Bitso / LTC',
    'BBVA / Debit',
    'Bitso / MXN',
    'Bitso / BTC',
    'Cold Wallet / One / ETH 1',
    'Cold Wallet / One / BTC 1 (segwit)',
    'Banamex / Maestra',
    'Cold Wallet / Two / DAI',
    'Cold Wallet / Two / ETH',
    'Cold Wallet / LLC / DAI',
    'Cold Wallet / LLC / ETH',
];

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

export function Playground() {
    const classes = useStyles();
    const tree = treefy({stringArray: slashSeparatedValues, separator: '/'});
    return (
        <TreeView
            className={classes.root}
            defaultCollapseIcon={<ExpandMoreIcon/>}
            defaultExpandIcon={<ChevronRightIcon/>}
        >
            <Branch tree={tree} baseKey={'root-tree'}/>
        </TreeView>
    );
}
