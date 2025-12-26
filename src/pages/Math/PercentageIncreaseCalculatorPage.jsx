
import React, { useState } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, ChevronDown, MoreVertical, ThumbsUp, ThumbsDown } from 'lucide-react';
import './PercentageIncreaseCalculatorPage.css';

// Reusable Input
const CalcInput = ({ label, value, field, unit, onChange, isCalculated = false }) => (
    <div className="input-row">
        <div className="label-wrapper">
            <label>{label}</label>
            <div className="label-icons">
                <MoreVertical size={16} className="dots-icon" />
            </div>
        </div>
        <div className="field-wrapper">
            <input
                type="number"
                className={`sc-input ${isCalculated ? 'calculated' : ''}`}
                value={value}
                onChange={(e) => onChange(field, e.target.value)}
                onWheel={(e) => e.target.blur()}
            />
            {unit && (
                <div className="unit-badge">
                    <span>{unit}</span>
                    {unit !== '' && <ChevronDown size={14} />}
                </div>
            )}
        </div>
    </div>
);

const PercentageIncreaseCalculatorPage = () => {
    const [values, setValues] = useState({
        initial: '',
        final: '',
        percentage: '',
        difference: ''
    });

    const [calculatedFields, setCalculatedFields] = useState([]);
    const [mode, setMode] = useState('increase'); // 'increase' | 'decrease'
    const [showShareTooltip, setShowShareTooltip] = useState(false);

    const toFixed = (val) => {
        if (val === '' || isNaN(val)) return '';
        // Avoid -0.00 and ensure simple formatting
        const f = parseFloat(Number(val).toFixed(2));
        return Math.abs(f) < 0.0001 ? '0' : f.toString();
    };

    const handleModeChange = (newMode) => {
        setMode(newMode);
        // Recalculate based on current initial and percentage if available
        // Or just keep inputs and let user adjust?
        // Omni usually recalculates 'Final' when mode changes, keeping Initial and Percent constant.
        if (values.initial !== '' && values.percentage !== '') {
            const init = parseFloat(values.initial);
            const perc = parseFloat(values.percentage);
            if (!isNaN(init) && !isNaN(perc)) {
                let finalVal;
                if (newMode === 'increase') {
                    finalVal = init * (1 + perc / 100);
                } else {
                    finalVal = init * (1 - perc / 100);
                }
                const realDiff = finalVal - init;

                setValues(prev => ({
                    ...prev,
                    final: toFixed(finalVal),
                    difference: toFixed(realDiff)
                }));
                setCalculatedFields(['final', 'difference']);
            }
        }
    };

    const handleInputChange = (field, val) => {
        const newValues = { ...values, [field]: val };
        const numVal = parseFloat(val);

        // Reset calculated fields if input is cleared, or start fresh
        let newCalculated = [];

        if (val !== '' && isNaN(numVal)) {
            // Allow typing signs etc if needed, but for now strict number
            return;
        }

        // Logic
        // We have: Initial (I), Final (F), Percentage (P), Difference (D)
        // Equations:
        // D = F - I
        // Increase: F = I * (1 + P/100)
        // Decrease: F = I * (1 - P/100)

        // We prioritize based on what changed.
        let I = parseFloat(newValues.initial);
        let F = parseFloat(newValues.final);
        let P = parseFloat(newValues.percentage);
        let D = parseFloat(newValues.difference); // D is strictly F - I

        const isValid = (n) => !isNaN(n) && n !== null;

        if (field === 'initial') {
            I = numVal;
            if (isValid(P)) {
                // I + P -> F, D
                if (mode === 'increase') F = I * (1 + P / 100);
                else F = I * (1 - P / 100);
                D = F - I;
                newCalculated = ['final', 'difference'];
            } else if (isValid(F)) {
                // I + F -> P, D
                D = F - I;
                // Omni percentage increase is ((F - I) / I) * 100
                const rawP = ((F - I) / I) * 100;
                if (mode === 'decrease') {
                    // If mode is 'decrease', P should be positive usually representing the % decrease?
                    // If I=100, F=90. D=-10. (D/I) = -0.1 -> -10%. 
                    // In Decrease mode, we show "10% decrease". So P = 10.
                    // If I=100, F=110. D=10. (D/I) = 0.1 -> 10%.
                    // In Decrease mode, this is a "negative decrease" or "increase".
                    // Omni usually shows the magnitude of the change.
                    P = -rawP; // This makes P positive for a decrease (F<I) and negative for an increase (F>I) in decrease mode.
                } else {
                    P = rawP;
                }
                newCalculated = ['percentage', 'difference'];
            } else if (isValid(D)) {
                // I + D -> F, P
                F = I + D;
                const rawP = (D / I) * 100;
                if (mode === 'decrease') P = -rawP;
                else P = rawP;
                newCalculated = ['final', 'percentage'];
            }
        }
        else if (field === 'final') {
            F = numVal;
            if (isValid(I)) {
                // F + I -> P, D
                D = F - I;
                const rawP = ((F - I) / I) * 100;
                if (mode === 'decrease') {
                    P = ((I - F) / I) * 100; // P = -(F-I)/I
                } else {
                    P = rawP;
                }
                newCalculated = ['percentage', 'difference'];
            } else if (isValid(P)) {
                // F + P -> I, D
                // F = I * (1 +/- P/100)
                // I = F / (1 +/- P/100)
                if (mode === 'increase') I = F / (1 + P / 100);
                else I = F / (1 - P / 100);
                D = F - I;
                newCalculated = ['initial', 'difference'];
            }
        }
        else if (field === 'percentage') {
            P = numVal;
            if (isValid(I)) {
                // P + I -> F, D
                if (mode === 'increase') F = I * (1 + P / 100);
                else F = I * (1 - P / 100);
                D = F - I;
                newCalculated = ['final', 'difference'];
            } else if (isValid(F)) {
                // P + F -> I, D
                // F = I * (1 +/- P/100)
                // I = F / (1 +/- P/100)
                if (mode === 'increase') I = F / (1 + P / 100);
                else I = F / (1 - P / 100);
                D = F - I;
                newCalculated = ['initial', 'difference'];
            }
        }
        // If difference changed, calculate others? Usually difference is just a result view, but if edited:
        else if (field === 'difference') {
            D = numVal;
            // D = F - I
            if (isValid(I)) {
                F = I + D;
                const rawP = (D / I) * 100;
                if (mode === 'decrease') P = -rawP;
                else P = rawP;
                newCalculated = ['final', 'percentage'];
            } else if (isValid(F)) {
                I = F - D;
                const rawP = (D / I) * 100;
                if (mode === 'decrease') P = -rawP;
                else P = rawP;
                newCalculated = ['initial', 'percentage'];
            }
        }

        setCalculatedFields(newCalculated);
        setValues({
            initial: field === 'initial' ? val : toFixed(I),
            final: field === 'final' ? val : toFixed(F),
            percentage: field === 'percentage' ? val : toFixed(P),
            difference: field === 'difference' ? val : toFixed(D)
        });
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setShowShareTooltip(true);
            setTimeout(() => setShowShareTooltip(false), 2000);
        } catch (err) { console.error(err); }
    };

    const handleReload = () => {
        setValues({ initial: '', final: '', percentage: '', difference: '' });
        setCalculatedFields([]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleClear = () => {
        setValues({ initial: '', final: '', percentage: '', difference: '' });
        setCalculatedFields([]);
    };

    // Helper for result text
    const isNegative = parseFloat(values.percentage) < 0;
    const absPercentage = Math.abs(parseFloat(values.percentage));
    const equivalentMode = mode === 'increase' ? 'decrease' : 'increase';

    const articleContent = (
        <div className="article-content">
            <p>
                The <strong>percentage increase calculator</strong> is a useful tool for <strong>calculating the increase from one value to another</strong> in terms of a <strong>percentage</strong> of the original amount. Before using this calculator, it may be beneficial for you to understand how to calculate percent increase by using the percent increase formula. The following sections will explain these concepts in further detail.
            </p>
            <h3>How to calculate percent increase</h3>
            <p>
                To calculate percent increase:
                <br />
                1. <strong>Subtract</strong> the original value from the new value.
                <br />
                2. <strong>Divide</strong> that result by the original value.
                <br />
                3. <strong>Multiply</strong> by 100 to get the percentage.
            </p>
            <h3>Percent increase formula</h3>
            <p>
                The formula for percent increase is:
                <br /><br />
                <code>Percent increase = [(New - Original) / Original] × 100</code>
            </p>
        </div>
    );

    return (
        <CalculatorLayout
            title="Percentage Increase Calculator"
            creators={[{ name: "Mateusz Mucha", role: "" }, { name: "Dominik Czernia", role: "PhD" }]}
            reviewers={[{ name: "Bogna Szyk" }, { name: "Jack Bowater" }]}
            tocItems={["How to calculate", "Percent increase formula", "Calculating percent decrease", "Real-life applications", "FAQs"]}
            articleContent={articleContent}
        >
            <div className="percentage-calculator-container">
                <div className="calc-card">
                    {/* Row 1: Side by Side Inputs */}
                    <div className="input-grid-2">
                        <CalcInput
                            label="Initial value"
                            value={values.initial}
                            field="initial"
                            unit=""
                            onChange={handleInputChange}
                            isCalculated={calculatedFields.includes('initial')}
                        />
                        <CalcInput
                            label="Final value"
                            value={values.final}
                            field="final"
                            unit=""
                            onChange={handleInputChange}
                            isCalculated={calculatedFields.includes('final')}
                        />
                    </div>

                    {/* Row 2: Radio Buttons */}
                    <div className="radio-group-container">
                        <label className="radio-label">Increase or decrease?</label>
                        <div className="radio-options">
                            <div
                                className={`radio-option ${mode === 'increase' ? 'selected' : ''}`}
                                onClick={() => handleModeChange('increase')}
                            >
                                <div className="radio-circle"></div>
                                <span>Increase</span>
                            </div>
                            <div
                                className={`radio-option ${mode === 'decrease' ? 'selected' : ''}`}
                                onClick={() => handleModeChange('decrease')}
                            >
                                <div className="radio-circle"></div>
                                <span>Decrease</span>
                            </div>
                        </div>
                    </div>

                    {/* Row 3: Percentage Input */}
                    <CalcInput
                        label={mode === 'increase' ? "Increase (%)" : "Decrease (%)"}
                        value={values.percentage}
                        field="percentage"
                        unit="%"
                        onChange={handleInputChange}
                        isCalculated={calculatedFields.includes('percentage')}
                    />

                    {/* Result Text */}
                    {values.initial && values.final && values.percentage && (
                        <div className="result-text-container">
                            <p className="result-text">
                                {values.final} is a <strong>{values.percentage}% {mode}</strong> from {values.initial}.
                            </p>

                            {isNegative && (
                                <>
                                    <p className="result-text-equivalent">
                                        or equivalently
                                    </p>
                                    <p className="result-text">
                                        {values.final} is a <strong>{absPercentage}% {equivalentMode}</strong> from {values.initial}.
                                    </p>
                                </>
                            )}
                        </div>
                    )}


                    <div className="calc-divider"></div>

                    {/* Difference Section */}
                    <h3 className="section-title">Difference</h3>
                    <CalcInput
                        label="Final value - Initial value"
                        value={values.difference}
                        field="difference"
                        unit=""
                        onChange={handleInputChange}
                    />

                    <div className="calc-divider"></div>

                    {/* Actions and Feedback */}
                    <div className="calc-actions">
                        <button className="share-result-btn" onClick={handleShare}>
                            <div className="share-icon-circle"><Share2 size={24} /></div>
                            <span>Share result</span>
                            {showShareTooltip && <span className="copied-tooltip">Copied!</span>}
                        </button>

                        <div className="actions-right-stack">
                            <button className="secondary-btn" onClick={handleReload}>Reload calculator</button>
                            <button className="secondary-btn clear-btn" onClick={handleClear}>Clear all changes</button>
                        </div>
                    </div>

                    <div className="calc-divider"></div>

                    <div className="feedback-section-card">
                        <p>Did we solve your problem today?</p>
                        <div className="feedback-buttons">
                            <button className="feedback-btn"><ThumbsUp size={16} /> Yes</button>
                            <button className="feedback-btn"><ThumbsDown size={16} /> No</button>
                        </div>
                    </div>
                </div>
            </div>
        </CalculatorLayout>
    );
};

export default PercentageIncreaseCalculatorPage;
