import React from 'react';
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import {CardProps} from "@material-ui/core/Card/Card";
import {TradeOperationModel} from "../../../models/TradeOperationModel";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import {easyTime} from "../../../utils/date-util";
import {makeStyles} from "@material-ui/styles";
import {Theme} from "@material-ui/core/styles";
import {notStonksTextColor, stonksTextColor} from "../../../theme/colors";

type Props = CardProps & {
    model: TradeOperationModel
    onEditClick: (item: TradeOperationModel) => void
    onDeleteClick: (item: TradeOperationModel) => void
}

const useStyles = makeStyles((theme: Theme) => ({
    expenseText: {
        color: notStonksTextColor,
    },
    incomeText: {
        color: stonksTextColor,
    },
}));

const FromCurrencyToCurrency = ({model: {amountCurrency, priceCurrency, price, amount}}: { model: TradeOperationModel }) => {
    const classes = useStyles();
    return <span>
        <span className={classes.expenseText}><b>-{Math.abs(price)}</b> {priceCurrency}</span>
        {' to '}
        <span className={classes.incomeText}><b>+{Math.abs(amount)}</b> {amountCurrency}</span>
    </span>;
};

const ExchangeRate = ({model: {priceCurrency, exchangeRate, amountCurrency}}: { model: TradeOperationModel }) => {
    return <span>1 {amountCurrency} = {exchangeRate} {priceCurrency}</span>;
};

const Fee = ({model: {amountFee, amountCurrency}}: { model: TradeOperationModel }) => {
    const classes = useStyles();
    return <span className={classes.expenseText}>Fee: {amountFee} {amountCurrency}</span>;
};

export const TradeOperationCard = ({model, onDeleteClick, onEditClick}: Props) => {
    return (
        <ListItem button onClick={() => onEditClick(model)}>
            <ListItemText
                primary={<FromCurrencyToCurrency model={model}/>}
                secondary={<ExchangeRate model={model}/>}
            />
            <ListItemText
                primary={easyTime(model.dateAcquired)}
                primaryTypographyProps={{align: "right"}}
                secondary={<Fee model={model}/>}
                secondaryTypographyProps={{align: "right"}}
            />
            <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={() => onDeleteClick(model)}>
                    <DeleteIcon/>
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
};
