import React, {forwardRef} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import AppBar from "@material-ui/core/AppBar";
import {LinkProps, NavLink} from "react-router-dom";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';

export const BOTTOM_NAVIGATION_HEIGHT = 56;

const useStyles = makeStyles(theme => ({
    appBar: {
        top: 'auto',
        bottom: 0,
    },
    active: {
        color: theme.palette.primary.main,
    }
}));

const CustomRouterLink = forwardRef((props: LinkProps, ref: React.Ref<HTMLAnchorElement>) => (
    <NavLink innerRef={ref} {...props} />
));

export const MainBottomNavigation = () => {
    const classes = useStyles();
    return (
        <AppBar position="fixed" color="primary" className={classes.appBar}>
            <BottomNavigation showLabels>
                <BottomNavigationAction label="Wallets" icon={ <AccountBalanceWalletIcon/>} {...{to: '/cash-accounts', activeClassName: classes.active}} component={CustomRouterLink}/>
                <BottomNavigationAction label="Transfers" icon={<AutorenewIcon/>} {...{to: '/transfer-operations', activeClassName: classes.active}} component={CustomRouterLink}/>
                <BottomNavigationAction label="Trades" icon={<ShoppingCartIcon/>} {...{to: '/trade-operations', activeClassName: classes.active}} component={CustomRouterLink}/>
                <BottomNavigationAction label="Flows" icon={<ImportExportIcon/>} {...{to: '/flow-operations', activeClassName: classes.active}} component={CustomRouterLink}/>
            </BottomNavigation>
        </AppBar>
    );
};
