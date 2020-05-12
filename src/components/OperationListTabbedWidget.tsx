import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import {makeStyles, Theme, useTheme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {TabPanel} from "./TabPanel";
import {getSubheaders} from "../common/UIListUtils";
import ListSubheader from "@material-ui/core/ListSubheader";
import {Card as MaterialCard} from '@material-ui/core';
import ListItem from "@material-ui/core/ListItem";
import {BareButton} from "./common/BareElements";
import ListItemText from "@material-ui/core/ListItemText";
import {DateFilter, DateFiltersWidgetTab, getDateFilterOfTab} from "../utils/date-util";

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
        padding: theme.spacing(1),
    },
    subHeader: {
        maxWidth: 500,
        margin: theme.spacing(0, 'auto', 1, 'auto'),
        backgroundColor: theme.palette.background.paper,
    },
}));

const getItemId = <T extends { id: string }>(item: T) => item.id;

export const OperationListTabbedWidget = <TModel extends { id: string }>(props: Props<TModel>) => {
    const classes = useStyles();
    const theme = useTheme();

    const [value, setValue] = React.useState(DateFiltersWidgetTab.TODAY);

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
        cardElement: Card,
        onDeleteClick,
        onEditClick,
    }: Props<TModel> & { tab: DateFiltersWidgetTab }) => {
    const classes = useStyles();
    const headers = getSubheaders(items, getGroupingKey, getItemId);

    return (
        <>
            {items.map((model) => (
                <React.Fragment key={`OperationList-${modelName}-${model.id}`}>
                    {headers.hasOwnProperty(model.id) &&
                    <ListSubheader className={classes.subHeader} component={MaterialCard}>
                        {headers[model.id]}
                    </ListSubheader>
                    }
                    <Card
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
        </>
    );
};
