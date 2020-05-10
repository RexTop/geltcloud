import React from 'react';
import IconButton from "@material-ui/core/IconButton";
import {CardProps} from "@material-ui/core/Card/Card";
import {FlowOperationModel} from "../../../models/FlowOperationModel";
import {money} from "../../../utils/money";
import ListItem from "@material-ui/core/ListItem";
import {Delete as DeleteIcon, TrendingDown, TrendingUp} from "@material-ui/icons";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import {makeStyles} from "@material-ui/styles";
import {Theme} from "@material-ui/core/styles";
import {notStonksTextColor, stonksTextColor} from "../../../theme/colors";
import {Avatar, ListItemAvatar} from "@material-ui/core";

type Props = CardProps & {
    model: FlowOperationModel
    onEditClick: (item: FlowOperationModel) => void
    onDeleteClick: (item: FlowOperationModel) => void
}

const useStyles = makeStyles((theme: Theme) => ({
    unknownAccount: {
        color: theme.palette.error.main,
    },
    expenseText: {
        color: notStonksTextColor,
    },
    expenseAvatar: {
        backgroundColor: notStonksTextColor,
    },
    incomeText: {
        color: stonksTextColor,
    },
    incomeAvatar: {
        backgroundColor: stonksTextColor,
    },
}));

const Amount = ({model: {amount}}: { model: FlowOperationModel }) => {
    const classes = useStyles();
    return <span className={amount < 0 ? classes.expenseText : classes.incomeText}>{money(amount)}</span>
};

const AccountText = ({model}: { model: FlowOperationModel }) => {
    const classes = useStyles();
    const accountText = model?.issuerCashAccount?.name ||
        <span className={classes.unknownAccount}>Unknown account</span>;
    return <span>{accountText}</span>;
};

export const FlowOperationCard = ({model, onDeleteClick, onEditClick}: Props) => {
    const classes = useStyles();
    return (
        <ListItem button onClick={() => onEditClick(model)}>
            <ListItemAvatar>
                <Avatar
                    alt="Operation Type"
                    className={model.amount < 0 ? classes.expenseAvatar : classes.incomeAvatar}
                >
                    {model.amount < 0 ? <TrendingDown/> : <TrendingUp/>}
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={model.description} secondary={<AccountText model={model}/>}/>
            <ListItemText
                primary={<Amount model={model}/>}
                primaryTypographyProps={{align: "right"}}
            />
            <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={() => onDeleteClick(model)}>
                    <DeleteIcon/>
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
};
