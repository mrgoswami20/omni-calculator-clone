import React, { useState } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Info } from 'lucide-react';
import './CellDoublingTimeCalculatorPage.css';

const CellDoublingTimeCalculatorPage = () => {
    // --- Constants ---
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
    const toBase = (val) => {
        const v = parseFloat(val);
        if (isNaN(v)) return null;
        return v;
    };

    const toBaseMulti = (valObj, unit) => {
        const components = MULTI_UNIT_CONFIG[unit] || [];
        let totalVal = 0;
        let hasValue = false;
        components.forEach(comp => {
            const v = parseFloat(valObj[comp]);
            if (!isNaN(v)) {
                totalVal += v * TIME_FACTORS[comp];
                hasValue = true;
            }
        });
        return hasValue ? totalVal : null;
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
        // Use exponential notation for very large or small numbers
        if (val > 0 && (val < 0.001 || val > 1e9)) {
            return val.toExponential(4);
        }
        return parseFloat(val.toFixed(6)).toString();
    };

    // --- Calculation Logic ---
    const calculate = (changedType, newValue, unitKey) => {
        const updates = { n0, n, t, r, g };

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

        // Sync local state immediately
        if (changedType === 'n0') setN0(updates.n0);
        if (changedType === 'n') setN(updates.n);
        if (changedType === 'r') setR(updates.r);
        if (changedType === 't') setT(updates.t);
        if (changedType === 'g') setG(updates.g);

        const n0_val = parseFloat(updates.n0.value);
        const n_val = parseFloat(updates.n.value);
        const t_val = toBaseMulti(updates.t.value, updates.t.unit); // in seconds

        let k; // growth rate in 1/sec
        if (changedType === 'n0' || changedType === 'n' || changedType === 't') {
            if (n0_val > 0 && n_val > 0 && t_val > 0 && n_val > n0_val) {
                k = Math.log(n_val / n0_val) / t_val;
            }
        } else if (changedType === 'r') {
            const r_val = parseFloat(newValue);
            if (r_val > 0) {
                const unit_multiplier = GROWTH_RATE_UNITS[updates.r.unit];
                k = r_val / unit_multiplier;
            }
        } else if (changedType === 'g') {
            const g_val = toBaseMulti(newValue, newUnit);
            if (g_val > 0) {
                k = Math.log(2) / g_val;
            }
        }

        if (k > 0) {
            // Update other fields
            if (changedType !== 'r') {
                const r_new = k * GROWTH_RATE_UNITS[updates.r.unit];
                setR({ ...updates.r, value: formatValue(r_new) });
            }

            const doubling_time_sec = Math.log(2) / k;
            if (changedType !== 'g') {
                const res_g_obj = fromBaseMulti(doubling_time_sec, updates.g.unit);
                setG({ ...updates.g, value: res_g_obj });
            }

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

    const handleClear = () => {
        const emptyValObj = { yrs: '', mos: '', wks: '', days: '', hrs: '', min: '', sec: '' };
        setN0({ value: '', unit: 'cells' });
        setN({ value: '', unit: 'cells' });
        setT(p => ({ ...p, value: emptyValObj }));
        setR(p => ({ ...p, value: '' }));
        setG(p => ({ ...p, value: emptyValObj }));
    };

    const articleContent = (
        <div className="article-container">
            <h2 className="article-title">How to calculate doubling time of cells?</h2>
            <p>To calculate the doubling time of cells, use the following formula:</p>

            <div className="premium-formula-box">
                <div className="math-latex">
                    Doubling time = <span className="fraction">
                        <span className="numerator">Duration · ln(2)</span>
                        <span className="denominator">ln(<span className="fraction-inline"><span className="num-inline">Final concentration</span><hr /><span className="den-inline">Initial concentration</span></span>)</span>
                    </span>
                </div>
            </div>

            <p>To use this cell culture doubling time formula, you need to:</p>
            <ol className="article-steps">
                <li>Select a reference parameter. It can be the number of cells, concentration, or confluency. Measure it at the beginning of an experiment.</li>
                <li>Wait for a certain period. Depending on the cell type and culture conditions, it can be a few minutes, hours, or days.</li>
                <li>Check chosen parameter after a suitable period.</li>
                <li>Calculate the doubling time.</li>
            </ol>

            <div className="info-callout">
                <p>💡 <strong>Concentration</strong> is the number of cells per unit of volume (i.e., cells/ml). You can find it, for example, by using a hemocytometer like the Bürker counting chamber. <strong>Confluency</strong> is the percentage coverage of a container surface. This parameter can be found only for adherent cells.</p>
            </div>
        </div>
    );

    // renderInput function is removed as per the new UI structure

    return (
        <CalculatorLayout
            title="Cell Doubling Time Calculator"
            creators={[{ name: "Bogna Szyk" }]}
            reviewers={[{ name: "Jack Bowater" }]}
            articleContent={articleContent}
        >
            <div className="cell-doubling-time-calculator-page">
                <div className="section-card">
                    {/* Initial Parameter */}
                    <div className="input-group">
                        <label className="input-label">
                            Initial reference parameter <Info size={14} className="info-icon" title="Initial number, concentration, or confluency" />
                        </label>
                        <div className="input-wrapper single-field">
                            <input
                                type="text"
                                className="input-field full-round"
                                value={n0.value}
                                onChange={(e) => calculate('n0', e.target.value, n0.unit)}
                            />
                        </div>
                    </div>

                    {/* Final Parameter */}
                    <div className="input-group">
                        <label className="input-label">Final reference parameter</label>
                        <div className="input-wrapper single-field">
                            <input
                                type="text"
                                className="input-field full-round"
                                value={n.value}
                                onChange={(e) => calculate('n', e.target.value, n.unit)}
                            />
                        </div>
                    </div>

                    {/* Time duration */}
                    <div className="input-group">
                        <label className="input-label">Time duration</label>
                        <div className="input-wrapper multi-part-container time-duration-wrapper">
                            <div className="multi-field-layout">
                                {MULTI_UNIT_CONFIG[t.unit].map(comp => (
                                    <div className="field-with-label" key={comp}>
                                        <input
                                            type="text"
                                            className="input-field"
                                            value={t.value[comp]}
                                            onChange={(e) => calculate('t', e.target.value, comp)}
                                        />
                                        <span className="part-label">{comp}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="unit-select-wrapper">
                                <select
                                    className="unit-select"
                                    value={t.unit}
                                    onChange={(e) => {
                                        const newUnit = e.target.value;
                                        const baseVal = toBaseMulti(t.value, t.unit);
                                        const newValObj = fromBaseMulti(baseVal, newUnit);
                                        setT({ ...t, value: newValObj, unit: newUnit });
                                    }}
                                >
                                    {Object.keys(MULTI_UNIT_CONFIG).map(u => <option key={u} value={u}>{u}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Growth rate */}
                    <div className="input-group">
                        <label className="input-label">Growth rate</label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                className="input-field"
                                value={r.value}
                                onChange={(e) => calculate('r', e.target.value, r.unit)}
                            />
                            <div className="unit-select-wrapper">
                                <select
                                    className="unit-select"
                                    value={r.unit}
                                    onChange={(e) => {
                                        const newUnit = e.target.value;
                                        const k = parseFloat(r.value) / GROWTH_RATE_UNITS[r.unit];
                                        const newVal = r.value !== '' ? formatValue(k * GROWTH_RATE_UNITS[newUnit]) : '';
                                        setR({ ...r, value: newVal, unit: newUnit });
                                    }}
                                >
                                    {Object.keys(GROWTH_RATE_UNITS).map(u => <option key={u} value={u}>/ {u}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Doubling time */}
                    <div className="input-group">
                        <label className="input-label">Doubling time</label>
                        <div className="input-wrapper multi-part-container">
                            <div className="multi-field-layout">
                                {MULTI_UNIT_CONFIG[g.unit].map(comp => (
                                    <div className="field-with-label" key={comp}>
                                        <input
                                            type="text"
                                            className="input-field"
                                            value={g.value[comp]}
                                            onChange={(e) => calculate('g', e.target.value, comp)}
                                        />
                                        <span className="part-label">{comp}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="unit-select-wrapper">
                                <select
                                    className="unit-select"
                                    value={g.unit}
                                    onChange={(e) => {
                                        const newUnit = e.target.value;
                                        const baseVal = toBaseMulti(g.value, g.unit);
                                        const newValObj = fromBaseMulti(baseVal, newUnit);
                                        setG({ ...g, value: newValObj, unit: newUnit });
                                    }}
                                >
                                    {Object.keys(MULTI_UNIT_CONFIG).map(u => <option key={u} value={u}>{u}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="divider-custom"></div>

                    <div className="calc-actions-custom-layout">
                        {/* <button className="share-result-btn">
                            <div className="share-icon-circle">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
                                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92z"/>
                                </svg>
                            </div>
                            Share result
                        </button> */}
                        <div className="side-actions">
                            <button className="action-btn-styled" onClick={() => window.location.reload()}>Reload calculator</button>
                            <button className="action-btn-styled outline" onClick={handleClear}>Clear all changes</button>
                        </div>
                    </div>

                    <div className="feedback-section-new">
                        <p>Did we solve your problem today?</p>
                        <div className="feedback-btns-new">
                            <button className="feedback-btn"><span className="icon">👍</span> Yes</button>
                            <button className="feedback-btn"><span className="icon">👎</span> No</button>
                        </div>
                    </div>
                </div>
            </div>
        </CalculatorLayout>
    );
};

export default CellDoublingTimeCalculatorPage;
