const catalog = require('./catalog.json');
const sales = require('./sales.json');
const purchases = require('./purchases.json');
const moment = require('moment');

catalog.forEach(product => {

	product.price = Number(product.price.replace('R$ ', ''));
});

sales.forEach(sale => {

	sale.product_id = Number(sale.product_id);
	sale.price = catalog.find(p => p.id === sale.product_id).price;
	sale.timestamp = moment(sale.timestamp);
});

purchases.forEach(purchase => {

	purchase.price = Number(purchase.price.replace('R$ ', ''));
	purchase.timestamp = moment(purchase.timestamp);
});

sales.sort((a, b) => {

	if (a.timestamp.isBefore(b.timestamp)) {

		return -1;
	} else if (a.timestamp.isAfter(b.timestamp)) {

		return 1;
	}

	return 0;
});

purchases.sort((a, b) => {

	if (a.timestamp.isBefore(b.timestamp)) {

		return -1;
	} else if (a.timestamp.isAfter(b.timestamp)) {

		return 1;
	}

	return 0;
});

module.exports.catalog = catalog;
module.exports.sales = sales;
module.exports.purchases = purchases;