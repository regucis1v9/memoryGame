import React, { useState, useEffect } from 'react';

const GameHistory = () => {
    const [userGames, setUserGames] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        // Fetch user games from the API
        const fetchUserGames = async () => {
            try {
                // Get userID from localStorage
                const userID = localStorage.getItem('userID');

                if (userID) {
                    const response = await fetch('http://localhost/api/getUserGames', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ userID: userID })
                    });

                    if (response.ok) {
                        const responseData = await response.json();
                        if (Array.isArray(responseData.games)) {
                            setUserGames(responseData.games);
                        } else {
                            throw new Error('Invalid response data format');
                        }
                    } else {
                        throw new Error('Failed to fetch user games');
                    }
                } else {
                    throw new Error('userID not found in localStorage');
                }
            } catch (error) {
                console.error(error);
                // Handle error
            } finally {
                setLoading(false); // Set loading to false regardless of success or failure
            }
        };

        fetchUserGames();
    }, []); 

    return (
        <div className="game-history">
            <div className="game-history-top">
                <div className="history-top-box">Score</div>
                <div className="history-top-box">Time</div>
                <div className="history-top-box">Difficulty</div>
                <div className="history-top-box">Grid</div>
            </div>
            <div className="top-accent"></div>
            {loading ? (
                <div>Loading...</div>
            ) : userGames.length === 0 ? (
                <div className="history-error-box">
                    No games played
                </div>
            ) : (
                userGames.map((game, index) => (
                    <div className="history-data-row" key={index}>
                        <div className="history-data-box">{game.score}</div>
                        <div className="history-data-box">{game.time}</div>
                        <div className="history-data-box">{game.difficulty}</div>
                        <div className="history-data-box">{game.grid}</div>
                    </div>
                ))
            )}
        </div>
    );
};

export default GameHistory;
