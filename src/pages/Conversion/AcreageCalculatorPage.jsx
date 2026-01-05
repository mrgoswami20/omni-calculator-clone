import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import './AcreageCalculatorPage.css';

const AcreageCalculatorPage = () => {
    // Inputs
    const [width, setWidth] = useState('');
    const [widthUnit, setWidthUnit] = useState('yd');

    const [length, setLength] = useState('');
    const [lengthUnit, setLengthUnit] = useState('yd');

    const [area, setArea] = useState('');
    const [areaUnit, setAreaUnit] = useState('ac');

    const [isPriceOpen, setIsPriceOpen] = useState(false);

    const creators = [
        { name: "Piotr Małek", role: "" }
    ];

    const reviewers = [
        { name: "Jack Bowater", role: "" }
    ];

    // Conversion factors to Meter
    const lengthToMeter = {
        'm': 1,
        'cm': 0.01,
        'mm': 0.001,
        'ft': 0.3048,
        'yd': 0.9144,
        'in': 0.0254,
        'km': 1000,
        'mi': 1609.344
    };

    // Conversion factors from Sq Meter
    const sqMeterToArea = {
        'm²': 1,
        'cm²': 10000, // 1 m2 = 10000 cm2 (Wait, div by this? No, factor to multiply m2 by to get unit. 1 m2 = 10000 cm2. Correct.)
        // wait, let's stick to "To Base" (Meter) and "From Base" (Meter) pattern for less confusion.
        // Actually, let's store: value in meters.
    };

    // Let's use standard Factors relative to base.
    // Length Base: Meter
    const lFactors = {
        'm': 1,
        'cm': 0.01,
        'mm': 0.001,
        'ft': 0.3048,
        'yd': 0.9144,
        'in': 0.0254,
        'km': 1000,
        'mi': 1609.344
    };

    // Area Base: Sq Meter
    const aFactors = {
        'm²': 1,
        'cm²': 0.0001,
        'ft²': 0.092903,
        'yd²': 0.836127,
        'ac': 4046.86,
        'ha': 10000,
        'km²': 1000000,
        'mi²': 2589988
    };

    // Calculate Area when W or L changes
    useEffect(() => {
        if (width && length) {
            const wM = parseFloat(width) * lFactors[widthUnit];
            const lM = parseFloat(length) * lFactors[lengthUnit];
            const areaM2 = wM * lM;

            // Convert to selected area unit
            // val * factor = m2.  So m2 / factor = val.
            const aVal = areaM2 / aFactors[areaUnit];

            // Avoid infinite loops or overwriting user input if they are typing area? 
            // For this clone, strict W*L = A flow is safer given the screenshot shows W/L first.
            setArea(aVal.toPrecision(6).replace(/\.0+$/, '').replace(/(\.\d*[1-9])0+$/, '$1')); // Cleaner formatting
        } else {
            setArea('');
        }
    }, [width, length, widthUnit, lengthUnit, areaUnit]);

    const articleContent = (
        <>
            <p>
                This acreage calculator helps you measure a piece of land or quickly convert between the imperial and the metric system's units for area.
            </p>
        </>
    );

    // Units options for dropdowns
    const lengthOptions = [
        { value: 'm', label: 'm' },
        { value: 'cm', label: 'cm' },
        { value: 'mm', label: 'mm' },
        { value: 'ft', label: 'ft' },
        { value: 'yd', label: 'yd' },
        { value: 'in', label: 'in' },
        { value: 'km', label: 'km' },
        { value: 'mi', label: 'mi' },
    ];

    const areaOptions = [
        { value: 'ac', label: 'ac' },
        { value: 'm²', label: 'm²' },
        { value: 'ft²', label: 'ft²' },
        { value: 'yd²', label: 'yd²' },
        { value: 'ha', label: 'ha' },
        { value: 'km²', label: 'km²' },
        { value: 'mi²', label: 'mi²' },
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
            title="Acreage Calculator"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "Acreage calculator - how does it work?",
                "Hectares to acres",
                "Acres to square meters",
                "Acres to square miles",
                "FAQs"
            ]}
            articleContent={articleContent}
            similarCalculators={12}
        >
            <div className="calculator-card acreage-page">
                {/* Width */}
                <div className="input-group">
                    <div className="label-row">
                        <label>Width</label>
                        <span className="more-options">...</span>
                    </div>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            className="calc-input"
                            value={width}
                            onChange={(e) => setWidth(e.target.value)}
                        />
                        <UnitSelect value={widthUnit} onChange={setWidthUnit} options={lengthOptions} />
                    </div>
                </div>

                {/* Length */}
                <div className="input-group">
                    <div className="label-row">
                        <label>Length</label>
                        <span className="more-options">...</span>
                    </div>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            className="calc-input"
                            value={length}
                            onChange={(e) => setLength(e.target.value)}
                        />
                        <UnitSelect value={lengthUnit} onChange={setLengthUnit} options={lengthOptions} />
                    </div>
                </div>

                {/* Area */}
                <div className="input-group result-group">
                    <div className="label-row">
                        <label>Area</label>
                        <span className="more-options">...</span>
                    </div>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            className="calc-input"
                            value={area}
                            readOnly
                        />
                        <UnitSelect value={areaUnit} onChange={setAreaUnit} options={areaOptions} />
                    </div>
                </div>

                {/* Collapsible Section */}
                <div className="collapsible-section">
                    <div className="collapsible-header" onClick={() => setIsPriceOpen(!isPriceOpen)}>
                        <div className="header-left">
                            {isPriceOpen ? <ChevronUp size={18} color="#436cfe" /> : <ChevronDown size={18} color="#436cfe" />}
                            <span>Unit and total price</span>
                        </div>
                    </div>
                    {isPriceOpen && (
                        <div className="collapsible-content">
                            {/* Placeholder inputs matching style */}
                            <div className="input-group">
                                <label style={{ fontSize: '0.85rem', marginBottom: '4px', display: 'block' }}>Price per unit</label>
                                <div className="input-wrapper">
                                    <input type="number" className="calc-input" placeholder="" />
                                    <span className="unit-label text-sm text-gray-500 pr-3">$/unit</span>
                                </div>
                            </div>
                            <div className="input-group">
                                <label style={{ fontSize: '0.85rem', marginBottom: '4px', display: 'block' }}>Total price</label>
                                <div className="input-wrapper">
                                    <input type="number" className="calc-input" placeholder="" />
                                    <span className="unit-label text-sm text-gray-500 pr-3">$</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="calc-actions">
                    {/* <button className="share-result-btn" onClick={handleShare}>
                        <div className="share-icon-circle"><Share2 size={14} /></div>
                        Share result
                        {showShareTooltip && <span className="copied-tooltip">Copied!</span>}
                    </button> */}
                    <div className="secondary-actions">
                        <button className="secondary-btn">Reload calculator</button>
                        <button className="secondary-btn" onClick={() => {
                            setWidth('');
                            setLength('');
                            setArea('');
                            setAreaUnit('ac'); // Reset to default? Or keep choice. Let's keep.
                            setWidthUnit('yd');
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

                <div className="check-out-box">
                    Check out <strong>12 similar</strong> length and area converters
                </div>
            </div>
        </CalculatorLayout>
    );
};

export default AcreageCalculatorPage;
