import currencyCodes from 'currency-codes'

const CurrencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

export const money = (value: number) => CurrencyFormatter.format(value);

/**
 * Returns true if the given currency code corresponds to a crypto currency.
 *
 * Currently 5/10/2020 cryptocurrencies are not part of the 'ISO-4217' standard, so if a currency code is not found in
 * the currency dictionary we assume it's a crypto currency.
 *
 * @param currencyCode
 */
export const isCryptocurrency = (currencyCode: string) => {
    return !currencyCodes.code(currencyCode);
};

/**
 * Formats a number as a currency. It supports crypto currencies in a naive way.
 *
 * Why it's naive?
 *
 * If the provided currency is not a 'ISO-4217' currency we assume it's a crypto currency and we format it like so:
 * `value + space + upper_case_currency` thus not taking into account the locale details eg. the japanese yen can be
 * expressed as "￥123,457" with a locale "ja-JP", as "123 457 ¥" with "ru-RU", as "JP¥ 123,457" with "ar-AR", however
 * the crypto formatting formula does not take into account those details.
 */
export const naiveMoneyFormat = ({value, currency}: { value: number, currency: string }) => {
    const iso4217Currency = currencyCodes.code(currency);

    if (!iso4217Currency) {
        // TODO: We need to do something with the 'en-US' parameter, and also take into account locales when formatting crypto currencies.
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
        });
        return formatter.format(value);
    }

    return `${value} ${currency}`;
};
