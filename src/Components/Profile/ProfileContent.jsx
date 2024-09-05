import React from 'react';
import { useSelector } from 'react-redux';
import GameHistory from './GameHistory';
import EditInfo from './EditInfo';
import BackgroundSwap from './BackgroundSwap';
import CompletedLevels from './CompletedLevels';
const ProfileContent = () => {
    const profileComponent = useSelector(state => state.profileComponent.profileComponent)
    return (
        <div className="profile-content">
            {profileComponent === 'history' && <GameHistory/>}
            {profileComponent === "profile" && <EditInfo/>}
            {profileComponent === "background" && <BackgroundSwap/>}
            {profileComponent === "completed" && <CompletedLevels/>}
        </div>
    );
};

export default ProfileContent;
