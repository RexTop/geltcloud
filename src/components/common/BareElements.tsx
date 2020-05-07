import React from "react";

export const BareButton = React.forwardRef((props: any, ref: any) => (
    <button ref={ref} {...props}>{props.children}</button>)
);

export const BareDiv = React.forwardRef((props: any, ref: any) => (
    <div ref={ref} {...props}>{props.children}</div>)
);

export const BareLi = React.forwardRef((props: any, ref: any) => (
    <li ref={ref} {...props}>{props.children}</li>)
);

