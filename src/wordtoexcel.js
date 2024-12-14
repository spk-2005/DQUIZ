import React, { useState } from "react";
import * as XLSX from "xlsx";
import mammoth from "mammoth";

const Wordtoexcel = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setError("Please select a file.");
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const { value: text } = await mammoth.extractRawText({ arrayBuffer });

      console.log("Extracted Content:", text); // Debugging step: Print the raw text
      const rows = parseTextToTable(text);

      console.log("Parsed Rows:", rows); // Debugging step: Print parsed rows
      const worksheet = XLSX.utils.aoa_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      XLSX.writeFile(workbook, "questions.xlsx");
      setSuccess("Excel file generated successfully!");
      setError("");
    } catch (err) {
      console.error("Error converting file:", err);
      setError("Error converting file. Please check the file format.");
    }
  };
  const parseTextToTable = (text) => {
    const lines = text.split("\n").filter((line) => line.trim() !== ""); // Split and remove empty lines
    const rows = [["Question", "Option 1", "Option 2", "Option 3", "Option 4", "Answer"]]; // Header row
  
    let question = "";
    const options = [];
    let answer = "";
  
    lines.forEach((line) => {
      if (line.match(/^Q:\s*\d+\)/)) {
        // Match "Q: n)" format
        if (question) {
          rows.push([question, ...options, answer]); // Save previous question
          options.length = 0; // Clear options for the next question
        }
        question = line.replace(/^Q:\s*\d+\)\s*/, "").trim(); // Remove "Q: n)" and trim
      } else if (line.startsWith("A)")) {
        options[0] = line.replace("A)", "").trim();
      } else if (line.startsWith("B)")) {
        options[1] = line.replace("B)", "").trim();
      } else if (line.startsWith("C)")) {
        options[2] = line.replace("C)", "").trim();
      } else if (line.startsWith("D)")) {
        options[3] = line.replace("D)", "").trim();
      } else if (line.startsWith("Correct:")) {
        const correctOption = line.replace("Correct:", "").trim(); // Extract the correct option (e.g., "A")
        const optionIndex = ["A", "B", "C", "D"].indexOf(correctOption); // Map "A", "B", "C", "D" to index 0, 1, 2, 3
        answer = optionIndex !== -1 ? options[optionIndex] : ""; // Get the corresponding option content
      }
    });
  
    // Add the last question
    if (question) {
      rows.push([question, ...options, answer]);
    }
  
    return rows;
  };
  

  return (
    <div>
      <h1>Word to Excel Converter</h1>
      <input type="file" accept=".docx" onChange={handleFileUpload} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
};

export default Wordtoexcel;
