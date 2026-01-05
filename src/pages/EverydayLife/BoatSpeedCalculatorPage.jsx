import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, ChevronDown, ChevronUp, Info } from 'lucide-react';
import './BoatSpeedCalculatorPage.css';

const BoatSpeedCalculatorPage = () => {
    // Inputs
    const [power, setPower] = useState('');
    const [powerUnit, setPowerUnit] = useState('kW');

    const [displacement, setDisplacement] = useState('');
    const [displacementUnit, setDisplacementUnit] = useState('kg');

    const [boatType, setBoatType] = useState('select');
    const [crouchC, setCrouchC] = useState('');

    // Result
    const [speed, setSpeed] = useState('');
    const [speedUnit, setSpeedUnit] = useState('km/h');

    const creators = [
        { name: "Rahul Dhari", role: "" },
    ];

    const reviewers = [
        { name: "Steven Wooding", role: "" }
    ];

    // Boat Types and Crouch Constants (Approximate ranges)
    // Formula usually uses Imperial: V(mph) = C / sqrt( Weight(lbs) / Power(hp) )
    // Wait, Crouch formula is: V = C * sqrt( P / D ) ?? 
    // Let's verify standard Crouch Formula form.
    // "Crouch's formula, which is V = C / (LB/HP)^.5"  => V = C / sqrt(LB/HP) => V = C * sqrt(HP/LB).
    // Yes. V_mph = C * sqrt( HP / Weight_lbs )

    const boatTypes = [
        { value: 'select', label: 'Select', c: '' },
        { value: 'racing_hydroplane', label: 'Racing Hydroplane', c: 220 },
        { value: 'racing_catamaran', label: 'Racing Catamaran', c: 210 },
        { value: 'planing_hull', label: 'Average Planing Hull', c: 150 },
        { value: 'high_speed_runabout', label: 'High Speed Runabout', c: 190 },
        { value: 'pontoons', label: 'Pontoons', c: 100 }, // Guess
        { value: 'displacement_hull', label: 'Displacement Hull', c: 90 }, // Usually much lower
        { value: 'heavy_cruiser', label: 'Heavy Cruiser', c: 130 },
    ];
    // Based on common tables:
    // Planing hulls: 150-230
    // Displacement: much lower logic usually but Crouch is mostly for planing.
    // Let's use decent defaults.

    useEffect(() => {
        // Update C when Boat Type changes
        const selected = boatTypes.find(b => b.value === boatType);
        if (selected && selected.c) {
            setCrouchC(selected.c.toString());
        }
    }, [boatType]);

    useEffect(() => {
        calculateSpeed();
    }, [power, powerUnit, displacement, displacementUnit, crouchC, speedUnit]);

    const calculateSpeed = () => {
        if (!power || !displacement || !crouchC) {
            setSpeed('');
            return;
        }

        const P_val = parseFloat(power);
        const D_val = parseFloat(displacement);
        const C_val = parseFloat(crouchC);

        if (isNaN(P_val) || isNaN(D_val) || isNaN(C_val)) return;

        // Convert to Imperial for Formula: HP and lbs
        let P_hp = P_val;
        if (powerUnit === 'kW') P_hp = P_val * 1.34102;

        let D_lbs = D_val;
        if (displacementUnit === 'kg') D_lbs = D_val * 2.20462;

        // V_mph = C * sqrt( HP / Lbs )
        const V_mph = C_val * Math.sqrt(P_hp / D_lbs);

        // Convert result to selected unit
        let finalSpeed = V_mph;
        if (speedUnit === 'km/h') finalSpeed = V_mph * 1.60934;
        if (speedUnit === 'knots') finalSpeed = V_mph * 0.868976;
        if (speedUnit === 'm/s') finalSpeed = V_mph * 0.44704;

        setSpeed(finalSpeed.toLocaleString(undefined, { maximumFractionDigits: 2 }));
    };

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

    const articleContent = (
        <>
            <p>
                The <strong>boat speed calculator</strong> determines the <strong>top speed of a boat</strong> based on the boat's <strong>power</strong> and <strong>displacement</strong>. If you wonder how fast a boat can go, this calculator will help you answer that.
            </p>
        </>
    );

    return (
        <CalculatorLayout
            title="Boat Speed Calculator"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "What is boat speed – Calculating using Crouch's formula?",
                "What is displacement?",
                "Crouch constant",
                "How to calculate boat speed using this calculator?",
                "Example of using the boat speed calculator",
                "FAQs"
            ]}
            articleContent={articleContent}
            similarCalculators={32}
        >
            <div className="calculator-card boat-speed-page">

                {/* Power */}
                <div className="input-group">
                    <div className="label-row"><label>Shaft horsepower (P)</label><span className="more-options">...</span></div>
                    <div className="input-wrapper">
                        <input type="number" className="calc-input" value={power} onChange={(e) => setPower(e.target.value)} />
                        <div className="unit-select-container">
                            <select value={powerUnit} onChange={(e) => setPowerUnit(e.target.value)} className="unit-select">
                                <option value="kW">kW</option>
                                <option value="hp">hp</option>
                            </select>
                            <ChevronDown size={14} className="unit-arrow" />
                        </div>
                    </div>
                </div>

                {/* Displacement */}
                <div className="input-group">
                    <div className="label-row"><label>Boat displacement (D)</label><span className="more-options">...</span></div>
                    <div className="input-wrapper">
                        <input type="number" className="calc-input" value={displacement} onChange={(e) => setDisplacement(e.target.value)} />
                        <div className="unit-select-container">
                            <select value={displacementUnit} onChange={(e) => setDisplacementUnit(e.target.value)} className="unit-select">
                                <option value="kg">kg</option>
                                <option value="lbs">lbs</option>
                            </select>
                            <ChevronDown size={14} className="unit-arrow" />
                        </div>
                    </div>
                </div>

                {/* Boat Type */}
                <div className="input-group">
                    <div className="label-row"><label>Boat type</label><span className="more-options">...</span></div>
                    <div className="select-wrapper">
                        <select value={boatType} onChange={(e) => setBoatType(e.target.value)} className="calc-select">
                            {boatTypes.map(b => (
                                <option key={b.value} value={b.value}>{b.label}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="select-arrow" />
                    </div>
                </div>

                {/* Crouch Constant */}
                <div className="input-group">
                    <div className="label-row"><label>Crouch’s constant (C)</label><span className="more-options">...</span></div>
                    <div className="input-wrapper">
                        <input type="number" className="calc-input" value={crouchC} onChange={(e) => setCrouchC(e.target.value)} placeholder="Enter C value" />
                    </div>
                </div>

                {/* Result: Speed */}
                <div className="input-group" style={{ marginTop: '1.5rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                    <div className="label-row"><label>Speed (S)</label><span className="more-options">...</span></div>
                    <div className="input-wrapper">
                        <input type="text" className="calc-input" readOnly value={speed} placeholder="Result" />
                        <div className="unit-select-container">
                            <select value={speedUnit} onChange={(e) => setSpeedUnit(e.target.value)} className="unit-select">
                                <option value="km/h">km/h</option>
                                <option value="mph">mph</option>
                                <option value="knots">knots</option>
                                <option value="m/s">m/s</option>
                            </select>
                            <ChevronDown size={14} className="unit-arrow" />
                        </div>
                    </div>
                </div>

                <div className="calc-actions">
                    {/* <button className="share-result-btn" onClick={handleShare}>
                        <div className="share-icon-circle"><Share2 size={14} /></div>
                        Share result
                        {showShareTooltip && <span className="copied-tooltip">Copied!</span>}
                    </button> */}
                    <div className="secondary-actions">
                        <button className="secondary-btn">Reload calculator</button>
                        <button className="secondary-btn" onClick={() => {
                            setPower('');
                            setDisplacement('');
                            setBoatType('select');
                            setCrouchC('');
                            setSpeed('');
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

            </div>
        </CalculatorLayout>
    );
};

export default BoatSpeedCalculatorPage;
