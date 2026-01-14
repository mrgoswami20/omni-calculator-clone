import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import {
    ChevronDown,
    RefreshCcw,
    X,
    MoreHorizontal
} from 'lucide-react';
import './CubicYardCalculatorPage.css';

const InputRow = ({ label, state, setState, units = 'length' }) => (
    <div className="full-width-item">
        <div className="item-header-label">
            <span>{label}</span>
            <MoreHorizontal size={14} className="pin-action" />
        </div>
        <div className="unified-bar-wrap">
            <input
                type="number"
                className="bar-main-input"
                value={state.value}
                onChange={(e) => setState({ ...state, value: e.target.value })}
             onWheel={(e) => e.target.blur()} />
            <select
                className="bar-unit-dropdown"
                value={state.unit}
                onChange={(e) => setState({ ...state, unit: e.target.value })}
            >
                {units === 'length' && (
                    <>
                        <option value="ft">ft</option>
                        <option value="yd">yd</option>
                        <option value="m">m</option>
                        <option value="cm">cm</option>
                        <option value="in">in</option>
                    </>
                )}
                {units === 'area' && (
                    <>
                        <option value="ft²">ft²</option>
                        <option value="yd²">yd²</option>
                        <option value="m²">m²</option>
                        <option value="in²">in²</option>
                    </>
                )}
            </select>
            <ChevronDown size={14} className="unit-icon-small" />
        </div>
    </div>
);


const CollapsibleCard = ({ title, isOpen, onToggle, children }) => (
    <div className="calc-section-card">
        <div
            className="card-header-polished"
            onClick={onToggle}
            style={{ cursor: 'pointer' }}
        >
            <div className="header-left-part">
                <ChevronDown
                    size={18}
                    className="header-icon-blue"
                    style={{
                        transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                        transition: 'transform 0.2s ease'
                    }}
                />
                <span className="card-main-title">{title}</span>
            </div>
            <MoreHorizontal size={18} className="pin-action" />
        </div>

        {isOpen && (
            <div className="card-content">
                {children}
            </div>
        )}
    </div>
);

