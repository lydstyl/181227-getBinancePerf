if ( typeof require !== 'undefined' ) XLSX = require('xlsx')
const workbook = XLSX.readFile( 'OrderHistory.xlsx' )

// console.log(workbook.Sheets.sheet1.A1.v)
Object.keys( workbook.Sheets.sheet1 ).forEach( cellName => {
    console.log( `\nCELL ${cellName}` )
    const cell = workbook.Sheets.sheet1[cellName]
    console.log(cell.v)

    const letter =  cellName.charAt(0)
    
    console.log(letter);

    switch (letter) {
        case 'A':
            
            break;
    
        default:
            break;
    }

    // si Adate et 
        // IFilled
    // pair: {type, avgPrice, qte 



})