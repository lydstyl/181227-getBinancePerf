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
})
csvObj = {}
Object.keys(trades).forEach(pair => {
    let transactions = trades[pair]
    csvObj[pair] = {}
    transactions.forEach(t => {
        if ( !csvObj[pair].START || t.date < csvObj[pair].START ) {
            csvObj[pair].START = t.date
        }
        if ( !csvObj[pair].FINISH || t.date > csvObj[pair].FINISH ) {
            csvObj[pair].FINISH = t.date
        }
        if ( t.type === 'BUY' ) {
            if ( !csvObj[pair].buyAmount ) {
                csvObj[pair].buyAmount = 0
            }
            csvObj[pair].buyAmount += t.amount
            if ( !csvObj[pair].totalBuy ) {
                csvObj[pair].totalBuy = 0
            }
            csvObj[pair].totalBuy += t.total
        }
        if ( t.type === 'SELL' ) {
            if ( !csvObj[pair].sellAmount ) {
                csvObj[pair].sellAmount = 0
            }
            csvObj[pair].sellAmount += t.amount
            if ( !csvObj[pair].totalSell ) {
                csvObj[pair].totalSell = 0
            }
            csvObj[pair].totalSell += t.total
        }
    })
    csvObj[pair].buyMinusSellAmount = csvObj[pair].buyAmount - csvObj[pair].sellAmount
    if
    ( 
        (csvObj[pair].buyAmount / csvObj[pair].sellAmount) <= 1.01 &&
        (csvObj[pair].sellAmount / csvObj[pair].buyAmount) <= 1.01 
    ) {
        csvObj[pair].AVGBUY = csvObj[pair].totalBuy / csvObj[pair].buyAmount
        csvObj[pair].AVGSELL = csvObj[pair].totalSell / csvObj[pair].sellAmount
        csvObj[pair].PERFNOFEE = (100 * csvObj[pair].AVGSELL / csvObj[pair].AVGBUY) - 100
        csvObj[pair].GAINWITHFEES = (csvObj[pair].totalBuy - csvObj[pair].totalSell) * 0.998
    }else{
        delete csvObj[pair]
    }
})
console.log(csvObj)
// START	FINISH	PAIR	AVG-BUY	AVG-SELL	PERF-NO-FEE	GAIN-WITH-FEES