import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Info } from 'lucide-react';
import './LogReductionCalculatorPage.css';

const LogReductionCalculatorPage = () => {
    // --- State ---
    const [initialCfu, setInitialCfu] = useState({ value: '', multiplier: '7', isManual: true });
    const [finalCfu, setFinalCfu] = useState({ value: '', multiplier: '5', isManual: true });
    const [logReduction, setLogReduction] = useState({ value: '', isManual: true });
    const [percentageReduction, setPercentageReduction] = useState({ value: '', isManual: true });

    // --- Helpers ---
    const formatValue = (val, precision = 6) => {
        if (val === null || isNaN(val) || val === Infinity || val === -Infinity) return '';
        if (val === 0) return '0';
        if (Math.abs(val) < 0.0001 || Math.abs(val) > 1e9) {
            return val.toExponential(4);
        }
        return parseFloat(val.toFixed(precision)).toString();
    };

    const getFullValue = (cfu) => {
        return parseFloat(cfu.value) * Math.pow(10, parseInt(cfu.multiplier));
    };

    // --- Calculation Logic ---
    const calculate = (changedField, newVal, newMultiplier) => {
        let currentInitial = { ...initialCfu };
        let currentFinal = { ...finalCfu };
        let currentLog = { ...logReduction };
        let currentPercent = { ...percentageReduction };

        // 1. Update the changed field
        if (changedField === 'initial-cfu') {
            currentInitial.value = newVal;
            currentInitial.isManual = true;
            setInitialCfu(currentInitial);
        } else if (changedField === 'initial-multiplier') {
            currentInitial.multiplier = newMultiplier;
            setInitialCfu(currentInitial);
        } else if (changedField === 'final-cfu') {
            currentFinal.value = newVal;
            currentFinal.isManual = true;
            setFinalCfu(currentFinal);
        } else if (changedField === 'final-multiplier') {
            currentFinal.multiplier = newMultiplier;
            setFinalCfu(currentFinal);
        } else if (changedField === 'log-reduction') {
            currentLog.value = newVal;
            currentLog.isManual = true;
            setLogReduction(currentLog);
        } else if (changedField === 'percentage-reduction') {
            currentPercent.value = newVal;
            currentPercent.isManual = true;
            setPercentageReduction(currentPercent);
        }

        // 2. Solve for other fields
        const c1 = getFullValue(currentInitial);
        const c2 = getFullValue(currentFinal);
        const log = parseFloat(currentLog.value);
        const pct = parseFloat(currentPercent.value);

        let final_c1 = c1, final_c2 = c2, final_log = log, final_pct = pct;

        if (changedField === 'initial-cfu' || changedField === 'initial-multiplier' || changedField === 'final-cfu' || changedField === 'final-multiplier') {
            if (c1 > 0 && c2 > 0) {
                final_log = Math.log10(c1 / c2);
                final_pct = 100 * (1 - c2 / c1);
                setLogReduction({ value: formatValue(final_log, 4), isManual: false });
                setPercentageReduction({ value: formatValue(final_pct, 4), isManual: false });
            }
        }
        else if (changedField === 'log-reduction') {
            if (!isNaN(log)) {
                if (c1 > 0) {
                    final_c2 = c1 / Math.pow(10, log);
                    // Update final CFU: keep multiplier if possible or adjust
                    const exp = Math.floor(Math.log10(final_c2));
                    const base = final_c2 / Math.pow(10, exp);
                    setFinalCfu({ value: formatValue(base, 4), multiplier: exp.toString(), isManual: false });
                } else if (c2 > 0) {
                    final_c1 = c2 * Math.pow(10, log);
                    const exp = Math.floor(Math.log10(final_c1));
                    const base = final_c1 / Math.pow(10, exp);
                    setInitialCfu({ value: formatValue(base, 4), multiplier: exp.toString(), isManual: false });
                }
                final_pct = 100 * (1 - 1 / Math.pow(10, log));
                setPercentageReduction({ value: formatValue(final_pct, 6), isManual: false });
            }
        }
        else if (changedField === 'percentage-reduction') {
            if (!isNaN(pct) && pct < 100) {
                const ratio = 1 - pct / 100;
                if (c1 > 0) {
                    final_c2 = c1 * ratio;
                    const exp = Math.floor(Math.log10(final_c2));
                    const base = final_c2 / Math.pow(10, exp);
                    setFinalCfu({ value: formatValue(base, 4), multiplier: exp.toString(), isManual: false });
                } else if (c2 > 0) {
                    final_c1 = c2 / ratio;
                    const exp = Math.floor(Math.log10(final_c1));
                    const base = final_c1 / Math.pow(10, exp);
                    setInitialCfu({ value: formatValue(base, 4), multiplier: exp.toString(), isManual: false });
                }
                final_log = -Math.log10(ratio);
                setLogReduction({ value: formatValue(final_log, 4), isManual: false });
            }
        }
    };

    const handleClear = () => {
        setInitialCfu({ value: '', multiplier: '7', isManual: true });
        setFinalCfu({ value: '', multiplier: '5', isManual: true });
        setLogReduction({ value: '', isManual: true });
        setPercentageReduction({ value: '', isManual: true });
    };

    const multipliers = Array.from({ length: 16 }, (_, i) => i.toString());

    const articleContent = (
        <div className="article-container">
            <h2 className="article-title">What is log reduction?</h2>
            <p>Log reduction calculator provides a simple method to calculate the efficacy of disinfectants such as alcohol or bleach. This tool compares the number of microorganisms in a sample before and after the treatment. The collected results are then expressed as a percentage and as on the <strong>logarithmic scale</strong>. A higher result means that the given agent has a higher efficacy.</p>

            <h2 className="article-title">Log Reduction Formula</h2>
            <p>This log reduction calculator uses the following formula to determine log reduction:</p>
            <div className="premium-formula-box">
                <div className="math-latex">
                    log reduction = log₁₀(initial CFU / final CFU)
                </div>
            </div>

            <p>To translate calculated log reductions to percentage values, we utilized this equation:</p>
            <div className="premium-formula-box">
                <div className="math-latex">
                    percentage reduction = 100 · (initial CFU - final CFU) / initial CFU
                </div>
            </div>

            <h2 className="article-title">Comparison Table</h2>
            <div className="comparison-table-wrapper">
                <table className="comparison-table">
                    <thead>
                        <tr>
                            <th>Log reduction</th>
                            <th>Percentage reduction</th>
                            <th>CFU remaining (from 10⁶)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>0 log reduction</td><td>0%</td><td>1,000,000</td></tr>
                        <tr><td>1 log reduction</td><td>90%</td><td>100,000</td></tr>
                        <tr><td>2 log reduction</td><td>99%</td><td>10,000</td></tr>
                        <tr><td>3 log reduction</td><td>99.9%</td><td>1,000</td></tr>
                        <tr><td>4 log reduction</td><td>99.99%</td><td>100</td></tr>
                        <tr><td>5 log reduction</td><td>99.999%</td><td>10</td></tr>
                    </tbody>
                </table>
            </div>

            <div className="info-callout">
                <p>💡 <strong>Pro Tip:</strong> Most hospital-grade disinfectants aim for a "5-log reduction" or higher, meaning 99.999% of germs are killed.</p>
            </div>
        </div>
    );

    return (
        <CalculatorLayout
            title="Log Reduction Calculator"
            creators={[{ name: "Przemysław Trzepiński" }]}
            reviewers={[{ name: "Hanna Pamuła", phd: true }, { name: "Jack Bowater" }]}
            articleContent={articleContent}
        >
            <div className="log-reduction-calculator-page">
                <div className="section-card">
                    {/* Initial CFU */}
                    <div className="input-group">
                        <label className="input-label">Initial CFU amount <Info size={14} className="info-icon" title="Colony Forming Units before treatment" /></label>
                        <div className="input-wrapper scientific-notation">
                            <input
                                type="text"
                                className={`input-field ${!initialCfu.isManual ? 'calculated-value' : ''}`}
                                value={initialCfu.value}
                                onChange={(e) => calculate('initial-cfu', e.target.value)}
                                placeholder="1"
                            />
                            <div className="multiplier-select-wrapper">
                                <span className="multiplier-symbol">× 10</span>
                                <select
                                    className="multiplier-select"
                                    value={initialCfu.multiplier}
                                    onChange={(e) => calculate('initial-multiplier', '', e.target.value)}
                                >
                                    {multipliers.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>
                            <span className="unit-label-static">CFU</span>
                        </div>
                    </div>

                    {/* Final CFU */}
                    <div className="input-group">
                        <label className="input-label">Final CFU amount <Info size={14} className="info-icon" title="Colony Forming Units after treatment" /></label>
                        <div className="input-wrapper scientific-notation">
                            <input
                                type="text"
                                className={`input-field ${!finalCfu.isManual ? 'calculated-value' : ''}`}
                                value={finalCfu.value}
                                onChange={(e) => calculate('final-cfu', e.target.value)}
                                placeholder="1"
                            />
                            <div className="multiplier-select-wrapper">
                                <span className="multiplier-symbol">× 10</span>
                                <select
                                    className="multiplier-select"
                                    value={finalCfu.multiplier}
                                    onChange={(e) => calculate('final-multiplier', '', e.target.value)}
                                >
                                    {multipliers.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>
                            <span className="unit-label-static">CFU</span>
                        </div>
                    </div>

                    {/* Log Reduction */}
                    <div className="input-group">
                        <label className="input-label">Log reduction</label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                className={`input-field ${!logReduction.isManual ? 'calculated-value' : ''}`}
                                value={logReduction.value}
                                onChange={(e) => calculate('log-reduction', e.target.value)}
                                placeholder="0"
                            />
                        </div>
                    </div>

                    {/* Percentage Reduction */}
                    <div className="input-group">
                        <label className="input-label">Percentage reduction</label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                className={`input-field ${!percentageReduction.isManual ? 'calculated-value' : ''}`}
                                value={percentageReduction.value}
                                onChange={(e) => calculate('percentage-reduction', e.target.value)}
                                placeholder="0"
                            />
                            <span className="unit-label-static pct-label">%</span>
                        </div>
                    </div>

                    <div className="divider-custom"></div>
                    <div className="calc-actions-custom-layout">
                        <div className="side-actions">
                            <button className="action-btn-styled" onClick={() => window.location.reload()}>Reload calculator</button>
                            <button className="action-btn-styled outline" onClick={handleClear}>Clear all changes</button>
                        </div>
                    </div>

                </div>
            </div>
        </CalculatorLayout>
    );
};

export default LogReductionCalculatorPage;
