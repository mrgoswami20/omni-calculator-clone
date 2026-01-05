import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import './CalculatorItemCard.css';

const CalculatorItemCard = ({ label, url, icon: Icon, emoji }) => {
    return (
        <Link to={url} className="calculator-item-card">
            <div className="card-content">
                <div className="card-icon-wrapper">
                    {Icon ? (
                        <Icon size={28} className="card-icon" strokeWidth={1.5} />
                    ) : (
                        <span className="card-emoji">{emoji || '🔢'}</span>
                    )}
                </div>
                <div className="card-text">
                    <h3 className="card-title">{label}</h3>
                    <div className="card-arrow">
                        <ArrowRight size={16} />
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CalculatorItemCard;
