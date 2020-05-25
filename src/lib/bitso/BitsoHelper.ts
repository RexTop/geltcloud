import axios from 'axios';

export class BitsoHelper {

    private readonly baseUrl: string;

    constructor(
        private key: string,
        private secret: string,
        baseUrl: string,
    ) {
        this.baseUrl = baseUrl.replace(/\/+$/, '');
    }

    private get config() {
        return {
            headers: {
                'x-geltcloud-auth-key': this.key,
                'x-geltcloud-auth-secret': this.secret,
            }
        };
    }

    public getBalance(): Promise<BitsoSuccessResponse<{ balances: BitsoBalance[] }>> {
        return axios.get(this.baseUrl + '/v3/balance/', this.config).then(result => result.data);
    }
}

export interface BitsoSuccessResponse<T> {
    success: true
    payload: T
}

export interface BitsoErrorResponse<T> {
    success: false
    error: {
        message: string
        code: string
    }
}

export type BitsoCurrency = string;

export type NumericString = string;

export interface BitsoBalance {
    currency: BitsoCurrency
    available: NumericString
    locked: NumericString
    total: NumericString
    pending_deposit: NumericString
    pending_withdrawal: NumericString
}
