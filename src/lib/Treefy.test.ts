import {treefy} from './Treefy';

test('creates hierarchy correctly', () => {
    const slashSeparatedValues = [
        'Bitso / TUSD',
        'Cash / MXN',
        'Banamex / Credit',
        'Mercado Pago',
        'Cold Wallet / One / LTC 1 (segwit)',
        'Cold Wallet / One / BTC 1 (native segwit)',
        'Bitso / ETH',
        'Santander / Credit',
        'Banamex / Premia / One',
        'Banamex / Premia / Two',
        'Car Cash',
        'Santander / Debit',
        'Bitso / LTC',
        'BBVA / Debit',
        'Bitso / MXN',
        'Bitso / BTC',
        'Cold Wallet / One / ETH 1',
        'Cold Wallet / One / BTC 1 (segwit)',
        'Banamex / Maestra',
        'Cold Wallet / Two / DAI',
        'Cold Wallet / Two / ETH',
        'Cold Wallet / LLC / DAI',
        'Cold Wallet / LLC / ETH',
    ];

    const treeValues = {
        "Bitso": {
            "TUSD": {},
            "ETH": {},
            "LTC": {},
            "MXN": {},
            "BTC": {},
        },
        "Cash": {
            "MXN": {},
        },
        "Banamex": {
            "Credit": {},
            "Premia": {
                "One": {},
                "Two": {},
            },
            "Maestra": {},
        },
        "Mercado Pago": {},
        "Cold Wallet": {
            "One": {
                "LTC 1 (segwit)": {},
                "BTC 1 (native segwit)": {},
                "ETH 1": {},
                "BTC 1 (segwit)": {},
            },
            "Two": {
                "DAI": {},
                "ETH": {},
            },
            "LLC": {
                "DAI": {},
                "ETH": {},
            },
        },
        "Santander": {
            "Credit": {},
            "Debit": {},
        },
        "Car Cash": {},
        "BBVA": {
            "Debit": {},
        },
    };

    const tree = treefy({separator: '/', stringArray: slashSeparatedValues});

    expect(tree).toStrictEqual(treeValues);
});
