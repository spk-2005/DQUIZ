import React, { useEffect, useState } from 'react';
import axios from 'axios';
import base1 from './airtable';
import './addingtests.css';
export default function Addingtests() {
  const display = ['EOT 141', 'GOT121', 'EOT 141', 'GOT121', 'EOT 141', 'GOT121'];

  const [groups, setGroups] = useState([]);
  const [selectedTest, setSelectedTest] = useState('');
  const [numTests, setNumTests] = useState('');

  useEffect(() => {
    const fetchGroups = async () => {
      const fetchedGroups = [];

      base1('newgroups')
        .select({ view: 'Grid view' })
        .eachPage((records, fetchNextPage) => {
          records.forEach(record => {
            if (!fetchedGroups.includes(record.fields['GroupName'])) {
              fetchedGroups.push(record.fields['GroupName']);
            }
          });

          setGroups([...fetchedGroups]);
          fetchNextPage();
        });
    };

    fetchGroups();
  }, []);

  const handleTestChange = (event) => {
    setSelectedTest(event.target.value);
    alert(`Selected test: ${event.target.value}`);
  };

  const handleNumChange = (event) => {
    setNumTests(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const AIRTABLE_API_URL = `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE_ID}/newgroups`;
    const AIRTABLE_API_KEY = `${process.env.REACT_APP_AIRTABLE_API_KEY}`; // Use environment variables for API key

    try {
      const selectedIndex = display.indexOf(selectedTest);

      const groupName = `Group-${selectedIndex + 1}`;

      const response = await axios.get(`${AIRTABLE_API_URL}?filterByFormula={GroupName}='${groupName}'`, {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.records.length === 0) {
        console.error('No record found with the derived group name.');
        return;
      }

      const recordId = response.data.records[0].id;


      const updateResponse = await axios.patch(
        `${AIRTABLE_API_URL}/${recordId}`,
        {
          fields: {
            nooftests: parseInt(numTests, 10), 
          },
        },
        {
          headers: {
            Authorization: `Bearer ${AIRTABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      alert('Success');
    } catch (error) {
      alert('Sorry,Error occured while updating');
      console.error('Error updating record:', error);
    }
  };

  return (
    <>
    <h1 id='teshead'>Updating Tests For Selected Groups</h1>
    <section id='addtests'>
      <div>
        <form onSubmit={handleSubmit}>
          <select onChange={handleTestChange} value={selectedTest}>
            <option value='' disabled>Select Group</option>
            {display.map((test, index) => (
              <option key={index} value={test}>
                {display[index] || 'Select a test'}
              </option>
            ))}
          </select>
          <input 
            type='number' 
            name='testno' 
            placeholder='Enter number of tests' 
            value={numTests}
            onChange={handleNumChange} 
          /> 
          <button type='submit'>Submit</button>
        </form>
      </div>
    </section></>
  );
}
