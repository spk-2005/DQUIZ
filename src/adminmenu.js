import React from 'react';
import './adminmenu.css';

export default function Adminmenu() {
    function CustomLink({ href, children }) {
        const path = window.location.pathname;
        return (
            <li className={path === href ? "active" : ""}>
                <a href={href}>{children}</a>
            </li>
        );
    }

    // Function to handle logout action
    function handleLogout() {

        sessionStorage.removeItem('isAuthenticated');
        window.location.href = '/'; 
    }
    
    

    return (
        <div id='adme'>
            <h2>Welcome To Admin Portal</h2>
            <div id='menu'>
                <ol>
                    <CustomLink href='./admintest'>Test Results</CustomLink>
                    <CustomLink href='./registernew'>Register New User</CustomLink>
                    <CustomLink href='./registeredusers'>Show All Registered Users</CustomLink>
                    <CustomLink href='./addingtests'>Add Tests To Groups</CustomLink>
                    <CustomLink href='./addingquestions'>Add Questions</CustomLink>
                    <li>
                        <button onClick={handleLogout} className="logout-btn">Logout</button>
                    </li>
                </ol>
            </div>
        </div>
    );
}
