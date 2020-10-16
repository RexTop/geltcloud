import React from 'react';
import {FormControlLabel, Radio, RadioGroup} from "@material-ui/core";
import {notStonksTextColor, stonksTextColor} from "../theme/colors";
import {FlowType} from '../models/FlowType';

export const ToggleFlowType = ({type, onChange}: { type: FlowType, onChange: (value: FlowType) => void }) => {
    return <RadioGroup row defaultValue="top">
        <FormControlLabel
            control={<Radio color="primary" checked={type === 'income'}
                            onChange={e => onChange(e.target.checked ? 'income' : 'expense')}/>}
            label={<span style={{color: stonksTextColor}}>
                Income
            </span>}
        />
        <FormControlLabel
            control={<Radio color="primary" checked={type === 'expense'}
                            onChange={e => onChange(!e.target.checked ? 'income' : 'expense')}/>}
            label={<span style={{color: notStonksTextColor}}>
                Expense
              </span>}
        />
    </RadioGroup>
};
