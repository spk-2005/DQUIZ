import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import mammoth from "mammoth";
import axios from "axios"; 
import './addingquestions.css';

const AddingQuestions = () => {
  const [groups, setGroups] = useState([]); // List of groups from Airtable
  const [selectedGroup, setSelectedGroup] = useState("");
  const [tests, setTests] = useState([]); // List of tests for the selected group
  const [selectedTest, setSelectedTest] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Airtable Configurations
  const AIRTABLE_API_KEY = process.env.REACT_APP_AIRTABLE_API_KEY;
  const AIRTABLE_BASE_ID = process.env.REACT_APP_AIRTABLE_BASE_ID;

  // Fetch groups from Airtable
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get(
          `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/newgroups`,
          {
            headers: {
              Authorization: `Bearer ${AIRTABLE_API_KEY}`,
            },
          }
        );
        const groupsData = response.data.records.map((record) => ({
          id: record.id,
          name: record.fields.GroupName,
          nooftests: record.fields.nooftests,
        }));
        setGroups(groupsData);
      } catch (err) {
        console.error("Error fetching groups:", err);
      }
    };
    fetchGroups();
  }, []);

  // Handle group selection
  const handleGroupSelect = (e) => {
    const groupName = e.target.value;
    setSelectedGroup(groupName);

    // Find the selected group's number of tests
    const group = groups.find((g) => g.name === groupName);
    if (group) {
      const numberOfTests = group.nooftests || 0;
      const testOptions = Array.from({ length: numberOfTests }, (_, i) => `Test-${i + 1}`);
      setTests(testOptions);
    } else {
      setTests([]);
    }
    setSelectedTest("");
  };

  // Handle file upload and conversion
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedGroup || !selectedTest) {
      setError("Please select a group, test, and file.");
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const { value: text } = await mammoth.extractRawText({ arrayBuffer });

      const rows = parseTextToTable(text);
      const worksheet = XLSX.utils.aoa_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      const fileName = `${selectedGroup}${selectedTest}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      // Upload to Airtable
      await uploadToAirtable(selectedGroup + selectedTest, rows);

      setSuccess(`Excel file "${fileName}" generated and uploaded successfully!`);
      setError("");
    } catch (err) {
      console.error("Error converting file:", err);
      setError("Error converting file. Please check the file format.");
    }
  };

  // Parse the text file to table format
  const parseTextToTable = (text) => {
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    const rows = [["Question", "Option 1", "Option 2", "Option 3", "Option 4", "Answer"]];

    let question = "";
    const options = [];
    let answer = "";

    lines.forEach((line) => {
      if (line.match(/^Q:\s*\d+\)/)) {
        if (question) {
          rows.push([question, ...options, answer]);
          options.length = 0;
        }
        question = line.replace(/^Q:\s*\d+\)\s*/, "").trim();
      } else if (line.startsWith("A)")) {
        options[0] = line.replace("A)", "").trim();
      } else if (line.startsWith("B)")) {
        options[1] = line.replace("B)", "").trim();
      } else if (line.startsWith("C)")) {
        options[2] = line.replace("C)", "").trim();
      } else if (line.startsWith("D)")) {
        options[3] = line.replace("D)", "").trim();
      } else if (line.startsWith("Correct:")) {
        const correctOption = line.replace("Correct:", "").trim();
        const optionIndex = ["A", "B", "C", "D"].indexOf(correctOption);
        answer = optionIndex !== -1 ? options[optionIndex] : "";
      }
    });

    if (question) {
      rows.push([question, ...options, answer]);
    }

    return rows;
  };

  // Upload the rows to Airtable
  const uploadToAirtable = async (tableName, rows) => {
    try {
      // Skip the header row (index 0)
      const records = rows.slice(1).map((row) => ({
        fields: {
          Questions: row[0] || "",
          Opt1: row[1] || "",
          Opt2: row[2] || "",
          Opt3: row[3] || "",
          Opt4: row[4] || "",
          Answers: row[5] || "",
        },
      }));

      // Send data to Airtable in batches of 10 (API limit)
      const BATCH_SIZE = 10;
      for (let i = 0; i < records.length; i += BATCH_SIZE) {
        const batch = records.slice(i, i + BATCH_SIZE);

        await axios.post(
          `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableName}`,
          { records: batch },
          {
            headers: {
              Authorization: `Bearer ${AIRTABLE_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      console.log("Data uploaded successfully!");
    } catch (err) {
      console.error("Error uploading to Airtable:", err);
      throw new Error("Failed to upload data to Airtable.");
    }
  };

  
  const displayMapping = {
    'Group-1': 'EOT 141',
    'Group-2': 'GOT88',
    'Group-3': 'GOT 97',
    'Group-4': 'CODE 08',
    'Group-5': 'CODE 10',
    'Group-6': 'CODE 146',
    'Group-7': 'CODE 148',
};
  return (
    <>
    <div id="uploadingquestions">
      <h1>Add Questions to Test</h1>
      <div id="selecting-table">
        <label>Group: </label>
        <select value={selectedGroup} onChange={handleGroupSelect}>
          <option value="">Select Group</option>
          {groups.map((group) => (
            <option key={group.id} value={group.name}>
              {group.name}({displayMapping[group.name]})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Test: </label>
        <select value={selectedTest} onChange={(e) => setSelectedTest(e.target.value)}>
          <option value="">Select Test</option>
          {tests.map((test, index) => (
            <option key={index} value={test}>
              {test}
            </option>
          ))}
        </select>
      </div>
      <div>
        <input type="file" accept=".docx" onChange={handleFileUpload} />
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
    </>);
};

export default AddingQuestions;
