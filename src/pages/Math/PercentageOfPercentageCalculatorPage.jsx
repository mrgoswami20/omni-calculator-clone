import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, ChevronUp } from 'lucide-react';
import './PercentageOfPercentageCalculatorPage.css';

const PercentageOfPercentageCalculatorPage = () => {

    // Percentages
    const [pct1, setPct1] = useState('');
    const [pct2, setPct2] = useState('');
    const [cumulative, setCumulative] = useState('');

    // Values
    const [original, setOriginal] = useState('');
    const [val1, setVal1] = useState('');
    const [final, setFinal] = useState('');

    const fmt = (val) => {
        if (val === '' || val === null || isNaN(val)) return '';
        return parseFloat(val.toFixed(6)).toString();
    };

    // --- Calcs ---

    const recalcCumulative = (p1, p2) => {
        const n1 = parseFloat(p1);
        const n2 = parseFloat(p2);
        if (!isNaN(n1) && !isNaN(n2)) {
            const res = (n1 * n2) / 100; // e.g. 50% * 20% = 0.5 * 0.2 = 0.1 = 10%
            setCumulative(fmt(res));
            return res; // return number for use
        } else {
            setCumulative('');
            return null;
        }
    };

    const recalcValues = (orig, p1, p2, cum) => {
        const o = parseFloat(orig);
        const n1 = parseFloat(p1);
        const n2 = parseFloat(p2);

        let v1 = '';
        let f = '';

        if (!isNaN(o) && !isNaN(n1)) {
            v1 = o * (n1 / 100);
            setVal1(fmt(v1));
        } else {
            setVal1('');
        }

        if (!isNaN(o)) {
            // Can calculate final from Cumulative OR manually step by step
            if (cum !== null) {
                f = o * (cum / 100);
                setFinal(fmt(f));
            } else if (!isNaN(v1) && !isNaN(n2)) {
                f = v1 * (n2 / 100);
                setFinal(fmt(f));
            } else {
                setFinal('');
            }
        } else {
            setFinal('');
        }
    };


    const handlePct1Change = (val) => {
        setPct1(val);
        const cum = recalcCumulative(val, pct2);
        recalcValues(original, val, pct2, cum);
    };

    const handlePct2Change = (val) => {
        setPct2(val);
        const cum = recalcCumulative(pct1, val);
        recalcValues(original, pct1, val, cum);
    };

    const handleCumulativeChange = (val) => {
        // If editing cumulative, what changes? Usually Pct2 if Pct1 exists.
        setCumulative(val);
        const c = parseFloat(val);
        const p1 = parseFloat(pct1);

        if (!isNaN(c) && !isNaN(p1) && p1 !== 0) {
            // 1st * 2nd / 100 = Cum
            // 2nd = (Cum * 100) / 1st
            const p2 = (c * 100) / p1;
            setPct2(fmt(p2));
            recalcValues(original, pct1, p2, c);
        }
    };

    const handleOriginalChange = (val) => {
        setOriginal(val);
        // just recalc values based on existing percents
        const c = parseFloat(cumulative);
        recalcValues(val, pct1, pct2, !isNaN(c) ? c : null);
    };

    // Value after 1st and Final could be inputs too, allowing backward calc for Original?
    // Let's support backward calc from Final to Original if Cumulative is known.
    const handleFinalChange = (val) => {
        setFinal(val);
        const f = parseFloat(val);
        const c = parseFloat(cumulative);
        if (!isNaN(f) && !isNaN(c) && c !== 0) {
            // Final = Orig * (Cum / 100)
            // Orig = (Final * 100) / Cum
            const o = (f * 100) / c;
            setOriginal(fmt(o));
            // Update Val1? Orig is distinct now.
            // Val1 = Orig * 1st%
            const n1 = parseFloat(pct1);
            if (!isNaN(n1)) {
                setVal1(fmt(o * (n1 / 100)));
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
        setPct1('');
        setPct2('');
        setCumulative('');
        setOriginal('');
        setVal1('');
        setFinal('');
    };

    const creators = [
        { name: "Mateusz Mucha", role: "" },
        { name: "Piotr Małek", role: "" },
    ];

    const reviewers = [
        { name: "Jack Bowater", role: "" },
    ];

    const articleContent = (
        <>
            <p>
                The <strong>percentage of a percentage calculator</strong> can multiply one percentage by another to get the cumulative value. It can then <strong>apply these two percentages</strong> (one at a time) to some value, to show the intermediate and final values.
            </p>
        </>
    );

    return (
        <CalculatorLayout
            title="Percentage of a Percentage Calculator"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "Calculate percentage of a number",
                "How to use the percentage of percentage calculator",
                "Example of percentage of percentage: 40% of 90%",
                "Percent of a percent",
                "FAQs"
            ]}
            articleContent={articleContent}
            similarCalculators={516}
        >
            <div className="percentage-of-percentage-calculator-page">

                {/* Section 1: Percentages */}
                <div className="section-card">
                    <div className="input-group">
                        <div className="label-row"><label>1st percentage</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={pct1}
                                onChange={(e) => handlePct1Change(e.target.value)}
                            />
                            <span className="input-suffix">%</span>
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>2nd percentage</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={pct2}
                                onChange={(e) => handlePct2Change(e.target.value)}
                            />
                            <span className="input-suffix">%</span>
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Cumulative percentage</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={cumulative}
                                onChange={(e) => handleCumulativeChange(e.target.value)}
                                style={{ backgroundColor: '#eff6ff', color: '#1e3a8a', fontWeight: 'bold' }}
                            />
                            <span className="input-suffix">%</span>
                        </div>
                    </div>
                </div>

                {/* Section 2: Percentage of a value */}
                <div className="section-card">
                    <div className="section-header">
                        <div className="section-title"><ChevronUp size={16} /> Percentage of a value</div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Original value</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={original}
                                onChange={(e) => handleOriginalChange(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Value after 1st percentage</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                className="calc-input"
                                value={val1}
                                readOnly
                                style={{ backgroundColor: '#f9fafb', color: '#6b7280' }} // Read only implied by screenshot or logic flow complexity? I'll make it read-only for simplicity unless bidirectional is critical here.
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Final value</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={final}
                                onChange={(e) => handleFinalChange(e.target.value)}
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

export default PercentageOfPercentageCalculatorPage;
