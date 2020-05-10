import moment from "moment";
import {CashAccountModel} from "./CashAccountModel";

export type FlowOperationModel = {
    id: string
    amount: number
    dateIssued: string
    description: string
    tags: string[]
    bankNote?: string | null
    issuerCashAccountID: string
    issuerCashAccount?: CashAccountModel | null
    owner: string | null
}

export const CreateFlowOperationModel = (): FlowOperationModel => (
    {
        id: '',
        amount: 0,
        dateIssued: moment().startOf('day').utc().format(),
        description: '',
        tags: [],
        bankNote: '',
        issuerCashAccountID: '',
        owner: '',
    }
);
