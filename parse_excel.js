const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const outPath = path.join(__dirname, 'quiz-app', 'src', 'data', 'questions.json');

const files = [
  {
    path: path.join(__dirname, 'Kompyuterni tashkil etish DAK2026KTE.xlsx'),
    subject: "Kompyuterni tashkil etish",
    format: "type1"
  },
  {
    path: path.join(__dirname, "Ma'lumotlar tuzilmasi algoritmlari  test surtqi (2).xlsx"),
    subject: "Ma'lumotlar tuzilmasi va algoritmlar",
    format: "type1"
  },
  {
    path: path.join(__dirname, "Ma'lumotlar_bazasi_test_tayyor.xlsx"),
    subject: "Ma'lumotlar bazasi",
    format: "type2"
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
      let allOptions = [];
      let correctAnswer = "";

      if (fileInfo.format === "type1") {
        const correctAns = row[2];
        const incorrect1 = row[3];
        const incorrect2 = row[4];
        const incorrect3 = row[5];
        allOptions = [correctAns, incorrect1, incorrect2, incorrect3].filter(Boolean);
        correctAnswer = correctAns;
      } else if (fileInfo.format === "type2") {
        const optA = row[2];
        const optB = row[3];
        const optC = row[4];
        const optD = row[5];
        const correctLetter = String(row[6]).trim().toUpperCase();
        
        allOptions = [optA, optB, optC, optD].filter(Boolean);
        
        if (correctLetter === 'A') correctAnswer = optA;
        else if (correctLetter === 'B') correctAnswer = optB;
        else if (correctLetter === 'C') correctAnswer = optC;
        else if (correctLetter === 'D') correctAnswer = optD;
        else correctAnswer = optA; // fallback
      }
      
      if (!correctAnswer || allOptions.length === 0) continue;
      
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
        answer: typeof correctAnswer === 'string' ? correctAnswer.trim() : String(correctAnswer)
      });
    }
  });
  
  fs.writeFileSync(outPath, JSON.stringify(questions, null, 2));
  console.log(`Successfully extracted ${questions.length} questions to questions.json`);
} catch (error) {
  console.error('Error parsing Excel:', error);
}
