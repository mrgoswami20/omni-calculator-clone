import React, { useState } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, MoreHorizontal } from 'lucide-react';
import './BallisticCoefficientCalculatorPage.css';

const BallisticCoefficientCalculatorPage = () => {
    // --- Constants ---
    const MASS_UNITS = {
        'g': 1, // base
        'kg': 1000,
        'mg': 0.001,
        'lb': 453.592,
        'oz': 28.3495,
        'grain': 0.0647989
    };

    const AREA_UNITS = {
        'mm²': 1, // base
        'cm²': 100,
        'm²': 1000000,
        'in²': 645.16,
        'ft²': 92903.04
    };

    const BC_UNITS = {
        'kg/m²': 1, // base
        'lb/ft²': 4.88243,
        'lb/in²': 703.0696,
        'g/cm²': 10
    };

    // --- State ---
    const [mass, setMass] = useState({ value: '', unit: 'g' });
    const [area, setArea] = useState({ value: '', unit: 'mm²' });
    const [dragCoeff, setDragCoeff] = useState('');
    const [bc, setBc] = useState({ value: '', unit: 'kg/m²' });
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
        if (Math.abs(val) < 1e-6 || Math.abs(val) > 1e6) return val.toExponential(4);
        return parseFloat(val.toFixed(4)).toString();
    };

    // --- Calculation Logic ---
    // Formula: BC = Mass / (DragCoeff * Area)
    // Base Units:
    // Mass: g -> needs to be kg for BC(kg/m²)
    // Area: mm² -> needs to be m² for BC(kg/m²)
    // DragCoeff: dimensionless

    // Internal standardized units for calculation:
    // Mass: kg
    // Area: m²
    // BC: kg/m²

    const calculate = (changedType, newVal, newUnit) => {
        // 1. Get current values in standardized calculation units (kg, m², kg/m²)
        let mKg = toBase(mass.value, mass.unit, MASS_UNITS) / 1000; // g -> kg
        let aM2 = toBase(area.value, area.unit, AREA_UNITS) / 1000000; // mm² -> m²
        let dVal = parseFloat(dragCoeff);
        let bcVal = toBase(bc.value, bc.unit, BC_UNITS); // kg/m²

        // 2. Update the changed input securely
        if (changedType === 'mass') {
            mKg = toBase(newVal, newUnit, MASS_UNITS) / 1000;
            setMass({ value: newVal, unit: newUnit });

            if (dVal && dVal !== 0 && aM2 !== 0 && !isNaN(aM2)) {
                // Calculate BC
                const newBc = mKg / (dVal * aM2);
                setBc(prev => ({ ...prev, value: format(fromBase(newBc, prev.unit, BC_UNITS)) }));
            }
        }
        else if (changedType === 'area') {
            aM2 = toBase(newVal, newUnit, AREA_UNITS) / 1000000;
            setArea({ value: newVal, unit: newUnit });

            if (dVal && dVal !== 0 && mKg !== 0 && !isNaN(mKg)) {
                // Calculate BC
                const newBc = mKg / (dVal * aM2);
                setBc(prev => ({ ...prev, value: format(fromBase(newBc, prev.unit, BC_UNITS)) }));
            }
        }
        else if (changedType === 'drag') {
            dVal = parseFloat(newVal);
            setDragCoeff(newVal);

            if (dVal && dVal !== 0 && mKg !== 0 && !isNaN(mKg) && aM2 !== 0 && !isNaN(aM2)) {
                const newBc = mKg / (dVal * aM2);
                setBc(prev => ({ ...prev, value: format(fromBase(newBc, prev.unit, BC_UNITS)) }));
            }
        }
        else if (changedType === 'bc') {
            bcVal = toBase(newVal, newUnit, BC_UNITS);
            setBc({ value: newVal, unit: newUnit });

            // Calculate Mass if we have Drag and Area? Or Calculate Drag if we have Mass and Area?
            // Usually, user might want to find Mass given BC.
            // Let's assume finding Mass as priority if Area/Drag exist.
            if (dVal && dVal !== 0 && aM2 !== 0 && !isNaN(aM2)) {
                const newMassKg = bcVal * dVal * aM2;
                const newMassG = newMassKg * 1000;
                setMass(prev => ({ ...prev, value: format(fromBase(newMassG, prev.unit, MASS_UNITS)) }));
            }
        }
    };

    const handleUnitChange = (setter, state, newUnit, type, factors) => {
        // Just convert display value
        const base = toBase(state.value, state.unit, factors);
        const newVal = format(fromBase(base, newUnit, factors));
        setter({ value: newVal, unit: newUnit });
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setShowShareTooltip(true);
            setTimeout(() => setShowShareTooltip(false), 2000);
        } catch (err) { }
    };

    const handleClear = () => {
        setMass(prev => ({ ...prev, value: '' }));
        setArea(prev => ({ ...prev, value: '' }));
        setDragCoeff('');
        setBc(prev => ({ ...prev, value: '' }));
    };

    const articleContent = (
        <div>
            <p>
                The <strong>Ballistic Coefficient Calculator</strong> helps you determine the ballistic coefficient (BC) of a projectile.
                BC is a measure of a projectile's ability to overcome air resistance in flight.
            </p>
            <h3>Formula</h3>
            <p className="math-formula">BC = m / (C_d × A)</p>
            <p>Where:</p>
            <ul>
                <li><strong>m</strong> is the mass of the projectile</li>
                <li><strong>C_d</strong> is the drag coefficient</li>
                <li><strong>A</strong> is the cross-sectional area</li>
            </ul>
        </div>
    );

    return (
        <CalculatorLayout
            title="Ballistic Coefficient Calculator"
            creators={[{ name: "Omni Team" }]}
            reviewers={[]}
            tocItems={["What is ballistic coefficient?", "Formula"]}
            articleContent={articleContent}
        >
            <div className="ballistic-calculator-page">
                <div className="section-card">
                    <h3 className="section-title">Calculate Ballistic Coefficient</h3>

                    {/* Mass */}
                    <div className="input-group">
                        <label className="input-label">Mass of projectile (m)<MoreHorizontal size={16} className="info-icon" /></label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="input-field"
                                value={mass.value}
                                onChange={(e) => calculate('mass', e.target.value, mass.unit)}
                                placeholder="Enter mass"
                            />
                            <div className="unit-select-wrapper">
                                <select
                                    className="unit-select"
                                    value={mass.unit}
                                    onChange={(e) => handleUnitChange(setMass, mass, e.target.value, 'mass', MASS_UNITS)}
                                >
                                    {Object.keys(MASS_UNITS).map(u => <option key={u} value={u}>{u}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Area */}
                    <div className="input-group">
                        <label className="input-label">Area of cross-section (A)<MoreHorizontal size={16} className="info-icon" /></label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="input-field"
                                value={area.value}
                                onChange={(e) => calculate('area', e.target.value, area.unit)}
                                placeholder="Enter area"
                            />
                            <div className="unit-select-wrapper">
                                <select
                                    className="unit-select"
                                    value={area.unit}
                                    onChange={(e) => handleUnitChange(setArea, area, e.target.value, 'area', AREA_UNITS)}
                                >
                                    {Object.keys(AREA_UNITS).map(u => <option key={u} value={u}>{u}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Drag Coefficient */}
                    <div className="input-group">
                        <label className="input-label">Drag coefficient (C)<MoreHorizontal size={16} className="info-icon" /></label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="input-field"
                                value={dragCoeff}
                                // Style hack to remove right padding since no unit
                                style={{ paddingRight: '16px' }}
                                onChange={(e) => calculate('drag', e.target.value, null)}
                                placeholder="Enter drag coefficient"
                            />
                        </div>
                    </div>

                    {/* Result */}
                    <div className="input-group result-group">
                        <label className="input-label">Ballistic coefficient (B)<MoreHorizontal size={16} className="info-icon" /></label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="input-field result-field"
                                value={bc.value}
                                onChange={(e) => calculate('bc', e.target.value, bc.unit)}
                                placeholder="Result"
                            />
                            <div className="unit-select-wrapper">
                                <select
                                    className="unit-select"
                                    value={bc.unit}
                                    onChange={(e) => handleUnitChange(setBc, bc, e.target.value, 'bc', BC_UNITS)}
                                >
                                    {Object.keys(BC_UNITS).map(u => <option key={u} value={u}>{u}</option>)}
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

export default BallisticCoefficientCalculatorPage;
