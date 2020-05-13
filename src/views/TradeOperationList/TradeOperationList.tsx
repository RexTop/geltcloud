import {TradeOperationFormDialog} from './components';
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
import moment from "moment";
import {TradeOperationMaterialCard} from "./components/TradeOperationMaterialCard";

const getLocalFormattedDateOfOperation = (item: TradeOperationModel) => moment(item.date).format('YYYY-MMM-DD');

export const TradeOperationList = createOperationListComponent<TradeOperationModel, ListTradeOperationsByOwnerQuery, OnCreateTradeOperationSubscription, OnUpdateTradeOperationSubscription, OnDeleteTradeOperationSubscription>({
    modelName: 'TradeOperation',
    createNewModel: CreateTradeOperationModel,

    title: 'Trade Operations',
    confirmDeleteMessage: 'Delete trade operation?',
    deleteSuccessMessage: 'Trade deleted',
    deleteFailureMessage: 'Can not delete trade',
    emptyListMessage: 'No trade operations',
    noMoreItemsMessage: 'No more trade operations',
    getGroupingKey: getLocalFormattedDateOfOperation,

    OperationCard: TradeOperationMaterialCard,
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

    sortKeyFieldForDate: "date",
});
