import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import {
    ChevronDown,
    RefreshCcw,
    X,
    Info,
    LayoutGrid,
    MoreHorizontal,
    Pin
} from 'lucide-react';
import './SquareFootageCalculatorPage.css';

const SquareFootageCalculatorPage = () => {
    // --- State ---
    const [width, setWidth] = useState({ value: '', unit: 'ft' });
    const [length, setLength] = useState({ value: '', unit: 'ft' });
    const [quantity, setQuantity] = useState('1');
    const [area, setArea] = useState({ value: '', unit: 'ft²' });

    const [unitPrice, setUnitPrice] = useState({ value: '', currency: 'INR', unit: 'ft²' });
    const [totalCost, setTotalCost] = useState({ value: '', currency: 'INR' });

    const CONVERSIONS = {
        length: { ft: 1, m: 3.28084, in: 0.0833333, cm: 0.0328084, yd: 3 },
        area: { 'ft²': 1, 'm²': 10.7639, 'in²': 0.00694444, 'cm²': 0.00107639, 'yd²': 9, 'ac': 43560 }
    };

    // --- Calculation Logic ---
    useEffect(() => {
        const wVal = parseFloat(width.value);
        const lVal = parseFloat(length.value);
        const qVal = parseFloat(quantity) || 0;

        if (!isNaN(wVal) && !isNaN(lVal)) {
            const w_ft = wVal * CONVERSIONS.length[width.unit];
            const l_ft = lVal * CONVERSIONS.length[length.unit];
            const area_ft2 = w_ft * l_ft * qVal;

            const displayArea = area_ft2 / CONVERSIONS.area[area.unit];
            setArea(prev => ({ ...prev, value: displayArea.toFixed(2).replace(/\.00$/, '') }));
        } else {
            setArea(prev => ({ ...prev, value: '' }));
        }
    }, [width.value, width.unit, length.value, length.unit, quantity, area.unit]);

    useEffect(() => {
        const aVal = parseFloat(area.value);
        const upVal = parseFloat(unitPrice.value);

        if (!isNaN(aVal) && !isNaN(upVal)) {
            const area_ft2 = aVal * CONVERSIONS.area[area.unit];
            const price_per_ft2 = upVal / CONVERSIONS.area[unitPrice.unit];
            const cost = area_ft2 * price_per_ft2;

            setTotalCost(prev => ({ ...prev, value: cost.toFixed(2).replace(/\.00$/, '') }));
        } else {
            setTotalCost(prev => ({ ...prev, value: '' }));
        }
    }, [area.value, area.unit, unitPrice.value, unitPrice.unit]);

    const handleClear = () => {
        setWidth({ value: '', unit: 'ft' });
        setLength({ value: '', unit: 'ft' });
        setQuantity('1');
        setArea({ value: '', unit: 'ft²' });
        setUnitPrice({ value: '', currency: 'INR', unit: 'ft²' });
        setTotalCost({ value: '', currency: 'INR' });
    };

    const tocItems = [
        "What is a square foot?",
        "Calculate square footage (sq ft) from other units",
        "How do I convert square meters to square feet?",
        "How do I convert acres to sq ft?",
        "How to use the square footage calculator",
        "How to calculate areas and what is the square footage formula?",
        "How to calculate square footage pricing",
        "How to measure the square footage of a house or property",
        "Final remarks about square footage",
        "FAQs"
    ];

    const articleContent = (
        <div className="article-container">
            <h2 className="article-title">What is a square foot?</h2>
            <p>A square foot is a unit of area measurement used primarily in the United States and the United Kingdom. It represents the area of a square with sides that are exactly one foot long.</p>

            <h2 className="article-title">Square Footage Formula</h2>
            <div className="premium-formula-box">
                <div className="math-latex">
                    Area = Length × Width × Quantity
                </div>
            </div>
        </div>
    );

    return (
        <CalculatorLayout
            title="Square Footage Calculator"
            creators={[{ name: "Álvaro Díez" }, { name: "Steven Wooding" }]}
            reviewers={[{ name: "Bogna Szyk" }, { name: "Jack Bowater" }]}
            tocItems={tocItems}
            articleContent={articleContent}
        >
            <div className="sq-ft-refined-container">
                {/* Main Dimensions Card */}
                <div className="calc-section-card">
                    <div className="card-header">
                        <div className="header-left">
                            <LayoutGrid size={18} className="header-icon" />
                            <span className="header-title">Square Footage</span>
                        </div>
                        <MoreHorizontal size={18} className="more-options" />
                    </div>

                    <div className="unified-bar-item">
                        <label className="bar-label">Width</label>
                        <div className="bar-container">
                            <input
                                type="number"
                                className="bar-input"
                                value={width.value}
                                onChange={(e) => setWidth({ ...width, value: e.target.value })}
                                placeholder="0"
                            />
                            <select
                                className="bar-unit-select"
                                value={width.unit}
                                onChange={(e) => setWidth({ ...width, unit: e.target.value })}
                            >
                                <option value="ft">ft</option>
                                <option value="m">m</option>
                                <option value="in">in</option>
                                <option value="cm">cm</option>
                                <option value="yd">yd</option>
                            </select>
                            <ChevronDown size={14} className="unit-chevron" />
                        </div>
                    </div>

                    <div className="unified-bar-item">
                        <label className="bar-label">Length</label>
                        <div className="bar-container">
                            <input
                                type="number"
                                className="bar-input"
                                value={length.value}
                                onChange={(e) => setLength({ ...length, value: e.target.value })}
                                placeholder="0"
                            />
                            <select
                                className="bar-unit-select"
                                value={length.unit}
                                onChange={(e) => setLength({ ...length, unit: e.target.value })}
                            >
                                <option value="ft">ft</option>
                                <option value="m">m</option>
                                <option value="in">in</option>
                                <option value="cm">cm</option>
                                <option value="yd">yd</option>
                            </select>
                            <ChevronDown size={14} className="unit-chevron" />
                        </div>
                    </div>

                    <div className="unified-bar-item">
                        <label className="bar-label">Quantity <Info size={14} style={{ color: '#94a3b8', marginLeft: '4px' }} /></label>
                        <div className="bar-container quantity-bar">
                            <input
                                type="number"
                                className="bar-input"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="unified-bar-item">
                        <label className="bar-label">Area</label>
                        <div className="bar-container result-bar">
                            <input
                                type="text"
                                className="bar-input"
                                value={area.value}
                                readOnly
                            />
                            <select
                                className="bar-unit-select"
                                value={area.unit}
                                onChange={(e) => setArea({ ...area, unit: e.target.value })}
                            >
                                <option value="ft²">ft²</option>
                                <option value="m²">m²</option>
                                <option value="in²">in²</option>
                                <option value="cm²">cm²</option>
                                <option value="yd²">yd²</option>
                                <option value="ac">ac</option>
                            </select>
                            <ChevronDown size={14} className="unit-chevron" />
                        </div>
                    </div>
                </div>

                {/* Cost Card */}
                <div className="calc-section-card">
                    <div className="cost-header">
                        <div className="cost-header-left">
                            <ChevronDown size={18} className="header-icon" />
                            <span className="header-title">Cost of materials</span>
                        </div>
                        <div className="cost-header-right">
                            <Pin size={16} className="pin-icon" />
                            <MoreHorizontal size={18} className="more-options" />
                        </div>
                    </div>

                    <div className="unified-bar-item">
                        <label className="bar-label">Unit price</label>
                        <div className="bar-container">
                            <input
                                type="number"
                                className="bar-input"
                                value={unitPrice.value}
                                onChange={(e) => setUnitPrice({ ...unitPrice, value: e.target.value })}
                                placeholder="0"
                            />
                            <div className="bar-unit-grid">
                                <select
                                    className="price-unit-select"
                                    value={unitPrice.currency}
                                    onChange={(e) => setUnitPrice({ ...unitPrice, currency: e.target.value })}
                                >
                                    <option value="INR">INR</option>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="GBP">GBP</option>
                                </select>
                                <select
                                    className="price-unit-select"
                                    value={unitPrice.unit}
                                    onChange={(e) => setUnitPrice({ ...unitPrice, unit: e.target.value })}
                                    style={{ borderLeft: '1px solid #e2e8f0' }}
                                >
                                    <option value="ft²">ft²</option>
                                    <option value="m²">m²</option>
                                    <option value="yd²">yd²</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="unified-bar-item">
                        <label className="bar-label">Total cost</label>
                        <div className="bar-container result-bar">
                            <input
                                type="text"
                                className="bar-input"
                                value={totalCost.value}
                                readOnly
                            />
                            <select
                                className="bar-unit-select"
                                value={totalCost.currency}
                                onChange={(e) => setTotalCost({ ...totalCost, currency: e.target.value })}
                            >
                                <option value="INR">INR</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                            </select>
                            <ChevronDown size={14} className="unit-chevron" />
                        </div>
                    </div>

                    {/* Standardized Actions */}
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

                    <div className="feedback-section-new" style={{ borderTop: 'none', borderBottom: 'none', marginTop: '24px' }}>
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

export default SquareFootageCalculatorPage;
