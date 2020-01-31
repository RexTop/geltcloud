import {CashAccountType} from "../API";

export type CashAccountModel = {
  id: string,
  name: string,
  balance: number,
  active: boolean,
  type: CashAccountType,
  credit: number,
  closingDay: number,
  paymentDay: number,
  last4: string,
  owner: string | null,
}

export const CreateCashAccountModel = (): CashAccountModel => (
  {
    id: '',
    name: '',
    balance: 0,
    active: true,
    type: CashAccountType.CASH_ACCOUNT,
    credit: 0,
    closingDay: 0,
    paymentDay: 0,
    last4: '',
    owner: '',
  }
);
