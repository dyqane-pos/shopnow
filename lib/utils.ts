export const fmt = (n: number) => '$ ' + n.toFixed(2)
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
