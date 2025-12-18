import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../components/CalculatorLayout';
import { Share2, ChevronDown, ChevronUp, Info } from 'lucide-react';
import './CakePanConverterPage.css';

const CakePanConverterPage = () => {
    // State for Recipe Pan
    const [recipePanShape, setRecipePanShape] = useState('round');
    const [recipeDim1, setRecipeDim1] = useState(''); // Diameter or Length
    const [recipeDim2, setRecipeDim2] = useState(''); // Width (for rect)
    const [recipeHeight, setRecipeHeight] = useState('5');
    const [recipeUnit, setRecipeUnit] = useState('cm');

    // State for Your Pan
    const [yourPanShape, setYourPanShape] = useState('round');
    const [yourDim1, setYourDim1] = useState(''); // Diameter or Length
    const [yourDim2, setYourDim2] = useState(''); // Width (for rect)
    const [yourHeight, setYourHeight] = useState('5');
    const [yourUnit, setYourUnit] = useState('cm');

    const [ratio, setRatio] = useState('');

    useEffect(() => {
        calculateRatio();
    }, [recipePanShape, recipeDim1, recipeDim2, recipeHeight, recipeUnit, yourPanShape, yourDim1, yourDim2, yourHeight, yourUnit]);

    const getVolume = (shape, d1, d2, h, unit) => {
        const val1 = parseFloat(d1);
        const val2 = parseFloat(d2);
        const valH = parseFloat(h);

        if (isNaN(val1) || isNaN(valH)) return 0;
        if (shape === 'rectangle' && isNaN(val2)) return 0;

        // Normalize to cm for calculation standard
        let factor = 1;
        if (unit === 'in') factor = 2.54;
        if (unit === 'mm') factor = 0.1;

        const v1 = val1 * factor;
        const v2 = val2 * factor;
        const vH = valH * factor;

        if (shape === 'round') {
            // V = pi * r^2 * h
            return Math.PI * Math.pow(v1 / 2, 2) * vH;
        } else {
            // V = l * w * h
            return v1 * v2 * vH;
        }
    };

    const calculateRatio = () => {
        const vRecipe = getVolume(recipePanShape, recipeDim1, recipeDim2, recipeHeight, recipeUnit);
        const vYour = getVolume(yourPanShape, yourDim1, yourDim2, yourHeight, yourUnit);

        if (vRecipe > 0 && vYour > 0) {
            setRatio((vYour / vRecipe).toFixed(2));
        } else {
            setRatio('');
        }
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
                Have you ever come across the recipe you'd love to try but found that you don't have the right cake pan size? With this cake pan converter, this will never be a problem again! Using our tool is a <em>piece of cake</em> 🍰: input the size and shape of a recipe's baking pan, enter the dimensions of your own pan, and you'll get the conversion rate in the blink of an eye.
            </p>
            <p>
                What's more, in the second part of the calculator, you can choose the cake's ingredients and how much of them are needed in the original recipe, and we'll recalculate all the amounts for you.
            </p>
        </>
    );

    return (
        <CalculatorLayout
            title="Cake Pan Converter"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "How to use the cake pan converter",
                "Baking pan sizes",
                "How to adjust baking time for different size pans",
                "FAQs"
            ]}
            articleContent={articleContent}
            similarCalculators={236}
        >
            <div className="cake-pan-converter-page">

                {/* Section 1: Recipe Pan */}
                <div className="section-card">
                    <div className="section-header">
                        <div className="section-title">
                            <ChevronUp size={20} color="#3b82f6" /> Baking pan in recipe
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Shape</label><span className="more-options">...</span></div>
                        <div className="radio-group">
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    checked={recipePanShape === 'round'}
                                    onChange={() => setRecipePanShape('round')}
                                    className="radio-input"
                                />
                                Round <div style={{ width: 10, height: 10, borderRadius: '50%', border: '1px solid #999', marginLeft: 4 }}></div>
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    checked={recipePanShape === 'rectangle'}
                                    onChange={() => setRecipePanShape('rectangle')}
                                    className="radio-input"
                                />
                                Rectangle/square <div style={{ width: 10, height: 10, border: '1px solid #999', marginLeft: 4 }}></div>
                            </label>
                        </div>
                    </div>

                    {recipePanShape === 'round' ? (
                        <div className="input-group">
                            <div className="label-row"><label>Pan diameter</label><span className="more-options">...</span></div>
                            <div className="input-wrapper">
                                <input
                                    type="number"
                                    className="calc-input"
                                    value={recipeDim1}
                                    onChange={(e) => setRecipeDim1(e.target.value)}
                                />
                                <div className="unit-select-container">
                                    <select value={recipeUnit} onChange={(e) => setRecipeUnit(e.target.value)} className="unit-select">
                                        <option value="cm">cm</option>
                                        <option value="in">in</option>
                                        <option value="mm">mm</option>
                                    </select>
                                    <ChevronDown size={14} className="unit-arrow" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="input-group">
                                <div className="label-row"><label>Pan length</label><span className="more-options">...</span></div>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        className="calc-input"
                                        value={recipeDim1}
                                        onChange={(e) => setRecipeDim1(e.target.value)}
                                    />
                                    <div className="unit-select-container">
                                        <select value={recipeUnit} onChange={(e) => setRecipeUnit(e.target.value)} className="unit-select">
                                            <option value="cm">cm</option>
                                            <option value="in">in</option>
                                            <option value="mm">mm</option>
                                        </select>
                                        <ChevronDown size={14} className="unit-arrow" />
                                    </div>
                                </div>
                            </div>
                            <div className="input-group">
                                <div className="label-row"><label>Pan width</label><span className="more-options">...</span></div>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        className="calc-input"
                                        value={recipeDim2}
                                        onChange={(e) => setRecipeDim2(e.target.value)}
                                    />
                                    <div className="unit-select-container">
                                        <select value={recipeUnit} onChange={(e) => setRecipeUnit(e.target.value)} className="unit-select">
                                            <option value="cm">cm</option>
                                            <option value="in">in</option>
                                            <option value="mm">mm</option>
                                        </select>
                                        <ChevronDown size={14} className="unit-arrow" />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="input-group">
                        <div className="label-row"><label>Pan height</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={recipeHeight}
                                onChange={(e) => setRecipeHeight(e.target.value)}
                            />
                            <div className="unit-select-container">
                                <select value={recipeUnit} onChange={(e) => setRecipeUnit(e.target.value)} className="unit-select">
                                    <option value="cm">cm</option>
                                    <option value="in">in</option>
                                    <option value="mm">mm</option>
                                </select>
                                <ChevronDown size={14} className="unit-arrow" />
                            </div>
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Pan volume</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                className="calc-input"
                                readOnly
                                value={getVolume(recipePanShape, recipeDim1, recipeDim2, recipeHeight, recipeUnit).toFixed(2)}
                                style={{ backgroundColor: '#f3f4f6' }}
                            />
                            <div className="unit-select-container">
                                <span style={{ fontSize: '0.9rem', color: '#3b82f6', fontWeight: 600 }}>
                                    {recipeUnit === 'cm' ? 'ml' : recipeUnit === 'mm' ? 'ml' : 'cu in'}
                                    {/* Simplification: cm^3 = ml. mm^3 != ml but close enough for generic logic? No, 1 cm3 = 1ml. 1000 mm3 = 1ml.
                                        Let's just show raw value unitless or stick to ml/cm3 if we use cm. 
                                        The prompt screenshot shows 'l' or 'ml' probably. Let's use generic volume unit.
                                        Wait, screenshot shows "1 l" (liters) maybe? Or just 'l'.
                                    */}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Your Pan */}
                <div className="section-card">
                    <div className="section-header">
                        <div className="section-title">
                            <ChevronUp size={20} color="#3b82f6" /> Your baking pan
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Shape</label><span className="more-options">...</span></div>
                        <div className="radio-group">
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    checked={yourPanShape === 'round'}
                                    onChange={() => setYourPanShape('round')}
                                    className="radio-input"
                                />
                                Round <div style={{ width: 10, height: 10, borderRadius: '50%', border: '1px solid #999', marginLeft: 4 }}></div>
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    checked={yourPanShape === 'rectangle'}
                                    onChange={() => setYourPanShape('rectangle')}
                                    className="radio-input"
                                />
                                Rectangle/square <div style={{ width: 10, height: 10, border: '1px solid #999', marginLeft: 4 }}></div>
                            </label>
                        </div>
                    </div>

                    {yourPanShape === 'round' ? (
                        <div className="input-group">
                            <div className="label-row"><label>Pan diameter</label><span className="more-options">...</span></div>
                            <div className="input-wrapper">
                                <input
                                    type="number"
                                    className="calc-input"
                                    value={yourDim1}
                                    onChange={(e) => setYourDim1(e.target.value)}
                                />
                                <div className="unit-select-container">
                                    <select value={yourUnit} onChange={(e) => setYourUnit(e.target.value)} className="unit-select">
                                        <option value="cm">cm</option>
                                        <option value="in">in</option>
                                        <option value="mm">mm</option>
                                    </select>
                                    <ChevronDown size={14} className="unit-arrow" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="input-group">
                                <div className="label-row"><label>Pan length</label><span className="more-options">...</span></div>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        className="calc-input"
                                        value={yourDim1}
                                        onChange={(e) => setYourDim1(e.target.value)}
                                    />
                                    <div className="unit-select-container">
                                        <select value={yourUnit} onChange={(e) => setYourUnit(e.target.value)} className="unit-select">
                                            <option value="cm">cm</option>
                                            <option value="in">in</option>
                                            <option value="mm">mm</option>
                                        </select>
                                        <ChevronDown size={14} className="unit-arrow" />
                                    </div>
                                </div>
                            </div>
                            <div className="input-group">
                                <div className="label-row"><label>Pan width</label><span className="more-options">...</span></div>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        className="calc-input"
                                        value={yourDim2}
                                        onChange={(e) => setYourDim2(e.target.value)}
                                    />
                                    <div className="unit-select-container">
                                        <select value={yourUnit} onChange={(e) => setYourUnit(e.target.value)} className="unit-select">
                                            <option value="cm">cm</option>
                                            <option value="in">in</option>
                                            <option value="mm">mm</option>
                                        </select>
                                        <ChevronDown size={14} className="unit-arrow" />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="input-group">
                        <div className="label-row"><label>Pan height</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={yourHeight}
                                onChange={(e) => setYourHeight(e.target.value)}
                            />
                            <div className="unit-select-container">
                                <select value={yourUnit} onChange={(e) => setYourUnit(e.target.value)} className="unit-select">
                                    <option value="cm">cm</option>
                                    <option value="in">in</option>
                                    <option value="mm">mm</option>
                                </select>
                                <ChevronDown size={14} className="unit-arrow" />
                            </div>
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Pan volume</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                className="calc-input"
                                readOnly
                                value={getVolume(yourPanShape, yourDim1, yourDim2, yourHeight, yourUnit).toFixed(2)}
                                style={{ backgroundColor: '#f3f4f6' }}
                            />
                            <div className="unit-select-container">
                                <span style={{ fontSize: '0.9rem', color: '#3b82f6', fontWeight: 600 }}>
                                    {yourUnit === 'cm' ? 'ml' : yourUnit === 'mm' ? 'ml' : 'cu in'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 3: Results */}
                <div className="section-card">
                    <div className="section-header">
                        <div className="section-title">
                            Results
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Pans' volume ratio <Info size={14} style={{ marginLeft: 4, color: '#9ca3af' }} /></label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                className="calc-input"
                                readOnly
                                value={ratio}
                                style={{ backgroundColor: '#eff6ff', color: '#1e3a8a', fontWeight: 'bold' }}
                            />
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
                                setRecipeDim1(''); setRecipeDim2('');
                                setYourDim1(''); setYourDim2('');
                                setRatio('');
                            }}>Clear all changes</button>
                        </div>
                    </div>
                </div>

            </div>
        </CalculatorLayout>
    );
};

export default CakePanConverterPage;
