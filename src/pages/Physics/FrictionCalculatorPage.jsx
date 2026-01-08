import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Info } from 'lucide-react';
import './FrictionCalculatorPage.css';

const FrictionCalculatorPage = () => {
    // --- Constants ---
    const FORCE_UNITS = {
        'N': 1,
        'kN': 1000,
        'lbf': 4.44822,
        'kp': 9.80665,
        'dyn': 0.00001
    };

    // --- State ---
    const [mu, setMu] = useState({ value: '' });
    const [normalForce, setNormalForce] = useState({ value: '', unit: 'N' });
    const [frictionForce, setFrictionForce] = useState({ value: '', unit: 'N' });

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
        return parseFloat(val.toFixed(4)).toString();
    };

    // --- Calculation Logic ---
    const calculate = (changedType, newValue, newUnit) => {
        let currentMu = parseFloat(changedType === 'mu' ? newValue : mu.value);
        let currentN = toBase(
            changedType === 'normalForce' ? newValue : normalForce.value,
            changedType === 'normalForce' ? newUnit : normalForce.unit,
            FORCE_UNITS
        );
        let currentF = toBase(
            changedType === 'frictionForce' ? newValue : frictionForce.value,
            changedType === 'frictionForce' ? newUnit : frictionForce.unit,
            FORCE_UNITS
        );

        if (changedType === 'mu') {
            setMu({ value: newValue });
            if (!isNaN(currentMu) && currentN > 0) {
                const f = currentMu * currentN;
                setFrictionForce(prev => ({ ...prev, value: formatValue(fromBase(f, prev.unit, FORCE_UNITS)) }));
            }
        }
        else if (changedType === 'normalForce') {
            setNormalForce({ value: newValue, unit: newUnit });
            if (currentN > 0) {
                if (!isNaN(currentMu)) {
                    const f = currentMu * currentN;
                    setFrictionForce(prev => ({ ...prev, value: formatValue(fromBase(f, prev.unit, FORCE_UNITS)) }));
                } else if (currentF > 0) {
                    const m = currentF / currentN;
                    setMu({ value: formatValue(m) });
                }
            }
        }
        else if (changedType === 'frictionForce') {
            setFrictionForce({ value: newValue, unit: newUnit });
            if (currentF > 0) {
                if (!isNaN(currentMu) && currentMu !== 0) {
                    const n = currentF / currentMu;
                    setNormalForce(prev => ({ ...prev, value: formatValue(fromBase(n, prev.unit, FORCE_UNITS)) }));
                } else if (currentN > 0) {
                    const m = currentF / currentN;
                    setMu({ value: formatValue(m) });
                }
            }
        }
    };

    const handleUnitChange = (setter, state, newUnit, factors, type) => {
        const base = toBase(state.value, state.unit, factors);
        const newVal = formatValue(fromBase(base, newUnit, factors));
        setter({ ...state, value: newVal, unit: newUnit });
    };

    const handleClear = () => {
        setMu({ value: '' });
        setNormalForce({ value: '', unit: 'N' });
        setFrictionForce({ value: '', unit: 'N' });
    };

    const articleContent = (
        <div>
            <p>
                Use this <strong>friction calculator</strong> to calculate the friction force between an object and the ground. It is based on a simple principle: friction is proportional to the normal force acting between the object and the ground.
            </p>
            <h3 id="force-of-friction-equation">Force of friction equation</h3>
            <p>
                The maximum force of friction between two surfaces is given by the formula:
            </p>
            <div className="math-formula">
                F = μ × N
            </div>
            <p>
                Where:
            </p>
            <ul>
                <li><strong>F</strong> is the force of friction.</li>
                <li><strong>μ</strong> is the friction coefficient.</li>
                <li><strong>N</strong> is the normal force.</li>
            </ul>
        </div>
    );

    return (
        <CalculatorLayout
            title="Friction Calculator"
            creators={[{ name: "Bogna Szyk" }]}
            reviewers={[{ name: "Jack Bowater" }]}
            tocItems={[
                "Force of friction equation",
                "How to find force of friction",
                "Static friction vs kinetic friction",
                "FAQs"
            ]}
            articleContent={articleContent}
        >
            <div className="friction-calculator-page">
                <div className="section-card">
                    <div className="input-group">
                        <label className="input-label">Friction coefficient (μ) <Info size={14} className="info-icon" /></label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="input-field"
                                style={{ borderRight: '1px solid #d1d5db', borderTopRightRadius: '6px', borderBottomRightRadius: '6px' }}
                                value={mu.value}
                                onChange={(e) => calculate('mu', e.target.value)}
                                placeholder="Enter coefficient"
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Normal force (N) <Info size={14} className="info-icon" /></label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="input-field"
                                value={normalForce.value}
                                onChange={(e) => calculate('normalForce', e.target.value, normalForce.unit)}
                                placeholder="Enter normal force"
                            />
                            <div className="unit-select-wrapper">
                                <select
                                    className="unit-select"
                                    value={normalForce.unit}
                                    onChange={(e) => handleUnitChange(setNormalForce, normalForce, e.target.value, FORCE_UNITS)}
                                >
                                    {Object.keys(FORCE_UNITS).map(u => <option key={u} value={u}>{u}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="divider-custom"></div>

                    <div className="input-group result-group">
                        <label className="input-label">Friction force (F = μN) <Info size={14} className="info-icon" /></label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="input-field result-field"
                                value={frictionForce.value}
                                onChange={(e) => calculate('frictionForce', e.target.value, frictionForce.unit)}
                                placeholder="Result"
                            />
                            <div className="unit-select-wrapper">
                                <select
                                    className="unit-select"
                                    value={frictionForce.unit}
                                    onChange={(e) => handleUnitChange(setFrictionForce, frictionForce, e.target.value, FORCE_UNITS)}
                                >
                                    {Object.keys(FORCE_UNITS).map(u => <option key={u} value={u}>{u}</option>)}
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

export default FrictionCalculatorPage;
