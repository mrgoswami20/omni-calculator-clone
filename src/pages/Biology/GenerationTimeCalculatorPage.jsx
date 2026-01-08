import React, { useState } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Info } from 'lucide-react';
import './GenerationTimeCalculatorPage.css';

const GenerationTimeCalculatorPage = () => {
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
    const [nt, setNt] = useState({ value: '', unit: 'cells' });
    const [t, setT] = useState({
        value: { yrs: '', mos: '', wks: '', days: '', hrs: '', min: '', sec: '' },
        unit: 'hours (hrs)'
    });
    const [r, setR] = useState({ value: '', unit: 'hr' });
    const [td, setTd] = useState({
        value: { yrs: '', mos: '', wks: '', days: '', hrs: '', min: '', sec: '' },
        unit: 'hours (hrs)'
    });

    // --- Helpers ---
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
        if (valInSec === null || isNaN(valInSec) || valInSec === Infinity || valInSec <= 0) {
            return { yrs: '', mos: '', wks: '', days: '', hrs: '', min: '', sec: '' };
        }

        const components = MULTI_UNIT_CONFIG[unit] || [];
        let remaining = valInSec;
        const result = { yrs: '', mos: '', wks: '', days: '', hrs: '', min: '', sec: '' };

        components.forEach((comp, idx) => {
            const factor = TIME_FACTORS[comp];
            if (idx === components.length - 1) {
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
        if (val > 0 && (val < 0.001 || val > 1e9)) {
            return val.toExponential(4);
        }
        return parseFloat(val.toFixed(6)).toString();
    };

    // --- Calculation Logic ---
    const calculate = (changedType, newValue, unitKey) => {
        const updates = {
            n0: { ...n0 },
            nt: { ...nt },
            t: { ...t, value: { ...t.value } },
            r: { ...r },
            td: { ...td, value: { ...td.value } }
        };

        if (changedType === 'n0') updates.n0.value = newValue;
        if (changedType === 'nt') updates.nt.value = newValue;
        if (changedType === 'r') updates.r.value = newValue;
        if (changedType === 't') updates.t.value[unitKey] = newValue;
        if (changedType === 'td') updates.td.value[unitKey] = newValue;

        // Sync local state immediately
        setN0(updates.n0);
        setNt(updates.nt);
        setR(updates.r);
        setT(updates.t);
        setTd(updates.td);

        const n0_val = parseFloat(updates.n0.value);
        const nt_val = parseFloat(updates.nt.value);
        const t_sec = toBaseMulti(updates.t.value, updates.t.unit);
        const r_val = parseFloat(updates.r.value);
        const td_sec = toBaseMulti(updates.td.value, updates.td.unit);

        let derivedRatePerSec = null;

        if (changedType === 'n0' || changedType === 'nt' || changedType === 't') {
            if (n0_val > 0 && nt_val > 0 && t_sec > 0) {
                if (nt_val >= n0_val) {
                    derivedRatePerSec = Math.pow(nt_val / n0_val, 1 / t_sec) - 1;
                }
            }
        }

        if (changedType === 'r') {
            if (!isNaN(r_val)) {
                const unit_sec = GROWTH_RATE_UNITS[updates.r.unit];
                // r_val is percentage, e.g., 5 for 5%. Convert to decimal 0.05
                const r_decimal = r_val / 100;
                if (r_decimal > -1) {
                    derivedRatePerSec = Math.pow(1 + r_decimal, 1 / unit_sec) - 1;
                }
            }
        }

        if (changedType === 'td') {
            if (td_sec > 0) {
                derivedRatePerSec = Math.pow(2, 1 / td_sec) - 1;
            }
        }

        if (derivedRatePerSec !== null && !isNaN(derivedRatePerSec)) {
            if (changedType !== 'r') {
                const unit_sec = GROWTH_RATE_UNITS[updates.r.unit];
                const r_new = (Math.pow(1 + derivedRatePerSec, unit_sec) - 1) * 100;
                setR(prev => ({ ...prev, value: formatValue(r_new) }));
            }

            if (changedType !== 'td') {
                const td_new_sec = Math.log(2) / Math.log(1 + derivedRatePerSec);
                setTd(prev => ({ ...prev, value: fromBaseMulti(td_new_sec, updates.td.unit) }));
            }

            if (changedType !== 'nt' && n0_val > 0 && t_sec > 0) {
                const nt_new = n0_val * Math.pow(1 + derivedRatePerSec, t_sec);
                setNt(prev => ({ ...prev, value: formatValue(nt_new) }));
            }

            if (changedType !== 'n0' && nt_val > 0 && t_sec > 0) {
                const n0_new = nt_val / Math.pow(1 + derivedRatePerSec, t_sec);
                setN0(prev => ({ ...prev, value: formatValue(n0_new) }));
            }
        } else {
            // Clearing logic: if input is cleared, clear related outputs
            if (changedType === 'n0' || changedType === 'nt' || changedType === 't') {
                if (changedType !== 'r') setR(prev => ({ ...prev, value: '' }));
                if (changedType !== 'td') setTd(prev => ({ ...prev, value: fromBaseMulti(null, updates.td.unit) }));
            }

            // Secondary path: calculate N0/Nt from r if t is present but Nt/N0 is missing
            if (changedType === 't' && !isNaN(r_val)) {
                const unit_sec = GROWTH_RATE_UNITS[updates.r.unit];
                const r_per_sec = Math.pow(1 + (r_val / 100), 1 / unit_sec) - 1;
                if (n0_val > 0 && t_sec > 0) {
                    setNt(prev => ({ ...prev, value: formatValue(n0_val * Math.pow(1 + r_per_sec, t_sec)) }));
                } else if (nt_val > 0 && t_sec > 0) {
                    setN0(prev => ({ ...prev, value: formatValue(nt_val / Math.pow(1 + r_per_sec, t_sec)) }));
                }
            }
        }
    };

    const handleClear = () => {
        const emptyValObj = { yrs: '', mos: '', wks: '', days: '', hrs: '', min: '', sec: '' };
        setN0({ value: '', unit: 'cells' });
        setNt({ value: '', unit: 'cells' });
        setT(p => ({ ...p, value: { ...emptyValObj } }));
        setR(p => ({ ...p, value: '' }));
        setTd(p => ({ ...p, value: { ...emptyValObj } }));
    };

    const articleContent = (
        <div className="article-container">
            <h2 className="article-title">How do we calculate the generation time of bacteria?</h2>
            <p>The equation that controls the exponential growth is:</p>
            <div className="premium-formula-box">
                <div className="math-latex">
                    N(t) = N(t₀) · (1 + r)<sup>t - t₀</sup>
                </div>
            </div>
            <p>where:</p>
            <ul className="article-steps">
                <li><strong>N(t)</strong> — Population at time t;</li>
                <li><strong>N(t₀)</strong> — Initial number of bacteria at starting time t₀;</li>
                <li><strong>r</strong> — Growth rate (percentage increment per time unit); and</li>
                <li><strong>t - t₀</strong> — Elapsed time.</li>
            </ul>
            <p>Often, the time t₀ is set to 0, which simplifies the equation to:</p>
            <div className="premium-formula-box">
                <div className="math-latex">
                    N(t) = N(0) · (1 + r)<sup>t</sup>
                </div>
            </div>
            <p>To calculate the bacterial growth rate, r, we rearrange the formula:</p>
            <div className="premium-formula-box">
                <div className="math-latex">
                    r = [(N(t) / N(0))<sup>1/t</sup> - 1] × 100%
                </div>
            </div>
            <h2 className="article-title">What is generation time?</h2>
            <p>The generation time (t<sub>d</sub>) is the required time for the population to double in size through binary fission:</p>
            <div className="premium-formula-box">
                <div className="math-latex">
                    t<sub>d</sub> = ln(2) / ln(1 + r) = t · ln(2) / ln(N(t) / N(0))
                </div>
            </div>
        </div>
    );

    return (
        <CalculatorLayout
            title="Generation Time Calculator"
            creators={[{ name: "Davide Borchia" }]}
            reviewers={[{ name: "Hanna Pamula", phd: true }, { name: "Jack Bowater" }]}
            articleContent={articleContent}
        >
            <div className="generation-time-calculator-page">
                <div className="section-card">
                    <div className="input-group">
                        <label className="input-label">Initial number of bacteria — N(0)</label>
                        <div className="input-wrapper single-field">
                            <input
                                type="text"
                                className="input-field full-round"
                                value={n0.value}
                                onChange={(e) => calculate('n0', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Final number of bacteria — N(t)</label>
                        <div className="input-wrapper single-field">
                            <input
                                type="text"
                                className="input-field full-round"
                                value={nt.value}
                                onChange={(e) => calculate('nt', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Elapsed time</label>
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

                    <div className="input-group">
                        <label className="input-label">Growth rate (r) [%]</label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                className="input-field"
                                value={r.value}
                                onChange={(e) => calculate('r', e.target.value)}
                            />
                            <div className="unit-select-wrapper">
                                <select
                                    className="unit-select"
                                    value={r.unit}
                                    onChange={(e) => {
                                        const newUnit = e.target.value;
                                        const r_val = parseFloat(r.value);
                                        if (!isNaN(r_val)) {
                                            const unit_sec = GROWTH_RATE_UNITS[r.unit];
                                            const rate_per_sec = Math.pow(1 + (r_val / 100), 1 / unit_sec) - 1;
                                            const new_unit_sec = GROWTH_RATE_UNITS[newUnit];
                                            const r_new = (Math.pow(1 + rate_per_sec, new_unit_sec) - 1) * 100;
                                            setR({ ...r, value: formatValue(r_new), unit: newUnit });
                                        } else {
                                            setR({ ...r, unit: newUnit });
                                        }
                                    }}
                                >
                                    {Object.keys(GROWTH_RATE_UNITS).map(u => <option key={u} value={u}>/ {u}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Doubling time (Td)</label>
                        <div className="input-wrapper multi-part-container">
                            <div className="multi-field-layout">
                                {MULTI_UNIT_CONFIG[td.unit].map(comp => (
                                    <div className="field-with-label" key={comp}>
                                        <input
                                            type="text"
                                            className="input-field"
                                            value={td.value[comp]}
                                            onChange={(e) => calculate('td', e.target.value, comp)}
                                        />
                                        <span className="part-label">{comp}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="unit-select-wrapper">
                                <select
                                    className="unit-select"
                                    value={td.unit}
                                    onChange={(e) => {
                                        const newUnit = e.target.value;
                                        const baseVal = toBaseMulti(td.value, td.unit);
                                        const newValObj = fromBaseMulti(baseVal, newUnit);
                                        setTd({ ...td, value: newValObj, unit: newUnit });
                                    }}
                                >
                                    {Object.keys(MULTI_UNIT_CONFIG).map(u => <option key={u} value={u}>{u}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="divider-custom"></div>
                    <div className="calc-actions-custom-layout">
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

export default GenerationTimeCalculatorPage;
