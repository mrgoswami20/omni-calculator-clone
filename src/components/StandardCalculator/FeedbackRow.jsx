import React from 'react';
import './StandardCalculator.css';

const FeedbackRow = () => {
    return (
        <div className="std-feedback-box">
            <span className="std-feedback-label">Did we solve your problem today?</span>
            <div>
                <button className="std-feedback-btn">Yes</button>
                <button className="std-feedback-btn">No</button>
            </div>
        </div>
    );
};

export default FeedbackRow;
