import React from "react";

export const BareButton = React.forwardRef((props: any, ref: any) => (
    <button ref={ref} {...props}>{props.children}</button>)
);
