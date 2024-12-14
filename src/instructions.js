    import React, { useState } from 'react';
    import { useNavigate, useParams } from 'react-router-dom';
    import './instructions.css'; // Make sure to import your CSS file
    import userimage from './userimage.jpg';
import Popup from './popup';
    function Instruction() {
        
            const [showPopup, setShowPopup] = useState(false);
            const [popupMessage, setPopupMessage] = useState(""); // Store popup message
        
            const handleShowPopup = (message) => {
                setPopupMessage(message); // Set message before showing the popup
                setShowPopup(true);
            };
        
            const handleClosePopup = () => setShowPopup(false);
        
        const [shownext, setShownext] = useState(true);
        const [isConfirmed, setIsConfirmed] = useState(false);
        const { testId, name, email } = useParams();
        const navigate = useNavigate();

        const handleCheckboxChange = (event) => {
            setIsConfirmed(event.target.checked);
        };

        const handleOK = () => {
            if (isConfirmed) {
                handleShowPopup("If You Press Back You Will Loose Your Attempt.");
                navigate(`/quiz/${testId}/${name}/${email}`);
            }
        };

        const handleNext = () => {
            setShownext(false);
        };

        const handlePrevious = () => {
            setShownext(true);
        };

        return (
            <>
                <section id='inst'>
                    <div id='mainins' style={{
                            height: shownext ? '530px' : '400px', // Adjust height when "Previous" button is shown
                            transition: 'height 0.3s ease', // Smooth transition for height change
                        }}>
                        <div id='another'>
                            <div id='inshead'>{shownext ? 'Instructions' : 'Other Important Instructions'}</div>
                            <center style={{ display: shownext ? 'block' : 'none' }}>
                                <font size="4">Please read the instructions carefully</font>
                            </center>
                            <p style={{ display: shownext ? 'block' : 'none' }}>General Instructions</p>
                            <ol style={{ display: shownext ? 'block' : 'none' }}>
                                <li>Total duration of examination is 120 minutes.</li>
                                <li>The clock will be set at the server. The countdown timer in the top right corner of the screen will display the remaining time available for you to complete the examination. When the timer reaches zero, the examination will end by itself. You will not be required to end or submit your examination.</li>
                                <li>The Question Palette displayed on the right side of the screen will show the status of each question using one of the following symbols:</li>
                            </ol>
                            <ul start='a' style={{ display: shownext ? 'block' : 'none' }}>
                                <li><span className='notvisited'></span>You have not visited the question yet.</li>
                                <li><span className='visitednotans'></span>You have not answered the question.</li>
                                <li><span className='visitedans'></span>You have answered the question.</li>
                                <li><span className='notansmarked' style={{alignItems:'center'}}></span>You have NOT answered the question <br/>but have marked it for review.</li>
                                <li><span className='ansmarked'></span>You have answered the question <br/>but marked it for review.</li>
                            </ul>
                            <ol start={4} style={{ display: shownext ? 'block' : 'none' }}>
                                <li>You can click on the "&gt;" arrow which appears to the left of the question palette to collapse the question palette thereby maximizing the question window. To view the question palette again, you can click on "&lt;" which appears on the right side of the question window.</li>
                                <p style={{ display: shownext ? 'block' : 'none' }}>Navigating to a Question:</p>
                                <li>To answer a question, do the following:</li>
                                <ul id='sec' style={{ display: shownext ? 'block' : 'none' }}>
                                    <li>Click on the question number in the Question Palette at the right of your screen to go to that numbered question directly. Note that using this option does NOT save your answer to the current question.</li>
                                    <li>Click on Save & Next to save your answer for the current question and then go to the next question.</li>
                                    <li>Click on Mark for Review & Next to save your answer for the current question, mark it for review, and then go to the next question.</li>
                                </ul>
                                <p style={{ display: shownext ? 'block' : 'none' }}>Answering a Question:</p>
                                <li>Procedure for answering a multiple choice type question:</li>
                                <ul style={{ display: shownext ? 'block' : 'none' }}>
                                    <li>To select your answer, click on the button of one of the options.</li>
                                    <li>To deselect your chosen answer, click on the button of the chosen option again or click on the Clear Response button.</li>
                                    <li>To change your chosen answer, click on the button of another option.</li>
                                    <li>To save your answer, you MUST click on the Save & Next button.</li>
                                    <li>To mark the question for review, click on the Mark for Review & Next button.</li>
                                </ul>
                                <li>To change your answer to a question that has already been answered, first select that question for answering and then follow the procedure for answering that type of question.</li>
                                <p style={{ display: shownext ? 'block' : 'none' }}>Navigating through sections:</p>
                                <li>Sections in this question paper are displayed on the top bar of the screen. Questions in a section can be viewed by clicking on the section name. The section you are currently viewing is highlighted.</li>
                                <li>After clicking the Save & Next button on the last question for a section, you will automatically be taken to the first question of the next section.</li>
                                <li>You can shuffle between sections and questions anytime during the examination as per your convenience only during the time stipulated.</li>
                                <li>Candidate can view the corresponding section summary as part of the legend that appears in every section above the question palette.</li>
                            </ol>
                        </div>
                        <h4 style={{ display: shownext ? 'none' : 'block' }}>This is a Mock test. The Question paper displayed is for practice purposes only. Under no circumstances should this be presumed as a sample paper.</h4>
                    
                    </div>
                    <div id='user'>
                        <img src={userimage} alt='User'/>
                        <center><h2>{name}</h2></center>
                    </div>
                </section>
                <section id='inscontrols1'>
                    <div>
                        <form>
                            <span id='insprev' onClick={handlePrevious} style={{ display: shownext ? 'none' : 'block' }}>&lt; Previous</span>
                            <form>
    {shownext ? (
        <div>
        {/* Instructions here */}
        <span id="insnext" onClick={handleNext}>Next &gt;</span>
        </div>
    ) : (
        <div>
        {/* Checkbox and button for confirming readiness */}
        <label>
            <input
            type="checkbox"
            name="confirm"
            onChange={handleCheckboxChange}
            id="check"
            
            />I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I declare that I am not in possession of / not wearing / not carrying any prohibited gadget like mobile phone, bluetooth devices etc. /any prohibited material with me into the Examination Hall.I agree that in case of not adhering to the instructions, I shall be liable to be debarred from this Test and/or to disciplinary action, which may include ban from future Tests / Examinations
        </label>
        <br />
        <button
            type="button"
            onClick={handleOK}
            disabled={!isConfirmed}
            id="ready"
            className={isConfirmed ? 'confirmed' : ''}
        >
            I am ready to begin
        </button>
        </div>
    )}
    </form>

                        </form>
                    </div>
                </section>
                
                            {showPopup && <Popup mes={popupMessage} onClose={handleClosePopup} />}
                
            </>
        );
    }

    export default Instruction;
