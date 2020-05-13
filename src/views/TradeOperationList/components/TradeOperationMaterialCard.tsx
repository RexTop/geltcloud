import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Skeleton from '@material-ui/lab/Skeleton';
import {TradeOperationModel} from "../../../models/TradeOperationModel";
import {notStonksTextColor, stonksTextColor} from "../../../theme/colors";
import {naiveMoneyFormat} from "../../../utils/money";
import {Avatar, Box, CardActionArea, Menu, MenuItem, Typography} from "@material-ui/core";
import {easyTime} from "../../../utils/date-util";
import {cryptocurrencyIconExists, getCryptocurrencyIcon} from "../../../CryptoIcons";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            maxWidth: 500,
            margin: theme.spacing(0, 'auto', 1, 'auto'),
            display: 'flex',
            alignItems: 'center',
        },
        expenseText: {
            color: notStonksTextColor,
        },
        incomeText: {
            color: stonksTextColor,
        },
        deleteButton: {
            color: theme.palette.error.light,
        },
    }),
);

interface Props {
    loading?: boolean
    model: TradeOperationModel
    onEditClick: (item: TradeOperationModel) => void
    onDeleteClick: (item: TradeOperationModel) => void
}

const feeText = ({model: {amountFee, amountCurrency}}: { model: TradeOperationModel }) => {
    const fee = naiveMoneyFormat({value: amountFee, currency: amountCurrency, absolute: true});
    return `-${fee}`;
};

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
    return <Typography component="div" variant="body1" gutterBottom>
        <span className={classes.expenseText} style={{whiteSpace: 'nowrap'}}>{left}</span>
        {' to '}
        <b className={classes.incomeText} style={{whiteSpace: 'nowrap'}}>{right}</b>
    </Typography>;
};

const exchangeRateText = ({model: {priceCurrency, exchangeRate}}: { model: TradeOperationModel }) => {
    return naiveMoneyFormat({value: exchangeRate, currency: priceCurrency, absolute: true});
};

export const TradeOperationMaterialCard = (
    {
        loading = false,
        onEditClick,
        onDeleteClick,
        model
    }: Props) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const closeContextMenu = () => {
        setAnchorEl(null);
    };

    const handleDeleteClick = () => {
        closeContextMenu();
        onDeleteClick(model);
    };

    const currency = `${model.amountCurrency}`.toLowerCase();

    return (
        <Card className={classes.card}>
            <CardActionArea>
                <CardHeader
                    onClick={() => onEditClick(model)}
                    avatar={
                        loading ? (
                            <Skeleton animation="wave" variant="circle" width={40} height={40}/>
                        ) : cryptocurrencyIconExists(currency) ?
                            <Avatar alt="Currency symbol" src={getCryptocurrencyIcon(currency)}/> : null
                    }
                    title={
                        loading ? (
                            <Skeleton animation="wave" height={10} width="80%" style={{marginBottom: 6}}/>
                        ) : (
                            <Box component="div">
                                <FromCurrencyToCurrency model={model}/>
                            </Box>
                        )
                    }
                    subheader={loading ? <Skeleton animation="wave" height={10} width="40%"/> : (
                        <Box component="div" style={{display: 'flex', justifyContent: 'space-between'}}>
                            <Typography component="div" variant="body2" style={{whiteSpace: 'nowrap'}}>
                                {exchangeRateText({model})}
                            </Typography>
                            <Typography component="div" variant="body2">
                                <span className={classes.expenseText} style={{whiteSpace: 'nowrap'}}>
                                    {feeText({model})}
                                </span>
                                {' • '}
                                <span style={{whiteSpace: 'nowrap'}}>
                                    {easyTime(model.date)}
                                </span>
                            </Typography>
                        </Box>
                    )}
                />
            </CardActionArea>
            {loading ? null : (
                <IconButton onClick={handleClick}>
                    <MoreVertIcon/>
                </IconButton>
            )}
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={closeContextMenu}
            >
                <MenuItem onClick={handleDeleteClick} className={classes.deleteButton}>Delete</MenuItem>
            </Menu>
        </Card>
    );
};
