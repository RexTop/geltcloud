import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {Container, TextField} from "@material-ui/core";
import {LockOpen as LockOpenIcon, VpnKey as KeyIcon} from '@material-ui/icons';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import {BaseCard} from "./BaseCard";

const useStyles = makeStyles(theme => ({
    container: {
        marginTop: theme.spacing(2),
    },
    form: {
        '& > *': {
            margin: theme.spacing(1),
            width: '100%',
        },
    },
}));

export const LoadingCard = () => {
    return (
        <BaseCard
            Icon={HourglassEmptyIcon}
            title={'Please wait'}
            text={'Loading your keys'}/>
    );
};

export const PassphraseNotSetCard = () => {
    const classes = useStyles();
    const [password, setPassword] = React.useState('');

    return (
        <BaseCard
            Icon={LockOpenIcon}
            title={'Set a passphrase'}
            text={'In order protect your keys, you need to set a passphrase.'}>
            <form className={classes.form} noValidate autoComplete="off">
                <TextField
                    label="Passphrase"
                    type="password"
                    variant="outlined"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <Button variant="outlined" color="primary" type="submit">
                    Save
                </Button>
            </form>
        </BaseCard>
    );
};

export const BitsoApiKeysNotSetCard = () => {
    const classes = useStyles();
    const [apiKey, setApiKey] = React.useState('');
    const [apiSecret, setApiSecret] = React.useState('');

    return (
        <BaseCard
            Icon={KeyIcon}
            title={'Bitso API keys not set.'}
            text={'In order to access bitso you need to provide your Bitso API keys.'}>
            <form className={classes.form} noValidate autoComplete="off">
                <TextField
                    label="API key"
                    type="password"
                    variant="outlined"
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                />
                <TextField
                    label="API secret"
                    type="password"
                    variant="outlined"
                    value={apiSecret}
                    onChange={e => setApiSecret(e.target.value)}
                />
                <Button variant="outlined" color="primary">Save</Button>
            </form>
        </BaseCard>
    );
};

export const BitsoFundingList = () => {
    const css = useStyles();
    return (
        <Container fixed className={css.container}>
            <LoadingCard/>
            <PassphraseNotSetCard/>
            <BitsoApiKeysNotSetCard/>
        </Container>
    );
};
