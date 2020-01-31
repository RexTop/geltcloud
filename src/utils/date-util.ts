import moment from "moment";

export const easyDate = (date: string) => moment(date).format('MMM-D-YYYY');
