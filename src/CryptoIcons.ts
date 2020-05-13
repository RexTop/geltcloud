export const iconsManifest = require('../node_modules/cryptocurrency-icons/manifest.json');
export const btcIconSvg = require('../node_modules/cryptocurrency-icons/svg/icon/btc.svg');
export const ethIconSvg = require('../node_modules/cryptocurrency-icons/svg/icon/eth.svg');
export const ltcIconSvg = require('../node_modules/cryptocurrency-icons/svg/icon/ltc.svg');

export const allCryptocurrencySvgIcons = {
    'btc': btcIconSvg,
    'eth': ethIconSvg,
    'ltc': ltcIconSvg,
};

export const cryptocurrencyIconExists = (currency: string) => allCryptocurrencySvgIcons.hasOwnProperty(currency);

export const getCryptocurrencyIcon = (currency: string): string => (allCryptocurrencySvgIcons as any)[currency] || '';
