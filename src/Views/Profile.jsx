import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProfileSidebar from '../Components/Profile/ProfileSidebar';
import ProfileContent from '../Components/Profile/ProfileContent';
import Background from "../Components/Backgrounds/Background"
const Profile = () => {

    return (
        <div className="main overflow-hidden center vertical-overflow profile">
            <ProfileSidebar/>
            <ProfileContent/>
            <Background/>
        </div>
    );
};

export default Profile;
