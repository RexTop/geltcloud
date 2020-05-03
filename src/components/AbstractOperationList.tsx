import React from 'react';
import {makeStyles} from '@material-ui/styles';
import {Theme} from "@material-ui/core/styles";
import {FetchLoadingButton} from './FetchLoadingButton';
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import {API, graphqlOperation} from "aws-amplify";
import {currentUsername} from "../utils/auth-util";
import {ListCashAccountsQuery, ListCashAccountsQueryVariables, ModelSortDirection,} from "../API";
import {listCashAccounts} from "../graphql/queries";
import {GraphQLResult} from "@aws-amplify/api";
import {showAlert} from "../utils/ui";
import {CashAccountModel} from "../models/CashAccountModel";
import List from '@material-ui/core/List';
import {DateFiltersWidget} from "../views/common/DateFiltersWidget";
import {DateFilter, todayFilter} from "../views/common/DateFiltersWidget/DateFiltersWidget";
import moment from "moment";
import {Typography} from "@material-ui/core";

const MAX_ITEMS_PER_PAGE = 3;
const MAX_CASH_ACCOUNTS_IN_DROPDOWN = 100;

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

type State<TModel extends { id: string }> = {
    nextToken: string | null
    items: TModel[]
    dropDownDataForCashAccounts: CashAccountModel[]
    loading: boolean
    open: boolean
    selectedItem: TModel
    dateFilter: DateFilter
}

type CreateOperationListComponentParams<TModel extends { id: string }, TListQueryResult, TOnCreateSubscription, TOnUpdateSubscription, TOnDeleteSubscription> = {
    modelName: string,
    createNewModel: () => TModel

    title: string
    confirmDeleteMessage: string
    deleteSuccessMessage: string
    deleteFailureMessage: string
    emptyListMessage: string

    OperationCard: React.ComponentType<{ model: TModel, onEditClick: () => void, onDeleteClick: () => void }>
    OperationFormDialog: React.ComponentType<{ open: boolean, handleClose: () => void, model: TModel, dropDownDataForCashAccounts: CashAccountModel[] }>

    listByOwner_QueryString: string
    onCreate_SubscriptionString: string
    onDelete_SubscriptionString: string
    onUpdate_SubscriptionString: string
    delete_MutationString: string

    getListPayload: (result?: TListQueryResult) => { items: Array<TModel | null> | null, nextToken: string | null } | null
    getOnCreateSubscriptionPayload: (result: TOnCreateSubscription) => TModel | null
    getOnUpdateSubscriptionPayload: (result: TOnUpdateSubscription) => TModel | null
    getOnDeleteSubscriptionPayload: (result: TOnDeleteSubscription) => TModel | null
}

