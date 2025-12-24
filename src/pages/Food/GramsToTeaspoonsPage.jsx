import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, ChevronDown, ChevronUp } from 'lucide-react';
import './GramsToTeaspoonsPage.css';

const GramsToTeaspoonsPage = () => {
    // 1 tsp = 4.92892 ml
    const TSP_VOL_ML = 4.92892;

    const ingredientData = {
        sugar: {
            label: 'Sugar',
            types: [
                { label: 'Granulated sugar', density: 0.845 },
                { label: 'Powdered sugar', density: 0.56 },
                { label: 'Brown sugar (packed)', density: 0.821 },
                { label: 'Raw sugar', density: 0.961 }
            ]
        },
        salt: {
            label: 'Salt',
            types: [
                { label: 'Table salt', density: 1.217 },
                { label: 'Kosher salt', density: 1.0 } // Approximate varying
            ]
        },
        flour: {
            label: 'Flour',
            types: [
                { label: 'All purpose flour', density: 0.528 },
                { label: 'Bread flour', density: 0.545 },
                { label: 'Cake flour', density: 0.48 }
            ]
        },
        yeast: {
            label: 'Yeast',
            types: [
                { label: 'Active dry yeast', density: 0.61 }, // approx
                { label: 'Instant yeast', density: 0.58 } // approx
            ]
        },
        water: {
            label: 'Water',
            types: [
                { label: 'Water', density: 1.0 }
            ]
        },
        other: {
            label: 'Other',
            types: [
                { label: 'Butter', density: 0.911 },
                { label: 'Oil, vegetable', density: 0.92 },
                { label: 'Honey', density: 1.42 },
                { label: 'Milk', density: 1.03 }
            ]
        }
    };

    const [ingredientKey, setIngredientKey] = useState('sugar');
    const [typeIndex, setTypeIndex] = useState(0);

    const [grams, setGrams] = useState('');
    const [spoons, setSpoons] = useState('');
    const [spoonUnit, setSpoonUnit] = useState('tsp'); // tsp, tbsp logic can be extended if needed, sticking to tsp as per request

    const [isUpdating, setIsUpdating] = useState(false);

    // Get current density
    const getDensity = () => {
        const types = ingredientData[ingredientKey].types;
        const index = Math.min(typeIndex, types.length - 1);
        return types[index].density;
    };

    const handleIngredientChange = (key) => {
        setIngredientKey(key);
        setTypeIndex(0); // Reset to first type
        recalculate(key, 0, grams, 'grams');
    };

    const handleTypeChange = (index) => {
        setTypeIndex(parseInt(index));
        recalculate(ingredientKey, parseInt(index), grams, 'grams');
    };

    const recalculate = (key, idx, val, source) => {
        const types = ingredientData[key].types;
        const validIdx = Math.min(idx, types.length - 1);
        const density = types[validIdx].density;

        if (source === 'grams') {
            if (!val) {
                setSpoons('');
                return;
            }
            const g = parseFloat(val);
            if (!isNaN(g)) {
                // tsp = grams / (density * tsp_vol)
                const t = g / (density * TSP_VOL_ML);
                setSpoons(t.toFixed(2).replace(/\.?0+$/, ''));
            }
        }
    };

    const handleGramsChange = (val) => {
        setGrams(val);
        if (!val) {
            setSpoons('');
            return;
        }
        const g = parseFloat(val);
        if (!isNaN(g)) {
            const density = getDensity();
            const t = g / (density * TSP_VOL_ML);
            setSpoons(t.toFixed(2).replace(/\.?0+$/, ''));
        }
    };

    const handleSpoonsChange = (val) => {
        setSpoons(val);
        if (!val) {
            setGrams('');
            return;
        }
        const t = parseFloat(val);
        if (!isNaN(t)) {
            const density = getDensity();
            // g = tsp * density * tsp_vol
            const g = t * density * TSP_VOL_ML;
            setGrams(g.toFixed(2).replace(/\.?0+$/, ''));
        }
    };

    const creators = [
        { name: "Hanna Pamuła", role: "PhD" },
    ];

    const reviewers = [
        { name: "Bagna Szyk", role: "" },
        { name: "Jack Bowater", role: "" }
    ];

    const articleContent = (
        <>
            <p>
                With this grams-to-teaspoons converter, you'll <strong>quickly convert between grams</strong> – the basic unit of weight (mass) in the metric system – <strong>and teaspoons (tsp)</strong>, which are a measure of <a href="#">volume</a> often used in cooking.
            </p>
            <h3>How many grams in a teaspoon?</h3>
            <p>
                To convert grams to teaspoons, you need to know the density of the ingredient. The formula is:
                <br />
                <code>Teaspoons = Grams / (Density × 4.9289)</code>
            </p>
        </>
    );

    return (
        <CalculatorLayout
            title="Grams to Teaspoons Converter"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "How many grams in a teaspoon?",
                "How many teaspoons in a tablespoon?",
                "How many teaspoons in a cup?",
                "How many calories in a teaspoon of sugar?",
                "FAQs"
            ]}
            articleContent={articleContent}
            similarCalculators={186}
        >
            <div className="grams-to-teaspoons-page">

                {/* Section 1: Select ingredient */}
                <div className="section-card">
                    <div className="section-header">
                        <div className="section-title">
                            <ChevronUp size={20} color="#3b82f6" /> Select the ingredient
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Ingredient</label><span className="more-options">...</span></div>
                        <div className="select-wrapper">
                            <select
                                value={ingredientKey}
                                onChange={(e) => handleIngredientChange(e.target.value)}
                                className="calc-select"
                            >
                                {Object.keys(ingredientData).map(key => (
                                    <option key={key} value={key}>{ingredientData[key].label}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="select-arrow" />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Type</label><span className="more-options">...</span></div>
                        <div className="select-wrapper">
                            <select
                                value={typeIndex}
                                onChange={(e) => handleTypeChange(e.target.value)}
                                className="calc-select"
                            >
                                {ingredientData[ingredientKey].types.map((type, idx) => (
                                    <option key={idx} value={idx}>{type.label}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} className="select-arrow" />
                        </div>
                    </div>
                </div>

                {/* Section 2: Convert */}
                <div className="section-card">
                    <div className="section-header">
                        <div className="section-title">
                            Convert
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Grams</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={grams}
                                onChange={(e) => handleGramsChange(e.target.value)}
                            />
                            <span className="input-suffix">g</span>
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Spoons</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={spoons}
                                onChange={(e) => handleSpoonsChange(e.target.value)}
                            />
                            <div className="unit-select-container">
                                <select value={spoonUnit} onChange={(e) => setSpoonUnit(e.target.value)} className="unit-select">
                                    <option value="tsp">tsp</option>
                                </select>
                                <ChevronDown size={14} className="unit-arrow" />
                            </div>
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
                                setGrams('');
                                setSpoons('');
                            }}>Clear all changes</button>
                        </div>
                    </div>

                    <div className="feedback-section">
                        <p>Did we solve your problem today?</p>
                        <div>
                            <button className="feedback-btn">Yes</button>
                            <button className="feedback-btn">No</button>
                        </div>
                    </div>
                </div>

            </div>
        </CalculatorLayout>
    );
};

export default GramsToTeaspoonsPage;
