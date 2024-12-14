import React, { useState } from 'react';
import './quizf.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";

export default function Quizf() {
    const { score, selectedOptions, questions, name, email, time1, time2, testId, marked, ansmarked, notvis } = useParams();

    const parsedOptions = JSON.parse(decodeURIComponent(selectedOptions || '{}'));
    const totalquestions = JSON.parse(decodeURIComponent(questions || '[]')).length;
    const unattempted = totalquestions - Object.keys(parsedOptions).length;
    const answered = Object.keys(parsedOptions).length;
    const timeTaken = `${time1 || '0'} minutes and ${time2 || '00'} seconds`;
    const tableName = `${testId} Result`; 
    const AIRTABLE_API_URL = 'https://api.airtable.com/v0/appeNnsbhK29mc0zc/Users';
    const AIRTABLE_API_URL1 = `https://api.airtable.com/v0/appeNnsbhK29mc0zc/${encodeURIComponent(tableName)}`; // Encode the table name
    const AIRTABLE_API_KEY = 'pat5iaYzMxFVWxxYf.3c9978767b9e53c85d540a9fd23c46a71bc51524d53a19e64134056ee15b1a52';
    const [final, setfinal] = useState("");

    const handleSubmit = async () => {
        let newScore = parseInt(score); 
        const perc = (newScore / totalquestions) * 100;
        setfinal(perc >= 75 ? 'PASS' : 'FAIL');

        const submissionData = {
            fields: {
                testname: testId,
                Name: name,
                email: email,
                attempted: selectedOptions.length,
                unattempted: totalquestions - selectedOptions.length,
                wrong: selectedOptions.length - newScore,
                percentage: 0,  
                timetaken: timeTaken,
                c: newScore, 
                finalscore: newScore,
            }
        };
        
        const submissionData1 = {
            fields: {
                Name: name,
                email: email,
                attempted: selectedOptions.length,
                unattempted: totalquestions - selectedOptions.length,
                wrong: selectedOptions.length - newScore,
                percentage: perc,  
                timetaken: timeTaken,
                correct: newScore, 
                finalresult: final,
                score: newScore,
            }
        };

        console.log('Submission Data:', submissionData);

        try {
            await axios.post(AIRTABLE_API_URL, submissionData, {
                headers: {
                    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            await axios.post(AIRTABLE_API_URL1, submissionData1, {
                headers: {
                    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            alert('Results Will Announce Soon');
            window.close();
        } catch (error) {
            console.error('Error submitting data to Airtable:', error);
            alert('Error submitting data to Airtable. Check console for details.');
        }
    };

    return (
        <div id='fsub'>
            <table>
                <tbody>
                    <tr>
                        <th>Section Name</th>
                        <th>No. Of Questions</th>
                        <th>Answered</th>
                        <th>Unanswered</th>
                        <th>Marked For Review</th>
                        <th>Answered and Marked For Review (will not consider for evaluation)</th>
                        <th>Not Visited</th>
                    </tr>
                    <tr>
                        <td>{testId}</td>
                        <td>{totalquestions}</td>
                        <td>{answered}</td>
                        <td>{unattempted}</td>
                        <td>{marked}</td>
                        <td>{ansmarked}</td>
                        <td>{notvis}</td>
                    </tr>
                </tbody>
            </table>
            <form>
                <span>Are you sure you want to submit?</span>
                <br />
                <button type="button">No</button>
                <button type="button" onClick={handleSubmit}>Yes</button>
            </form>
        </div>
    );
}
