import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { updateGameState } from '../actions/gameStateAction'; 
import { updateScore } from '../actions/scoreAction';
import { updateFlippedCards } from '../actions/flippedCardAction';
import { updateGameStateMessage } from '../actions/gameStateMessageAction';
import { updateTime } from '../actions/timeAction';
import { updateReveal } from '../actions/initialRevealAction';
import { updateMatchedCards } from '../actions/matchedCardAction';
import { updateSelectedCardIds } from '../actions/selectedCardIdAction';
import { updateCardData } from '../actions/cardDataAction';
import { updateRank } from '../actions/rankAction';
import { updateDifficulty } from '../actions/difficultyAction';
import { updateGrid } from '../actions/gridActioin';
import { updateGems } from '../actions/gemActions';
import { updateBackground } from '../actions/backgroundAction';
import { updateReplay } from '../actions/replayAction';


const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isAuthPage = location.pathname === '/auth';
    const gems = useSelector(state => state.gems.gems); 
    const background = useSelector(state => state.background.background);
    const localGems = localStorage.getItem('gems');
    const localBackground = localStorage.getItem('background');
    const dispatch = useDispatch();

    useEffect(() => {
        const checkAuthentication = () => {
          const authToken = localStorage.getItem('authToken');
          if (!authToken) {
            localStorage.removeItem('username');
            localStorage.removeItem('background');
            localStorage.setItem('gems', 0)
            localStorage.removeItem('authToken');
            localStorage.removeItem('userID');
            // navigate('/auth');
          }
        };
        if(localGems === null || localGems === undefined){
            localStorage.setItem("gems", 0)
        }
        checkAuthentication();
      }, [navigate]);

      const leaveGame = () =>{
        dispatch(updateGameState('inactive'))
        dispatch(updateScore(0))
        dispatch(updateFlippedCards([]))
        dispatch(updateGameStateMessage(''))
        dispatch(updateTime(0))
        dispatch(updateReveal(true))
        dispatch(updateMatchedCards([]))
        dispatch(updateSelectedCardIds([]))
        dispatch(updateCardData([]))
        dispatch(updateRank(""))
        dispatch(updateDifficulty(''))
        dispatch(updateGrid(''))
        dispatch(updateReplay(0))
        dispatch(updateTime(0))
    };
    useEffect(() => {
        if (!isAuthPage) {
            leaveGame();
        }
    }, [dispatch, isAuthPage]);

    if(localGems !== gems && localGems !== null && localGems !== ""){
        dispatch(updateGems(localGems));
    }

    if(localBackground !== background){
        dispatch(updateBackground(localBackground));
    }

    return (
        <div className="header">
            {!isAuthPage && (
                <>
                <Link to="/home" onClick={leaveGame} className="logo">
                    <div className="circle"></div>
                    <div className="logo-text">Flip Frenzy</div>
                </Link>
                <Link to="/home" onClick={leaveGame} className="mobile-logo">
                    <img src="/icons/house-solid.svg" alt="" />
                </Link>
                <div className="header-button-wrapper">
                    <Link to="/coins" onClick={leaveGame} className="coin-button">
                        <img src="/icons/plus-solid.svg" alt="" className='add-coins'/>
                        {gems.toString()}
                        <img src="/icons/coins.svg" alt="" />
                    </Link>
                    <Link to="/profile" onClick={leaveGame} className={`header-button align-header-button ${location.pathname === '/profile' ? 'active-color' : ''}`}>
                        Profile
                        <div className={`accent  ${location.pathname === '/profile' ? 'active-accent' : ''}`}></div>
                    </Link>
                    <button className='header-burger'>
                        <img src="/icons/user-solid.svg" alt="" />
                    </button>
                </div>
            </>
            )}
        </div>
    );
};

export default Header;
