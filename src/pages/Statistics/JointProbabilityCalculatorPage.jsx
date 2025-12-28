import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, RotateCcw, Trash2, Info } from 'lucide-react';
import './JointProbabilityCalculatorPage.css';

const JointProbabilityCalculatorPage = () => {
    const [isIndependent, setIsIndependent] = useState(true);
    const [pA, setPA] = useState('');
    const [unitA, setUnitA] = useState('%'); // '%' or 'decimal'
    const [pB, setPB] = useState(''); // This serves as P(B) or P(B|A)
    const [unitB, setUnitB] = useState('%'); // '%' or 'decimal'
    const [result, setResult] = useState('');
    const [resultUnit, setResultUnit] = useState('%'); // '%' or 'decimal'
    const [showShareTooltip, setShowShareTooltip] = useState(false);
    const [errorA, setErrorA] = useState(false);
    const [errorB, setErrorB] = useState(false);

    // Helper to normalize probability to 0-1 range
    const getProbability = (val, unit) => {
        const num = parseFloat(val);
        if (isNaN(num)) return null;
        if (unit === '%') return num / 100;
        return num;
    };

    // Validation Effect
    useEffect(() => {
        const validate = (val, unit, setError) => {
            const num = parseFloat(val);
            if (!isNaN(num)) {
                if (unit === '%' && num > 100) {
                    setError(true);
                } else if (unit === 'decimal' && num > 1) {
                    setError(true);
                } else {
                    setError(false);
                }
            } else {
                setError(false);
            }
        };

        validate(pA, unitA, setErrorA);
        validate(pB, unitB, setErrorB);
    }, [pA, unitA, pB, unitB]);

    // Calculation Logic
    useEffect(() => {
        if (errorA || errorB) {
            setResult('');
            return;
        }

        const probA = getProbability(pA, unitA);
        const probB = getProbability(pB, unitB);

        if (probA !== null && probB !== null) {
            let jointProb = 0;
            if (isIndependent) {
                jointProb = probA * probB;
            } else {
                jointProb = probA * probB; // Formula is same: P(A) * P(B|A)
            }

            // Format result based on selected unit
            if (resultUnit === '%') {
                setResult((jointProb * 100).toFixed(4) * 1);
            } else {
                setResult(jointProb.toFixed(4) * 1);
            }
        } else {
            setResult('');
        }
    }, [pA, pB, unitA, unitB, isIndependent, resultUnit, errorA, errorB]);

    // Handle unit change with conversion
    const handleUnitChange = (currentVal, currentUnit, newUnit, setVal, setUnit) => {
        setUnit(newUnit);
        if (currentVal === '') return;

        const val = parseFloat(currentVal);
        if (isNaN(val)) return;

        if (currentUnit === '%' && newUnit === 'decimal') {
            setVal((val / 100).toString());
        } else if (currentUnit === 'decimal' && newUnit === '%') {
            setVal((val * 100).toString());
        }
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setShowShareTooltip(true);
            setTimeout(() => setShowShareTooltip(false), 2000);
        } catch (err) {
            console.error('Failed to copy URL:', err);
        }
    };

    const handleClear = () => {
        setPA('');
        setPB('');
        setUnitA('%');
        setUnitB('%');
        setResult('');
        setResultUnit('%');
        setErrorA(false);
        setErrorB(false);
        setIsIndependent(true);
    };

    const handleWheel = (e) => {
        e.target.blur();
    };


    const articleContent = (
        <div>
            <p>The <strong>Joint Probability Calculator</strong> helps you determine the likelihood of two events occurring together. Whether the events are independent or dependent, this tool applies the correct probability formulas to give you an accurate result.</p>
            <h3>What is joint probability?</h3>
            <p>Joint probability is a statistical measure that calculates the likelihood of two events occurring together and at the same point in time. Joint probability is the probability of event Y occurring at the same time that event X occurs.</p>
            <h3>Formula</h3>
            <p>For independent events: <strong>P(A and B) = P(A) × P(B)</strong></p>
            <p>For dependent events: <strong>P(A and B) = P(A) × P(B|A)</strong></p>
        </div>
    );

    return (
        <CalculatorLayout
            title="Joint Probability Calculator"
            creators={[{ name: "Wei Bin Loo", role: "" }]}
            reviewers={[{ name: "Joanna Śmietańska", role: "PhD" }, { name: "Steven Wooding", role: "" }]}
            tocItems={["What is joint probability?", "How to calculate joint probability", "The application of joint probability", "FAQs"]}
            articleContent={articleContent}
        >
            <div className="joint-probability-calculator">

                {/* Independence Selection */}
                <div className="input-group radio-group">
                    <label className="input-label">Are the events independent?</label>
                    <div className="radio-options">
                        <label className={`radio-option ${isIndependent ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                checked={isIndependent}
                                onChange={() => setIsIndependent(true)}
                            />
                            <span className="radio-custom"></span>
                            Yes, they are independent.
                        </label>
                        <label className={`radio-option ${!isIndependent ? 'selected' : ''}`}>
                            <input
                                type="radio"
                                checked={!isIndependent}
                                onChange={() => setIsIndependent(false)}
                            />
                            <span className="radio-custom"></span>
                            No, one depends on the other.
                        </label>
                    </div>
                </div>

                {/* First Input: P(A) or P(A|B) */}
                <div className="input-group">
                    <label className="input-label">
                        {isIndependent ? 'P(A)' : 'P(A|B)'}
                        <Info size={16} className="info-icon" />
                    </label>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            className={`input-field ${errorA ? 'input-error' : ''}`}
                            value={pA}
                            onChange={(e) => setPA(e.target.value)}
                            onWheel={handleWheel}
                            placeholder=" "
                        />
                        <select
                            className="unit-select"
                            value={unitA}
                            onChange={(e) => handleUnitChange(pA, unitA, e.target.value, setPA, setUnitA)}
                        >
                            <option value="%">%</option>
                            <option value="decimal">decimal</option>
                        </select>
                    </div>
                    {!isIndependent && (
                        <div className="helper-text">Probability of A given B.</div>
                    )}
                    {errorA && (
                        <div className="error-message">
                            <Info size={14} className="error-icon-small" />
                            Probability cannot be larger than 100% or 1.
                        </div>
                    )}
                </div>

                {/* Second Input: P(B) */}
                <div className="input-group">
                    <label className="input-label">
                        P(B)
                        <Info size={16} className="info-icon" />
                    </label>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            className={`input-field ${errorB ? 'input-error' : ''}`}
                            value={pB}
                            onChange={(e) => setPB(e.target.value)}
                            onWheel={handleWheel}
                            placeholder=" "
                        />
                        <select
                            className="unit-select"
                            value={unitB}
                            onChange={(e) => handleUnitChange(pB, unitB, e.target.value, setPB, setUnitB)}
                        >
                            <option value="%">%</option>
                            <option value="decimal">decimal</option>
                        </select>
                    </div>
                    {errorB && (
                        <div className="error-message">
                            <Info size={14} className="error-icon-small" />
                            Probability cannot be larger than 100% or 1.
                        </div>
                    )}
                </div>

                {/* Result P(A and B) */}
                <div className="input-group">
                    <label className="input-label">
                        P(A and B)
                        <Info size={16} className="info-icon" />
                    </label>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            className="input-field result-field"
                            value={result}
                            readOnly
                            placeholder=" "
                        />
                        <select
                            className="unit-select"
                            value={resultUnit}
                            onChange={(e) => setResultUnit(e.target.value)}
                        >
                            <option value="%">%</option>
                            <option value="decimal">decimal</option>
                        </select>
                    </div>
                </div>

                {/* Info Box */}
                <div className="info-box">
                    The green color highlights the probability area.
                </div>

                {/* Graphic */}
                <div className="venn-diagram-container">
                    <svg viewBox="0 0 400 220" className="venn-svg">
                        {/* Text Labels */}
                        <text x="50" y="40" className="venn-text label-a" fill="#00A5E3">A</text>
                        <text x="350" y="40" className="venn-text label-b" fill="#FFC400">B</text>
                        <text x="200" y="30" className="venn-text label-intersection" fill="#4B9F1D" textAnchor="middle" fontWeight="bold" fontSize="24">P(A∩B)</text>

                        {/* Omega Symbol */}
                        <text x="380" y="210" className="venn-text label-omega" fontSize="20" fontWeight="bold">Ω</text>

                        {/* Circle A (Blue) */}
                        <circle cx="140" cy="120" r="80" fill="#00b4fc" opacity="1" />

                        {/* Circle B (Yellow) */}
                        <circle cx="260" cy="120" r="80" fill="#fbce07" opacity="1" style={{ mixBlendMode: 'multiply' }} />

                        {/* Intersection Highlight (Green with Dashed Border) */}
                        {/* To create the intersection shape precisely, we can use a clip path or path intersection logic. 
                  For visual simplicity in SVG without complex calculations, we can use a path that represents the lens.
                  Distance between centers is 120 (260-140). Radius is 80.
              */}
                        <defs>
                            <clipPath id="circleA">
                                <circle cx="140" cy="120" r="80" />
                            </clipPath>
                        </defs>

                        {/* Intersection Area stroked */}
                        <circle cx="260" cy="120" r="80" fill="none" stroke="#2e5c10" strokeWidth="2" strokeDasharray="5,5" clipPath="url(#circleA)" />
                    </svg>
                    <div className="copyright-text">© Omni Calculator</div>
                </div>


                {/* Actions */}
                <div className="calc-actions-custom">
                    <button className="share-result-btn-custom" onClick={handleShare}>
                        <div className="share-icon-circle-custom"><Share2 size={24} /></div>
                        Share result
                        {showShareTooltip && <span className="copied-tooltip">Copied!</span>}
                    </button>
                    <div className="secondary-actions-custom">
                        <button className="secondary-btn-custom" onClick={() => window.location.reload()}>Reload calculator</button>
                        <button className="secondary-btn-custom" onClick={handleClear}>Clear all changes</button>
                    </div>
                </div>

                {/* Feedback */}
                <div className="feedback-section">
                    <p>Did we solve your problem today?</p>
                    <div className="feedback-btns">
                        <button className="feedback-btn">
                            Yes
                        </button>
                        <button className="feedback-btn">
                            No
                        </button>
                    </div>
                </div>

            </div>
        </CalculatorLayout>
    );
};

export default JointProbabilityCalculatorPage;
