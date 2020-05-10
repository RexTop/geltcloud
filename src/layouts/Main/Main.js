import React, {useState} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {makeStyles, useTheme} from '@material-ui/styles';
import {useMediaQuery} from '@material-ui/core';
import {BOTTOM_NAVIGATION_HEIGHT, MainBottomNavigation} from "./components/MainBottomNavigation";

const USES_TOP_BAR = false;

const useStyles = makeStyles(theme => ({
    root: {
        ...USES_TOP_BAR ? {paddingTop: 56} : {},
        [theme.breakpoints.up('sm')]: {
            ...USES_TOP_BAR ? {paddingTop: 64} : {},
        }
    },
    shiftContent: {
        // TODO: Find out what this is.
        paddingLeft: 240
    },
    content: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: BOTTOM_NAVIGATION_HEIGHT,
    }
}));

const Main = props => {
    const {children} = props;

    const classes = useStyles();
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), {
        defaultMatches: true
    });

    const [openSidebar, setOpenSidebar] = useState(false);

    const handleSidebarOpen = () => {
        setOpenSidebar(true);
    };

    const handleSidebarClose = () => {
        setOpenSidebar(false);
    };

    const shouldOpenSidebar = isDesktop ? true : openSidebar;

    return (
        <div
            className={clsx({
                [classes.root]: true,
                [classes.shiftContent]: isDesktop
            })}
        >
            <MainBottomNavigation/>
            {/*
            The top bar and sidebar navigation elements are deprecated in favour to the new bottom navigation widget.
            <Topbar onSidebarOpen={handleSidebarOpen}/>
            <Sidebar
                onClose={handleSidebarClose}
                open={shouldOpenSidebar}
                variant={isDesktop ? 'persistent' : 'temporary'}
            />
            */}
            <main className={classes.content}>
                {children}
            </main>
        </div>
    );
};

Main.propTypes = {
    children: PropTypes.node
};

export default Main;
