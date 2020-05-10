import moment from "moment";
import {CashAccountModel} from "./CashAccountModel";

export type TradeOperationModel = {
    id: string,
    note: string | null,

    issuerCashAccountID: string,
    issuerCashAccount?: CashAccountModel | null,
    issuerNote: string | null,

    acquirerCashAccountID: string,
    acquirerCashAccount?: CashAccountModel | null,
    acquirerNote: string | null,

    amount: number,
    amountCurrency: string,
    amountFee: number,

    price: number,
    priceCurrency: string,
    priceFee: number,

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

        issuerCashAccountID: '',
        issuerNote: '',

        acquirerCashAccountID: '',
        acquirerNote: '',

        amount: 0,
        amountCurrency: '',
        amountFee: 0,

        price: 0,
        priceCurrency: '',
        priceFee: 0,

        exchangeRate: 0,
        issuerExchangeRateInUsd: 0,
        acquirerExchangeRateInUsd: 0,

        dateIssued: moment().startOf('day').utc().format(),
        dateAcquired: moment().startOf('day').utc().format(),

        owner: '',
    }
);
