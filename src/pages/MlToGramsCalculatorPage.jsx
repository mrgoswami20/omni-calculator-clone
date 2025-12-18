import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../components/CalculatorLayout';
import { Share2, ChevronDown, ChevronUp } from 'lucide-react';
import './MlToGramsCalculatorPage.css';

const MlToGramsCalculatorPage = () => {

    const ingredients = [
        { label: 'Water', density: 1.0 },
        { label: 'Milk', density: 1.03 },
        { label: 'Flour (All Purpose)', density: 0.528 },
        { label: 'Sugar (Granulated)', density: 0.845 },
        { label: 'Butter', density: 0.911 },
        { label: 'Oil, vegetable', density: 0.92 },
        { label: 'Honey', density: 1.42 },
        { label: 'Salt (Table)', density: 1.217 }
    ];

    const [selectedIngredient, setSelectedIngredient] = useState('Water');
    const [ml, setMl] = useState('');
    const [grams, setGrams] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    const getDensity = () => {
        const ing = ingredients.find(i => i.label === selectedIngredient);
        return ing ? ing.density : 1.0;
    };

    const handleIngredientChange = (val) => {
        setSelectedIngredient(val);
        // If values exist, recalculate grams based on new density (keeping ml constant seems most logical, or finding user intent. 
        // In most converters, input value is preserved, result is updated. 
        // If I have 100ml, and switch to honey, it is still 100ml -> x grams.
        // If I have 100g, and switch to honey, it is still 100g -> x ml.
        // Let's assume we preserve the LAST EDITED field. 
        // For simplicity, let's preserve 'ml' if both are present or last was ml.
        // Actually, let's just trigger a re-calc based on ml if ml is present.
        if (ml) {
            const d = ingredients.find(i => i.label === val).density;
            const m = parseFloat(ml);
            if (!isNaN(m)) {
                const g = m * d;
                setGrams(g.toFixed(2).replace(/\.?0+$/, ''));
            }
        }
    };

    const handleMlChange = (val) => {
        setMl(val);
        if (!val) {
            setGrams('');
            return;
        }

        const m = parseFloat(val);
        if (isNaN(m)) return;

        const d = getDensity();
        const g = m * d;
        setGrams(g.toFixed(2).replace(/\.?0+$/, ''));
    };

    const handleGramsChange = (val) => {
        setGrams(val);
        if (!val) {
            setMl('');
            return;
        }

        const g = parseFloat(val);
        if (isNaN(g)) return;

        const d = getDensity();
        const m = g / d;
        setMl(m.toFixed(2).replace(/\.?0+$/, ''));
    };

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
                With our ml to grams calculator, cooking measurement <a href="#">conversions</a> are a <em>piece of cake!</em> 🍰 Choose the ingredient, type the value in ml or grams, and the calculator will do the rest. If you're wondering if grams are equal to ml or <strong>how to convert ml to grams</strong>, don't worry too much — we've got you covered.
            </p>
            <h3>Are grams equal to ml? ml to grams for water</h3>
            <p>
                Grams are units of <strong>mass</strong> (weight), while milliliters are units of <strong>volume</strong>. Because of that, grams are not equal to ml in general.
            </p>
        </>
    );

    return (
        <CalculatorLayout
            title="ml to Grams Calculator"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "Are grams equal to ml?...",
                "How to convert ml to grams",
                "Conversions from ml to grams...",
                "FAQs"
            ]}
            articleContent={articleContent}
            similarCalculators={1029}
        >
            <div className="ml-to-grams-page">

                {/* Section 1: Select ingredient */}
                <div className="section-card">
                    <div className="section-header">
                        <div className="section-title">
                            <ChevronUp size={20} color="#3b82f6" /> Select your ingredient
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Ingredient</label><span className="more-options">...</span></div>
                        <div className="select-wrapper">
                            <select
                                value={selectedIngredient}
                                onChange={(e) => handleIngredientChange(e.target.value)}
                                className="calc-select"
                            >
                                {ingredients.map(ing => (
                                    <option key={ing.label} value={ing.label}>{ing.label}</option>
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
                        <div className="label-row"><label>Milliliters</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={ml}
                                onChange={(e) => handleMlChange(e.target.value)}
                            />
                            <span className="input-suffix">ml</span>
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

                    <div className="calc-actions">
                        <button className="share-result-btn">
                            <div className="share-icon-circle"><Share2 size={14} /></div>
                            Share result
                        </button>
                        <div className="secondary-actions">
                            <button className="secondary-btn">Reload calculator</button>
                            <button className="secondary-btn" onClick={() => {
                                setMl('');
                                setGrams('');
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

export default MlToGramsCalculatorPage;
