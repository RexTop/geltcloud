import moment from "moment";

export const easyDate = (date: string) => moment(date).format('MMM-D-YYYY');
export const easyTime = (date: string) => moment(date).format('hh:mm A');
