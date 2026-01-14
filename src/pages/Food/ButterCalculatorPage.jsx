import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2 } from 'lucide-react';
import './ButterCalculatorPage.css';

const ButterCalculatorPage = () => {
    // We will use grams as the base unit for calculation
    // 1 Stick = 113.398 grams
    // 1 Cup = 226.796 grams
    // 1 Tbsp = 14.17475 grams
    // 1 Gram = 1 gram
    // 1 Tsp = 4.72491 grams
    // 1 Oz = 28.3495 grams
    // 1 Lb = 453.592 grams
    // 1 ml = 0.95861 grams (derived from 1 stick = 118.294 ml approx)

    // Constants for conversion to Grams
    const TO_GRAMS = {
        sticks: 113.39809,
        cups: 226.79618,
        tbsp: 14.17476,
        grams: 1,
        tsp: 4.72492,
        oz: 28.34952,
        lb: 453.59237,
        ml: 0.95861 // Approx density of butter
    };

    const [values, setValues] = useState({
        sticks: '',
        cups: '',
        tbsp: '',
        grams: '',
        tsp: '',
        oz: '',
        lb: '',
        ml: ''
    });

    const [isUpdating, setIsUpdating] = useState(false);

    // Handle input change
    const handleChange = (field, value) => {
        if (isUpdating) return;

        // Allow empty string to clear field
        if (value === '' || value === null) {
            setValues({
                sticks: '',
                cups: '',
                tbsp: '',
                grams: '',
                tsp: '',
                oz: '',
                lb: '',
                ml: ''
            });
            return;
        }

        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
            // Keep the text updating if it's invalid chars, though type=number helps
            setValues(prev => ({ ...prev, [field]: value }));
            return;
        }

        setIsUpdating(true);

        // Calculate grams from the changed field
        const grams = numValue * TO_GRAMS[field];

        // Update all other fields based on grams
        const newValues = {
            sticks: field === 'sticks' ? value : (grams / TO_GRAMS.sticks).toFixed(4).replace(/\.?0+$/, ''),
            cups: field === 'cups' ? value : (grams / TO_GRAMS.cups).toFixed(4).replace(/\.?0+$/, ''),
            tbsp: field === 'tbsp' ? value : (grams / TO_GRAMS.tbsp).toFixed(4).replace(/\.?0+$/, ''),
            grams: field === 'grams' ? value : grams.toFixed(4).replace(/\.?0+$/, ''),
            tsp: field === 'tsp' ? value : (grams / TO_GRAMS.tsp).toFixed(4).replace(/\.?0+$/, ''),
            oz: field === 'oz' ? value : (grams / TO_GRAMS.oz).toFixed(4).replace(/\.?0+$/, ''),
            lb: field === 'lb' ? value : (grams / TO_GRAMS.lb).toFixed(4).replace(/\.?0+$/, ''),
            ml: field === 'ml' ? value : (grams / TO_GRAMS.ml).toFixed(4).replace(/\.?0+$/, '')
        };

        // Helper to formatting: round only if necessary to avoid long decimals?
        // The prompt says "strict attention to math". A raw division is precise.
        // `toFixed(4)` is a safe bet for UI, `parseFloat` strips trailing zeros if we convert back,
        // but keeping as string is safer for inputs. 
        // Let's refine the formatting to be nice.

        setValues(newValues);
        setIsUpdating(false);
    };

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

    const creators = [
        { name: "Aleksandra Zając", role: "MD" },
    ];

    const reviewers = [
        { name: "Dominik Czernia", role: "PhD" },
        { name: "Jack Bowater", role: "" }
    ];

    const articleContent = (
        <>
            <p>
                Honest bread is very well – it's the <em>butter that makes the temptation</em> – we're sure that Douglas Jerrold would be delighted with our butter calculator! For all those who identify with the author, we've got some good news for you – <strong>you will never wonder how much is a stick of butter again</strong>. In the following article you can also find out what is butter (besides one of your favorite <a href="#">bread spreads</a>, of course) and how to convert between butter measures. The real icing on the cake (or spread on the bread) is a <strong>method of how to make butter</strong> at home — no special equipment needed.
            </p>
            <p>Let's get started!</p>
            <h3>What is butter?</h3>
            <p>
                To put it simply, butter is a dairy product made from the fat and protein components of churned cream. It's a semi-solid emulsion at room temperature, consisting of approximately 80% butterfat. It is used at room temperature as a spread, melted as a condiment, and used as an ingredient in baking, sauce making, pan frying, and other cooking procedures.
            </p>
            <h3>How much is a stick of butter?</h3>
            <p>
                In the United States, butter is commonly sold in sticks, where one stick is 1/4 of a pound. This is the primary unit of measurement for butter in the US, but it can be confusing when recipes call for cups, tablespoons, or grams.
            </p>
            <ul>
                <li>1 stick of butter = 1/4 pound</li>
                <li>1 stick of butter = 4 ounces</li>
                <li>1 stick of butter = 1/2 cup</li>
                <li>1 stick of butter = 8 tablespoons</li>
                <li>1 stick of butter = 24 teaspoons</li>
                <li>1 stick of butter = ~113.4 grams</li>
            </ul>
        </>
    );

    return (
        <CalculatorLayout
            title="Butter Calculator – How Much is a Stick of Butter?"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "What is butter?",
                "Using the butter calculator",
                "How much is a stick of butter?",
                "Stick of butter in cups, tablespoons or grams",
                "How to make butter?",
                "Bunch of butter rules"
            ]}
            articleContent={articleContent}
            similarCalculators={14}
        >
            <div className="calc-card butter-calculator-page">
                {/* Weight in sticks */}
                <div className="input-group">
                    <div className="label-row"><label>Weight in sticks</label><span className="more-options">...</span></div>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            className="calc-input"
                            value={values.sticks}
                            onChange={(e) => handleChange('sticks', e.target.value)}
                         onWheel={(e) => e.target.blur()} />
                        <span className="input-suffix">sticks</span>
                    </div>
                </div>

                {/* Volume in cups */}
                <div className="input-group">
                    <div className="label-row"><label>Volume in cups</label><span className="more-options">...</span></div>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            className="calc-input"
                            value={values.cups}
                            onChange={(e) => handleChange('cups', e.target.value)}
                         onWheel={(e) => e.target.blur()} />
                        <span className="input-suffix">cups</span>
                    </div>
                </div>

                {/* Volume in tablespoons */}
                <div className="input-group">
                    <div className="label-row"><label>Volume in tablespoons</label><span className="more-options">...</span></div>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            className="calc-input"
                            value={values.tbsp}
                            onChange={(e) => handleChange('tbsp', e.target.value)}
                         onWheel={(e) => e.target.blur()} />
                        <span className="input-suffix">tbsp</span>
                    </div>
                </div>

                {/* Weight in grams */}
                <div className="input-group">
                    <div className="label-row"><label>Weight in grams</label><span className="more-options">...</span></div>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            className="calc-input"
                            value={values.grams}
                            onChange={(e) => handleChange('grams', e.target.value)}
                         onWheel={(e) => e.target.blur()} />
                        <span className="input-suffix">g</span>
                    </div>
                </div>

                {/* Volume in teaspoons */}
                <div className="input-group">
                    <div className="label-row"><label>Volume in teaspoons</label><span className="more-options">...</span></div>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            className="calc-input"
                            value={values.tsp}
                            onChange={(e) => handleChange('tsp', e.target.value)}
                         onWheel={(e) => e.target.blur()} />
                        <span className="input-suffix">tsp</span>
                    </div>
                </div>

                {/* Weight in ounces */}
                <div className="input-group">
                    <div className="label-row"><label>Weight in ounces</label><span className="more-options">...</span></div>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            className="calc-input"
                            value={values.oz}
                            onChange={(e) => handleChange('oz', e.target.value)}
                         onWheel={(e) => e.target.blur()} />
                        <span className="input-suffix">oz</span>
                    </div>
                </div>

                {/* Weight in pounds */}
                <div className="input-group">
                    <div className="label-row"><label>Weight in pounds</label><span className="more-options">...</span></div>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            className="calc-input"
                            value={values.lb}
                            onChange={(e) => handleChange('lb', e.target.value)}
                         onWheel={(e) => e.target.blur()} />
                        <span className="input-suffix">lb</span>
                    </div>
                </div>

                {/* Volume in milliliters */}
                <div className="input-group">
                    <div className="label-row"><label>Volume in milliliters</label><span className="more-options">...</span></div>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            className="calc-input"
                            value={values.ml}
                            onChange={(e) => handleChange('ml', e.target.value)}
                         onWheel={(e) => e.target.blur()} />
                        <span className="input-suffix">ml</span>
                    </div>
                </div>

                <div className="calc-actions">
                    {/* <button className="share-result-btn" onClick={handleShare}>
                        <div className="share-icon-circle"><Share2 size={14} /></div>
                        Share result
                        {showShareTooltip && <span className="copied-tooltip">Copied!</span>}
                    </button> */}
                    <div className="secondary-actions">
                        <button className="secondary-btn">Reload calculator</button>
                        <button className="secondary-btn" onClick={() => setValues({
                            sticks: '', cups: '', tbsp: '', grams: '', tsp: '', oz: '', lb: '', ml: ''
                        })}>Clear all changes</button>
                    </div>
                </div>


            </div>
        </CalculatorLayout>
    );
};

export default ButterCalculatorPage;
