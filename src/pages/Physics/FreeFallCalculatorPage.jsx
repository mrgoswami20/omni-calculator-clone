import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Info } from 'lucide-react';
import './FreeFallCalculatorPage.css';

const FreeFallCalculatorPage = () => {
    // --- Constants ---
    const G_UNITS = { 'm/s²': 1, 'ft/s²': 0.3048, 'g': 9.80665 };
    const VEL_UNITS = { 'm/s': 1, 'km/h': 1 / 3.6, 'ft/s': 0.3048, 'mph': 0.44704 };
    const LENGTH_UNITS = { 'm': 1, 'km': 1000, 'cm': 0.01, 'ft': 0.3048, 'in': 0.0254 };
    const TIME_UNITS = { 'sec': 1, 'ms': 0.001, 'min': 60, 'hr': 3600 };

    // --- State ---
    const [g, setG] = useState({ value: '9.80665', unit: 'm/s²' });
    const [v0, setV0] = useState({ value: '0', unit: 'm/s' });
    const [h, setH] = useState({ value: '', unit: 'm' });
    const [t, setT] = useState({ value: '', unit: 'sec' });
    const [v, setV] = useState({ value: '', unit: 'm/s' });

    // --- Helpers ---
    const toBase = (val, unit, factors) => {
        const v = parseFloat(val);
        if (isNaN(v)) return null;
        return v * (factors[unit] || 1);
    };

    const fromBase = (val, targetUnit, factors) => {
        if (val === null || isNaN(val)) return '';
        const res = val / (factors[targetUnit] || 1);
        return parseFloat(res.toFixed(6)).toString();
    };

    const formatValue = (val) => {
        if (val === null || isNaN(val)) return '';
        return parseFloat(val.toFixed(4)).toString();
    };

    // --- Calculation Logic ---
    const calculate = (changedType, newValue, newUnit) => {
        // Update the state of the changed field first
        const updates = { g, v0, h, t, v };
        if (changedType === 'g') { updates.g = { value: newValue, unit: newUnit }; setG(updates.g); }
        if (changedType === 'v0') { updates.v0 = { value: newValue, unit: newUnit }; setV0(updates.v0); }
        if (changedType === 'h') { updates.h = { value: newValue, unit: newUnit }; setH(updates.h); }
        if (changedType === 't') { updates.t = { value: newValue, unit: newUnit }; setT(updates.t); }
        if (changedType === 'v') { updates.v = { value: newValue, unit: newUnit }; setV(updates.v); }

        const g_val = toBase(updates.g.value, updates.g.unit, G_UNITS);
        const v0_val = toBase(updates.v0.value, updates.v0.unit, VEL_UNITS);

        if (g_val === null || v0_val === null) return;

        // Formula check
        // v = v0 + g * t
        // h = v0 * t + 0.5 * g * t^2
        // v^2 = v0^2 + 2 * g * h

        if (changedType === 't' && updates.t.value !== '') {
            const t_base = toBase(updates.t.value, updates.t.unit, TIME_UNITS);
            if (t_base !== null) {
                const final_v = v0_val + g_val * t_base;
                const final_h = v0_val * t_base + 0.5 * g_val * Math.pow(t_base, 2);
                setV(prev => ({ ...prev, value: fromBase(final_v, prev.unit, VEL_UNITS) }));
                setH(prev => ({ ...prev, value: fromBase(final_h, prev.unit, LENGTH_UNITS) }));
            }
        }
        else if (changedType === 'h' && updates.h.value !== '') {
            const h_base = toBase(updates.h.value, updates.h.unit, LENGTH_UNITS);
            if (h_base !== null) {
                // h = v0*t + 0.5*g*t^2  => 0.5*g*t^2 + v0*t - h = 0
                // Quadrative formula: t = [-v0 + sqrt(v0^2 - 4*0.5*g*-h)] / (2*0.5*g)
                // t = [-v0 + sqrt(v0^2 + 2*g*h)] / g
                const discriminant = Math.pow(v0_val, 2) + 2 * g_val * h_base;
                if (discriminant >= 0) {
                    const t_base = (-v0_val + Math.sqrt(discriminant)) / g_val;
                    const final_v = v0_val + g_val * t_base;
                    setT(prev => ({ ...prev, value: fromBase(t_base, prev.unit, TIME_UNITS) }));
                    setV(prev => ({ ...prev, value: fromBase(final_v, prev.unit, VEL_UNITS) }));
                }
            }
        }
        else if (changedType === 'v' && updates.v.value !== '') {
            const v_base = toBase(updates.v.value, updates.v.unit, VEL_UNITS);
            if (v_base !== null) {
                // v = v0 + g * t => t = (v - v0) / g
                const t_base = (v_base - v0_val) / g_val;
                const final_h = v0_val * t_base + 0.5 * g_val * Math.pow(t_base, 2);
                setT(prev => ({ ...prev, value: fromBase(t_base, prev.unit, TIME_UNITS) }));
                setH(prev => ({ ...prev, value: fromBase(final_h, prev.unit, LENGTH_UNITS) }));
            }
        }
        else if (changedType === 'g' || changedType === 'v0') {
            // If g or v0 changes, recalculate based on existing t if present, then h, then v
            if (updates.t.value !== '') calculate('t', updates.t.value, updates.t.unit);
            else if (updates.h.value !== '') calculate('h', updates.h.value, updates.h.unit);
            else if (updates.v.value !== '') calculate('v', updates.v.value, updates.v.unit);
        }
    };

    const handleClear = () => {
        setG({ value: '9.80665', unit: 'm/s²' });
        setV0({ value: '0', unit: 'm/s' });
        setH({ value: '', unit: 'm' });
        setT({ value: '', unit: 'sec' });
        setV({ value: '', unit: 'm/s' });
    };

    const articleContent = (
        <div>
            <p>The <strong>free fall calculator</strong> is a tool for finding the velocity of a falling object along with the distance it travels. Thanks to this tool, you can apply the free fall equation for any object, be it an apple you drop or a person jumping with a parachute.</p>
            <h3 id="free-fall-definition">What is the free fall definition?</h3>
            <p>In Newtonian physics, <strong>free fall</strong> is any motion of a body where gravity is the only force acting upon it. In the context of general relativity, where gravitation is reduced to a space-time curvature, a body in free fall has no force acting on it.</p>
            <h3 id="free-fall-equation">Free fall equation</h3>
            <p>To calculate the velocity and distance of an object in free fall, we use the following formulas:</p>
            <div className="math-formula">
                v = v₀ + g × t<br />
                h = v₀ × t + 0.5 × g × t²
            </div>
            <p>Where:</p>
            <ul>
                <li><strong>v</strong> is the final velocity.</li>
                <li><strong>v₀</strong> is the initial velocity.</li>
                <li><strong>g</strong> is the gravitational acceleration.</li>
                <li><strong>t</strong> is the time of fall.</li>
                <li><strong>h</strong> is the height or distance traveled.</li>
            </ul>
        </div>
    );

    const renderInput = (label, state, setter, units, type, placeholder) => (
        <div className="input-group">
            <label className="input-label">{label} <Info size={14} className="info-icon" /></label>
            <div className="input-wrapper">
                <input
                    type="number"
                    className={`input-field ${type === 'v' || type === 'h' || type === 't' ? 'result-field' : ''}`}
                    value={state.value}
                    onChange={(e) => calculate(type, e.target.value, state.unit)}
                    placeholder={placeholder}
                 onWheel={(e) => e.target.blur()} />
                <div className="unit-select-wrapper">
                    <select
                        className="unit-select"
                        value={state.unit}
                        onChange={(e) => {
                            const newUnit = e.target.value;
                            const newVal = state.value !== '' ? fromBase(toBase(state.value, state.unit, units), newUnit, units) : '';
                            setter({ ...state, value: newVal, unit: newUnit });
                        }}
                    >
                        {Object.keys(units).map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );

    return (
        <CalculatorLayout
            title="Free Fall Calculator"
            creators={[{ name: "Bogna Szyk" }]}
            reviewers={[{ name: "Jack Bowater" }]}
            articleContent={articleContent}
        >
            <div className="free-fall-calculator-page">
                <div className="section-card">
                    {renderInput("Gravitational acceleration (g)", g, setG, G_UNITS, 'g', "9.80665")}
                    {renderInput("Initial velocity (v₀)", v0, setV0, VEL_UNITS, 'v0', "0")}

                    <div className="divider-custom"></div>

                    {renderInput("Height (h)", h, setH, LENGTH_UNITS, 'h', "Enter height")}
                    {renderInput("Time of fall (t)", t, setT, TIME_UNITS, 't', "Enter time")}
                    {renderInput("Velocity (v)", v, setV, VEL_UNITS, 'v', "Result")}

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

export default FreeFallCalculatorPage;
