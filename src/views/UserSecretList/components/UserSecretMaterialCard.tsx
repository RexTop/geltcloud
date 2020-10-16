import React from 'react';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Skeleton from '@material-ui/lab/Skeleton';
import {UserSecretModel} from "../../../models/UserSecretModel";
import {Autorenew as AutorenewIcon, TrendingDown} from "@material-ui/icons";
import {notStonksTextColor} from "../../../theme/colors";
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
        neutralText: {},
        neutralAvatar: {},
        deleteButton: {
            color: theme.palette.error.light,
        },
    }),
);

interface Props {
    loading?: boolean
    model: UserSecretModel
    onEditClick: (item: UserSecretModel) => void
    onDeleteClick: (item: UserSecretModel) => void
}

// const FromAccountToAccountText = ({model}: { model: UserSecretModel }) => {
//     const classes = useStyles();
//     const fromText = model?.issuerCashAccount?.name ||
//         <Box component="div" className={classes.unknownAccount}>Unknown account</Box>;
//     const toText = model?.acquirerCashAccount?.name ||
//         <Box component="div" className={classes.unknownAccount}>Unknown account</Box>;
//     return <Typography variant="body2">{fromText} to {toText}</Typography>;
// };

// const Amount = ({model: {amount}}: { model: UserSecretModel }) => {
//     const classes = useStyles();
//     return <Typography variant="body1" className={amount < 0 ? classes.expenseText : classes.neutralText}>
//         {money(amount)}
//     </Typography>
// };

export const UserSecretMaterialCard = (
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
                    title={
                        loading ? (
                            <Skeleton animation="wave" height={10} width="80%" style={{marginBottom: 6}}/>
                        ) : (
                            <Box component='div' style={{display: 'flex', justifyContent: 'space-between'}}>
                                <Typography variant="body1">
                                    {model.key}
                                </Typography>
                            </Box>
                        )
                    }
                    subheader={loading ? <Skeleton animation="wave" height={10} width="40%"/> : (
                        <Box component='div' style={{display: 'flex', justifyContent: 'space-between'}}>
                            <Typography variant="body2">
                                {model.value}
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
