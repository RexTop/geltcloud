import moment from "moment";

export const easyDate = (date: string) => moment(date).format('MMM-D-YYYY');
export const easyTime = (date: string) => moment(date).format('hh:mm A');

export const todayFilter = (): DateFilter => ({
    fromDateLocal: moment().format('YYYY-MM-DD'),
    toDateLocal: moment().format('YYYY-MM-DD'),
});

export type DateFilter = {
    fromDateLocal: string
    toDateLocal: string
}

export enum DateFiltersWidgetTab {
    TODAY,
    WEEK,
    MONTH,
    CUSTOM,
}

export const getDateFilterOfTab = (tab: DateFiltersWidgetTab, localFrom: string, localTo: string) => {
    switch (tab) {
        case DateFiltersWidgetTab.TODAY: {
            const today = moment().format('YYYY-MM-DD');
            return {
                fromDateLocal: today,
                toDateLocal: today,
            };
        }
        case DateFiltersWidgetTab.WEEK: {
            const aWeekAgo = moment().subtract(7, 'days').format('YYYY-MM-DD');
            const today = moment().format('YYYY-MM-DD');
            return {
                fromDateLocal: aWeekAgo,
                toDateLocal: today,
            };
        }
        case DateFiltersWidgetTab.MONTH: {
            const aMonthAgo = moment().subtract(30, 'days').format('YYYY-MM-DD');
            const today = moment().format('YYYY-MM-DD');
            return {
                fromDateLocal: aMonthAgo,
                toDateLocal: today,
            };
        }
        case DateFiltersWidgetTab.CUSTOM:
        default: {
            return {
                fromDateLocal: moment(localFrom).format('YYYY-MM-DD'),
                toDateLocal: moment(localTo).format('YYYY-MM-DD'),
            };
        }
    }
};
