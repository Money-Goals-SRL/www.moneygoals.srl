// Class Transaction contains method and attributes for every transaction that you want to insert.

class Transaction {
	// put 1.0 forex rate if commission are calculated in stock base currency
	constructor(date, price, currency, quantity, ticker, type, fxRate, commission) {
		this.date = new Date(date).toISOString().split("T")[0];
		this.price = price;
		this.currency = currency;
		this.quantity = quantity;
		this.ticker = ticker;
		this.type = type;
		this.forexRate = fxRate;
		this.commission = commission;
	}

	calcAmount() {
		return this.price * this.quantity;
	}

	calcCurrencyCost() {
		if (this.type == "Buy") {
			return this.price * this.quantity + this.commission * this.forexRate;
		} else if (this.type == "Sell") {
			return -this.price * this.quantity + this.commission * this.forexRate;
		}
		return 0;
	}
	calcEurCost() {
		return this.price * this.forexRate * this.quantity;
	}

	calcTotEurCost() {
		if (this.type == "Buy") {
			return (this.price / this.forexRate) * this.quantity + this.commission;
		} else if (this.type == "Sell") {
			return -(this.price / this.forexRate) * this.quantity + this.commission;
		}
		return 0;
	}
}

class Dividend {
	// put 1.0 forex rate if commission are calculated in stock base currency
	constructor(date, dps, currency, quantity, ticker, withholdingTaxRate, commission) {
		this.date = new Date(date).toISOString().split("T")[0];
		this.dps = dps;
		this.currency = currency;
		this.quantity = quantity;
		this.ticker = ticker;
		this.tax = withholdingTaxRate * dps * quantity;
		this.commission = commission;
		this.grossAmount = dps * quantity;
		this.netAmount = dps * quantity * (1 - withholdingTaxRate) - commission;
	}
}

// La classe Position rappresenta una posizione finanziaria all'interno del portafoglio
// complessivo, ed è costruita a partire da un ticker, una valuta base e una lista di
// transazioni

class Position {
	constructor(ticker, currency, transList, divList) {
		this.ticker = ticker;
		this.shares = this.calcTotalShares(transList);
		this.avgBuyPrice = this.calcAvgBuyPrice(transList);
		this.currency = currency;
		this.totalPurchaseCost = this.calcTotalPurchaseCost(transList);
		this.totalSellingRevenue = this.calcTotalSellingRevenue(transList);
		this.totalCommissions = this.calcTotalCommission(transList);
		this.totalNetDividends = this.calcNetDividends(divList);
	}

	calcAvgBuyPrice(transList) {
		let totalCost = 0;
		let totalShares = 0;
		transList.forEach((t, i) => {
			if (t.ticker == this.ticker && t.type == "Buy") {
				totalCost = totalCost + t.calcAmount();
				totalShares = totalShares + t.quantity;
			}
		});
		if (totalShares) {
			return totalCost / totalShares;
		} else {
			return 0;
		}
	}

	calcTotalShares(transList) {
		let totalShares = 0;
		transList.forEach((t, i) => {
			if (t.ticker == this.ticker) {
				if (t.type == "Buy") {
					totalShares = totalShares + t.quantity;
				} else if (t.type == "Sell") {
					totalShares = totalShares - t.quantity;
				}
			}
		});
		return totalShares;
	}

	calcTotalPurchaseCost(transList) {
		let total = 0;
		transList.forEach((t) => {
			if (t.ticker == this.ticker && t.type == "Buy") {
				total += t.calcAmount();
			}
		});
		return total;
	}

	calcTotalSellingRevenue(transList) {
		let total = 0;
		transList.forEach((t) => {
			if (t.ticker == this.ticker && t.type == "Sell") {
				total += t.calcAmount();
			}
		});
		return total;
	}

	calcTotalCommission(transList) {
		let total = 0;
		transList.forEach((t) => {
			if (t.ticker == this.ticker) {
				total += t.commission;
			}
		});
		return total;
	}

	calcNetDividends(divList) {
		let total = 0;
		divList.forEach((d) => {
			if (d.ticker == this.ticker) {
				total += d.netAmount;
			}
		});
		return total;
	}
}

// La funzione ritorna un array che contiene tutti i diversi elementi dell'array in input, senza ripetizioni
function onlyUnique(value, index, self) {
	return self.indexOf(value) === index;
}

