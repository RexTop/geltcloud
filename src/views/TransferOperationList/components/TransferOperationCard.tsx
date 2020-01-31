import React from 'react';
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import {CardProps} from "@material-ui/core/Card/Card";
import {TransferOperationModel} from "../../../models/TransferOperationModel";
import {money} from "../../../utils/money";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import {makeStyles} from "@material-ui/styles";
import {Theme} from "@material-ui/core/styles";
import {easyDate} from "../../../utils/date-util";
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

type Props = CardProps & {
  transferOperation: TransferOperationModel
  onEditClick: (item: TransferOperationModel) => void
  onDeleteClick: (item: TransferOperationModel) => void
}

const useStyles = makeStyles((theme: Theme) => ({
  unknownAccount: {
    color: theme.palette.error.main,
  },
  secondaryText: {
    display: 'flex',
    alignItems: 'center',
  },
}));

export const TransferOperationCard = (props: Props) => {
  const {transferOperation, onEditClick, onDeleteClick} = props;
  const classes = useStyles();

  return (
    <ListItem button onClick={() => onEditClick(transferOperation)}>
      <ListItemIcon>
        <TrendingUpIcon/>
      </ListItemIcon>
      <ListItemText
        primary={transferOperation.description}
        secondary={(
          <span className={classes.secondaryText}>
            {money(transferOperation.amount)}
            {' - '}
            {(transferOperation as any)?.issuerCashAccount?.name ||
            <span className={classes.unknownAccount}>Unknown account</span>}
            {' - '}
            {easyDate(transferOperation.dateIssued)}
            <ChevronRightIcon/>
            {easyDate(transferOperation.dateAcquired)}
          </span>
        )}
      />
      {/*TODO: Don't use 'any'. Remove the MODELS and use the autogenerated ts code.*/}
      <ListItemSecondaryAction>
        <IconButton edge="end" aria-label="delete" onClick={() => onDeleteClick(transferOperation)}>
          <DeleteIcon/>
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};
