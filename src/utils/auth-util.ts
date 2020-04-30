import {Auth} from "aws-amplify";

export const currentUsername = (): string => {
    // NOTE: Subscriptions work even without specifying the owner, but it logs a js error. To solve that we pass the
    // logged user when subscribing to 'onCreateNote', and other subscriptions.
    const {user} = Auth as any;
    return user && user.username ? `${user.username}` : '';
};

export const currentUserPhoneNumber = (): string => {
    const {user} = Auth as any;
    return user && user.attributes && user.attributes.phone_number ? `${user.attributes.phone_number}` : '';
};
