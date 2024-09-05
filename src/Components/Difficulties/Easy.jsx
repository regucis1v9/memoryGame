import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import EndGame from '../EndGame';
import { updateGems } from '../../actions/gemActions'; 
import { updateGameState } from '../../actions/gameStateAction'; 
import { updateScore } from '../../actions/scoreAction';
import { updateFlippedCards } from '../../actions/flippedCardAction';
import { updateGameStateMessage } from '../../actions/gameStateMessageAction';
import { updateTime } from '../../actions/timeAction';
import { updateReveal } from '../../actions/initialRevealAction';
import { updateMatchedCards } from '../../actions/matchedCardAction';
import { updateSelectedCardIds } from '../../actions/selectedCardIdAction';
import { updateCardData } from '../../actions/cardDataAction';
import { updateRank } from '../../actions/rankAction';
import { updateReplay } from "../../actions/replayAction";

const Easy = () => {    
    const dispatch = useDispatch();

    const cardsData = useSelector(state => state.cardData.cardData);
    const time = useSelector(state => state.time.time);
    const gameStateMessage = useSelector(state => state.gameStateMessage.gameStateMessage);
    const gameState = useSelector(state => state.gameState.gameState); 
    const gameStateMessageRef = useRef(gameStateMessage);
    const flippedCards = useSelector(state => state.flippedCards.flippedCards);
    const gems = useSelector(state => state.gems.gems); 
    const score = useSelector(state => state.score.score);
    const initialReveal = useSelector(state => state.initialReveal.initialReveal);
    const matchedCards = useSelector(state => state.matchedCards.matchedCards);
    const selectedCardIds = useSelector(state => state.selectedCardIds.selectedCardIds);
    const difficulty = useSelector(state => state.difficulty.difficulty)
    const replayCount = useSelector(state => state.replay.replay)

    const timerRef = useRef(null);
    const gameStateRef = useRef(gameState);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (time === 0) {
                dispatch(updateScore(0))
                dispatch(updateGameStateMessage("Defeat"))
                dispatch(updateGameState('lose')); 
                dispatch(updateRank("DNF"))
                clearInterval(timerRef.current);
            }
        }, 1000); // Set timeout to 1000 milliseconds
        return () => clearTimeout(timer); 
    }, [time]);
    

    useEffect(() => {
        if (selectedCardIds.length === 3) {
            checkForMatch();
        }
    }, [selectedCardIds]);

    useEffect(() => {
        resetGame();
    }, []);

 const resetGame = () => {
    dispatch(updateFlippedCards([]));
    dispatch(updateMatchedCards([]));
    dispatch(updateSelectedCardIds([]));
    dispatch(updateScore(0));
    let timeValue;
    if (difficulty === "easy") {
        timeValue = (60 - replayCount*10);
        dispatch(updateTime(timeValue));
    }
    if (difficulty === "medium") {
        timeValue = (45 - replayCount*10);
        dispatch(updateTime(timeValue));
    }
    if (difficulty === "hard") {
        timeValue = (30 - replayCount*10);
        dispatch(updateTime(timeValue));
    }
    dispatch(updateGameState('playing'));
    dispatch(updateReveal(true));

    const initialCardsData = [
        { id: 1, name: '1' },
        { id: 2, name: '1' },
        { id: 3, name: '1' },
        { id: 4, name: '2' },
        { id: 5, name: '2' },
        { id: 6, name: '2' },
        { id: 7, name: '3' },
        { id: 8, name: '3' },
        { id: 9, name: '3' },
    ];
    const shuffledCards = initialCardsData.sort(() => Math.random() - 0.5);
    dispatch(updateCardData(shuffledCards));

    setTimeout(() => {
        dispatch(updateReveal(false));
        dispatch(updateFlippedCards([]));
        if (gameStateRef.current === 'playing') {
            startTimer(timeValue); // Start timer only if game state is 'playing'
        }
    }, 2000);

    // Clear the timer if component unmounts before the timeout occurs
    return () => clearTimeout(timerRef.current);
};

    
    const handleCardClick = (id) => {
        if (initialReveal || gameState !== 'playing') {
            return;
        }

        if (flippedCards.length === 3 && !flippedCards.includes(id)) {
            return;
        }

        if (flippedCards.includes(id)) {
            return;
        } else {
            if (flippedCards.length < 3) {
                dispatch(updateFlippedCards([...flippedCards, id]))
                dispatch(updateSelectedCardIds([...selectedCardIds, id]))
            } else {
                return;
            }
        }
    };

    const checkForMatch = () => {
        const selectedCards = selectedCardIds.map(id => cardsData.find(card => card.id === id));
        if (selectedCards.every(card => card.name === selectedCards[0].name)) {
            dispatch(updateScore(score + 1 + 1 * replayCount))
            dispatch(updateMatchedCards([...matchedCards, ...selectedCardIds]))
            setTimeout(() => {
                dispatch(updateFlippedCards([]))
                dispatch(updateSelectedCardIds([]))
            }, 500);
        } else {
            setTimeout(() => {
                dispatch(updateFlippedCards(flippedCards.filter(id => !selectedCardIds.includes(id))))
                dispatch(updateSelectedCardIds([]))
            }, 500);
        }
    };

    useEffect(() => {
        if (cardsData.length === matchedCards.length && cardsData.length !== 0) {
            dispatch(updateGameState('win')); 
            dispatch(updateReplay(replayCount + 1));
            dispatch(updateGameStateMessage("Victory!"))
            let newGems = gems + score + time;
            dispatch(updateGems(newGems)); 
            dispatch(updateRank("#1"))
            clearInterval(timerRef.current); 
        }
    }, [matchedCards, cardsData, score, time]);

    useEffect(() => {
        return () => {
            // Clear the timer when the component is unmounted
            clearInterval(timerRef.current);
        };
    }, []);
    
    const startTimer = (time) => {
        console.log(gameStateRef.current)
        if (time < 0 || gameStateRef.current !== 'playing') {
            clearInterval(timerRef.current);
            return;
        }
        dispatch(updateTime(time));
        timerRef.current = setTimeout(() => {
            startTimer(time - 1);
        }, 1000);
    };

    useEffect(() => {
        gameStateRef.current = gameState;
        gameStateMessageRef.current = gameStateMessage;
    }, [gameState, gameStateMessage]);
    
    return (
        <>
            {gameState !== 'playing' && (
                <EndGame resetGame={resetGame} />
            )}
            <div className="game-container">
                <div className="game-info">
                    <div className="timer">Time: <span className='accent-text'>{formatTime(time)}</span></div>
                    <div className="score">Score: <span className='accent-text'>{score}</span></div>
                </div>
                <div className="card-container">
                    {cardsData.map(card => (
                        <div key={card.id} className={`flip ${initialReveal ? 'flipped' : (flippedCards.includes(card.id) || matchedCards.includes(card.id) ? 'flipped' : '')} ${matchedCards.includes(card.id) ? 'disabled-card' : ''}`} onClick={() => handleCardClick(card.id)} >
                            <div className="front">
                                <img className='card-front-image' src="/svg/question.svg" alt="" />
                            </div>
                            <div className="back">
                                {flippedCards.includes(card.id) || matchedCards.includes(card.id) || initialReveal ? (
                                    <img src={`/icons/${card.name}.svg`} alt="" />
                                ) : null}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export default Easy;