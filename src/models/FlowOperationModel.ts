import moment from "moment";

export type FlowOperationModel = {
  id: string
  amount: number
  dateIssued: string
  description: string
  tags: string[]
  bankNote?: string | null
  issuerCashAccountID: string
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
