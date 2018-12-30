const opts = {
    lastCell: 'I152',
    from: new Date('2018-12-01'),
    to: new Date()
}
if ( typeof require !== 'undefined' ) XLSX = require('xlsx')
const workbook = XLSX.readFile( 'OrderHistory.xlsx' )
const lines = []
let line = []
let newLine = false
Object.keys( workbook.Sheets.sheet1 ).forEach( cellName => {
    const cell = workbook.Sheets.sheet1[cellName]
    const letter =  cellName.charAt(0)
    if (letter === 'A' && cellName != 'A1') {
        newLine = true
        line = [] //  new line
    }
    if (newLine) line.push(cell.v)
    if (letter === 'I' && cell.v == 'Filled') {
        lines.push(line)
        newLine = false
    }
})
const pairs = {}
lines.forEach(line => {
    let date = new Date( line[0] )
    if (date >= opts.from && date <= opts.to) {
        if ( !pairs[line[1]] ) { // eg paris.ETHBTC
            pairs[line[1]] = {
                BUY: [],
                SELL: []
            }
        }
        let type = line[2]
        let price = !line[5] ? line[3] : line[5]
        let total = line[7]
        pairs[line[1]][type].push( {date: new Date(date), price: price, total: total} )
    }
})

//console.log(pairs)
const trades = []
Object.keys(pairs).forEach(pair => {
    let trade = {
        START: '', FINISH: '', PAIR: pair, AVGBUY: '', AVGSELL: '', PERFNOFEE: '', GAINWITHFEES: '', 
        totalBuy: 0, totalSell: 0, buyPriceSum: 0, sellPriceSum: 0
    }
    pair = pairs[pair]
    trade.buyLen = pair.BUY.length
    trade.sellLen = pair.SELL.length
    pair.BUY.forEach( buy => {
        if ( trade.START === '' || buy.date < trade.START ) trade.START = buy.date
        trade.totalBuy += parseFloat(buy.total)
        trade.buyPriceSum += parseFloat(buy.price)
    })
    pair.SELL.forEach( sell => {
        if ( trade.FINISH === '' || sell.date > trade.FINISH ) trade.FINISH = sell.date
        trade.totalSell += parseFloat(sell.total)
        trade.sellPriceSum += parseFloat(sell.price)
    })
    trade.AVGBUY = trade.buyPriceSum / trade.buyLen
    trade.AVGSELL = trade.sellPriceSum / trade.sellLen
    trade.GAINWITHFEES = (trade.totalSell - trade.totalBuy) * 0.998 // Binance take 0,1% fee for buy and for sell
    trade.PERFNOFEE = (100 * trade.AVGSELL / trade.AVGBUY) - 100
    if ( 0 * trade.PERFNOFEE === 0 ) trades.push(trade)
})
let csv = 'START;FINISH;PAIR;AVG-BUY;AVG-SELL;PERF-NO-FEE;GAIN-WITH-FEES\n'
trades.forEach(t => {
    csv += `${t.START};${t.FINISH};${t.PAIR};${t.AVGBUY};${t.AVGSELL};${t.PERFNOFEE};${t.GAINWITHFEES}\n`
})
console.log(csv);