import React, { useState, useEffect } from 'react';

const CompletedLevels = () => {
    const [userCompletions, setUserCompletions] = useState([]);

    useEffect(() => {
        // Fetch user completions data
        const userID = localStorage.getItem('userID');

        fetch('http://localhost/api/getUserCompletions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userID })
        })
        .then(response => response.json())
        .then(data => {
            setUserCompletions(data.completions);
        })
        .catch(error => {
            console.error('Error fetching user completions:', error);
        });
    }, []); // Run this effect only once when the component mounts

    return (
        <div className="completed-container">
            <div className="difficulty-section">
                Easy
                <div className={`grid-section ${userCompletions.some(completion => completion.difficulty === 'easy' && completion.grid === '3x3') ? '' : 'incomplete'}`}>3x3</div>
                <div className={`grid-section ${userCompletions.some(completion => completion.difficulty === 'easy' && completion.grid === '5x5') ? '' : 'incomplete'}`}>5x5</div>
                <div className={`grid-section ${userCompletions.some(completion => completion.difficulty === 'easy' && completion.grid === '7x7') ? '' : 'incomplete'}`}>7x7</div>
            </div>
            <div className="difficulty-section">
                Medium
                <div className={`grid-section ${userCompletions.some(completion => completion.difficulty === 'medium' && completion.grid === '3x3') ? '' : 'incomplete'}`}>3x3</div>
                <div className={`grid-section ${userCompletions.some(completion => completion.difficulty === 'medium' && completion.grid === '5x5') ? '' : 'incomplete'}`}>5x5</div>
                <div className={`grid-section ${userCompletions.some(completion => completion.difficulty === 'medium' && completion.grid === '7x7') ? '' : 'incomplete'}`}>7x7</div>
            </div>
            <div className="difficulty-section">
                Hard
                <div className={`grid-section ${userCompletions.some(completion => completion.difficulty === 'hard' && completion.grid === '3x3') ? '' : 'incomplete'}`}>3x3</div>
                <div className={`grid-section ${userCompletions.some(completion => completion.difficulty === 'hard' && completion.grid === '5x5') ? '' : 'incomplete'}`}>5x5</div>
                <div className={`grid-section ${userCompletions.some(completion => completion.difficulty === 'hard' && completion.grid === '7x7') ? '' : 'incomplete'}`}>7x7</div>
            </div>
        </div>
    );
};

export default CompletedLevels;
