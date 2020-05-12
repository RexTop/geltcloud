import React from "react";

interface TabPanelProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    index: number;
    value: number;
}

export const TabPanel = (props: TabPanelProps) => {
    const {children, value, index, ...rest} = props;

    return (
        <div hidden={value !== index} {...rest}>
            {/*TODO Lazy load children.*/}
            {value === index && children}
        </div>
    );
};
