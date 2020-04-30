import React from 'react';
import {FormControlLabel, Radio, RadioGroup} from "@material-ui/core";
import {notStonksTextColor, stonksTextColor} from "../theme/colors";

export const ToggleFlowType = ({amount, onChange}: { amount: number, onChange: (amount: number) => void }) => {
    return <RadioGroup row defaultValue="top">
        <FormControlLabel
            control={<Radio color="primary" checked={amount >= 0}
                            onChange={e => onChange(e.target.checked ? Math.abs(amount) : -Math.abs(amount))}/>}
            label={<span style={{color: stonksTextColor}}>
                Income
            </span>}
        />
        <FormControlLabel
            control={<Radio color="primary" checked={amount < 0}
                            onChange={e => onChange(e.target.checked ? -Math.abs(amount) : Math.abs(amount))}/>}
            label={<span style={{color: notStonksTextColor}}>
                Expense
              </span>}
        />
    </RadioGroup>
};
