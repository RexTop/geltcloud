import {UIShowAlertMessageEvent, UIShowAlertMessageEventArgs} from "../custom-events/EventTypes";
import {dispatch} from "../lib/GenericEvent";

export const showAlert = (args: UIShowAlertMessageEventArgs) => {
    dispatch<UIShowAlertMessageEventArgs>(UIShowAlertMessageEvent, args);
};
