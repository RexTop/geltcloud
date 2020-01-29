import React from 'react';
import {Link as RouterLink} from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/styles';
import {Avatar, Typography} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import {Auth} from "aws-amplify";
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {currentUserPhoneNumber} from "../../../../../../utils/auth-util";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: 'fit-content'
    },
    avatar: {
        width: 60,
        height: 60
    },
    name: {
        marginTop: theme.spacing(1)
    }
}));

const Profile = props => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSignOut = async () => {
        try {
            await Auth.signOut();
        } catch (error) {
            console.error('Error signing out user', {error});
        } finally {
            handleClose();
        }
    };

    const {className, ...rest} = props;

    const classes = useStyles();

    const user = {
        name: 'Shen Zhi',
        avatar: '/images/avatars/avatar_11.png',
        bio: 'Brain Director'
    };

    return (
        <div
            {...rest}
            className={clsx(classes.root, className)}
        >
            <Avatar
                alt="Person"
                className={classes.avatar}
                component={RouterLink}
                src={user.avatar}
                to="/settings"
            />
            <Button onClick={handleClick} className={classes.name}>
                {currentUserPhoneNumber()}<ArrowDropDownIcon/>
            </Button>
            <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
                <MenuItem onClick={handleSignOut}>Logout</MenuItem>
            </Menu>
            <Typography variant="body2">Welcome</Typography>
        </div>
    );
};

Profile.propTypes = {
    className: PropTypes.string
};

export default Profile;
