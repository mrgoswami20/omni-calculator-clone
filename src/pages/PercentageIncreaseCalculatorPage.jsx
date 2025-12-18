import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../components/CalculatorLayout';
import { Share2 } from 'lucide-react';
import './PercentageIncreaseCalculatorPage.css';

const PercentageIncreaseCalculatorPage = () => {

    const [initial, setInitial] = useState('');
    const [final, setFinal] = useState('');
    const [percent, setPercent] = useState('');
    const [difference, setDifference] = useState('');
    const [mode, setMode] = useState('increase'); // 'increase' or 'decrease'

    // Formatter
    const fmt = (val) => {
        if (val === '' || val === null || isNaN(val)) return '';
        // Format to max 4 decimals, removing trailing zeros
        return parseFloat(val.toFixed(6)).toString();
    };

    const handleInitialChange = (val) => {
        setInitial(val);
        calcFromInitial(val, final, percent);
    };

    const handleFinalChange = (val) => {
        setFinal(val);
        calcFromFinal(initial, val);
    };

    const handlePercentChange = (val) => {
        setPercent(val);
        calcFromPercent(initial, val);
    };

    const handleDifferenceChange = (val) => {
        setDifference(val);
        calcFromDifference(initial, final, val);
    };

    const handleModeChange = (newMode) => {
        setMode(newMode);
        // If we have a percent, re-evaluate its sign based on mode
        // If mode is Decrease, percent should be treated effectively as negative for calculation,
        // but displayed as positive in the input (usually).
        // Let's check typical behavior. "Increase 10%" -> +10%. "Decrease 10%" -> -10%.
        // The input label changes to "Decrease (%)" or "Increase (%)".
        // The value in the box remains "10". This requires decoupling the stored signed percent from the displayed value.
        // SIMPLIFICATION:
        // Use 'percent' as the signed value.
        // If mode is decrease, we display abs(percent).
        // When user types in decrease mode, we negate it before storage.

        // Wait, if I change mode from Increase to Decrease, do numbers change?
        // 100 -> 110 (+10%). Switch to Decrease: 100 -> 90 (-10%).
        // Yes, recalculate based on Initial provided and new effective percent sign.
        if (initial !== '' && percent !== '') {
            const p = Math.abs(parseFloat(percent));
            const newSignedP = newMode === 'increase' ? p : -p;
            // setPercent(newSignedP); // This might cause loop if we are not careful.
            // Let's just trigger calculation.
            calcFromPercent(initial, newSignedP.toString(), newMode);
        }
    };

    // logic helpers
    const calcFromInitial = (initStr, finalStr, pctStr) => {
        // This is complex because we have 3 variables, any 2 define the 3rd.
        // Usually we prioritize the last edited. 
        // If I edit Initial, do I keep Final fixed (recalc %) or Percent fixed (recalc Final)?
        // Standard behavior: Keep Percent fixed (if set), Recalc Final.
        // If Percent not set, try to use Final to calc Percent.
        if (pctStr !== '') {
            calcFromPercent(initStr, pctStr);
        } else if (finalStr !== '') {
            calcFromFinal(initStr, finalStr);
        }
    };

    const calcFromFinal = (initStr, finalStr) => {
        const i = parseFloat(initStr);
        const f = parseFloat(finalStr);
        if (!isNaN(i) && !isNaN(f)) {
            const diff = f - i;
            const pct = i !== 0 ? (diff / i) * 100 : 0;

            setDifference(fmt(diff));
            setPercent(fmt(Math.abs(pct)));
            setMode(pct < 0 ? 'decrease' : 'increase');
        }
    };

    const calcFromPercent = (initStr, pctStr, forcedMode = null) => {
        const i = parseFloat(initStr);
        let p = parseFloat(pctStr);
        const currentMode = forcedMode || mode;

        if (!isNaN(i) && !isNaN(p)) {
            // Apply sign based on mode
            if (currentMode === 'decrease') p = -Math.abs(p);
            else p = Math.abs(p);

            const f = i * (1 + p / 100);
            const diff = f - i;

            setFinal(fmt(f));
            setDifference(fmt(diff));
            // Keep percent display value absolute
            // setPercent is already handled by Input onChange unless this function called it.
            // If called from handleModeChange, we need to ensure percent state is consistent?
            // Actually, handlePercentChange sets raw string.
        }
    };

    const calcFromDifference = (initStr, finalStr, diffStr) => {
        const d = parseFloat(diffStr);
        // Prioritize Initial. Final = Initial + Diff.
        const i = parseFloat(initStr);
        if (!isNaN(d) && !isNaN(i)) {
            const f = i + d;
            const pct = i !== 0 ? (d / i) * 100 : 0;

            setFinal(fmt(f));
            setPercent(fmt(Math.abs(pct)));
            setMode(pct < 0 ? 'decrease' : 'increase');
        }
    };

    const clearAll = () => {
        setInitial('');
        setFinal('');
        setPercent('');
        setDifference('');
        setMode('increase');
    };

    const creators = [
        { name: "Mateusz Mucha", role: "" },
        { name: "Dominik Czernia", role: "PhD" },
    ];

    const reviewers = [
        { name: "Bogna Szyk", role: "" },
        { name: "Jack Bowater", role: "" },
        { name: "Borys Kuca", role: "PhD" },
    ];

    const articleContent = (
        <>
            <p>
                The percentage increase calculator is a useful tool for <strong>calculating the increase from one value to another</strong> in terms of a <strong>percentage</strong> of the original amount. Before using this calculator, it may be beneficial for you to understand how to calculate percent increase by using the percent increase formula.
            </p>
        </>
    );

    return (
        <CalculatorLayout
            title="Percentage Increase Calculator"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "How to calculate percent increase",
                "Percent increase formula",
                "Calculating percent decrease",
                "Real-life applications",
                "Closely related topics",
                "FAQs"
            ]}
            articleContent={articleContent}
            similarCalculators={8836}
        >
            <div className="percentage-increase-calculator-page">

                <div className="section-card">
                    {/* Row 1: Initial & Final */}
                    <div className="input-group">
                        <div className="input-row">
                            <div className="input-col">
                                <div className="label-row"><label>Initial value</label><span className="more-options">...</span></div>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        className="calc-input"
                                        value={initial}
                                        onChange={(e) => handleInitialChange(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="input-col">
                                <div className="label-row"><label>Final value</label><span className="more-options">...</span></div>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        className="calc-input"
                                        value={final}
                                        onChange={(e) => handleFinalChange(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Radio - Increase or decrease? */}
                    <div className="input-group">
                        <div className="label-row"><label>Increase or decrease?</label><span className="more-options">...</span></div>
                        <div className="radio-group">
                            <label className="radio-option">
                                <input
                                    type="radio"
                                    name="mode"
                                    value="increase"
                                    checked={mode === 'increase'}
                                    onChange={() => handleModeChange('increase')}
                                    className="radio-input"
                                />
                                Increase
                            </label>
                            <label className="radio-option">
                                <input
                                    type="radio"
                                    name="mode"
                                    value="decrease"
                                    checked={mode === 'decrease'}
                                    onChange={() => handleModeChange('decrease')}
                                    className="radio-input"
                                />
                                Decrease
                            </label>
                        </div>
                    </div>

                    {/* Row 3: Percent Input */}
                    <div className="input-group">
                        <div className="label-row">
                            <label>{mode === 'increase' ? 'Increase' : 'Decrease'} (%)</label>
                            <span className="more-options">...</span>
                        </div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={percent}
                                onChange={(e) => handlePercentChange(e.target.value)}
                            />
                            <span className="input-suffix">%</span>
                        </div>
                    </div>

                </div>

                {/* Section 2: Difference */}
                <div className="section-card">
                    <div className="section-header">
                        <div className="section-title">Difference</div>
                    </div>
                    <div className="input-group">
                        <div className="label-row">
                            <label>Final value - Initial value</label>
                            <span className="more-options">...</span>
                        </div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={difference}
                                onChange={(e) => handleDifferenceChange(e.target.value)}
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

            </div>
        </CalculatorLayout>
    );
};

export default PercentageIncreaseCalculatorPage;
