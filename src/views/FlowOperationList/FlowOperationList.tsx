import React, {useState} from 'react';
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

export const FlowOperationList = () => {
  const classes = useStyles();

  const [nextToken, setNextToken] = useState(null as string | null);
  const [items, setItems] = useState([] as FlowOperationModel[]);
  const [dropDownDataForCashAccounts, setDropDownDataForCashAccounts] = useState([] as CashAccountModel[]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(CreateFlowOperationModel());
  const [dateFilter, setDateFilter] = useState(todayFilter());

  const onDatesChange = (dates: DateFilter) => {
    setDateFilter(dates);
    fetchFlowOperations(dates, true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onEditItemClick = (item: FlowOperationModel) => {
    setOpen(true);
    setSelectedItem(item);
  };

  const handleDeleteClick = async (item: FlowOperationModel) => {
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

  const handleNewClick = () => {
    setOpen(true);
    setSelectedItem(CreateFlowOperationModel());
  };

  React.useEffect(() => {
    fetchFlowOperations();
    fetchDropdownDataForCashAccounts();

    const onCreateVariables: OnCreateFlowOperationSubscriptionVariables = {owner: currentUsername()};
    const onCreateListener = API.graphql(graphqlOperation(onCreateFlowOperation, onCreateVariables)).subscribe({
      next: (data: { value: { data: OnCreateFlowOperationSubscription } }) => {
        const newItem = data.value.data.onCreateFlowOperation;
        if (!newItem) return;
        setItems(prevItems => {
          return [...prevItems.filter(item => item.id !== newItem.id), newItem];
        });
      }
    });

    const onDeleteVariables: OnDeleteFlowOperationSubscriptionVariables = {owner: currentUsername()};
    const onDeleteListener = API.graphql(graphqlOperation(onDeleteFlowOperation, onDeleteVariables)).subscribe({
      next: (data: { value: { data: OnDeleteFlowOperationSubscription } }) => {
        const deletedItem = data.value.data.onDeleteFlowOperation;
        if (!deletedItem) return;
        setItems(prevItems => prevItems.filter(item => item.id !== deletedItem.id));
      }
    });

    const onUpdateVariables: OnUpdateFlowOperationSubscriptionVariables = {owner: currentUsername()};
    const onUpdateListener = API.graphql(graphqlOperation(onUpdateFlowOperation, onUpdateVariables)).subscribe({
      next: (data: { value: { data: OnUpdateFlowOperationSubscription } }) => {
        const updatedItem = data.value.data.onUpdateFlowOperation;
        if (!updatedItem) return;
        setItems(prevItems => {
          const index = prevItems.findIndex(item => item.id === updatedItem.id);
          if (index !== -1) {
            return [...prevItems.slice(0, index), updatedItem, ...prevItems.slice(index + 1)];
          }
          return prevItems;
        });
      }
    });

    return () => {
      if (onCreateListener) onCreateListener.unsubscribe();
      if (onDeleteListener) onDeleteListener.unsubscribe();
      if (onUpdateListener) onUpdateListener.unsubscribe();
    };
  }, []);

  const fetchFlowOperations = async (withDateFilter?: DateFilter, reset = false) => {
    try {
      setLoading(true);
      if (reset) setNextToken(null);
      if (!withDateFilter) withDateFilter = dateFilter;
      const filter: ModelFlowOperationFilterInput = {
        dateIssued: {
          ge: moment(withDateFilter.fromDateLocal).startOf('day').utc().format(),
          le: moment(withDateFilter.toDateLocal).endOf('day').utc().format(),
        },
      };
      const variables: ListFlowOperationsQueryVariables = {filter, limit: 5, nextToken: reset ? null : nextToken};
      const result = await API.graphql(graphqlOperation(listFlowOperations, variables)) as GraphQLResult<ListFlowOperationsQuery>;
      if (!result.data || !result.data.listFlowOperations) return;
      setNextToken(result.data.listFlowOperations.nextToken);
      if (reset) {
        setItems(result.data.listFlowOperations.items as any);
      } else {
        setItems([...items, ...result.data.listFlowOperations.items as any]);
      }
    } catch (error) {
      console.error("Could not load flow operations", {error});
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownDataForCashAccounts = async () => {
    try {
      const variables: ListCashAccountsQueryVariables = {filter: void 0, limit: 50, nextToken: null};
      const result = await API.graphql(graphqlOperation(listCashAccounts, variables)) as GraphQLResult<ListCashAccountsQuery>;
      if (!result.data || !result.data.listCashAccounts) return;
      setDropDownDataForCashAccounts(result.data.listCashAccounts.items as any);
    } catch (error) {
      console.error("Could not load drop down data for cash accounts", {error});
    }
  };

  return (
    <div className={classes.root}>
      <FlowOperationFormDialog
        open={open}
        handleClose={handleClose}
        item={selectedItem}
        dropDownDataForCashAccounts={dropDownDataForCashAccounts}
      />
      <h1>Flow Operations</h1>
      <DateFiltersWidget onDatesChange={onDatesChange} dates={dateFilter}/>
      <div className={classes.content}>
        {!loading && !items.length && (
          <Typography color="textSecondary" gutterBottom variant="body2">No operations</Typography>
        )}
        <List component="nav">
          {items.map(item => (
            <FlowOperationCard
              key={`FlowOperationList-${item.id}`}
              flowOperation={item}
              onEditClick={() => onEditItemClick(item)}
              onDeleteClick={() => handleDeleteClick(item)}
            />
          ))}
        </List>
        <FetchLoadingButton loading={loading} disabled={!nextToken} onClick={fetchFlowOperations}/>
      </div>
      <Fab aria-label="add" className={classes.fab} color="primary" onClick={handleNewClick}>
        <AddIcon/>
      </Fab>
    </div>
  );
};
