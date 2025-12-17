import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../components/CalculatorLayout';
import { Share2, ChevronDown, ChevronUp, Info } from 'lucide-react';
import './BoostHorsepowerCalculatorPage.css';

const BoostHorsepowerCalculatorPage = () => {
    // Inputs
    const [originalPower, setOriginalPower] = useState('');
    const [originalPowerUnit, setOriginalPowerUnit] = useState('hp');

    const [boost, setBoost] = useState('6'); // Default from screenshot
    const [boostUnit, setBoostUnit] = useState('psi');

    // Result
    const [boostedPower, setBoostedPower] = useState('');
    const [boostedPowerUnit, setBoostedPowerUnit] = useState('hp');

    // State for Collapsible
    const [isOpen, setIsOpen] = useState(true);

    const creators = [
        { name: "Dawid Siuda", role: "" },
    ];

    const reviewers = [
        { name: "Anna Szczepanek", role: "PhD" },
        { name: "Rijk de Wet", role: "" }
    ];

    useEffect(() => {
        calculateBoostedPower();
    }, [originalPower, originalPowerUnit, boost, boostUnit, boostedPowerUnit]);

    const calculateBoostedPower = () => {
        if (!originalPower || !boost) {
            // Don't clear result if just editing one field, but if empty... maybe clear?
            // Actually, if inputs are invalid, clear.
            if (originalPower === '' || boost === '') {
                setBoostedPower('');
                return;
            }
        }

        const P_orig = parseFloat(originalPower);
        const B_val = parseFloat(boost);

        if (isNaN(P_orig) || isNaN(B_val)) return;

        // Normalize inputs to Standard Units (HP and PSI)
        // Power: hp
        let P_hp = P_orig;
        if (originalPowerUnit === 'kW') P_hp = P_orig * 1.34102;
        // if (originalPowerUnit === 'hp') P_hp = P_orig;

        // Boost: psi
        let B_psi = B_val;
        if (boostUnit === 'bar') B_psi = B_val * 14.5038;
        if (boostUnit === 'kPa') B_psi = B_val * 0.145038;

        // Formula: P_new = P_old * (P_atm + B_psi) / P_atm
        const P_atm = 14.7; // Standard atmospheric pressure at sea level in psi

        const P_new_hp = P_hp * ((P_atm + B_psi) / P_atm);

        // Convert result to target unit
        let finalResult = P_new_hp;
        if (boostedPowerUnit === 'kW') finalResult = P_new_hp / 1.34102;

        setBoostedPower(finalResult.toLocaleString(undefined, { maximumFractionDigits: 1 }));
    };

    const articleContent = (
        <>
            <p>
                If you've ever wondered <strong>how much hp a supercharger adds</strong>, wonder no more; this <strong>boost horsepower calculator</strong> will help you calculate it in seconds!
            </p>
        </>
    );

    return (
        <CalculatorLayout
            title="Boost Horsepower Calculator"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "How does a supercharger work?",
                "How to use this boost horsepower calculator?",
                "Supercharge vs turbocharge",
                "Other tools that might be useful for you"
            ]}
            articleContent={articleContent}
            similarCalculators={32}
        >
            <div className="calculator-card boost-horsepower-page">

                <div className="collapsible-section no-border-top">
                    <div className="collapsible-header" onClick={() => setIsOpen(!isOpen)}>
                        <div className="header-left">
                            {isOpen ? <ChevronUp size={18} color="#436cfe" /> : <ChevronDown size={18} color="#436cfe" />}
                            <span>Horsepower boost</span>
                        </div>
                    </div>
                    {isOpen && (
                        <div className="collapsible-content">
                            {/* Current Engine Power */}
                            <div className="input-group">
                                <div className="label-row">
                                    <label>Current engine power <Info size={12} className="info-icon" /></label>
                                    <span className="more-options">...</span>
                                </div>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        className="calc-input"
                                        value={originalPower}
                                        onChange={(e) => setOriginalPower(e.target.value)}
                                    />
                                    <div className="unit-select-container">
                                        <select
                                            value={originalPowerUnit}
                                            onChange={(e) => setOriginalPowerUnit(e.target.value)}
                                            className="unit-select"
                                        >
                                            <option value="hp">hp(I)</option>
                                            <option value="kW">kW</option>
                                        </select>
                                        <ChevronDown size={14} className="unit-arrow" />
                                    </div>
                                </div>
                            </div>

                            {/* Boost Added */}
                            <div className="input-group">
                                <div className="label-row">
                                    <label>Boost added <Info size={12} className="info-icon" /></label>
                                    <span className="more-options">...</span>
                                </div>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        className="calc-input"
                                        value={boost}
                                        onChange={(e) => setBoost(e.target.value)}
                                    />
                                    <div className="unit-select-container">
                                        <select
                                            value={boostUnit}
                                            onChange={(e) => setBoostUnit(e.target.value)}
                                            className="unit-select"
                                        >
                                            <option value="psi">psi</option>
                                            <option value="bar">bar</option>
                                            <option value="kPa">kPa</option>
                                        </select>
                                        <ChevronDown size={14} className="unit-arrow" />
                                    </div>
                                </div>
                            </div>

                            {/* Boosted Engine Power */}
                            <div className="input-group">
                                <div className="label-row">
                                    <label>Boosted engine power <Info size={12} className="info-icon" /></label>
                                    <span className="more-options">...</span>
                                </div>
                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        className="calc-input"
                                        readOnly
                                        value={boostedPower}
                                        placeholder="Result"
                                    />
                                    <div className="unit-select-container">
                                        <select
                                            value={boostedPowerUnit}
                                            onChange={(e) => setBoostedPowerUnit(e.target.value)}
                                            className="unit-select"
                                        >
                                            <option value="hp">hp(I)</option>
                                            <option value="kW">kW</option>
                                        </select>
                                        <ChevronDown size={14} className="unit-arrow" />
                                    </div>
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
                            setOriginalPower('');
                            setBoost('6');
                            setBoostedPower('');
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

export default BoostHorsepowerCalculatorPage;
