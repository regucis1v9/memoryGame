import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfileComponent } from '../../actions/profileComponentAction';
import { useNavigate } from 'react-router-dom';

const ProfileSidebar = () => {
    const dispatch = useDispatch();
    const profileComponent = useSelector(state => state.profileComponent.profileComponent);
    const navigate = useNavigate();
        console.log(profileComponent)
    // Function to handle logout
    const handleLogout = () => {
        // Get userID from localStorage
        const name = localStorage.getItem('username');

        // Make fetch request to logout endpoint
        fetch('http://localhost/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: name })
        })
        .then(response => {
            localStorage.removeItem('userID');
            localStorage.removeItem('username');
            localStorage.setItem('gems', 0);
            localStorage.removeItem('authToken');
            navigate('/auth')
        })
        .catch(error => {
            console.error('Error logging out:', error);
            // Handle error as needed
        });
    };

    const updateComponent = (newComponent) => {
        dispatch(updateProfileComponent(newComponent));
    };

    return (
        <div className="profile-sidebar">
            <span>
                <button className={`sidebar-nav ${profileComponent === "profile" ? "active-button" : ""}`} onClick={() => updateComponent("profile")}>Account Info</button>
                <button className={`sidebar-nav ${profileComponent === "history" ? "active-button" : ""}`} onClick={() => updateComponent("history")}>Game History</button>
                <button className={`sidebar-nav ${profileComponent === "background" ? "active-button" : ""}`} onClick={() => updateComponent("background")}>Change Background</button>
                <button className={`sidebar-nav ${profileComponent === "completed" ? "active-button" : ""}`} onClick={() => updateComponent("completed")}>Completed Games</button>
            </span>
            <button className='log-out' onClick={handleLogout}>Log out</button>
        </div>
    );
};

export default ProfileSidebar;
