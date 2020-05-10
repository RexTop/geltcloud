import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import React, {ChangeEvent} from "react";
import {makeStyles} from "@material-ui/styles";
import {Theme} from "@material-ui/core/styles";
import moment from "moment";

export type DateFilter = {
    fromDateLocal: string
    toDateLocal: string
}

export const todayFilter = (): DateFilter => ({
    fromDateLocal: moment().format('YYYY-MM-DD'),
    toDateLocal: moment().format('YYYY-MM-DD'),
});

const useStyles = makeStyles((theme: Theme) => ({
    datesContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        marginTop: theme.spacing(2)
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 130,
    },
}));

enum DateFiltersWidgetTab {
    TODAY,
    WEEK,
    MONTH,
    CUSTOM,
}

type Props = {
    onDatesChange: (dates: DateFilter) => void
    dates: DateFilter
}

export const DateFiltersWidget = ({onDatesChange, dates}: Props) => {

    const [tab, setTab] = React.useState(DateFiltersWidgetTab.TODAY);

    const classes = useStyles();

    const onTabClick = (tab: DateFiltersWidgetTab) => {
        setTab(tab);
        onDateInfoChange(tab, dates.fromDateLocal, dates.toDateLocal);
    };

    const onFromChange = (e: ChangeEvent<HTMLInputElement>) => {
        onDateInfoChange(DateFiltersWidgetTab.CUSTOM, e.target.value, dates.toDateLocal);
    };

    const onToChange = (e: ChangeEvent<HTMLInputElement>) => {
        onDateInfoChange(DateFiltersWidgetTab.CUSTOM, dates.fromDateLocal, e.target.value);
    };

    const onDateInfoChange = (tab: DateFiltersWidgetTab, localFrom: string, localTo: string) => {
        switch (tab) {
            case DateFiltersWidgetTab.TODAY: {
                const today = moment().format('YYYY-MM-DD');
                onDatesChange({
                    fromDateLocal: today,
                    toDateLocal: today,
                });
                break;
            }
            case DateFiltersWidgetTab.WEEK: {
                const aWeekAgo = moment().subtract(7, 'days').format('YYYY-MM-DD');
                const today = moment().format('YYYY-MM-DD');
                onDatesChange({
                    fromDateLocal: aWeekAgo,
                    toDateLocal: today,
                });
                break;
            }
            case DateFiltersWidgetTab.MONTH: {
                const aMonthAgo = moment().subtract(30, 'days').format('YYYY-MM-DD');
                const today = moment().format('YYYY-MM-DD');
                onDatesChange({
                    fromDateLocal: aMonthAgo,
                    toDateLocal: today,
                });
                break;
            }
            case DateFiltersWidgetTab.CUSTOM: {
                onDatesChange({
                    fromDateLocal: moment(localFrom).format('YYYY-MM-DD'),
                    toDateLocal: moment(localTo).format('YYYY-MM-DD'),
                });
                break;
            }
        }
    };

    return (
        <div>
            <ButtonGroup color="primary">
                <Button
                    variant={tab === DateFiltersWidgetTab.TODAY ? 'contained' : void 0}
                    onClick={() => onTabClick(DateFiltersWidgetTab.TODAY)}
                >
                    Today
                </Button>
                <Button
                    variant={tab === DateFiltersWidgetTab.WEEK ? 'contained' : void 0}
                    onClick={() => onTabClick(DateFiltersWidgetTab.WEEK)}
                >
                    -7 days
                </Button>
                <Button
                    variant={tab === DateFiltersWidgetTab.MONTH ? 'contained' : void 0}
                    onClick={() => onTabClick(DateFiltersWidgetTab.MONTH)}
                >
                    -30 days
                </Button>
                <Button
                    variant={tab === DateFiltersWidgetTab.CUSTOM ? 'contained' : void 0}
                    onClick={() => onTabClick(DateFiltersWidgetTab.CUSTOM)}
                >
                    Custom
                </Button>
            </ButtonGroup>
            {tab === DateFiltersWidgetTab.CUSTOM && (
                <form className={classes.datesContainer} noValidate>
                    <TextField
                        label="From"
                        type="date"
                        value={dates.fromDateLocal}
                        className={classes.textField}
                        InputLabelProps={{shrink: true}}
                        onChange={onFromChange}
                    />
                    <TextField
                        label="To"
                        type="date"
                        value={dates.toDateLocal}
                        className={classes.textField}
                        InputLabelProps={{shrink: true}}
                        onChange={onToChange}
                    />
                </form>
            )}
        </div>
    );
};
