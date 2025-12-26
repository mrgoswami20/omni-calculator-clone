import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2 } from 'lucide-react';
import './BattingAverageCalculatorPage.css';

const BattingAverageCalculatorPage = () => {

    // Sport: 'cricket' | 'baseball'
    const [sport, setSport] = useState('cricket');

    // Values
    const [numerator, setNumerator] = useState(''); // Runs (Cricket) or Hits (Baseball)
    const [denominator, setDenominator] = useState(''); // Outs (Cricket) or At Bats (Baseball)
    const [average, setAverage] = useState('');

    const fmt = (val, maxDecimals = 6) => {
        if (val === '' || val === null || isNaN(val)) return '';
        // Remove trailing zeros if integer, otherwise fixed
        return parseFloat(val.toFixed(maxDecimals)).toString();
    };

    // Auto-recalc when sport changes? No, keep values if they make sense or clear?
    // Let's clear for clarity as the units change completely.
    useEffect(() => {
        setNumerator('');
        setDenominator('');
        setAverage('');
    }, [sport]);

    const recalc = (num, den, isBaseball) => {
        const n = parseFloat(num);
        const d = parseFloat(den);

        if (!isNaN(n) && !isNaN(d) && d !== 0) {
            const avg = n / d;
            // Baseball typically 3 decimals, Cricket 2 usually sufficient but standard float is fine
            // We'll store precise, display logic handled via value prop or simple formatting
            if (isBaseball) {
                // Try to format like .300 if < 1
                // But for editing just standard string
                setAverage(avg.toFixed(3).replace(/^0+/, '')); // .333
            } else {
                setAverage(fmt(avg, 2));
            }
        } else {
            setAverage('');
        }
    };

    const handleNumeratorChange = (val) => {
        setNumerator(val);
        recalc(val, denominator, sport === 'baseball');
    };

    const handleDenominatorChange = (val) => {
        setDenominator(val);
        recalc(numerator, val, sport === 'baseball');
    };

    const handleAverageChange = (val) => {
        setAverage(val);
        // If average changes:
        // Cricket: Runs = Avg * Outs
        // Baseball: Hits = Avg * At Bats
        // We need denominator to calculate numerator. Or numerator to calc denominator (Avg = N/D -> D = N/Avg)
        // Usually prioritize keeping denominator constant and updating numerator (Runs/Hits)
        const avg = parseFloat(val);
        const den = parseFloat(denominator);

        if (!isNaN(avg) && !isNaN(den)) {
            const num = avg * den;
            setNumerator(fmt(num, 0)); // Runs/Hits usually integers
        } else if (!isNaN(avg) && !isNaN(parseFloat(numerator))) {
            const num = parseFloat(numerator);
            if (avg !== 0) {
                const d = num / avg;
                setDenominator(fmt(d, 0));
            }
        }
    };


    const [showShareTooltip, setShowShareTooltip] = useState(false);

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setShowShareTooltip(true);
            setTimeout(() => setShowShareTooltip(false), 2000);
        } catch (err) {
            console.error('Failed to copy URL:', err);
        }
    };

    const clearAll = () => {
        setNumerator('');
        setDenominator('');
        setAverage('');
    };

    const creators = [
        { name: "Maria Kluziak", role: "" },
    ];

    const reviewers = [
        { name: "Bagna Szyk", role: "" },
        { name: "Jack Bowater", role: "" },
    ];

    const articleContent = (
        <>
            <p>
                This <strong>batting average calculator</strong> is a comprehensive tool for both baseball and cricket fans. Choose your sport and quickly calculate the batting average of your favorite player!
            </p>
        </>
    );

    return (
        <CalculatorLayout
            title="Batting Average Calculator"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "What is a batting average?",
                "How to calculate batting average for cricket",
                "How to calculate batting average for baseball",
                "What about the results?",
            ]}
            articleContent={articleContent}
            similarCalculators={103}
        >
            <div className="batting-average-calculator-page">

                {/* Section 1: Choose sport */}
                <div className="section-card">
                    <div className="section-header">
                        <div className="section-title">Choose the sport:</div>
                    </div>
                    <div className="radio-group">
                        <label className="radio-option">
                            <input
                                type="radio"
                                name="sport"
                                value="cricket"
                                checked={sport === 'cricket'}
                                onChange={() => setSport('cricket')}
                            />
                            Cricket
                        </label>
                        <label className="radio-option">
                            <input
                                type="radio"
                                name="sport"
                                value="baseball"
                                checked={sport === 'baseball'}
                                onChange={() => setSport('baseball')}
                            />
                            Baseball
                        </label>
                    </div>
                </div>

                {/* Section 2: Calc Inputs */}
                <div className="section-card">
                    <div className="section-header">
                        <div className="section-title" style={{ textTransform: 'capitalize' }}>{sport} batting average</div>
                    </div>

                    <div className="input-group">
                        <div className="label-row">
                            <label>{sport === 'cricket' ? 'Runs scored' : 'Hits'}</label>
                            <span className="more-options">...</span>
                        </div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={numerator}
                                onChange={(e) => handleNumeratorChange(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row">
                            <label>{sport === 'cricket' ? 'Number of times out' : 'At bats'}</label>
                            <span className="more-options">...</span>
                        </div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={denominator}
                                onChange={(e) => handleDenominatorChange(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Batting average</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={average}
                                onChange={(e) => handleAverageChange(e.target.value)}
                                style={{ backgroundColor: '#eff6ff', color: '#1e3a8a', fontWeight: 'bold' }}
                            />
                        </div>
                    </div>

                    <div className="calc-actions">
                        <button className="share-result-btn" onClick={handleShare}>
                            <div className="share-icon-circle"><Share2 size={14} /></div>
                            Share result
                            {showShareTooltip && <span className="copied-tooltip">Copied!</span>}
                        </button>
                        <div className="secondary-actions">
                            <button className="secondary-btn">Reload calculator</button>
                            <button className="secondary-btn" onClick={clearAll}>Clear all changes</button>
                        </div>
                    </div>
                </div>

                <div className="feedback-section" style={{ marginTop: '2rem', textAlign: 'center', paddingTop: '1.5rem', borderTop: '1px solid #f3f4f6' }}>
                    <p style={{ marginBottom: '1rem', color: '#4b5563' }}>Did we solve your problem today?</p>
                    <div>
                        <button className="feedback-btn" style={{ padding: '0.5rem 1.5rem', border: '1px solid #e5e7eb', borderRadius: '0.25rem', background: 'white', cursor: 'pointer', margin: '0 0.5rem' }}>Yes</button>
                        <button className="feedback-btn" style={{ padding: '0.5rem 1.5rem', border: '1px solid #e5e7eb', borderRadius: '0.25rem', background: 'white', cursor: 'pointer', margin: '0 0.5rem' }}>No</button>
                    </div>
                </div>

            </div>
        </CalculatorLayout>
    );
};

export default BattingAverageCalculatorPage;
