import {Color} from "@material-ui/lab";

export const UIShowAlertMessageEvent = 'UIShowAlertMessageEvent';

export type UIShowAlertMessageEventArgs = {
  message: string
  severity?: Color
}
