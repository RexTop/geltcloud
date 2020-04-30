import React from 'react';
import {makeStyles} from '@material-ui/styles';
import {Theme} from "@material-ui/core/styles";
import {TradeOperationCard, TradeOperationFormDialog} from './components';
import {FetchLoadingButton} from '../../components/FetchLoadingButton';
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import {CreateTradeOperationModel, TradeOperationModel} from "../../models/TradeOperationModel";
import {API, graphqlOperation} from "aws-amplify";
import {
    onCreateTradeOperation,
    onDeleteTradeOperation,
    onUpdateTradeOperation
} from "../../graphql/subscriptions";
import {currentUsername} from "../../utils/auth-util";
import {
    DeleteTradeOperationInput,
    ListCashAccountsQuery,
    ListCashAccountsQueryVariables,
    ListTradeOperationsQuery,
    ListTradeOperationsQueryVariables,
    ModelTradeOperationFilterInput,
    OnCreateTradeOperationSubscription,
    OnCreateTradeOperationSubscriptionVariables,
    OnDeleteTradeOperationSubscription,
    OnDeleteTradeOperationSubscriptionVariables,
    OnUpdateTradeOperationSubscription,
    OnUpdateTradeOperationSubscriptionVariables,
} from "../../API";
import {listCashAccounts, listTradeOperations} from "../../graphql/queries";
import {GraphQLResult} from "@aws-amplify/api";
import {deleteTradeOperation} from "../../graphql/mutations";
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
    items: TradeOperationModel[]
    dropDownDataForCashAccounts: CashAccountModel[]
    loading: boolean
    open: boolean
    selectedItem: TradeOperationModel
    dateFilter: DateFilter
}

export class TradeOperationList extends React.Component<Props, State> {

    state: State = {
        nextToken: null,
        items: [],
        dropDownDataForCashAccounts: [],
        loading: false,
        open: false,
        selectedItem: CreateTradeOperationModel(),
        dateFilter: todayFilter(),
    };
    private onCreateListener: any;
    private onDeleteListener: any;
    private onUpdateListener: any;

    componentDidMount() {
        this.fetchTradeOperations(this.state.dateFilter, true);
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
                <TradeOperationFormDialog
                    open={open}
                    handleClose={this.handleClose}
                    item={selectedItem}
                    dropDownDataForCashAccounts={dropDownDataForCashAccounts}
                />
                <h1>Trade Operations</h1>
                <DateFiltersWidget onDatesChange={this.onDatesChange} dates={dateFilter}/>
                <ComponentContent>
                    {!loading && !items.length && (
                        <Typography color="textSecondary" gutterBottom variant="body2">No operations</Typography>
                    )}
                    <List component="nav">
                        {items.map(item => (
                            <TradeOperationCard
                                key={`TradeOperationList-${item.id}`}
                                tradeOperation={item}
                                onEditClick={() => this.onEditItemClick(item)}
                                onDeleteClick={() => this.handleDeleteClick(item)}
                            />
                        ))}
                    </List>
                    <FetchLoadingButton
                        loading={loading}
                        disabled={!nextToken}
                        onClick={() => this.fetchTradeOperations(this.state.dateFilter, false)}
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
        this.fetchTradeOperations(dates, true);
    };

    private onEditItemClick = (item: TradeOperationModel) => {
        this.setState({open: true, selectedItem: item});
    };

    private fetchTradeOperations = async (withLocalDateFilter: DateFilter, reset: boolean) => {
        try {
            if (reset) {
                this.setState({loading: true, nextToken: null, items: []});
            } else {
                this.setState({loading: true});
            }

            const filter: ModelTradeOperationFilterInput = {
                dateIssued: {
                    ge: moment(withLocalDateFilter.fromDateLocal).startOf('day').utc().format(),
                    le: moment(withLocalDateFilter.toDateLocal).endOf('day').utc().format(),
                },
            };
            const variables: ListTradeOperationsQueryVariables = {
                filter,
                limit: 50,
                nextToken: reset ? null : this.state.nextToken
            };
            const result = await API.graphql(graphqlOperation(listTradeOperations, variables)) as GraphQLResult<ListTradeOperationsQuery>;
            if (!result.data || !result.data.listTradeOperations) return;
            this.setState({nextToken: result.data.listTradeOperations.nextToken});
            if (reset) {
                this.setState({items: result.data.listTradeOperations.items as any});
            } else {
                this.setState({items: [...this.state.items, ...result.data.listTradeOperations.items as any]});
            }
        } catch (error) {
            console.error("Could not load trade operations", {error});
        } finally {
            this.setState({loading: false});
        }
    };

    private setupListeners = () => {
        const onCreateVariables: OnCreateTradeOperationSubscriptionVariables = {owner: currentUsername()};
        this.onCreateListener = API.graphql(graphqlOperation(onCreateTradeOperation, onCreateVariables)).subscribe({
            next: (data: { value: { data: OnCreateTradeOperationSubscription } }) => {
                const newItem = data.value.data.onCreateTradeOperation;
                if (!newItem) return;
                const prevItems = this.state.items;
                this.setState({items: [...prevItems.filter(item => item.id !== newItem.id), newItem]});
            }
        });

        const onDeleteVariables: OnDeleteTradeOperationSubscriptionVariables = {owner: currentUsername()};
        this.onDeleteListener = API.graphql(graphqlOperation(onDeleteTradeOperation, onDeleteVariables)).subscribe({
            next: (data: { value: { data: OnDeleteTradeOperationSubscription } }) => {
                const deletedItem = data.value.data.onDeleteTradeOperation;
                if (!deletedItem) return;
                const prevItems = this.state.items;
                this.setState({items: prevItems.filter(item => item.id !== deletedItem.id)});
            }
        });

        const onUpdateVariables: OnUpdateTradeOperationSubscriptionVariables = {owner: currentUsername()};
        this.onUpdateListener = API.graphql(graphqlOperation(onUpdateTradeOperation, onUpdateVariables)).subscribe({
            next: (data: { value: { data: OnUpdateTradeOperationSubscription } }) => {
                const updatedItem = data.value.data.onUpdateTradeOperation;
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

    private handleDeleteClick = async (item: TradeOperationModel) => {
        if (!window.confirm(`Delete trade operation?`)) return;
        try {
            const input: DeleteTradeOperationInput = {id: item.id};
            await API.graphql(graphqlOperation(deleteTradeOperation, {input}));
            showAlert({message: 'Cash account deleted', severity: 'success'});
        } catch (error) {
            showAlert({message: 'Can not delete trade operation', severity: 'error'});
            console.error('Error deleting item', {error});
        }
    };

    private handleNewClick = () => {
        this.setState({open: true, selectedItem: CreateTradeOperationModel()});
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
