import React, { useState } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { ChevronDown, ChevronUp } from 'lucide-react';
import './LengthConverterPage.css';

const LengthConverterPage = () => {
    // Base unit: meters
    // All inputs derive from this single source of truth.
    const [baseLength, setBaseLength] = useState('');

    // Collapsible states
    const [isMetricOpen, setIsMetricOpen] = useState(true);
    const [isImperialOpen, setIsImperialOpen] = useState(true);
    const [isOthersOpen, setIsOthersOpen] = useState(true);

    // Selected Units for dynamic fields
    const [otherMetricUnit, setOtherMetricUnit] = useState('m');
    const [otherImperialUnit, setOtherImperialUnit] = useState('ft');
    const [otherUnit, setOtherUnit] = useState('nmi');

    const creators = [
        { name: "Hanna Pamuła", role: "PhD" },
    ];

    const reviewers = [
        { name: "Malgorzata Koperska", role: "MD" },
        { name: "Jack Bowater", role: "" }
    ];

    // Conversion factors to Base (m)
    const toBase = {
        'm': 1,
        'mm': 0.001,
        'cm': 0.01,
        'dm': 0.1,
        'km': 1000,
        'in': 0.0254,
        'ft': 0.3048,
        'yd': 0.9144,
        'mi': 1609.344,
        'nmi': 1852, // Nautical mile
        'R☉': 6.957e8, // Sun radius (approx)
        'ly': 9.461e15, // Light year
        'au': 1.496e11, // Astronomical unit
        'pc': 3.086e16, // Parsec
        'Å': 1e-10, // Angstrom
        'pm': 1e-12, // picometer
        'nm': 1e-9, // nanometer
        'µm': 1e-6, // micrometer
        'thou': 2.54e-5, // thousandth of an inch
    };

    const handleInputChange = (val, unit) => {
        if (val === '') {
            setBaseLength('');
            return;
        }
        const num = parseFloat(val);
        if (!isNaN(num)) {
            const factor = toBase[unit];
            setBaseLength(num * factor);
        }
    };

    const getDisplayValue = (unit) => {
        if (baseLength === '') return '';
        const factor = toBase[unit];
        const val = baseLength / factor;

        if (Math.abs(val) < 1e-6 && val !== 0) return val.toExponential(4);
        return val.toPrecision(6).replace(/\.0+$/, '').replace(/(\.\d*[1-9])0+$/, '$1');
    };

    const articleContent = (
        <>
            <p>
                This length converter is a tool that enables quick conversion between length units in both imperial and metric, but not only that. It is equipped with twenty different units of length measurement.
            </p>
        </>
    );

    const MetricOptions = [
        { value: 'm', label: 'meters (m)' },
        { value: 'dm', label: 'decimeters (dm)' },
        { value: 'Å', label: 'ångström (Å)' },
        { value: 'pm', label: 'picometers (pm)' },
        { value: 'nm', label: 'nanometers (nm)' },
        { value: 'µm', label: 'micrometers (µm)' },
    ];

    const ImperialOptions = [
        { value: 'ft', label: 'feet (ft)' },
        { value: 'thou', label: 'thousandth of an inch (mil / thou)' },
    ];

    const OtherOptions = [
        { value: 'nmi', label: 'nautical miles (nmi)' },
        { value: 'R☉', label: 'Sun radii (R☉)' },
        { value: 'ly', label: 'light years (ly)' },
        { value: 'au', label: 'astronomical units (au)' },
        { value: 'pc', label: 'parsecs (pc)' },
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

    const [showShareTooltip, setShowShareTooltip] = useState(false);

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setShowShareTooltip(true);
            setTimeout(() => setShowShareTooltip(false), 2000);
        } catch (err) {
            console.error('Failed to copy URL:', err);
        }
    };

    return (
        <CalculatorLayout
            title="Length Converter"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "Length conversion table",
                "Length conversion chart",
                "Inch definition",
                "Feet definition",
                "Meter definition",
                "Imperial / US measurement system",
                "Metric measurement system",
                "FAQs"
            ]}
            articleContent={articleContent}
            similarCalculators={12}
        >
            <div className="calc-card length-converter-page">

                {/* Metric Section */}
                <div className="collapsible-section no-border-top">
                    <div className="collapsible-header" onClick={() => setIsMetricOpen(!isMetricOpen)}>
                        <div className="header-left">
                            {isMetricOpen ? <ChevronUp size={18} color="#436cfe" /> : <ChevronDown size={18} color="#436cfe" />}
                            <span>Metric</span>
                        </div>
                    </div>
                    {isMetricOpen && (
                        <div className="collapsible-content">
                            <div className="input-group">
                                <div className="label-row"><label>Length in millimeters</label><span className="more-options">...</span></div>
                                <div className="input-wrapper">
                                    <input type="number" className="calc-input" value={getDisplayValue('mm')} onChange={(e) => handleInputChange(e.target.value, 'mm')} onWheel={(e) => e.target.blur()} />
                                    <span className="unit-label-static">mm</span>
                                </div>
                            </div>
                            <div className="input-group">
                                <div className="label-row"><label>Length in centimeters</label><span className="more-options">...</span></div>
                                <div className="input-wrapper">
                                    <input type="number" className="calc-input" value={getDisplayValue('cm')} onChange={(e) => handleInputChange(e.target.value, 'cm')} onWheel={(e) => e.target.blur()} />
                                    <span className="unit-label-static">cm</span>
                                </div>
                            </div>
                            <div className="input-group">
                                <div className="label-row"><label>Length in meters</label><span className="more-options">...</span></div>
                                <div className="input-wrapper">
                                    <input type="number" className="calc-input" value={getDisplayValue('m')} onChange={(e) => handleInputChange(e.target.value, 'm')} onWheel={(e) => e.target.blur()} />
                                    <span className="unit-label-static">m</span>
                                </div>
                            </div>
                            <div className="input-group">
                                <div className="label-row"><label>Length in kilometers</label><span className="more-options">...</span></div>
                                <div className="input-wrapper">
                                    <input type="number" className="calc-input" value={getDisplayValue('km')} onChange={(e) => handleInputChange(e.target.value, 'km')} onWheel={(e) => e.target.blur()} />
                                    <span className="unit-label-static">km</span>
                                </div>
                            </div>
                            <div className="input-group">
                                <div className="label-row"><label>Length in other metric units</label><span className="more-options">...</span></div>
                                <div className="input-wrapper">
                                    <input type="number" className="calc-input" value={getDisplayValue(otherMetricUnit)} onChange={(e) => handleInputChange(e.target.value, otherMetricUnit)} onWheel={(e) => e.target.blur()} />
                                    <UnitSelect value={otherMetricUnit} onChange={setOtherMetricUnit} options={MetricOptions} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Imperial/US Section */}
                <div className="collapsible-section">
                    <div className="collapsible-header" onClick={() => setIsImperialOpen(!isImperialOpen)}>
                        <div className="header-left">
                            {isImperialOpen ? <ChevronUp size={18} color="#436cfe" /> : <ChevronDown size={18} color="#436cfe" />}
                            <span>Imperial/US</span>
                        </div>
                    </div>
                    {isImperialOpen && (
                        <div className="collapsible-content">
                            <div className="input-group">
                                <div className="label-row"><label>Length in inches</label><span className="more-options">...</span></div>
                                <div className="input-wrapper">
                                    <input type="number" className="calc-input" value={getDisplayValue('in')} onChange={(e) => handleInputChange(e.target.value, 'in')} onWheel={(e) => e.target.blur()} />
                                    <span className="unit-label-static">in</span>
                                </div>
                            </div>
                            <div className="input-group">
                                <div className="label-row"><label>Length in feet</label><span className="more-options">...</span></div>
                                <div className="input-wrapper">
                                    <input type="number" className="calc-input" value={getDisplayValue('ft')} onChange={(e) => handleInputChange(e.target.value, 'ft')} onWheel={(e) => e.target.blur()} />
                                    <span className="unit-label-static">ft</span>
                                </div>
                            </div>
                            <div className="input-group">
                                <div className="label-row"><label>Length in yards</label><span className="more-options">...</span></div>
                                <div className="input-wrapper">
                                    <input type="number" className="calc-input" value={getDisplayValue('yd')} onChange={(e) => handleInputChange(e.target.value, 'yd')} onWheel={(e) => e.target.blur()} />
                                    <span className="unit-label-static">yd</span>
                                </div>
                            </div>
                            <div className="input-group">
                                <div className="label-row"><label>Length in miles</label><span className="more-options">...</span></div>
                                <div className="input-wrapper">
                                    <input type="number" className="calc-input" value={getDisplayValue('mi')} onChange={(e) => handleInputChange(e.target.value, 'mi')} onWheel={(e) => e.target.blur()} />
                                    <span className="unit-label-static">mi</span>
                                </div>
                            </div>
                            <div className="input-group">
                                <div className="label-row"><label>Length in other imperial units</label><span className="more-options">...</span></div>
                                <div className="input-wrapper">
                                    <input type="number" className="calc-input" value={getDisplayValue(otherImperialUnit)} onChange={(e) => handleInputChange(e.target.value, otherImperialUnit)} onWheel={(e) => e.target.blur()} />
                                    <UnitSelect value={otherImperialUnit} onChange={setOtherImperialUnit} options={ImperialOptions} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Others Section */}
                <div className="collapsible-section">
                    <div className="collapsible-header" onClick={() => setIsOthersOpen(!isOthersOpen)}>
                        <div className="header-left">
                            {isOthersOpen ? <ChevronUp size={18} color="#436cfe" /> : <ChevronDown size={18} color="#436cfe" />}
                            <span>Others</span>
                        </div>
                    </div>
                    {isOthersOpen && (
                        <div className="collapsible-content">
                            <div className="input-group">
                                <div className="label-row"><label>Length in nautical miles</label><span className="more-options">...</span></div>
                                <div className="input-wrapper">
                                    <input type="number" className="calc-input" value={getDisplayValue('nmi')} onChange={(e) => handleInputChange(e.target.value, 'nmi')} onWheel={(e) => e.target.blur()} />
                                    <span className="unit-label-static">nmi</span>
                                </div>
                            </div>
                            <div className="input-group">
                                <div className="label-row"><label>Length in Sun radii</label><span className="more-options">...</span></div>
                                <div className="input-wrapper">
                                    <input type="number" className="calc-input" value={getDisplayValue('R☉')} onChange={(e) => handleInputChange(e.target.value, 'R☉')} onWheel={(e) => e.target.blur()} />
                                    <span className="unit-label-static">R☉</span>
                                </div>
                            </div>
                            <div className="input-group">
                                <div className="label-row"><label>Length in light years</label><span className="more-options">...</span></div>
                                <div className="input-wrapper">
                                    <input type="number" className="calc-input" value={getDisplayValue('ly')} onChange={(e) => handleInputChange(e.target.value, 'ly')} onWheel={(e) => e.target.blur()} />
                                    <span className="unit-label-static">ly</span>
                                </div>
                            </div>
                            <div className="input-group">
                                <div className="label-row"><label>Length in other units</label><span className="more-options">...</span></div>
                                <div className="input-wrapper">
                                    <input type="number" className="calc-input" value={getDisplayValue(otherUnit)} onChange={(e) => handleInputChange(e.target.value, otherUnit)} onWheel={(e) => e.target.blur()} />
                                    <UnitSelect value={otherUnit} onChange={setOtherUnit} options={OtherOptions} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="calc-actions">
                    {/* <button className="share-result-btn" onClick={handleShare}>
                        <div className="share-icon-circle"><Share2 size={14} /></div>
                        Share result
                        {showShareTooltip && <span className="copied-tooltip" style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)' }}>Copied!</span>}
                    </button> */}
                    <div className="secondary-actions">
                        <button className="secondary-btn" onClick={() => window.location.reload()}>Reload calculator</button>
                        <button className="secondary-btn" onClick={() => {
                            setBaseLength('');
                        }}>Clear all changes</button>
                    </div>
                </div>

            </div>
        </CalculatorLayout>
    );
};

export default LengthConverterPage;
