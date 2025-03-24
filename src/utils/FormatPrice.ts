export function formatPrice(price: number | string) {
  if (!price) return 0;
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// raw JP currency
const JAPANESE_YEN = { code: 'JPY', symbol: '\u00a5', name: 'Japanese yen' };

export const getCurrency = () => {
  const currency = JSON.parse(localStorage.getItem('currency') || 'null');

  return currency || JAPANESE_YEN;
};

export const roundingPrice = (price?: number | string) => {
  // this constant can be changes or responsive to system's business
  const digit = 2;
  return (Math.round(Number(price || 0) * 10 ** digit) / 10 ** digit).toString();
};

export const formatPriceWithCurrency = (price?: number | string) => {
  const rawValue = price && !isNaN(Number(price)) ? price : '0';
  const value = roundingPrice(rawValue);

  const formatedValue = new Intl.NumberFormat('en-US')
    .format(Math.abs(Number(value)) as any)
    .toString();

  const currency = getCurrency();

  return `${Number(value) < 0 ? '-' : ''} ${formatedValue} ${currency.code}`;
};
