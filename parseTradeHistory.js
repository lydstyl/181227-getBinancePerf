const fs = require('fs')
const opts = {
    from: new Date('2018-12-10'),
    to: new Date()
}
if ( typeof require !== 'undefined' ) XLSX = require('xlsx')
const workbook = XLSX.readFile( 'TradeHistory.xlsx' )
const transactions = []
let transaction = []
Object.keys( workbook.Sheets.sheet1 ).forEach( cellName => {
    const cell = workbook.Sheets.sheet1[cellName].v
    transaction.push(cell)
    if ( cell && cellName.includes('H')) {
        transactions.push(transaction)
        transaction = []
    }
})
const trades = {}
transactions.forEach(transaction => {
    let date = new Date(transaction[0])
    if 
    (   
        transaction[1] != 'Market' &&
        date >= opts.from &&
        date <= opts.to   
    ) {
        if ( !trades[transaction[1]]) {
            trades[transaction[1]] = []
        }
        trades[transaction[1]].push({
            date: date,
            type: transaction[2],
            amount: parseFloat(transaction[4]),
            total: parseFloat(transaction[5]),
        })
    }
});
// START	FINISH	PAIR	AVG-BUY	AVG-SELL	PERF-NO-FEE	GAIN-WITH-FEES
console.log(trades);
