import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../components/CalculatorLayout';
import { Share2, ChevronDown, ChevronUp } from 'lucide-react';
import './HeightInInchesCalculatorPage.css';

const HeightInInchesCalculatorPage = () => {
    // Input State
    // We support "ft + in" (composite) AND "cm", "m", "ft", "in" (single)
    // To mimic Omni, the "Unit" dropdown likely switches the input mode.
    // 'ft+in' -> Shows two inputs. 'm' -> Shows one.
    const [unitMode, setUnitMode] = useState('ft+in');

    // Values
    const [feet, setFeet] = useState('');
    const [inches, setInches] = useState(''); // Used for the "in" part of ft+in
    const [singleVal, setSingleVal] = useState(''); // Used for cm, m, etc.

    // Result
    const [resultInches, setResultInches] = useState('');
    const [resultUnit, setResultUnit] = useState('in'); // Just in case, but screenshot shows "in"

    const creators = [
        { name: "Dawid Siuda", role: "" }
    ];

    const reviewers = [
        { name: "Steven Wooding", role: "" } // screenshot says Steven Wooding
    ];

    // Conversion Logic
    useEffect(() => {
        let totalIn = 0;
        let hasData = false;

        if (unitMode === 'ft+in') {
            const f = parseFloat(feet);
            const i = parseFloat(inches);

            if (!isNaN(f)) {
                totalIn += f * 12;
                hasData = true;
            }
            if (!isNaN(i)) {
                totalIn += i;
                hasData = true; // Even if feet is empty, inches alone counts
            }
            // If both are empty, check raw strings
            if (feet === '' && inches === '') hasData = false;

        } else {
            // Single value
            const v = parseFloat(singleVal);
            if (!isNaN(v)) {
                hasData = true;
                switch (unitMode) {
                    case 'm': totalIn = v * 39.3701; break;
                    case 'cm': totalIn = v * 0.393701; break;
                    case 'mm': totalIn = v * 0.0393701; break;
                    case 'ft': totalIn = v * 12; break;
                    case 'in': totalIn = v; break;
                    case 'yd': totalIn = v * 36; break;
                    case 'km': totalIn = v * 39370.1; break;
                    case 'mi': totalIn = v * 63360; break;
                    default: totalIn = 0;
                }
            }
        }

        if (hasData) {
            // result is requested in inches.
            // Screenshot shows result "Height in inches".
            // If the user selects a DIFFERENT unit for the result, we'd convert. 
            // But usually "Height in Inches Calculator" implies output is inches.
            // However, most Omni calculators allow changing output unit.
            // Let's assume standard output is 'in'.
            // Apply result conversion if necessary, but here target is 'in', so totalIn is it.

            // Format to reasonable decimals (4) but strip trailing zeros
            setResultInches(totalIn.toPrecision(6).replace(/\.0+$/, '').replace(/(\.\d*[1-9])0+$/, '$1'));
        } else {
            setResultInches('');
        }

    }, [feet, inches, singleVal, unitMode]);

    const articleContent = (
        <>
            <p>
                Our height in inches calculator is a user-friendly tool that simplifies converting height measurements into inches. If you want to convert height into inches, convert cm to inches in height, or you're simply wondering how to measure height in inches, this calculator has got you covered.
            </p>
        </>
    );

    const unitOptions = [
        { value: 'ft+in', label: 'ft + in' }, // Custom composite mode
        { value: 'm', label: 'm' },
        { value: 'cm', label: 'cm' },
        { value: 'mm', label: 'mm' },
        { value: 'ft', label: 'ft' },
        { value: 'in', label: 'in' },
        { value: 'yd', label: 'yd' },
    ];

    const handleUnitChange = (newUnit) => {
        setUnitMode(newUnit);
        // Clean partial states when switching modes? 
        // Omni usually converts the CURRENT value to the NEW unit.
        // For simplicity in this clone, we might just clear or keep raw values if they match.
        // Let's clear to avoid confusion, or try to smart convert if possible.
        // Actually, converting is better UX.
        // Let's SKIP smart conversion for now to strictly follow "Avoid bugs" instruction unless I'm 100% sure.
        // Clearing is safer.
        setFeet('');
        setInches('');
        setSingleVal('');
        setResultInches('');
    };

    return (
        <CalculatorLayout
            title="Height in Inches Calculator"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "How to measure height in inches",
                "How to use our height in inches calculator",
                "Example: convert cm to inches in height",
                "Example: convert inches to meters in height",
                "FAQs"
            ]}
            articleContent={articleContent}
            similarCalculators={12}
        >
            <div className="calculator-card height-in-inches-page">
                {/* Height Input */}
                <div className="input-group">
                    <div className="label-row">
                        <label>Height</label>
                        <span className="more-options">...</span>
                    </div>

                    {unitMode === 'ft+in' ? (
                        <div className="composite-wrapper input-wrapper">
                            {/* Feet */}
                            <input
                                type="number"
                                className="calc-input"
                                value={feet}
                                onChange={(e) => setFeet(e.target.value)}
                                placeholder=""
                            />
                            <span className="unit-label-static">ft</span>

                            {/* Inches */}
                            <input
                                type="number"
                                className="calc-input"
                                value={inches}
                                onChange={(e) => setInches(e.target.value)}
                                placeholder=""
                            />

                            <div className="unit-select-container">
                                <select
                                    value={unitMode}
                                    onChange={(e) => handleUnitChange(e.target.value)}
                                    className="unit-select"
                                >
                                    {unitOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label.replace('ft + in', 'in')}</option> // Hack: show 'in' to match screenshot "ft | in v" look roughly? No, let's show 'ft in'
                                        // Screenshot shows "ft" next to first box, "in" next to second box, and dropdown arrow.
                                        // The dropdown ITSELF seems to display the unit of the LAST field or the composite.
                                        // Let's just render the select normally.
                                    ))}
                                </select>
                                <ChevronDown size={14} className="unit-arrow" />
                            </div>
                        </div>
                    ) : (
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={singleVal}
                                onChange={(e) => setSingleVal(e.target.value)}
                            />
                            <div className="unit-select-container">
                                <select
                                    value={unitMode}
                                    onChange={(e) => handleUnitChange(e.target.value)}
                                    className="unit-select"
                                >
                                    {unitOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="unit-arrow" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Result Input */}
                <div className="input-group result-group">
                    <div className="label-row">
                        <label>Height in inches</label>
                        <span className="more-options">...</span>
                    </div>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            className="calc-input result-input"
                            value={resultInches}
                            readOnly
                        />
                        <div className="unit-display">
                            <span>in</span>
                        </div>
                    </div>
                </div>

                <div className="calc-actions">
                    <button className="share-result-btn">
                        <div className="share-icon-circle"><Share2 size={14} /></div>
                        Share result
                    </button>
                    <div className="secondary-actions">
                        <button className="secondary-btn">Reload calculator</button>
                        <button className="secondary-btn" onClick={() => {
                            setFeet('');
                            setInches('');
                            setSingleVal('');
                            setResultInches('');
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
                    Check out <strong>12 similar</strong> length and area converters
                </div>

            </div>
        </CalculatorLayout>
    );
};

export default HeightInInchesCalculatorPage;