export const createOperationListComponent = <TModel extends { id: string }, TListQueryResult, TOnCreateSubscription, TOnUpdateSubscription, TOnDeleteSubscription>(
    {
        createNewModel,
        OperationFormDialog,
        title,
        OperationCard,
        listByOwner_QueryString,
        onCreate_SubscriptionString,
        onDelete_SubscriptionString,
        onUpdate_SubscriptionString,
        delete_MutationString,
        confirmDeleteMessage,
        deleteSuccessMessage,
        deleteFailureMessage,
        emptyListMessage,
        getListPayload,
        modelName,
        getOnCreateSubscriptionPayload,
        getOnUpdateSubscriptionPayload,
        getOnDeleteSubscriptionPayload,
    }: CreateOperationListComponentParams<TModel, TListQueryResult, TOnCreateSubscription, TOnUpdateSubscription, TOnDeleteSubscription>) => {
    class AbstractOperationList extends React.Component<Props, State<TModel>> {

        state: State<TModel> = {
            nextToken: null,
            items: [],
            dropDownDataForCashAccounts: [],
            loading: false,
            open: false,
            selectedItem: createNewModel(),
            dateFilter: todayFilter(),
        };

        private onCreateListener: any;
        private onDeleteListener: any;
        private onUpdateListener: any;

        componentDidMount() {
            // TODO: Possible usage of `setState` in these function calls.
            this.fetchOperations(this.state.dateFilter, true);
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
                    <OperationFormDialog
                        open={open}
                        handleClose={this.handleClose}
                        model={selectedItem}
                        dropDownDataForCashAccounts={dropDownDataForCashAccounts}
                    />
                    <h1>{title}</h1>
                    <DateFiltersWidget onDatesChange={this.onDatesChange} dates={dateFilter}/>
                    <ComponentContent>
                        {!loading && !items.length && (
                            <Typography color="textSecondary" gutterBottom
                                        variant="body2">{emptyListMessage}</Typography>
                        )}
                        <List component="nav">
                            {items.map(item => (
                                <OperationCard
                                    key={`OperationList-${modelName}-${item.id}`}
                                    model={item}
                                    onEditClick={() => this.onEditItemClick(item)}
                                    onDeleteClick={() => this.handleDeleteClick(item)}
                                />
                            ))}
                        </List>
                        <FetchLoadingButton
                            loading={loading}
                            disabled={!nextToken}
                            onClick={() => this.fetchOperations(this.state.dateFilter, false)}
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
            this.fetchOperations(dates, true);
        };

        private onEditItemClick = (item: TModel) => {
            this.setState({open: true, selectedItem: item});
        };

        private fetchOperations = async (withLocalDateFilter: DateFilter, reset: boolean) => {
            try {
                if (reset) {
                    this.setState({loading: true, nextToken: null, items: []});
                } else {
                    this.setState({loading: true});
                }

                // TODO: Strongly type the original value: ListFlowOperationsByOwnerQueryVariables
                const variables: any = {
                    owner: currentUsername(),
                    dateIssued: {
                        between: [
                            moment(withLocalDateFilter.fromDateLocal).startOf('day').utc().format(),
                            moment(withLocalDateFilter.toDateLocal).endOf('day').utc().format(),
                        ],
                    },
                    sortDirection: ModelSortDirection.DESC,
                    limit: MAX_ITEMS_PER_PAGE,
                    nextToken: reset ? null : this.state.nextToken,
                };

                const result = await API.graphql(graphqlOperation(listByOwner_QueryString, variables)) as GraphQLResult<TListQueryResult>;
                if (!result.data) return;
                const payload = getListPayload(result.data);
                if (!payload) return;
                this.setState({nextToken: payload.nextToken});
                if (reset) {
                    // Using 'any' is ok here because the actual payload e.g.
                    // 'the ListFlowOperationsByOwnerQuery.listFlowOperationsByOwner.items array' which is autogenerated
                    // contains extra fields which are not actually present in our model representation of the entity.
                    this.setState({items: payload.items as any});
                } else {
                    this.setState({items: [...this.state.items, ...payload.items as any]});
                }
            } catch (error) {
                console.error(`Could not load '${modelName}' items.`, {error});
            } finally {
                this.setState({loading: false});
            }
        };

        private setupListeners = () => {
            // Originally the type was 'OnCreateXSubscriptionVariables'. It's not worth making it generic as it always has the same shape.
            const onCreateVariables = {owner: currentUsername()};
            this.onCreateListener = API.graphql(graphqlOperation(onCreate_SubscriptionString, onCreateVariables)).subscribe({
                next: (data: { value: { data: TOnCreateSubscription } }) => {
                    const newItem = getOnCreateSubscriptionPayload(data.value.data);
                    if (!newItem) return;
                    const prevItems = this.state.items;
                    this.setState({items: [...prevItems.filter(item => item.id !== newItem.id), newItem]});
                }
            });

            // Originally the type was 'OnDeleteXSubscriptionVariables'. It's not worth making it generic as it always has the same shape.
            const onDeleteVariables = {owner: currentUsername()};
            this.onDeleteListener = API.graphql(graphqlOperation(onDelete_SubscriptionString, onDeleteVariables)).subscribe({
                next: (data: { value: { data: TOnDeleteSubscription } }) => {
                    const deletedItem = getOnDeleteSubscriptionPayload(data.value.data);
                    if (!deletedItem) return;
                    const prevItems = this.state.items;
                    this.setState({items: prevItems.filter(item => item.id !== deletedItem.id)});
                }
            });

            // Originally the type was 'OnUpdateXSubscriptionVariables'. It's not worth making it generic as it always has the same shape.
            const onUpdateVariables = {owner: currentUsername()};
            this.onUpdateListener = API.graphql(graphqlOperation(onUpdate_SubscriptionString, onUpdateVariables)).subscribe({
                next: (data: { value: { data: TOnUpdateSubscription } }) => {
                    const updatedItem = getOnUpdateSubscriptionPayload(data.value.data);
                    if (!updatedItem) return;
                    const prevItems = this.state.items;
                    const index = prevItems.findIndex(item => item.id === updatedItem.id);
                    // TODO: Once I managed to have a duplicated element in the UI once I updated it. I think the bug is over here.
                    this.setState({items: index !== -1 ? [...prevItems.slice(0, index), updatedItem, ...prevItems.slice(index + 1)] : prevItems})
                }
            });
        };

        private fetchDropdownDataForCashAccounts = async () => {
            try {
                const variables: ListCashAccountsQueryVariables = {
                    filter: void 0,
                    limit: MAX_CASH_ACCOUNTS_IN_DROPDOWN,
                    nextToken: null
                };
                const result = await API.graphql(graphqlOperation(listCashAccounts, variables)) as GraphQLResult<ListCashAccountsQuery>;
                if (!result.data || !result.data.listCashAccounts) return;
                this.setState({dropDownDataForCashAccounts: result.data.listCashAccounts.items as any});
            } catch (error) {
                console.error("Could not load drop down data for cash accounts", {error});
            }
        };

        private handleDeleteClick = async (item: TModel) => {
            if (!window.confirm(confirmDeleteMessage)) return;
            try {
                const input = {id: item.id}; // The original type of this operation is DeleteXInput where X is the model type name. It's not worth making it a generic type, it has always the same shape.
                await API.graphql(graphqlOperation(delete_MutationString, {input}));
                showAlert({message: deleteSuccessMessage, severity: 'success'});
            } catch (error) {
                showAlert({message: deleteFailureMessage, severity: 'error'});
                console.error('Error deleting item', {error});
            }
        };

        private handleNewClick = () => {
            this.setState({open: true, selectedItem: createNewModel()});
        };
    }

    // TODO: Try setting this with a static getter inside the class to avoid the use of 'any'.
    (AbstractOperationList as any).displayName = `WithSubscription(${modelName})`;
    return AbstractOperationList;
};

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
