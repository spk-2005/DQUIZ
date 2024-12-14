import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './titles.css';
import base1 from "./airtable";

function Titles() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]); 

  useEffect(() => {
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
  }, []);

  const handleTest = (test) => {
    navigate(`/testpage/${test}`);
  };
   const display=['EOT 141','GOT88','GOT 97','CODE 08','CODE 10','CODE 146','CODE 148'];
  return (
    <>
      <section id="titles">
        <h2>Take Your Mock Test Now</h2>
        <ol>
          {groups.map((test, index) => (
            <li key={index} onClick={() => handleTest(test)}>
              {display[index]}
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}

export default Titles;
