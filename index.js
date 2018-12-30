const opts = {
    lastCell: 'I152'
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
// console.log(lines.length);

// Date(UTC)	Pair	Type	Order Price	Order Amount	Avg Trading Price	Filled	Total	status
const pairs = {}
lines.forEach(line => {
    if ( !pairs[line[1]] ) { // eg paris.ETHBTC
        pairs[line[1]] = {
            BUY: [],
            SELL: []
        }
    }

    let date = line[0]
    let type = line[2]
    let price = !line[5] ? line[3] : line[5]
    let total = line[7]
    
    pairs[line[1]][type].push( {date: date, price: price, total: total} )
});

console.log(pairs);

    // si Adate et 
        // IFilled
    // pair: {type, avgPrice, qte 