import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, ChevronDown, ChevronUp } from 'lucide-react';
import './GramsToTablespoonsPage.css';

const GramsToTablespoonsPage = () => {
    // Conversion Logic:
    // Volume (ml) = Weight (g) / Density (g/ml)
    // 1 Tbsp (US) = 14.7868 ml
    // 1 Tbsp = (Grams / Density) / 14.7868
    // Or simpler: Grams per Tbsp = Density * 14.7868

    const ingredients = [
        { value: 'water', label: 'Water', density: 1.0 }, // 1g/ml -> ~14.8g/tbsp
        { value: 'butter', label: 'Butter', density: 0.959 }, // ~14.2 g/tbsp
        { value: 'flour_all_purpose', label: 'Flour (all purpose)', density: 0.528 }, // ~7.8 g/tbsp
        { value: 'sugar_granulated', label: 'Sugar (granulated)', density: 0.845 }, // ~12.5 g/tbsp
        { value: 'salt', label: 'Salt', density: 1.217 }, // ~18 g/tbsp
        { value: 'honey', label: 'Honey', density: 1.42 }, // ~21 g/tbsp
        { value: 'milk', label: 'Milk', density: 1.03 }, // ~15.2 g/tbsp
        { value: 'oil_vegetable', label: 'Oil (vegetable)', density: 0.92 }, // ~13.6 g/tbsp
        { value: 'cocoa_powder', label: 'Cocoa powder', density: 0.5 }, // ~7.4 g/tbsp
    ];

    const [ingredient, setIngredient] = useState('butter');
    const [grams, setGrams] = useState('');
    const [tbsp, setTbsp] = useState('');
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

    // Get current density
    const getDensity = (ingValue) => {
        const item = ingredients.find(i => i.value === ingValue);
        return item ? item.density : 1.0;
    };

    const handleIngredientChange = (newIngredient) => {
        setIngredient(newIngredient);
        // Recalculate Tbsp based on existing Grams when ingredient changes
        if (grams) {
            const density = getDensity(newIngredient);
            // grams / (density * 14.7868)
            const newTbsp = parseFloat(grams) / (density * 14.7868);
            setTbsp(newTbsp.toFixed(4).replace(/\.?0+$/, ''));
        }
    };

    const handleGramsChange = (val) => {
        if (isUpdating) return;
        setGrams(val);
        if (val === '') {
            setTbsp('');
            return;
        }

        const g = parseFloat(val);
        if (!isNaN(g)) {
            setIsUpdating(true);
            const density = getDensity(ingredient);
            // Tbsp = Grams / (Density * 14.7868)
            const t = g / (density * 14.7868);
            setTbsp(t.toFixed(4).replace(/\.?0+$/, ''));
            setIsUpdating(false);
        }
    };

    const handleTbspChange = (val) => {
        if (isUpdating) return;
        setTbsp(val);
        if (val === '') {
            setGrams('');
            return;
        }

        const t = parseFloat(val);
        if (!isNaN(t)) {
            setIsUpdating(true);
            const density = getDensity(ingredient);
            // Grams = Tbsp * Density * 14.7868
            const g = t * density * 14.7868;
            setGrams(g.toFixed(4).replace(/\.?0+$/, ''));
            setIsUpdating(false);
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
                If you're struggling with grams and tbsp conversion, look no further – this grams to tablespoons converter has everything you could ever need when dealing with simple <a href="#">cooking measurement conversions</a>.
            </p>
            <p>
                We'll teach you how to convert <strong>grams to tablespoons</strong>, discuss if <strong>tablespoons in a cup</strong> are a reliable unit of measurement, and even give you a comprehensive list of products measured in tablespoons to grams!
            </p>
            <h3>Grams to tablespoons, tablespoon to grams conversion</h3>
            <p>
                The formula is quite simple: <code>Volume = Weight / Density</code>.
            </p>
            <p>
                Since a tablespoon is a unit of volume and gram is a unit of weight, the conversion depends entirely on the substance. For example, a tablespoon of lead will weigh much more than a tablespoon of feathers!
            </p>
        </>
    );

    return (
        <CalculatorLayout
            title="Grams to Tablespoons Converter"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "Grams to tablespoons, tablespoon to grams conversion",
                "Tablespoons in a cup",
                "Calories in a tablespoon of product",
                "Volume or weight units - which are better?",
                "FAQs"
            ]}
            articleContent={articleContent}
            similarCalculators={315}
        >
            <div className="grams-to-tablespoons-page">

                {/* Section 1: Select Ingredient */}
                <div className="section-card">
                    <div className="section-header">
                        <div className="section-title">
                            <ChevronUp size={20} color="#3b82f6" /> Select ingredient
                        </div>
                    </div>
                    <div className="input-group">
                        <div className="label-row"><label>Ingredient</label><span className="more-options">...</span></div>
                        <div className="select-wrapper">
                            <select
                                value={ingredient}
                                onChange={(e) => handleIngredientChange(e.target.value)}
                                className="calc-select"
                            >
                                {ingredients.map(ing => (
                                    <option key={ing.value} value={ing.value}>{ing.label}</option>
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
                             onWheel={(e) => e.target.blur()} />
                            <span className="input-suffix">g</span>
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Tablespoons</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={tbsp}
                                onChange={(e) => handleTbspChange(e.target.value)}
                             onWheel={(e) => e.target.blur()} />
                            <span className="input-suffix">tbsp</span>
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
                            <button className="secondary-btn" onClick={() => {
                                setGrams('');
                                setTbsp('');
                            }}>Clear all changes</button>
                        </div>
                    </div>

                </div>

            </div>
        </CalculatorLayout>
    );
};

export default GramsToTablespoonsPage;
