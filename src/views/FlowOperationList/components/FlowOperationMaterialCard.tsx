import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Skeleton from '@material-ui/lab/Skeleton';
import {FlowOperationModel} from "../../../models/FlowOperationModel";
import {TrendingDown, TrendingUp} from "@material-ui/icons";
import {notStonksTextColor, stonksTextColor} from "../../../theme/colors";
import {money} from "../../../utils/money";
import {Box, Typography} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            maxWidth: 500,
            margin: theme.spacing(0, 'auto', 1, 'auto'),
        },

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
    }),
);

interface Props {
    loading?: boolean
    model: FlowOperationModel
    onEditClick: (item: FlowOperationModel) => void
    onDeleteClick: (item: FlowOperationModel) => void
}

const AccountText = ({model}: { model: FlowOperationModel }) => {
    const classes = useStyles();
    const accountText = model?.issuerCashAccount?.name ||
        <Typography variant="body2" className={classes.unknownAccount}>Unknown account</Typography>;
    return <Typography variant="body2">{accountText}</Typography>;
};

const Amount = ({model: {amount}}: { model: FlowOperationModel }) => {
    const classes = useStyles();
    return <Typography variant="body1" className={amount < 0 ? classes.expenseText : classes.incomeText}>
        {money(amount)}
    </Typography>
};

export const FlowOperationMaterialCard = (
    {
        loading = false,
        onEditClick,
        onDeleteClick,
        model
    }: Props) => {
    const classes = useStyles();

    return (
        <Card className={classes.card}>
            <CardHeader
                avatar={
                    loading ? (
                        <Skeleton animation="wave" variant="circle" width={40} height={40}/>
                    ) : (
                        <Avatar
                            alt="Operation Type"
                            className={model.amount < 0 ? classes.expenseAvatar : classes.incomeAvatar}
                        >
                            {model.amount < 0 ? <TrendingDown/> : <TrendingUp/>}
                        </Avatar>
                    )
                }
                action={
                    loading ? null : (
                        <IconButton onClick={() => onEditClick(model)}>
                            <MoreVertIcon/>
                        </IconButton>
                    )
                }
                title={
                    loading ? (
                        <Skeleton animation="wave" height={10} width="80%" style={{marginBottom: 6}}/>
                    ) : (
                        <Box component='div' style={{display: 'flex', justifyContent: 'space-between'}}>
                            <Typography variant="body1">
                                {model.description}
                            </Typography>
                            <Amount model={model}/>
                        </Box>
                    )
                }
                subheader={loading ? <Skeleton animation="wave" height={10} width="40%"/> :
                    <AccountText model={model}/>}
            />
        </Card>
    );
};
