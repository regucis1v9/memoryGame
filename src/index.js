import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import Auth from './Views/Auth';
import Home from './Views/Home';
import Play from "./Views/Play";
import Header from './Components/Header';
import LeaderboardView from './Components/Leaderboard';
import Profile from './Views/Profile';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store'; 
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
  <GoogleOAuthProvider clientId="151581668178-oa4qabrt1j13l6t1e5s8cbaqhnv5g5hu.apps.googleusercontent.com">
  <Router>
      <Header /> 
      <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/home" element={<Home />} />
          <Route path="/play" element={<Play />} />
          <Route path="/leaderboard" element={<LeaderboardView/>}/>
          <Route path="/profile" element={<Profile/>}/>
      </Routes>
  </Router>
  </GoogleOAuthProvider>
</Provider>
)
