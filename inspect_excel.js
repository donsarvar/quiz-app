const xlsx = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, 'Kompyuterni tashkil etish DAK2026KTE.xlsx');

try {
  const workbook = xlsx.readFile(filePath);
  console.log('Sheet Names:', workbook.SheetNames);

  // Read the first sheet
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  
  // Convert worksheet to JSON (header: 1 returns raw rows)
  const rows = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
  
  console.log(`Total Rows in Sheet [${firstSheetName}]: ${rows.length}`);
  console.log('\n--- First 5 rows of data ---');
  for (let i = 0; i < Math.min(rows.length, 5); i++) {
    console.log(`Row ${i + 1}:`, JSON.stringify(rows[i], null, 2));
  }

} catch (error) {
  console.error('Error reading Excel file:', error);
}
