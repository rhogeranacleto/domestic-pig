var data;

if (process.env.TEST) {

	data = require('./data.test.js');
} else {

	data = require('./data.js');
}
const catalog = data.catalog;
const sales = data.sales;
const purchases = data.purchases;

var value = 0;

sales.forEach(sale => {

	value += sale.price;
});

purchases.forEach(purchase => {

	value -= purchase.price;
});

const s = sales.map(s => s.price).reduce((t, c) => c + t, 0);
const p = purchases.map(p => p.price).reduce((t, c) => c + t, 0);

console.log('TOTAL', value);
console.log('vendas', s);
console.log('vendas debito', sales.filter(sa => sa.payment_method === 'debit').length, 'vendas credito', sales.filter(sa => sa.payment_method === 'credit').length);
console.log('Total debito', sales.filter(sa => sa.payment_method === 'debit').map(a => a.price).reduce((t, c) => c + t, 0), 'total credito', sales.filter(sa => sa.payment_method === 'credit').map(a => a.price).reduce((t, c) => c + t, 0));
console.log('compras', p);
console.log('compra debito', purchases.filter(sa => sa.payment_method === 'debit').length, 'compra credito', purchases.filter(sa => sa.payment_method === 'credit').length);
console.log('total debito', purchases.filter(sa => sa.payment_method === 'debit').map(a => a.price).reduce((t, c) => c + t, 0), 'total credito', purchases.filter(sa => sa.payment_method === 'credit').map(a => a.price).reduce((t, c) => c + t, 0));