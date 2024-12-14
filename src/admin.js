import React, { useState } from 'react';
import { auth } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import './admin.css';
import { useNavigate } from 'react-router-dom';

function Admin() {

    const [data, setData] = useState({
        email: '',
        pass: ''
    });

    const { email, pass } = data;
    const navigate = useNavigate();

    const changeHandler = e => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const signin = async (e) => {
        e.preventDefault();
        
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, pass);
            const user = userCredential.user;
    
            // Store user authentication status in sessionStorage
            sessionStorage.setItem('isAuthenticated', true);
    
            navigate(`/adminmenu`);
        } catch (err) {
            alert("Failed to sign in. Please check your credentials.");
        }
    };
    
    
    return (
        <>
            <p id='ahead'>Note: Only admins can login here</p>
            <section id='admin'>
                <form onSubmit={signin}>
                    <input
                        type='email'
                        name='email'
                        placeholder='Enter Email'
                        value={email}
                        onChange={changeHandler}
                        aria-label='Email'
                        required
                    /><br/>
                    <input
                        type='password'
                        name='pass'
                        placeholder='Enter Password'
                        value={pass}
                        onChange={changeHandler}
                        aria-label='Password'
                        required
                    />
                    <button type='submit'>Submit</button>
                </form>
            </section>
        </>
    );
}

export default Admin;
