import React, { useState } from 'react';
import CalculatorLayout from '../components/CalculatorLayout';
import { Share2 } from 'lucide-react';
import './DecimalToPercentConverterPage.css';

const DecimalToPercentConverterPage = () => {

    const [decimal, setDecimal] = useState('');
    const [percent, setPercent] = useState('');

    const fmt = (val) => {
        if (val === '' || val === null || isNaN(val)) return '';
        // Format lightly to avoid weird floating point issues
        return parseFloat(val.toFixed(8)).toString();
    };

    const handleDecimalChange = (val) => {
        setDecimal(val);
        const d = parseFloat(val);
        if (!isNaN(d)) {
            const p = d * 100;
            setPercent(fmt(p));
        } else {
            setPercent('');
        }
    };

    const handlePercentChange = (val) => {
        setPercent(val);
        const p = parseFloat(val);
        if (!isNaN(p)) {
            const d = p / 100;
            setDecimal(fmt(d));
        } else {
            setDecimal('');
        }
    };

    const clearAll = () => {
        setDecimal('');
        setPercent('');
    };

    const creators = [
        { name: "Rita Rain", role: "" },
    ];

    const reviewers = [
        { name: "Dominik Czernia", role: "PhD" },
        { name: "Jack Bowater", role: "" },
    ];

    const articleContent = (
        <>
            <p>
                Welcome to Omni's <strong>decimal to percent converter</strong> (a.k.a. convert decimal to percent calculator). As the names suggest, this simple tool can help you convert decimals to percentages or, if you like, perform the conversion the other way around: from percents to decimals.
            </p>
        </>
    );

    return (
        <CalculatorLayout
            title="Decimal to Percent Converter"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "What are decimals? – an introduction",
                "What are percentages? – an introduction",
                "How to convert decimal to percent by hand?",
                "How to turn a decimal into a percent? – examples",
                "How to use the decimal to percentage converter?",
                "How to convert percent to a decimal by hand?",
                "How to turn a percent into a decimal? – examples",
                "Use our tool as a percentage to decimal converter"
            ]}
            articleContent={articleContent}
            similarCalculators={111}
        >
            <div className="decimal-to-percent-converter-page">

                <div className="section-card">
                    <div className="input-group">
                        <div className="label-row"><label>Decimal</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={decimal}
                                onChange={(e) => handleDecimalChange(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Percentage</label><span className="more-options">...</span></div>
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

            </div>
        </CalculatorLayout>
    );
};

export default DecimalToPercentConverterPage;
