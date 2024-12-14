import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './test2.css';
import axios from 'axios';
import base1 from './airtable';
import Popup from './popup';

const AIRTABLE_API_URL = `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE_ID}/Checkattempts`;
const AIRTABLE_API_KEY = `${process.env.REACT_APP_AIRTABLE_API_KEY}`; // Using environment variable
const displayMapping = {
    'Group-1': 'EOT 141',
    'Group-2': 'GOT88',
    'Group-3': 'GOT 97',
    'Group-4': 'CODE 08',
    'Group-5': 'CODE 10',
    'Group-6': 'CODE 146',
    'Group-7': 'CODE 148'
};

export default function Test2() {
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState(""); // Store popup message

    const handleShowPopup = (message) => {
        setPopupMessage(message); // Set message before showing the popup
        setShowPopup(true);
    };

    
    const handleClosePopup = () => setShowPopup(false);
    const { test, name, email } = useParams();
    const [count, setCount] = useState(0);
    const [instructionOpen, setInstructionOpen] = useState(false);

    useEffect(() => {
        const fetchTestCount = async () => {
            try {
                const records = await base1('newgroups')
                    .select({
                        filterByFormula: `{GroupName} = "${test}"`,
                        view: 'Grid view'
                    })
                    .firstPage();

                if (records.length > 0) {
                    const record = records[0];
                    const noOfTests = record.fields['nooftests'];
                    setCount(noOfTests);
                } else {
                    alert('Group name not found. Please try again later.');
                }
            } catch (error) {
                alert('An error occurred while fetching the number of tests. Please try again later.');
            }
        };

        fetchTestCount();
    }, [test]);

    const tests = Array.from({ length: count }, (_, i) => `Test-${i + 1}`);
    
    const displayText = displayMapping[test] || test;

    const handleTest = async (tes) => {
        const testId = `${test}${tes}`;

        if (name && email) {
            try {
                const response = await axios.get(AIRTABLE_API_URL, {
                    headers: {
                        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    params: {
                        filterByFormula: `AND({userid} = "${email}", {TestId} = "${testId}")`
                    }
                });

                if (response.data.records.length > 0) {
                    const record = response.data.records[0];
                    const Checkattempts = record.fields['checkattempt'];
                    if (Checkattempts === 0) {
                        handleShowPopup("Sorry, you don't have attempts.");
                    } else {
                        const userConfirmation = window.confirm("Want to take the test now?");
                        handleShowPopup(`Attempts you have: ${Checkattempts}`);
                        if (userConfirmation) {
                            const quizUrl = `/instructions/${testId}/${name}/${email}`;
                            openInstructionWindow(quizUrl, testId);
                        } else {handleShowPopup("Test cancelled.");
                        }
                    }
                } else {
                    const userConfirmation = window.confirm("Want to take the test now?");
                    if (userConfirmation) {
                        alert("Proceeding to the test...");
                        const quizUrl = `/instructions/${testId}/${name}/${email}`;
                        openInstructionWindow(quizUrl, testId);
                    } else {
                        alert("Test cancelled.");
                    }
                }
            } catch (error) {
                console.error('Error fetching data from Airtable:', error);
                if (error.response && error.response.status === 401) {
                    alert("Unauthorized access. Please contact support.");
                } else {
                    alert("An error occurred. Please check your network connection and try again.");
                }
            }
        } else {
            alert("Please fill in all fields.");
        }
    };
    const openInstructionWindow = async (quizUrl, testId) => {
        // Check screen width
        const isLargeScreen = window.innerWidth > 700;
    
        if (instructionOpen && isLargeScreen) {
            alert('Instruction component is already open.');
            return;
        }
        setInstructionOpen(true);
    
        try {
            const response = await axios.get(AIRTABLE_API_URL, {
                headers: {
                    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                params: {
                    filterByFormula: `AND({userid} = "${email}", {TestId} = "${testId}")`
                }
            });
    
            if (response.data.records.length > 0) {
                const record = response.data.records[0];
                const recordId = record.id; 
                let checkattempts = record.fields['checkattempt'] || 0; 
                checkattempts = checkattempts - 1;
                alert(`Remaining attempts you have: ${checkattempts}`);
                await axios.patch(`${AIRTABLE_API_URL}/${recordId}`, {
                    fields: {
                        checkattempt: checkattempts
                    }
                }, {
                    headers: {
                        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                });
            }
    
            if (isLargeScreen) {
                
               window.location.href = quizUrl;
                
            } else {
                // Navigate normally in the same tab
                window.location.href = quizUrl;
            }
        } catch (error) {
            console.error('Error updating Airtable:', error);
            alert('An error occurred while updating your attempts. Please try again later.');
            setInstructionOpen(false); // Allow retrying
        }
    };
    const testLabels = {
        'Test-1': 'Easy',
        'Test-2': 'Medium',
        'Test-3': 'Hard'
    };

    const navigate=useNavigate();
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

    return (
        <>
        <section id='gtest'>
            <h3>Note:Please Refresh To Take Another Test</h3>
            <div><h1>{displayText}</h1></div>
            <h2>Take Any Test In {displayText}</h2>
            <div id='testlist'>
                {count > 0 ? (
                    <ol>
                        {tests.map((testName, index) => (
                            <li key={index} onClick={() => handleTest(testName)} tabIndex="0">
                                {testName.toUpperCase()}
                            </li>
                        ))}
                    </ol>
                ) : (
                    <p className="no-tests-message">Tests will be available soon.</p>
                )}
            </div>
        </section> {showPopup && <Popup mes={popupMessage} onClose={handleClosePopup} />}
        </>
    );
}
