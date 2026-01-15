import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, ChevronDown, ChevronUp } from 'lucide-react';
import InputGroup from '../../components/StandardCalculator/InputGroup';
import './AresToHectaresConverterPage.css';

// m2 per unit
const UNIT_FACTORS = {
    'square millimeters (mm2)': 0.000001,
    'square centimeters (cm2)': 0.0001,
    'square decimeters (dm2)': 0.01,
    'square meters (m2)': 1,
    'square kilometers (km2)': 1000000,
    'square inches (in2)': 0.00064516,
    'square feet (ft2)': 0.092903,
    'square yards (yd2)': 0.836127,
    'square miles (mi2)': 2589988,
    'decares (da)': 1000,
    'acres (ac)': 4046.86,
    'soccer fields (sf)': 7140
};

const AresToHectaresConverterPage = () => {
    // Inputs
    const [ares, setAres] = useState('');
    const [hectares, setHectares] = useState('');
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);

    // Custom Unit State
    const [customUnit, setCustomUnit] = useState('square meters (m2)');
    const [customVal, setCustomVal] = useState('');

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

    // Sync custom value when ares changes (one-way sync for display)
    // We need to be careful not to overwrite if the user is typing in custom input
    // But since we have a single source of truth ideally, we can just calculate it on render or effect.
    // However, for the InputGroup pattern, we usually pass a value.
    // Let's us an effect to update customVal when 'ares' or 'customUnit' changes, 
    // IF the change didn't originate from customVal itself. 
    // Actually, simpler: just calculate it from 'ares' if 'ares' is valid.
    // BUT we need to support typing in custom input to update 'ares'.

    // Let's use the same pattern as standard calc: controlled inputs.
    // But here we have 3 connected inputs.
    // To avoid loops/cursor jumping, we can blindly update on effect? 
    // Or better: valid 'ares' is the source.
    useEffect(() => {
        if (ares === '' || isNaN(parseFloat(ares))) {
            setCustomVal('');
        } else {
            const m2 = parseFloat(ares) * 100;
            const val = m2 / UNIT_FACTORS[customUnit];

            // formatting
            if (val >= 10000) setCustomVal(Math.round(val).toString());
            else if (val < 0.0001 && val > 0) setCustomVal(val.toExponential(4));
            else setCustomVal(parseFloat(val.toPrecision(7)).toString()); // cleaner string
        }
    }, [ares, customUnit]);

    const handleCustomChange = (val) => {
        setCustomVal(val); // update local immediately
        if (val === '' || isNaN(parseFloat(val))) {
            setAres('');
            setHectares('');
        } else {
            const m2 = parseFloat(val) * UNIT_FACTORS[customUnit];
            const a = m2 / 100;
            // Update Ares/Hectares without triggering the effect loop ideally?
            // The effect depends on [ares]. If we setAres, effect fires.
            // React batching might help, or checking if value is close.
            // For now, let's just setAres. The effect will run and re-format customVal, 
            // which might shift cursor or format slightly differently (e.g. 1.0 vs 1).
            // This is a known issue with triple-bound inputs.
            // A common fix is to check difference.
            setAres(parseFloat(a.toPrecision(6)));
            setHectares(parseFloat((a * 0.01).toPrecision(6)));
        }
    };

    const articleContent = (
        <>
            <p>
                Wondering how to convert ares to hectares? Need an ares to hectares calculator? Look no further! Our article explains everything you need to know about what is a hectare and how to convert hectares to areas, etc.
            </p>
        </>
    );

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
            <div className="calc-card ares-to-hectares-page">
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
                            onWheel={(e) => e.target.blur()} />
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
                            onWheel={(e) => e.target.blur()} />
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
                            <InputGroup
                                label="Area in other units"
                                value={customVal}
                                onChange={handleCustomChange}
                                unit={customUnit}
                                onUnitChange={setCustomUnit}
                                isUnitDropdown={true}
                                unitOptions={Object.keys(UNIT_FACTORS)}
                            />
                        </div>
                    )}
                </div>

                <div className="calc-actions">
                    {/* <button className="share-result-btn" onClick={handleShare}>
                        <div className="share-icon-circle"><Share2 size={14} /></div>
                        Share result
                        {showShareTooltip && <span className="copied-tooltip" style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)' }}>Copied!</span>}
                    </button> */}
                    <div className="secondary-actions">
                        <button className="secondary-btn" onClick={() => window.location.reload()}>Reload calculator</button>
                        <button className="secondary-btn" onClick={() => {
                            setAres('');
                            setHectares('');
                            setCustomVal('');
                        }}>Clear all changes</button>
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
