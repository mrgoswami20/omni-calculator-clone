import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, ChevronDown, ChevronUp, Info } from 'lucide-react';
import './CookingMeasurementConverterPage.css';

const CookingMeasurementConverterPage = () => {

    // Ingredients database with density in g/ml (approx same as kg/L or g/cm3)
    const ingredients = [
        { label: 'Water', density: 1.0 },
        { label: 'Butter', density: 0.911 },
        { label: 'Flour (All Purpose)', density: 0.528 },
        { label: 'Sugar (Granulated)', density: 0.845 },
        { label: 'Milk', density: 1.03 },
        { label: 'Honey', density: 1.42 },
        { label: 'Oil (Vegetable)', density: 0.92 },
        { label: 'Salt (Table)', density: 1.217 },
        { label: 'Rice (raw)', density: 0.85 }, // approx
        { label: 'Oats (rolled)', density: 0.38 } // approx
    ];

    const [selectedIngredient, setSelectedIngredient] = useState('Water');
    const [density, setDensity] = useState(1.0);

    // Base mass in GRAMS serves as the single source of truth
    const [baseMass, setBaseMass] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
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

    // Factors relative to grams
    const FACTORS_WEIGHT = {
        g: 1,
        dag: 10,
        kg: 1000,
        oz: 28.34952,
        lb: 453.59237
    };

    // Factors relative to ml (volume)
    const FACTORS_VOLUME_ML = {
        ml: 1,
        cup: 236.588,
        floz: 29.5735,
        tsp: 4.92892,
        tbsp: 14.7868,
        l: 1000
    };

    useEffect(() => {
        // When ingredient changes, update density
        const ing = ingredients.find(i => i.label === selectedIngredient);
        if (ing) {
            setDensity(ing.density);
            // Re-trigger update of all fields based on current baseMass if it exists
            // Actually, if we change ingredient, mass stays same?
            // Usually, yes. 100g is 100g. But Volume changes.
            // If we have baseMass, we just let the UI re-render?
            // We need to force update inputs if we are using controlled inputs derived from baseMass.
            // But we are using a "push" model in handleChange usually.
            // Let's implement calculateValues to return objects.
        }
    }, [selectedIngredient]);

    // Helper to format
    const fmt = (val) => {
        if (val === '' || val === null || isNaN(val)) return '';
        return parseFloat(val.toFixed(4)).toString(); // Simple cleanup
    };

    const handleUpdate = (type, unit, value) => {
        if (isUpdating) return;
        setIsUpdating(true);

        if (value === '') {
            setBaseMass('');
            setIsUpdating(false);
            return;
        }

        const val = parseFloat(value);
        if (isNaN(val)) {
            // allow typing
            // But we can't easily store invalid state if we want strict sync. 
            // Better to ignore strictly invalid, but allow intermediate like "1."
            // For now, assume valid number or empty.
            setIsUpdating(false);
            return;
        }

        let newMass = 0;
        if (type === 'weight') {
            // Convert to grams
            newMass = val * FACTORS_WEIGHT[unit];
        } else {
            // Volume
            // ml = value * factor
            // g = ml * density
            const ml = val * FACTORS_VOLUME_ML[unit];
            newMass = ml * density;
        }

        setBaseMass(newMass);
        setIsUpdating(false);
    };

    // Derived values for render
    const getValues = () => {
        if (baseMass === '' || baseMass === 0) return {};

        const m = parseFloat(baseMass);

        // Weights
        const weights = {};
        for (const u in FACTORS_WEIGHT) {
            weights[u] = fmt(m / FACTORS_WEIGHT[u]);
        }

        // Volumes
        // ml = g / density
        const mlTotal = m / density;
        const volumes = {};
        for (const u in FACTORS_VOLUME_ML) {
            volumes[u] = fmt(mlTotal / FACTORS_VOLUME_ML[u]);
        }

        return { ...weights, ...volumes };
    };

    const values = getValues();

    const creators = [
        { name: "Hanna Pamuła", role: "PhD" },
    ];

    const reviewers = [
        { name: "Bogna Szyk", role: "" },
        { name: "Jack Bowater", role: "" }
    ];

    const articleContent = (
        <>
            <p>
                This cooking measurement converter can convert any recipe into the units you like. It's not a regular converter. It can freely <strong>switch between <a href="#">volume</a> and <a href="#">weight</a> units</strong> as well, not just one or the other. Isn't that <em>awesome</em>?
            </p>
            <p>
                So, not only grams to cups but also grams to tablespoons or cups to pounds. Don't have a kitchen scale, or do you not know how many tablespoons are in a cup? No problem.
            </p>
        </>
    );

    return (
        <CalculatorLayout
            title="Cooking Measurement Converter"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "Weight conversions...",
                "Volume conversions...",
                "Weight-volume conversions...",
                "Example of use"
            ]}
            articleContent={articleContent}
            similarCalculators={64}
        >
            <div className="cooking-measurement-converter-page">

                {/* Section 1: Ingredient */}
                <div className="section-card">
                    <div className="section-header">
                        <div className="section-title">
                            <ChevronUp size={20} color="#3b82f6" /> Select an ingredient
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Ingredient</label><span className="more-options">...</span></div>
                        <div className="select-wrapper">
                            <select
                                value={selectedIngredient}
                                onChange={(e) => setSelectedIngredient(e.target.value)}
                                className="calc-select"
                            >
                                {ingredients.map(ing => (
                                    <option key={ing.label} value={ing.label}>{ing.label}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="select-arrow" />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row">
                            <label>Density <Info size={12} style={{ display: 'inline', color: '#9ca3af' }} /></label>
                            <span className="more-options">...</span>
                        </div>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                className="calc-input"
                                readOnly
                                value={(density * 1000).toLocaleString('en-US', { maximumFractionDigits: 1 })} // Display as kg/m3 (which is g/ml * 1000)
                                style={{ backgroundColor: '#f3f4f6' }}
                            />
                            <span className="input-suffix">kg/m³</span>
                        </div>
                    </div>
                </div>

                {/* Section 2: Weight Units */}
                <div className="section-card">
                    <div className="section-header">
                        <div className="section-title">
                            <ChevronUp size={20} color="#3b82f6" /> Weight units
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Grams</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={values.g || ''}
                                onChange={(e) => handleUpdate('weight', 'g', e.target.value)}
                            />
                            <span className="input-suffix">g</span>
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Decagrams</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={values.dag || ''}
                                onChange={(e) => handleUpdate('weight', 'dag', e.target.value)}
                            />
                            <span className="input-suffix">dag</span>
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Kilograms</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={values.kg || ''}
                                onChange={(e) => handleUpdate('weight', 'kg', e.target.value)}
                            />
                            <span className="input-suffix">kg</span>
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Ounces</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={values.oz || ''}
                                onChange={(e) => handleUpdate('weight', 'oz', e.target.value)}
                            />
                            <span className="input-suffix">oz</span>
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Pounds</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={values.lb || ''}
                                onChange={(e) => handleUpdate('weight', 'lb', e.target.value)}
                            />
                            <span className="input-suffix">lb</span>
                        </div>
                    </div>
                </div>

                {/* Section 3: Volume Units */}
                <div className="section-card">
                    <div className="section-header">
                        <div className="section-title">
                            <ChevronUp size={20} color="#3b82f6" /> Volume units
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Milliliters</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={values.ml || ''}
                                onChange={(e) => handleUpdate('volume', 'ml', e.target.value)}
                            />
                            <span className="input-suffix">ml</span>
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Cups</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={values.cup || ''}
                                onChange={(e) => handleUpdate('volume', 'cup', e.target.value)}
                            />
                            <span className="input-suffix">US cups</span>
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Fluid ounces</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={values.floz || ''}
                                onChange={(e) => handleUpdate('volume', 'floz', e.target.value)}
                            />
                            <span className="input-suffix">US fl oz</span>
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Teaspoons</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={values.tsp || ''}
                                onChange={(e) => handleUpdate('volume', 'tsp', e.target.value)}
                            />
                            <span className="input-suffix">tsp</span>
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Tablespoons</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={values.tbsp || ''}
                                onChange={(e) => handleUpdate('volume', 'tbsp', e.target.value)}
                            />
                            <span className="input-suffix">tbsp</span>
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Other volume units</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={values.l || ''}
                                onChange={(e) => handleUpdate('volume', 'l', e.target.value)}
                            />
                            <div className="unit-select-container">
                                <span className="input-suffix" style={{ right: '3rem', fontSize: '0.9rem', color: '#3b82f6', fontWeight: 600 }}>
                                    liters
                                </span>
                                <ChevronDown size={14} className="unit-arrow" style={{ position: 'absolute', right: '1rem' }} />
                            </div>
                        </div>
                    </div>

                    <div className="calc-actions">
                        {/* <button className="share-result-btn" onClick={handleShare} style={{ position: 'relative' }}>
                            <div className="share-icon-circle"><Share2 size={14} /></div>
                            Share result
                            {showShareTooltip && <span className="copied-tooltip" style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)' }}>Copied!</span>}
                        </button> */}
                        <div className="secondary-actions">
                            <button className="secondary-btn">Reload calculator</button>
                            <button className="secondary-btn" onClick={() => setBaseMass('')}>Clear all changes</button>
                        </div>
                    </div>
                </div>

            </div>
        </CalculatorLayout>
    );
};

export default CookingMeasurementConverterPage;