function filterUniqueFirstElements(arr) {
	const uniqueFirstElements = new Set();
	return arr.filter((subarray) => {
		const firstElement = subarray[0];
		if (!uniqueFirstElements.has(firstElement)) {
			uniqueFirstElements.add(firstElement);
			return true;
		}
		return false;
	});
}

// La funzione ritorna il portafoglio titoli a partire da un array di transazioni
function createPortfolio(transactionList, dividendList) {
	let tkrs = [[String, String]];
	let pf = [Position];
	transactionList.forEach((t, i) => {
		tkrs[i] = [t.ticker, t.currency];
	});
	tkrs = filterUniqueFirstElements(tkrs);
	tkrs.forEach(function (tkr, i) {
		pf[i] = new Position(tkr[0], tkr[1], transactionList, dividendList);
	});
	return pf;
}

let dividends = [
	new Dividend("2023-09-15", 0.1815, "$", 50, "LZB", 0.15, 0),
	new Dividend("2023-06-15", 0.1815, "$", 50, "LZB", 0.15, 0),
	new Dividend("2023-08-17", 0.99, "$", 26, "ATVI", 0.15, 0),
	new Dividend("2023-12-18", 0.2, "$", 50, "LZB", 0.15, 0),
];

let transactions = [
	new Transaction("2022-11-22", 75.5481, "$", 26, "ATVI", "Buy", 0.9708, 8.74),
	new Transaction("2022-11-02", 89.9, "$", 25, "GOOGL", "Buy", 0.9829, 9.16),
	new Transaction("2022-10-31", 101.6, "$", 30, "META", "Buy", 0.9972, 9.03),
	new Transaction("2022-10-03", 139.03, "$", 15, "META", "Buy", 0.9827, 9.16),
	new Transaction("2022-09-28", 101.93, "$", 20, "GOOGL", "Buy", 1.0013, 8.99),
	new Transaction("2022-09-16", 98.529, "$", 20, "GOOGL", "Buy", 0.9617, 9.36),
	new Transaction("2022-06-27", 115.25, "$", 60, "GOOGL", "Buy", 1.0568, 8.51),
	new Transaction("2022-06-28", 170.0, "$", 20, "META", "Buy", 1.0521, 8.55),
	new Transaction("2023-02-03", 193.35, "$", 25, "META", "Sell", 1, 8.25),
	new Transaction("2023-10-18", 24.97, "£", 180, "BATS", "Buy", 1, 25.47),
	new Transaction("2023-04-27", 28.0, "$", 50, "LZB", "Buy", 1, 1.0),
	new Transaction("2023-04-04", 7.5, "$", 200, "MBC", "Buy", 1, 1.0),
	new Transaction("2023-10-13", 95, "$", 26, "ATVI", "Sell", 1, 0),
	new Transaction("2023-05-08", 384, "$", 1, "GOOGL18AUG23115C", "Sell", 1, 1.05),
	new Transaction("2023-08-18", 1208, "$", 1, "GOOGL18AUG23115C", "Buy", 1, 1.05),
	new Transaction("2023-05-08", 963, "$", 1, "META18AUG23260C", "Sell", 1, 1.06),
	new Transaction("2023-08-18", 1828, "$", 1, "META18AUG23260C", "Buy", 1, 1.05),
	new Transaction("2024-01-29", 401.41, "$", 40, "META", "Sell", 1, 1.14),
	new Transaction("2024-01-29", 153.52, "$", 125, "GOOGL", "Sell", 1, 2.17),
	new Transaction("2024-01-29", 14.585, "$", 200, "MBC", "Sell", 1, 1.06),
	new Transaction("2024-02-27", 137.765, "$", 125, "GOOGL", "Buy", 1, 1.0),
	new Transaction("2024-02-27", 180.365, "$", 100, "AAPL", "Buy", 1, 1.0),
];

dividends.sort((a, b) => new Date(b.date) - new Date(a.date));
transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

let portfolio = createPortfolio(transactions, dividends);
portfolio.sort((a, b) => a.ticker.localeCompare(b.ticker));

let transactionHTMLText = `
<tr>
<th className="holding-data">Date</th>
<th className="holding-data">Ticker</th>
<th className="holding-data">Quantity</th>
<th className="holding-data">Avg. Price</th>
<th className="holding-data">Operation</th>
<th className="holding-data">Commission</th>
</tr>
`;

