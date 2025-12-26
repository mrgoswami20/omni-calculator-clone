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

    // Confusion Matrix Inputs
    const [tp, setTp] = useState('');
    const [tn, setTn] = useState('');
    const [fp, setFp] = useState('');
    const [fn, setFn] = useState('');

    // Results
    const [accuracy, setAccuracy] = useState('');
    const [sensitivity, setSensitivity] = useState('');
    const [specificity, setSpecificity] = useState('');

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
        }
    }, [tp, tn, fp, fn, method]);

    const handleClear = () => {
        setTp('');
        setTn('');
        setFp('');
        setFn('');
        setAccuracy('');
        setSensitivity('');
        setSpecificity('');
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
            <div className="calculator-card accuracy-calculator-page">
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
                {method !== 'standard' && (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                        This method is currently under construction. Please use the Standard method.
                    </div>
                )}

                <div className="calc-actions">
                    <button className="share-result-btn" onClick={handleShare} style={{ position: 'relative' }}>
                        <div className="share-icon-circle"><Share2 size={14} /></div>
                        Share result
                        {showShareTooltip && <span className="copied-tooltip" style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)' }}>Copied!</span>}
                    </button>
                    <div className="secondary-actions">
                        <button className="secondary-btn">Reload calculator</button>
                        <button className="secondary-btn" onClick={handleClear}>Clear all changes</button>
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
        </CalculatorLayout>
    );
};

export default AccuracyCalculatorPage;
