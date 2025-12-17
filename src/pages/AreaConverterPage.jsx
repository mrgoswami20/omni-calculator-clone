import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../components/CalculatorLayout';
import { Share2, ChevronDown } from 'lucide-react';
import './AreaConverterPage.css';

const AreaConverterPage = () => {
    // Base unit: Square Meters (m²)
    // All inputs derive from this single source of truth to ensure consistency.
    const [baseArea, setBaseArea] = useState('');

    // Unit selections for the dropdown fields
    const [metricUnit, setMetricUnit] = useState('cm²');
    const [imperialUnit, setImperialUnit] = useState('yd²');
    const [otherUnit, setOtherUnit] = useState('sf');

    const creators = [
        { name: "Piotr Małek", role: "" }
    ];

    const reviewers = [
        { name: "Hanna Pamuła", role: "PhD" },
        { name: "Jack Bowater", role: "" }
    ];

    // Conversion factors to Base (m²)
    // 1 unit = X m²
    const toBase = {
        'm²': 1,
        'ft²': 0.092903,
        // Metric
        'cm²': 0.0001,
        'mm²': 0.000001,
        'km²': 1000000,
        'ha': 10000,
        'are': 100,
        // Imperial
        'in²': 0.00064516,
        'yd²': 0.836127,
        'ac': 4046.86,
        'mi²': 2589988,
        // Other
        'sf': 0.092903, // assume square foot
        'b': 1e-28, // barn? likely too small. 
        // Screenshot shows 'sf', likely just another alias for ft² or a placeholder in Omni
        // Let's assume sf = ft² for now.
    };

    const handleInputChange = (val, unit) => {
        if (val === '') {
            setBaseArea('');
            return;
        }
        const num = parseFloat(val);
        if (!isNaN(num)) {
            const factor = toBase[unit];
            setBaseArea(num * factor);
        }
    };

    // Helper to format values for display
    const getDisplayValue = (unit) => {
        if (baseArea === '') return '';
        const factor = toBase[unit];
        const val = baseArea / factor;

        // precise formatting to avoid Floating Point errors inputs e.g. 0.30000000004
        if (Math.abs(val) < 1e-6 && val !== 0) return val.toExponential(4);
        return val.toPrecision(6).replace(/\.0+$/, '').replace(/(\.\d*[1-9])0+$/, '$1');
    };

    const articleContent = (
        <>
            <p>
                This area converter will help you quickly switch between any units of area from both metric and imperial systems. It lets you switch between acres, hectares, square feet, and many others. You can also convert from m² to ft². It can also quickly answer how many acres are in a hectare?
            </p>
        </>
    );

    const MetricOptions = [
        { value: 'cm²', label: 'cm²' },
        { value: 'mm²', label: 'mm²' },
        { value: 'km²', label: 'km²' },
        { value: 'ha', label: 'hectares' },
        { value: 'are', label: 'ares' },
    ];

    const ImperialOptions = [
        { value: 'yd²', label: 'yd²' },
        { value: 'in²', label: 'in²' },
        { value: 'ac', label: 'acres' },
        { value: 'mi²', label: 'mi²' },
    ];

    const OtherOptions = [
        { value: 'sf', label: 'sf' },
    ];

    const UnitSelect = ({ value, onChange, options }) => (
        <div className="unit-select-container">
            <select value={value} onChange={(e) => onChange(e.target.value)} className="unit-select">
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            <ChevronDown size={14} className="unit-arrow" />
        </div>
    );

    return (
        <CalculatorLayout
            title="Area Converter"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "Area converter",
                "How to convert m² to ft²?",
                "How many acres are in a hectare?",
                "FAQs"
            ]}
            articleContent={articleContent}
        >
            <div className="calculator-card area-converter-page">
                {/* m² Fixed */}
                <div className="input-group">
                    <div className="label-row">
                        <label>Area in square meters</label>
                        <span className="more-options">...</span>
                    </div>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            className="calc-input"
                            value={getDisplayValue('m²')}
                            onChange={(e) => handleInputChange(e.target.value, 'm²')}
                        />
                        <span className="unit-label-static">m²</span>
                    </div>
                </div>

                {/* ft² Fixed */}
                <div className="input-group">
                    <div className="label-row">
                        <label>Area in square feet</label>
                        <span className="more-options">...</span>
                    </div>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            className="calc-input"
                            value={getDisplayValue('ft²')}
                            onChange={(e) => handleInputChange(e.target.value, 'ft²')}
                        />
                        <span className="unit-label-static">ft²</span>
                    </div>
                </div>

                {/* Metric */}
                <div className="input-group">
                    <div className="label-row">
                        <label>Area in metric units</label>
                        <span className="more-options">...</span>
                    </div>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            className="calc-input"
                            value={getDisplayValue(metricUnit)}
                            onChange={(e) => handleInputChange(e.target.value, metricUnit)}
                        />
                        <UnitSelect value={metricUnit} onChange={setMetricUnit} options={MetricOptions} />
                    </div>
                </div>

                {/* Imperial */}
                <div className="input-group">
                    <div className="label-row">
                        <label>Area in imperial units</label>
                        <span className="more-options">...</span>
                    </div>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            className="calc-input"
                            value={getDisplayValue(imperialUnit)}
                            onChange={(e) => handleInputChange(e.target.value, imperialUnit)}
                        />
                        <UnitSelect value={imperialUnit} onChange={setImperialUnit} options={ImperialOptions} />
                    </div>
                </div>

                {/* Other */}
                <div className="input-group">
                    <div className="label-row">
                        <label>Area in other units</label>
                        <span className="more-options">...</span>
                    </div>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            className="calc-input"
                            value={getDisplayValue(otherUnit)}
                            onChange={(e) => handleInputChange(e.target.value, otherUnit)}
                        />
                        <UnitSelect value={otherUnit} onChange={setOtherUnit} options={OtherOptions} />
                    </div>
                </div>


                <div className="calc-actions">
                    <button className="share-result-btn">
                        <div className="share-icon-circle"><Share2 size={14} /></div>
                        Share result
                    </button>
                    <div className="secondary-actions">
                        <button className="secondary-btn">Reload calculator</button>
                        <button className="secondary-btn" onClick={() => {
                            setBaseArea('');
                        }}>Clear all changes</button>
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
        </CalculatorLayout>
    );
};

export default AreaConverterPage;
