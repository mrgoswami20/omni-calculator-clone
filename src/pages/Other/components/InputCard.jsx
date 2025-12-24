import React from 'react';
import { HelpCircle, X, Check, TriangleAlert, MoreHorizontal } from 'lucide-react';

const InputCard = ({
    totalQuestions,
    setTotalQuestions,
    wrongAnswers,
    setWrongAnswers,
    correctAnswers,
    setCorrectAnswers,
    percentage,
    currentGrade,
    handlers,
    showWarning,
    formatWithCommas
}) => {
    const { handleTotalChange, handleWrongChange, handleCorrectChange } = handlers;

    return (
        <div className="section-card">
            {/* Points / Questions */}
            <div className="input-group-row">
                <div className="input-label-row">
                    <label>Number of points / questions <HelpCircle size={14} className="icon-red" /></label>
                    <MoreHorizontal size={16} className="more-menu-icon" />
                </div>
                <div className="input-wrapper">
                    <input
                        type="text"
                        className="calc-input input-blue"
                        value={formatWithCommas(totalQuestions)}
                        onChange={(e) => handleTotalChange(e.target.value)}
                        inputMode="decimal"
                    />
                </div>
                {showWarning && (
                    <div className="warning-banner">
                        <TriangleAlert size={18} />
                        <span>When entering numbers, you can only use a dot (.) as the decimal separator.</span>
                    </div>
                )}
            </div>

            {/* Wrong */}
            <div className="input-group-row">
                <div className="input-label-row">
                    <label>Number wrong <X size={14} className="icon-red" /></label>
                    <MoreHorizontal size={16} className="more-menu-icon" />
                </div>
                <div className="input-wrapper">
                    <input
                        type="number"
                        className="calc-input input-blue"
                        value={wrongAnswers}
                        onChange={(e) => handleWrongChange(e.target.value)}
                        onWheel={(e) => e.target.blur()}
                    />
                </div>
            </div>

            {/* Correct */}
            <div className="input-group-row">
                <div className="input-label-row">
                    <label>Number correct <Check size={14} className="icon-green" /></label>
                    <MoreHorizontal size={16} className="more-menu-icon" />
                </div>
                <div className="input-wrapper">
                    <input
                        type="number"
                        className="calc-input input-blue"
                        style={{ backgroundColor: '#f9fafb' }}
                        value={correctAnswers}
                        onChange={(e) => handleCorrectChange(e.target.value)}
                        onWheel={(e) => e.target.blur()}
                    />
                </div>
            </div>

            {/* Percentage */}
            <div className="input-group-row">
                <div className="input-label-row">
                    <label>Percentage</label>
                    <MoreHorizontal size={16} className="more-menu-icon" />
                </div>
                <div className="input-wrapper">
                    <input
                        type="text"
                        className="calc-input input-blue"
                        readOnly
                        value={percentage}
                    />
                    <span className="input-icon-right">%</span>
                </div>
            </div>

            {/* Final Grade Text */}
            {currentGrade && (
                <div className="grade-result-text">
                    The grade is <strong>{currentGrade}</strong>.
                </div>
            )}
        </div>
    );
};

export default InputCard;
