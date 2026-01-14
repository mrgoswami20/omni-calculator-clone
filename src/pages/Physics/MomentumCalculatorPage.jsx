import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, MoreHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import './MomentumCalculatorPage.css';

const MomentumCalculatorPage = () => {
    // --- Constants ---
    const MASS_UNITS = {
        'kg': 1,
        'mg': 1e-6,
        'g': 1e-3,
        't': 1000,
        'oz': 0.0283495,
        'lb': 0.453592,
        'us ton': 907.185,
        'long ton': 1016.05
    };

    const VELOCITY_UNITS = {
        'm/s': 1,
        'km/h': 1 / 3.6,
        'ft/s': 0.3048,
        'mph': 0.44704,
        'ft/min': 0.00508
    };

    const MOMENTUM_UNITS = {
        'kg·m/s': 1,
        'mN-s': 1e-3,
        'N-s': 1,
        'kN-s': 1000,
        'MN-s': 1e6,
        't-km/h': 277.778, // 1000 kg * (1/3.6) m/s
        'lb·ft/s': 0.138255, // 0.453592 kg * 0.3048 m/s
        't-mph': 447.04,  // 1000 kg * 0.44704 m/s (Metric Ton-mile/hour)
        'US t-mph': 405.548, // 907.185 kg * 0.44704 m/s
        'long t-mph': 454.214 // 1016.05 kg * 0.44704 m/s
    };

    // --- State ---
    // Section 1: 1D
    const [mass1D, setMass1D] = useState({ value: '', unit: 'kg' });
    const [vel1D, setVel1D] = useState({ value: '', unit: 'm/s' });
    const [mom1D, setMom1D] = useState({ value: '', unit: 'kg·m/s' });

    // Section 2: Mass & Velocity 2D/3D (Mass is synced with 1D)
    const [velX, setVelX] = useState({ value: '', unit: 'm/s' });
    const [velY, setVelY] = useState({ value: '', unit: 'm/s' });
    const [velZ, setVelZ] = useState({ value: '', unit: 'm/s' });
    const [velMag, setVelMag] = useState({ value: '', unit: 'm/s' }); // Linked to 1D Vel

    // Section 3: Momentum 2D/3D
    const [momX, setMomX] = useState({ value: '', unit: 'kg·m/s' });
    const [momY, setMomY] = useState({ value: '', unit: 'kg·m/s' });
    const [momZ, setMomZ] = useState({ value: '', unit: 'kg·m/s' });
    const [momMag, setMomMag] = useState({ value: '', unit: 'kg·m/s' }); // Linked to 1D Mom

    const [isSec2Open, setIsSec2Open] = useState(true);
    const [isSec3Open, setIsSec3Open] = useState(true);
    const [showShareTooltip, setShowShareTooltip] = useState(false);

    // --- Helpers ---
    const toBase = (val, unit, factors) => {
        const v = parseFloat(val);
        if (isNaN(v)) return 0;
        return v * (factors[unit] || 1);
    };

    const fromBase = (val, targetUnit, factors) => {
        if (val === 0 && Math.abs(val) < 1e-9) return 0;
        return val / (factors[targetUnit] || 1);
    };

    const format = (val) => {
        if (val === 0 || isNaN(val)) return '';
        // Avoid scientific notation for simple numbers user might type, but handle small/large
        if (Math.abs(val) < 1e-6 || Math.abs(val) > 1e6) return val.toExponential(4);
        return parseFloat(val.toFixed(4)).toString();
    };

    // --- Universal Update Handler ---
    // This is the core logic. Triggers re-calculation of everything based on what changed.
    // changedType: 'mass', 'vel1D', 'mom1D', 'velComp', 'velMag', 'momComp', 'momMag'
    const updateCalculations = (changedType, newValue, newUnit, axis = null) => {
        // 1. Get current base values
        let mBase = toBase(mass1D.value, mass1D.unit, MASS_UNITS);

        let vxBase = toBase(velX.value, velX.unit, VELOCITY_UNITS);
        let vyBase = toBase(velY.value, velY.unit, VELOCITY_UNITS);
        let vzBase = toBase(velZ.value, velZ.unit, VELOCITY_UNITS);

        let pxBase = toBase(momX.value, momX.unit, MOMENTUM_UNITS);
        let pyBase = toBase(momY.value, momY.unit, MOMENTUM_UNITS);
        let pzBase = toBase(momZ.value, momZ.unit, MOMENTUM_UNITS);

        // 2. Update the specific input that changed and recalculate base values
        if (changedType === 'mass') {
            mBase = toBase(newValue, newUnit, MASS_UNITS);
            setMass1D({ value: newValue, unit: newUnit });

            // If mass changes, update Momentums based on current Velocities
            if (mBase !== 0) {
                pxBase = mBase * vxBase;
                pyBase = mBase * vyBase;
                pzBase = mBase * vzBase;
            }
        }
        else if (changedType === 'vel1D' || changedType === 'velMag') {
            const vMagBase = toBase(newValue, newUnit, VELOCITY_UNITS);
            setVel1D({ value: newValue, unit: newUnit });
            setVelMag({ value: newValue, unit: newUnit }); // Sync 1D and Mag inputs

            // If we only change magnitude, we assume scaling existing components or default to X direction if zero
            const currentMag = Math.sqrt(vxBase * vxBase + vyBase * vyBase + vzBase * vzBase);
            if (currentMag === 0) {
                vxBase = vMagBase;
                vyBase = 0;
                vzBase = 0;
            } else {
                const ratio = vMagBase / currentMag;
                vxBase *= ratio;
                vyBase *= ratio;
                vzBase *= ratio;
            }

            if (mBase !== 0) {
                pxBase = mBase * vxBase;
                pyBase = mBase * vyBase;
                pzBase = mBase * vzBase;
            }
        }
        else if (changedType === 'mom1D' || changedType === 'momMag') {
            const pMagBase = toBase(newValue, newUnit, MOMENTUM_UNITS);
            setMom1D({ value: newValue, unit: newUnit });
            setMomMag({ value: newValue, unit: newUnit });

            // Similar scaling logic for Momentum
            const currentMag = Math.sqrt(pxBase * pxBase + pyBase * pyBase + pzBase * pzBase);
            if (currentMag === 0) {
                pxBase = pMagBase;
                pyBase = 0;
                pzBase = 0;
            } else {
                const ratio = pMagBase / currentMag;
                pxBase *= ratio;
                pyBase *= ratio;
                pzBase *= ratio;
            }

            if (mBase !== 0) {
                vxBase = pxBase / mBase;
                vyBase = pyBase / mBase;
                vzBase = pzBase / mBase;
            }
        }
        else if (changedType === 'velComp') {
            const valBase = toBase(newValue, newUnit, VELOCITY_UNITS);
            if (axis === 'x') { vxBase = valBase; setVelX({ value: newValue, unit: newUnit }); }
            if (axis === 'y') { vyBase = valBase; setVelY({ value: newValue, unit: newUnit }); }
            if (axis === 'z') { vzBase = valBase; setVelZ({ value: newValue, unit: newUnit }); }

            if (mBase !== 0) {
                if (axis === 'x') pxBase = mBase * vxBase;
                if (axis === 'y') pyBase = mBase * vyBase;
                if (axis === 'z') pzBase = mBase * vzBase;
            }
        }
        else if (changedType === 'momComp') {
            const valBase = toBase(newValue, newUnit, MOMENTUM_UNITS);
            if (axis === 'x') { pxBase = valBase; setMomX({ value: newValue, unit: newUnit }); }
            if (axis === 'y') { pyBase = valBase; setMomY({ value: newValue, unit: newUnit }); }
            if (axis === 'z') { pzBase = valBase; setMomZ({ value: newValue, unit: newUnit }); }

            if (mBase !== 0) {
                if (axis === 'x') vxBase = pxBase / mBase;
                if (axis === 'y') vyBase = pyBase / mBase;
                if (axis === 'z') vzBase = pzBase / mBase;
            }
        }

        // 3. Propagate results to all other fields (updating values in their current units)

        // Update Derived Velocities (if not the source of change)
        if (changedType !== 'velComp') {
            setVelX(prev => ({ ...prev, value: format(fromBase(vxBase, prev.unit, VELOCITY_UNITS)) }));
            setVelY(prev => ({ ...prev, value: format(fromBase(vyBase, prev.unit, VELOCITY_UNITS)) }));
            setVelZ(prev => ({ ...prev, value: format(fromBase(vzBase, prev.unit, VELOCITY_UNITS)) }));
        }

        // Update Derived Momentums (if not the source of change)
        if (changedType !== 'momComp') {
            setMomX(prev => ({ ...prev, value: format(fromBase(pxBase, prev.unit, MOMENTUM_UNITS)) }));
            setMomY(prev => ({ ...prev, value: format(fromBase(pyBase, prev.unit, MOMENTUM_UNITS)) }));
            setMomZ(prev => ({ ...prev, value: format(fromBase(pzBase, prev.unit, MOMENTUM_UNITS)) }));
        }

        // Update Magnitudes
        const newVelMagBase = Math.sqrt(vxBase * vxBase + vyBase * vyBase + vzBase * vzBase);
        const newMomMagBase = Math.sqrt(pxBase * pxBase + pyBase * pyBase + pzBase * pzBase);

        if (changedType !== 'vel1D' && changedType !== 'velMag') {
            const vMagVal = format(fromBase(newVelMagBase, vel1D.unit, VELOCITY_UNITS)); // careful to use correct unit state
            setVel1D(prev => ({ ...prev, value: vMagVal })); // Sync
            setVelMag(prev => ({ ...prev, value: vMagVal }));
        }

        if (changedType !== 'mom1D' && changedType !== 'momMag') {
            const pMagVal = format(fromBase(newMomMagBase, mom1D.unit, MOMENTUM_UNITS));
            setMom1D(prev => ({ ...prev, value: pMagVal }));
            setMomMag(prev => ({ ...prev, value: pMagVal }));
        }
    };

    // --- Unit Change Handlers ---
    // These just convert the current displayed value to the new unit, keeping the base physics value same-ish or just swapping unit?
    // User expectation: usually converting the value. e.g. 1 kg -> 1000 g.
    const handleUnitChange = (setter, state, newUnit, type, factors) => {
        const base = toBase(state.value, state.unit, factors);
        const newVal = format(fromBase(base, newUnit, factors));
        setter({ value: newVal, unit: newUnit });
        // No physics Recalculation needed, just display conversion
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setShowShareTooltip(true);
            setTimeout(() => setShowShareTooltip(false), 2000);
        } catch (err) { }
    };

    const handleClear = () => {
        const empty = { value: '', unit: '' }; // preserve units? better to just clear values
        setMass1D(prev => ({ ...prev, value: '' }));
        setVel1D(prev => ({ ...prev, value: '' }));
        setMom1D(prev => ({ ...prev, value: '' }));

        setVelX(prev => ({ ...prev, value: '' }));
        setVelY(prev => ({ ...prev, value: '' }));
        setVelZ(prev => ({ ...prev, value: '' }));
        setVelMag(prev => ({ ...prev, value: '' }));

        setMomX(prev => ({ ...prev, value: '' }));
        setMomY(prev => ({ ...prev, value: '' }));
        setMomZ(prev => ({ ...prev, value: '' }));
        setMomMag(prev => ({ ...prev, value: '' }));
    };

    const articleContent = (
        <div>
            <p>
                The <strong>Momentum Calculator</strong> is a tool designed to find the momentum of an object.
                Physics defines momentum as the product of mass and velocity. It is a vector quantity, possessing a magnitude and a direction.
            </p>
            <h3>Momentum Formula</h3>
            <p>The equation for linear momentum is:</p>
            <p className="math-formula">p = m × v</p>
        </div>
    );

    return (
        <CalculatorLayout
            title="Momentum Calculator"
            creators={[{ name: "Omni Team" }]}
            reviewers={[]}
            tocItems={["Momentum in one dimension", "Mass and velocity in two or three dimensions", "Momentum in two or three dimensions"]}
            articleContent={articleContent}
        >
            <div className="momentum-calculator-page">
                {/* Section 1: Momentum in one dimension */}
                <div className="section-card">
                    <h3 className="section-title">Momentum in one dimension</h3>

                    {/* Mass */}
                    <div className="input-group">
                        <label className="input-label">Mass (m)<MoreHorizontal size={16} className="info-icon" /></label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="input-field"
                                value={mass1D.value}
                                onChange={(e) => updateCalculations('mass', e.target.value, mass1D.unit)}
                                placeholder="Enter mass"
                             onWheel={(e) => e.target.blur()} />
                            <div className="unit-select-wrapper">
                                <select
                                    className="unit-select"
                                    value={mass1D.unit}
                                    onChange={(e) => handleUnitChange(setMass1D, mass1D, e.target.value, 'mass', MASS_UNITS)}
                                >
                                    {Object.keys(MASS_UNITS).map(u => <option key={u} value={u}>{u}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Velocity */}
                    <div className="input-group">
                        <label className="input-label">Velocity (v)<MoreHorizontal size={16} className="info-icon" /></label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="input-field"
                                value={vel1D.value}
                                onChange={(e) => updateCalculations('vel1D', e.target.value, vel1D.unit)}
                                placeholder="Enter velocity"
                             onWheel={(e) => e.target.blur()} />
                            <div className="unit-select-wrapper">
                                <select
                                    className="unit-select"
                                    value={vel1D.unit}
                                    onChange={(e) => handleUnitChange(setVel1D, vel1D, e.target.value, 'vel1D', VELOCITY_UNITS)}
                                >
                                    {Object.keys(VELOCITY_UNITS).map(u => <option key={u} value={u}>{u}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Momentum */}
                    <div className="input-group result-group">
                        <label className="input-label">Momentum (p)<MoreHorizontal size={16} className="info-icon" /></label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="input-field result-field"
                                value={mom1D.value}
                                onChange={(e) => updateCalculations('mom1D', e.target.value, mom1D.unit)}
                                placeholder="Result"
                             onWheel={(e) => e.target.blur()} />
                            <div className="unit-select-wrapper">
                                <select
                                    className="unit-select"
                                    value={mom1D.unit}
                                    onChange={(e) => handleUnitChange(setMom1D, mom1D, e.target.value, 'mom1D', MOMENTUM_UNITS)}
                                >
                                    {Object.keys(MOMENTUM_UNITS).map(u => <option key={u} value={u}>{u}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="divider-custom"></div>

                <div className="collapse-card">
                    <div className="collapse-header" onClick={() => setIsSec2Open(!isSec2Open)}>
                        <span>Mass and velocity in two or three dimensions</span>
                        {isSec2Open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                    {isSec2Open && (
                        <div className="collapse-content">
                            <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '16px' }}>
                                Leave the <strong>velocity in z-direction as zero</strong> if you want to consider a problem of <strong>two-dimensional vectors</strong>.
                            </p>

                            {/* Mass (Synced) */}
                            <div className="input-group">
                                <label className="input-label">Mass of the body</label>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        className="input-field"
                                        value={mass1D.value}
                                        onChange={(e) => updateCalculations('mass', e.target.value, mass1D.unit)}
                                     onWheel={(e) => e.target.blur()} />
                                    <div className="unit-select-wrapper">
                                        <select
                                            className="unit-select"
                                            value={mass1D.unit}
                                            onChange={(e) => handleUnitChange(setMass1D, mass1D, e.target.value, 'mass', MASS_UNITS)}
                                        >
                                            {Object.keys(MASS_UNITS).map(u => <option key={u} value={u}>{u}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Velocity X */}
                            <div className="input-group">
                                <label className="input-label">Velocity in x-direction</label>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        className="input-field"
                                        value={velX.value}
                                        onChange={(e) => updateCalculations('velComp', e.target.value, velX.unit, 'x')}
                                     onWheel={(e) => e.target.blur()} />
                                    <div className="unit-select-wrapper">
                                        <select className="unit-select" value={velX.unit} onChange={(e) => handleUnitChange(setVelX, velX, e.target.value, 'velX', VELOCITY_UNITS)}>
                                            {Object.keys(VELOCITY_UNITS).map(u => <option key={u} value={u}>{u}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Velocity Y */}
                            <div className="input-group">
                                <label className="input-label">Velocity in y-direction</label>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        className="input-field"
                                        value={velY.value}
                                        onChange={(e) => updateCalculations('velComp', e.target.value, velY.unit, 'y')}
                                     onWheel={(e) => e.target.blur()} />
                                    <div className="unit-select-wrapper">
                                        <select className="unit-select" value={velY.unit} onChange={(e) => handleUnitChange(setVelY, velY, e.target.value, 'velY', VELOCITY_UNITS)}>
                                            {Object.keys(VELOCITY_UNITS).map(u => <option key={u} value={u}>{u}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Velocity Z */}
                            <div className="input-group">
                                <label className="input-label">Velocity in z-direction</label>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        className="input-field"
                                        value={velZ.value}
                                        onChange={(e) => updateCalculations('velComp', e.target.value, velZ.unit, 'z')}
                                     onWheel={(e) => e.target.blur()} />
                                    <div className="unit-select-wrapper">
                                        <select className="unit-select" value={velZ.unit} onChange={(e) => handleUnitChange(setVelZ, velZ, e.target.value, 'velZ', VELOCITY_UNITS)}>
                                            {Object.keys(VELOCITY_UNITS).map(u => <option key={u} value={u}>{u}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Velocity Magnitude */}
                            <div className="input-group">
                                <label className="input-label">Velocity magnitude</label>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        className="input-field"
                                        value={velMag.value}
                                        onChange={(e) => updateCalculations('velMag', e.target.value, velMag.unit)}
                                     onWheel={(e) => e.target.blur()} />
                                    <div className="unit-select-wrapper">
                                        <select className="unit-select" value={velMag.unit} onChange={(e) => handleUnitChange(setVelMag, velMag, e.target.value, 'velMag', VELOCITY_UNITS)}>
                                            {Object.keys(VELOCITY_UNITS).map(u => <option key={u} value={u}>{u}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="divider-custom"></div>
                </div>

                {/* Section 3: Momentum in 2D/3D */}
                <div className="collapse-card">
                    <div className="collapse-header" onClick={() => setIsSec3Open(!isSec3Open)}>
                        <span>Momentum in two or three dimensions</span>
                        {isSec3Open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                    {isSec3Open && (
                        <div className="collapse-content">
                            <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '16px' }}>
                                Leave the <strong>momentum in z-direction as zero</strong> if you want to consider a problem of <strong>two-dimensional vectors</strong>.
                            </p>

                            {/* Momentum X */}
                            <div className="input-group">
                                <label className="input-label">Momentum in x-direction</label>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        className="input-field"
                                        value={momX.value}
                                        onChange={(e) => updateCalculations('momComp', e.target.value, momX.unit, 'x')}
                                     onWheel={(e) => e.target.blur()} />
                                    <div className="unit-select-wrapper">
                                        <select className="unit-select" value={momX.unit} onChange={(e) => handleUnitChange(setMomX, momX, e.target.value, 'momX', MOMENTUM_UNITS)}>
                                            {Object.keys(MOMENTUM_UNITS).map(u => <option key={u} value={u}>{u}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Momentum Y */}
                            <div className="input-group">
                                <label className="input-label">Momentum in y-direction</label>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        className="input-field"
                                        value={momY.value}
                                        onChange={(e) => updateCalculations('momComp', e.target.value, momY.unit, 'y')}
                                     onWheel={(e) => e.target.blur()} />
                                    <div className="unit-select-wrapper">
                                        <select className="unit-select" value={momY.unit} onChange={(e) => handleUnitChange(setMomY, momY, e.target.value, 'momY', MOMENTUM_UNITS)}>
                                            {Object.keys(MOMENTUM_UNITS).map(u => <option key={u} value={u}>{u}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Momentum Z */}
                            <div className="input-group">
                                <label className="input-label">Momentum in z-direction</label>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        className="input-field"
                                        value={momZ.value}
                                        onChange={(e) => updateCalculations('momComp', e.target.value, momZ.unit, 'z')}
                                     onWheel={(e) => e.target.blur()} />
                                    <div className="unit-select-wrapper">
                                        <select className="unit-select" value={momZ.unit} onChange={(e) => handleUnitChange(setMomZ, momZ, e.target.value, 'momZ', MOMENTUM_UNITS)}>
                                            {Object.keys(MOMENTUM_UNITS).map(u => <option key={u} value={u}>{u}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Momentum Magnitude */}
                            <div className="input-group">
                                <label className="input-label">Momentum magnitude</label>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        className="input-field"
                                        value={momMag.value}
                                        onChange={(e) => updateCalculations('momMag', e.target.value, momMag.unit)}
                                     onWheel={(e) => e.target.blur()} />
                                    <div className="unit-select-wrapper">
                                        <select className="unit-select" value={momMag.unit} onChange={(e) => handleUnitChange(setMomMag, momMag, e.target.value, 'momMag', MOMENTUM_UNITS)}>
                                            {Object.keys(MOMENTUM_UNITS).map(u => <option key={u} value={u}>{u}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

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

                </div>
            </div>
        </CalculatorLayout>
    );
};

export default MomentumCalculatorPage;
