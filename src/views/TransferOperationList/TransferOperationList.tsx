import {TransferOperationFormDialog} from './components';
import {CreateTransferOperationModel, TransferOperationModel} from "../../models/TransferOperationModel";
import {
    onCreateTransferOperation,
    onDeleteTransferOperation,
    onUpdateTransferOperation
} from "../../graphql/subscriptions";
import {
    ListTransferOperationsByOwnerQuery,
    OnCreateTransferOperationSubscription,
    OnDeleteTransferOperationSubscription,
    OnUpdateTransferOperationSubscription,
} from "../../API";
import {listTransferOperationsByOwner} from "../../graphql/queries";
import {deleteTransferOperation} from "../../graphql/mutations";
import {createOperationListComponent} from "../../components/AbstractOperationList";
import {TransferOperationCardMinimal} from "./components/TransferOperationCard";
import moment from "moment";

const getLocalFormattedDateOfOperation = (item: TransferOperationModel) => moment(item.dateIssued).format('YYYY-MMM-DD');

export const TransferOperationList = createOperationListComponent<TransferOperationModel, ListTransferOperationsByOwnerQuery, OnCreateTransferOperationSubscription, OnUpdateTransferOperationSubscription, OnDeleteTransferOperationSubscription>({
    modelName: 'TransferOperation',
    createNewModel: CreateTransferOperationModel,

    title: 'Transfer Operations',
    confirmDeleteMessage: 'Delete transfer operation?',
    deleteSuccessMessage: 'Transfer deleted',
    deleteFailureMessage: 'Can not delete transfer',
    emptyListMessage: 'No transfer operations',
    noMoreItemsMessage: 'No more transfers',
    getGroupingKey: getLocalFormattedDateOfOperation,

    OperationCard: TransferOperationCardMinimal,
    OperationFormDialog: TransferOperationFormDialog,

    listByOwner_QueryString: listTransferOperationsByOwner,
    onCreate_SubscriptionString: onCreateTransferOperation,
    onDelete_SubscriptionString: onDeleteTransferOperation,
    onUpdate_SubscriptionString: onUpdateTransferOperation,
    delete_MutationString: deleteTransferOperation,

    getListPayload: result => result ? result.listTransferOperationsByOwner : null,
    getOnCreateSubscriptionPayload: result => result.onCreateTransferOperation,
    getOnUpdateSubscriptionPayload: result => result.onUpdateTransferOperation,
    getOnDeleteSubscriptionPayload: result => result.onDeleteTransferOperation,
});
