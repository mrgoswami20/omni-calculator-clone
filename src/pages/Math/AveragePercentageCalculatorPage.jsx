import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, ChevronUp, Info, Plus, Minus } from 'lucide-react';
import './AveragePercentageCalculatorPage.css';

const AveragePercentageCalculatorPage = () => {

    // State to store percentages and their optional sample sizes
    // Initial: 2 inputs
    const [entries, setEntries] = useState([
        { percentage: '', size: '' },
        { percentage: '', size: '' }
    ]);

    const [showSizes, setShowSizes] = useState(false);
    const [average, setAverage] = useState('');

    useEffect(() => {
        calculateAverage();
    }, [entries, showSizes]);

    const handleChange = (index, field, value) => {
        const newEntries = [...entries];
        newEntries[index][field] = value;
        setEntries(newEntries);
    };

    const addEntry = () => {
        setEntries([...entries, { percentage: '', size: '' }]);
    };

    const removeEntry = (index) => {
        if (entries.length <= 2) return; // Maintain at least 2
        const newEntries = entries.filter((_, i) => i !== index);
        setEntries(newEntries);
    };

    const calculateAverage = () => {
        let totalVal = 0;
        let totalCount = 0; // For simple average
        let totalWeight = 0; // For weighted average derived from sizes

        let validEntriesCount = 0;

        for (let i = 0; i < entries.length; i++) {
            const p = parseFloat(entries[i].percentage);

            if (!isNaN(p)) {
                validEntriesCount++;
                const s = parseFloat(entries[i].size);

                if (showSizes && !isNaN(s)) {
                    // Weighted
                    totalVal += p * s;
                    totalWeight += s;
                } else if (!showSizes) {
                    // Simple
                    totalVal += p;
                    totalCount++;
                }
            }
        }

        if (validEntriesCount === 0) {
            setAverage('');
            return;
        }

        let avg = 0;
        if (showSizes) {
            if (totalWeight > 0) {
                avg = totalVal / totalWeight;
            } else {
                setAverage(''); // Avoid div by 0 if sizes are 0 or valid entries have empty sizes
                return;
            }
        } else {
            avg = totalVal / totalCount;
        }

        setAverage(avg.toFixed(4).replace(/\.?0+$/, ''));
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
        setEntries([
            { percentage: '', size: '' },
            { percentage: '', size: '' }
        ]);
        setAverage('');
        setShowSizes(false);
    };

    const creators = [
        { name: "Maciej Kowalski", role: "PhD candidate" },
    ];

    const reviewers = [
        { name: "Steven Wooding", role: "" }
    ];

    const articleContent = (
        <>
            <p>
                Welcome to Omni's <strong>average percentage calculator</strong>, where we'll learn how to average percentages and what it actually means. Truth be told, half the time, the concept boils down to the well-known formula for the mean of a dataset. However, the other half concerns problems when the percentages correspond to samples of different sizes.
            </p>
        </>
    );

    return (
        <CalculatorLayout
            title="Average Percentage Calculator"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "How to average percentages",
                "The weighted average of percentages",
                "Example of using the average percentage calculator",
                "FAQs"
            ]}
            articleContent={articleContent}
            similarCalculators={1287}
        >
            <div className="average-percentage-calculator-page">

                <div className="section-card">
                    {/* Dynamic percentage inputs */}
                    {entries.map((entry, index) => (
                        <div key={index}>
                            <div className="input-group">
                                <div className="label-row">
                                    <label>Percent #{index + 1}</label>
                                    <span className="more-options">...</span>
                                </div>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        className="calc-input"
                                        value={entry.percentage}
                                        onChange={(e) => handleChange(index, 'percentage', e.target.value)}
                                     onWheel={(e) => e.target.blur()} />
                                    <span className="input-suffix">%</span>
                                </div>
                            </div>

                            {/* Conditional Sample Size Input based on checkbox below, but visually it appears paired if active */}
                            {showSizes && (
                                <div className="input-group" style={{ marginTop: '-0.5rem', marginBottom: '1.5rem', paddingLeft: '1rem', borderLeft: '2px solid #e5e7eb' }}>
                                    <div className="label-row">
                                        <label style={{ fontSize: '0.85rem' }}>Sample size #{index + 1}</label>
                                    </div>
                                    <div className="input-wrapper">
                                        <input
                                            type="number"
                                            className="calc-input"
                                            value={entry.size}
                                            onChange={(e) => handleChange(index, 'size', e.target.value)}
                                         onWheel={(e) => e.target.blur()} />
                                    </div>
                                </div>
                            )}

                            {/* Remove button for extra entries */}
                            {index > 1 && (
                                <button
                                    onClick={() => removeEntry(index)}
                                    style={{ fontSize: '0.8rem', color: '#ef4444', marginBottom: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}
                                >
                                    - Remove entry
                                </button>
                            )}
                        </div>
                    ))}

                    {/* Add more entries control. Screenshot shows "Add more entries? [x] Yes". 
                        Implementing as a button/action since checkbox implies toggle state, 
                        but usually adds fields. Assuming checkbox unhides more or adds one. 
                        Let's make it add an entry when clicked, or behave like the prompt implies.
                        Actually, "Add more entries? [ ] Yes" usually unhides specific hidden rows in Omni.
                        Since I don't know the limit, I'll use a button to push new rows for better UX, 
                        or a checkbox that adds 1 more row each toggle (weird behavior).
                        Lets stick to a button "Add entry" for dynamic list.
                        Or follow the screenshot strictly: "Add more entries? [Checkbox] Yes".
                        If checked, maybe it shows 3 more rows? 
                        Let's try: Checkbox toggles visibility of a "Add" button or simply adds more.
                        Simpler: Just a button to add.
                    */}
                    <div className="input-group">
                        <div className="label-row"><label>Add more entries? <Info size={14} style={{ marginLeft: 4, color: '#9ca3af' }} /></label></div>
                        <button
                            onClick={addEntry}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', background: 'white', cursor: 'pointer' }}
                        >
                            <Plus size={16} /> Add 1 more
                        </button>
                    </div>

                    {/* Allow different sample sizes */}
                    <div className="input-group">
                        <div className="checkbox-group">
                            <input
                                type="checkbox"
                                id="diffSizes"
                                className="checkbox-input"
                                checked={showSizes}
                                onChange={(e) => setShowSizes(e.target.checked)}
                            />
                            <label htmlFor="diffSizes" className="checkbox-label">Allow different sample sizes</label>
                        </div>
                    </div>


                    {/* Result */}
                    <div className="input-group">
                        <div className="label-row"><label>Average percentage</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                className="calc-input"
                                readOnly
                                value={average}
                                style={{ backgroundColor: '#eff6ff', color: '#1e3a8a', fontWeight: 'bold' }}
                            />
                            <span className="input-suffix">%</span>
                        </div>
                    </div>


                    <div className="calc-actions">
                        {/* <button className="share-result-btn" onClick={handleShare}>
                            <div className="share-icon-circle"><Share2 size={14} /></div>
                            Share result
                            {showShareTooltip && <span className="copied-tooltip">Copied!</span>}
                        </button> */}
                        <div className="secondary-actions">
                            <button className="secondary-btn">Reload calculator</button>
                            <button className="secondary-btn" onClick={clearAll}>Clear all changes</button>
                        </div>
                    </div>
                </div>


            </div>
        </CalculatorLayout>
    );
};

export default AveragePercentageCalculatorPage;
