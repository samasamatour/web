export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function estimateUSD(amountIDR: number, usdToIdr: number): string {
  if (!usdToIdr || usdToIdr <= 0) {
    return '-';
  }

  const usd = amountIDR / usdToIdr;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(usd);
}
