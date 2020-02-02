import React from 'react';
import {makeStyles} from '@material-ui/styles';
import {Theme} from "@material-ui/core/styles";
import {FlowOperationCard, FlowOperationFormDialog} from './components';
import {FetchLoadingButton} from '../../components/FetchLoadingButton';
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import {FlowOperationModel, CreateFlowOperationModel} from "../../models/FlowOperationModel";
import {API, graphqlOperation} from "aws-amplify";
import {onCreateFlowOperation, onDeleteFlowOperation, onUpdateFlowOperation} from "../../graphql/subscriptions";
import {currentUsername} from "../../utils/auth-util";
import {
  DeleteFlowOperationInput,
  ListCashAccountsQuery,
  ListCashAccountsQueryVariables,
  ListFlowOperationsQuery,
  ListFlowOperationsQueryVariables,
  ModelFlowOperationFilterInput,
  OnCreateFlowOperationSubscription,
  OnCreateFlowOperationSubscriptionVariables,
  OnDeleteFlowOperationSubscription,
  OnDeleteFlowOperationSubscriptionVariables,
  OnUpdateFlowOperationSubscription,
  OnUpdateFlowOperationSubscriptionVariables,
} from "../../API";
import {listCashAccounts, listFlowOperations} from "../../graphql/queries";
import {GraphQLResult} from "@aws-amplify/api";
import {deleteFlowOperation} from "../../graphql/mutations";
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
  items: FlowOperationModel[]
  dropDownDataForCashAccounts: CashAccountModel[]
  loading: boolean
  open: boolean
  selectedItem: FlowOperationModel
  dateFilter: DateFilter
}

export class FlowOperationList extends React.Component<Props, State> {

  state: State = {
    nextToken: null,
    items: [],
    dropDownDataForCashAccounts: [],
    loading: false,
    open: false,
    selectedItem: CreateFlowOperationModel(),
    dateFilter: todayFilter(),
  };

  private handleClose = () => {
    this.setState({open: false});
  };

  private onDatesChange = (dates: DateFilter) => {
    this.setState({dateFilter: dates});
    this.fetchFlowOperations(dates, true);
  };

  private onEditItemClick = (item: FlowOperationModel) => {
    this.setState({open: true, selectedItem: item});
  };

  private fetchFlowOperations = async (withLocalDateFilter: DateFilter, reset: boolean) => {
    try {
      if (reset) {
        this.setState({loading: true, nextToken: null, items: []});
      } else {
        this.setState({loading: true});
      }

      const filter: ModelFlowOperationFilterInput = {
        dateIssued: {
          ge: moment(withLocalDateFilter.fromDateLocal).startOf('day').utc().format(),
          le: moment(withLocalDateFilter.toDateLocal).endOf('day').utc().format(),
        },
      };
      const variables: ListFlowOperationsQueryVariables = {
        filter,
        limit: 50,
        nextToken: reset ? null : this.state.nextToken
      };
      const result = await API.graphql(graphqlOperation(listFlowOperations, variables)) as GraphQLResult<ListFlowOperationsQuery>;
      if (!result.data || !result.data.listFlowOperations) return;
      this.setState({nextToken: result.data.listFlowOperations.nextToken});
      if (reset) {
        this.setState({items: result.data.listFlowOperations.items as any});
      } else {
        this.setState({items: [...this.state.items, ...result.data.listFlowOperations.items as any]});
      }
    } catch (error) {
      console.error("Could not load flow operations", {error});
    } finally {
      this.setState({loading: false});
    }
  };

  componentDidMount() {
    this.fetchFlowOperations(this.state.dateFilter, true);
    this.fetchDropdownDataForCashAccounts();
    this.setupListeners();
  }

