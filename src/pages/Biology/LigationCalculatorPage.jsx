import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Info } from 'lucide-react';
import './LigationCalculatorPage.css';

const LigationCalculatorPage = () => {
    // --- Constants ---
    const LENGTH_UNITS = {
        'bp': 1,
        'kb': 1000
    };

    const MASS_UNITS = {
        'ng': 1,
        'µg': 1000
    };

    const RATIO_OPTIONS = [
        { label: '1:1', value: 1 },
        { label: '2:1', value: 2 },
        { label: '3:1', value: 3 },
        { label: '4:1', value: 4 },
        { label: '5:1', value: 5 },
        { label: '7:1', value: 7 },
        { label: '10:1', value: 10 }
    ];

    // --- State ---
    const [insertLength, setInsertLength] = useState({ value: '', unit: 'bp' });
    const [vectorLength, setVectorLength] = useState({ value: '', unit: 'bp' });
    const [vectorMass, setVectorMass] = useState({ value: '', unit: 'ng' });
    const [molarRatio, setMolarRatio] = useState(3); // Default 3:1
    const [insertMass, setInsertMass] = useState({ value: '', unit: 'ng' });

    // --- Helpers ---
    const formatValue = (val) => {
        if (val === null || isNaN(val) || val === Infinity) return '';
        if (val > 0 && (val < 0.01 || val > 1e6)) {
            return val.toExponential(3);
        }
        return parseFloat(val.toFixed(3)).toString();
    };

    // --- Calculation Logic ---
    const calculate = (changedField, newVal, newUnit) => {
        const state = {
            il: { ...insertLength },
            vl: { ...vectorLength },
            vm: { ...vectorMass },
            ratio: molarRatio,
            im: { ...insertMass }
        };

        if (changedField === 'il') {
            state.il.value = newVal;
            setInsertLength(state.il);
        }
        if (changedField === 'il-unit') {
            state.il.unit = newUnit;
            setInsertLength(state.il);
        }
        if (changedField === 'vl') {
            state.vl.value = newVal;
            setVectorLength(state.vl);
        }
        if (changedField === 'vl-unit') {
            state.vl.unit = newUnit;
            setVectorLength(state.vl);
        }
        if (changedField === 'vm') {
            state.vm.value = newVal;
            setVectorMass(state.vm);
        }
        if (changedField === 'vm-unit') {
            state.vm.unit = newUnit;
            setVectorMass(state.vm);
        }
        if (changedField === 'ratio') {
            state.ratio = newVal;
            setMolarRatio(newVal);
        }
        if (changedField === 'im') {
            state.im.value = newVal;
            setInsertMass(state.im);
        }
        if (changedField === 'im-unit') {
            state.im.unit = newUnit;
            setInsertMass(state.im);
        }

        // --- Execute Calculation ---
        const il_bp = parseFloat(state.il.value) * LENGTH_UNITS[state.il.unit];
        const vl_bp = parseFloat(state.vl.value) * LENGTH_UNITS[state.vl.unit];
        const vm_ng = parseFloat(state.vm.value) * MASS_UNITS[state.vm.unit];
        const ratio = state.ratio;
        const im_ng = parseFloat(state.im.value) * MASS_UNITS[state.im.unit];

        if (changedField !== 'im' && changedField !== 'im-unit') {
            // Calculate Insert Mass
            if (il_bp > 0 && vl_bp > 0 && vm_ng > 0) {
                const res = (il_bp / vl_bp) * vm_ng * ratio;
                setInsertMass(prev => ({ ...prev, value: formatValue(res / MASS_UNITS[prev.unit]) }));
            } else if (changedField === 'il' || changedField === 'vl' || changedField === 'vm') {
                if (newVal === '') setInsertMass(prev => ({ ...prev, value: '' }));
            }
        } else if (changedField === 'im') {
            // Calculate Vector Mass if Insert Mass is provided
            if (il_bp > 0 && vl_bp > 0 && im_ng > 0) {
                const res = im_ng / ((il_bp / vl_bp) * ratio);
                setVectorMass(prev => ({ ...prev, value: formatValue(res / MASS_UNITS[prev.unit]) }));
            }
        }
    };

    const handleClear = () => {
        setInsertLength({ value: '', unit: 'bp' });
        setVectorLength({ value: '', unit: 'bp' });
        setVectorMass({ value: '', unit: 'ng' });
        setMolarRatio(3);
        setInsertMass({ value: '', unit: 'ng' });
    };

    const articleContent = (
        <div className="article-container">
            <h2 className="article-title">How to use the ligation calculator?</h2>
            <p>If you were looking for the NEB ligation calculator - you've just found something better. You're just a few simple steps away from your solution:</p>
            <ol className="article-steps">
                <li>Enter your <strong>insert length</strong> - in either base pairs (bp) or kilobases (kb).</li>
                <li>Enter your <strong>vector length</strong> - in either base pairs (bp) or kilobases (kb).</li>
            </ol>
            <div className="info-callout">
                <p>💡 Converting these two values is not too tricky:</p>
                <ul>
                    <li>1000 bp = 1 kb</li>
                    <li>1 bp = 0.001 kb</li>
                </ul>
            </div>
            <ol className="article-steps" start="3">
                <li>Enter your <strong>vector mass</strong> - in either nanograms (ng) or micrograms (µg).</li>
                <li>Choose the <strong>insert/vector molar ratio</strong>. The ideal ratio is 3:1. A larger amount of insert increases your chances of a successful cloning reaction.</li>
                <li>In this particular situation, your result will be the <strong>insert mass</strong> needed for the reaction.</li>
            </ol>
            <p>We recommend that you <strong>add at least 50 ng of insert</strong>.</p>

            <h2 className="article-title">How to calculate the molar ratio?</h2>
            <p>The ligation calculator uses the following formula to determine the amount of insert needed for a ligation reaction:</p>
            <div className="premium-formula-box">
                <div className="math-latex">
                    insert mass = ratio · vector mass · (insert length / vector length)
                </div>
            </div>
            <p>where:</p>
            <ul>
                <li><strong>insert mass</strong> is the amount of insert needed in ng (or µg);</li>
                <li><strong>vector mass</strong> is the amount of vector used in ng (or µg);</li>
                <li><strong>insert length</strong> is the size of the insert in bp (or kb);</li>
                <li><strong>vector length</strong> is the size of the vector in bp (or kb); and</li>
                <li><strong>ratio</strong> is the desired insert/vector molar ratio.</li>
            </ul>
        </div>
    );

    return (
        <CalculatorLayout
            title="Ligation Calculator"
            creators={[{ name: "Łucja Zaborowska", phd: true }]}
            reviewers={[{ name: "Bogna Szyk" }, { name: "Jack Bowater" }]}
            articleContent={articleContent}
        >
            <div className="ligation-calculator-page">
                <div className="section-card">
                    <div className="input-group">
                        <label className="input-label">Insert length</label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                className="input-field"
                                value={insertLength.value}
                                onChange={(e) => calculate('il', e.target.value)}
                                placeholder="0"
                            />
                            <div className="unit-select-wrapper">
                                <select
                                    className="unit-select"
                                    value={insertLength.unit}
                                    onChange={(e) => calculate('il-unit', e.target.value)}
                                >
                                    {Object.keys(LENGTH_UNITS).map(u => <option key={u} value={u}>{u}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Vector length</label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                className="input-field"
                                value={vectorLength.value}
                                onChange={(e) => calculate('vl', e.target.value)}
                                placeholder="0"
                            />
                            <div className="unit-select-wrapper">
                                <select
                                    className="unit-select"
                                    value={vectorLength.unit}
                                    onChange={(e) => calculate('vl-unit', e.target.value)}
                                >
                                    {Object.keys(LENGTH_UNITS).map(u => <option key={u} value={u}>{u}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Vector mass</label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                className="input-field"
                                value={vectorMass.value}
                                onChange={(e) => calculate('vm', e.target.value)}
                                placeholder="0"
                            />
                            <div className="unit-select-wrapper">
                                <select
                                    className="unit-select"
                                    value={vectorMass.unit}
                                    onChange={(e) => calculate('vm-unit', e.target.value)}
                                >
                                    {Object.keys(MASS_UNITS).map(u => <option key={u} value={u}>{u}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">
                            Insert / vector ratio <Info size={14} className="info-icon" title="Recommended ratio is 3:1" />
                        </label>
                        <div className="input-wrapper custom-select-wrapper">
                            <select
                                className="input-field select-only"
                                value={molarRatio}
                                onChange={(e) => calculate('ratio', parseFloat(e.target.value))}
                            >
                                {RATIO_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <span className="select-arrow">▼</span>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Insert mass</label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                className="input-field"
                                value={insertMass.value}
                                onChange={(e) => calculate('im', e.target.value)}
                                placeholder="0"
                            />
                            <div className="unit-select-wrapper">
                                <select
                                    className="unit-select"
                                    value={insertMass.unit}
                                    onChange={(e) => calculate('im-unit', e.target.value)}
                                >
                                    {Object.keys(MASS_UNITS).map(u => <option key={u} value={u}>{u}</option>)}
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

export default LigationCalculatorPage;