const CubicYardCalculatorPage = () => {
    // --- State ---
    const [shape, setShape] = useState('rectangular-cuboid');

    // Collapsible State
    const [sections, setSections] = useState({
        shape: true,
        yardage: true,
        cost: true
    });

    const toggleSection = (section) => {
        setSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Dimension States
    const [length, setLength] = useState({ value: '', unit: 'ft' });
    const [width, setWidth] = useState({ value: '', unit: 'ft' });
    const [depth, setDepth] = useState({ value: '', unit: 'ft' }); // Also acts as Height
    const [side, setSide] = useState({ value: '', unit: 'ft' }); // For Cube
    const [radius, setRadius] = useState({ value: '', unit: 'ft' }); // For Cylinder, Cone, Hemisphere
    const [diameter, setDiameter] = useState({ value: '', unit: 'ft' }); // Alternative for radius
    const [innerRadius, setInnerRadius] = useState({ value: '', unit: 'ft' }); // Hollow Cylinder
    const [thickness, setThickness] = useState({ value: '', unit: 'in' }); // Hollow shapes
    const [area, setArea] = useState({ value: '', unit: 'ft²' }); // For "Other"

    // Outputs
    const [volume, setVolume] = useState({ value: '', unit: 'cu yd' });
    const [cost, setCost] = useState({ value: '', unit: 'cu yd', currency: 'USD' });
    const [totalPrice, setTotalPrice] = useState({ value: '', currency: 'USD' });

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
            'yd²': 9
        },
        volume: {
            'cu ft': 1,
            'cu yd': 27,
            'cu m': 35.3147,
            'cu in': 0.000578704
        }
    };

    // Helper: Get value in feet
    const toFt = (val, unit) => {
        const parsed = parseFloat(val);
        if (isNaN(parsed)) return 0;
        return parsed * CONVERSIONS.length[unit];
    };

    const toFtArea = (val, unit) => {
        const parsed = parseFloat(val);
        if (isNaN(parsed)) return 0;
        return parsed * CONVERSIONS.area[unit];
    };


    // --- Calculation Logic ---
    useEffect(() => {
        let vol_ft3 = 0;
        let valid = false;

        switch (shape) {
            case 'rectangular-cuboid': {
                const l = toFt(length.value, length.unit);
                const w = toFt(width.value, width.unit);
                const d = toFt(depth.value, depth.unit);
                if (l && w && d) {
                    vol_ft3 = l * w * d;
                    valid = true;
                }
                break;
            }
            case 'cube': {
                const s = toFt(side.value, side.unit);
                if (s) {
                    vol_ft3 = Math.pow(s, 3);
                    valid = true;
                }
                break;
            }
            case 'cylinder': {
                let r = toFt(radius.value, radius.unit);
                // Simple diameter override logic: if radius is empty but diameter has value, use diameter/2
                if (!radius.value && diameter.value) {
                    r = toFt(diameter.value, diameter.unit) / 2;
                }
                const h = toFt(depth.value, depth.unit); // Height
                if (r && h) {
                    vol_ft3 = Math.PI * Math.pow(r, 2) * h;
                    valid = true;
                }
                break;
            }
            case 'hollow-cuboid': {
                const l = toFt(length.value, length.unit);
                const w = toFt(width.value, width.unit);
                const h = toFt(depth.value, depth.unit);
                const t = toFt(thickness.value, thickness.unit);

                if (l && w && h) {
                    if (t) {
                        const l_in = Math.max(0, l - 2 * t);
                        const w_in = Math.max(0, w - 2 * t);
                        const outerArea = l * w;
                        const innerArea = l_in * w_in;
                        vol_ft3 = (outerArea - innerArea) * h;
                        valid = true;
                    }
                }
                break;
            }
            case 'hollow-cylinder': {
                const h = toFt(depth.value, depth.unit);
                const r_out = toFt(radius.value, radius.unit);
                const t = toFt(thickness.value, thickness.unit);

                if (h && r_out && t) {
                    const r_in = Math.max(0, r_out - t);
                    vol_ft3 = Math.PI * h * (Math.pow(r_out, 2) - Math.pow(r_in, 2));
                    valid = true;
                }
                break;
            }
            case 'hemisphere': {
                const r = toFt(radius.value, radius.unit);
                if (r) {
                    vol_ft3 = (2 / 3) * Math.PI * Math.pow(r, 3);
                    valid = true;
                }
                break;
            }
            case 'cone': {
                const r = toFt(radius.value, radius.unit);
                const h = toFt(depth.value, depth.unit);
                if (r && h) {
                    vol_ft3 = (1 / 3) * Math.PI * Math.pow(r, 2) * h;
                    valid = true;
                }
                break;
            }
            case 'pyramid': {
                // Rectangular Pyramid
                const l = toFt(length.value, length.unit);
                const w = toFt(width.value, width.unit);
                const h = toFt(depth.value, depth.unit);
                if (l && w && h) {
                    vol_ft3 = (l * w * h) / 3;
                    valid = true;
                }
                break;
            }
            case 'other': {
                const a = toFtArea(area.value, area.unit);
                const d = toFt(depth.value, depth.unit);
                if (a && d) {
                    vol_ft3 = a * d;
                    valid = true;
                }
                break;
            }
            default: break;
        }

        if (valid) {
            // Convert ft³ to target unit
            const displayVol = vol_ft3 / CONVERSIONS.volume[volume.unit];
            setVolume(prev => ({ ...prev, value: displayVol.toFixed(2).replace(/\.00$/, '') }));

            // Price Calc
            const costVal = parseFloat(cost.value);
            if (!isNaN(costVal) && costVal > 0) {
                const volInCostUnit = vol_ft3 / CONVERSIONS.volume[cost.unit];
                const total = volInCostUnit * costVal;
                setTotalPrice({
                    value: total.toFixed(2),
                    currency: cost.currency
                });
            } else {
                setTotalPrice(prev => ({ ...prev, value: '' }));
            }

        } else {
            setVolume(prev => ({ ...prev, value: '' }));
            setTotalPrice(prev => ({ ...prev, value: '' }));
        }

    }, [shape, length, width, depth, side, radius, diameter, innerRadius, thickness, area, volume.unit, cost]);


    const handleClear = () => {
        setLength({ value: '', unit: 'ft' });
        setWidth({ value: '', unit: 'ft' });
        setDepth({ value: '', unit: 'ft' });
        setSide({ value: '', unit: 'ft' });
        setRadius({ value: '', unit: 'ft' });
        setDiameter({ value: '', unit: 'ft' });
        setInnerRadius({ value: '', unit: 'ft' });
        setThickness({ value: '', unit: 'in' });
        setArea({ value: '', unit: 'ft²' });

        setVolume({ value: '', unit: 'cu yd' });
        setCost({ value: '', unit: 'cu yd', currency: 'USD' });
        setTotalPrice({ value: '', currency: 'USD' });
    };

    const handleReload = () => {
        window.location.reload();
    };

    const tocItems = [
        "How much is a cubic yard?",
        "How do I convert cubic feet to cubic yards?",
        "How do I convert cubic inches to cubic yards?",
        "How to estimate a volume from square feet to cubic yards?",
        "How to use cubic yard calculator?",
        "Yardage calculator in practice",
        "FAQs"
    ];

    const articleContent = (
        <div className="article-container">
            <h2 className="article-title">How much is a cubic yard?</h2>
            <p>
                A <strong>cubic yard</strong> is a unit of volume often used in construction for materials like concrete, gravel, or dirt. One cubic yard is equal to the volume of a cube with sides of 1 yard (or 3 feet) in length.
            </p>
            <div className="premium-formula-box" style={{ background: '#fffef0', border: '1px solid #f0e68c' }}>
                <div className="math-latex" style={{ fontSize: '14px', lineHeight: '1.8' }}>
                    1 cubic yard = 27 cubic feet<br />
                    1 cubic yard ≈ 0.7646 cubic meters
                </div>
            </div>
        </div>
    );

    return (
        <CalculatorLayout
            title="Cubic Yard Calculator"
            creators={[{ name: "Wojciech Sas", title: "PhD" }]}
            reviewers={[{ name: "Bogna Szyk", title: "" }, { name: "Jack Bowater" }]}
            tocItems={tocItems}
            articleContent={articleContent}
        >
            <div className="cubic-yard-calculator-container">
                {/* Shape Card */}
                <CollapsibleCard
                    title="Shape and dimensions"
                    isOpen={sections.shape}
                    onToggle={() => toggleSection('shape')}
                >
                    {/* Dynamic Shape Selector */}
                    <div className="full-width-item">
                        <div className="item-header-label">
                            <span>Shape</span>
                            <MoreHorizontal size={14} className="pin-action" />
                        </div>
                        <div className="unified-bar-wrap" style={{ paddingRight: 0 }}>
                            <select
                                className="bar-main-input"
                                style={{ cursor: 'pointer', appearance: 'none', width: '100%', height: '100%', fontWeight: 500 }}
                                value={shape}
                                onChange={(e) => setShape(e.target.value)}
                            >
                                <option value="rectangular-cuboid">Rectangular cuboid</option>
                                <option value="cube">Cube</option>
                                <option value="cylinder">Cylinder</option>
                                <option value="hollow-cuboid">Hollow cuboid / Rectangular tube</option>
                                <option value="hollow-cylinder">Hollow cylinder</option>
                                <option value="hemisphere">Hemisphere</option>
                                <option value="cone">Cone</option>
                                <option value="pyramid">Pyramid</option>
                                <option value="other">Other shape</option>
                            </select>
                            <ChevronDown size={14} className="unit-icon-small" style={{ right: '15px' }} />
                        </div>
                    </div>

                    {/* Dynamic Inputs Based on Shape */}
                    {shape === 'rectangular-cuboid' && (
                        <>
                            <InputRow label="Length" state={length} setState={setLength} />
                            <InputRow label="Width" state={width} setState={setWidth} />
                            <InputRow label="Depth / Height" state={depth} setState={setDepth} />
                        </>
                    )}

                    {shape === 'cube' && <InputRow label="Side length" state={side} setState={setSide} />}

                    {shape === 'cylinder' && (
                        <>
                            <InputRow label="Radius" state={radius} setState={setRadius} />
                            <InputRow label="Height" state={depth} setState={setDepth} />
                        </>
                    )}

                    {shape === 'hollow-cuboid' && (
                        <>
                            <InputRow label="Outer Length" state={length} setState={setLength} />
                            <InputRow label="Outer Width" state={width} setState={setWidth} />
                            <InputRow label="Height" state={depth} setState={setDepth} />
                            <InputRow label="Wall Thickness" state={thickness} setState={setThickness} units="length" />
                        </>
                    )}

                    {shape === 'hollow-cylinder' && (
                        <>
                            <InputRow label="Height" state={depth} setState={setDepth} />
                            <InputRow label="Outer Radius" state={radius} setState={setRadius} />
                            <InputRow label="Wall Thickness" state={thickness} setState={setThickness} units="length" />
                        </>
                    )}

                    {shape === 'hemisphere' && <InputRow label="Radius" state={radius} setState={setRadius} />}

                    {shape === 'cone' && (
                        <>
                            <InputRow label="Radius" state={radius} setState={setRadius} />
                            <InputRow label="Height" state={depth} setState={setDepth} />
                        </>
                    )}

                    {shape === 'pyramid' && (
                        <>
                            <InputRow label="Base Length" state={length} setState={setLength} />
                            <InputRow label="Base Width" state={width} setState={setWidth} />
                            <InputRow label="Height" state={depth} setState={setDepth} />
                        </>
                    )}

                    {shape === 'other' && (
                        <>
                            <InputRow label="Total Area" state={area} setState={setArea} units="area" />
                            <InputRow label="Depth / Height" state={depth} setState={setDepth} />
                        </>
                    )}

                </CollapsibleCard>

                {/* Yardage (Volume) Card */}
                <CollapsibleCard
                    title="Yardage"
                    isOpen={sections.yardage}
                    onToggle={() => toggleSection('yardage')}
                >
                    <div className="full-width-item">
                        <div className="item-header-label">
                            <span>Volume</span>
                            <MoreHorizontal size={14} className="pin-action" />
                        </div>
                        <div className="unified-bar-wrap">
                            <input
                                type="text"
                                className="bar-main-input"
                                value={volume.value}
                                readOnly
                                style={{ color: '#2563eb', fontWeight: 600 }}
                            />
                            <select
                                className="bar-unit-dropdown"
                                value={volume.unit}
                                onChange={(e) => setVolume({ ...volume, unit: e.target.value })}
                            >
                                <option value="cu yd">cu yd</option>
                                <option value="cu ft">cu ft</option>
                                <option value="cu m">cu m</option>
                                <option value="cu in">cu in</option>
                            </select>
                            <ChevronDown size={14} className="unit-icon-small" />
                        </div>
                    </div>
                </CollapsibleCard>

                {/* Cost Calculation Card */}
                <CollapsibleCard
                    title="Cost calculation"
                    isOpen={sections.cost}
                    onToggle={() => toggleSection('cost')}
                >
                    {/* Price per unit */}
                    <div className="full-width-item">
                        <div className="item-header-label">
                            <span>Price per unit</span>
                            <MoreHorizontal size={14} className="pin-action" />
                        </div>
                        <div className="unified-bar-wrap">
                            <input
                                type="number"
                                className="bar-main-input"
                                value={cost.value}
                                onChange={(e) => setCost({ ...cost, value: e.target.value })}
                                placeholder="0"
                             onWheel={(e) => e.target.blur()} />
                            <div className="cost-input-group">
                                <select
                                    className="bar-unit-dropdown currency-select"
                                    value={cost.currency}
                                    onChange={(e) => setCost({ ...cost, currency: e.target.value })}
                                    style={{ width: 'auto' }}
                                >
                                    <option value="INR">INR</option>
                                    <option value="USD">$</option>
                                    <option value="EUR">€</option>
                                    <option value="GBP">£</option>
                                </select>
                                <ChevronDown size={14} className="unit-icon-small" style={{ right: '0px', position: 'relative' }} />

                                <span className="slash-separator">/</span>

                                <select
                                    className="bar-unit-dropdown"
                                    value={cost.unit}
                                    onChange={(e) => setCost({ ...cost, unit: e.target.value })}
                                    style={{ width: 'auto' }}
                                >
                                    <option value="cu yd">cu yd</option>
                                    <option value="cu ft">cu ft</option>
                                    <option value="cu m">cu m</option>
                                </select>
                                <ChevronDown size={14} className="unit-icon-small" style={{ right: '0px', position: 'relative' }} />
                            </div>
                        </div>
                    </div>

                    {/* Total Price */}
                    <div className="full-width-item">
                        <div className="item-header-label">
                            <span>Total price</span>
                            <MoreHorizontal size={14} className="pin-action" />
                        </div>
                        <div className="unified-bar-wrap">
                            <input
                                type="text"
                                className="bar-main-input"
                                value={totalPrice.value}
                                readOnly
                                style={{ color: '#2563eb', fontWeight: 600 }}
                            />
                            <select
                                className="bar-unit-dropdown"
                                value={cost.currency}
                                onChange={(e) => setCost({ ...cost, currency: e.target.value })}
                                style={{ width: 'auto', marginRight: '15px', color: '#2563eb', fontWeight: 600 }}
                            >
                                <option value="INR">INR</option>
                                <option value="USD">$</option>
                                <option value="EUR">€</option>
                                <option value="GBP">£</option>
                            </select>
                            <ChevronDown size={14} className="unit-icon-small" style={{ right: '0px' }} />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="action-buttons-container">
                        <div className="action-stack">
                            <button className="btn-action-rect" onClick={handleReload}>
                                Reload calculator
                            </button>
                            <button className="btn-action-rect" onClick={handleClear}>
                                Clear all changes
                            </button>
                        </div>
                    </div>
                </CollapsibleCard>

                {/* Feedback */}

            </div>
        </CalculatorLayout>
    );
};

export default CubicYardCalculatorPage;
