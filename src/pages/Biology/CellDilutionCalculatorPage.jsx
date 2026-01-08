import React, { useState } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import './CellDilutionCalculatorPage.css';

const CellDilutionCalculatorPage = () => {
    // --- Constants ---
    const CONC_FACTORS = {
        'cells / L': 0.001,
        'cells / ml': 1,
        'cells / µl': 1000,
        '10³ cells / ml': 1000,
        '10⁶ cells / ml': 1000000
    };

    const VOL_FACTORS = {
        'nl': 0.001,
        'µl': 1,
        'ml': 1000,
        'L': 1000000
    };

    // --- State ---
    const [c1, setC1] = useState({ value: '', unit: 'cells / ml', isManual: false });
    const [v1, setV1] = useState({ value: '', unit: 'ml', isManual: false });
    const [c2, setC2] = useState({ value: '', unit: 'cells / ml', isManual: false });
    const [v2, setV2] = useState({ value: '', unit: 'ml', isManual: false });

    // --- Helpers ---
    const formatValue = (val) => {
        if (val === null || isNaN(val) || val === Infinity) return '';
        if (val > 0 && (val < 0.001 || val > 1e9)) {
            return val.toExponential(4);
        }
        return parseFloat(val.toFixed(6)).toString();
    };

    // --- Calculation Logic ---
    const calculate = (changedField, newVal, newUnit) => {
        const state = {
            c1: { ...c1 },
            v1: { ...v1 },
            c2: { ...c2 },
            v2: { ...v2 }
        };

        // Update state with new input and mark as manual
        if (changedField === 'c1') {
            state.c1.value = newVal;
            state.c1.isManual = true;
            setC1(state.c1);
        } else if (changedField === 'c1-unit') {
            state.c1.unit = newUnit;
            setC1(state.c1);
        } else if (changedField === 'v1') {
            state.v1.value = newVal;
            state.v1.isManual = true;
            setV1(state.v1);
        } else if (changedField === 'v1-unit') {
            state.v1.unit = newUnit;
            setV1(state.v1);
        } else if (changedField === 'c2') {
            state.c2.value = newVal;
            state.c2.isManual = true;
            setC2(state.c2);
        } else if (changedField === 'c2-unit') {
            state.c2.unit = newUnit;
            setC2(state.c2);
        } else if (changedField === 'v2') {
            state.v2.value = newVal;
            state.v2.isManual = true;
            setV2(state.v2);
        } else if (changedField === 'v2-unit') {
            state.v2.unit = newUnit;
            setV2(state.v2);
        }

        const c1_base = parseFloat(state.c1.value) * CONC_FACTORS[state.c1.unit];
        const v1_base = parseFloat(state.v1.value) * VOL_FACTORS[state.v1.unit];
        const c2_base = parseFloat(state.c2.value) * CONC_FACTORS[state.c2.unit];
        const v2_base = parseFloat(state.v2.value) * VOL_FACTORS[state.v2.unit];

        // Solver logic
        if (changedField !== 'v2' && !isNaN(c1_base) && !isNaN(v1_base) && !isNaN(c2_base) && c2_base !== 0) {
            const res = (c1_base * v1_base) / c2_base;
            setV2(prev => ({ ...prev, value: formatValue(res / VOL_FACTORS[prev.unit]), isManual: false }));
        } else if (changedField !== 'c2' && !isNaN(c1_base) && !isNaN(v1_base) && !isNaN(v2_base) && v2_base !== 0) {
            const res = (c1_base * v1_base) / v2_base;
            setC2(prev => ({ ...prev, value: formatValue(res / CONC_FACTORS[prev.unit]), isManual: false }));
        } else if (changedField !== 'v1' && !isNaN(c1_base) && !isNaN(c2_base) && !isNaN(v2_base) && c1_base !== 0) {
            const res = (c2_base * v2_base) / c1_base;
            setV1(prev => ({ ...prev, value: formatValue(res / VOL_FACTORS[prev.unit]), isManual: false }));
        } else if (changedField !== 'c1' && !isNaN(v1_base) && !isNaN(c2_base) && !isNaN(v2_base) && v1_base !== 0) {
            const res = (c2_base * v2_base) / v1_base;
            setC1(prev => ({ ...prev, value: formatValue(res / CONC_FACTORS[prev.unit]), isManual: false }));
        }
    };

    const handleClear = () => {
        setC1({ value: '', unit: 'cells / ml', isManual: false });
        setV1({ value: '', unit: 'ml', isManual: false });
        setC2({ value: '', unit: 'cells / ml', isManual: false });
        setV2({ value: '', unit: 'ml', isManual: false });
    };

    const articleContent = (
        <div className="article-container">
            <h2 className="article-title">What is the cell dilution calculator?</h2>
            <p>If you want to know how to dilute your primary solution to receive the desired amount of cells in a set volume, this <strong>cell dilution calculator</strong> is just right for you! Apart from using this tool as a <strong>cell suspension dilution calculator</strong>, it can also be used as a <strong>cell concentration calculator</strong>.</p>

            <h2 className="article-title">How to calculate cell dilution?</h2>
            <p>The calculations are based on the main dilution formula:</p>
            <div className="premium-formula-box">
                <div className="math-latex">
                    C₁ · V₁ = C₂ · V₂
                </div>
            </div>
            <p>where:</p>
            <ul>
                <li><strong>C₁</strong> — Initial concentration of cells;</li>
                <li><strong>V₁</strong> — Volume of the initial suspension (stock);</li>
                <li><strong>C₂</strong> — Target (final) concentration of cells; and</li>
                <li><strong>V₂</strong> — Target (final) volume of suspension.</li>
            </ul>

            <h2 className="article-title">How to use the cell dilution calculator?</h2>
            <ol className="article-steps">
                <li>Enter the <strong>Initial concentration</strong> of your cell stock.</li>
                <li>Enter the <strong>Final concentration</strong> you want to achieve.</li>
                <li>Enter the <strong>Final volume</strong> needed for your experiment.</li>
                <li>The calculator will instantly show the <strong>Volume for suspension</strong> you need to take from your stock.</li>
            </ol>
            <div className="info-callout">
                <p>💡 <strong>Note:</strong> To find the volume of diluent (e.g., media or PBS) to add, simply subtract the volume for suspension from the final volume.</p>
            </div>
        </div>
    );

    return (
        <CalculatorLayout
            title="Cell Dilution Calculator"
            creators={[{ name: "Julia Kopczyńska", phd: true }]}
            reviewers={[{ name: "Anna Szczepanek", phd: true }, { name: "Steven Wooding" }]}
            articleContent={articleContent}
        >
            <div className="cell-dilution-calculator-page">
                <div className="section-card">
                    <div className="input-group">
                        <label className="input-label">Initial concentration</label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                className={`input-field ${!c1.isManual && c1.value ? 'calculated-value' : ''}`}
                                value={c1.value}
                                onChange={(e) => calculate('c1', e.target.value)}
                                placeholder="0"
                            />
                            <div className="unit-select-wrapper">
                                <select
                                    className="unit-select"
                                    value={c1.unit}
                                    onChange={(e) => calculate('c1-unit', e.target.value)}
                                >
                                    {Object.keys(CONC_FACTORS).map(u => <option key={u} value={u}>{u}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Volume for suspension</label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                className={`input-field ${!v1.isManual && v1.value ? 'calculated-value' : ''}`}
                                value={v1.value}
                                onChange={(e) => calculate('v1', e.target.value)}
                                placeholder="0"
                            />
                            <div className="unit-select-wrapper">
                                <select
                                    className="unit-select"
                                    value={v1.unit}
                                    onChange={(e) => calculate('v1-unit', e.target.value)}
                                >
                                    {Object.keys(VOL_FACTORS).map(u => <option key={u} value={u}>{u}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Final concentration</label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                className={`input-field ${!c2.isManual && c2.value ? 'calculated-value' : ''}`}
                                value={c2.value}
                                onChange={(e) => calculate('c2', e.target.value)}
                                placeholder="0"
                            />
                            <div className="unit-select-wrapper">
                                <select
                                    className="unit-select"
                                    value={c2.unit}
                                    onChange={(e) => calculate('c2-unit', e.target.value)}
                                >
                                    {Object.keys(CONC_FACTORS).map(u => <option key={u} value={u}>{u}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Final volume</label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                className={`input-field ${!v2.isManual && v2.value ? 'calculated-value' : ''}`}
                                value={v2.value}
                                onChange={(e) => calculate('v2', e.target.value)}
                                placeholder="0"
                            />
                            <div className="unit-select-wrapper">
                                <select
                                    className="unit-select"
                                    value={v2.unit}
                                    onChange={(e) => calculate('v2-unit', e.target.value)}
                                >
                                    {Object.keys(VOL_FACTORS).map(u => <option key={u} value={u}>{u}</option>)}
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

export default CellDilutionCalculatorPage;
