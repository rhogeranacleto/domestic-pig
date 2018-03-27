const catalog = require('./data.js').catalog;
const sales = require('./data.js').sales;
const purchases = require('./data.js').purchases;

var value = 0;

sales.forEach(sale => {

	value += sale.price;
});

purchases.forEach(purchase => {

	value -= purchase.price;
});

const s = sales.map(s => s.price).reduce((t, c) => c + t, 0);
const p = purchases.map(p => p.price).reduce((t, c) => c + t, 0);

console.log(value, s, p, s - p, sales[0], purchases[0]);