var data;

if (process.env.TEST) {

	data = require('./data.test.js');
} else {

	data = require('./data.js');
}
const catalog = data.catalog;
const sales = data.sales;
const purchases = data.purchases;
const moment = require('moment');
const fs = require('fs');

var value = 0;

const dates = [];

const salesParcels = [];
const purchasesParcels = [];

var day = sales[0].timestamp.isBefore(purchases[0].timestamp) ? moment(sales[0].timestamp).startOf('d') : moment(purchases[0].timestamp).startOf('d');

do {

	const daySales = sales.filter(sale => moment(sale.timestamp).startOf('d').isSame(day));

	const todayPurchases = purchases.filter(purchase => moment(purchase.timestamp).startOf('d').isSame(day));

	daySales.forEach(sale => {

		if (sale.payment_method === 'debit') {

			value += sale.price;
		} else {

			const parcel = sale.price / sale.n_payments;

			const firstMonth = moment(day).startOf('month');

			if (sale.timestamp.date() >= 5) {

				firstMonth.add(1, 'month');
			}

			for (let i = 0; i < sale.n_payments; i++) {

				const month = moment(firstMonth).add(i, 'month');

				salesParcels.push({
					month,
					parcel
				});
			}
		}
	});

	todayPurchases.forEach(purchase => {

		if (purchase.payment_method === 'debit') {

			value -= purchase.price;
		} else {

			const parcel = purchase.price / purchase.n_payments;

			const firstMonth = moment(day).startOf('month');

			if (purchase.timestamp.date() >= 5) {

				firstMonth.add(1, 'month');
			}

			for (let i = 0; i < purchase.n_payments; i++) {

				const month = moment(firstMonth).add(i, 'month');

				purchasesParcels.push({
					month,
					parcel
				});
			}
		}
	});

	if (day.date() === 10) {

		const salesParcelsOnMonth = salesParcels.filter(s => moment(day).startOf('month').isSame(s.month));

		salesParcelsOnMonth.forEach(sale => {

			value += sale.parcel;
		});

		const purchasesParcelsOnMonth = purchasesParcels.filter(p => moment(day).startOf('month').isSame(p.month));

		purchasesParcelsOnMonth.forEach(sale => {

			value -= sale.parcel;
		});
	}

	if (dates.length && dates[dates.length - 1].value !== parseInt(value) || !dates.length) {

		dates.push({
			date: day.format('YYYY-MM-DD'),
			value: parseInt(value)
		});
		console.log(day.format('DD-MM-YYYY'), value, salesParcels.filter(s => s.month.isAfter(day)).length, purchasesParcels.filter(p => p.month.isAfter(day)).length);
	}

	day.add(1, 'd');

} while (day.year() < 2018 || salesParcels.filter(s => s.month.isAfter(day)).length || purchasesParcels.filter(p => p.month.isAfter(day)).length);

fs.writeFile("./result.json", JSON.stringify(dates), function (err) {

	if (err) {

		return console.log(err);
	}

	console.log('ok', value);
});