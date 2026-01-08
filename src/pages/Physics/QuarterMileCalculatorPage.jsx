import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Info } from 'lucide-react';
import './QuarterMileCalculatorPage.css';

const QuarterMileCalculatorPage = () => {
    // --- Constants ---
    const WEIGHT_UNITS = {
        'lb': 1,
        'kg': 2.20462,
    };

    const POWER_UNITS = {
        'hp': 1,
        'kW': 1.34102,
        'PS': 0.98632,
    };

    const SPEED_UNITS = {
        'mph': 1,
        'km/h': 0.621371,
        'm/s': 2.23694,
    };

    const TIME_UNITS = {
        'sec': 1,
        'min': 60,
        'ms': 0.001,
        'h': 3600
    };

    const EQUATIONS = {
        'Huntington': { et: 6.290, speed: 224 },
        'Fox': { et: 6.269, speed: 230 },
        'Hale': { et: 5.825, speed: 234 }
    };

    // --- State ---
    const [equation, setEquation] = useState('Huntington');
    const [weight, setWeight] = useState({ value: '', unit: 'lb' });
    const [power, setPower] = useState({ value: '', unit: 'hp' });
    const [et, setEt] = useState({ value: '', unit: 'sec' });
    const [trapSpeed, setTrapSpeed] = useState({ value: '', unit: 'mph' });

    // --- Helpers ---
    const toBase = (val, unit, factors) => {
        const v = parseFloat(val);
        if (isNaN(v)) return 0;
        return v * (factors[unit] || 1);
    };

    const fromBase = (val, targetUnit, factors) => {
        if (val === 0 || isNaN(val)) return 0;
        return val / (factors[targetUnit] || 1);
    };

    const formatValue = (val) => {
        if (val === 0 || isNaN(val)) return '';
        return parseFloat(val.toFixed(3)).toString();
    };

    // --- Calculation Logic ---
    const calculate = (changedType, newValue, newUnit, currentEquation = equation) => {
        let w = toBase(weight.value, weight.unit, WEIGHT_UNITS);
        let p = toBase(power.value, power.unit, POWER_UNITS);
        let currentEtBase = toBase(et.value, et.unit, TIME_UNITS);
        let currentSpeedBase = toBase(trapSpeed.value, trapSpeed.unit, SPEED_UNITS);

        const eqConsts = EQUATIONS[currentEquation];

        if (changedType === 'weight') {
            w = toBase(newValue, newUnit, WEIGHT_UNITS);
            setWeight({ value: newValue, unit: newUnit });
        } else if (changedType === 'power') {
            p = toBase(newValue, newUnit, POWER_UNITS);
            setPower({ value: newValue, unit: newUnit });
        } else if (changedType === 'et') {
            currentEtBase = toBase(newValue, et.unit, TIME_UNITS);
            setEt(prev => ({ ...prev, value: newValue }));
            if (w > 0 && currentEtBase > 0) {
                // ET formula: ET = C * (W/P)^(1/3) -> P = W / (ET/C)^3
                p = w / Math.pow(currentEtBase / eqConsts.et, 3);
                setPower(prev => ({ ...prev, value: formatValue(fromBase(p, prev.unit, POWER_UNITS)) }));
            }
        } else if (changedType === 'trapSpeed') {
            currentSpeedBase = toBase(newValue, newUnit, SPEED_UNITS);
            setTrapSpeed({ value: newValue, unit: newUnit });
            if (w > 0 && currentSpeedBase > 0) {
                // Speed formula: Speed = C * (P/W)^(1/3) -> P = W * (Speed/C)^3
                p = w * Math.pow(currentSpeedBase / eqConsts.speed, 3);
                setPower(prev => ({ ...prev, value: formatValue(fromBase(p, prev.unit, POWER_UNITS)) }));
            }
        }

        // Propagate ET and Trap Speed
        if (changedType !== 'et' && changedType !== 'trapSpeed') {
            if (w > 0 && p > 0) {
                const calculatedEtBase = eqConsts.et * Math.pow(w / p, 1 / 3);
                const calculatedSpeedBase = eqConsts.speed * Math.pow(p / w, 1 / 3);
                setEt(prev => ({ ...prev, value: formatValue(fromBase(calculatedEtBase, prev.unit, TIME_UNITS)) }));
                setTrapSpeed(prev => ({ ...prev, value: formatValue(fromBase(calculatedSpeedBase, prev.unit, SPEED_UNITS)) }));
            } else {
                setEt(prev => ({ ...prev, value: '' }));
                setTrapSpeed(prev => ({ ...prev, value: '' }));
            }
        } else if (changedType === 'et') {
            if (w > 0 && p > 0) {
                const calculatedSpeedBase = eqConsts.speed * Math.pow(p / w, 1 / 3);
                setTrapSpeed(prev => ({ ...prev, value: formatValue(fromBase(calculatedSpeedBase, prev.unit, SPEED_UNITS)) }));
            }
        } else if (changedType === 'trapSpeed') {
            if (w > 0 && p > 0) {
                const calculatedEtBase = eqConsts.et * Math.pow(w / p, 1 / 3);
                setEt(prev => ({ ...prev, value: formatValue(fromBase(calculatedEtBase, prev.unit, TIME_UNITS)) }));
            }
        }
    };

    const handleEquationChange = (newEq) => {
        setEquation(newEq);
        calculate('equation', null, null, newEq);
    };

    const handleUnitChange = (setter, state, newUnit, factors, type) => {
        const base = toBase(state.value, state.unit, factors);
        const newVal = formatValue(fromBase(base, newUnit, factors));
        setter({ ...state, value: newVal, unit: newUnit });
    };

    const handleClear = () => {
        setWeight({ value: '', unit: 'lb' });
        setPower({ value: '', unit: 'hp' });
        setEt({ value: '', unit: 'sec' });
        setTrapSpeed({ value: '', unit: 'mph' });
    };

    const articleContent = (
        <div>
            <p>
                The <strong>Quarter Mile Calculator</strong> is a tool used to estimate a vehicle's performance on a standard 1/4 mile drag strip.
            </p>
            <h3>Equation Options</h3>
            <p>
                There are several different mathematical models to estimate performance based on the weight-to-power ratio.
            </p>
            <ul>
                <li><strong>Huntington:</strong> ET = 6.290 × (W/P)¹/³, Speed = 224 × (P/W)¹/³</li>
                <li><strong>Fox:</strong> ET = 6.269 × (W/P)¹/³, Speed = 230 × (P/W)¹/³</li>
                <li><strong>Hale:</strong> ET = 5.825 × (W/P)¹/³, Speed = 234 × (P/W)¹/³</li>
            </ul>
        </div>
    );

    return (
        <CalculatorLayout
            title="Quarter Mile Calculator"
            creators={[{ name: "Steven Wooding" }]}
            reviewers={[{ name: "Bogna Szyk" }, { name: "Jack Bowater" }]}
            tocItems={[
                "Huntington's quarter-mile ET and speed formulas",
                "Fox's quarter-mile time and speed equations",
                "Hale's quarter-mile speed and ET formulas",
                "How to use the 1/4-mile calculator"
            ]}
            articleContent={articleContent}
        >
            <div className="quarter-mile-calculator-page">
                {/* Section 1: Vehicle specs */}
                <div className="section-card">
                    <h3 className="section-title">Vehicle specs</h3>

                    <div className="input-group">
                        <label className="input-label">Equation <Info size={14} className="info-icon" /></label>
                        <div className="input-wrapper">
                            <select
                                className="input-field"
                                style={{ borderRight: '1px solid #d1d5db', borderTopRightRadius: '6px', borderBottomRightRadius: '6px' }}
                                value={equation}
                                onChange={(e) => handleEquationChange(e.target.value)}
                            >
                                {Object.keys(EQUATIONS).map(eq => <option key={eq} value={eq}>{eq}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Weight <Info size={14} className="info-icon" /></label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="input-field"
                                value={weight.value}
                                onChange={(e) => calculate('weight', e.target.value, weight.unit)}
                                placeholder="Enter vehicle weight"
                            />
                            <div className="unit-select-wrapper">
                                <select
                                    className="unit-select"
                                    value={weight.unit}
                                    onChange={(e) => handleUnitChange(setWeight, weight, e.target.value, WEIGHT_UNITS)}
                                >
                                    {Object.keys(WEIGHT_UNITS).map(u => <option key={u} value={u}>{u}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Power <Info size={14} className="info-icon" /></label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="input-field"
                                value={power.value}
                                onChange={(e) => calculate('power', e.target.value, power.unit)}
                                placeholder="Enter power"
                            />
                            <div className="unit-select-wrapper">
                                <select
                                    className="unit-select"
                                    value={power.unit}
                                    onChange={(e) => handleUnitChange(setPower, power, e.target.value, POWER_UNITS)}
                                >
                                    {Object.keys(POWER_UNITS).map(u => <option key={u} value={u}>{u}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="divider-custom"></div>

                    <h3 className="section-title">Performance estimates</h3>

                    <div className="input-group result-group">
                        <label className="input-label">Elapsed time <Info size={14} className="info-icon" /></label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="input-field result-field"
                                value={et.value}
                                onChange={(e) => calculate('et', e.target.value, et.unit)}
                                placeholder="Result"
                            />
                            <div className="unit-select-wrapper">
                                <select
                                    className="unit-select"
                                    value={et.unit}
                                    onChange={(e) => handleUnitChange(setEt, et, e.target.value, TIME_UNITS)}
                                >
                                    {Object.keys(TIME_UNITS).map(u => <option key={u} value={u}>{u}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="input-group result-group">
                        <label className="input-label">Trap speed <Info size={14} className="info-icon" /></label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="input-field result-field"
                                value={trapSpeed.value}
                                onChange={(e) => calculate('trapSpeed', e.target.value, trapSpeed.unit)}
                                placeholder="Result"
                            />
                            <div className="unit-select-wrapper">
                                <select
                                    className="unit-select"
                                    value={trapSpeed.unit}
                                    onChange={(e) => handleUnitChange(setTrapSpeed, trapSpeed, e.target.value, SPEED_UNITS)}
                                >
                                    {Object.keys(SPEED_UNITS).map(u => <option key={u} value={u}>{u}</option>)}
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

export default QuarterMileCalculatorPage;
