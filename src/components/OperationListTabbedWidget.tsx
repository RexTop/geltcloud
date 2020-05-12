import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import {makeStyles, Theme, useTheme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {PaperOperationCard} from "../ASkeleton";
import {TabPanel} from "./TabPanel";
import {getSubheaders} from "../common/UIListUtils";
import ListSubheader from "@material-ui/core/ListSubheader";
import {Card as MaterialCard} from '@material-ui/core';
import ListItem from "@material-ui/core/ListItem";
import {BareButton} from "./common/BareElements";
import ListItemText from "@material-ui/core/ListItemText";

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
        margin: theme.spacing(0, 0, 1, 0),
        backgroundColor: theme.palette.background.paper,
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
                className={classes.tabs}
            >
                {/*TODO*/}
                <TabPanel value={value} index={0} dir={theme.direction} className={classes.tab}>
                    {items.map((model) => (
                        <React.Fragment key={`OperationList-${modelName}-${model.id}`}>
                            {headers.hasOwnProperty(model.id) &&
                            <ListSubheader className={classes.subHeader} component={MaterialCard}>
                                {headers[model.id]}
                            </ListSubheader>
                            }
                            <PaperOperationCard/>
                            {/*<Card*/}
                            {/*    model={model}*/}
                            {/*    onDeleteClick={() => onDeleteClick(model)}*/}
                            {/*    onEditClick={() => onEditClick(model)}*/}
                            {/*/>*/}
                        </React.Fragment>
                    ))}
                    <ListItem button disabled={!hasMore || loading} onClick={onLoadMoreClick} component={BareButton}>
                        <ListItemText
                            secondary={loading ? 'Loading' : hasMore ? 'Load more' : items.length ? noMoreItemsMessage : emptyListMessage}
                            style={{textAlign: 'center'}}
                        />
                    </ListItem>
                    {/*<ASkeleton/>*/}
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    {/*<ASkeleton/>*/}
                </TabPanel>
                <TabPanel value={value} index={2} dir={theme.direction}>
                    {/*<ASkeleton/>*/}
                </TabPanel>
                <TabPanel value={value} index={3} dir={theme.direction}>
                    {/*<ASkeleton/>*/}
                </TabPanel>
            </SwipeableViews>
        </div>
    );
};
