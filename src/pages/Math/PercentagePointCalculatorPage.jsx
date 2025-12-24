import React, { useState } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, ChevronUp, ChevronDown } from 'lucide-react';
import './PercentagePointCalculatorPage.css';

const PercentagePointCalculatorPage = () => {

    // Percent points
    const [p1, setP1] = useState('');
    const [p2, setP2] = useState('');
    const [diffPP, setDiffPP] = useState('');
    const [diffPct, setDiffPct] = useState('');

    // Numeric values
    const [total, setTotal] = useState('');
    const [v1, setV1] = useState('');
    const [v2, setV2] = useState('');
    const [vDiff, setVDiff] = useState('');

    // Numeric values toggle
    const [isNumericOpen, setIsNumericOpen] = useState(true);

    const fmt = (val) => {
        if (val === '' || val === null || isNaN(val)) return '';
        return parseFloat(val.toFixed(6)).toString();
    };

    // Calculate Numeric Values based on Total, P1, P2
    const recalcNumeric = (t, pct1, pct2) => {
        const T = parseFloat(t);
        const P1 = parseFloat(pct1);
        const P2 = parseFloat(pct2);

        if (!isNaN(T)) {
            if (!isNaN(P1)) {
                const val1 = T * (P1 / 100);
                setV1(fmt(val1));

                if (!isNaN(P2)) {
                    const val2 = T * (P2 / 100);
                    setV2(fmt(val2));
                    setVDiff(fmt(val2 - val1));
                } else {
                    setV2('');
                    setVDiff('');
                }
            } else {
                setV1('');
                if (!isNaN(P2)) {
                    const val2 = T * (P2 / 100);
                    setV2(fmt(val2));
                } else {
                    setV2('');
                }
                setVDiff('');
            }
        } else {
            setV1('');
            setV2('');
            setVDiff('');
        }
    };

    // Core Calc Logic for Percentages
    const recalcPercents = (v1, v2) => {
        const n1 = parseFloat(v1);
        const n2 = parseFloat(v2);

        if (!isNaN(n1) && !isNaN(n2)) {
            // PP Difference
            const pp = n2 - n1;
            setDiffPP(fmt(pp));

            // Percentage Difference
            if (n1 !== 0) {
                const pct = ((n2 - n1) / Math.abs(n1)) * 100;
                setDiffPct(fmt(pct));
            } else {
                setDiffPct('');
            }
        } else {
            setDiffPP('');
            setDiffPct('');
        }
    };

    const handleP1Change = (val) => {
        setP1(val);
        recalcPercents(val, p2);
        recalcNumeric(total, val, p2);
    };

    const handleP2Change = (val) => {
        setP2(val);
        recalcPercents(p1, val);
        recalcNumeric(total, p1, val);
    };

    const handleDiffPPChange = (val) => {
        setDiffPP(val);
        const pp = parseFloat(val);
        const n1 = parseFloat(p1);

        if (!isNaN(pp) && !isNaN(n1)) {
            const n2 = n1 + pp;
            const n2Str = fmt(n2);
            setP2(n2Str);
            if (n1 !== 0) {
                const pct = ((n2 - n1) / Math.abs(n1)) * 100;
                setDiffPct(fmt(pct));
            }
            recalcNumeric(total, p1, n2Str);
        }
    };

    const handleDiffPctChange = (val) => {
        setDiffPct(val);
        const pct = parseFloat(val);
        const n1 = parseFloat(p1);
        if (!isNaN(pct) && !isNaN(n1)) {
            const n2 = n1 + (pct * Math.abs(n1) / 100);
            const n2Str = fmt(n2);
            setP2(n2Str);
            const pp = n2 - n1;
            setDiffPP(fmt(pp));
            recalcNumeric(total, p1, n2Str);
        }
    };

    // Numeric Handlers
    const handleTotalChange = (val) => {
        setTotal(val);
        recalcNumeric(val, p1, p2);
    };

    const handleV1Change = (val) => {
        setV1(val);
        const v = parseFloat(val);
        const P1 = parseFloat(p1);
        if (!isNaN(v) && !isNaN(P1) && P1 !== 0) {
            const t = v / (P1 / 100);
            setTotal(fmt(t));
            // Update V2/Diff
            if (!isNaN(parseFloat(p2))) {
                const val2 = t * (parseFloat(p2) / 100);
                setV2(fmt(val2));
                setVDiff(fmt(val2 - v));
            }
        }
    };

    const handleV2Change = (val) => {
        setV2(val);
        const v = parseFloat(val);
        const P2 = parseFloat(p2);
        if (!isNaN(v) && !isNaN(P2) && P2 !== 0) {
            const t = v / (P2 / 100);
            setTotal(fmt(t));
            if (!isNaN(parseFloat(p1))) {
                const val1 = t * (parseFloat(p1) / 100);
                setV1(fmt(val1));
                setVDiff(fmt(v - val1));
            }
        }
    };

    const handleVDiffChange = (val) => {
        setVDiff(val);
        const vd = parseFloat(val);
        const P1 = parseFloat(p1);
        const P2 = parseFloat(p2);
        if (!isNaN(vd) && !isNaN(P1) && !isNaN(P2)) {
            const ppDiff = P2 - P1;
            if (ppDiff !== 0) {
                const t = (vd * 100) / ppDiff; // V2 - V1 = T(P2-P1)/100. T = diff * 100 / (P2-P1).
                setTotal(fmt(t));
                const val1 = t * (P1 / 100);
                const val2 = t * (P2 / 100);
                setV1(fmt(val1));
                setV2(fmt(val2));
            }
        }
    };


    const clearAll = () => {
        setP1('');
        setP2('');
        setDiffPP('');
        setDiffPct('');
        setTotal('');
        setV1('');
        setV2('');
        setVDiff('');
    };

    const creators = [
        { name: "Tibor Pál", role: "PhD candidate" },
    ];

    const reviewers = [
        { name: "Anna Szczepanek", role: "PhD" },
        { name: "Jack Bowater", role: "" },
    ];

    const articleContent = (
        <>
            <p>
                The <strong>percentage point calculator</strong> is a simple tool to <strong>find the percentage point difference</strong> between two percentages. In addition, you can also learn what is a percentage point and how to calculate the percentage of points.
            </p>
        </>
    );

    return (
        <CalculatorLayout
            title="Percentage Point Calculator"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "What is a percentage point?",
                "How do you calculate percentage points?",
                "FAQs"
            ]}
            articleContent={articleContent}
            similarCalculators={39}
        >
            <div className="percentage-point-calculator-page">

                {/* Section 1: Percentage points */}
                <div className="section-card">
                    <div className="section-header">
                        <div className="section-title"><ChevronUp size={16} /> Percentage points</div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Percent #1</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={p1}
                                onChange={(e) => handleP1Change(e.target.value)}
                            />
                            <span className="input-suffix">%</span>
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Percent #2</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={p2}
                                onChange={(e) => handleP2Change(e.target.value)}
                            />
                            <span className="input-suffix">%</span>
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Percentage point difference</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={diffPP}
                                onChange={(e) => handleDiffPPChange(e.target.value)}
                                style={{ backgroundColor: '#eff6ff', color: '#1e3a8a', fontWeight: 'bold' }}
                            />
                            <span className="input-suffix">pp</span>
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Percentage difference</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={diffPct}
                                onChange={(e) => handleDiffPctChange(e.target.value)}
                                style={{ backgroundColor: '#eff6ff', color: '#1e3a8a', fontWeight: 'bold' }}
                            />
                            <span className="input-suffix">%</span>
                        </div>
                    </div>
                </div>

                {/* Section 2: Numeric Values (Collapsible) */}
                <div className="section-card">
                    <div className="section-header" onClick={() => setIsNumericOpen(!isNumericOpen)}>
                        <div className="section-title">
                            {isNumericOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            Numeric values
                        </div>
                    </div>
                    {isNumericOpen && (
                        <div style={{ paddingTop: '1rem' }}>
                            <div className="input-group">
                                <div className="label-row"><label>Total value</label><span className="more-options">...</span></div>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        className="calc-input"
                                        value={total}
                                        onChange={(e) => handleTotalChange(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <div className="label-row"><label>Value #1</label><span className="more-options">...</span></div>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        className="calc-input"
                                        value={v1}
                                        onChange={(e) => handleV1Change(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <div className="label-row"><label>Value #2</label><span className="more-options">...</span></div>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        className="calc-input"
                                        value={v2}
                                        onChange={(e) => handleV2Change(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <div className="label-row"><label>Value difference</label><span className="more-options">...</span></div>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        className="calc-input"
                                        value={vDiff}
                                        onChange={(e) => handleVDiffChange(e.target.value)}
                                        style={{ backgroundColor: '#eff6ff', color: '#1e3a8a', fontWeight: 'bold' }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
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

export default PercentagePointCalculatorPage;
