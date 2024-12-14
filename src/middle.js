import React from 'react';
import { useNavigate } from 'react-router-dom';
import './middle.css';

export default function Middle() {
    const navigate = useNavigate();
    
    return (
        <div className="marquee-container">
            <div className="marquee">
                Not Registered Yet?
                <button onClick={() => navigate(`./contact`)}>Contact Now</button>
            </div>
        </div>
    );
}
