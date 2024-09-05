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

const Medium = () => {
    const dispatch = useDispatch();
    const timerRef = useRef(null);
    
    const rank = useSelector(state => state.rank.rank)
    const cardsData = useSelector(state => state.cardData.cardData);
    const time = useSelector(state => state.time.time);
    const gameStateMessage = useSelector(state => state.gameStateMessage.gameStateMessage);
    const gameState = useSelector(state => state.gameState.gameState); 
    const gameStateRef = useRef(gameState);
    const gameStateMessageRef = useRef(gameStateMessage);
    const flippedCards = useSelector(state => state.flippedCards.flippedCards);
    const gems = useSelector(state => state.gems.gems); 
    const score = useSelector(state => state.score.score);
    const initialReveal = useSelector(state => state.initialReveal.initialReveal);
    const matchedCards = useSelector(state => state.matchedCards.matchedCards);
    const selectedCardIds = useSelector(state => state.selectedCardIds.selectedCardIds);
    const difficulty = useSelector(state => state.difficulty.difficulty)
    const replayCount = useSelector(state => state.replay.replay)


    useEffect(() => {
        const timer = setTimeout(() => {
            if (time === 0) {
                dispatch(updateScore(0))
                dispatch(updateGameStateMessage("Defeat"))
                dispatch(updateGameState('lose')); 
                dispatch(updateRank("DNF"))
                clearInterval(timerRef.current);
            }
        }, 0); 
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
        dispatch(updateFlippedCards([]))
        dispatch(updateMatchedCards([]))
        dispatch(updateSelectedCardIds([]))
        dispatch(updateScore(0))
        let timeValue;
        if (difficulty === "easy") {
            timeValue = (150 - replayCount*10);
            dispatch(updateTime(timeValue));
        }
        if (difficulty === "medium") {
            timeValue = (120 - replayCount*10);
            dispatch(updateTime(timeValue));
        }
        if (difficulty === "hard") {
            timeValue = (90 - replayCount*10);
            dispatch(updateTime(timeValue));
        }
        dispatch(updateGameState('playing')); 
        dispatch(updateReveal(true))

        let initialCardsData = [
            { id: 1, name: '1' },
            { id: 2, name: '1' },
            { id: 3, name: '1' },
            { id: 4, name: '2' },
            { id: 5, name: '2' },
            { id: 6, name: '2' },
            { id: 7, name: '3' },
            { id: 8, name: '3' },
            { id: 9, name: '3' },
            { id: 10, name: '4' },
            { id: 11, name: '4' },
            { id: 12, name: '4' },
            { id: 13, name: '5' },
            { id: 14, name: '5' },
            { id: 15, name: '5' },
            { id: 16, name: 'bonus' },
            { id: 17, name: '6' },
            { id: 18, name: '6' },
            { id: 19, name: '6' },
            { id: 20, name: '7' },
            { id: 21, name: '7' },
            { id: 22, name: '7' },
        ];
        
        if (difficulty === "hard") {
            // Push bomb bonus cards for hard difficulty
            initialCardsData.push({ id: 23, name: 'bonus' });
            initialCardsData.push({ id: 24, name: 'bonus' });
            initialCardsData.push({ id: 25, name: 'bonus' });
        } else {
            // Add name:8 cards for other difficulties
            initialCardsData.push({ id: 23, name: '8' });
            initialCardsData.push({ id: 24, name: '8' });
            initialCardsData.push({ id: 25, name: '8' });
        }
        
        const shuffledCards = initialCardsData.sort(() => Math.random() - 0.5);
        dispatch(updateCardData(shuffledCards))

        setTimeout(() => {
            dispatch(updateReveal(false))
            dispatch(updateFlippedCards([]));
            if(gameStateRef.current === 'playing'){
                startTimer(timeValue); // Call startTimer after initial reveal
            }
        }, 3000); 
    }

    const handleCardClick = (id) => {
        if (initialReveal) {
            return; // Don't allow clicking during the initial reveal period
        }

        if (flippedCards.length === 3 && !flippedCards.includes(id)) {
            return;
        }

        if (flippedCards.includes(id) || matchedCards.includes(id)) {
            return;
        } else {
            const clickedCard = cardsData.find(card => card.id === id);
            if (clickedCard.name === 'bonus') {
                handleBonusCardClick();
            } else {
                if (flippedCards.length < 3) {
                    dispatch(updateFlippedCards([...flippedCards, id]))
                    dispatch(updateSelectedCardIds([...selectedCardIds, id]))
                } else {
                    return;
                }
            }
        }
    };
    useEffect(() => {
        if (selectedCardIds.length === 3) {
            checkForMatch();
        }
    }, [selectedCardIds]);
    
    const checkForMatch = () => {
        const selectedCards = selectedCardIds.map(id => cardsData.find(card => card.id === id));
        if (selectedCards.every(card => card.name === selectedCards[0].name)) {
            console.log("+1"); 
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
        if (matchedCards.length === cardsData.length && difficulty === "easy" && matchedCards.length > 0) {
                // If playing on easy difficulty, simply trigger win condition without checking for bonus card
                dispatch(updateGameState('win')); 
                dispatch(updateReplay(replayCount + 1));
                dispatch(updateGameStateMessage("Victory!"))
                let newGems = gems + score + time;
                dispatch(updateGems(newGems)); 
                dispatch(updateRank("#1"))
                clearInterval(timerRef.current); 
        }
        if (matchedCards.length === cardsData.length -1 && difficulty === "medium" && matchedCards.length > 0) {
            dispatch(updateGameState('win')); 
            dispatch(updateReplay(replayCount + 1));
            dispatch(updateGameStateMessage("Victory!"))
            let newGems = gems + score + time;
            dispatch(updateGems(newGems)); 
            dispatch(updateRank("#1"))
            clearInterval(timerRef.current); 
        }
        if (matchedCards.length === cardsData.length -4 && difficulty === "hard" && matchedCards.length > 0) {
            // If playing on easy difficulty, simply trigger win condition without checking for bonus card
            dispatch(updateGameState('win')); 
            dispatch(updateReplay(replayCount + 1));
            dispatch(updateGameStateMessage("Victory!"))
            let newGems = gems + score + time;
            dispatch(updateGems(newGems)); 
            dispatch(updateRank("#1"))
            clearInterval(timerRef.current); 
        }
    }, [matchedCards, cardsData, difficulty]);
    
    

    useEffect(() => {
        return () => {
            // Clear the timer when the component is unmounted
            clearInterval(timerRef.current);
        };
    }, []);
    
    const startTimer = (time) => {
        if (time < 0 || gameStateRef.current !== 'playing') {
            clearInterval(timerRef.current);
            return;
        }
        dispatch(updateTime(time));
        timerRef.current = setTimeout(() => {
            startTimer(time - 1);
            console.log(gameStateRef.current)
        }, 1000);
    };

    useEffect(() => {
        gameStateRef.current = gameState;
        gameStateMessageRef.current = gameStateMessage;
    }, [gameState, gameStateMessage]);

    const handleBonusCardClick = () => {
        if (difficulty === "easy") {
            // Allow the bomb card to flip, but don't add it to flipped cards
            const bonusCardIndex = cardsData.findIndex(card => card.name === 'bonus');
            if (bonusCardIndex !== -1) {
                dispatch(updateMatchedCards([...matchedCards, cardsData[bonusCardIndex].id])); // Add to matched cards so it stays flipped
            }
            return;
        }
        console.log("+60s");
        dispatch(updateGameState('lose'));
        dispatch(updateScore(0))
        dispatch(updateGameStateMessage("You hit a bomb!"))
        dispatch(updateGameState('lose')); 
        dispatch(updateRank("DNF"))
        clearInterval(timerRef.current);
        const bonusCardIndex = cardsData.findIndex(card => card.name === 'bonus');
        const updatedFlippedCards = flippedCards.filter(id => id !== cardsData[bonusCardIndex].id);
        dispatch(updateFlippedCards(updatedFlippedCards))
        dispatch(updateMatchedCards([...matchedCards, cardsData[bonusCardIndex].id]))
    };
    
    return (
        <>
            {gameState !== 'playing' && (
                <EndGame rank = {rank} gameStateMessage = {gameStateMessage} score = {score} time={time} resetGame = {resetGame}/>
            )}
            <div className="game-container">
                <div className="game-info">
                    <div className="timer">Time: <span className='accent-text'>{formatTime(time)}</span></div>
                    <div className="score">Score: <span className='accent-text'>{score}</span></div>
                </div>
                <div className="card-container-2">
                {cardsData.map(card => (
                    <div key={card.id} className={`flip ${initialReveal ? 'flipped' : (flippedCards.includes(card.id) || matchedCards.includes(card.id) ? 'flipped' : '')} ${matchedCards.includes(card.id) ? 'disabled-card' : ''}`} onClick={() => handleCardClick(card.id)} >
                        <div className="front">
                            <img className='card-front-image' src="/svg/question.svg" alt="" />
                        </div>
                        <div className="back">
                            {flippedCards.includes(card.id) || matchedCards.includes(card.id) || initialReveal ? (
                                // Display the icon if not the bonus card in easy mode
                                (difficulty === "easy" && card.name === 'bonus') ? null : <img src={`/icons/${card.name}.svg`} alt="" />
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

export default Medium;
