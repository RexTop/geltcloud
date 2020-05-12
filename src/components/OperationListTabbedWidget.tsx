import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import {makeStyles, Theme, useTheme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {ASkeleton} from "../ASkeleton";

interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: any;
    value: any;
}

function TabPanel(props: TabPanelProps) {
    const {children, value, index, ...rest} = props;

    return (
        <div hidden={value !== index} {...rest}>
            {/*TODO Lazy load children.*/}
            {value === index && children}
        </div>
    );
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
    content: {
        flex: 1,
        padding: theme.spacing(1),
    },
}));

export const OperationListTabbedWidget = () => {
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index: number) => {
        setValue(index);
    };

    return (
        <div className={classes.root}>
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                >
                    <Tab label="Today"/>
                    <Tab label="Week"/>
                    <Tab label="Month"/>
                    <Tab label="Custom"/>
                </Tabs>
            </AppBar>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
                className={classes.content}
            >
                <TabPanel value={value} index={0} dir={theme.direction}>
                    <ASkeleton/>
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    <ASkeleton/>
                </TabPanel>
                <TabPanel value={value} index={2} dir={theme.direction}>
                    <ASkeleton/>
                </TabPanel>
                <TabPanel value={value} index={3} dir={theme.direction}>
                    <ASkeleton/>
                </TabPanel>
            </SwipeableViews>
        </div>
    );
};
