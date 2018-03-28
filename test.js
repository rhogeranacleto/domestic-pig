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

console.log(value, s, p, s - p, sales[0], purchases[purchases.length-1]);