import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import {makeStyles, Theme, useTheme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {TabPanel} from "./TabPanel";
import {getSubheaders} from "../common/UIListUtils";
import ListSubheader from "@material-ui/core/ListSubheader";
import {Card, Card as MaterialCard} from '@material-ui/core';
import ListItem from "@material-ui/core/ListItem";
import {BareButton} from "./common/BareElements";
import ListItemText from "@material-ui/core/ListItemText";
import {DateFilter, DateFiltersWidgetTab, easyDateFormat, getDateFilterOfTab} from "../utils/date-util";
import {DatePicker} from '@material-ui/pickers';
import {MaterialUiPickersDate} from "@material-ui/pickers/typings/date";


type Props<TModel extends { id: string }> = {
    items: TModel[]
    loadMore: { hasMore: boolean, loading: boolean, onClick: () => void, emptyListMessage: string, noMoreItemsMessage: string }
    cardElement: React.ComponentType<{ model: TModel, onEditClick: () => void, onDeleteClick: () => void, loading?: boolean }>
    onEditClick: (model: TModel) => void
    onDeleteClick: (model: TModel) => void
    modelName: string
    getGroupingKey: (model: TModel) => string
    onDatesChange: (dates: DateFilter) => void
    dates: DateFilter
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    tabs: {
        flex: 1,
        '&>div': {
            height: '100%',
        }
    },
    tab: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        top: 0,
    },
    subHeader: {
        maxWidth: 500,
        margin: theme.spacing(0, 'auto', 1, 'auto'),
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    },
    operationCard: {
        padding: theme.spacing(0, 1, 1, 1),
        flex: 1,
        overflowY: 'auto',
    },
    bottomBar: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 10, 0, 1),
        zIndex: 10,
    },
    datePicker: {
        padding: theme.spacing(0, 1, 0, 1),
        '&>div::before': {
            display: 'none',
        },
        '&>div::after': {
            display: 'none',
        },
    },
    slide: {
        position: 'relative',
    },
}));

const getItemId = <T extends { id: string }>(item: T) => item.id;

export const OperationListTabbedWidget = <TModel extends { id: string }>(props: Props<TModel>) => {
    const classes = useStyles();
    const theme = useTheme();

    const [value, setValue] = React.useState(DateFiltersWidgetTab.CUSTOM);

    const handleFromDateChange = (date: MaterialUiPickersDate | null) => {
        if (date)
            props.onDatesChange({toDateLocal: props.dates.toDateLocal, fromDateLocal: date.utc().format()});
    };

    const handleToDateChange = (date: MaterialUiPickersDate | null) => {
        if (date)
            props.onDatesChange({toDateLocal: date.utc().format(), fromDateLocal: props.dates.fromDateLocal});
    };

    const updateDate = (newTab: DateFiltersWidgetTab) => {
        setValue(newTab);
        props.onDatesChange(getDateFilterOfTab(newTab, props.dates.fromDateLocal, props.dates.toDateLocal));
    };

    const handleChange = (event: React.ChangeEvent<{}>, newTab: DateFiltersWidgetTab) => {
        updateDate(newTab);
    };

    const handleChangeIndex = (newTab: DateFiltersWidgetTab) => {
        updateDate(newTab);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                >
                    <Tab label="Today"/>
                    <Tab label="Week"/>
                    <Tab label="Month"/>
                    <Tab label="Custom"/>
                </Tabs>
            </AppBar>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
                className={classes.tabs}
                slideClassName={classes.slide}
            >
                <TabPanel
                    value={value}
                    index={DateFiltersWidgetTab.TODAY}
                    dir={theme.direction}
                    className={classes.tab}

                >
                    <OperationTabPanel {...props} tab={DateFiltersWidgetTab.TODAY}/>
                </TabPanel>
                <TabPanel
                    value={value}
                    index={DateFiltersWidgetTab.WEEK}
                    dir={theme.direction}
                    className={classes.tab}

                >
                    <OperationTabPanel {...props} tab={DateFiltersWidgetTab.WEEK}/>
                </TabPanel>
                <TabPanel
                    value={value}
                    index={DateFiltersWidgetTab.MONTH}
                    dir={theme.direction}
                    className={classes.tab}

                >
                    <OperationTabPanel {...props} tab={DateFiltersWidgetTab.MONTH}/>
                </TabPanel>
                <TabPanel
                    value={value}
                    index={DateFiltersWidgetTab.CUSTOM}
                    dir={theme.direction}
                    className={classes.tab}

                >
                    <OperationTabPanel {...props} tab={DateFiltersWidgetTab.CUSTOM}/>
                    <Card className={classes.bottomBar}>
                        From:
                        <DatePicker
                            value={props.dates.fromDateLocal}
                            format={easyDateFormat}
                            onChange={handleFromDateChange}
                            className={classes.datePicker}
                        />
                        To:
                        <DatePicker
                            value={props.dates.toDateLocal}
                            format={easyDateFormat}
                            onChange={handleToDateChange}
                            className={classes.datePicker}
                        />
                    </Card>
                </TabPanel>
            </SwipeableViews>
        </div>
    );
};

const OperationTabPanel = <TModel extends { id: string }>(
    {
        items,
        modelName,
        getGroupingKey,
        loadMore: {
            hasMore,
            loading,
            onClick: onLoadMoreClick,
            noMoreItemsMessage,
            emptyListMessage,
        },
        cardElement: OperationCard,
        onDeleteClick,
        onEditClick,
    }: Props<TModel> & { tab: DateFiltersWidgetTab }) => {
    const classes = useStyles();
    const headers = getSubheaders(items, getGroupingKey, getItemId);

    return (
        <div className={classes.operationCard}>
            {items.map((model) => (
                <React.Fragment key={`OperationList-${modelName}-${model.id}`}>
                    {headers.hasOwnProperty(model.id) &&
                    <ListSubheader className={classes.subHeader} component={MaterialCard}>
                        {headers[model.id]}
                    </ListSubheader>
                    }
                    <OperationCard
                        model={model}
                        onDeleteClick={() => onDeleteClick(model)}
                        onEditClick={() => onEditClick(model)}
                    />
                </React.Fragment>
            ))}
            <ListItem button disabled={!hasMore || loading} onClick={onLoadMoreClick} component={BareButton}>
                <ListItemText
                    secondary={loading ? 'Loading' : hasMore ? 'Load more' : items.length ? noMoreItemsMessage : emptyListMessage}
                    style={{textAlign: 'center'}}
                />
            </ListItem>
        </div>
    );
};
