if ( typeof require !== 'undefined' ) XLSX = require('xlsx')
const workbook = XLSX.readFile( 'OrderHistory.xlsx' )

// console.log(workbook.Sheets.sheet1.A1.v)
const lines = []
let line = {}
Object.keys( workbook.Sheets.sheet1 ).forEach( cellName => {
    //console.log( `\nCELL ${cellName}` )
    const cell = workbook.Sheets.sheet1[cellName]
    const letter =  cellName.charAt(0)
    
    console.log(letter);
    // Date(UTC)	Pair	Type	Order Price	Order Amount	Avg Trading Price	Filled	Total	status
    if (letter === 'A') {
        lines.push(line)
        line = []
    }
    line.push(cell.v)
})
console.log(lines[0][0]);
let first = true
lines.forEach(line => {
    for (let i = 0; i < line.length; i++) {
        const cell = line[i];
        if (first) {
            
         //   console.log('ee ' +line);
        }
    }
    first = false
});


    // si Adate et 
        // IFilled
    // pair: {type, avgPrice, qte 