import React, { useState } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { RotateCcw, Trash2, AlertCircle } from 'lucide-react';
import SimpleInputBar from '../../components/kit_components/SimpleInputBar';
import InputBarWithDropDownOption from '../../components/kit_components/InputBarWithDropDownOption'; // Used where possible
import SimpleButton from '../../components/kit_components/SimpleButton';
import './CellDoublingTimeCalculatorPage.css';

const CellDoublingTimeCalculatorPage = () => {
    // --- Constants (PRESERVED LOGIC) ---
    const TIME_FACTORS = {
        'sec': 1,
        'min': 60,
        'hrs': 3600,
        'hr': 3600,
        'days': 86400,
        'day': 86400,
        'wks': 604800,
        'wk': 604800,
        'mos': 2629800,
        'mo': 2629800,
        'yrs': 31557600,
        'yr': 31557600
    };

    const MULTI_UNIT_CONFIG = {
        'seconds (sec)': ['sec'],
        'minutes (min)': ['min'],
        'hours (hrs)': ['hrs'],
        'days (days)': ['days'],
        'weeks (wks)': ['wks'],
        'months (mos)': ['mos'],
        'years (yrs)': ['yrs'],
        'minutes / seconds (min / sec)': ['min', 'sec'],
        'hours / minutes (hrs / min)': ['hrs', 'min'],
        'hours / minutes / seconds (hrs / min / sec)': ['hrs', 'min', 'sec'],
        'years / months (yrs / mos)': ['yrs', 'mos'],
        'years / months / days (yrs / mos / days)': ['yrs', 'mos', 'days'],
        'weeks / days (wks / days)': ['wks', 'days'],
        'days / hours (days / hrs)': ['days', 'hrs']
    };

    const GROWTH_RATE_UNITS = {
        'sec': 1,
        'min': 60,
        'hr': 3600,
        'day': 86400,
        'wk': 604800,
        'mo': 2629800,
        'yr': 31557600
    };

    const GROWTH_RATE_OPTIONS = Object.keys(GROWTH_RATE_UNITS).map(u => ({ value: u, label: `/ ${u}` }));

    // --- State ---
    const [n0, setN0] = useState({ value: '', unit: 'cells' });
    const [n, setN] = useState({ value: '', unit: 'cells' });
    const [t, setT] = useState({
        value: { yrs: '', mos: '', wks: '', days: '', hrs: '', min: '', sec: '' },
        unit: 'hours (hrs)'
    });
    const [r, setR] = useState({ value: '', unit: 'hr' });
    const [g, setG] = useState({
        value: { yrs: '', mos: '', wks: '', days: '', hrs: '', min: '', sec: '' },
        unit: 'hours (hrs)'
    });

    // --- Helpers ---
    const parseNumber = (val) => {
        if (!val) return 0;
        const cleanVal = val.toString().replace(/[, ]/g, '');
        const num = parseFloat(cleanVal);
        return isNaN(num) ? 0 : num;
    };

    const toBase = (val) => parseNumber(val);

    const toBaseMulti = (valObj, unit) => {
        const components = MULTI_UNIT_CONFIG[unit] || [];
        let totalVal = 0;
        let hasValue = false;
        components.forEach(comp => {
            const v = parseNumber(valObj[comp]); // Use robust parsing
            if (v > 0 || (v === 0 && valObj[comp] !== '')) { // Treat 0 as valid if explicitly typed
                totalVal += v * TIME_FACTORS[comp];
                hasValue = true;
            }
        });
        return hasValue ? totalVal : 0;
    };

    const fromBaseMulti = (valInSec, unit) => {
        if (valInSec === null || isNaN(valInSec) || valInSec === Infinity) {
            return { yrs: '', mos: '', wks: '', days: '', hrs: '', min: '', sec: '' };
        }

        const components = MULTI_UNIT_CONFIG[unit] || [];
        let remaining = valInSec;
        const result = { yrs: '', mos: '', wks: '', days: '', hrs: '', min: '', sec: '' };

        components.forEach((comp, idx) => {
            const factor = TIME_FACTORS[comp];
            if (idx === components.length - 1) {
                // Last component gets the remainder
                result[comp] = parseFloat((remaining / factor).toFixed(6)).toString();
            } else {
                const amount = Math.floor(remaining / factor);
                result[comp] = amount.toString();
                remaining -= amount * factor;
            }
        });
        return result;
    };

    const formatValue = (val) => {
        if (val === null || isNaN(val) || val === Infinity) return '';
        if (val > 0 && (val < 0.001 || val > 1e9)) return val.toExponential(4);
        return parseFloat(val.toFixed(6)).toString();
    };

    // --- Calculation Logic (PRESERVED) ---
    const calculate = (changedType, newValue, unitKey) => {
        const updates = { n0, n, t, r, g };

        // 1. Update the 'updates' object based on what changed
        if (changedType === 'n0') updates.n0 = { ...n0, value: newValue };
        if (changedType === 'n') updates.n = { ...n, value: newValue };
        if (changedType === 'r') updates.r = { ...r, value: newValue };
        if (changedType === 't') {
            const newTValue = { ...t.value, [unitKey]: newValue };
            updates.t = { ...t, value: newTValue };
        }
        if (changedType === 'g') {
            const newGValue = { ...g.value, [unitKey]: newValue };
            updates.g = { ...g, value: newGValue };
        }

        // 2. Set State Immediately for the input that changed
        if (changedType === 'n0') setN0(updates.n0);
        if (changedType === 'n') setN(updates.n);
        if (changedType === 'r') setR(updates.r);
        if (changedType === 't') setT(updates.t);
        if (changedType === 'g') setG(updates.g);

        // 3. Perform Logic
        const n0_string = updates.n0.value;
        const n_string = updates.n.value;
        const n0_val = parseNumber(n0_string);
        const n_val = parseNumber(n_string);

        // Calculate total seconds for T
        const t_val = toBaseMulti(updates.t.value, updates.t.unit);

        let k = 0; // growth rate in 1/sec
        let k_calculated = false;

        // Route A: N0, N, T changed -> Calculate K
        if (changedType === 'n0' || changedType === 'n' || changedType === 't') {
            if (n0_val > 0 && n_val > 0 && t_val > 0) {
                if (n_val !== n0_val) {
                    // k can be negative (decay) or positive (growth)
                    k = Math.log(n_val / n0_val) / t_val;
                    k_calculated = true;
                }
            }
        }
        // Route B: Rate (R) changed -> Calculate K
        else if (changedType === 'r') {
            const r_val = parseNumber(newValue);
            if (r_val !== 0) {
                const unit_multiplier = GROWTH_RATE_UNITS[updates.r.unit];
                k = r_val / unit_multiplier;
                k_calculated = true;
            }
        }
        // Route C: Doubling Time (G) changed -> Calculate K
        else if (changedType === 'g') {
            const g_val_sec = toBaseMulti(updates.g.value, updates.g.unit);
            if (g_val_sec > 0) {
                k = Math.log(2) / g_val_sec;
                k_calculated = true;
            }
        }

        // 4. Update Dependent Fields if K was successfully calculated
        if (k_calculated && k !== 0 && isFinite(k)) {
            // Update R (if not source)
            if (changedType !== 'r') {
                const r_new = k * GROWTH_RATE_UNITS[updates.r.unit];
                setR({ ...updates.r, value: formatValue(r_new) });
            }

            // Update G (if not source)
            if (changedType !== 'g') {
                // Doubling Time = ln(2) / k
                // Only defined for Growth (k > 0) usually, but we can calc abs value or just math result
                // If k < 0, doubling time is negative (or technically undefined/half-life)
                if (k > 0) {
                    const doubling_time_sec = Math.log(2) / k;
                    const res_g_obj = fromBaseMulti(doubling_time_sec, updates.g.unit);
                    setG({ ...updates.g, value: res_g_obj });
                } else {
                    // Start of decay / half-life logic if needed, or clear G
                    // Current request: user wants results. 
                    // Let's clear G if decay, or show empty.
                    const emptyValObj = { yrs: '', mos: '', wks: '', days: '', hrs: '', min: '', sec: '' };
                    setG({ ...updates.g, value: emptyValObj });
                }
            }

            // Update N or N0 (if Source was R or G)
            if (changedType === 'g' || changedType === 'r') {
                if (n0_val > 0 && t_val > 0) {
                    const res_n = n0_val * Math.exp(k * t_val);
                    setN({ ...updates.n, value: formatValue(res_n) });
                } else if (n_val > 0 && t_val > 0) {
                    const res_n0 = n_val / Math.exp(k * t_val);
                    setN0({ ...updates.n0, value: formatValue(res_n0) });
                }
            }
        }
    };

    // Special handler for unit changes because they trigger recalculation
    const handleMultiUnitChange = (type, newUnit) => {
        if (type === 't') {
            const baseVal = toBaseMulti(t.value, t.unit);
            const newValObj = fromBaseMulti(baseVal, newUnit);
            setT({ value: newValObj, unit: newUnit });
            // re-trigger calc? The logic mostly relies on values. 
            // If we convert correctly, base val is same, so K is same. No calc needed really?
            // But if T was source, strict logic might need to ensure consistency.
        }
        if (type === 'g') {
            const baseVal = toBaseMulti(g.value, g.unit);
            const newValObj = fromBaseMulti(baseVal, newUnit);
            setG({ value: newValObj, unit: newUnit });
        }
    };

    const handleRateUnitChange = (newUnit) => {
        // When rate unit changes, we keep the underlying K (growth per sec) constant?
        // Or do we keep the number constant and change K?
        // Original logic: "const k = parseFloat(r.value) / GROWTH_RATE_UNITS[r.unit]; setR(..., val: k * newUnitFactor)"
        // So it converts the displayed value to match the same physical rate.
        const k = parseNumber(r.value) / GROWTH_RATE_UNITS[r.unit];
        const newVal = r.value !== '' && !isNaN(k) ? formatValue(k * GROWTH_RATE_UNITS[newUnit]) : '';
        setR({ value: newVal, unit: newUnit });
    };

    const handleReload = () => window.location.reload();
    const handleClear = () => {
        const emptyValObj = { yrs: '', mos: '', wks: '', days: '', hrs: '', min: '', sec: '' };
        setN0({ value: '', unit: 'cells' });
        setN({ value: '', unit: 'cells' });
        setT({ value: emptyValObj, unit: 'hours (hrs)' });
        setR({ value: '', unit: 'hr' });
        setG({ value: emptyValObj, unit: 'hours (hrs)' });
    };

    // --- Validation Logic ---
    const n0Val = parseFloat(n0.value);
    const showN0Error = n0.value !== '' && (isNaN(n0Val) || n0Val <= 0);

    const nVal = parseFloat(n.value);
    const ntErrorMessages = [];
    if (n.value !== '') {
        if (isNaN(nVal) || nVal <= 0) {
            ntErrorMessages.push("Final reference parameter must be positive.");
        }
        if (!isNaN(nVal) && !isNaN(n0Val) && n0Val > 0 && nVal <= n0Val) {
            ntErrorMessages.push("Final reference parameter must be greater than initial reference parameter.");
        }
    }

    const tTotalSec = toBaseMulti(t.value, t.unit);
    // Check if any field is filled
    const isTimeFilled = Object.values(t.value).some(v => v !== '');
    const showTimeError = isTimeFilled && tTotalSec <= 0;

    const rVal = parseFloat(r.value);
    const showRateError = r.value !== '' && (isNaN(rVal) || rVal <= 0);


    // --- Actions ---
    // Custom Multi-part Input Renderer
    const renderMultiInput = (type, stateObj, handleChange, handleUnitChangeDesc, error, errorMessage) => {
        const components = MULTI_UNIT_CONFIG[stateObj.unit];

        // Inline styles for error state in multi-input
        const boxStyle = error ? { borderColor: '#ef4444', boxShadow: '0 0 0 1px #ef4444' } : {};

        return (
            <div className="multi-input-container">
                <div className="multi-fields-row">
                    {components.map((comp, idx) => (
                        <div key={comp} className="multi-field-item">
                            <input
                                className="multi-input-box"
                                placeholder="0"
                                value={stateObj.value[comp]}
                                onChange={(e) => handleChange(type, e.target.value, comp)}
                                style={boxStyle}
                            />
                            <span className="multi-input-label">{comp}</span>
                        </div>
                    ))}
                </div>
                <div className="multi-unit-selector">
                    <select
                        value={stateObj.unit}
                        onChange={(e) => handleUnitChangeDesc(type, e.target.value)}
                        className="std-select"
                    >
                        {Object.keys(MULTI_UNIT_CONFIG).map(u => (
                            <option key={u} value={u}>{u}</option>
                        ))}
                    </select>
                </div>
                {error && errorMessage && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginTop: '6px',
                        padding: '10px 14px',
                        backgroundColor: '#FFECEB',
                        color: '#B91C1C',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        animation: 'fadeIn 0.2s ease-in-out'
                    }}>
                        <AlertCircle size={16} fill="#DC2626" color="white" style={{ flexShrink: 0 }} />
                        <span>{errorMessage}</span>
                    </div>
                )}
            </div>
        );
    };

    const articleContent = (
        <div className="article-wrapper">
            <h2 id="calc-method">How to calculate doubling time?</h2>
            <p>Use the following formula:</p>
            <div className="formula-block">
                {`Doubling Time = $\\frac{t \\cdot \\ln(2)}{\\ln(N_t / N_0)}$`}
            </div>
        </div>
    );

    return (
        <CalculatorLayout
            title="Cell Doubling Time Calculator"
            creators={[{ name: "Bogna Szyk" }]}
            reviewers={[{ name: "Jack Bowater" }]}
            articleContent={articleContent}
            tocItems={[{ label: 'Method', id: 'calc-method' }]}
        >
            <div className="cell-doubling-calculator">
                <div className="calc-card">
                    {/* N0 */}
                    <SimpleInputBar
                        label="Initial reference parameter (N0)"
                        value={n0.value}
                        onChange={(e) => calculate('n0', e.target.value)}
                        placeholder="e.g. 1000"
                        showInfoIcon={true}
                        error={showN0Error}
                        errorMessage="Initial reference parameter must be positive."
                    />

                    {/* Nt */}
                    <SimpleInputBar
                        label="Final reference parameter (Nt)"
                        value={n.value}
                        onChange={(e) => calculate('n', e.target.value)}
                        placeholder="e.g. 5000"
                        errorMessages={ntErrorMessages}
                    />

                    {/* Time (Multi) */}
                    <div className="input-block-wrapper">
                        <label className="input-label-std">Time duration</label>
                        {renderMultiInput('t', t, calculate, handleMultiUnitChange, showTimeError, "Time duration must be positive.")}
                    </div>

                    {/* Growth Rate */}
                    <InputBarWithDropDownOption
                        label="Growth rate"
                        value={r.value}
                        onChange={(e) => calculate('r', e.target.value)}
                        unit={r.unit}
                        onUnitChange={(e) => handleRateUnitChange(e.target.value)}
                        unitOptions={GROWTH_RATE_OPTIONS}
                        placeholder="Rate"
                        error={showRateError ? "Growth rate must be positive." : null}
                    />

                    {/* Doubling Time (Multi - Result) */}
                    <div className="input-block-wrapper result-bg">
                        <label className="input-label-std">Doubling time</label>
                        {renderMultiInput('g', g, calculate, handleMultiUnitChange)}
                    </div>

                    {/* Actions */}
                    <div className="actions-section">
                        <div className="utility-buttons">
                            <SimpleButton onClick={handleReload} variant="secondary">
                                <RotateCcw size={16} style={{ marginRight: 8 }} /> Reload calculator
                            </SimpleButton>
                            <SimpleButton onClick={handleClear} variant="secondary">
                                <Trash2 size={16} style={{ marginRight: 8 }} /> Clear all changes
                            </SimpleButton>
                        </div>
                    </div>

                </div>
            </div>
        </CalculatorLayout>
    );
};
export default CellDoublingTimeCalculatorPage;
