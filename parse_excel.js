const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const outPath = path.join(__dirname, 'quiz-app', 'src', 'data', 'questions.json');

const files = [
  {
    path: path.join(__dirname, 'Kompyuterni tashkil etish DAK2026KTE.xlsx'),
    subject: "Kompyuterni tashkil etish"
  },
  {
    path: path.join(__dirname, "Ma'lumotlar tuzilmasi algoritmlari  test surtqi (2).xlsx"),
    subject: "Ma'lumotlar tuzilmasi va algoritmlar"
  }
];

let questions = [];
let idCounter = 1;

try {
  files.forEach(fileInfo => {
    const workbook = xlsx.readFile(fileInfo.path);
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Read rows, header: 1 returns raw rows array
    const rows = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    
    // Start from index 1 to skip the header row
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length < 3) continue; // Skip empty rows
      
      const qText = row[1];
      const correctAns = row[2];
      const incorrect1 = row[3];
      const incorrect2 = row[4];
      const incorrect3 = row[5];
      
      // Some rows might not have exactly 3 incorrect answers, but we filter out undefined
      let allOptions = [correctAns, incorrect1, incorrect2, incorrect3].filter(Boolean);
      
      // Simple Fisher-Yates shuffle
      for (let j = allOptions.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [allOptions[j], allOptions[k]] = [allOptions[k], allOptions[j]];
      }
      
      questions.push({
        id: idCounter++,
        subject: fileInfo.subject,
        question: typeof qText === 'string' ? qText.trim() : qText,
        options: allOptions.map(opt => typeof opt === 'string' ? opt.trim() : String(opt)),
        answer: typeof correctAns === 'string' ? correctAns.trim() : String(correctAns)
      });
    }
  });
  
  fs.writeFileSync(outPath, JSON.stringify(questions, null, 2));
  console.log(`Successfully extracted ${questions.length} questions to questions.json`);
} catch (error) {
  console.error('Error parsing Excel:', error);
}
