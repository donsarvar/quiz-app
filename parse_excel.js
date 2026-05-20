const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'Kompyuterni tashkil etish DAK2026KTE.xlsx');
const outPath = path.join(__dirname, 'questions.json');

try {
  const workbook = xlsx.readFile(filePath);
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  
  // Read rows, header: 1 returns raw rows array
  const rows = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
  
  const questions = [];
  
  // Start from index 1 to skip the header row
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 6) continue; // Skip empty or incomplete rows
    
    const qNumber = row[0];
    const qText = row[1];
    const correctAns = row[2];
    const incorrect1 = row[3];
    const incorrect2 = row[4];
    const incorrect3 = row[5];
    
    // Shuffle the options so correct answer isn't always at the same place
    const allOptions = [correctAns, incorrect1, incorrect2, incorrect3];
    
    // Simple Fisher-Yates shuffle
    for (let j = allOptions.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [allOptions[j], allOptions[k]] = [allOptions[k], allOptions[j]];
    }
    
    questions.push({
      id: qNumber,
      subject: "Kompyuterni tashkil etish", // Hardcoded based on the file name for now
      question: qText,
      options: allOptions,
      answer: correctAns
    });
  }
  
  fs.writeFileSync(outPath, JSON.stringify(questions, null, 2));
  console.log(`Successfully extracted ${questions.length} questions to questions.json`);
} catch (error) {
  console.error('Error parsing Excel:', error);
}
