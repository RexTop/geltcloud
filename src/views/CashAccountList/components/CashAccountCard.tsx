import React from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/styles';
import {Card, CardActions, CardContent, Chip, Divider, Grid, Typography} from '@material-ui/core';
import ToggleOnIcon from '@material-ui/icons/ToggleOn';
import ToggleOffIcon from '@material-ui/icons/ToggleOff';
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import {Theme} from "@material-ui/core/styles";
import {CardProps} from "@material-ui/core/Card/Card";
import {CashAccountModel} from "../../../models/CashAccountModel";
import {money} from "../../../utils/money";
import {CashAccountType} from "../../../API";
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard';
import WarningIcon from '@material-ui/icons/Warning';

const useStyles = makeStyles((theme: Theme) => ({
    root: {},
    disabled: {
        opacity: .6
    },
    statsItem: {
        display: 'flex',
        alignItems: 'center'
    },
    title: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleIcon: {
        marginRight: theme.spacing(1),
    },
    statsIcon: {
        color: (theme.palette as any).icon, // TODO: Use the type of the return type of the custom theme
        marginRight: theme.spacing(1)
    },
    buttonIcon: {
        color: (theme.palette as any).icon, // TODO: Use the type of the return type of the custom theme
    },
    currency: {
        marginLeft: theme.spacing(1)
    },
}));

type Props = CardProps & {
    cashAccount: CashAccountModel
    onEditClick: (item: CashAccountModel) => void
    onDeleteClick: (item: CashAccountModel) => void
}

const CashAccountTypeIcon = ({type, className}: { type: CashAccountType, className: string }) => {
    switch (type) {
        case CashAccountType.CASH_ACCOUNT:
            return <MonetizationOnIcon className={className}/>;
        case CashAccountType.CREDIT_CARD:
            return <CreditCardIcon className={className}/>;
        case CashAccountType.GIFT_CARD:
            return <CardGiftcardIcon className={className}/>;
        default:
            return <WarningIcon className={className}/>;
    }
};

const CreditCardInfo = ({item}: { item: CashAccountModel }) => {
    const classes = useStyles();
    return (
        <CardContent>
            <Typography align="center" gutterBottom variant="h4" className={classes.title}>
                <CashAccountTypeIcon type={item.type} className={classes.titleIcon}/>
                {item.name} ****{item.last4}
                <Chip className={classes.currency} label={`${item.currency}@${item.precision}`}/>
            </Typography>
            <Typography align="center" variant="body1">Balance: {money(item.balance)}</Typography>
            <Typography align="center" variant="body1">Credit: {money(item.credit)}</Typography>
        </CardContent>
    );
};

const CashAccountInfo = ({item}: { item: CashAccountModel }) => {
    const classes = useStyles();
    return (
        <CardContent>
            <Typography align="center" gutterBottom variant="h4" className={classes.title}>
                <CashAccountTypeIcon type={item.type} className={classes.titleIcon}/>
                {item.name}
                <Chip className={classes.currency} label={`${item.currency}@${item.precision}`}/>
            </Typography>
            <Typography align="center" variant="body1">{money(item.balance)}</Typography>
        </CardContent>
    )
};

const CardInfo = ({item}: { item: CashAccountModel }) => item.type === CashAccountType.CREDIT_CARD ?
    <CreditCardInfo item={item}/> : <CashAccountInfo item={item}/>;

export const CashAccountCard = (props: Props) => {
    const {className, cashAccount, onEditClick, onDeleteClick, ...rest} = props;
    const classes = useStyles();

    return (
        <Card {...rest} className={clsx(classes.root, className, {[classes.disabled]: !cashAccount.active})}>
            <CardInfo item={cashAccount}/>
            <Divider/>
            <CardActions>
                <Grid container justify="space-between">
                    <Grid className={classes.statsItem} item>
                        {cashAccount.active ? <ToggleOnIcon className={classes.statsIcon}/> :
                            <ToggleOffIcon className={classes.statsIcon}/>}
                        <Typography display="inline"
                                    variant="body2">{cashAccount.active ? 'Active' : 'Inactive'}</Typography>
                    </Grid>
                    <Grid className={classes.statsItem} item>
                        <IconButton edge="end" aria-label="edit" onClick={() => onEditClick(cashAccount)}>
                            <EditIcon className={classes.buttonIcon}/>
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" onClick={() => onDeleteClick(cashAccount)}>
                            <DeleteIcon className={classes.buttonIcon}/>
                        </IconButton>
                    </Grid>
                </Grid>
            </CardActions>
        </Card>
    );
};
