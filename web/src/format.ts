const eur = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' });

export const money = (n: number | undefined) => eur.format(n ?? 0);
