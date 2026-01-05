import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, ChevronDown, ChevronUp } from 'lucide-react';
import './MilesPerYearCalculatorPage.css';

const MilesPerYearCalculatorPage = () => {
    // Inputs
    const [period, setPeriod] = useState('month');
    const [distance, setDistance] = useState('');
    const [unit, setUnit] = useState('km');

    // Result
    const [yearlyResult, setYearlyResult] = useState('');
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

    const creators = [
        { name: "Agata Flak", role: "" },
    ];

    const reviewers = [
        { name: "Steven Wooding", role: "" }
    ];

    const periodOptions = [
        { value: 'day', label: 'in a day' },
        { value: 'week', label: 'in a week' },
        { value: 'month', label: 'in a month' },
        { value: 'year', label: 'in a year' }, // Redundant but good for checking?
    ];

    // Screenshot shows: "I know how much I travel... in a month"
    // Then "How much do you travel in a month?"

    useEffect(() => {
        if (!distance || isNaN(parseFloat(distance))) {
            setYearlyResult('');
            return;
        }

        const val = parseFloat(distance);

        let multiplier = 1;
        switch (period) {
            case 'day': multiplier = 365; break;
            case 'week': multiplier = 52.1429; break; // More precise
            case 'month': multiplier = 12; break;
            case 'year': multiplier = 1; break;
            default: multiplier = 12;
        }

        const total = val * multiplier;

        // Result display
        // If input is km, output should probably also be km (or maybe miles per year as title implies?)
        // The tool is "Miles per Year Calculator", but screenshot inputs are "km". 
        // Let's output BOTH if mixed, or just the same unit as input but scaled.
        // Usually Omni calculators keep unit consistency unless specified.
        // Given the name, let's just show the total in the matching unit.

        setYearlyResult(total.toLocaleString(undefined, { maximumFractionDigits: 2 }));

    }, [period, distance, unit]);


    const articleContent = (
        <>
            <p>
                Welcome to the miles per year calculator! Thanks to this tool, you'll discover <strong>how many miles (or kilometers) you drive each year</strong>. You will most certainly need this information to determine your insurance's price, fuel consumption and cost...
            </p>
        </>
    );

    return (
        <CalculatorLayout
            title="Miles per Year Calculator"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "What is the average miles driven per year?",
                "How do you calculate miles driven per year? Example calculation",
                "Why should you know your yearly mileage?",
                "How to use the miles per year calculator",
                "FAQs"
            ]}
            articleContent={articleContent}
            similarCalculators={32}
        >
            <div className="calculator-card miles-per-year-page">

                {/* Period Selector */}
                <div className="input-group">
                    <div className="label-row">
                        <label>I know how much I travel...</label>
                        <span className="more-options">...</span>
                    </div>
                    <div className="select-wrapper">
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="calc-select"
                        >
                            {periodOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <ChevronDown className="select-arrow" size={16} />
                    </div>
                </div>

                {/* Distance Input */}
                <div className="input-group">
                    <div className="label-row">
                        <label>How much do you travel {periodOptions.find(p => p.value === period)?.label}?</label>
                        <span className="more-options">...</span>
                    </div>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            className="calc-input"
                            value={distance}
                            onChange={(e) => setDistance(e.target.value)}
                        />
                        <div className="unit-select-container">
                            <select
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                                className="unit-select"
                            >
                                <option value="km">km</option>
                                <option value="mi">mi</option>
                            </select>
                            <ChevronDown size={14} className="unit-arrow" />
                        </div>
                    </div>
                </div>

                {/* Result Section (Implicitly shown as separate output or just the value?)
                    Screenshot doesn't show result field. 
                    Usually these calculators have a "Result" section or another field "Distance per year".
                    Let's add "Distance per year" output field.
                */}
                <div className="input-group" style={{ marginTop: '1.5rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                    <div className="label-row">
                        <label>Distance per year</label>
                        <span className="more-options">...</span>
                    </div>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            className="calc-input"
                            readOnly
                            value={yearlyResult}
                            placeholder="Result"
                        />
                        <span className="unit-label-static">{unit}/yr</span>
                    </div>
                </div>


                <div className="calc-actions">
                    {/* <button className="share-result-btn" onClick={handleShare} style={{ position: 'relative' }}>
                        <div className="share-icon-circle"><Share2 size={14} /></div>
                        Share result
                        {showShareTooltip && <span className="copied-tooltip" style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)' }}>Copied!</span>}
                    </button> */}
                    <div className="secondary-actions">
                        <button className="secondary-btn">Reload calculator</button>
                        <button className="secondary-btn" onClick={() => {
                            setDistance('');
                            setPeriod('month');
                            setYearlyResult('');
                        }}>Clear all changes</button>
                    </div>
                </div>

                <div className="feedback-section">
                    <p>Did we solve your problem today?</p>
                    <div className="feedback-btns">
                        <button>Yes</button>
                        <button>No</button>
                    </div>
                </div>

                <div className="check-out-box">
                    Check out <strong>32 similar</strong> transportation calculators
                </div>

            </div>
        </CalculatorLayout>
    );
};

export default MilesPerYearCalculatorPage;
