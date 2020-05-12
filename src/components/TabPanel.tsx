import React from "react";

interface TabPanelProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    index: number;
    value: number;
    lazyChildren?: () => React.ReactNode;
}

export const TabPanel = (props: TabPanelProps) => {
    const {children, lazyChildren, value, index, ...rest} = props;

    return (
        <div hidden={value !== index} {...rest}>
            {value === index && (children || (lazyChildren && lazyChildren()))}
        </div>
    );
};
