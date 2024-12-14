import React, { useEffect, useState } from 'react';
import axios from 'axios';
import base1 from './airtable';
import './registernew.css';

export default function Registernew() {
    const AIRTABLE_API_KEY = `${process.env.REACT_APP_AIRTABLE_API_KEY}`; // Use environment variables for sensitive data
    const [formdat, setformdat] = useState({
        groupname: '',
        name: '',
        user: '',
        pass: '',
        ate: '',
    });

    const [groups, setGroups] = useState([]);
    const [notests, setnotests] = useState([]);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const records = await base1('newgroups').select({ view: 'Grid view' }).firstPage();
                const fetchedGroups = records.map(record => record.fields['GroupName']);
                setGroups([...new Set(fetchedGroups)]);
            } catch (error) {
                console.error('Error fetching groups:', error);
            }
        };

        fetchGroups();
    }, []);

    useEffect(() => {
        if (formdat.groupname) {
            const fetchTests = async () => {
                try {
                    const records = await base1('newgroups')
                        .select({
                            filterByFormula: `{GroupName} = "${formdat.groupname}"`,
                            view: 'Grid view'
                        })
                        .firstPage();

                    const tests = records.map(record => record.fields['nooftests']);
                    setnotests(tests);
                } catch (error) {
                    console.error('Error fetching tests:', error);
                }
            };

            fetchTests();
        }
    }, [formdat.groupname]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setformdat({ ...formdat, [name]: value });
    };

    const checkUsernameExists = async (username) => {
        try {
            const records = await base1('Checkattempts')
                .select({
                    filterByFormula: `{userid} = "${username}"`,
                    view: 'Grid view'
                })
                .firstPage();

            return records.length > 0; // If records are found, username exists
        } catch (error) {
            console.error('Error checking username:', error);
            return false; // Handle error case (e.g., assume username does not exist)
        }
    };

    const handleSubmit = async () => {
        const attemptsValue = Number(formdat.ate);

        if (await checkUsernameExists(formdat.user)) {
            alert('Username already exists. Please choose a different username.');
            return;
        }

        const submissionData = {
            fields: {
                Name: formdat.name,
                user: formdat.user,
                pass: formdat.pass,
                attempts: attemptsValue,
            }
        };

        const AIRTABLE_API_URL1 = `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE_ID}/${formdat.groupname}`;

        try {
            for (let i = 0; i < notests; i++) {
                const testFieldName = `${formdat.groupname}Test-${i + 1}`;
                const AIRTABLE_API_URL = `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE_ID}/Checkattempts`;
                const submissionDataForTest = {
                    fields: {
                        TestId: testFieldName,
                        Name: formdat.name,
                        userid: formdat.user,
                        checkattempt: attemptsValue,
                    }
                };

                await axios.post(AIRTABLE_API_URL, submissionDataForTest, {
                    headers: {
                        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
                        'Content-Type': 'application/json'
                    }
                });
            }

            await axios.post(AIRTABLE_API_URL1, submissionData, {
                headers: {
                    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            alert('Successfully Registered');
            setformdat({
                name: '',
                user: '',
                pass: '',
                groupname: '',
                ate: '',
            });
        } catch (error) {
            console.error('Error submitting data to Airtable:', error);
            alert('Error submitting data to Airtable. Check console for details.');
        }
    };

    
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
        <div id='newregist'>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <select name="groupname" onChange={handleChange} value={formdat.groupname}>
                                <option value="" disabled>Select Group</option>
                                {groups.map((group, index) => (
                                    <option key={index} value={group}>
                                        {displayMapping[group]}
                                    </option>
                                ))}
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td><input type='text' name='name' placeholder='Enter Name' onChange={handleChange} value={formdat.name} /></td>
                    </tr>
                    <tr>
                        <td><input type='text' name='user' placeholder='Create User' onChange={handleChange} value={formdat.user} /></td>
                    </tr>
                    <tr>
                        <td><input type='password' name='pass' placeholder='Create Password' onChange={handleChange} value={formdat.pass} /></td>
                    </tr>
                    <tr>
                        <td><input type='number' name='ate' placeholder='Enter attempts' onChange={handleChange} value={formdat.ate} /></td>
                    </tr>
                </tbody>
            </table>
            <section id='rbut'>
                <button onClick={handleSubmit}>Submit</button>
            </section>
        </div>
    );
}
