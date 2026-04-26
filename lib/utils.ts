export const DEFAULT_EUR_TO_ALL = 123
export const fmt = (n: number) => '€' + n.toFixed(2)
export const fmtLek = (eur: number, rate: number = DEFAULT_EUR_TO_ALL) => {
  const all = Math.round(eur * rate)
  return all.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' L'
}
export const disc = (price: number, oldPrice: number) =>
  '-' + Math.round((1 - price / oldPrice) * 100) + '%'
export const ini = (name: string) =>
  (name || 'U')
    .split(' ')
    .filter(Boolean)
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