  private setupListeners = () => {
    const onCreateVariables: OnCreateFlowOperationSubscriptionVariables = {owner: currentUsername()};
    this.onCreateListener = API.graphql(graphqlOperation(onCreateFlowOperation, onCreateVariables)).subscribe({
      next: (data: { value: { data: OnCreateFlowOperationSubscription } }) => {
        const newItem = data.value.data.onCreateFlowOperation;
        if (!newItem) return;
        const prevItems = this.state.items;
        this.setState({items: [...prevItems.filter(item => item.id !== newItem.id), newItem]});
      }
    });

    const onDeleteVariables: OnDeleteFlowOperationSubscriptionVariables = {owner: currentUsername()};
    this.onDeleteListener = API.graphql(graphqlOperation(onDeleteFlowOperation, onDeleteVariables)).subscribe({
      next: (data: { value: { data: OnDeleteFlowOperationSubscription } }) => {
        const deletedItem = data.value.data.onDeleteFlowOperation;
        if (!deletedItem) return;
        const prevItems = this.state.items;
        this.setState({items: prevItems.filter(item => item.id !== deletedItem.id)});
      }
    });

    const onUpdateVariables: OnUpdateFlowOperationSubscriptionVariables = {owner: currentUsername()};
    this.onUpdateListener = API.graphql(graphqlOperation(onUpdateFlowOperation, onUpdateVariables)).subscribe({
      next: (data: { value: { data: OnUpdateFlowOperationSubscription } }) => {
        const updatedItem = data.value.data.onUpdateFlowOperation;
        if (!updatedItem) return;
        const prevItems = this.state.items;
        const index = prevItems.findIndex(item => item.id === updatedItem.id);
        this.setState({items: index !== -1 ? [...prevItems.slice(0, index), updatedItem, ...prevItems.slice(index + 1)] : prevItems})
      }
    });
  };

  componentWillUnmount() {
    if (this.onCreateListener) this.onCreateListener.unsubscribe();
    if (this.onDeleteListener) this.onDeleteListener.unsubscribe();
    if (this.onUpdateListener) this.onUpdateListener.unsubscribe();
  }

  private onCreateListener: any;
  private onDeleteListener: any;
  private onUpdateListener: any;

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

  private handleDeleteClick = async (item: FlowOperationModel) => {
    if (!window.confirm(`Delete flow operation "${item.description}"?`)) return;
    try {
      const input: DeleteFlowOperationInput = {id: item.id};
      await API.graphql(graphqlOperation(deleteFlowOperation, {input}));
      showAlert({message: 'Cash account deleted', severity: 'success'});
    } catch (error) {
      showAlert({message: 'Can not delete flow operation', severity: 'error'});
      console.error('Error deleting item', {error});
    }
  };

  private handleNewClick = () => {
    this.setState({open: true, selectedItem: CreateFlowOperationModel()});
  };

  render() {
    const {open, loading, items, dateFilter, dropDownDataForCashAccounts, nextToken, selectedItem} = this.state;

    return (
      <ComponentRoot>
        <FlowOperationFormDialog
          open={open}
          handleClose={this.handleClose}
          item={selectedItem}
          dropDownDataForCashAccounts={dropDownDataForCashAccounts}
        />
        <h1>Flow Operations</h1>
        <DateFiltersWidget onDatesChange={this.onDatesChange} dates={dateFilter}/>
        <ComponentContent>
          {!loading && !items.length && (
            <Typography color="textSecondary" gutterBottom variant="body2">No operations</Typography>
          )}
          <List component="nav">
            {items.map(item => (
              <FlowOperationCard
                key={`FlowOperationList-${item.id}`}
                flowOperation={item}
                onEditClick={() => this.onEditItemClick(item)}
                onDeleteClick={() => this.handleDeleteClick(item)}
              />
            ))}
          </List>
          <FetchLoadingButton
            loading={loading}
            disabled={!nextToken}
            onClick={() => this.fetchFlowOperations(this.state.dateFilter, false)}
          />
        </ComponentContent>
        <ComponentFab onClick={this.handleNewClick}>
          <AddIcon/>
        </ComponentFab>
      </ComponentRoot>
    );
  }
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
