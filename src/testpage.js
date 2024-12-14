import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';

import './testpage.css';
import user from './user.png';
import keyboard from './keyboard.png';
import lock from './Lock-26.png';
import usei from './userimage.jpg';
import Popup from './popup';

function Testpage() {
    const { testId } = useParams();
    const navigate = useNavigate();
    const AIRTABLE_API_URL = `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE_ID}/${encodeURIComponent(testId)}`;
    const AIRTABLE_API_KEY = `${process.env.REACT_APP_AIRTABLE_API_KEY}`;

    const [keyboardInput, setKeyboardInput] = useState("");
    const [focusedInput, setFocusedInput] = useState(null);

    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState(""); // Store popup message

    const handleShowPopup = (message) => {
        setPopupMessage(message); // Set message before showing the popup
        setShowPopup(true);
    };

    const handleClosePopup = () => setShowPopup(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const name = event.target.name.value;
        const email = event.target.email.value;
        const password = event.target.password.value;

        if (name && email && password) {
            try {
                const response = await axios.get(AIRTABLE_API_URL, {
                    headers: {
                        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    params: {
                        filterByFormula: `AND({user} = "${email}", {pass} = "${password}")`,
                    },
                });

                if (response.data.records.length > 0) {
                    handleShowPopup("Success");
                    sessionStorage.setItem('isAuthenticated2', true);
                    navigate(`/test2/${testId}/${name}/${email}`);
                } else {
                    handleShowPopup("Email or password is incorrect. Please try again.");
                }
            } catch (error) {
                handleShowPopup("Check your network connection or an error occurred while checking the credentials.");
            }
        } else {
            handleShowPopup("Please fill in all fields.");
        }
    };

    const displayMapping = {
        'Group-1': 'EOT 141',
        'Group-2': 'GOT88',
        'Group-3': 'GOT 97',
        'Group-4': 'CODE 08',
        'Group-5': 'CODE 10',
        'Group-6': 'CODE 146',
        'Group-7': 'CODE 148',
    };

    const handleInputChange = (input) => {
        setKeyboardInput(input);
        if (focusedInput) {
            focusedInput.value = input;
        }
    };

    const handleKeyboardIconClick = (inputRef) => {
        if (focusedInput === inputRef) {
            setFocusedInput(null); // Hide keyboard if the same icon is clicked again
        } else {
            setFocusedInput(inputRef);
            setKeyboardInput(inputRef.value || ""); // Set keyboard input to current field value
        }
    };

    return (
        <>
            <section id="tlog1">
                <span>
                    System Name:<h3>C001</h3>
                </span>
                <h2>
                    TestName:<h3>{displayMapping[testId]}</h3>
                </h2>
                <img src={usei} alt="err" />
            </section>
            <section id="testlog-section">
                <div id="testlog-cont">
                    <p id="testhe">Login</p>
                    <form onSubmit={handleSubmit}>
                        <span>
                            <img src={user} alt="e" />
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter Your Full Name"
                                id="tuser"
                            />
                            <img
                                src={keyboard}
                                id="key"
                                alt="keyboard"
                                onClick={() => handleKeyboardIconClick(document.getElementById('tuser'))}
                            />
                        </span>

                        <span>
                            <img src={user} alt="er" />
                            <input
                                type="text"
                                name="email"
                                placeholder="Enter Your User Id"
                                id="temail"
                            />
                            <img
                                id="key"
                                src={keyboard}
                                alt="keyboard"
                                onClick={() => handleKeyboardIconClick(document.getElementById('temail'))}
                            />
                        </span>

                        <span>
                            <img src={lock} alt="" />
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter Your Password"
                                id="tpassword"
                            />
                            <img
                                src={keyboard}
                                id="key"
                                alt="keyboard"
                                onClick={() => handleKeyboardIconClick(document.getElementById('tpassword'))}
                            />
                        </span>

                        <button type="submit">Submit</button>
                    </form>
                </div>

                {focusedInput && (
                    <div className="keyboard-container">
                        <Keyboard
                            onChange={handleInputChange}
                            input={keyboardInput}
                            theme="hg-theme-default"
                            layout={{
                                default: [
                                    "1 2 3 4 5 6 7 8 9 0 {bksp}",
                                    "q w e r t y u i o p",
                                    "a s d f g h j k l",
                                    "{shift} z x c v b n m {enter}",
                                    "{space}",
                                ],
                            }}
                            display={{
                                "{bksp}": "⌫",
                                "{enter}": "⏎",
                                "{shift}": "⇧",
                                "{space}": "␣",
                            }}
                        />
                    </div>
                )}
            </section>

            {showPopup && <Popup mes={popupMessage} onClose={handleClosePopup} />}
        </>
    );
}

export default Testpage;
