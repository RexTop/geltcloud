import React from 'react';
import {makeStyles} from '@material-ui/styles';
import {Theme} from "@material-ui/core/styles";
import {TransferOperationCard, TransferOperationFormDialog} from './components';
import {FetchLoadingButton} from '../../components/FetchLoadingButton';
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import {CreateTransferOperationModel, TransferOperationModel} from "../../models/TransferOperationModel";
import {API, graphqlOperation} from "aws-amplify";
import {
    onCreateTransferOperation,
    onDeleteTransferOperation,
    onUpdateTransferOperation
} from "../../graphql/subscriptions";
import {currentUsername} from "../../utils/auth-util";
import {
    DeleteTransferOperationInput,
    ListCashAccountsQuery,
    ListCashAccountsQueryVariables,
    ListTransferOperationsByOwnerQuery,
    ListTransferOperationsByOwnerQueryVariables,
    ModelSortDirection,
    OnCreateTransferOperationSubscription,
    OnCreateTransferOperationSubscriptionVariables,
    OnDeleteTransferOperationSubscription,
    OnDeleteTransferOperationSubscriptionVariables,
    OnUpdateTransferOperationSubscription,
    OnUpdateTransferOperationSubscriptionVariables,
} from "../../API";
import {listCashAccounts, listTransferOperationsByOwner} from "../../graphql/queries";
import {GraphQLResult} from "@aws-amplify/api";
import {deleteTransferOperation} from "../../graphql/mutations";
import {showAlert} from "../../utils/ui";
import {CashAccountModel} from "../../models/CashAccountModel";
import List from '@material-ui/core/List';
import {DateFiltersWidget} from "../common/DateFiltersWidget";
import {DateFilter, todayFilter} from "../common/DateFiltersWidget/DateFiltersWidget";
import moment from "moment";
import {Typography} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(3)
    },
    content: {
        marginTop: theme.spacing(2)
    },
    fab: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
}));

type Props = {}

type State = {
    nextToken: string | null
    items: TransferOperationModel[]
    dropDownDataForCashAccounts: CashAccountModel[]
    loading: boolean
    open: boolean
    selectedItem: TransferOperationModel
    dateFilter: DateFilter
}

export class TransferOperationList extends React.Component<Props, State> {

    state: State = {
        nextToken: null,
        items: [],
        dropDownDataForCashAccounts: [],
        loading: false,
        open: false,
        selectedItem: CreateTransferOperationModel(),
        dateFilter: todayFilter(),
    };
    private onCreateListener: any;
    private onDeleteListener: any;
    private onUpdateListener: any;

    componentDidMount() {
        this.fetchTransferOperations(this.state.dateFilter, true);
        this.fetchDropdownDataForCashAccounts();
        this.setupListeners();
    }

    componentWillUnmount() {
        if (this.onCreateListener) this.onCreateListener.unsubscribe();
        if (this.onDeleteListener) this.onDeleteListener.unsubscribe();
        if (this.onUpdateListener) this.onUpdateListener.unsubscribe();
    }

    render() {
        const {open, loading, items, dateFilter, dropDownDataForCashAccounts, nextToken, selectedItem} = this.state;

        return (
            <ComponentRoot>
                <TransferOperationFormDialog
                    open={open}
                    handleClose={this.handleClose}
                    item={selectedItem}
                    dropDownDataForCashAccounts={dropDownDataForCashAccounts}
                />
                <h1>Transfer Operations</h1>
                <DateFiltersWidget onDatesChange={this.onDatesChange} dates={dateFilter}/>
                <ComponentContent>
                    {!loading && !items.length && (
                        <Typography color="textSecondary" gutterBottom variant="body2">No operations</Typography>
                    )}
                    <List component="nav">
                        {items.map(item => (
                            <TransferOperationCard
                                key={`TransferOperationList-${item.id}`}
                                transferOperation={item}
                                onEditClick={() => this.onEditItemClick(item)}
                                onDeleteClick={() => this.handleDeleteClick(item)}
                            />
                        ))}
                    </List>
                    <FetchLoadingButton
                        loading={loading}
                        disabled={!nextToken}
                        onClick={() => this.fetchTransferOperations(this.state.dateFilter, false)}
                    />
                </ComponentContent>
                <ComponentFab onClick={this.handleNewClick}>
                    <AddIcon/>
                </ComponentFab>
            </ComponentRoot>
        );
    }

    private handleClose = () => {
        this.setState({open: false});
    };

    private onDatesChange = (dates: DateFilter) => {
        this.setState({dateFilter: dates});
        this.fetchTransferOperations(dates, true);
    };

    private onEditItemClick = (item: TransferOperationModel) => {
        this.setState({open: true, selectedItem: item});
    };

