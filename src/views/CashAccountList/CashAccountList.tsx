import React, {useState} from 'react';
import {makeStyles} from '@material-ui/styles';
import {Grid, Typography} from '@material-ui/core';
import {Theme} from "@material-ui/core/styles";
import {CashAccountCard, CashAccountFormDialog} from './components';
import {FetchLoadingButton} from '../../components/FetchLoadingButton';
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import {CashAccountModel, CreateCashAccountModel} from "../../models/CashAccountModel";
import {API, graphqlOperation} from "aws-amplify";
import {onCreateCashAccount, onDeleteCashAccount, onUpdateCashAccount} from "../../graphql/subscriptions";
import {currentUsername} from "../../utils/auth-util";
import {
    DeleteCashAccountInput,
    ListCashAccountsQuery,
    ModelCashAccountFilterInput,
    OnCreateCashAccountSubscription,
    OnCreateCashAccountSubscriptionVariables,
    OnDeleteCashAccountSubscription,
    OnDeleteCashAccountSubscriptionVariables,
    OnUpdateCashAccountSubscription,
    OnUpdateCashAccountSubscriptionVariables,
} from "../../API";
import {listCashAccounts} from "../../graphql/queries";
import {GraphQLResult} from "@aws-amplify/api";
import {deleteCashAccount} from "../../graphql/mutations";
import {showAlert} from "../../utils/ui";

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

export const CashAccountList = () => {
    const classes = useStyles();

    const [nextToken, setNextToken] = useState(null as string | null);
    const [items, setItems] = useState([] as CashAccountModel[]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(CreateCashAccountModel());

    const handleClose = () => {
        setOpen(false);
    };

    const onEditItemClick = (item: CashAccountModel) => {
        setOpen(true);
        setSelectedItem(item);
    };

    const handleDeleteClick = async (item: CashAccountModel) => {
        if (!window.confirm(`Delete cash account "${item.name}"?`)) return;
        try {
            const input: DeleteCashAccountInput = {id: item.id};
            await API.graphql(graphqlOperation(deleteCashAccount, {input}));
            showAlert({message: 'Cash account deleted', severity: 'success'});
        } catch (error) {
            showAlert({message: 'Can not delete cash account', severity: 'error'});
            console.error('Error deleting item', {error});
        }
    };

    const handleNewClick = () => {
        setOpen(true);
        setSelectedItem(CreateCashAccountModel());
    };

    React.useEffect(() => {
        fetchCashAccounts();

        const onCreateVariables: OnCreateCashAccountSubscriptionVariables = {owner: currentUsername()};
        const onCreateListener = API.graphql(graphqlOperation(onCreateCashAccount, onCreateVariables)).subscribe({
            next: (data: { value: { data: OnCreateCashAccountSubscription } }) => {
                const newItem = data.value.data.onCreateCashAccount;
                if (!newItem) return;
                setItems(prevItems => {
                    return [...prevItems.filter(item => item.id !== newItem.id), newItem];
                });
            }
        });

        const onDeleteVariables: OnDeleteCashAccountSubscriptionVariables = {owner: currentUsername()};
        const onDeleteListener = API.graphql(graphqlOperation(onDeleteCashAccount, onDeleteVariables)).subscribe({
            next: (data: { value: { data: OnDeleteCashAccountSubscription } }) => {
                const deletedItem = data.value.data.onDeleteCashAccount;
                if (!deletedItem) return;
                setItems(prevItems => prevItems.filter(item => item.id !== deletedItem.id));
            }
        });

        const onUpdateVariables: OnUpdateCashAccountSubscriptionVariables = {owner: currentUsername()};
        const onUpdateListener = API.graphql(graphqlOperation(onUpdateCashAccount, onUpdateVariables)).subscribe({
            next: (data: { value: { data: OnUpdateCashAccountSubscription } }) => {
                const updatedItem = data.value.data.onUpdateCashAccount;
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

    const fetchCashAccounts = async () => {
        try {
            setLoading(true);
            const filter: ModelCashAccountFilterInput | undefined = void 0;
            const input = {filter, limit: 50, nextToken: nextToken};
            const result = await API.graphql(graphqlOperation(listCashAccounts, input)) as GraphQLResult<ListCashAccountsQuery>;
            if (!result.data || !result.data.listCashAccounts) return;
            setNextToken(result.data.listCashAccounts.nextToken);
            setItems([...items, ...result.data.listCashAccounts.items as any]);
        } catch (error) {
            console.error("Could not load cash accounts", {error});
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={classes.root}>
            <CashAccountFormDialog open={open} handleClose={handleClose} item={selectedItem}/>
            <h1>Cash Accounts</h1>
            {!loading && !items.length && (
                <Typography color="textSecondary" gutterBottom variant="body2">No cash accounts</Typography>
            )}
            <div className={classes.content}>
                <Grid
                    container
                    spacing={3}
                >
                    {items.map(item => (
                        <Grid item key={`CashAccountList-${item.id}`} lg={4} md={6} xs={12}>
                            <CashAccountCard
                                cashAccount={item}
                                onEditClick={() => onEditItemClick(item)}
                                onDeleteClick={() => handleDeleteClick(item)}
                            />
                        </Grid>
                    ))}
                </Grid>
                <FetchLoadingButton loading={loading} disabled={!nextToken} onClick={fetchCashAccounts}/>
            </div>
            <Fab aria-label="add" className={classes.fab} color="primary" onClick={handleNewClick}>
                <AddIcon/>
            </Fab>
        </div>
    );
};
