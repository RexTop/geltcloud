import moment from "moment";

export type TradeOperationModel = {
    id: string,
    note: string | null,
    issuerNote: string | null,
    acquirerNote: string | null,
    issuerCashAccountID: string,
    issuerCurrency: string,
    acquirerCashAccountID: string,
    acquirerCurrency: string,
    amount: number,
    price: number,
    fee: number,
    exchangeRate: number,
    issuerExchangeRateInUsd: number,
    acquirerExchangeRateInUsd: number,
    dateIssued: string,
    dateAcquired: string,
    owner: string | null,
}

export const CreateTradeOperationModel = (): TradeOperationModel => (
    {
        id: '',
        note: '',
        issuerNote: '',
        acquirerNote: '',
        issuerCashAccountID: '',
        issuerCurrency: '',
        acquirerCashAccountID: '',
        acquirerCurrency: '',
        amount: 0,
        price: 0,
        fee: 0,
        exchangeRate: 0,
        issuerExchangeRateInUsd: 0,
        acquirerExchangeRateInUsd: 0,
        dateIssued: moment().startOf('day').utc().format(),
        dateAcquired: moment().startOf('day').utc().format(),
        owner: '',
    }
);
