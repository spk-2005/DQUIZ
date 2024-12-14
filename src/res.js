import { useParams, useNavigate, useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import { useState, useEffect } from "react";
import './res.css';

function Res() {
    const { name, email, testId, answered, score, timetaken, finalresult, questions, perc } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Add current state to the history stack to handle back button
        window.history.pushState({}, '');

        const handleBack = (event) => {
            event.preventDefault(); // Prevent the default back behavior
            navigate('/'); // Replace with your desired path, e.g., navigate('/your-desired-path');
        };

        // Listen for popstate event
        window.addEventListener('popstate', handleBack);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('popstate', handleBack);
        };
    }, [navigate]);

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.setFillColor(204, 204, 204);
        doc.rect(10, 10, 190, 270, 'F');

        doc.setFontSize(18);
        doc.setTextColor(0, 0, 0);
        doc.text("Quiz Results", 105, 20, null, null, 'center');

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "bold");
        doc.text("User Details", 20, 40);
        doc.setLineWidth(0.5);
        doc.line(20, 42, 190, 42);

        const startX = 20;
        let startY = 50;
        const lineSpacing = 10;
        const fieldNames = ["Name", "Email", "Test ID", "Total Questions", "Attempted", "Unattempted", "Score", "Percentage", "Time Taken", "Final Result"];
        const fieldValues = [name, email, testId, questions, answered, questions - answered, score,perc,timetaken, finalresult];

        doc.setFont("helvetica", "normal");
        for (let i = 0; i < fieldNames.length; i++) {
            doc.text(`${fieldNames[i]}:`, startX, startY);
            doc.text(`${fieldValues[i]}`, startX + 50, startY);
            startY += lineSpacing;
        }

        doc.setLineWidth(0.5);
        doc.setDrawColor(200);
        doc.rect(18, 30, 174, startY - 30);

        doc.save(`${name}_quiz_results.pdf`);
    };

    return (
        <div id="result">
            <h1>Quiz Results</h1>
            <table>
                <tbody>
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
                        <td>Test ID</td>
                        <td>:</td>
                        <td>{testId}</td>
                    </tr>
                </tbody>
            </table>
            
            <hr />
            <table>
                <tbody>
                    <tr>
                        <td>Score</td>
                        <td>:</td>
                        <td>{score}</td>
                    </tr>
                    <tr>
                        <td>Percentage</td>
                        <td>:</td>
                        <td>{perc}</td>
                    </tr>
                    <tr>
                        <td>Time Taken</td>
                        <td>:</td>
                        <td>{timetaken}</td>
                    </tr>
                    <tr>
                        <td>Final Result</td>
                        <td>:</td>
                        <td>{finalresult}</td>
                    </tr>
                    <tr>
                        <td>Attempted</td>
                        <td>:</td>
                        <td>{answered || 0}</td>
                    </tr>
                    <tr>
                        <td>Total Questions</td>
                        <td>:</td>
                        <td>{questions}</td>
                    </tr>
                </tbody>
            </table>
            
            <button onClick={generatePDF}>Download PDF</button>
        </div>
    );
}

export default Res;
