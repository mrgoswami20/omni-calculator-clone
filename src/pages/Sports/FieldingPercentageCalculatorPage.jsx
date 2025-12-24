import React, { useState } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2 } from 'lucide-react';
import './FieldingPercentageCalculatorPage.css';

const FieldingPercentageCalculatorPage = () => {

    const [putouts, setPutouts] = useState('');
    const [assists, setAssists] = useState('');
    const [errors, setErrors] = useState('');
    const [fpct, setFpct] = useState('');

    const fmt = (val, maxDecimals = 3) => {
        if (val === '' || val === null || isNaN(val)) return '';
        // Standard baseball stats: .995
        return val.toFixed(maxDecimals).replace(/^0+/, '');
    };

    const recalc = (p, a, e) => {
        const PO = parseFloat(p) || 0;
        const A = parseFloat(a) || 0;
        const E = parseFloat(e) || 0;

        // TC = PO + A + E
        const TC = PO + A + E;

        if (TC > 0) {
            const res = (PO + A) / TC;
            setFpct(fmt(res));
        } else {
            if (PO || A || E) {
                setFpct('0.000');
            } else {
                setFpct('');
            }
        }
    };

    const handleChange = (setter, val, field) => {
        setter(val);
        const p = field === 'putouts' ? val : putouts;
        const a = field === 'assists' ? val : assists;
        const e = field === 'errors' ? val : errors;

        recalc(p, a, e);
    };

    const clearAll = () => {
        setPutouts('');
        setAssists('');
        setErrors('');
        setFpct('');
    };

    const creators = [
        { name: "Maria Kluziak", role: "" },
    ];

    const reviewers = [
        { name: "Bogna Szyk", role: "" },
        { name: "Jack Bowater", role: "" },
    ];

    const articleContent = (
        <>
            <p>
                The <strong>fielding percentage calculator</strong> is a useful tool for any baseball player or fan. If you're wondering how to calculate fielding percentage (FPCT), you're in the right place.
            </p>
        </>
    );

    return (
        <CalculatorLayout
            title="Fielding Percentage Calculator"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "What is fielding percentage?",
                "Terms used in the fielding percentage calculator",
                "How to use the fielding percentage calculator?",
                "How to calculate fielding percentage?",
                "Example of FPCT calculations"
            ]}
            articleContent={articleContent}
            similarCalculators={17}
        >
            <div className="fielding-percentage-calculator-page">

                <div className="section-card">

                    <div className="input-group">
                        <div className="label-row"><label>Putouts</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={putouts}
                                onChange={(e) => handleChange(setPutouts, e.target.value, 'putouts')}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Assists</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={assists}
                                onChange={(e) => handleChange(setAssists, e.target.value, 'assists')}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Errors</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={errors}
                                onChange={(e) => handleChange(setErrors, e.target.value, 'errors')}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Fielding percentage (FPCT)</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                className="calc-input"
                                value={fpct}
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

export default FieldingPercentageCalculatorPage;
