import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import {makeStyles, Theme, useTheme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {ASkeleton} from "../ASkeleton";
import {TabPanel} from "./TabPanel";
import {getSubheaders} from "../common/UIListUtils";

type Props<TModel extends { id: string }> = {
    items: TModel[]
    loadMore: { hasMore: boolean, loading: boolean, onClick: () => void, emptyListMessage: string, noMoreItemsMessage: string }
    cardElement: React.ComponentType<{ model: TModel, onEditClick: () => void, onDeleteClick: () => void }>
    onEditClick: (model: TModel) => void
    onDeleteClick: (model: TModel) => void
    modelName: string
    getGroupingKey: (model: TModel) => string
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    content: {
        flex: 1,
        padding: theme.spacing(1),
    },
}));

const getItemId = <T extends { id: string }>(item: T) => item.id;

export const OperationListTabbedWidget = <TModel extends { id: string }>(
    {
        items,
        loadMore: {hasMore, loading, onClick: onLoadMoreClick, emptyListMessage, noMoreItemsMessage},
        modelName,
        cardElement: Card,
        onDeleteClick,
        onEditClick,
        getGroupingKey,
    }: Props<TModel>) => {
    const classes = useStyles();
    const theme = useTheme();
    const headers = getSubheaders(items, getGroupingKey, getItemId);

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index: number) => {
        setValue(index);
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
                className={classes.content}
            >
                <TabPanel value={value} index={0} dir={theme.direction}>
                    <ASkeleton/>
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    <ASkeleton/>
                </TabPanel>
                <TabPanel value={value} index={2} dir={theme.direction}>
                    <ASkeleton/>
                </TabPanel>
                <TabPanel value={value} index={3} dir={theme.direction}>
                    <ASkeleton/>
                </TabPanel>
            </SwipeableViews>
        </div>
    );
};
