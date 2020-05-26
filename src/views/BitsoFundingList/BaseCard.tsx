import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {SvgIconComponent} from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
    card: {
        minWidth: 275,
        marginBottom: theme.spacing(2),
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    icon: {
        marginBottom: '-4px',
        marginRight: theme.spacing(1),
    },
}));

export const BaseCard = (
    {
        children,
        title,
        Icon,
        text,
    }: {
        children?: React.ReactNode,
        Icon: SvgIconComponent,
        title: string,
        text: string,

    }) => {
    const classes = useStyles();

    return (
        <Card className={classes.card}>
            <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom component="h1" variant="h1">
                    <Icon className={classes.icon}/>{title}
                </Typography>
                <Typography className={classes.pos} color="textSecondary" variant="body2">{text}</Typography>
                {children}
            </CardContent>
        </Card>
    );
};
