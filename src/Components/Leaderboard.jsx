import React, { useState, useEffect } from 'react';
import Background from './Backgrounds/Background';

const LeaderboardView = () => {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(7);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost/api/getGames');
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                const sortedData = data.games.sort((a, b) => b.score - a.score);
                setLeaderboardData(sortedData);
                console.log(sortedData)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = leaderboardData
        .filter((item, index) => index >= 3) // Exclude top 3 players
        .slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil((leaderboardData.length - 3) / itemsPerPage); // Adjust total pages for excluding top 3

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <div className="main overflow-hidden column">
            {/* Top 3 Players */}
            <div className="top3-container">
                {/* Second Place */}
                {leaderboardData.length > 1 && (
                    <div className="rank2-container">
                        <span>
                            <div className="username-container">{leaderboardData[1].username}</div>
                            <img src="/icons/silver-trophy.svg" alt="" />
                        </span>
                        <div className="rank-container">
                            Rank <span>#2</span>
                        </div>
                        <div className="score-container">
                            Score <span>{leaderboardData[1].score}</span>
                        </div>
                        <div className="difficulty-container">Difficulty <span>{leaderboardData[1].difficulty}</span></div>
                        <div className="grid-container">Grid <span>{leaderboardData[1].grid}</span></div>
                    </div>
                )}
                {/* First Place */}
                {leaderboardData.length > 0 && (
                    <div className="rank1-container">
                        <span>
                            <div className="username-container">{leaderboardData[0].username}</div>
                            <img src="/icons/gold-trophy.svg" alt="" />
                        </span>
                        <div className="rank-container">
                            Rank <span>#1</span>
                        </div>
                        <div className="score-container">
                            Score <span>{leaderboardData[0].score}</span>
                        </div>
                        <div className="difficulty-container">Difficulty <span>{leaderboardData[0].difficulty}</span></div>
                        <div className="grid-container">Grid <span>{leaderboardData[0].grid}</span></div>
                    </div>
                )}
                {/* Third Place */}
                {leaderboardData.length > 2 && (
                    <div className="rank3-container">
                        <span>
                            <div className="username-container">{leaderboardData[2].username}</div>
                            <img src="/icons/bronze-trophy.svg" alt="" />
                        </span>
                        <div className="rank-container">
                            Rank <span>#3</span>
                        </div>
                        <div className="score-container">
                            Score <span>{leaderboardData[2].score}</span>
                        </div>
                        <div className="difficulty-container">Difficulty <span>{leaderboardData[2].difficulty}</span></div>
                        <div className="grid-container">Grid <span>{leaderboardData[2].grid}</span></div>
                    </div>
                )}
            </div>
            {/* Mobile Top 3 */}
            <div className="top3-mobile">
                {leaderboardData.slice(0, 3).map((player, index) => (
                    <div key={index} className={`rank${index + 1}-mobile`}>
                        <div className="rank-title">#{index + 1}</div>
                        <div className="username-title">{player.username}</div>
                        <div className="score-title">{player.score}</div>
                        <div className="difficulty-title">{player.difficulty}</div>
                        <div className="grid-title">{player.grid}</div>
                        <div className="time-title">{player.time}</div>
                    </div>
                ))}
            </div>
            {/* Leaderboard Data Titles */}
            <div className="leaderboard-data-titles">
                <div className="rank-title">#</div>
                <div className="username-title">Username</div>
                <div className="score-title">Score</div>
                <div className="difficulty-title">Difficulty</div>
                <div className="grid-title">Grid</div>
                <div className="time-title">Time</div>
            </div>
            {/* Current Page Items */}
            {currentItems.map((item, index) => (
                <div key={index} className="data-row">
                    <div className="rank-title">{indexOfFirstItem + index + 4}</div>
                    <div className="username-title">{item.username}</div>
                    <div className="score-title">{item.score}</div>
                    <div className="difficulty-title">{item.difficulty}</div>
                    <div className="grid-title">{item.grid}</div>
                    <div className="time-title">{item.time}</div>
                </div>
            ))}
            {/* Pagination */}
            <div className="pagination">
                <button className={`page-button ${currentPage === 1 ? 'disabled-button' : ''}`} onClick={prevPage} disabled={currentPage === 1}>Prev</button>
                <button className={`page-button ${currentPage === totalPages ? 'disabled-button' : ''}`} onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
            </div>
            <Background/>
        </div>
    );
};

export default LeaderboardView;
