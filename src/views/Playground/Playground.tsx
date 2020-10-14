import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';

const useStyles = makeStyles({
    root: {
        height: 240,
        flexGrow: 1,
        maxWidth: 400,
    },
});

export function Playground() {
    const classes = useStyles();

    return (
        <TreeView
            className={classes.root}
            defaultCollapseIcon={<ExpandMoreIcon/>}
            defaultExpandIcon={<ChevronRightIcon/>}
        >
            <TreeItem nodeId="1" label="Applications">
                <TreeItem nodeId="2" label="Calendar"/>
                <TreeItem nodeId="3" label="Chrome"/>
                <TreeItem nodeId="4" label="Webstorm"/>
            </TreeItem>
            <TreeItem nodeId="5" label="Documents">
                <TreeItem nodeId="10" label="OSS"/>
                <TreeItem nodeId="6" label="Material-UI">
                    <TreeItem nodeId="7" label="src">
                        <TreeItem nodeId="8" label="index.js"/>
                        <TreeItem nodeId="9" label="tree-view.js"/>
                    </TreeItem>
                </TreeItem>
            </TreeItem>
        </TreeView>
    );
}


(() => {
    var xx = [
        {name: "Bitso / TUSD",},
        {name: "Cash / MXN",},
        {name: "Banamex / Credit",},
        {name: "Mercado Pago",},
        {name: "Cold Wallet / One / LTC 1 (segwit)",},
        {name: "Cold Wallet / One / BTC 1 (native segwit)",},
        {name: "Bitso / ETH",},
        {name: "Santander / Credit",},
        {name: "Banamex / Premia / One",},
        {name: "Banamex / Premia / Two",},
        {name: "Car Cash",},
        {name: "Santander / Debit",},
        {name: "Bitso / LTC",},
        {name: "BBVA / Debit",},
        {name: "Bitso / MXN",},
        {name: "Bitso / BTC",},
        {name: "Cold Wallet / One / ETH 1",},
        {name: "Cold Wallet / One / BTC 1 (segwit)",},
        {name: "Banamex / Maestra",},
        {name: "Cold Wallet / Two / DAI",},
        {name: "Cold Wallet / Two / ETH",},
        {name: "Cold Wallet / LLC / DAI",},
        {name: "Cold Wallet / LLC / ETH",},
    ];
    const treefy = (stringArray, separator, current = {}) => {
        return stringArray.reduce((accumulator, current) => {
            const partsArray = current.split(separator);
            const key = partsArray.shift().trim();
            if(!key) return accumulator;
            const value = partsArray.length ? treefy([partsArray.join(separator)], separator, accumulator[key]) : {};
            accumulator[key] = {...accumulator[key], ...value};
            return accumulator;
        }, current);
    };
    console.log(treefy(xx.map(_ => _.name), '/'));
})();
