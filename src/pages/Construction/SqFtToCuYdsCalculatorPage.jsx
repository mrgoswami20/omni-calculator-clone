import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, RefreshCcw, X, ChevronDown, ChevronUp } from 'lucide-react';
import './SqFtToCuYdsCalculatorPage.css';

const SqFtToCuYdsCalculatorPage = () => {
    // --- State ---
    const [area, setArea] = useState({ value: '', unit: 'sq ft' });
    const [height, setHeight] = useState({ value: '', unit: 'in' });
    const [volume, setVolume] = useState({ value: '', unit: 'cu yd' });

    // --- Unit Definitions ---
    const areaUnits = [
        { label: 'square feet (ft²)', value: 'sq ft' },
        { label: 'square yards (yd²)', value: 'sq yd' },
        { label: 'square meters (m²)', value: 'sq m' },
        { label: 'square inches (in²)', value: 'sq in' },
        { label: 'square centimeters (cm²)', value: 'sq cm' },
        { label: 'acres', value: 'ac' }
    ];

    const heightUnits = [
        { label: 'inches (in)', value: 'in' },
        { label: 'feet (ft)', value: 'ft' },
        { label: 'yards (yd)', value: 'yd' },
        { label: 'meters (m)', value: 'm' },
        { label: 'centimeters (cm)', value: 'cm' },
        { label: 'millimeters (mm)', value: 'mm' }
    ];

    const volumeUnits = [
        { label: 'cubic yards (cu yd)', value: 'cu yd' },
        { label: 'cubic feet (cu ft)', value: 'cu ft' },
        { label: 'cubic meters (cu m)', value: 'cu m' },
        { label: 'cubic inches (cu in)', value: 'cu in' }
    ];

    // --- Conversion Logic ---
    const toSqFt = (val, unit) => {
        const v = parseFloat(val) || 0;
        switch (unit) {
            case 'sq ft': return v;
            case 'sq yd': return v * 9;
            case 'sq m': return v * 10.7639;
            case 'sq in': return v / 144;
            case 'sq cm': return v / 929.03;
            case 'ac': return v * 43560;
            default: return v;
        }
    };

    const toFt = (val, unit) => {
        const v = parseFloat(val) || 0;
        switch (unit) {
            case 'in': return v / 12;
            case 'ft': return v;
            case 'yd': return v * 3;
            case 'm': return v * 3.28084;
            case 'cm': return v / 30.48;
            case 'mm': return v / 304.8;
            default: return v;
        }
    };

    const fromCuFt = (val, unit) => {
        switch (unit) {
            case 'cu yd': return val / 27;
            case 'cu ft': return val;
            case 'cu m': return val / 35.3147;
            case 'cu in': return val * 1728;
            default: return val;
        }
    };

    // --- Calculation ---
    useEffect(() => {
        if (!area.value || !height.value) {
            setVolume(prev => ({ ...prev, value: '' }));
            return;
        }

        const areaSqFt = toSqFt(area.value, area.unit);
        const heightFt = toFt(height.value, height.unit);
        const volumeCuFt = areaSqFt * heightFt;
        const result = fromCuFt(volumeCuFt, volume.unit);

        setVolume(prev => ({
            ...prev,
            value: result % 1 === 0 ? result.toString() : result.toFixed(2)
        }));
    }, [area.value, area.unit, height.value, height.unit, volume.unit]);

    const handleClear = () => {
        setArea({ value: '', unit: 'sq ft' });
        setHeight({ value: '', unit: 'in' });
        setVolume({ value: '', unit: 'cu yd' });
    };

    const articleContent = (
        <div className="article-container">
            <h2 className="article-title">Square Feet to Cubic Yards Calculator</h2>
            <p>If you're planning a landscaping or construction project, you often need to determine how much material you need to fill a specific area to a certain depth. This calculator helps you convert **square feet to cubic yards** instantly.</p>

            <h3 className="article-subtitle">How to convert square feet to cubic yards?</h3>
            <p>To convert from an area (square feet) to a volume (cubic yards), you need one more dimension: the **height** or **depth** of the space.</p>
            <div className="premium-formula-box">
                <div className="math-latex">
                    Volume (cu yd) = [Area (sq ft) × Depth (in)] / 324
                </div>
            </div>
            <p>Alternatively, the step-by-step method is:</p>
            <ol>
                <li>Multiply the **area** (sq ft) by the **depth** (converted to feet) to get the volume in **cubic feet**.</li>
                <li>Divide the result by **27** (since there are 27 cubic feet in one cubic yard) to get the volume in **cubic yards**.</li>
            </ol>

            <h3 className="article-subtitle">Example Calculation</h3>
            <p>Suppose you have a garden bed of **100 square feet** and you want to fill it with **3 inches** of mulch:</p>
            <ol>
                <li>Depth in feet: <code>3 / 12 = 0.25 ft</code>.</li>
                <li>Volume in cubic feet: <code>100 * 0.25 = 25 cu ft</code>.</li>
                <li>Volume in cubic yards: <code>25 / 27 ≈ 0.93 cu yd</code>.</li>
            </ol>
            <p>Using our shortcut: <code>(100 * 3) / 324 ≈ 0.93 cu yd</code>. Both methods lead to the same result!</p>
        </div>
    );

    // --- Sub-component: Unified Bar ---
    const UnifiedBar = ({ label, state, setState, units, isResult = false }) => (
        <div className="input-group-premium">
            <label className="label-premium">{label}</label>
            <div className={`unified-bar ${isResult ? 'result-mode' : ''}`}>
                <input
                    type="number"
                    className={`bar-input ${isResult ? 'highlight' : ''}`}
                    value={state.value}
                    onChange={(e) => setState({ ...state, value: e.target.value })}
                    readOnly={isResult}
                    placeholder=" "
                 onWheel={(e) => e.target.blur()} />
                <div className="bar-divider"></div>
                <select
                    className="bar-select"
                    value={state.unit}
                    onChange={(e) => setState({ ...state, unit: e.target.value })}
                >
                    {units.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                </select>
            </div>
        </div>
    );

    return (
        <CalculatorLayout
            title="Square Feet to Cubic Yards Calculator"
            creators={[{ name: "Purnima Singh", phd: true }]}
            reviewers={[{ name: "Steven Wooding" }]}
            articleContent={articleContent}
        >
            <div className="sqft-to-cuyds-wrapper">
                <div className="calc-card-premium">
                    {/* Area Input */}
                    <UnifiedBar
                        label="Area"
                        state={area}
                        setState={setArea}
                        units={areaUnits}
                    />

                    {/* Height/Depth Input */}
                    <UnifiedBar
                        label="Height/depth"
                        state={height}
                        setState={setHeight}
                        units={heightUnits}
                    />

                    {/* Volume Result */}
                    <UnifiedBar
                        label="Volume"
                        state={volume}
                        setState={setVolume}
                        units={volumeUnits}
                        isResult={true}
                    />

                    {/* Integrated Action Buttons */}
                    <div className="action-buttons-container">
                        <div className="action-stack">
                            <button className="btn-action-rect" onClick={() => window.location.reload()}>
                                Reload calculator
                            </button>
                            <button className="btn-action-rect" onClick={handleClear}>
                                Clear all changes
                            </button>
                        </div>
                    </div>

                    <div className="feedback-small">
                        <p>Did we solve your problem today?</p>
                        <div className="feedback-chips">
                            <button className="chip">👍 Yes</button>
                            <button className="chip">👎 No</button>
                        </div>
                    </div>
                </div>
            </div>
        </CalculatorLayout>
    );
};

export default SqFtToCuYdsCalculatorPage;
