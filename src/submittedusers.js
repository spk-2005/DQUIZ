import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import base from './airtable';
import * as XLSX from 'xlsx'; // Import xlsx library
import './submittedusers.css';

function Submittedusers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { testId } = useParams();  // Destructure testId from useParams

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!testId) {
                    console.error("testId is undefined");
                    return;
                }

                const tableName = `${testId}Result`;
                const fetchedUsers = [];
                
                base(tableName)
                    .select({ view: 'Grid view' })
                    .eachPage((records, fetchNextPage) => {
                        records.forEach(record => {
                            fetchedUsers.push({
                                username: record.fields['Name'],
                                usermail: record.fields['email'],
                                userscore: record.fields['score'],
                                usercorrect: record.fields['correct'],
                                userwrong: record.fields['wrong'],
                                userpercentage: record.fields['percentage'],
                                userfinal: record.fields['finalresult'],
                            });
                        });
                        setUsers(fetchedUsers);
                        setLoading(false);
                        fetchNextPage();
                    }, (err) => {
                        if (err) {
                            console.error("Error fetching data:", err);
                            setError("Error fetching data");
                            setLoading(false);
                        }
                    });
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Error fetching data");
                setLoading(false);
            }
        };

        fetchData();
    }, [testId]);

    const handleDownload = () => {
        const worksheet = XLSX.utils.json_to_sheet(users);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, `${testId} Result`);

        XLSX.writeFile(workbook, `${testId}-Result.xlsx`);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    
    const displayMapping = {
        'Group-1': 'EOT 141',
        'Group-2': 'GOT88',
        'Group-3': 'GOT 97',
        'Group-4': 'CODE 08',
        'Group-5': 'CODE 10',
        'Group-6': 'CODE 146',
        'Group-7': 'CODE 148'
    };
    
    
    const groupMatch = Object.keys(displayMapping).find(group => testId.includes(group));
    
    const displayText = groupMatch ? testId.replace(groupMatch, displayMapping[groupMatch]) : testId;
    
    return (
        <>
            <section id="asub">
                <h2>{displayText ? `${displayText} Result` : "Loading Results..."}</h2> 
                <table>
                    <thead id="finalres">
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Score</th>
                            <th>Correct</th>
                            <th>Wrong</th>
                            <th>Percentage</th>
                            <th>Final Result</th>
                            <th>Rank</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index}>
                                <td>{user.username}</td>
                                <td>{user.usermail}</td>
                                <td>{user.userscore}</td>
                                <td>{user.usercorrect}</td>
                                <td>{user.userwrong}</td>
                                <td>{user.userpercentage}</td>
                                <td>{user.userfinal}</td>
                                <td>{index+1}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
            <section id="las">
                <button onClick={handleDownload}>Download as Excel</button> {/* Download button */}
            </section>
        </>
    );
}

export default Submittedusers;
