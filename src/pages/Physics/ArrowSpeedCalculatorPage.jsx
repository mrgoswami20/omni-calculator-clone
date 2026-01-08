import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, MoreHorizontal, ChevronDown } from 'lucide-react';
import './ArrowSpeedCalculatorPage.css';

const ArrowSpeedCalculatorPage = () => {
    // Inputs
    const [iboRating, setIboRating] = useState('');
    const [iboUnit, setIboUnit] = useState('ft/s');

    const [drawLength, setDrawLength] = useState('');
    const [drawLengthUnit, setDrawLengthUnit] = useState('in');

    const [drawWeight, setDrawWeight] = useState('');
    const [drawWeightUnit, setDrawWeightUnit] = useState('lbs');

    const [arrowWeight, setArrowWeight] = useState('');
    const [arrowWeightUnit, setArrowWeightUnit] = useState('gr');

    const [stringWeight, setStringWeight] = useState('');
    const [stringWeightUnit, setStringWeightUnit] = useState('gr');

    // Outputs
    const [speed, setSpeed] = useState('');
    const [speedUnit, setSpeedUnit] = useState('ft/s');

    const [momentum, setMomentum] = useState('');
    const [momentumUnit, setMomentumUnit] = useState('N·s');

    const [ke, setKe] = useState('');
    const [keUnit, setKeUnit] = useState('J');

    // UI State
    const [showShareTooltip, setShowShareTooltip] = useState(false);

    // Constants for conversions
    const MPS_TO_FPS = 3.28084;
    const CM_TO_IN = 0.393701;
    const KG_TO_LBS = 2.20462;
    const G_TO_GR = 15.4324;
    const GR_TO_KG = 0.00006479891;
    const FPS_TO_MPS = 0.3048;

    useEffect(() => {
        calculateSpeed();
    }, [
        iboRating, iboUnit,
        drawLength, drawLengthUnit,
        drawWeight, drawWeightUnit,
        arrowWeight, arrowWeightUnit,
        stringWeight, stringWeightUnit,
        speedUnit, momentumUnit, keUnit
    ]);

    const calculateSpeed = () => {
        // 1. Convert everything to IBO standard units:
        // Speed: ft/s
        // Length: inches
        // Weight (Force): lbs
        // Weight (Mass): grains

        let iboVal = parseFloat(iboRating);
        let lenVal = parseFloat(drawLength);
        let dwVal = parseFloat(drawWeight);
        let awVal = parseFloat(arrowWeight);
        let swVal = parseFloat(stringWeight);

        if (isNaN(iboVal) || isNaN(lenVal) || isNaN(dwVal) || isNaN(awVal) || isNaN(swVal)) {
            setSpeed('');
            setMomentum('');
            setKe('');
            return;
        }

        // Conversions
        if (iboUnit === 'm/s') iboVal *= MPS_TO_FPS;
        if (drawLengthUnit === 'cm') lenVal *= CM_TO_IN;
        if (drawWeightUnit === 'kg') dwVal *= KG_TO_LBS;
        if (arrowWeightUnit === 'g') awVal *= G_TO_GR;
        if (stringWeightUnit === 'g') swVal *= G_TO_GR;

        // Formula:
        // v = IBO + (DL - 30)*10 - (AW - (DW*5))/3 - (SW/3)
        // Note: For Arrow Weight adjustment: 
        // "For every 3 grains ... above the draw weight multiplied by 5 ... subtract 1 ft/s"
        // Also: "For every 10 lbs of draw weight reduction... speed can decrease by 15-20 fps"??
        // Wait, standard IBO assumes 70 lbs.
        // If I draw 60 lbs, I am 10 lbs under 70.
        // The IBO test is at 70lbs, 350gr arrow (5 gr/lb).
        // If I shoot 60lbs, with 300gr arrow (5 gr/lb), is it slower?
        // Usually yes, simple physics: less energy stored.
        // A common rule of thumb: -2 fps per pound of draw weight reduction from 70 lbs.
        // Let's verify this rule.
        // Source [2] from search said "For every 10 lbs of draw weight reduction, arrow speed can decrease by 15-20 fps." => 1.5 to 2 fps/lb.
        // Let's use 2 fps/lb for now as a common approximation.

        // Revised Logic:
        // Base = IBO Speed (at 30", 70lbs, 350gr)

        // Adjustment 1: Draw Length
        // +/- 10 fps per inch from 30"
        const lenAdj = (lenVal - 30) * 10;

        // Adjustment 2: Draw Weight
        // If DW < 70, subtract 2 fps per lb.
        // Note: If DW > 70? Assume +2 fps per lb?
        const dwAdj = (dwVal - 70) * 2;

        // Adjustment 3: Arrow Weight
        // Standard is 5 grains per pound of DRAW WEIGHT.
        // No, standard is 350 grains at 70 lbs (which is 5gpp).
        // The speed loss comes from Excess weight.
        // "For every 3 grains ... above ... subtract 1 fps"
        // Above what? Above 5 grains per pound of ACTUAL draw weight?
        // Or above 350 grains?
        // Most sources say: "For every 3 grains of weight above 5 grains per pound of draw weight, subtract 1 fps."
        // Because if you are shooting 5gpp at 60lbs (300gr), and the bow is efficient, it should be close to IBO - (weight loss).
        // Wait, if I shoot 60lbs, 300gr arrow (5gpp), vs 70lbs, 350gr arrow (5gpp).
        // The only loss is the "Draw Weight" efficiency loss (~15-20 fps for 10 lbs).
        // So the "Arrow Weight" adjustment should be based on DEVIATION from 5gpp.
        // Excess Weight = awVal - (dwVal * 5).
        // If Excess Weight > 0: Subtract (Excess / 3) fps.
        // If Excess Weight < 0? (Light arrow). Usually dangerous (dry fire risk), but theoretically faster. Add (Deficit / 3)?
        // IBO usually implies min 5gpp. We will assume linear: -(Excess/3).
        const excessArrowWeight = awVal - (dwVal * 5);
        const awAdj = -(excessArrowWeight / 3);

        // Adjustment 4: String Weight
        // -1 fps for every 3 grains string weight.
        const swAdj = -(swVal / 3);

        let finalSpeedFps = iboVal + lenAdj + dwAdj + awAdj + swAdj;

        // Output conversion
        if (speedUnit === 'm/s') {
            finalSpeedFps /= MPS_TO_FPS;
        }

        // Format
        setSpeed(finalSpeedFps.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }));

        // --- Momentum & KE Calculation ---
        // Mass in kg
        const massKg = awVal * GR_TO_KG;
        // Velocity in m/s (always use base fps for calc)
        // Re-calculate fps without unit conversion if needed, but we have finalSpeedFps which might be converted if we did `finalSpeedFps /= MPS_TO_FPS` above.
        // Wait, I modified finalSpeedFps in place above. Reference `iboVal` lines etc?
        // Actually, let's capture the FPS value BEFORE conversion.

        // Refactoring to ensure we use correct FPS for physics calc
        let speedForPhysicsFps = iboVal + lenAdj + dwAdj + awAdj + swAdj;

        const velocityMps = speedForPhysicsFps * FPS_TO_MPS;

        // Momentum (p = mv) in N·s
        const momentumNs = massKg * velocityMps;

        // KE (E = 0.5mv^2) in J
        const keJ = 0.5 * massKg * (velocityMps * velocityMps);

        setMomentum(momentumNs.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        setKe(keJ.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setShowShareTooltip(true);
            setTimeout(() => setShowShareTooltip(false), 2000);
        } catch (err) { }
    };

    const handleClear = () => {
        setIboRating('');
        setDrawLength('');
        setDrawWeight('');
        setArrowWeight('');
        setStringWeight('');
        setSpeed('');
        setMomentum('');
        setKe('');
        // Do not reset units, keep user preference
    };

    const handleWheel = (e) => e.target.blur();

    const articleContent = (
        <div>
            <p>The <strong>Arrow Speed Calculator</strong> helps you estimate the actual speed of your arrow based on your bow's IBO rating and your specific setup parameters. It uses standard archery formulas to account for draw length, draw weight, and arrow weight variations.</p>
        </div>
    );

    return (
        <CalculatorLayout
            title="Arrow Speed Calculator"
            creators={[{ name: "Bagna Szyk" }]}
            reviewers={[{ name: "Steven Wooding" }]}
            tocItems={["Understanding bow speed IBO specification", "Archery calculator principles", "How fast does an arrow travel?", "FAQs"]}
            articleContent={articleContent}
        >
            <div className="arrow-speed-calculator-page">
                {/* Inputs */}
                <div className="section-card">
                    <div className="input-group">
                        <label className="input-label">Bow IBO rating <MoreHorizontal size={16} className="info-icon" /></label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="input-field"
                                value={iboRating}
                                onChange={(e) => setIboRating(e.target.value)}
                                onWheel={handleWheel}
                            />
                            <div className="unit-select-wrapper">
                                <select
                                    className="unit-select"
                                    value={iboUnit}
                                    onChange={(e) => setIboUnit(e.target.value)}
                                    style={{ color: '#4299e1' }}
                                >
                                    <option value="ft/s">ft/s</option>
                                    <option value="m/s">m/s</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Draw length of the bow <MoreHorizontal size={16} className="info-icon" /></label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="input-field"
                                value={drawLength}
                                onChange={(e) => setDrawLength(e.target.value)}
                                onWheel={handleWheel}
                            />
                            <div className="unit-select-wrapper">
                                <select
                                    className="unit-select"
                                    value={drawLengthUnit}
                                    onChange={(e) => setDrawLengthUnit(e.target.value)}
                                    style={{ color: '#4299e1' }}
                                >
                                    <option value="in">in</option>
                                    <option value="cm">cm</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Peak draw weight <MoreHorizontal size={16} className="info-icon" /></label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="input-field"
                                value={drawWeight}
                                onChange={(e) => setDrawWeight(e.target.value)}
                                onWheel={handleWheel}
                            />
                            <div className="unit-select-wrapper">
                                <select
                                    className="unit-select"
                                    value={drawWeightUnit}
                                    onChange={(e) => setDrawWeightUnit(e.target.value)}
                                    style={{ color: '#4299e1' }}
                                >
                                    <option value="lbs">lbs</option>
                                    <option value="kg">kg</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Arrow weight <MoreHorizontal size={16} className="info-icon" /></label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="input-field"
                                value={arrowWeight}
                                onChange={(e) => setArrowWeight(e.target.value)}
                                onWheel={handleWheel}
                            />
                            <div className="unit-select-wrapper">
                                <select
                                    className="unit-select"
                                    value={arrowWeightUnit}
                                    onChange={(e) => setArrowWeightUnit(e.target.value)}
                                    style={{ color: '#4299e1' }}
                                >
                                    <option value="gr">gr</option>
                                    <option value="g">g</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Additional weight on string <MoreHorizontal size={16} className="info-icon" /></label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="input-field"
                                value={stringWeight}
                                onChange={(e) => setStringWeight(e.target.value)}
                                onWheel={handleWheel}
                            />
                            <div className="unit-select-wrapper">
                                <select
                                    className="unit-select"
                                    value={stringWeightUnit}
                                    onChange={(e) => setStringWeightUnit(e.target.value)}
                                    style={{ color: '#4299e1' }}
                                >
                                    <option value="gr">gr</option>
                                    <option value="g">g</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="divider-custom"></div>

                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#2d3748', marginBottom: '16px' }}>Actual arrow speed</h3>
                    <p style={{ fontSize: '14px', color: '#4a5568', marginBottom: '16px' }}>Plus its momentum and kinetic energy</p>

                    <div className="input-group">
                        <label className="input-label">Speed <MoreHorizontal size={16} className="info-icon" /></label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                className="input-field result-field"
                                value={speed}
                                readOnly
                            />
                            <div className="unit-select-wrapper">
                                <select
                                    className="unit-select"
                                    value={speedUnit}
                                    onChange={(e) => setSpeedUnit(e.target.value)}
                                    style={{ color: '#2b6cb0' }}
                                >
                                    <option value="ft/s">ft/s</option>
                                    <option value="m/s">m/s</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Momentum <MoreHorizontal size={16} className="info-icon" /></label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                className="input-field result-field"
                                value={momentum}
                                readOnly
                            />
                            <div className="unit-select-wrapper">
                                <select
                                    className="unit-select"
                                    value={momentumUnit}
                                    onChange={(e) => setMomentumUnit(e.target.value)}
                                    style={{ color: '#2b6cb0' }}
                                >
                                    <option value="N·s">N·s</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Kinetic energy <MoreHorizontal size={16} className="info-icon" /></label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                className="input-field result-field"
                                value={ke}
                                readOnly
                            />
                            <div className="unit-select-wrapper">
                                <select
                                    className="unit-select"
                                    value={keUnit}
                                    onChange={(e) => setKeUnit(e.target.value)}
                                    style={{ color: '#2b6cb0' }}
                                >
                                    <option value="J">J</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="calc-actions-custom" style={{ marginTop: '24px' }}>
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

export default ArrowSpeedCalculatorPage;
