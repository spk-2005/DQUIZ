import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Groupadding() {
  const [groupNumber, setGroupNumber] = useState('');

  const handleGroupNumberChange = (e) => {
    setGroupNumber(e.target.value);
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    sessionStorage.setItem('groupNumber', groupNumber);
    alert('success');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Enter Group Number"
          value={groupNumber}
          onChange={handleGroupNumberChange}
          required
        />
        <button type="submit">Create Group</button>
      </form>
    </div>
  );
}
