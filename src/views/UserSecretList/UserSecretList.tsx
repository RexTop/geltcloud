import {UserSecretFormDialog} from './components';
import {CreateUserSecretModel, UserSecretModel} from "../../models/UserSecretModel";
import {
    onCreateUserSecret,
    onDeleteUserSecret,
    onUpdateUserSecret
} from "../../graphql/subscriptions";
import {
    ListUserSecretsByOwnerQuery,
    OnCreateUserSecretSubscription,
    OnDeleteUserSecretSubscription,
    OnUpdateUserSecretSubscription,
} from "../../API";
import {listUserSecretsByOwner} from "../../graphql/queries";
import {deleteUserSecret} from "../../graphql/mutations";
import {createOperationListComponent} from "../../components/AbstractOperationList";
import {easyDate} from "../../utils/date-util";
import {UserSecretMaterialCard} from "./components/UserSecretMaterialCard";

const getLocalFormattedDateOfOperation = (item: UserSecretModel) => easyDate(item.key);

export const UserSecretList = createOperationListComponent<UserSecretModel, ListUserSecretsByOwnerQuery, OnCreateUserSecretSubscription, OnUpdateUserSecretSubscription, OnDeleteUserSecretSubscription>({
    modelName: 'UserSecret',
    createNewModel: CreateUserSecretModel,

    title: 'Secrets',
    confirmDeleteMessage: 'Delete secret?',
    deleteSuccessMessage: 'Secret deleted',
    deleteFailureMessage: 'Can not delete secret',
    emptyListMessage: 'No secrets',
    noMoreItemsMessage: 'No more secrets',
    getGroupingKey: getLocalFormattedDateOfOperation,

    OperationCard: UserSecretMaterialCard,
    OperationFormDialog: UserSecretFormDialog,

    listByOwner_QueryString: listUserSecretsByOwner,
    onCreate_SubscriptionString: onCreateUserSecret,
    onDelete_SubscriptionString: onDeleteUserSecret,
    onUpdate_SubscriptionString: onUpdateUserSecret,
    delete_MutationString: deleteUserSecret,

    getListPayload: result => result ? result.listUserSecretsByOwner : null,
    getOnCreateSubscriptionPayload: result => result.onCreateUserSecret,
    getOnUpdateSubscriptionPayload: result => result.onUpdateUserSecret,
    getOnDeleteSubscriptionPayload: result => result.onDeleteUserSecret,
});
