import React from 'react';
import './main.css';

function Main() {
    function CustomLink({ href, children, ...props }) {
        const path = window.location.pathname;
        return (
            <li className={path === href ? "active" : ""}>
                <a href={href}>{children}</a>
            </li>
        );
    }

    return (
        <section id='nav'>
            <div>
                <ol>
                    <CustomLink href='./admin'>Admin</CustomLink>
                    {/* Add more CustomLink components as needed */}
                </ol>
            </div>
        </section>
    );
}

export default Main;
