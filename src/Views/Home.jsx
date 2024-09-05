import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { updateProfileComponent } from '../actions/profileComponentAction';
import Background from '../Components/Backgrounds/Background';
const Home = () => {
    const dispatch = useDispatch();
    const handleClick = (profileState) =>{
        dispatch(updateProfileComponent(profileState));
    }

    return (
        <div className="main overflow-hidden center vertical-overflow">
            <div className="nav-container">
                <Link className='nav-button' to="/play">Play</Link>       
                <Link className='nav-button' to="/leaderboard">Leaderboard</Link>     
                <Link className='nav-button' to="/profile" onClick={() => handleClick("history")}>History</Link>     
                <Link className='nav-button' to="/profile" onClick={() => handleClick("profile")}>Settings</Link>              
            </div>
            <div className="background-fade"></div>
            <Background/>
        </div>
    );
};

export default Home;
