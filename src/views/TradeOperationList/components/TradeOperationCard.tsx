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
import {naiveMoneyFormat} from "../../../utils/money";

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
    const right = naiveMoneyFormat({
        value: amount,
        currency: amountCurrency,
        absolute: true,
    });
    const left = naiveMoneyFormat({
        value: price,
        currency: priceCurrency,
        absolute: true,
    });
    return <span>
        <b className={classes.expenseText}>{left}</b>{' to '}<b className={classes.incomeText}>{right}</b>
    </span>;
};

const ExchangeRate = ({model: {priceCurrency, exchangeRate, amountCurrency}}: { model: TradeOperationModel }) => {
    const right = naiveMoneyFormat({value: exchangeRate, currency: priceCurrency, absolute: true});
    return <span>1 {amountCurrency} = {right}</span>;
};

const Fee = ({model: {amountFee, amountCurrency}}: { model: TradeOperationModel }) => {
    const classes = useStyles();
    const fee = naiveMoneyFormat({value: amountFee, currency: amountCurrency, absolute: true});
    return <span className={classes.expenseText}>Fee: {fee}</span>;
};

export const TradeOperationCard = ({model, onDeleteClick, onEditClick}: Props) => {
    return (
        <ListItem button onClick={() => onEditClick(model)}>
            <ListItemText
                primary={<FromCurrencyToCurrency model={model}/>}
                secondary={<ExchangeRate model={model}/>}
            />
            <ListItemText
                primary={easyTime(model.date)}
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
