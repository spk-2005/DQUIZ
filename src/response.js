import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import jsPDF from "jspdf";
import axios from "axios";
import './response.css';

function Response() {
    const { name, email, testId } = useParams();
    const navigate = useNavigate(); 

    const [fetchedData, setFetchedData] = useState({
        correct: [],
        wrong: [],
        finalResult: [],
        score: 0,
        percentage: []
    });
    const [time1, setTime1] = useState(0); 
    const [time2, setTime2] = useState("00"); 
    const tableName = `${testId}Result`;
    const AIRTABLE_API_URL = `https://api.airtable.com/v0/appeNnsbhK29mc0zc/${tableName}`;
    const AIRTABLE_API_KEY = 'pat5iaYzMxFVWxxYf.3c9978767b9e53c85d540a9fd23c46a71bc51524d53a19e64134056ee15b1a52';

    useEffect(() => {

        if (name && email) {
            const fetchData = async () => {
                try {
                    const response = await axios.get(AIRTABLE_API_URL, {
                        headers: {
                            Authorization: `Bearer ${AIRTABLE_API_KEY}`,
                            'Content-Type': 'application/json'
                        },
                        params: {
                            filterByFormula: `AND({user} = "${email}")`
                        }
                    });

                    if (response.data.records.length > 0) {
                        const fetchedCorrect = [];
                        const fetchedWrong = [];
                        const fetchedFinalResult = [];
                        let fetchedScore = 0;

                        response.data.records.forEach(record => {
                            fetchedCorrect.push(record.fields['correct']);
                            fetchedWrong.push(record.fields['wrong']);
                            fetchedFinalResult.push(record.fields['finalresult']);
                            fetchedScore += record.fields['score'];
                        });

                        setFetchedData({
                            correct: fetchedCorrect,
                            wrong: fetchedWrong,
                            finalResult: fetchedFinalResult,
                            score: fetchedScore,
                            percentage: fetchedFinalResult.map(result => result.percentage)
                        });
                    } else {
                        alert("No results found for this email.");
                    }
                } catch (error) {
                    alert("Error fetching data or network issue.");
                }
            };
            fetchData();
        } else {
            alert("Please provide all required fields.");
        }

        // Handle the back navigation
        const handlePopState = () => {
            // Redirect to the desired address (e.g., '/home')
            navigate('/desired-path'); // Replace '/desired-path' with your desired route
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [email, name, testId, navigate]);

    const parsedOptions = JSON.parse(decodeURIComponent('{}')); // Modify this to parse your options
    const totalQuestions = fetchedData.correct.length; // Example calculation, adjust accordingly
    const unattempted = totalQuestions - Object.keys(parsedOptions).length;
    const timeTaken = `${time1} minutes and ${time2} seconds`;

    const generatePDF = () => {
        const doc = new jsPDF();

        // Set text color and font size
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);

        // Function to draw underlined text
        const drawUnderlinedText = (x, y, text) => {
            doc.text(text, x, y);
            const textWidth = doc.getTextWidth(text);
            doc.line(x, y + 2, x + textWidth, y + 2); // Draw underline
        };

        let y = 10; 
        drawUnderlinedText(10, y, "User Details");
        y += 10; 
        doc.text(`Name: ${name}`, 10, y);
        y += 10;
        doc.text(`Email: ${email}`, 10, y);
        y += 10;
        doc.text(`Time Taken: ${timeTaken}`, 10, y);

        y += 20; 
        drawUnderlinedText(10, y, "Quiz Results");
        y += 10;
        doc.text(`Total Questions: ${totalQuestions}`, 10, y);
        y += 10;
        doc.text(`Attempted: ${Object.keys(parsedOptions).length}`, 10, y);
        y += 10;
        doc.text(`Unattempted: ${unattempted}`, 10, y);
        y += 10;
        doc.text(`Correct Answers: ${fetchedData.score}`, 10, y);
        y += 10;
        doc.text(`Wrong Answers: ${totalQuestions - fetchedData.score}`, 10, y);
        y += 10;
        doc.text(`Final Score: ${fetchedData.score}/${totalQuestions}`, 10, y);

        doc.save("QuizResults.pdf");
    };

    return (
        <>
            <div id="response">
                <table>
                    <tbody>
                        <tr>
                            <td colSpan="3" id="user">User Details</td>
                        </tr>
                        <tr>
                            <td>Name</td>
                            <td>:</td>
                            <td>{name}</td>
                        </tr>
                        <tr>
                            <td>Email</td>
                            <td>:</td>
                            <td>{email}</td>
                        </tr>
                        <tr>
                            <td>Time Taken</td>
                            <td>:</td>
                            <td>{timeTaken}</td>
                        </tr>
                        <tr>
                            <td colSpan="3" id="qres">Quiz Results</td>
                        </tr>
                        <tr>
                            <td>Total Questions</td>
                            <td>:</td>
                            <td>{totalQuestions}</td>
                        </tr>
                        <tr>
                            <td>Attempted</td>
                            <td>:</td>
                            <td>{Object.keys(parsedOptions).length}</td>
                        </tr>
                        <tr>
                            <td>Unattempted</td>
                            <td>:</td>
                            <td>{unattempted}</td>
                        </tr>
                        <tr>
                            <td>Correct Answers</td>
                            <td>:</td>
                            <td>{fetchedData.score}</td>
                        </tr>
                        <tr>
                            <td>Wrong Answers</td>
                            <td>:</td>
                            <td>{totalQuestions - fetchedData.score}</td>
                        </tr>
                        <tr>
                            <td>Final Score</td>
                            <td>:</td>
                            <td>{fetchedData.score}/{totalQuestions}</td>
                        </tr>
                    </tbody>
                </table>
                <button onClick={generatePDF}>Download Your Result</button>
            </div>
        </>
    );
}

export default Response;
