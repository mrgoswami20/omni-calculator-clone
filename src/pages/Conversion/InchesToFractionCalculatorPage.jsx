import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, ChevronDown, Info, ChevronUp } from 'lucide-react';
import './InchesToFractionCalculatorPage.css';

const InchesToFractionCalculatorPage = () => {
    // Inputs
    const [distance, setDistance] = useState('');
    const [unit, setUnit] = useState('in');

    // Precision: denominator (2, 4, 8, 16, 32, 64)
    const [precision, setPrecision] = useState('32');

    // Result Strings
    const [fractionResult, setFractionResult] = useState('');
    const [feetAndInchesResult, setFeetAndInchesResult] = useState('');
    const [isConverterOpen, setIsConverterOpen] = useState(false);

    const creators = [
        { name: "Wojciech Sas", role: "PhD" }
    ];

    const reviewers = [
        { name: "Bogna Szyk", role: "" },
        { name: "Jack Bowater", role: "" }
    ];

    // GCD helper
    const gcd = (a, b) => {
        if (!b) return a;
        return gcd(b, a % b);
    };

    // Calculation Effect
    useEffect(() => {
        if (!distance || isNaN(parseFloat(distance))) {
            setFractionResult('');
            setFeetAndInchesResult('');
            return;
        }

        const val = parseFloat(distance);
        // Convert to inches if needed
        let inVal = val;
        switch (unit) {
            case 'mm': inVal = val / 25.4; break;
            case 'cm': inVal = val / 2.54; break;
            case 'm': inVal = val * 39.3701; break;
            case 'ft': inVal = val * 12; break;
            case 'yd': inVal = val * 36; break;
            default: inVal = val; // 'in'
        }

        // --- Logic for Fraction inches ---
        // Format: X" = Y/Z" = A B/C"
        const integerPart = Math.floor(inVal);
        const decimalPart = inVal - integerPart;
        const denominator = parseInt(precision);
        const numerator = Math.round(decimalPart * denominator);

        let fractionStr = '';

        // Unsimplified part (e.g., 34/1" or 69/2")
        // If it's a whole number, say 34.0 input -> 34" = 34/1" = 34"
        // If 0.5 input -> 0.5" = 1/2"

        // Let's build the "Improper" representation first if it helps match the look, 
        // OR just follow the equality chain: Decimal" = Fraction"

        // The screenshot showed: 34" = 34/1" = 34"
        // This implies: exact input = improper fraction = simplified mixed

        const totalNumerator = Math.round(inVal * denominator);
        const improperStr = `${totalNumerator}/${denominator}"`;

        let simplifiedStr = '';
        if (numerator === denominator) {
            simplifiedStr = `${integerPart + 1}"`;
        } else if (numerator === 0) {
            simplifiedStr = `${integerPart}"`;
        } else {
            const common = gcd(numerator, denominator);
            const simNum = numerator / common;
            const simDen = denominator / common;
            if (integerPart > 0) {
                simplifiedStr = `${integerPart} ${simNum}/${simDen}"`;
            } else {
                simplifiedStr = `${simNum}/${simDen}"`;
            }
        }

        // Construct the full string:  Input" = Improper = Simplified
        // But if Input is already Integer, 34" = 34/1" = 34"
        // If Input is 0.5: 0.5" = 16/32" = 1/2" (if precision 32)

        // Let's try to match exactly:
        // Input showing up to 4 decimals?
        const inputDisplay = parseFloat(inVal.toFixed(4)) + '"';

        // Ensure improperStr shows the math step
        // If precision is 32, 0.5 is 16/32.

        if (inputDisplay === simplifiedStr) {
            fractionStr = simplifiedStr;
        } else {
            // For integer case 34: 34" = 34/1" = 34" (if den=1... but den=32? 34 = 1088/32? No that looks ugly)
            // The screenshot 34/1 implies the denominator wasn't forced to 32 for the *display* of the middle step 
            // OR specific logic for integers.

            // If integer, usage is: 34" = 34/1" = 34"
            if (Math.abs(inVal - Math.round(inVal)) < 1e-6) {
                fractionStr = `${inputDisplay} = ${Math.round(inVal)}/1" = ${Math.round(inVal)}"`;
            } else {
                fractionStr = `${inputDisplay} = ${improperStr} = ${simplifiedStr}`;
            }
        }
        setFractionResult(fractionStr);


        // --- Logic for Feet and inches ---
        // Format: X' Y"
        // Feet is floor(inVal / 12)
        // Rem Inches = inVal % 12
        // Rem Inches should also be fraction formatted!

        const feet = Math.floor(inVal / 12);
        const remInchesDec = inVal % 12;

        // Format remInchesDec using same precision logic
        const remInt = Math.floor(remInchesDec);
        const remDec = remInchesDec - remInt;
        const remNum = Math.round(remDec * denominator);

        let remInchStr = '';
        if (remNum === denominator) {
            remInchStr = `${remInt + 1}"`;
        } else if (remNum === 0) {
            remInchStr = `${remInt}"`;
        } else {
            const common = gcd(remNum, denominator);
            remInchStr = (remInt > 0)
                ? `${remInt} ${remNum / common}/${denominator / common}"`
                : `${remNum / common}/${denominator / common}"`;
        }

        if (feet > 0) {
            setFeetAndInchesResult(`${feet}' ${remInchStr}`);
        } else {
            setFeetAndInchesResult(remInchStr);
        }

    }, [distance, unit, precision]);

    const articleContent = (
        <>
            <p>
                This is the inches to fractions calculator, a simple and intuitive tool that helps you converting any decimal value to a fraction in inches.
            </p>
        </>
    );

    const unitOptions = [
        { value: 'in', label: 'in' },
        { value: 'mm', label: 'mm' },
        { value: 'cm', label: 'cm' },
        { value: 'm', label: 'm' },
        { value: 'ft', label: 'ft' },
        { value: 'yd', label: 'yd' },
    ];

    const precisionOptions = [
        { value: '2', label: '1/2' },
        { value: '4', label: '1/4' },
        { value: '8', label: '1/8' },
        { value: '16', label: '1/16' },
        { value: '32', label: '1/32' },
        { value: '64', label: '1/64' },
    ];

    return (
        <CalculatorLayout
            title="Inches to Fraction Calculator"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "How to convert decimal to fraction inches",
                "How to convert distance in mm to inches fraction",
                "Fraction to inches conversion table",
                "FAQs"
            ]}
            articleContent={articleContent}
            similarCalculators={12}
        >
            <div className="calculator-card inches-to-fraction-page">
                <h3>Enter distance (decimal or fraction)</h3>

                <div className="inputs-row">
                    {/* Distance Input */}
                    <div className="input-group distance-group">
                        <div className="label-row">
                            <label>Distance</label>
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
                                    {unitOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="unit-arrow" />
                            </div>
                        </div>
                    </div>

                    {/* Precision Dropdown */}
                    <div className="input-group precision-group">
                        <div className="label-row">
                            <label>Precision <Info size={12} className="info-icon" /></label>
                            <span className="more-options">...</span>
                        </div>
                        <div className="select-wrapper">
                            <select
                                value={precision}
                                onChange={(e) => setPrecision(e.target.value)}
                                className="calc-select"
                            >
                                {precisionOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <ChevronDown className="select-arrow" size={16} />
                        </div>
                    </div>
                </div>

                {/* Result Display? Screenshot doesn't show a clear "Result" box, 
                    but implies the input converts or there's a section below.
                    Usually Omni has a separate result field. 
                    Wait, the screenshot title is "Enter distance...".
                    Actually, maybe the result is the input itself if it were bidirectional?
                    But this is "decimal to fraction".
                    Let's add a Result box.
                */}
                {/* Custom Result Layout matching screenshot */}
                <div className="custom-results-container">
                    {/* Fraction inches */}
                    <div className="result-section">
                        <label className="result-label-small">Fraction inches:</label>
                        <div className="result-value-text">{fractionResult || '-'}</div>
                    </div>

                    {/* Feet and inches */}
                    <div className="result-section">
                        <label className="result-label-small">Feet and inches:</label>
                        <div className="result-value-text">{feetAndInchesResult || '-'}</div>
                    </div>
                </div>

                {/* Collapsible Section */}
                <div className="collapsible-section">
                    <div className="collapsible-header" onClick={() => setIsConverterOpen(!isConverterOpen)}>
                        <div className="header-left">
                            {isConverterOpen ? <ChevronUp size={18} color="#436cfe" /> : <ChevronDown size={18} color="#436cfe" />}
                            <span>Convert to other units</span>
                        </div>
                    </div>
                    {isConverterOpen && (
                        <div className="collapsible-content">
                            <div className="input-group">
                                <label style={{ fontSize: '0.85rem', marginBottom: '4px', display: 'block' }}>Distance in cm</label>
                                <div className="input-wrapper">
                                    <input type="number" className="calc-input" readOnly value={distance && unit === 'cm' ? distance : ''} placeholder={distance ? (parseFloat(distance) * 2.54).toFixed(4) : ''} />
                                    {/* Simple placeholders logic for now */}
                                    <span className="unit-label-static">cm</span>
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
                        <button className="secondary-btn" onClick={() => {
                            setDistance('');
                            setFractionResult('');
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

export default InchesToFractionCalculatorPage;
