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
import './GallonsPerSquareFootCalculatorPage.css';

const GallonsPerSquareFootCalculatorPage = () => {
    // --- State ---
    const [length, setLength] = useState({ value: '', unit: 'ft' });
    const [width, setWidth] = useState({ value: '', unit: 'ft' });
    const [area, setArea] = useState({ value: '', unit: 'ft²' });
    const [height, setHeight] = useState({ value: '', unit: 'ft' });
    const [volume, setVolume] = useState({ value: '', unit: 'US gal' });
    const [density, setDensity] = useState({ value: '', unit: 'US gal / sq.ft' });

    const CONVERSIONS = {
        length: { ft: 1, m: 3.28084, in: 0.0833333, cm: 0.0328084, yd: 3 },
        area: { 'ft²': 1, 'm²': 10.7639, 'in²': 0.00694444, 'cm²': 0.00107639, 'yd²': 9, 'ac': 43560 },
        volume: { 'US gal': 1, 'UK gal': 1.20095, 'liters': 0.264172, 'ft³': 7.48052, 'm³': 264.172 }
    };

    // --- Calculation Logic ---

    // 1. Calculate Area from L & W
    useEffect(() => {
        const lVal = parseFloat(length.value);
        const wVal = parseFloat(width.value);

        if (!isNaN(lVal) && !isNaN(wVal)) {
            const l_ft = lVal * CONVERSIONS.length[length.unit];
            const w_ft = wVal * CONVERSIONS.length[width.unit];
            const area_ft2 = l_ft * w_ft;

            const displayArea = area_ft2 / CONVERSIONS.area[area.unit];
            setArea(prev => ({ ...prev, value: displayArea.toFixed(2).replace(/\.00$/, '') }));
        }
    }, [length.value, length.unit, width.value, width.unit, area.unit]);

    // 2. Main Volume & Density Logic
    useEffect(() => {
        const aVal = parseFloat(area.value);
        const hVal = parseFloat(height.value);

        if (!isNaN(aVal) && !isNaN(hVal)) {
            const area_ft2 = aVal * CONVERSIONS.area[area.unit];
            const height_ft = hVal * CONVERSIONS.length[height.unit];
            const volume_ft3 = area_ft2 * height_ft;
            const volume_gal = volume_ft3 * 7.48052; // ft3 to US gal

            const displayVolume = volume_gal / CONVERSIONS.volume[volume.unit];
            setVolume(prev => ({ ...prev, value: displayVolume.toFixed(2).replace(/\.00$/, '') }));

            // Density (Gals per sq ft) = Volume / Area
            // In base units (US gal and ft2):
            const density_val = volume_gal / area_ft2;

            // For now we only support 'US gal / sq.ft', but we can add 'liters / m2' easily
            if (density.unit === 'US gal / sq.ft') {
                setDensity(prev => ({ ...prev, value: density_val.toFixed(2).replace(/\.00$/, '') }));
            } else if (density.unit === 'liters / m²') {
                const vol_lit = volume_gal * 3.78541;
                const area_m2 = area_ft2 * 0.092903;
                setDensity(prev => ({ ...prev, value: (vol_lit / area_m2).toFixed(2).replace(/\.00$/, '') }));
            }
        } else {
            setVolume(prev => ({ ...prev, value: '' }));
            setDensity(prev => ({ ...prev, value: '' }));
        }
    }, [area.value, area.unit, height.value, height.unit, volume.unit, density.unit]);

    const handleClear = () => {
        setLength({ value: '', unit: 'ft' });
        setWidth({ value: '', unit: 'ft' });
        setArea({ value: '', unit: 'ft²' });
        setHeight({ value: '', unit: 'ft' });
        setVolume({ value: '', unit: 'US gal' });
        setDensity({ value: '', unit: 'US gal / sq.ft' });
    };

    const tocItems = [
        "What is a gallon?",
        "How many gallons in one square foot?",
        "How many square feet in a gallon?",
        "Calculating gallons of water per square foot",
        "How to use this gallons per square foot calculator",
        "FAQs"
    ];

    const articleContent = (
        <div className="article-container">
            <h2 className="article-title">How many gallons in one square foot?</h2>
            <p>
                There are <strong>7.48052 gallons in one cubic foot</strong>. This fundamental conversion factor is the key to understanding how much liquid a surface area can hold.
            </p>
            <p>
                Let's consider a cuboid with a base area <strong>A ft²</strong> and a height <strong>H ft</strong>. To figure out how many gallons are in one square foot, we start by converting its volume <strong>V ft³</strong> from ft³ to US gal:
            </p>

            <div className="premium-formula-box" style={{ background: '#fffef0', border: '1px solid #f0e68c' }}>
                <div className="math-latex" style={{ fontSize: '14px', lineHeight: '1.8' }}>
                    Vol in US gal = V ft³ × 7.48052 US gal/ft³<br />
                    US gal/ft² = (V ft³ / A ft²) × 7.48052 US gal/ft³<br />
                    US gal/ft² = (A ft² × H ft / A ft²) × 7.48052 US gal/ft³<br />
                    <strong>US gal/ft² = H ft × 7.48052 US gal/ft³</strong>
                </div>
            </div>

            <p>
                In other words, the volume in <strong>gallons contained in one square foot</strong> depends entirely on the <strong>object's height (or depth)</strong>. Specifically, it is 7.48052 times the object's height expressed in feet.
            </p>

            <div className="info-box-vibrant" style={{ background: '#f0f4ff', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #3b82f6', marginTop: '20px' }}>
                <p style={{ margin: 0, fontSize: '14px' }}>
                    🙋 <strong>Note:</strong> To convert square feet to gallons, you must multiply the quantity <strong>US gal/ft²</strong> with the base area <strong>A ft²</strong>, which is the same as calculating the volume in ft³ and converting it into US gal. Inverting this process, we can convert gallons to square feet.
                </p>
            </div>
        </div>
    );

    return (
        <CalculatorLayout
            title="Gallons per Square Foot Calculator"
            creators={[{ name: "Krishna Nelaturu" }]}
            reviewers={[{ name: "Steven Wooding" }]}
            tocItems={tocItems}
            articleContent={articleContent}
        >
            <div className="gpsf-refined-container">
                {/* Dimensions Card */}
                <div className="calc-section-card">
                    <div className="card-header-polished">
                        <div className="header-left-part">
                            <ChevronDown size={18} className="header-icon-blue" />
                            <span className="card-main-title">Calculate area</span>
                        </div>
                        <MoreHorizontal size={18} className="pin-action" />
                    </div>
                    <div className="card-content">
                        <div className="input-flex-row">
                            <div className="flex-item">
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
                                        placeholder="0"
                                     onWheel={(e) => e.target.blur()} />
                                    <select
                                        className="bar-unit-dropdown"
                                        value={length.unit}
                                        onChange={(e) => setLength({ ...length, unit: e.target.value })}
                                    >
                                        <option value="ft">ft</option>
                                        <option value="m">m</option>
                                        <option value="in">in</option>
                                        <option value="cm">cm</option>
                                        <option value="yd">yd</option>
                                    </select>
                                    <ChevronDown size={12} className="unit-icon-small" />
                                </div>
                            </div>
                            <div className="flex-item">
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
                                        placeholder="0"
                                     onWheel={(e) => e.target.blur()} />
                                    <select
                                        className="bar-unit-dropdown"
                                        value={width.unit}
                                        onChange={(e) => setWidth({ ...width, unit: e.target.value })}
                                    >
                                        <option value="ft">ft</option>
                                        <option value="m">m</option>
                                        <option value="in">in</option>
                                        <option value="cm">cm</option>
                                        <option value="yd">yd</option>
                                    </select>
                                    <ChevronDown size={12} className="unit-icon-small" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Calculations Card */}
                <div className="calc-section-card">
                    <div className="card-content">
                        <div className="full-width-item">
                            <div className="item-header-label">
                                <span>Area in square feet <Info size={14} style={{ opacity: 0.5, marginLeft: '4px' }} /></span>
                                <MoreHorizontal size={14} className="pin-action" />
                            </div>
                            <div className="unified-bar-wrap">
                                <input
                                    type="number"
                                    className="bar-main-input"
                                    value={area.value}
                                    onChange={(e) => setArea({ ...area, value: e.target.value })}
                                    placeholder="0"
                                 onWheel={(e) => e.target.blur()} />
                                <select
                                    className="bar-unit-dropdown"
                                    value={area.unit}
                                    onChange={(e) => setArea({ ...area, unit: e.target.value })}
                                >
                                    <option value="ft²">ft²</option>
                                    <option value="m²">m²</option>
                                    <option value="ac">ac</option>
                                </select>
                                <ChevronDown size={12} className="unit-icon-small" />
                            </div>
                        </div>

                        <div className="full-width-item">
                            <div className="item-header-label">
                                <span>Height</span>
                                <MoreHorizontal size={14} className="pin-action" />
                            </div>
                            <div className="unified-bar-wrap">
                                <input
                                    type="number"
                                    className="bar-main-input"
                                    value={height.value}
                                    onChange={(e) => setHeight({ ...height, value: e.target.value })}
                                    placeholder="0"
                                 onWheel={(e) => e.target.blur()} />
                                <select
                                    className="bar-unit-dropdown"
                                    value={height.unit}
                                    onChange={(e) => setHeight({ ...height, unit: e.target.value })}
                                >
                                    <option value="ft">ft</option>
                                    <option value="m">m</option>
                                    <option value="in">in</option>
                                    <option value="cm">cm</option>
                                </select>
                                <ChevronDown size={12} className="unit-icon-small" />
                            </div>
                        </div>

                        <div className="full-width-item">
                            <div className="item-header-label">
                                <span>Volume</span>
                                <MoreHorizontal size={14} className="pin-action" />
                            </div>
                            <div className="unified-bar-wrap result-theme">
                                <input
                                    type="text"
                                    className="bar-main-input"
                                    value={volume.value}
                                    readOnly
                                />
                                <select
                                    className="bar-unit-dropdown"
                                    value={volume.unit}
                                    onChange={(e) => setVolume({ ...volume, unit: e.target.value })}
                                >
                                    <option value="US gal">US gal</option>
                                    <option value="UK gal">UK gal</option>
                                    <option value="liters">liters</option>
                                    <option value="ft³">ft³</option>
                                </select>
                                <ChevronDown size={12} className="unit-icon-small" />
                            </div>
                        </div>

                        <div className="full-width-item" style={{ marginTop: '32px' }}>
                            <div className="item-header-label">
                                <span>Gallons per square foot</span>
                                <MoreHorizontal size={14} className="pin-action" />
                            </div>
                            <div className="unified-bar-wrap result-theme" style={{ borderColor: '#2563eb' }}>
                                <input
                                    type="text"
                                    className="bar-main-input"
                                    value={density.value}
                                    readOnly
                                    style={{ color: '#2563eb' }}
                                />
                                <select
                                    className="bar-unit-dropdown"
                                    value={density.unit}
                                    onChange={(e) => setDensity({ ...density, unit: e.target.value })}
                                    style={{ width: '110px' }}
                                >
                                    <option value="US gal / sq.ft">US gal / sq.ft</option>
                                    <option value="liters / m²">liters / m²</option>
                                </select>
                                <ChevronDown size={12} className="unit-icon-small" />
                            </div>
                        </div>
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
                    </div>
                </div>

            </div>
        </CalculatorLayout>
    );
};

export default GallonsPerSquareFootCalculatorPage;
