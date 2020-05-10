import React from 'react';
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import {CardProps} from "@material-ui/core/Card/Card";
import {TransferOperationModel} from "../../../models/TransferOperationModel";
import {money} from "../../../utils/money";
import ListItem from "@material-ui/core/ListItem";
import AutorenewIcon from '@material-ui/icons/Autorenew';
import TrendingDown from "@material-ui/icons/TrendingDown";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import {makeStyles} from "@material-ui/styles";
import {Theme} from "@material-ui/core/styles";
import {notStonksTextColor} from "../../../theme/colors";
import {Avatar, ListItemAvatar} from "@material-ui/core";

type Props = CardProps & {
    model: TransferOperationModel
    onEditClick: (item: TransferOperationModel) => void
    onDeleteClick: (item: TransferOperationModel) => void
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
    neutralText: {},
    neutralAvatar: {},
}));

const Amount = ({model: {amount}}: { model: TransferOperationModel }) => {
    const classes = useStyles();
    return <span className={amount < 0 ? classes.expenseText : classes.neutralText}>{money(amount)}</span>
};

const FromAccountToAccountText = ({model}: { model: TransferOperationModel }) => {
    const classes = useStyles();
    const fromText = model?.issuerCashAccount?.name || <span className={classes.unknownAccount}>Unknown account</span>;
    const toText = model?.acquirerCashAccount?.name || <span className={classes.unknownAccount}>Unknown account</span>;
    return <span>{fromText} to {toText}</span>;
};

export const TransferOperationCard = ({model, onDeleteClick, onEditClick}: Props) => {
    const classes = useStyles();
    return (
        <ListItem button onClick={() => onEditClick(model)}>
            <ListItemAvatar>
                <Avatar alt="Operation Type"
                        className={model.amount < 0 ? classes.expenseAvatar : classes.neutralAvatar}>
                    {model.amount < 0 ? <TrendingDown/> : <AutorenewIcon/>}
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={model.description}
                secondary={<FromAccountToAccountText model={model}/>}
            />
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
