import React, { useState } from 'react';
import CalculatorLayout from '../components/CalculatorLayout';
import { Share2 } from 'lucide-react';
import './OnBasePercentageCalculatorPage.css';

const OnBasePercentageCalculatorPage = () => {

    const [hits, setHits] = useState('');
    const [bb, setBb] = useState('');
    const [hbp, setHbp] = useState('');
    const [ab, setAb] = useState('');
    const [sf, setSf] = useState('');
    const [obp, setObp] = useState('');

    const fmt = (val, maxDecimals = 3) => {
        if (val === '' || val === null || isNaN(val)) return '';
        // Standard baseball stats: .350
        return val.toFixed(maxDecimals).replace(/^0+/, '');
    };

    const recalc = (h, b, hb, a, s) => {
        const H = parseFloat(h) || 0;
        const BB = parseFloat(b) || 0;
        const HBP = parseFloat(hb) || 0;
        const AB = parseFloat(a) || 0;
        const SF = parseFloat(s) || 0;

        // OBP = (H + BB + HBP) / (AB + BB + HBP + SF)
        const numerator = H + BB + HBP;
        const denominator = AB + BB + HBP + SF;

        if (denominator > 0) {
            const res = numerator / denominator;
            setObp(fmt(res));
        } else {
            if (H || BB || HBP || AB || SF) {
                setObp('0.000'); // Or empty? usually 0 if registered
            } else {
                setObp('');
            }
        }
    };

    const handleChange = (setter, val, field) => {
        setter(val);
        // We pass the NEW value for the changed field, and current state for others
        // Note: state updates are async, so we use logic variables
        const h = field === 'hits' ? val : hits;
        const b = field === 'bb' ? val : bb;
        const hb = field === 'hbp' ? val : hbp;
        const a = field === 'ab' ? val : ab;
        const s = field === 'sf' ? val : sf;

        recalc(h, b, hb, a, s);
    };

    // Reverse calc? OBP is a result, usually not edited to find hits etc.
    // Screenshot shows it as an input field though (greyed out or editable?).
    // Usually these calculators are one-way unless specified.
    // The previous instructions often imply bidirectional, but OBP has too many variables.
    // We will leave OBP read-only-ish (it calculates), but if user edits it, we can't easily distribute the change to 5 variables.
    // So logic is one-way from Inputs -> OBP.

    const clearAll = () => {
        setHits('');
        setBb('');
        setHbp('');
        setAb('');
        setSf('');
        setObp('');
    };

    const creators = [
        { name: "Rita Rain", role: "" },
    ];

    const reviewers = [
        { name: "Bagna Szyk", role: "" },
        { name: "Jack Bowater", role: "" },
    ];

    const articleContent = (
        <>
            <p>
                The <strong>on-base percentage calculator</strong> lets you determine a baseball batter's effectiveness at reaching base. Check if your favorite player is making progress!
            </p>
        </>
    );

    return (
        <CalculatorLayout
            title="On Base Percentage Calculator"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "What is OBP - on-base percentage?",
                "How to calculate on-base percentage?",
                "How to interpret the result?",
                "What is OPS - on-base plus slugging?"
            ]}
            articleContent={articleContent}
            similarCalculators={43}
        >
            <div className="on-base-percentage-calculator-page">

                <div className="section-card">

                    <div className="input-group">
                        <div className="label-row"><label>Hits</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={hits}
                                onChange={(e) => handleChange(setHits, e.target.value, 'hits')}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Bases on Balls</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={bb}
                                onChange={(e) => handleChange(setBb, e.target.value, 'bb')}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Hits by Pitch</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={hbp}
                                onChange={(e) => handleChange(setHbp, e.target.value, 'hbp')}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>At Bats</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={ab}
                                onChange={(e) => handleChange(setAb, e.target.value, 'ab')}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Sacrifice Flies</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={sf}
                                onChange={(e) => handleChange(setSf, e.target.value, 'sf')}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>On Base Percentage</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="text" // Text to allow leading dot format
                                className="calc-input"
                                value={obp}
                                readOnly
                                style={{ backgroundColor: '#eff6ff', color: '#1e3a8a', fontWeight: 'bold' }}
                            />
                        </div>
                    </div>

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

export default OnBasePercentageCalculatorPage;
