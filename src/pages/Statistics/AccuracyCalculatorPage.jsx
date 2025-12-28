import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, Info, MoreHorizontal } from 'lucide-react';
import './AccuracyCalculatorPage.css';

const AccuracyCalculatorPage = () => {
    const [method, setMethod] = useState('standard');
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

    const handleWheel = (e) => e.target.blur();

    // Confusion Matrix Inputs
    const [tp, setTp] = useState('');
    const [tn, setTn] = useState('');
    const [fp, setFp] = useState('');
    const [fn, setFn] = useState('');

    // Results
    const [accuracy, setAccuracy] = useState('');
    const [sensitivity, setSensitivity] = useState('');
    const [specificity, setSpecificity] = useState('');

    // Prevalence Method Inputs
    const [prevalence, setPrevalence] = useState('');
    const [inputSensitivity, setInputSensitivity] = useState('');
    const [inputSpecificity, setInputSpecificity] = useState('');
    const [showMatrix, setShowMatrix] = useState(false);

    // Percent Error Method Inputs
    const [observedValue, setObservedValue] = useState('');
    const [acceptedValue, setAcceptedValue] = useState('');
    const [percentError, setPercentError] = useState('');

    const creators = [
        { name: "Łucja Zaborowska", role: "MD, PhD candidate" },
        { name: "Wei Bin Loo", role: "" }
    ];

    const reviewers = [
        { name: "Bogna Szyk" },
        { name: "Jack Bowater" }
    ];

    useEffect(() => {
        if (method === 'standard') {
            const TP = parseFloat(tp);
            const TN = parseFloat(tn);
            const FP = parseFloat(fp);
            const FN = parseFloat(fn);

            if (!isNaN(TP) && !isNaN(TN) && !isNaN(FP) && !isNaN(FN)) {
                const total = TP + TN + FP + FN;

                if (total > 0) {
                    // Accuracy = (TP + TN) / Total
                    const acc = ((TP + TN) / total) * 100;
                    setAccuracy(acc.toFixed(2));
                } else {
                    setAccuracy('');
                }

                // Sensitivity = TP / (TP + FN)
                if ((TP + FN) > 0) {
                    const sens = (TP / (TP + FN)) * 100;
                    setSensitivity(sens.toFixed(2));
                } else {
                    setSensitivity('');
                }

                // Specificity = TN / (TN + FP)
                if ((TN + FP) > 0) {
                    const spec = (TN / (TN + FP)) * 100;
                    setSpecificity(spec.toFixed(2));
                } else {
                    setSpecificity('');
                }
            } else {
                setAccuracy('');
                setSensitivity('');
                setSpecificity('');
            }
        } else if (method === 'prevalence') {
            const prev = parseFloat(prevalence);
            const sens = parseFloat(inputSensitivity);
            const spec = parseFloat(inputSpecificity);

            if (!isNaN(prev) && !isNaN(sens) && !isNaN(spec)) {
                // Inputs are usually in %, so divide by 100 for calc
                const prevDecimal = prev / 100;
                const sensDecimal = sens / 100;
                const specDecimal = spec / 100;

                // Accuracy = (Sensitivity * Prevalence) + (Specificity * (1 - Prevalence))
                const accDecimal = (sensDecimal * prevDecimal) + (specDecimal * (1 - prevDecimal));

                setAccuracy((accDecimal * 100).toFixed(2));
            } else {
                setAccuracy('');
            }
        } else if (method === 'percent_error') {
            const obs = parseFloat(observedValue);
            const acc = parseFloat(acceptedValue);

            if (!isNaN(obs) && !isNaN(acc) && acc !== 0) {
                // Percent Error = |(Observed - Accepted) / Accepted| * 100
                const error = Math.abs((obs - acc) / acc) * 100;
                setPercentError(error.toFixed(2));
            } else {
                setPercentError('');
            }
        }
    }, [tp, tn, fp, fn, method, prevalence, inputSensitivity, inputSpecificity, observedValue, acceptedValue]);

    const handleClear = () => {
        setTp('');
        setTn('');
        setFp('');
        setFn('');
        setAccuracy('');
        setSensitivity('');
        setSpecificity('');
        setPrevalence('');
        setInputSensitivity('');
        setInputSpecificity('');
        setInputSensitivity('');
        setInputSpecificity('');
        setShowMatrix(false);
        setObservedValue('');
        setAcceptedValue('');
        setPercentError('');
    };

    const articleContent = (
        <>
            <p>
                Our accuracy calculator is a simple tool that allows you to compute accuracy using <strong>three different methods</strong>. While the first two methods are widely used in the <strong>evaluation of diagnostic tests</strong>, the third one can be applied to a wide range of sciences 🧪.
            </p>
            <p>Read on to discover:</p>
            <ul>
                <li>How to use the accuracy calculator;</li>
                <li>How to calculate accuracy percentage;</li>
                <li>Accuracy vs. precision;</li>
                <li>What is accuracy in chemistry? And</li>
                <li>FAQs.</li>
            </ul>
        </>
    );

    return (
        <CalculatorLayout
            title="Accuracy Calculator"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "How to use the accuracy calculator",
                "How to calculate accuracy percentage?",
                "Accuracy vs. precision",
                "What is accuracy in chemistry?",
                "FAQs"
            ]}
            articleContent={articleContent}
            similarCalculators={3}
        >
            <div className="accuracy-calculator-page">
                <div className="section-card">
                    {/* Method Selection */}
                    <div className="method-selection">
                        <div className="method-header">
                            <span>Select a method <Info size={14} style={{ display: 'inline', marginLeft: 4 }} /></span>
                            <MoreHorizontal size={16} className="more-dots" />
                        </div>
                        <div className="radio-group">
                            <label className="radio-option">
                                <input
                                    type="radio"
                                    name="method"
                                    value="standard"
                                    checked={method === 'standard'}
                                    onChange={(e) => setMethod(e.target.value)}
                                />
                                Standard method
                            </label>
                            <label className="radio-option">
                                <input
                                    type="radio"
                                    name="method"
                                    value="prevalence"
                                    checked={method === 'prevalence'}
                                    onChange={(e) => setMethod(e.target.value)}
                                />
                                Prevalence method
                            </label>
                            <label className="radio-option">
                                <input
                                    type="radio"
                                    name="method"
                                    value="percent_error"
                                    checked={method === 'percent_error'}
                                    onChange={(e) => setMethod(e.target.value)}
                                />
                                Percent error method
                            </label>
                        </div>
                        {method === 'prevalence' && (
                            <div className="checkbox-wrapper" style={{ marginTop: '12px', paddingTop: '12px', borderTop: 'none' }}>
                                <label className="radio-option">
                                    <input
                                        type="checkbox"
                                        checked={showMatrix}
                                        onChange={(e) => setShowMatrix(e.target.checked)}
                                        style={{
                                            width: '16px',
                                            height: '16px',
                                            marginRight: '8px',
                                            accentColor: '#436cfe',
                                            cursor: 'pointer'
                                        }}
                                    />
                                    Show confusion matrix
                                </label>
                            </div>
                        )}
                    </div>

                    {/* Standard Method Matrix Inputs */}
                    {method === 'standard' && (
                        <div className="matrix-input-section">
                            <div className="matrix-grid">
                                <div className="matrix-cell">
                                    <label>
                                        True positive
                                        <MoreHorizontal size={16} className="more-dots" />
                                    </label>
                                    <input
                                        type="number"
                                        value={tp}
                                        onChange={(e) => setTp(e.target.value)}
                                        onWheel={handleWheel}
                                    />
                                </div>
                                <div className="matrix-cell">
                                    <label>
                                        False positive
                                        <MoreHorizontal size={16} className="more-dots" />
                                    </label>
                                    <input
                                        type="number"
                                        value={fp}
                                        onChange={(e) => setFp(e.target.value)}
                                        onWheel={handleWheel}
                                    />
                                </div>
                                <div className="matrix-cell">
                                    <label>
                                        False negative
                                        <MoreHorizontal size={16} className="more-dots" />
                                    </label>
                                    <input
                                        type="number"
                                        value={fn}
                                        onChange={(e) => setFn(e.target.value)}
                                        onWheel={handleWheel}
                                    />
                                </div>
                                <div className="matrix-cell">
                                    <label>
                                        True negative
                                        <MoreHorizontal size={16} className="more-dots" />
                                    </label>
                                    <input
                                        type="number"
                                        value={tn}
                                        onChange={(e) => setTn(e.target.value)}
                                        onWheel={handleWheel}
                                    />
                                </div>
                            </div>

                            {/* Results */}
                            <div className="results-section">
                                <div className="result-row">
                                    <label>
                                        Accuracy
                                        <MoreHorizontal size={16} className="more-dots" />
                                    </label>
                                    <div className="input-wrapper-result">
                                        <input
                                            type="text"
                                            value={accuracy}
                                            readOnly
                                        />
                                        <span className="unit">%</span>
                                    </div>
                                </div>
                                <div className="result-row">
                                    <label>
                                        Sensitivity
                                        <MoreHorizontal size={16} className="more-dots" />
                                    </label>
                                    <div className="input-wrapper-result">
                                        <input
                                            type="text"
                                            value={sensitivity}
                                            readOnly
                                        />
                                        <span className="unit">%</span>
                                    </div>
                                </div>
                                <div className="result-row">
                                    <label>
                                        Specificity
                                        <MoreHorizontal size={16} className="more-dots" />
                                    </label>
                                    <div className="input-wrapper-result">
                                        <input
                                            type="text"
                                            value={specificity}
                                            readOnly
                                        />
                                        <span className="unit">%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Placeholders for other methods */}
                    {/* Prevalence Method Inputs */}
                    {method === 'prevalence' && (
                        <div className="prevalence-input-section">
                            {/* Matrix Grid (Conditional) */}
                            {showMatrix && (
                                <div className="matrix-grid" style={{ marginBottom: '24px' }}>
                                    <div className="matrix-cell">
                                        <label>
                                            True positive
                                            <MoreHorizontal size={16} className="more-dots" />
                                        </label>
                                        <input
                                            type="number"
                                            value={tp}
                                            onChange={(e) => setTp(e.target.value)}
                                            onWheel={handleWheel}
                                        />
                                    </div>
                                    <div className="matrix-cell">
                                        <label>
                                            False positive
                                            <MoreHorizontal size={16} className="more-dots" />
                                        </label>
                                        <input
                                            type="number"
                                            value={fp}
                                            onChange={(e) => setFp(e.target.value)}
                                            onWheel={handleWheel}
                                        />
                                    </div>
                                    <div className="matrix-cell">
                                        <label>
                                            False negative
                                            <MoreHorizontal size={16} className="more-dots" />
                                        </label>
                                        <input
                                            type="number"
                                            value={fn}
                                            onChange={(e) => setFn(e.target.value)}
                                            onWheel={handleWheel}
                                        />
                                    </div>
                                    <div className="matrix-cell">
                                        <label>
                                            True negative
                                            <MoreHorizontal size={16} className="more-dots" />
                                        </label>
                                        <input
                                            type="number"
                                            value={tn}
                                            onChange={(e) => setTn(e.target.value)}
                                            onWheel={handleWheel}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Prevalence */}
                            <div className="input-group">
                                <label className="input-label">
                                    Prevalence
                                    <MoreHorizontal size={16} className="more-dots" />
                                </label>
                                <div className="input-wrapper-result">
                                    <input
                                        type="number"
                                        value={prevalence}
                                        onChange={(e) => setPrevalence(e.target.value)}
                                        onWheel={handleWheel}
                                        placeholder=" "
                                    />
                                    <span className="unit">%</span>
                                </div>
                            </div>

                            {/* Sensitivity */}
                            <div className="input-group">
                                <label className="input-label">
                                    Sensitivity
                                    <MoreHorizontal size={16} className="more-dots" />
                                </label>
                                <div className="input-wrapper-result">
                                    <input
                                        type="number"
                                        value={inputSensitivity}
                                        onChange={(e) => setInputSensitivity(e.target.value)}
                                        onWheel={handleWheel}
                                        placeholder=" "
                                    />
                                    <span className="unit">%</span>
                                </div>
                            </div>

                            {/* Specificity */}
                            <div className="input-group">
                                <label className="input-label">
                                    Specificity
                                    <MoreHorizontal size={16} className="more-dots" />
                                </label>
                                <div className="input-wrapper-result">
                                    <input
                                        type="number"
                                        value={inputSpecificity}
                                        onChange={(e) => setInputSpecificity(e.target.value)}
                                        onWheel={handleWheel}
                                        placeholder=" "
                                    />
                                    <span className="unit">%</span>
                                </div>
                            </div>

                            {/* Accuracy Result */}
                            <div className="input-group">
                                <label className="input-label">
                                    Accuracy
                                    <MoreHorizontal size={16} className="more-dots" />
                                </label>
                                <div className="input-wrapper-result">
                                    <input
                                        type="text"
                                        value={accuracy}
                                        readOnly
                                        className="result-field"
                                    />
                                    <span className="unit">%</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {method === 'percent_error' && (
                        <div className="percent-error-input-section">
                            {/* Observed Value */}
                            <div className="input-group">
                                <label className="input-label">
                                    Observed value
                                    <MoreHorizontal size={16} className="more-dots" />
                                </label>
                                <input
                                    type="number"
                                    className="input-field"
                                    value={observedValue}
                                    onChange={(e) => setObservedValue(e.target.value)}
                                    onWheel={handleWheel}
                                    placeholder=" "
                                />
                            </div>

                            {/* Accepted Value */}
                            <div className="input-group">
                                <div className="label-row">
                                    <span>Accepted value <Info size={14} style={{ display: 'inline', marginLeft: 4, color: '#9ca3af' }} /></span>
                                    <MoreHorizontal size={16} className="more-dots" />
                                </div>
                                <input
                                    type="number"
                                    className="input-field"
                                    value={acceptedValue}
                                    onChange={(e) => setAcceptedValue(e.target.value)}
                                    onWheel={handleWheel}
                                    placeholder=" "
                                />
                            </div>

                            {/* Percent Error Result */}
                            <div className="input-group">
                                <div className="label-row">
                                    <span>Percent error <Info size={14} style={{ display: 'inline', marginLeft: 4, color: '#9ca3af' }} /></span>
                                    <MoreHorizontal size={16} className="more-dots" />
                                </div>
                                <div className="input-wrapper-result">
                                    <input
                                        type="text"
                                        value={percentError}
                                        readOnly
                                        className="result-field"
                                    />
                                    <span className="unit">%</span>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                <div className="section-card">
                    <div className="calc-actions-custom" style={{ marginTop: 0, borderTop: 'none', paddingTop: 0 }}>
                        <button className="share-result-btn-custom" onClick={handleShare}>
                            <div className="share-icon-circle-custom">
                                <Share2 size={24} />
                            </div>
                            Share result
                            {showShareTooltip && <span className="copied-tooltip">Copied!</span>}
                        </button>
                        <div className="secondary-actions-custom">
                            <button className="secondary-btn-custom" onClick={() => window.location.reload()}>
                                Reload calculator
                            </button>
                            <button className="secondary-btn-custom" onClick={handleClear}>
                                Clear all changes
                            </button>
                        </div>
                    </div>

                    <div className="feedback-section">
                        <p>Did we solve your problem today?</p>
                        <div className="feedback-btns">
                            <button>Yes</button>
                            <button>No</button>
                        </div>
                    </div>
                </div>
            </div>
        </CalculatorLayout>
    );
};

export default AccuracyCalculatorPage;
