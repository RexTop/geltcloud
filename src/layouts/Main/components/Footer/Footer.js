import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/styles';
import {Link, Typography} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4)
    }
}));

const Footer = props => {
    const {className, ...rest} = props;

    const classes = useStyles();

    return (
        <div {...rest} className={clsx(classes.root, className)}>
            <Typography variant="body1">
                &copy;{' '}
                <Link component="a" href="https://ok.codes" target="_blank">
                    ok.codes
                </Link>
                {' '}{new Date().getFullYear()}
            </Typography>
            <Typography variant="caption">
                Enjoy the magic!
            </Typography>
        </div>
    );
};

Footer.propTypes = {
    className: PropTypes.string
};

export default Footer;
