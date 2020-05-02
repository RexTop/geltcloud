import {FlowOperationCard, FlowOperationFormDialog} from './components';
import {CreateFlowOperationModel, FlowOperationModel} from "../../models/FlowOperationModel";
import {onCreateFlowOperation, onDeleteFlowOperation, onUpdateFlowOperation} from "../../graphql/subscriptions";
import {
    ListFlowOperationsByOwnerQuery,
    OnCreateFlowOperationSubscription,
    OnDeleteFlowOperationSubscription,
    OnUpdateFlowOperationSubscription,
} from "../../API";
import {listFlowOperationsByOwner} from "../../graphql/queries";
import {deleteFlowOperation} from "../../graphql/mutations";
import {createOperationListComponent} from "../../components/AbstractOperationList";

export const FlowOperationList = createOperationListComponent<FlowOperationModel, ListFlowOperationsByOwnerQuery, OnCreateFlowOperationSubscription, OnUpdateFlowOperationSubscription, OnDeleteFlowOperationSubscription>({
    modelName: 'FlowOperation',
    createNewModel: CreateFlowOperationModel,

    title: 'Flow Operations',
    confirmDeleteMessage: 'Delete flow operation?',
    deleteSuccessMessage: 'Flow deleted',
    deleteFailureMessage: 'Can not delete flow',
    emptyListMessage: 'No flow operations',

    OperationCard: FlowOperationCard,
    OperationFormDialog: FlowOperationFormDialog,

    listByOwner_QueryString: listFlowOperationsByOwner,
    onCreate_SubscriptionString: onCreateFlowOperation,
    onDelete_SubscriptionString: onDeleteFlowOperation,
    onUpdate_SubscriptionString: onUpdateFlowOperation,
    delete_MutationString: deleteFlowOperation,

    getListPayload: result => result ? result.listFlowOperationsByOwner : null,
    getOnCreateSubscriptionPayload: result => result.onCreateFlowOperation,
    getOnUpdateSubscriptionPayload: result => result.onUpdateFlowOperation,
    getOnDeleteSubscriptionPayload: result => result.onDeleteFlowOperation,
});
