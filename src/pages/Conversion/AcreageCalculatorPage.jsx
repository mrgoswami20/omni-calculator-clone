import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import InputBarWithDropDownOption from '../../components/kit_components/InputBarWithDropDownOption';
import SimpleInputBar from '../../components/kit_components/SimpleInputBar';
import SimpleButton from '../../components/kit_components/SimpleButton';
import './AcreageCalculatorPage.css';

const AcreageCalculatorPage = () => {
    // Inputs
    const [width, setWidth] = useState('');
    const [widthUnit, setWidthUnit] = useState('yd');

    const [length, setLength] = useState('');
    const [lengthUnit, setLengthUnit] = useState('yd');

    const [area, setArea] = useState('');
    const [areaUnit, setAreaUnit] = useState('ac');

    // Price Section State
    const [isPriceOpen, setIsPriceOpen] = useState(true);
    const [unitPrice, setUnitPrice] = useState('');
    const [priceUnit, setPriceUnit] = useState('yd²');
    const [totalPrice, setTotalPrice] = useState('');

    const creators = [
        { name: "Piotr Małek", role: "" }
    ];

    const reviewers = [
        { name: "Jack Bowater", role: "" }
    ];

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

    // Area Factors relative to Square Meter (m²)
    // 1 unit = X m²
    const aFactors = {
        'mm²': 0.000001,
        'cm²': 0.0001,
        'dm²': 0.01,
        'm²': 1,
        'km²': 1000000,
        'in²': 0.00064516,
        'ft²': 0.09290304,
        'yd²': 0.83612736,
        'mi²': 2589988.11,
        'ha': 10000,
        'ac': 4046.85642
    };

    // --- Core Area Calculation ---
    useEffect(() => {
        const wVal = parseFloat(width);
        const lVal = parseFloat(length);

        if (!isNaN(wVal) && !isNaN(lVal) && width !== '' && length !== '' && wVal > 0 && lVal > 0) {
            const wM = wVal * lFactors[widthUnit];
            const lM = lVal * lFactors[lengthUnit];
            const areaM2 = wM * lM;
            const aVal = areaM2 / aFactors[areaUnit];
            setArea(aVal.toPrecision(6).replace(/\.0+$/, '').replace(/(\.\d*[1-9])0+$/, '$1'));
        } else {
            if (width === '' || length === '') {
                setArea('');
            }
        }
    }, [width, length, widthUnit, lengthUnit, areaUnit]);

    // Helper: Get Area in Square Meters
    const getAreaInSqMeters = () => {
        const aVal = parseFloat(area);
        if (isNaN(aVal) || !aVal) return 0;
        return aVal * aFactors[areaUnit];
    };

    const handleUnitPriceChange = (val) => {
        setUnitPrice(val);
        const uP = parseFloat(val);
        const areaSqM = getAreaInSqMeters();

        if (!isNaN(uP) && areaSqM > 0) {
            const areaInPriceUnit = areaSqM / aFactors[priceUnit];
            const total = uP * areaInPriceUnit;
            setTotalPrice(total.toFixed(2));
        } else {
            if (val === '') setTotalPrice('');
        }
    };

    const handleTotalPriceChange = (val) => {
        setTotalPrice(val);
        const tP = parseFloat(val);
        const areaSqM = getAreaInSqMeters();

        if (!isNaN(tP) && areaSqM > 0) {
            const areaInPriceUnit = areaSqM / aFactors[priceUnit];
            if (areaInPriceUnit !== 0) {
                const unitP = tP / areaInPriceUnit;
                setUnitPrice(unitP.toPrecision(6).replace(/\.0+$/, '').replace(/(\.\d*[1-9])0+$/, '$1'));
            }
        }
    };

    useEffect(() => {
        const areaSqM = getAreaInSqMeters();
        const uP = parseFloat(unitPrice);
        if (areaSqM > 0 && !isNaN(uP)) {
            const areaInPriceUnit = areaSqM / aFactors[priceUnit];
            const total = uP * areaInPriceUnit;
            setTotalPrice(total.toFixed(2));
        }
    }, [area, areaUnit]);

    const [prevPriceUnit, setPrevPriceUnit] = useState(priceUnit);
    if (priceUnit !== prevPriceUnit) {
        // Convert Unit Price when unit changes
        const uP = parseFloat(unitPrice);
        if (!isNaN(uP)) {
            // New Price = Old Price * (New Factor / Old Factor)
            // Because price per unit scales with unit size.
            const ratio = aFactors[priceUnit] / aFactors[prevPriceUnit];
            const newPrice = uP * ratio;
            setUnitPrice(newPrice.toPrecision(6).replace(/\.0+$/, '').replace(/(\.\d*[1-9])0+$/, '$1'));
        }
        setPrevPriceUnit(priceUnit);
    }

    // Validation
    const getWidthError = () => {
        if (width === '') return null;
        if (parseFloat(width) <= 0) return "The width must be a positive number.";
        return null;
    };
    const getLengthError = () => {
        if (length === '') return null;
        if (parseFloat(length) <= 0) return "The length must be a positive number.";
        return null;
    };
    const getAreaError = () => {
        if (area === '') return null;
        if (parseFloat(area) <= 0) return "The area must be a positive number.";
        return null;
    };

    const articleContent = (
        <>
            <p>This acreage calculator helps you measure a piece of land or quickly convert between the imperial and the metric system's units for area.</p>
        </>
    );

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

    // Requested Order: mm2, cm2, dm2, m2, km2, in2, ft2, yd2, mi2, ha, ac
    const areaOptions = [
        { value: 'mm²', label: 'square millimeter (mm²)' },
        { value: 'cm²', label: 'square centimeter (cm²)' },
        { value: 'dm²', label: 'square decimeter (dm²)' },
        { value: 'm²', label: 'square meter (m²)' },
        { value: 'km²', label: 'square kilometer (km²)' },
        { value: 'in²', label: 'square inch (in²)' },
        { value: 'ft²', label: 'square foot (ft²)' },
        { value: 'yd²', label: 'square yard (yd²)' },
        { value: 'mi²', label: 'square mile (mi²)' },
        { value: 'ha', label: 'hectare (ha)' },
        { value: 'ac', label: 'acre (ac)' }
    ];

    const handleClear = () => {
        setWidth('');
        setLength('');
        setArea('');
        setUnitPrice('');
        setTotalPrice('');
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
            <div className="calc-card acreage-page">
                <InputBarWithDropDownOption
                    label="Width"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    unit={widthUnit}
                    onUnitChange={(e) => setWidthUnit(e.target.value)}
                    unitOptions={lengthOptions}
                    error={getWidthError()}
                    type="number"
                />
                <InputBarWithDropDownOption
                    label="Length"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    unit={lengthUnit}
                    onUnitChange={(e) => setLengthUnit(e.target.value)}
                    unitOptions={lengthOptions}
                    error={getLengthError()}
                    type="number"
                />
                <InputBarWithDropDownOption
                    label="Area"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    unit={areaUnit}
                    onUnitChange={(e) => setAreaUnit(e.target.value)}
                    unitOptions={areaOptions}
                    error={getAreaError()}
                    type="number"
                    selectedDisplayProp="value" // Show only symbol (value) when selected
                />

                <div className="collapsible-section">
                    <div className="collapsible-header" onClick={() => setIsPriceOpen(!isPriceOpen)}>
                        <div className="header-left">
                            {isPriceOpen ? <ChevronUp size={18} color="#436cfe" /> : <ChevronDown size={18} color="#436cfe" />}
                            <span>Unit and total price</span>
                        </div>
                    </div>

                    {isPriceOpen && (
                        <div className="collapsible-content">
                            <p style={{ fontSize: '0.85rem', color: '#374151', margin: '0 0 12px 0' }}>
                                Once you've obtained the area, input one of the quantities below to get the other.
                            </p>

                            <InputBarWithDropDownOption
                                label="Unit price"
                                value={unitPrice}
                                onChange={(e) => handleUnitPriceChange(e.target.value)}
                                unit={priceUnit}
                                onUnitChange={(e) => setPriceUnit(e.target.value)}
                                unitOptions={areaOptions}
                                type="number"
                                unitPrefix="USD /"
                                selectedDisplayProp="value" // Show only symbol when selected
                            />

                            <SimpleInputBar
                                label="Total price"
                                value={totalPrice}
                                onChange={(e) => handleTotalPriceChange(e.target.value)}
                                type="number"
                                suffix="USD"
                            />
                        </div>
                    )}
                </div>

                <div className="actions-section">
                    <div className="utility-buttons" style={{ width: '100%', flexDirection: 'row', justifyContent: 'center' }}>
                        <SimpleButton onClick={() => window.location.reload()} variant="secondary">
                            <RotateCcw size={16} style={{ marginRight: 8 }} /> Reload calculator
                        </SimpleButton>
                        <SimpleButton onClick={handleClear} variant="secondary">
                            Clear all changes
                        </SimpleButton>
                    </div>
                </div>



                <div className="check-out-box" style={{
                    marginTop: '2rem',
                    backgroundColor: '#fefce8',
                    padding: '1rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    color: '#111827',
                    borderLeft: '4px solid #facc15'
                }}>
                    Check out <strong>12 similar</strong> length and area converters
                </div>
            </div>
        </CalculatorLayout>
    );
};

export default AcreageCalculatorPage;
