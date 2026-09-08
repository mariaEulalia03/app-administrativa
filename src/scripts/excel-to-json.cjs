const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../../Prototipo_Funcional (1).xlsx');
const outDir = path.resolve(__dirname, '../db');

// Ensure db directory exists
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Read the excel file
console.log('Reading Excel file...');
const workbook = xlsx.readFile(filePath);

workbook.SheetNames.forEach(sheetName => {
  // Skip the README sheet
  if (sheetName.toLowerCase() === 'readme') return;
  
  const sheet = workbook.Sheets[sheetName];
  // convert to array of objects
  const data = xlsx.utils.sheet_to_json(sheet);
  
  // Format filename (snake_case or lower case)
  const fileName = sheetName.toLowerCase() + '.json';
  const outPath = path.join(outDir, fileName);
  
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`Generated: ${fileName} with ${data.length} records.`);
});

console.log('Conversion complete!');
