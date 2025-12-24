import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, ChevronDown, ChevronUp } from 'lucide-react';
import './AresToHectaresConverterPage.css';

const AresToHectaresConverterPage = () => {
    // Inputs
    const [ares, setAres] = useState('');
    const [hectares, setHectares] = useState('');
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);

    const creators = [
        { name: "Dawid Siuda", role: "" }
    ];

    const reviewers = [
        { name: "Steven Wooding", role: "" }
    ];

    // Handlers
    const handleAresChange = (val) => {
        setAres(val);
        if (val === '' || isNaN(parseFloat(val))) {
            setHectares('');
        } else {
            // 1 are = 0.01 ha
            const ha = parseFloat(val) * 0.01;
            setHectares(parseFloat(ha.toPrecision(6))); // Avoid float errors
        }
    };

    const handleHectaresChange = (val) => {
        setHectares(val);
        if (val === '' || isNaN(parseFloat(val))) {
            setAres('');
        } else {
            // 1 ha = 100 ares
            const a = parseFloat(val) * 100;
            setAres(parseFloat(a.toPrecision(6)));
        }
    };

    const articleContent = (
        <>
            <p>
                Wondering how to convert ares to hectares? Need an ares to hectares calculator? Look no further! Our article explains everything you need to know about what is a hectare and how to convert hectares to areas, etc.
            </p>
        </>
    );

    return (
        <CalculatorLayout
            title="Ares to hectares converter"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "What is an are?",
                "What is a hectare?",
                "How to convert ares to hectares",
                "Are to hectare formula",
                "FAQs"
            ]}
            articleContent={articleContent}
            similarCalculators={12}
        >
            <div className="calculator-card ares-to-hectares-page">
                {/* Ares Input */}
                <div className="input-group">
                    <div className="label-row">
                        <label>Ares</label>
                        <span className="more-options">...</span>
                    </div>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            className="calc-input"
                            value={ares}
                            onChange={(e) => handleAresChange(e.target.value)}
                        />
                        <span className="unit-label-static">a</span>
                    </div>
                </div>

                {/* Hectares Input */}
                <div className="input-group">
                    <div className="label-row">
                        <label>Hectares</label>
                        <span className="more-options">...</span>
                    </div>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            className="calc-input"
                            value={hectares}
                            onChange={(e) => handleHectaresChange(e.target.value)}
                        />
                        <span className="unit-label-static">ha</span>
                    </div>
                </div>

                {/* Collapsible Section */}
                <div className="collapsible-section">
                    <div className="collapsible-header" onClick={() => setIsOptionsOpen(!isOptionsOpen)}>
                        <div className="header-left">
                            {isOptionsOpen ? <ChevronUp size={18} color="#436cfe" /> : <ChevronDown size={18} color="#436cfe" />}
                            <span>More conversion options</span>
                        </div>
                    </div>
                    {isOptionsOpen && (
                        <div className="collapsible-content">
                            <div className="input-group">
                                <label style={{ fontSize: '0.85rem', marginBottom: '4px', display: 'block' }}>Square meters</label>
                                <div className="input-wrapper">
                                    <input type="number" className="calc-input" readOnly value={ares ? (parseFloat(ares) * 100).toFixed(2) : ''} placeholder="" />
                                    <span className="unit-label-static">m²</span>
                                </div>
                            </div>
                            <div className="input-group">
                                <label style={{ fontSize: '0.85rem', marginBottom: '4px', display: 'block' }}>Acres</label>
                                <div className="input-wrapper">
                                    <input type="number" className="calc-input" readOnly value={ares ? (parseFloat(ares) * 0.0247105).toFixed(4) : ''} placeholder="" />
                                    <span className="unit-label-static">ac</span>
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
                            setAres('');
                            setHectares('');
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

export default AresToHectaresConverterPage;
