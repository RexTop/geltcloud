const CurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const money = (value: number) => CurrencyFormatter.format(value);
