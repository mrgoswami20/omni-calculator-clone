import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, MoreHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import './MomentumCalculatorPage.css';

const MomentumCalculatorPage = () => {
    // Inputs/State
    const [mass, setMass] = useState('');
    const [massUnit, setMassUnit] = useState('kg');

    const [velocity, setVelocity] = useState('');
    const [velocityUnit, setVelocityUnit] = useState('m/s');

    const [momentum, setMomentum] = useState('');
    const [momentumUnit, setMomentumUnit] = useState('kg·m/s');

    const [velX, setVelX] = useState('');
    const [velY, setVelY] = useState('');
    const [velZ, setVelZ] = useState('');

    const [momX, setMomX] = useState('');
    const [momY, setMomY] = useState('');
    const [momZ, setMomZ] = useState('');

    const [isMultiDimOpen, setIsMultiDimOpen] = useState(false);
    const [isMultiDimResultOpen, setIsMultiDimResultOpen] = useState(false);
    const [showShareTooltip, setShowShareTooltip] = useState(false);

    // Constants
    const KG_TO_LBS = 2.20462;
    const KG_TO_OZ = 35.274;
    const KG_TO_G = 1000;
    const KG_TO_TON = 0.001;
    const KG_TO_GRAIN = 15432.4;

    const MPS_TO_KMPH = 3.6;
    const MPS_TO_MPH = 2.23694;
    const MPS_TO_FPS = 3.28084;
    const MPS_TO_KNOT = 1.94384;

    const NS_TO_LB_FT_S = 7.23301;

    // Helpers
    const getMassInKg = (val, unit) => {
        let kg = parseFloat(val);
        if (isNaN(kg)) return 0;
        if (unit === 'lbs') kg /= KG_TO_LBS;
        else if (unit === 'oz') kg /= KG_TO_OZ;
        else if (unit === 'g') kg /= KG_TO_G;
        else if (unit === 'ton') kg /= KG_TO_TON;
        else if (unit === 'grain') kg /= KG_TO_GRAIN;
        return kg;
    };

    const getVelocityInMps = (val, unit) => {
        let mps = parseFloat(val);
        if (isNaN(mps)) return 0;
        if (unit === 'km/h') mps /= MPS_TO_KMPH;
        else if (unit === 'mph') mps /= MPS_TO_MPH;
        else if (unit === 'ft/s') mps /= MPS_TO_FPS;
        else if (unit === 'knot') mps /= MPS_TO_KNOT;
        return mps;
    };

    const convertVelocity = (valInMps, targetUnit) => {
        if (targetUnit === 'km/h') return valInMps * MPS_TO_KMPH;
        if (targetUnit === 'mph') return valInMps * MPS_TO_MPH;
        if (targetUnit === 'ft/s') return valInMps * MPS_TO_FPS;
        if (targetUnit === 'knot') return valInMps * MPS_TO_KNOT;
        return valInMps;
    };

    const getMomentumInNs = (val, unit) => {
        let ns = parseFloat(val);
        if (isNaN(ns)) return 0;
        if (unit === 'lb·ft/s') ns /= NS_TO_LB_FT_S;
        // kg·m/s and N·s are base units (1)
        return ns;
    };

    const convertMomentum = (valInNs, targetUnit) => {
        if (targetUnit === 'lb·ft/s') return valInNs * NS_TO_LB_FT_S;
        return valInNs;
    };

    const formatVal = (val, maxDecimals = 4) => {
        if (val === 0 && Math.abs(val) < 1e-9) return ''; // Cleaner empty state
        return val.toLocaleString(undefined, { maximumFractionDigits: maxDecimals, useGrouping: false });
    };

    // Calculation Logic
    const handleMassChange = (newMass) => {
        setMass(newMass);
        const mKg = getMassInKg(newMass, massUnit);
        if (mKg === 0) return;

        // Update Momentum Main
        const vMps = getVelocityInMps(velocity, velocityUnit);
        if (velocity !== '') {
            const pNs = mKg * vMps;
            setMomentum(formatVal(convertMomentum(pNs, momentumUnit)));
        }

        // Update Momentum Components
        if (velX !== '') setMomX(formatVal(convertMomentum(mKg * getVelocityInMps(velX, velocityUnit), momentumUnit)));
        if (velY !== '') setMomY(formatVal(convertMomentum(mKg * getVelocityInMps(velY, velocityUnit), momentumUnit)));
        if (velZ !== '') setMomZ(formatVal(convertMomentum(mKg * getVelocityInMps(velZ, velocityUnit), momentumUnit)));
    };

    const handleVelocityChange = (newVel) => {
        setVelocity(newVel);
        const mKg = getMassInKg(mass, massUnit);
        const vMps = getVelocityInMps(newVel, velocityUnit);

        // Update Momentum Main
        if (mass !== '') {
            const pNs = mKg * vMps;
            setMomentum(formatVal(convertMomentum(pNs, momentumUnit)));
        }
    };

    const handleMomentumChange = (newMom) => {
        setMomentum(newMom);
        const mKg = getMassInKg(mass, massUnit);
        const pNs = getMomentumInNs(newMom, momentumUnit);

        // Update Velocity Main
        if (mass !== '' && mKg !== 0) {
            const vMps = pNs / mKg;
            setVelocity(formatVal(convertVelocity(vMps, velocityUnit)));
        }
    };

    const handleVelComponentChange = (val, axis) => {
        if (axis === 'x') setVelX(val);
        if (axis === 'y') setVelY(val);
        if (axis === 'z') setVelZ(val);

        const vx = axis === 'x' ? val : velX;
        const vy = axis === 'y' ? val : velY;
        const vz = axis === 'z' ? val : velZ;

        const vxMps = getVelocityInMps(vx, velocityUnit);
        const vyMps = getVelocityInMps(vy, velocityUnit);
        const vzMps = getVelocityInMps(vz, velocityUnit);

        const mKg = getMassInKg(mass, massUnit);
        if (mass !== '') {
            if (axis === 'x') setMomX(formatVal(convertMomentum(mKg * vxMps, momentumUnit)));
            if (axis === 'y') setMomY(formatVal(convertMomentum(mKg * vyMps, momentumUnit)));
            if (axis === 'z') setMomZ(formatVal(convertMomentum(mKg * vzMps, momentumUnit)));
        }

        const vMagMps = Math.sqrt(vxMps * vxMps + vyMps * vyMps + vzMps * vzMps);
        setVelocity(formatVal(convertVelocity(vMagMps, velocityUnit)));

        if (mass !== '') {
            const pMagNs = mKg * vMagMps;
            setMomentum(formatVal(convertMomentum(pMagNs, momentumUnit)));
        }
    };

    const handleMomComponentChange = (val, axis) => {
        if (axis === 'x') setMomX(val);
        if (axis === 'y') setMomY(val);
        if (axis === 'z') setMomZ(val);

        const px = axis === 'x' ? val : momX;
        const py = axis === 'y' ? val : momY;
        const pz = axis === 'z' ? val : momZ;

        const pxNs = getMomentumInNs(px, momentumUnit);
        const pyNs = getMomentumInNs(py, momentumUnit);
        const pzNs = getMomentumInNs(pz, momentumUnit);

        const mKg = getMassInKg(mass, massUnit);

        if (mass !== '' && mKg !== 0) {
            const vCompMps = (axis === 'x' ? pxNs : axis === 'y' ? pyNs : pzNs) / mKg;
            const vCompVal = formatVal(convertVelocity(vCompMps, velocityUnit));

            if (axis === 'x') setVelX(vCompVal);
            if (axis === 'y') setVelY(vCompVal);
            if (axis === 'z') setVelZ(vCompVal);

            const vxMps = axis === 'x' ? vCompMps : getVelocityInMps(velX, velocityUnit);
            const vyMps = axis === 'y' ? vCompMps : getVelocityInMps(velY, velocityUnit);
            const vzMps = axis === 'z' ? vCompMps : getVelocityInMps(velZ, velocityUnit);

            const vMagMps = Math.sqrt(vxMps * vxMps + vyMps * vyMps + vzMps * vzMps);
            setVelocity(formatVal(convertVelocity(vMagMps, velocityUnit)));

            const pMagNs = Math.sqrt(pxNs * pxNs + pyNs * pyNs + pzNs * pzNs);
            setMomentum(formatVal(convertMomentum(pMagNs, momentumUnit)));
        }
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setShowShareTooltip(true);
            setTimeout(() => setShowShareTooltip(false), 2000);
        } catch (err) { }
    };

    const handleClear = () => {
        setMass('');
        setVelocity('');
        setVelX('');
        setVelY('');
        setVelZ('');
        setMomentum('');
        setMomX('');
        setMomY('');
        setMomZ('');
    };

    const articleContent = (
        <div>
            <p>
                The <strong>Momentum Calculator</strong> is a simple tool designed to find the momentum of an object.
                Physics defines momentum as the product of mass and velocity. It is a vector quantity, possessing a magnitude and a direction.
            </p>
            <h3>Momentum Formula</h3>
            <p>The equation for linear momentum is:</p>
            <p className="math-formula">p = m × v</p>
            <p>Where:</p>
            <ul>
                <li><strong>p</strong> is the momentum</li>
                <li><strong>m</strong> is the mass of the moving object</li>
                <li><strong>v</strong> is the velocity of the object</li>
            </ul>
        </div>
    );

    return (
        <CalculatorLayout
            title="Momentum Calculator"
            creators={[{ name: "Omni Team" }]}
            reviewers={[]}
            tocItems={["What is momentum?", "Momentum formula", "How to use this calculator"]}
            articleContent={articleContent}
        >
            <div className="momentum-calculator-page">
                <div className="section-card">
                    <h3 className="section-title">Momentum in one dimension</h3>
                    {/* Mass Input */}
                    <div className="input-group">
                        <label className="input-label">Mass (m)<MoreHorizontal size={16} className="info-icon" /></label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="input-field"
                                value={mass}
                                onChange={(e) => handleMassChange(e.target.value)}
                                placeholder="Enter mass"
                            />
                            <div className="unit-select-wrapper">
                                <select className="unit-select" value={massUnit} onChange={(e) => setMassUnit(e.target.value)}>
                                    <option value="kg">kg</option>
                                    <option value="lbs">lbs</option>
                                    <option value="g">g</option>
                                    <option value="oz">oz</option>
                                    <option value="ton">ton</option>
                                    <option value="grain">grain</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Velocity Input */}
                    <div className="input-group">
                        <label className="input-label">Velocity (v)<MoreHorizontal size={16} className="info-icon" /></label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="input-field"
                                value={velocity}
                                onChange={(e) => handleVelocityChange(e.target.value)}
                                placeholder="Enter velocity"
                            />
                            <div className="unit-select-wrapper">
                                <select className="unit-select" value={velocityUnit} onChange={(e) => setVelocityUnit(e.target.value)}>
                                    <option value="m/s">m/s</option>
                                    <option value="km/h">km/h</option>
                                    <option value="mph">mph</option>
                                    <option value="ft/s">ft/s</option>
                                    <option value="knot">kn</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Momentum Output (Also Input now) */}
                    <div className="input-group result-group">
                        <label className="input-label">Momentum (p)<MoreHorizontal size={16} className="info-icon" /></label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="input-field result-field"
                                value={momentum}
                                onChange={(e) => handleMomentumChange(e.target.value)}
                                placeholder="Result"
                            />
                            <div className="unit-select-wrapper">
                                <select className="unit-select" value={momentumUnit} onChange={(e) => setMomentumUnit(e.target.value)}>
                                    <option value="kg·m/s">kg·m/s</option>
                                    <option value="N·s">N·s</option>
                                    <option value="lb·ft/s">lb·ft/s</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Collapsible: Mass and velocity in 2D/3D */}
                <div className="section-card collapse-card">
                    <div className="collapse-header" onClick={() => setIsMultiDimOpen(!isMultiDimOpen)}>
                        <span>Mass and velocity in two or three dimensions</span>
                        {isMultiDimOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>

                    {isMultiDimOpen && (
                        <div className="collapse-content">
                            <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '16px' }}>
                                Leave the <strong>velocity in z-direction as zero</strong> if you want to consider a problem of <strong>two-dimensional vectors</strong>.
                            </p>

                            {/* Mass Input (Synced) */}
                            <div className="input-group">
                                <label className="input-label">Mass of the body <MoreHorizontal size={16} className="info-icon" /></label>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        className="input-field"
                                        value={mass}
                                        onChange={(e) => handleMassChange(e.target.value)}
                                        placeholder="Enter mass"
                                    />
                                    <div className="unit-select-wrapper">
                                        <select className="unit-select" value={massUnit} onChange={(e) => setMassUnit(e.target.value)}>
                                            <option value="kg">kg</option>
                                            <option value="lbs">lbs</option>
                                            <option value="g">g</option>
                                            <option value="oz">oz</option>
                                            <option value="ton">ton</option>
                                            <option value="grain">grain</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Velocity X */}
                            <div className="input-group">
                                <label className="input-label">Velocity in x-direction <MoreHorizontal size={16} className="info-icon" /></label>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        className="input-field"
                                        value={velX}
                                        onChange={(e) => handleVelComponentChange(e.target.value, 'x')}
                                    />
                                    <div className="unit-select-wrapper">
                                        <select className="unit-select" value={velocityUnit} onChange={(e) => setVelocityUnit(e.target.value)}>
                                            <option value="m/s">m/s</option>
                                            <option value="km/h">km/h</option>
                                            <option value="mph">mph</option>
                                            <option value="ft/s">ft/s</option>
                                            <option value="knot">kn</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Velocity Y */}
                            <div className="input-group">
                                <label className="input-label">Velocity in y-direction <MoreHorizontal size={16} className="info-icon" /></label>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        className="input-field"
                                        value={velY}
                                        onChange={(e) => handleVelComponentChange(e.target.value, 'y')}
                                    />
                                    <div className="unit-select-wrapper">
                                        <span className="unit-static" style={{ marginRight: '12px' }}>{velocityUnit}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Velocity Z */}
                            <div className="input-group">
                                <label className="input-label">Velocity in z-direction <MoreHorizontal size={16} className="info-icon" /></label>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        className="input-field"
                                        value={velZ}
                                        onChange={(e) => handleVelComponentChange(e.target.value, 'z')}
                                    />
                                    <div className="unit-select-wrapper">
                                        <span className="unit-static" style={{ marginRight: '12px' }}>{velocityUnit}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Velocity Magnitude */}
                            <div className="input-group">
                                <label className="input-label">Velocity magnitude <MoreHorizontal size={16} className="info-icon" /></label>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        className="input-field result-field"
                                        value={velocity}
                                        onChange={(e) => handleVelocityChange(e.target.value)}
                                    />
                                    <div className="unit-select-wrapper">
                                        <span className="unit-static" style={{ marginRight: '12px' }}>{velocityUnit}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Collapsible: Momentum in 2D/3D */}
                <div className="section-card collapse-card">
                    <div className="collapse-header" onClick={() => setIsMultiDimResultOpen(!isMultiDimResultOpen)}>
                        <span>Momentum in two or three dimensions</span>
                        {isMultiDimResultOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>

                    {isMultiDimResultOpen && (
                        <div className="collapse-content">
                            <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '16px' }}>
                                Leave the <strong>momentum in z-direction as zero</strong> if you want to consider a problem of <strong>two-dimensional vectors</strong>.
                            </p>

                            <div className="input-group">
                                <label className="input-label">Momentum in x-direction</label>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        className="input-field result-field"
                                        value={momX}
                                        onChange={(e) => handleMomComponentChange(e.target.value, 'x')}
                                    />
                                    <div className="unit-select-wrapper">
                                        <select className="unit-select" value={momentumUnit} onChange={(e) => setMomentumUnit(e.target.value)}>
                                            <option value="kg·m/s">kg·m/s</option>
                                            <option value="N·s">N·s</option>
                                            <option value="lb·ft/s">lb·ft/s</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="input-group">
                                <label className="input-label">Momentum in y-direction</label>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        className="input-field result-field"
                                        value={momY}
                                        onChange={(e) => handleMomComponentChange(e.target.value, 'y')}
                                    />
                                    <div className="unit-select-wrapper">
                                        <span className="unit-static" style={{ marginRight: '12px' }}>{momentumUnit}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="input-group">
                                <label className="input-label">Momentum in z-direction</label>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        className="input-field result-field"
                                        value={momZ}
                                        onChange={(e) => handleMomComponentChange(e.target.value, 'z')}
                                    />
                                    <div className="unit-select-wrapper">
                                        <span className="unit-static" style={{ marginRight: '12px' }}>{momentumUnit}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Momentum Magnitude */}
                            <div className="input-group">
                                <label className="input-label">Momentum magnitude</label>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        className="input-field result-field"
                                        value={momentum}
                                        onChange={(e) => handleMomentumChange(e.target.value)}
                                    />
                                    <div className="unit-select-wrapper">
                                        <span className="unit-static" style={{ marginRight: '12px' }}>{momentumUnit}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="section-card">
                    <div className="calc-actions-custom">
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

export default MomentumCalculatorPage;
