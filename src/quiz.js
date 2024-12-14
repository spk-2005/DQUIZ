import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './quiz.css';
import base1 from "./airtable";
import axios from "axios";
import userimage from './userimage.jpg';
import left from './rightmenu.jpg';
import right from './leftmenu.jpg';
import './quizf.css';
function Quiz() {
    const navigate=useNavigate();
    const { testId, name, email } = useParams();
    const [timer, setTimer] = useState(7200);
    const [index, setIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState({});
    const [markedQuestions, setMarkedQuestions] = useState({});
    const [questions, setQuestions] = useState([]);
    const [options, setOptions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [score, setScore] = useState(null);
    const [questionStatus, setQuestionStatus] = useState({});
    const [quizfvis,setquizfvisi]=useState(false);
    const [notvis, setNotVis] = useState(0);
    const [visnotans, setVisNotAns] = useState(0);
    const [vismarked, setVisMarked] = useState(0);
    const [ansmarked, setAnsMarked] = useState(0);
    const [visans, setVisAns] = useState(0);
    
                const fetchedQuestions = [];
                const fetchedOptions = [];
                const fetchedAnswers = [];
                useEffect(() => {
                    base1(`${testId}`)
                        .select({ view: 'Grid view' })
                        .eachPage((records, fetchNextPage) => {
                
                            records.forEach(record => {
                                if (!fetchedQuestions.includes(record.fields['Questions'])) {  // Avoid duplicate questions
                                    fetchedQuestions.push(record.fields['Questions']);
                                    fetchedAnswers.push(record.fields['Answers']);
                                    fetchedOptions.push([
                                        record.fields['Opt1'],
                                        record.fields['Opt2'],
                                        record.fields['Opt3'],
                                        record.fields['Opt4']
                                    ]);
                                }
                            });
                
                            setQuestions(fetchedQuestions);
                            setOptions(fetchedOptions);
                            setAnswers(fetchedAnswers);
                            setNotVis(fetchedQuestions.length);
                
                            fetchNextPage();
                        });
                }, [testId,fetchedAnswers]);
                useEffect(() => {
                    const interval = setInterval(() => {
                        setTimer(prevTimer => {
                            if (prevTimer <= 0) {
                                alert('Time Up');
                                handleyes();
                                clearInterval(interval);
                                return 0;  // Ensure the timer stops at 0
                            }
                            return prevTimer - 1;
                        });
                    }, 1000);
                
                    return () => clearInterval(interval);
                }, []);
                
    const [time1,settime1]=useState()
    const [time2,settime2]=useState()
    useEffect(() => {
        if (score !== null) {
            const remainingTime = 7200 - timer;
            settime1(Math.floor(remainingTime / 60));
            settime2(String(remainingTime % 60).padStart(2, '0'));
             }
    }, [score,selectedOption, name, email, timer]);
    
   
    useEffect(() => {
        const handleClickOutside = (event) => {
            const infoBox = document.getElementById('quiznav1');
            const i1 = document.getElementById('i1');
            const i2 = document.getElementById('i2');

            if (infoBox && !infoBox.contains(event.target) && !i1.contains(event.target) && !i2.contains(event.target)) {
                // Hide quiznav1 when clicking outside of it, i1, or i2
                infoBox.classList.remove('visible');
            }
        };

        const handleClickInside = (event) => {
            const infoBox = document.getElementById('quiznav1');
            if (infoBox) {
                if (infoBox.contains(event.target) && event.target === infoBox) {
                    // Hide quiznav1 when clicking on the empty space inside it
                    infoBox.classList.remove('visible');
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('mousedown', handleClickInside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('mousedown', handleClickInside);
        };
    }, []);

    const handleinfo = () => {
        document.getElementById('quiznav1').style.visibility='visible';
      
    };
    const handleinfoout=()=>{
        document.getElementById('quiznav1').style.visibility='hidden';
    }



    


    const [Questionpaper, setQuestionpaper] = useState(false);
    const openQuestionpaper = () => {
        
        setQuestionpaper(true);
        const questionsJson = encodeURIComponent(JSON.stringify(questions));
        const newWindow1 = window.open(`/question/${questionsJson}`, '_blank', 'noopener,noreferrer,width=600,height=400');
        
        if (newWindow1) {
            newWindow1.onbeforeunload = () => {
                setQuestionpaper(false); 
            };
        } else {
        }
    };


    const [instructionOpen, setInstructionOpen] = useState(false);
    const openInstructions = () => {
        if (instructionOpen) {
            alert('Instruction component is already open.');
            return;
        }
        
        setInstructionOpen(true);
        
        // Declare and open the new window
        const newWindow = window.open(`/instruction2/${name}`, '_blank', 'noopener,noreferrer,width=600,height=400');

        // Check if the window was successfully created
        if (newWindow) {
            newWindow.onbeforeunload = () => {
                setInstructionOpen(false); // Reset the state when the window is closed
            };
        } else {
        }
    };
    
    useEffect(() => {
        document.documentElement.style.setProperty('--visitednotans-content', `"${visnotans}"`);
        document.documentElement.style.setProperty('--visitedans-content', `"${visans}"`);
        document.documentElement.style.setProperty('--markednotans-content', `"${vismarked}"`);
        document.documentElement.style.setProperty('--ansmarked-content', `"${ansmarked}"`);
        document.documentElement.style.setProperty('--notvisited-content', `"${notvis}"`);
    }, [ visnotans, vismarked, ansmarked, visans]);

    const questionChange = (newIndex) => {
        setIndex(newIndex);
        setQuestionStatus(prevState => ({
            ...prevState,
            [newIndex]: selectedOption[newIndex] ? 'visitedans1' : 'visitednotans1'
        }));
        updateCounts();
    };

    const updateCounts = () => {
        let visitedNotAnsweredCount = 0;
        let visitedAnsweredCount = 0;
        let markedNotAnsweredCount = 0;
        let answeredMarkedCount = 0;
        let notVisitedCount = questions.length;
    
        questions.forEach((_, i) => {
            const status = questionStatus[i];
            if (status === 'visitednotans1') {
                visitedNotAnsweredCount++;
                notVisitedCount--;
            } else if (status === 'visitedans1') {
                visitedAnsweredCount++;
                notVisitedCount--;
            } else if (status === 'markednotans1') {
                markedNotAnsweredCount++;
                notVisitedCount--;
            } else if (status === 'ansmarked1') {
                answeredMarkedCount++;
                notVisitedCount--;
            }
        });
    
        setVisNotAns(visitedNotAnsweredCount);
        setVisMarked(markedNotAnsweredCount);
        setAnsMarked(answeredMarkedCount);
        setVisAns(visitedAnsweredCount);
        setNotVis(notVisitedCount);
    };
    
    useEffect(() => {
        updateCounts();
    }, [questionStatus]);

    useEffect(() => {
        const disableRightClick = (event) => {
            event.preventDefault();
        };

        document.addEventListener('contextmenu', disableRightClick);

        return () => {
            document.removeEventListener('contextmenu', disableRightClick);
        };
    }, []);

    const handleOptionChange = (event) => {
        const newSelectedOption = event.target.value;
        const newStatus = selectedOption[index] ? 'visitednotans1' : 'visitedans1';
        setQuestionStatus(prevState => ({
            ...prevState,
            [index]: newSelectedOption ? newStatus : 'visitednotans1'
        }));
        setSelectedOption(prevState => ({
            ...prevState,
            [index]: newSelectedOption
        }));
        updateCounts();
    };

    const handleMarkAsRead = () => {
        setMarkedQuestions(prevState => ({
            ...prevState,
            [index]: true
        }));
        const status = selectedOption[index] ? 'ansmarked1' : 'markednotans1';
        setQuestionStatus(prevState => ({
            ...prevState,
            [index]: status
        }));
        updateCounts();
        if (index < questions.length - 1) {
            setIndex(index + 1);
        }
    };

    const handleClear = () => {
        setSelectedOption(prevState => ({
            ...prevState,
            [index]: ''
        }));
        const status = markedQuestions[index] ? 'markednotans1' : 'visitednotans1';
        setQuestionStatus(prevState => ({
            ...prevState,
            [index]: status
        }));
        updateCounts();
    };

    const handleNext = () => {
        setQuestionStatus(prevState => ({
            ...prevState,
            [index]: selectedOption[index] ? 'visitedans1' : 'visitednotans1'
        }));
        updateCounts();
        if (index < questions.length - 1) {
            setIndex(index + 1);
        }
    };

    const AIRTABLE_API_KEY =`${process.env.REACT_APP_AIRTABLE_API_KEY}`;
    const [showmain,setshowmain]=useState(true);
    const handleSubmit = async () => {
        let newScore = 0;
        setshowmain(false);
        setquizfvisi(true);
        questions.forEach((_, i) => {
            if (selectedOption[i] === `${answers[i]}`) {
                newScore += 1;
            }
        });

        setScore(newScore);
        };
   const handleno=()=>{
    
    setshowmain(true);
    setquizfvisi(false);
   }
  
    const handlemenu = () => {  const quizOverview = document.getElementById('quiz-overview');
        const tit1 = document.getElementById('tit1');
        const lmElement = document.getElementById('lm');
        const currentSrc = lmElement.src;
    
        if (currentSrc.includes(left)) {
            quizOverview.style.display = 'block';
            tit1.style.width = '75%';
            lmElement.src = right; 
        } else {
           
            quizOverview.style.display = 'none';
            tit1.style.width = '100%';
            lmElement.src = left; 
        }
    };
    

    const parsedOptions = selectedOption || {};
    const totalquestions = questions.length; 
    const answered = Object.keys(parsedOptions).length;
    const unattempted = totalquestions - answered;    
    const timeTaken = `${time1 || '0'} minutes and ${time2 || '00'} seconds`;    
    const tableName = `${testId}Result`; 
    const AIRTABLE_API_URL = `https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE_ID}/Checkattempts`;
    const AIRTABLE_API_URL1 =`https://api.airtable.com/v0/${process.env.REACT_APP_AIRTABLE_BASE_ID}/${encodeURIComponent(tableName)}`; 
const [isSubmitting, setIsSubmitting] = useState(false);
useEffect(() => {
    const unloadCallback = (event) => {
      event.preventDefault();
      event.returnValue = "";
      return "";
    };
  
    window.addEventListener("beforeunload", unloadCallback);
    return () => window.removeEventListener("beforeunload", unloadCallback);
  }, []);
const handleyes = async () => {
    if (name && email) {
        try {
            setIsSubmitting(true);

            const newScore = parseInt(score) || 0;
            const perc = parseFloat(((newScore / totalquestions) * 100).toFixed(2));
            const finalresult = perc >= 40 ? 'PASS' : 'FAIL';

            const submissionData1 = {
                fields: {
                    Name: name,
                    email: email,
                    unattemmpted: unattempted,
                    attempted: answered,
                    score: score,
                    correct: score,
                    wrong: answered - score,
                    percentage: perc,
                    finalresult: finalresult,
                    timetaken: timeTaken,
                    timetaken2: timer,
                }
            };

            // Debugging logs
            console.log('Airtable URL:', AIRTABLE_API_URL1);
            console.log('Data to be sent to Airtable:', submissionData1);

            await axios.post(AIRTABLE_API_URL1, submissionData1, {
                headers: {
                    Authorization: `Bearer ${AIRTABLE_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            alert('Navigating to response...');
            navigate(`/res/${name}/${email}/${testId}/${answered}/${newScore}/${timeTaken}/${finalresult}/${questions.length}/${perc}`);

        } catch (error) {
            console.error('Error details:', error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
                console.error('Error response headers:', error.response.headers);
            } else {
                console.error('Error message:', error.message);
            }
            alert('An error occurred. Check the console for details.');
        } finally {
            setIsSubmitting(false);
        }
    } else {
        alert('Name and email are required to submit.');
    }
};

const displayMapping = {
    'Group-1': 'EOT 141',
    'Group-2': 'GOT88',
    'Group-3': 'GOT 97',
    'Group-4': 'CODE 08',
    'Group-5': 'CODE 10',
    'Group-6': 'CODE 146',
    'Group-7': 'CODE 148'
};


const groupMatch = Object.keys(displayMapping).find(group => testId.includes(group));

const displayText = groupMatch ? testId.replace(groupMatch, displayMapping[groupMatch]) : testId;




    return (
        <>
        {showmain &&
        <section>
        <div id="quiznav1">  
        <ul>
            <li>{displayText}</li>
    <li><span className='notvisited2'></span>Not Visited</li>
    <li><span className='visitednotans2'></span>Not Answered</li>
        <li><span className='visitedans2'></span>Answered</li>
        <li><span className='markednotans2'></span>Marked For Review</li>
        <li><span className='ansmarked2'></span>Answered But Marked For Review</li>
    </ul>
    </div>
        <section id="rightclick">
            <section id="details">
                <ol>
                    <li>{displayText}</li>
                    <li onClick={openQuestionpaper}>&#128196; Question Paper</li>
                    <li onClick={openInstructions} style={{ cursor: 'pointer' }}>
                        <i>&#128712;</i> View Instructions
                    </li>
                </ol>
            </section>
            <section id="parent">
                <section id="tit">
                    <div id="tit1">
                        <div id="t1back" style={{display:'none'}}>
                            <span id="t1" >{displayText}<ion-icon name="information-circle-sharp" id='i1'onMouseLeave={handleinfoout} onMouseEnter={handleinfo}></ion-icon></span>
                        </div>
                        <div id="time">
                            <span id="ts">Sections</span>
                            <span id="tr">Time Remaining: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}</span>
                        </div>
                        <div id="t2back">
                            <span id="t2">{displayText}<ion-icon name="information-circle-sharp" id='i2' onMouseLeave={handleinfoout} onMouseEnter={handleinfo}></ion-icon></span>
                            
                        </div>
                        <div id="mcq" style={{display:'none'}}>
                            <span>Question Type: MCQ</span>
                        </div>
                        <div id="qno">
                            <span>Question No. {index + 1}</span>
                        </div>
                        <div id='quizsetting'>
                            <ol>
                                <li className="non-selectable"><p aria-readonly>{questions[index]}</p></li>
                                {options[index] && options[index].map((option, i) => (
                                    <li key={i} className="non-selectable">
                                        <input
                                            type='radio'
                                            value={option}
                                            checked={selectedOption[index] === option}
                                            onChange={handleOptionChange} readOnly
                                        />
                                        {option}
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>


                    <div id="left-menu">
                            <img src={right} alt="error" id="lm" onClick={handlemenu} />
                        </div>



                    <div id="quiz-overview">
                        
                        <div id="quser">
                            <img src={userimage} alt="error" />
                            <p>{name}</p>
                        </div>
                        <div id="quiznav">
                            <ul>
                            <li style={{display:'flex',flexDirection:'row',alignItems:'center',marginTop:'1px',paddingTop:'1px'}}><span className='notvisited2'></span><sup>Not Visited</sup></li>
                            <li style={{display:'flex',flexDirection:'row',alignItems:'center'}}><span className='visitednotans2'></span><sup>Not Answered</sup></li>
                                <li style={{display:'flex',flexDirection:'row',alignItems:'center'}}><span className='visitedans2'></span><sup>Answered</sup></li>
                                <li style={{display:'flex',flexDirection:'row',alignItems:'center'}}><span className='markednotans2'></span><sup>Marked For Review<br/></sup></li>
                                <li style={{display:'flex',flexDirection:'row',alignItems:'center'}}><span className='ansmarked2'></span><sup>Answered But Marked For Review</sup></li>
                            </ul>
                        </div>
                        <div id="questioncontrols">
                            <h6>{displayText}</h6>
                            <h6 id="qt">Choose Question</h6>
                            <div id="selection">
                            {questions.map((_, i) => (
                                <p key={i} onClick={() => questionChange(i)} className={questionStatus[i] || 'notvisited1'}>{i + 1}</p>
                            ))}
                            </div>
                        </div>
                    </div>
                </section>
            </section>
            <section id="controls">
                <div id="controls1">
                    <button onClick={handleMarkAsRead}>Mark For Review & Next</button>
                    <button onClick={handleClear}>Clear Response</button>
                    <button onClick={handleNext}>Save & Next</button>
                    <button onClick={handleSubmit}>Submit</button>
                </div>
            </section>
            </section>
            </section>
}  
            {quizfvis &&
            <div id='fsub'>
            <table>
                <tbody>
                    <tr>
                        <th>Section Name</th>
                        <th>No. Of Questions</th>
                        <th>Answered</th>
                        <th>Unanswered</th>
                        <th>Marked For Review</th>
                        <th>Answered and Marked For Review (will not consider for evaluation)</th>
                        <th>Not Visited</th>
                    </tr>
                    <tr>
                        <td>{displayText}</td>
                        <td>{totalquestions}</td>
                        <td>{answered}</td>
                        <td>{unattempted}</td>
                        <td>{vismarked}</td>
                        <td>{ansmarked}</td>
                        <td>{notvis}</td>
                    </tr>
                </tbody>
            </table>
            <form>
                <span>Are you sure you want to submit?</span>
                <br />
                <div id="ynbuts">
                <button type="button" onClick={handleno}>No</button>
                <button type="button" onClick={handleyes}>Yes</button>
                </div>
            </form>
        </div>
}
        </>
    );
}

export default Quiz;
