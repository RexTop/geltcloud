import {TradeOperationCard, TradeOperationFormDialog} from './components';
import {CreateTradeOperationModel, TradeOperationModel} from "../../models/TradeOperationModel";
import {onCreateTradeOperation, onDeleteTradeOperation, onUpdateTradeOperation} from "../../graphql/subscriptions";
import {
    ListTradeOperationsByOwnerQuery,
    OnCreateTradeOperationSubscription,
    OnDeleteTradeOperationSubscription,
    OnUpdateTradeOperationSubscription,
} from "../../API";
import {listTradeOperationsByOwner} from "../../graphql/queries";
import {deleteTradeOperation} from "../../graphql/mutations";
import {createOperationListComponent} from "../../components/AbstractOperationList";

export const TradeOperationList = createOperationListComponent<TradeOperationModel, ListTradeOperationsByOwnerQuery, OnCreateTradeOperationSubscription, OnUpdateTradeOperationSubscription, OnDeleteTradeOperationSubscription>({
    modelName: 'TradeOperation',
    createNewModel: CreateTradeOperationModel,

    title: 'Trade Operations',
    confirmDeleteMessage: 'Delete trade operation?',
    deleteSuccessMessage: 'Trade deleted',
    deleteFailureMessage: 'Can not delete trade',
    emptyListMessage: 'No trade operations',

    OperationCard: TradeOperationCard,
    OperationFormDialog: TradeOperationFormDialog,

    listByOwner_QueryString: listTradeOperationsByOwner,
    onCreate_SubscriptionString: onCreateTradeOperation,
    onDelete_SubscriptionString: onDeleteTradeOperation,
    onUpdate_SubscriptionString: onUpdateTradeOperation,
    delete_MutationString: deleteTradeOperation,

    getListPayload: result => result ? result.listTradeOperationsByOwner : null,
    getOnCreateSubscriptionPayload: result => result.onCreateTradeOperation,
    getOnUpdateSubscriptionPayload: result => result.onUpdateTradeOperation,
    getOnDeleteSubscriptionPayload: result => result.onDeleteTradeOperation,
});
