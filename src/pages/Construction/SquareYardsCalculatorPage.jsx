import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import {
    ChevronDown,
    RefreshCcw,
    LayoutGrid,
    MoreHorizontal,
    Share2,
    X
} from 'lucide-react';
import './SquareYardsCalculatorPage.css';

const SquareYardsCalculatorPage = () => {
    // --- State ---
    // Screenshot shows 'm' as selected unit for Length/Width
    const [length, setLength] = useState({ value: '', unit: 'm' });
    const [width, setWidth] = useState({ value: '', unit: 'm' });
    const [cost, setCost] = useState({ value: '0.00', unit: 'yd²', currency: 'INR' });

    // Outputs
    const [yardage, setYardage] = useState({ value: '', unit: 'yd²' });
    const [estimatedPrice, setEstimatedPrice] = useState({ value: '', currency: 'INR' });

    // Constants
    const CONVERSIONS = {
        length: {
            ft: 1,
            m: 3.28084,
            in: 0.0833333,
            cm: 0.0328084,
            yd: 3
        },
        area: {
            'ft²': 1,
            'm²': 10.7639,
            'in²': 0.00694444,
            'cm²': 0.00107639,
            'yd²': 9,
            'ac': 43560
        }
    };

    // --- Calculation Logic ---
    useEffect(() => {
        const lVal = parseFloat(length.value);
        const wVal = parseFloat(width.value);
        const costVal = parseFloat(cost.value);

        if (!isNaN(lVal) && !isNaN(wVal)) {
            // 1. Calculate base area in ft²
            const l_ft = lVal * CONVERSIONS.length[length.unit];
            const w_ft = wVal * CONVERSIONS.length[width.unit];
            const area_ft2 = l_ft * w_ft;

            // 2. Convert to displayed yardage unit
            const displayArea = area_ft2 / CONVERSIONS.area[yardage.unit];
            setYardage(prev => ({ ...prev, value: displayArea.toFixed(2).replace(/\.00$/, '') }));

            // 3. Calculate Price
            if (!isNaN(costVal)) {
                // Area in cost unit
                const areaInCostUnit = area_ft2 / CONVERSIONS.area[cost.unit];
                const totalPrice = areaInCostUnit * costVal;

                setEstimatedPrice({
                    value: totalPrice.toFixed(2),
                    currency: cost.currency
                });
            } else {
                setEstimatedPrice(prev => ({ ...prev, value: '' }));
            }

        } else {
            setYardage(prev => ({ ...prev, value: '' }));
            setEstimatedPrice(prev => ({ ...prev, value: '' }));
        }
    }, [length.value, length.unit, width.value, width.unit, yardage.unit, cost.value, cost.unit, cost.currency]);


    const handleClear = () => {
        setLength({ value: '', unit: 'ft' });
        setWidth({ value: '', unit: 'ft' });
        setCost({ value: '0.00', unit: 'yd²', currency: 'INR' });
        setYardage({ value: '', unit: 'yd²' });
        setEstimatedPrice({ value: '', currency: 'INR' });
    };

    const handleReload = () => {
        window.location.reload();
    };

    const tocItems = [
        "What is a square yard?",
        "How to calculate square yards?",
        "Square yards to acres",
        "This square yards calculator - an example",
        "FAQs"
    ];

    const articleContent = (
        <div className="article-container">
            <h2 className="article-title">What is a square yard? How to calculate square yard?</h2>
            <p>
                A <strong>square yard</strong> is a unit of area measurement used in the Imperial (and US Customary) system. It represents the area of a square with sides that are each one yard long.
            </p>
            <p>
                Since 1 yard is equal to 3 feet, a square yard is equal to:
            </p>
            <div className="premium-formula-box" style={{ background: '#fffef0', border: '1px solid #f0e68c' }}>
                <div className="math-latex" style={{ fontSize: '14px', lineHeight: '1.8' }}>
                    1 yd = 3 ft<br />
                    1 yd² = (1 yd) × (1 yd) = (3 ft) × (3 ft) = <strong>9 ft²</strong>
                </div>
            </div>
            <p>
                To calculate the square yardage of any rectangular area, simply measure the length and width in yards and multiply them together. If your measurements are in feet, multiply length by width to get square feet, then divide by 9 to get square yards.
            </p>

            <h3 className="article-title" style={{ marginTop: '32px' }}>Square yards to acres</h3>
            <p>
                For larger land measurements, you might need to convert square yards to acres.
                One acre is equal to <strong>4,840 square yards</strong>.
            </p>

            <div className="info-box-vibrant">
                <p style={{ margin: 0, fontSize: '14px' }}>
                    🙋 <strong>Example:</strong> If you have a room that is 18 feet long and 12 feet wide.<br />
                    Area in sq ft = 18 × 12 = 216 ft².<br />
                    Area in sq yards = 216 / 9 = 24 yd².
                </p>
            </div>
        </div>
    );

    return (
        <CalculatorLayout
            title="Square Yards Calculator"
            creators={[{ name: "Dominika Świątek", title: "MD, PhD candidate" }]}
            reviewers={[{ name: "Dominik Czernia", title: "PhD" }, { name: "Jack Bowater" }]}
            tocItems={tocItems}
            articleContent={articleContent}
        >
            <div className="square-yards-calculator-container">
                {/* Intro Text Card (Top) */}
                <div className="calc-section-card" style={{ padding: '20px' }}>
                    <p style={{ margin: 0, color: '#111827', lineHeight: '1.6', fontSize: '15px' }}>
                        This is the simple square yards calculator. If you prefer <strong>advanced calculations for various shapes</strong>, please check <a href="#" style={{ color: '#2563eb', textDecoration: 'none' }}>this calculator</a>.
                    </p>

                    {/* Length */}
                    <div className="full-width-item" style={{ marginTop: '20px' }}>
                        <div className="item-header-label">
                            <span>Length</span>
                            <MoreHorizontal size={14} className="pin-action" />
                        </div>
                        <div className="unified-bar-wrap">
                            <input
                                type="number"
                                className="bar-main-input"
                                value={length.value}
                                onChange={(e) => setLength({ ...length, value: e.target.value })}
                             onWheel={(e) => e.target.blur()} />
                            <select
                                className="bar-unit-dropdown"
                                value={length.unit}
                                onChange={(e) => setLength({ ...length, unit: e.target.value })}
                            >
                                <option value="m">m</option>
                                <option value="ft">ft</option>
                                <option value="yd">yd</option>
                                <option value="cm">cm</option>
                                <option value="in">in</option>
                            </select>
                            <ChevronDown size={14} className="unit-icon-small" />
                        </div>
                    </div>

                    {/* Width */}
                    <div className="full-width-item" style={{ marginTop: '16px' }}>
                        <div className="item-header-label">
                            <span>Width</span>
                            <MoreHorizontal size={14} className="pin-action" />
                        </div>
                        <div className="unified-bar-wrap">
                            <input
                                type="number"
                                className="bar-main-input"
                                value={width.value}
                                onChange={(e) => setWidth({ ...width, value: e.target.value })}
                             onWheel={(e) => e.target.blur()} />
                            <select
                                className="bar-unit-dropdown"
                                value={width.unit}
                                onChange={(e) => setWidth({ ...width, unit: e.target.value })}
                            >
                                <option value="m">m</option>
                                <option value="ft">ft</option>
                                <option value="yd">yd</option>
                                <option value="cm">cm</option>
                                <option value="in">in</option>
                            </select>
                            <ChevronDown size={14} className="unit-icon-small" />
                        </div>
                    </div>

                    {/* Cost per unit area */}
                    <div className="full-width-item" style={{ marginTop: '16px' }}>
                        <div className="item-header-label">
                            <span>Cost of one area unit</span>
                            <MoreHorizontal size={14} className="pin-action" />
                        </div>
                        <div className="unified-bar-wrap">
                            <input
                                type="number"
                                className="bar-main-input"
                                value={cost.value}
                                onChange={(e) => setCost({ ...cost, value: e.target.value })}
                             onWheel={(e) => e.target.blur()} />
                            <div className="cost-input-group">
                                <select
                                    className="bar-unit-dropdown currency-select"
                                    value={cost.currency}
                                    onChange={(e) => setCost({ ...cost, currency: e.target.value })}
                                    style={{ width: 'auto', paddingRight: '16px' }}
                                >
                                    <option value="INR">INR</option>
                                    <option value="USD">$</option>
                                    <option value="EUR">€</option>
                                    <option value="GBP">£</option>
                                </select>
                                <ChevronDown size={14} className="unit-icon-small" style={{ right: 'unset', position: 'static' }} />

                                <span className="slash-separator">/</span>

                                <select
                                    className="bar-unit-dropdown"
                                    value={cost.unit}
                                    onChange={(e) => setCost({ ...cost, unit: e.target.value })}
                                    style={{ width: 'auto', paddingRight: '20px' }}
                                >
                                    <option value="yd²">yd²</option>
                                    <option value="ft²">ft²</option>
                                    <option value="m²">m²</option>
                                    <option value="ac">ac</option>
                                </select>
                                <ChevronDown size={14} className="unit-icon-small" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Card */}
                <div className="calc-section-card">
                    <div className="card-header-polished" style={{ padding: '16px 20px' }}>
                        <div className="header-left-part">
                            <ChevronDown size={18} className="header-icon-blue" />
                            <span className="card-main-title">Results</span>
                        </div>
                    </div>
                    <div className="card-content">
                        {/* Yardage Result */}
                        <div className="full-width-item">
                            <div className="item-header-label">
                                <span>Yardage</span>
                                <MoreHorizontal size={14} className="pin-action" />
                            </div>
                            <div className="unified-bar-wrap">
                                <input
                                    type="text"
                                    className="bar-main-input"
                                    value={yardage.value}
                                    readOnly
                                    style={{ color: '#2563eb', fontWeight: 600 }}
                                />
                                <select
                                    className="bar-unit-dropdown"
                                    value={yardage.unit}
                                    onChange={(e) => setYardage({ ...yardage, unit: e.target.value })}
                                >
                                    <option value="yd²">yd²</option>
                                    <option value="ft²">ft²</option>
                                    <option value="m²">m²</option>
                                    <option value="ac">ac</option>
                                </select>
                                <ChevronDown size={14} className="unit-icon-small" />
                            </div>
                        </div>

                        {/* Estimated Price Result */}
                        <div className="full-width-item">
                            <div className="item-header-label">
                                <span>Estimated price</span>
                                <MoreHorizontal size={14} className="pin-action" />
                            </div>
                            <div className="unified-bar-wrap">
                                <input
                                    type="text"
                                    className="bar-main-input"
                                    value={estimatedPrice.value}
                                    readOnly
                                    style={{ color: '#2563eb', fontWeight: 600 }}
                                />
                                <span style={{ fontSize: '14px', color: '#2563eb', fontWeight: 600, marginRight: '18px' }}>
                                    {estimatedPrice.currency}
                                </span>
                                <ChevronDown size={14} className="unit-icon-small" />
                            </div>
                        </div>

                        <div className="action-buttons-container">
                            <div className="action-stack">
                                {/*
                                <button className="share-btn-circle">
                                    <Share2 size={20} />
                                </button>
                                */}
                                <button className="btn-action-rect" onClick={handleReload}>
                                    Reload calculator
                                </button>
                                <button className="btn-action-rect" onClick={handleClear}>
                                    Clear all changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CalculatorLayout>
    );
};

export default SquareYardsCalculatorPage;
