import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateReplay } from '../actions/replayAction';

const EndGame = ({ resetGame }) => {
    const rank = useSelector(state => state.rank.rank);
    const gameStateMessage = useSelector(state => state.gameStateMessage.gameStateMessage);
    const score = useSelector(state => state.score.score);
    const gameState = useSelector(state => state.gameState.gameState);
    const time = useSelector(state => state.time.time);
    const difficulty = useSelector(state => state.difficulty.difficulty);
    const grid = useSelector(state => state.grid.grid);
    const [fetchInitiated, setFetchInitiated] = useState(false); // Track whether fetch request has been initiated
    const localGems = localStorage.getItem('gems');

    let gems = 0;
    let timeBonus = 0;
    let disableContinueButton = false; // Initialize disable state of the continue button

    if (gameState === "win") {
        gems = time + score;
        timeBonus = time;
        if (!fetchInitiated) {
            gems += parseInt(localGems, 10) || 0; // If localGems is null or cannot be parsed as a number, default to 0
            localStorage.setItem("gems", gems);
            const userID = localStorage.getItem('userID');
            // First fetch request to 'newGame' endpoint
            fetch('http://localhost/api/newGame', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userID,
                    score,
                    difficulty,
                    grid,
                    time
                })
            })
            .then(response => {
                // Handle response
                gems = time + score;
                fetch('http://localhost/api/updateGems', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userID,
                        gems
                    })
                })
                .then(response => {
                })
                .catch(error => {
                    // Handle error
                    console.error('Error updating gems:', error);
                });
            })
            .catch(error => {
                // Handle error
                console.error('Error sending game data:', error);
            });
            setFetchInitiated(true); // Set flag to true to indicate fetch request has been initiated
        }
    } else if (gameState === "lose") {
        disableContinueButton = true; // Set disable state of the continue button
    }

    useEffect(() => {
        return () => {
            setFetchInitiated(false);
        };
    }, []);
    
    const continueGame = () => {
        resetGame();
    }

    return (
        <div className="overlay">
            <div className="end-game-box">
                <div className="end-game-title">{gameStateMessage}</div>
                <div className="end-game-row">
                    <div className="end-game-left">
                        Ranking:
                        <div className="personal-best-text"></div>
                    </div>
                    <div className="end-game-right">
                        {rank}
                    </div>
                </div>
                <div className="end-game-row">
                    <div className="end-game-left">
                        Score:
                        <div className="personal-best-text"></div>
                    </div>
                    <div className="end-game-right">
                        {score}
                    </div>
                </div>
                <div className="end-game-row">
                    <div className="end-game-left">
                        Time bonus:
                        <div className="personal-best-text"></div>
                    </div>
                    <div className="end-game-right">
                        {timeBonus}
                    </div>
                </div>
                <div className="end-game-row m-top-30">
                    <div className="end-game-left">
                        Gems:
                        <div className="personal-best-text"></div>
                    </div>
                    <div className="end-game-right">
                        <img src="/icons/coins.svg" alt="" />
                        <div className="end-game-coins">{gems}</div>
                    </div>
                </div>
                <button className="end-game-button" onClick={resetGame}>TRY AGAIN</button>
                <button className={`end-game-button-2 ${disableContinueButton ? 'disabled-end-game-button' : ''}`} onClick={continueGame} disabled={disableContinueButton}>CONTINUE</button>
            </div>
        </div>
    );
};

export default EndGame;
