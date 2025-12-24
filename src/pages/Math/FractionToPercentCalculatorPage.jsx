import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, ChevronUp } from 'lucide-react';
import './FractionToPercentCalculatorPage.css';

const FractionToPercentCalculatorPage = () => {

    // State for main calculator
    const [num, setNum] = useState('');
    const [den, setDen] = useState('');
    const [resultPercent, setResultPercent] = useState('');

    // State for Percentage to Fraction section
    const [pctInput, setPctInput] = useState('');
    const [pctResultNum, setPctResultNum] = useState('');
    const [pctResultDen, setPctResultDen] = useState('');

    const fmt = (val) => {
        if (val === '' || val === null || isNaN(val)) return '';
        return parseFloat(val.toFixed(6)).toString();
    };

    // ----- Fraction to Percent Logic -----
    const handleNumChange = (val) => {
        setNum(val);
        calcPercent(val, den);
    };

    const handleDenChange = (val) => {
        setDen(val);
        calcPercent(num, val);
    };

    const calcPercent = (nStart, dStart) => {
        const n = parseFloat(nStart);
        const d = parseFloat(dStart);
        if (!isNaN(n) && !isNaN(d) && d !== 0) {
            const res = (n / d) * 100;
            setResultPercent(fmt(res));
        } else {
            setResultPercent('');
        }
    };

    const handleResultPercentChange = (val) => {
        setResultPercent(val);
        // If user edits result percent, update numerator if denominator exists, or vice versa?
        // Usually, fixing denominator to 100 or keeping existing denominator is tricky.
        // Let's adopt behavior: Update Numerator based on current Denominator.
        // If Denominator is empty, set it to 100.
        const p = parseFloat(val);
        if (!isNaN(p)) {
            let d = parseFloat(den);
            if (isNaN(d) || d === 0) {
                d = 100;
                setDen('100');
            }
            const n = (p / 100) * d;
            setNum(fmt(n));
        }
    };


    // ----- Percentage to Fraction Logic -----
    const gcd = (a, b) => {
        return b ? gcd(b, a % b) : a;
    };

    const handlePctInputChange = (val) => {
        setPctInput(val);
        const p = parseFloat(val);
        if (!isNaN(p)) {
            // Convert to fraction
            // Handle decimals: 12.5 -> 125/1000
            const s = val.toString();
            let decimalPlaces = 0;
            if (s.includes('.')) {
                decimalPlaces = s.split('.')[1].length;
            }

            const multiplier = Math.pow(10, decimalPlaces);
            // Numerator is p * multiplier. Denominator is 100 * multiplier.
            // e.g. 12.5% -> 12.5 / 100 -> 125 / 1000.

            let numerator = Math.round(p * multiplier);
            let denominator = 100 * multiplier;

            const common = gcd(numerator, denominator);
            setPctResultNum((numerator / common).toString());
            setPctResultDen((denominator / common).toString());

        } else {
            setPctResultNum('');
            setPctResultDen('');
        }
    };


    const clearAll = () => {
        setNum('');
        setDen('');
        setResultPercent('');
        setPctInput('');
        setPctResultNum('');
        setPctResultDen('');
    };

    const creators = [
        { name: "Bogna Szyk", role: "" },
        { name: "Piotr Małek", role: "" },
    ];

    const reviewers = [
        { name: "Jack Bowater", role: "" },
    ];

    const articleContent = (
        <>
            <p>
                This <strong>fraction to percent calculator</strong> will answer any question you have about how to turn a fraction into a percent. Changing from fraction to percent and percent to fraction are relatively simple calculations, so we hope you can learn something useful from this page.
            </p>
        </>
    );

    return (
        <CalculatorLayout
            title="Fraction to Percent Calculator"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "Fraction to percentage method",
                "Fraction to percentage formula",
                "FAQs"
            ]}
            articleContent={articleContent}
            similarCalculators={936}
        >
            <div className="fraction-to-percent-calculator-page">

                {/* Section 1: Fraction to Percentage */}
                <div className="section-card">
                    <div className="section-header">
                        <div className="section-title"><ChevronUp size={16} /> Fraction to percentage</div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Numerator</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={num}
                                onChange={(e) => handleNumChange(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Denominator</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={den}
                                onChange={(e) => handleDenChange(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row">
                            <div className="fraction-visual-container">
                                <div className="fraction-stack">
                                    <span className="fraction-top" style={{ borderBottom: '1px solid #374151', padding: '0 2px' }}>{num || 'Numerator'}</span>
                                    <span className="fraction-bottom" style={{ padding: '0 2px' }}>{den || 'Denominator'}</span>
                                </div>
                                <span>is the same as</span>
                            </div>
                            <span className="more-options">...</span>
                        </div>
                        <div className="input-wrapper">
                            <input
                                type="text" // using text to allow showing formatted output if needed, but number is better for editing
                                className="calc-input"
                                value={resultPercent}
                                onChange={(e) => handleResultPercentChange(e.target.value)}
                                style={{ backgroundColor: '#eff6ff', color: '#1e3a8a', fontWeight: 'bold' }}
                            />
                            <span className="input-suffix">%</span>
                        </div>
                    </div>
                </div>

                {/* Section 2: Percentage to Fraction */}
                <div className="section-card">
                    <div className="section-header">
                        <div className="section-title"><ChevronUp size={16} /> Percentage to fraction</div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Percentage</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={pctInput}
                                onChange={(e) => handlePctInputChange(e.target.value)}
                            />
                            <span className="input-suffix">%</span>
                        </div>
                    </div>

                    {pctResultNum && (
                        <div className="input-group">
                            <div className="label-row"><label>Fraction result</label></div>
                            <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem', display: 'flex', justifyContent: 'center' }}>
                                <div className="fraction-stack" style={{ fontSize: '1.2rem' }}>
                                    <span className="fraction-top" style={{ borderBottom: '2px solid black' }}>{pctResultNum}</span>
                                    <span className="fraction-bottom">{pctResultDen}</span>
                                </div>
                            </div>
                        </div>
                    )}



                    <div className="calc-actions">
                        <button className="share-result-btn">
                            <div className="share-icon-circle"><Share2 size={14} /></div>
                            Share result
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

export default FractionToPercentCalculatorPage;
