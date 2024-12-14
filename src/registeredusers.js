import React, { useEffect, useState } from 'react';
import base1 from './airtable';  // Ensure the Airtable base is configured correctly
import * as XLSX from 'xlsx'; 
import './registeredusers.css';

export default function Registeredusers() {
    const [allTablesData, setAllTablesData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tablesData = {};
                const newgroupsRecords = await base1('newgroups').select({ view: 'Grid view' }).firstPage();

                for (let record of newgroupsRecords) {
                    const tableName = record.fields['GroupName'];
                    const tableData = [];
                    try {
                        const tableRecords = await base1(tableName).select({ view: 'Grid view' }).firstPage();
                        tableRecords.forEach(tableRecord => {
                            tableData.push({
                                name: tableRecord.fields['Name'],
                                userid: tableRecord.fields['user'],
                                password: tableRecord.fields['pass'],
                            });
                        });
                        tablesData[tableName] = tableData;
                    } catch (tableError) {
                        console.error(`Error fetching table ${tableName}:`, tableError);
                        setError(`Error fetching table ${tableName}: ${tableError.message}`);
                    }
                }

                setAllTablesData(tablesData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching groups:', error);
                setError(`Error fetching groups: ${error.message}`);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDownload = (tableName, data) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, tableName);
        XLSX.writeFile(workbook, `${tableName}_Registered_User_List.xlsx`);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div id='userslist'>
            <p id='uid'>Users Registered Till Now</p>
            {Object.entries(allTablesData).map(([tableName, users]) => (
                <div key={tableName} className='table-section'>
                    <h3 id='head'>{tableName} Users</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>UserId</th>
                                <th>Password</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={index}>
                                    <td>{user.name}</td>
                                    <td>{user.userid}</td>
                                    <td>{user.password}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <section id='sbut'>
                        <button onClick={() => handleDownload(tableName, users)}>Download {tableName} List</button>
                    </section>
                </div>
            ))}
        </div>
    );
}
