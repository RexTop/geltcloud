import React, {useState} from 'react';
import {makeStyles} from '@material-ui/styles';
import {Theme} from "@material-ui/core/styles";
import {TransferOperationCard, TransferOperationFormDialog} from './components';
import {FetchLoadingButton} from '../../components/FetchLoadingButton';
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import {TransferOperationModel, CreateTransferOperationModel} from "../../models/TransferOperationModel";
import {API, graphqlOperation} from "aws-amplify";
import {
  onCreateTransferOperation,
  onDeleteTransferOperation,
  onUpdateTransferOperation,
} from "../../graphql/subscriptions";
import {currentUsername} from "../../utils/auth-util";
import {
  DeleteTransferOperationInput,
  ListCashAccountsQuery,
  ListCashAccountsQueryVariables,
  ListTransferOperationsQuery,
  ListTransferOperationsQueryVariables,
  ModelTransferOperationFilterInput,
  OnCreateTransferOperationSubscription,
  OnCreateTransferOperationSubscriptionVariables,
  OnDeleteTransferOperationSubscription,
  OnDeleteTransferOperationSubscriptionVariables,
  OnUpdateTransferOperationSubscription,
  OnUpdateTransferOperationSubscriptionVariables,
} from "../../API";
import {listCashAccounts, listTransferOperations} from "../../graphql/queries";
import {GraphQLResult} from "@aws-amplify/api";
import {deleteTransferOperation} from "../../graphql/mutations";
import {showAlert} from "../../utils/ui";
import {CashAccountModel} from "../../models/CashAccountModel";
import List from '@material-ui/core/List';
import {DateFiltersWidget} from "../common/DateFiltersWidget";
import {DateFilter, todayFilter} from "../common/DateFiltersWidget/DateFiltersWidget";
import moment from "moment";

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

export const TransferOperationList = () => {
  const classes = useStyles();

  const [nextToken, setNextToken] = useState(null as string | null);
  const [items, setItems] = useState([] as TransferOperationModel[]);
  const [dropDownDataForCashAccounts, setDropDownDataForCashAccounts] = useState([] as CashAccountModel[]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(CreateTransferOperationModel());
  const [dateFilter, setDateFilter] = useState(todayFilter());

  const onDatesChange = (dates: DateFilter) => {
    setDateFilter(dates);
    fetchTransferOperations(dates, true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onEditItemClick = (item: TransferOperationModel) => {
    setOpen(true);
    setSelectedItem(item);
  };

  const handleDeleteClick = async (item: TransferOperationModel) => {
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

  const handleNewClick = () => {
    setOpen(true);
    setSelectedItem(CreateTransferOperationModel());
  };

  React.useEffect(() => {
    fetchTransferOperations();
    fetchDropdownDataForCashAccounts();

    const onCreateVariables: OnCreateTransferOperationSubscriptionVariables = {owner: currentUsername()};
    const onCreateListener = API.graphql(graphqlOperation(onCreateTransferOperation, onCreateVariables)).subscribe({
      next: (data: { value: { data: OnCreateTransferOperationSubscription } }) => {
        const newItem = data.value.data.onCreateTransferOperation;
        if (!newItem) return;
        setItems(prevItems => {
          return [...prevItems.filter(item => item.id !== newItem.id), newItem];
        });
      }
    });

    const onDeleteVariables: OnDeleteTransferOperationSubscriptionVariables = {owner: currentUsername()};
    const onDeleteListener = API.graphql(graphqlOperation(onDeleteTransferOperation, onDeleteVariables)).subscribe({
      next: (data: { value: { data: OnDeleteTransferOperationSubscription } }) => {
        const deletedItem = data.value.data.onDeleteTransferOperation;
        if (!deletedItem) return;
        setItems(prevItems => prevItems.filter(item => item.id !== deletedItem.id));
      }
    });

    const onUpdateVariables: OnUpdateTransferOperationSubscriptionVariables = {owner: currentUsername()};
    const onUpdateListener = API.graphql(graphqlOperation(onUpdateTransferOperation, onUpdateVariables)).subscribe({
      next: (data: { value: { data: OnUpdateTransferOperationSubscription } }) => {
        const updatedItem = data.value.data.onUpdateTransferOperation;
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

  const fetchTransferOperations = async (withDateFilter?: DateFilter, reset = false) => {
    try {
      setLoading(true);
      if (reset) setNextToken(null);
      if (!withDateFilter) withDateFilter = dateFilter;
      const filter: ModelTransferOperationFilterInput = {
        dateIssued: {
          ge: moment(withDateFilter.fromDateLocal).startOf('day').utc().format(),
          le: moment(withDateFilter.toDateLocal).endOf('day').utc().format(),
        },
      };
      const variables: ListTransferOperationsQueryVariables = {filter, limit: 5, nextToken: reset ? null : nextToken};
      const result = await API.graphql(graphqlOperation(listTransferOperations, variables)) as GraphQLResult<ListTransferOperationsQuery>;
      if (!result.data || !result.data.listTransferOperations) return;
      setNextToken(result.data.listTransferOperations.nextToken);
      if (reset) {
        setItems(result.data.listTransferOperations.items as any);
      } else {
        setItems([...items, ...result.data.listTransferOperations.items as any]);
      }
    } catch (error) {
      console.error("Could not load transfer operations", {error});
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
      <TransferOperationFormDialog
        open={open}
        handleClose={handleClose}
        item={selectedItem}
        dropDownDataForCashAccounts={dropDownDataForCashAccounts}
      />
      <h1>Transfer Operations</h1>
      <DateFiltersWidget onDatesChange={onDatesChange} dates={dateFilter}/>
      <div className={classes.content}>
        <List component="nav">
          {items.map(item => (
            <TransferOperationCard
              key={`TransferOperationList-${item.id}`}
              transferOperation={item}
              onEditClick={() => onEditItemClick(item)}
              onDeleteClick={() => handleDeleteClick(item)}
            />
          ))}
        </List>
        <FetchLoadingButton loading={loading} disabled={!nextToken} onClick={fetchTransferOperations}/>
      </div>
      <Fab aria-label="add" className={classes.fab} color="primary" onClick={handleNewClick}>
        <AddIcon/>
      </Fab>
    </div>
  );
};
