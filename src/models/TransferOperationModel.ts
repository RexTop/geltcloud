import moment from "moment";
import {CashAccountModel} from "./CashAccountModel";

export type TransferOperationModel = {
    id: string
    amount: number
    dateIssued: string
    description: string
    tags: string[]
    acquirerBankNote?: string | null
    issuerBankNote?: string | null
    issuerCashAccountID: string
    issuerCashAccount?: CashAccountModel | null
    owner: string | null
    acquirerCashAccountID: string
    acquirerCashAccount?: CashAccountModel | null
    dateAcquired: string
    fee: number | null
}

export const CreateTransferOperationModel = (): TransferOperationModel => (
    {
        id: '',
        amount: 0,
        dateIssued: moment().startOf('day').utc().format(),
        description: '',
        tags: [],
        acquirerBankNote: '',
        issuerBankNote: '',
        issuerCashAccountID: '',
        owner: '',
        acquirerCashAccountID: '',
        dateAcquired: moment().startOf('day').utc().format(),
        fee: 0,
    }
);