    private fetchTransferOperations = async (withLocalDateFilter: DateFilter, reset: boolean) => {
        try {
            if (reset) {
                this.setState({loading: true, nextToken: null, items: []});
            } else {
                this.setState({loading: true});
            }

            const variables: ListTransferOperationsByOwnerQueryVariables = {
                owner: currentUsername(),
                dateIssued: {
                    between: [
                        moment(withLocalDateFilter.fromDateLocal).startOf('day').utc().format(),
                        moment(withLocalDateFilter.toDateLocal).endOf('day').utc().format(),
                    ],
                },
                sortDirection: ModelSortDirection.DESC,
                limit: 50,
                nextToken: reset ? null : this.state.nextToken,
            };
            const result = await API.graphql(graphqlOperation(listTransferOperationsByOwner, variables)) as GraphQLResult<ListTransferOperationsByOwnerQuery>;
            if (!result.data || !result.data.listTransferOperationsByOwner) return;
            this.setState({nextToken: result.data.listTransferOperationsByOwner.nextToken});
            if (reset) {
                this.setState({items: result.data.listTransferOperationsByOwner.items as any});
            } else {
                this.setState({items: [...this.state.items, ...result.data.listTransferOperationsByOwner.items as any]});
            }
        } catch (error) {
            console.error("Could not load transfer operations", {error});
        } finally {
            this.setState({loading: false});
        }
    };

    private setupListeners = () => {
        const onCreateVariables: OnCreateTransferOperationSubscriptionVariables = {owner: currentUsername()};
        this.onCreateListener = API.graphql(graphqlOperation(onCreateTransferOperation, onCreateVariables)).subscribe({
            next: (data: { value: { data: OnCreateTransferOperationSubscription } }) => {
                const newItem = data.value.data.onCreateTransferOperation;
                if (!newItem) return;
                const prevItems = this.state.items;
                this.setState({items: [...prevItems.filter(item => item.id !== newItem.id), newItem]});
            }
        });

        const onDeleteVariables: OnDeleteTransferOperationSubscriptionVariables = {owner: currentUsername()};
        this.onDeleteListener = API.graphql(graphqlOperation(onDeleteTransferOperation, onDeleteVariables)).subscribe({
            next: (data: { value: { data: OnDeleteTransferOperationSubscription } }) => {
                const deletedItem = data.value.data.onDeleteTransferOperation;
                if (!deletedItem) return;
                const prevItems = this.state.items;
                this.setState({items: prevItems.filter(item => item.id !== deletedItem.id)});
            }
        });

        const onUpdateVariables: OnUpdateTransferOperationSubscriptionVariables = {owner: currentUsername()};
        this.onUpdateListener = API.graphql(graphqlOperation(onUpdateTransferOperation, onUpdateVariables)).subscribe({
            next: (data: { value: { data: OnUpdateTransferOperationSubscription } }) => {
                const updatedItem = data.value.data.onUpdateTransferOperation;
                if (!updatedItem) return;
                const prevItems = this.state.items;
                const index = prevItems.findIndex(item => item.id === updatedItem.id);
                this.setState({items: index !== -1 ? [...prevItems.slice(0, index), updatedItem, ...prevItems.slice(index + 1)] : prevItems})
            }
        });
    };

    private fetchDropdownDataForCashAccounts = async () => {
        try {
            const variables: ListCashAccountsQueryVariables = {filter: void 0, limit: 50, nextToken: null};
            const result = await API.graphql(graphqlOperation(listCashAccounts, variables)) as GraphQLResult<ListCashAccountsQuery>;
            if (!result.data || !result.data.listCashAccounts) return;
            this.setState({dropDownDataForCashAccounts: result.data.listCashAccounts.items as any});
        } catch (error) {
            console.error("Could not load drop down data for cash accounts", {error});
        }
    };

    private handleDeleteClick = async (item: TransferOperationModel) => {
        if (!window.confirm(`Delete transfer operation "${item.description}"?`)) return;
        try {
            const input: DeleteTransferOperationInput = {id: item.id};
            await API.graphql(graphqlOperation(deleteTransferOperation, {input}));
            showAlert({message: 'Cash account deleted', severity: 'success'});
        } catch (error) {
            showAlert({message: 'Can not delete transfer operation', severity: 'error'});
            console.error('Error deleting item', {error});
        }
    };

    private handleNewClick = () => {
        this.setState({open: true, selectedItem: CreateTransferOperationModel()});
    };
}

const ComponentRoot = ({children}: { children: React.ReactNode }) => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            {children}
        </div>
    );
};

const ComponentContent = ({children}: { children: React.ReactNode }) => {
    const classes = useStyles();

    return (
        <div className={classes.content}>
            {children}
        </div>
    );
};

const ComponentFab = ({onClick, children}: { onClick: () => void, children: React.ReactNode }) => {
    const classes = useStyles();

    return (
        <Fab aria-label="add" className={classes.fab} color="primary" onClick={onClick}>
            {children}
        </Fab>
    );
};
