export type TransferOperationModel = {
  id: string
  amount: number
  dateIssued: string
  description: string
  tags: string[]
  acquirerBankNote?: string | null
  issuerBankNote?: string | null
  issuerCashAccountID: string
  owner: string | null
  acquirerCashAccountID: string
  dateAcquired: string
}

export const CreateTransferOperationModel = (): TransferOperationModel => (
  {
    id: '',
    amount: 0,
    dateIssued: '',
    description: '',
    tags: [],
    acquirerBankNote: '',
    issuerBankNote: '',
    issuerCashAccountID: '',
    owner: '',
    acquirerCashAccountID: '',
    dateAcquired: '',
  }
);
