import List from "@material-ui/core/List";
import React from "react";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {makeStyles} from "@material-ui/styles";
import {Theme} from "@material-ui/core/styles";
import {getSubheaders} from "../common/UIListUtils";
import {BareButton} from "./common/BareElements";

const useStyles = makeStyles((theme: Theme) => ({
    operationListPaperWidgetList: {
        flex: 1,
        overflowY: 'auto',
        padding: 0,
    },
    operationListPaperWidgetSubheader: {
        backgroundColor: theme.palette.background.paper,
    },
}));

const getItemId = <T extends { id: string }>(item: T) => item.id;

type Props<TModel extends { id: string }> = {
    items: TModel[]
    loadMore: { hasMore: boolean, loading: boolean, onClick: () => void, emptyListMessage: string, noMoreItemsMessage: string }
    cardElement: React.ComponentType<{ model: TModel, onEditClick: () => void, onDeleteClick: () => void }>
    onEditClick: (model: TModel) => void
    onDeleteClick: (model: TModel) => void
    modelName: string
    getGroupingKey: (model: TModel) => string
}

export const OperationListPaperWidget = <TModel extends { id: string }>(
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
    const headers = getSubheaders(items, getGroupingKey, getItemId);
    return (
        <List className={classes.operationListPaperWidgetList}>
            {items.map((model) => (
                <React.Fragment key={`OperationList-${modelName}-${model.id}`}>
                    {headers.hasOwnProperty(model.id) &&
                    <ListSubheader className={classes.operationListPaperWidgetSubheader}>
                        {headers[model.id]}
                    </ListSubheader>}
                    <Card
                        model={model}
                        onDeleteClick={() => onDeleteClick(model)}
                        onEditClick={() => onEditClick(model)}
                    />
                </React.Fragment>
            ))}
            <li>
                <ListItem button disabled={!hasMore || loading} onClick={onLoadMoreClick} component={BareButton}>
                    <ListItemText
                        secondary={loading ? 'Loading' : hasMore ? 'Load more' : items.length ? noMoreItemsMessage : emptyListMessage}
                        style={{textAlign: 'center'}}/>
                </ListItem>
            </li>
        </List>
    );
};