// function to update page content based on button status
function updatePage(showAll) {
	var baseYahooURL = "https://finance.yahoo.com/quote/";
	https: transactions.forEach((tr) => {
		transactionHTMLText +=
			`<tr>
    <td className="holding-data">` +
			tr.date +
			`</td>
    <td className="holding-data"><a href=` +
			baseYahooURL +
			tr.ticker +
			`>` +
			tr.ticker +
			`</a></td>
    <td className="holding-data">` +
			tr.quantity +
			`</td>
    <td className="holding-data">` +
			tr.price.toFixed(2) +
			` ` +
			tr.currency +
			`
    </td>
    <td className="holding-data">` +
			tr.type +
			`</td>
    <td className="holding-data">` +
			(tr.commission * tr.forexRate).toFixed(2) +
			` ` +
			tr.currency +
			`
    </td>
  </tr>`;
	});

	let dividendHTMLText = `
<tr>
<th className="holding-data">Date</th>
<th className="holding-data">Ticker</th>
<th className="holding-data">Quantity</th>
<th className="holding-data">Dividend per Share</th>
<th className="holding-data">Withholding Tax</th>
<th className="holding-data"> Net Amount</th>
</tr>
`;

	dividends.forEach((div) => {
		dividendHTMLText +=
			`<tr>
    <td className="holding-data">` +
			div.date +
			`</td>
    <td className="holding-data">` +
			`<a href="` +
			baseYahooURL +
			div.ticker +
			`">` +
			div.ticker +
			`</a></td>
    <td className="holding-data">` +
			div.quantity +
			`</td>
    <td className="holding-data">` +
			div.dps.toFixed(4) +
			` ` +
			div.currency +
			`
    </td>    
    <td className="holding-data">` +
			div.tax.toFixed(2) +
			` ` +
			div.currency +
			`
    </td>    
    <td className="holding-data">` +
			div.netAmount.toFixed(2) +
			` ` +
			div.currency +
			`
    </td>
    </tr>`;

		console.log(div.ticker);
	});

	let portfolioHTMLText = `
    <tr>
        <th>Ticker</th>
        <th class="ticker-data">Shares Quantity</th>
        <th class="price-data">Cost Base *</th>
        <th class="price-data">Realized Revenues *</th>
        <th class="price-data">Total Commissions</th>
        <th class="price-data">Net Dividends **</th>
    </tr>
`;

	portfolio.forEach((pos) => {
		if (showAll || pos.shares != 0) {
			portfolioHTMLText +=
				`
        <tr>
            <td class="ticker-data"><a href=` +
				baseYahooURL +
				pos.ticker +
				`>` +
				pos.ticker +
				`</a></td>
            <td>` +
				pos.shares +
				`</td>   
            <td>` +
				pos.totalPurchaseCost.toFixed(2) +
				` ` +
				pos.currency +
				`</td>
            <td>` +
				pos.totalSellingRevenue.toFixed(2) +
				` ` +
				pos.currency +
				`</td>
            <td>` +
				pos.totalCommissions.toFixed(2) +
				` ` +
				pos.currency +
				`</td>    
            <td>` +
				pos.totalNetDividends.toFixed(2) +
				` ` +
				pos.currency +
				`</td>
        </tr>
        `;
		}

		// console.log(pos.totalNetDividends);
	});

	let transactionTable = document.getElementById("transaction-results");

	if (transactionTable) {
		transactionTable.innerHTML = "";
		transactionTable.innerHTML += transactionHTMLText;
	}

	let portfolioTable = document.getElementById("portfolio-results");
	if (portfolioTable) {
		portfolioTable.innerHTML = "";
		portfolioTable.innerHTML += portfolioHTMLText;
	}

	let dividendTable = document.getElementById("dividend-results");
	if (dividendTable) {
		dividendTable.innerHTML = "";
		dividendTable.innerHTML += dividendHTMLText;
	}
}

function updateButtonText() {
	toggleHoldingsButton.textContent = showAll ? "Current Holdings" : "Historic Holdings";
}

// page logic activation
var showAll = false;
const toggleHoldingsButton = document.getElementById("toggleHoldingsButton");

document.addEventListener("DOMContentLoaded", function () {
	updatePage(showAll);
	updateButtonText();
});

toggleHoldingsButton.addEventListener("click", function () {
	showAll = !showAll;
	updatePage(showAll);
	updateButtonText();
});

function updateButtonText() {
	toggleHoldingsButton.textContent = showAll ? "Current Holdings" : "Historic Holdings";
}
