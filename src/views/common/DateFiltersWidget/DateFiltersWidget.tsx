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
  root: {},
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
      case DateFiltersWidgetTab.TODAY:
        onDatesChange({
          fromDateLocal: moment().format('YYYY-MM-DD'),
          toDateLocal: moment().format('YYYY-MM-DD'),
        });
        break;
      case DateFiltersWidgetTab.MONTH:
        onDatesChange({
          fromDateLocal: moment().startOf('month').format('YYYY-MM-DD'),
          toDateLocal: moment().endOf('month').format('YYYY-MM-DD'),
        });
        break;
      case DateFiltersWidgetTab.CUSTOM:
        onDatesChange({
          fromDateLocal: moment(localFrom).format('YYYY-MM-DD'),
          toDateLocal: moment(localTo).format('YYYY-MM-DD'),
        });
        break;
    }
  };

  return (
    <div className={classes.root}>
      <ButtonGroup color="primary">
        <Button
          variant={tab === DateFiltersWidgetTab.TODAY ? 'contained' : void 0}
          onClick={() => onTabClick(DateFiltersWidgetTab.TODAY)}
        >
          Today
        </Button>
        <Button
          variant={tab === DateFiltersWidgetTab.MONTH ? 'contained' : void 0}
          onClick={() => onTabClick(DateFiltersWidgetTab.MONTH)}
        >
          Month
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
