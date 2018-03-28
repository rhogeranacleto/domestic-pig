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
var Big = require('big.js');

var value = new Big(0);

const dates = [];

const salesParcels = [];
const purchasesParcels = [];

var day = sales[0].timestamp.isBefore(purchases[0].timestamp) ? moment(sales[0].timestamp).startOf('d') : moment(purchases[0].timestamp).startOf('d');

function filterThisDay(type, day) {
	
	return type.filter(t => moment(t.timestamp).startOf('d').isSame(day.startOf('d')));
}

do {

	const daySales = filterThisDay(sales, day);

	const todayPurchases = filterThisDay(purchases, day);

	daySales.forEach(sale => {

		if (sale.payment_method === 'debit') {

			value = value.plus(sale.price);
		} else {

			var parcel = new Big(sale.price).div(sale.n_payments);
			var add;

			if (!parcel.eq(sale.price)) {

				// add = new Big(sale.price).minus(new Big(parcel).times(sale.n_payments));
			}

			const firstMonth = moment(day).startOf('month');

			if (sale.timestamp.date() >= 5) {

				firstMonth.add(1, 'month');
			}

			for (let i = 0; i < sale.n_payments; i++) {

				const month = moment(firstMonth).add(i, 'month');

				if (i === (sale.n_payments - 1) && add) {

					parcel = parcel.plus(add);
					//console.log(parcel.toString());
				}

				salesParcels.push({
					month,
					parcel
				});
			}
		}
	});

	todayPurchases.forEach(purchase => {

		if (purchase.payment_method === 'debit') {

			value = value.minus(purchase.price);
		} else {

			var parcel = new Big(purchase.price).div(purchase.n_payments);
			var add;

			if (!parcel.eq(purchase.price)) {

				// add = new Big(purchase.price).minus(new Big(parcel).times(purchase.n_payments));
			}

			const firstMonth = moment(day).startOf('month');

			if (purchase.timestamp.date() >= 5) {

				firstMonth.add(1, 'month');
			}

			for (let i = 0; i < purchase.n_payments; i++) {

				const month = moment(firstMonth).add(i, 'month');

				if (i === (purchase.n_payments - 1) && add) {

					parcel = parcel.plus(add);
					//console.log(parcel.toString());
				}

				purchasesParcels.push({
					month,
					parcel
				});
			}
		}
	});

	if (day.date() === 10) {

		const ss = salesParcels.filter(s => moment(day).startOf('month').isSame(s.month));

		ss.forEach(s => {

			salesParcels.splice(salesParcels.indexOf(s), 1);
		});

		const sss = ss.map(s => s.parcel).reduce((t, c) => new Big(t).plus(c), 0)

		const pp = purchasesParcels.filter(p => moment(day).startOf('month').isSame(p.month));

		pp.forEach(p => {

			purchasesParcels.splice(purchasesParcels.indexOf(p), 1);
		});

		const ppp = pp.map(p => p.parcel).reduce((t, c) => new Big(t).plus(c), 0);

		value = value.plus(new Big(sss).minus(ppp));
	}

	//if (dates.length && dates[dates.length - 1].value !== Math.round(value) || !dates.length) {

	dates.push({
		date: day.format('YYYY-MM-DD'),
		value: parseInt(value.toString())
	});

	console.log(day.format('DD-MM-YYYY'), value.toString(), parseInt(value.toString()), Math.round(value.toString()), salesParcels.length, purchasesParcels.length);
	//}

	day.add(1, 'd');

} while (day.year() < 2018 || salesParcels.length || purchasesParcels.length);

fs.writeFile("./result.json", JSON.stringify(dates), function (err) {

	if (err) {

		return console.log(err);
	}

	console.log('ok', value.toString(), dates.length);
});