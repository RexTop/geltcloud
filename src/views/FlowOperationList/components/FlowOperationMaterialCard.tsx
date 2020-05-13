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
import {Box, CardActionArea, Menu, MenuItem, Typography} from "@material-ui/core";
import {easyTime} from "../../../utils/date-util";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            maxWidth: 500,
            margin: theme.spacing(0, 'auto', 1, 'auto'),
            display: 'flex',
            alignItems: 'center',
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
        deleteButton: {
            color: theme.palette.error.light,
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

    return (
        <Card className={classes.card}>
            <CardActionArea>
                <CardHeader
                    onClick={() => onEditClick(model)}
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
                    subheader={loading ? <Skeleton animation="wave" height={10} width="40%"/> : (
                        <Box component='div' style={{display: 'flex', justifyContent: 'space-between'}}>
                            <AccountText model={model}/>
                            <Typography variant="body2">
                                {easyTime(model.dateIssued)}
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
