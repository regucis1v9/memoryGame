// Play.js
import React from 'react';
import Easy from '../Components/Difficulties/Easy';
import Medium from '../Components/Difficulties/Medium';
import Hard from '../Components/Difficulties/Hard';
import GridSelector from '../Components/Difficulties/GridSelector';
import { useDispatch, useSelector } from 'react-redux';
import { updateDifficulty } from '../actions/difficultyAction';
import DiffSelector from '../Components/Difficulties/DiffSelector';
import { updateGrid } from '../actions/gridActioin';
import Background from '../Components/Backgrounds/Background';
import Confetti from 'react-confetti';


const Play = () => {
    const difficulty = useSelector(state => state.difficulty.difficulty)
    const grid = useSelector(state => state.grid.grid)
    const gameState = useSelector(state => state.gameState.gameState)
    const dispatch = useDispatch();

    const handleDifficultyChange = (difficulty) => {
        dispatch(updateDifficulty(difficulty))
    };
    const handleGridChange = (grid) => {
        dispatch(updateGrid(grid))
    };
    return (
        <div className="main overflow-hidden column">
            {gameState === "win" &&
            <div className="confetti">
                <Confetti  />
            </div>  
            }
            {!difficulty && !grid &&  <DiffSelector onSelectDifficulty={handleDifficultyChange} />}
            {difficulty && !grid && <GridSelector onSelectedGrid={handleGridChange}/>}
            {grid === '3x3' && <Easy />}
            {grid === '5x5' && <Medium />}
            {grid === '7x7' && <Hard />}
            <Background/>
        </div>
    );
};

export default Play;
