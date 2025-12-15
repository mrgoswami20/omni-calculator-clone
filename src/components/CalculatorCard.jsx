import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CalculatorCard.css';

const CalculatorCard = ({ title, count, icon: Icon }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (title.toLowerCase() === 'biology') {
            navigate('/biology');
        } else if (title.toLowerCase() === 'chemistry') {
            navigate('/chemistry');
        } else if (title.toLowerCase() === 'construction') {
            navigate('/construction');
        } else if (title.toLowerCase() === 'conversion') {
            navigate('/conversion');
        } else if (title.toLowerCase() === 'ecology') {
            navigate('/ecology');
        } else if (title.toLowerCase() === 'everyday life') {
            navigate('/everyday-life');
        } else if (title.toLowerCase() === 'finance') {
            navigate('/finance');
        } else if (title.toLowerCase() === 'food') {
            navigate('/food');
        } else if (title.toLowerCase() === 'health') {
            navigate('/health');
        } else if (title.toLowerCase() === 'math') {
            navigate('/math');
        } else if (title.toLowerCase() === 'physics') {
            navigate('/physics');
        } else if (title.toLowerCase() === 'sports') {
            navigate('/sports');
        } else if (title.toLowerCase() === 'statistics') {
            navigate('/statistics');
        } else if (title.toLowerCase() === 'other') {
            navigate('/other');
        } else {
            // Placeholder for other categories
            alert(`Navigating to ${title} calculators... (Coming Soon)`);
        }
    };

    return (
        <div
            className="card"
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    handleClick();
                }
            }}
        >
            <div className="icon-wrapper">
                <Icon size={32} className="card-icon" strokeWidth={1.5} />
            </div>
            <h3 className="card-title">{title}</h3>
            <p className="card-count">{count} calculators</p>
        </div>
    );
};

export default CalculatorCard;
