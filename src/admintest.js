import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './admintest.css';
import base1 from './airtable';

export default function Admintest() {
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleNavigation = (groupName, testNumber) => {
        // Construct the testId from groupName and testNumber
        const testId = `${groupName}Test-${testNumber}`;
        navigate(`/submittedusers/${testId}`);
    };

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const fetchedGroups = [];
                base1('newgroups')
                    .select({ view: 'Grid view' })
                    .eachPage((records, fetchNextPage) => {
                        records.forEach(record => {
                            const groupName = record.fields['GroupName'];
                            const noOfTests = record.fields['nooftests']; 
                            fetchedGroups.push({ groupName, noOfTests });
                        });
                        fetchNextPage();
                    }, (err) => {
                        if (err) {
                            console.error('Error fetching groups:', err);
                            setError('Error fetching groups');
                        } else {
                            setGroups(fetchedGroups);
                        }
                        setLoading(false);
                    });
            } catch (err) {
                console.error('Error fetching groups:', err);
                setError('Error fetching groups');
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

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
    
    
    
    return (
        <> 
            <h1 id='headr'>Check Results</h1>
            <section id='ares'>
                <div id='testres'>
                    <ol>
                        {groups.map((group, index) => (
                            <li key={group.groupName}>
                                <div id='groupsn'>
                                    {displayMapping[group.groupName]}
                                </div>
                                <div id='ulhov'>
                                    {group.noOfTests > 0 && (
                                        <ul>
                                            {Array.from({ length: group.noOfTests }, (_, i) => (
                                                <li key={`${group.groupName}-Test-${i + 1}`} onClick={() => handleNavigation(group.groupName, i + 1)}>
                                                    Test-{i + 1}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>
        </>
    );
}
