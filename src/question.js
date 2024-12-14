import React from 'react';
import { useParams } from 'react-router-dom';

export default function Question() {
    const { name } = useParams();
    const [questions, setQuestions] = React.useState([]);

    React.useEffect(() => {
        const questionsJson = decodeURIComponent(name);
        const parsedQuestions = JSON.parse(questionsJson);
        setQuestions(parsedQuestions);
    }, [name]);

    return (
        <div>
            <h1>Questions</h1>
            {questions.length > 0 ? (
                <ul>
                    {questions.map((question, index) => (
                        <li key={index}>{question}</li>
                    ))}
                </ul>
            ) : (
                <p>No questions available.</p>
            )}
        </div>
    );
}
