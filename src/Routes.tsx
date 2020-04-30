import React from 'react';
import {Redirect, Switch} from 'react-router-dom';
import RouteWithLayout from './components/RouteWithLayout';
import {Main as MainLayout, Minimal as MinimalLayout} from './layouts';

import {NotFound as NotFoundView,} from './example-views';

import {CashAccountList, FlowOperationList, TransferOperationList, TradeOperationList} from './views';

export const Routes = () => {
    return (
        <Switch>
            <Redirect
                exact
                from="/"
                to="/flow-operations"
            />
            <RouteWithLayout
                component={CashAccountList}
                exact
                layout={MainLayout}
                path="/cash-accounts"
            />
            <RouteWithLayout
                component={FlowOperationList}
                exact
                layout={MainLayout}
                path="/flow-operations"
            />
            <RouteWithLayout
                component={TradeOperationList}
                exact
                layout={MainLayout}
                path="/trade-operations"
            />
            <RouteWithLayout
                component={TransferOperationList}
                exact
                layout={MainLayout}
                path="/transfer-operations"
            />
            <RouteWithLayout
                component={NotFoundView}
                exact
                layout={MinimalLayout}
                path="/not-found"
            />
            <Redirect to="/not-found"/>
        </Switch>
    );
};
