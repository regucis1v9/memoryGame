// DiffSelector.js
import React from 'react';

const DiffSelector = ({ onSelectDifficulty }) => {
    return (
        <>
        <div className="diff-selection-title" >Select a difficulty</div>
        <div className="selector-container">
            <button className="diff-selector center" onClick={() => onSelectDifficulty('easy')}>
                <div className="info-circle">
                    <img src="/svg/circle-info-solid.svg" alt="" />
                    <div className="diff-info">
                        <li>More time</li>
                        <li>No bombs</li>
                    </div>
                </div>
                <div className="animated-border"></div>
                <div className="animated-border-2"></div>
                <div className="box center">
                    <div className="center">Easy</div>
                </div>
            </button>
            <button className="diff-selector center" onClick={() => onSelectDifficulty('medium')}>
                <div className="info-circle">
                    <img src="/svg/circle-info-solid.svg" alt="" />
                    <div className="diff-info">
                        <li>Some time</li>
                        <li>Some bombs</li>
                    </div>
                </div>
                <div className="animated-border"></div>
                <div className="animated-border-2"></div>
                <div className="box center">
                    <div className="center">Medium</div>
                </div>
            </button>
            <button className="diff-selector center" onClick={() => onSelectDifficulty('hard')}>
                <div className="info-circle">
                    <img src="/svg/circle-info-solid.svg" alt="" />
                    <div className="diff-info">
                        <li>Less time</li>
                        <li>More bombs</li>
                    </div>
                </div>
                <div className="animated-border"></div>
                <div className="animated-border-2"></div>
                <div className="box center">
                    <div className="center">Hard</div>
                </div>
            </button>
        </div>
        </>
    );
};

export default DiffSelector;
