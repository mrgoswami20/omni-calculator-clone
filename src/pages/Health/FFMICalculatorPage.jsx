import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Info } from 'lucide-react';
import './FFMICalculatorPage.css';

const FFMICalculatorPage = () => {
    // --- State ---
    const [sex, setSex] = useState('male');
    const [height, setHeight] = useState({ value: '', unit: 'cm' });
    const [weight, setWeight] = useState({ value: '', unit: 'kg' });
    const [bodyFat, setBodyFat] = useState('');
    const [results, setResults] = useState({
        ffmi: '',
        normalizedFfmi: '',
        fatFreeMass: '',
        totalBodyFat: ''
    });

    const CONVERSIONS = {
        height: { cm: 0.01, m: 1, in: 0.0254 },
        weight: { kg: 1, lbs: 0.453592 }
    };

    // --- Calculation Logic ---
    useEffect(() => {
        calculateResults();
    }, [sex, height, weight, bodyFat]);

    const calculateResults = () => {
        const hVal = parseFloat(height.value);
        const wVal = parseFloat(weight.value);
        const fatVal = parseFloat(bodyFat);

        if (!hVal || !wVal || isNaN(fatVal)) {
            setResults({ ffmi: '', normalizedFfmi: '', fatFreeMass: '', totalBodyFat: '' });
            return;
        }

        const h_m = hVal * CONVERSIONS.height[height.unit];
        const w_kg = wVal * CONVERSIONS.weight[weight.unit];

        const ffm_kg = w_kg * (1 - fatVal / 100);
        const totalFat_kg = w_kg - ffm_kg;
        const ffmi = ffm_kg / (h_m * h_m);
        const normalizedFfmi = ffmi + 6.1 * (1.8 - h_m);

        const displayWeightUnit = weight.unit;
        const displayFfm = displayWeightUnit === 'kg' ? ffm_kg : ffm_kg / CONVERSIONS.weight.lbs;
        const displayTotalFat = displayWeightUnit === 'kg' ? totalFat_kg : totalFat_kg / CONVERSIONS.weight.lbs;

        setResults({
            ffmi: ffmi.toFixed(1),
            normalizedFfmi: normalizedFfmi.toFixed(1),
            fatFreeMass: displayFfm.toFixed(1),
            totalBodyFat: displayTotalFat.toFixed(1)
        });
    };

    const handleClear = () => {
        setHeight({ ...height, value: '' });
        setWeight({ ...weight, value: '' });
        setBodyFat('');
        setResults({ ffmi: '', normalizedFfmi: '', fatFreeMass: '', totalBodyFat: '' });
    };

    const articleContent = (
        <div className="article-container">
            <h2 className="article-title">FFMI – fat-free mass index</h2>
            <p>The <strong>Fat-Free Mass Index (FFMI)</strong> is a measure of your body's muscle mass relative to your height. Unlike BMI, which considers total weight, FFMI specifically looks at the portion of your body that isn't fat.</p>

            <h2 className="article-title">How to calculate FFMI?</h2>
            <p>To calculate FFMI, you need to know your weight, height, and body fat percentage. The formula is:</p>
            <div className="premium-formula-box">
                <div className="math-latex">
                    FFMI = FFM [kg] / (height [m])<sup>2</sup>
                </div>
            </div>
            <p>Where <strong>FFM</strong> is Fat-Free Mass, calculated as: <code>Weight × (1 - Body Fat / 100)</code>.</p>

            <h2 className="article-title">Why is FFMI better than BMI?</h2>
            <p>BMI can be misleading for athletes and bodybuilders because muscle is denser than fat. A highly muscular individual might be classified as "obese" by BMI standards. FFMI provides a clearer picture of muscularity by focusing solely on lean tissue.</p>
        </div>
    );

    return (
        <CalculatorLayout
            title="FFMI Calculator (Fat-Free Mass Index)"
            creators={[{ name: "Filip Derma" }, { name: "Łucja Zaborowska", md: true, phd: true }]}
            reviewers={[{ name: "Dominik Czernia", phd: true }, { name: "Jack Bowater" }]}
            articleContent={articleContent}
        >
            <div className="ffmi-calculator-page">
                <div className="section-card">
                    <h3 className="section-title">Please provide the following data:</h3>

                    {/* Sex Selector */}
                    <div className="input-group">
                        <label className="input-label">Sex</label>
                        <div className="radio-group-container">
                            <label className={`radio-option ${sex === 'female' ? 'active' : ''}`}>
                                <input type="radio" value="female" checked={sex === 'female'} onChange={() => setSex('female')} />
                                <span className="radio-circle"></span>
                                Female
                            </label>
                            <label className={`radio-option ${sex === 'male' ? 'active' : ''}`}>
                                <input type="radio" value="male" checked={sex === 'male'} onChange={() => setSex('male')} />
                                <span className="radio-circle"></span>
                                Male
                            </label>
                        </div>
                    </div>

                    {/* Height */}
                    <div className="input-group">
                        <label className="input-label">Height</label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="input-field"
                                value={height.value}
                                onChange={(e) => setHeight({ ...height, value: e.target.value })}
                                placeholder=" "
                            />
                            <div className="unit-select-wrapper">
                                <select className="unit-select" value={height.unit} onChange={(e) => setHeight({ ...height, unit: e.target.value })}>
                                    <option value="cm">cm</option>
                                    <option value="m">m</option>
                                    <option value="in">in</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Weight */}
                    <div className="input-group">
                        <label className="input-label">Weight</label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="input-field"
                                value={weight.value}
                                onChange={(e) => setWeight({ ...weight, value: e.target.value })}
                                placeholder=" "
                            />
                            <div className="unit-select-wrapper">
                                <select className="unit-select" value={weight.unit} onChange={(e) => setWeight({ ...weight, unit: e.target.value })}>
                                    <option value="kg">kg</option>
                                    <option value="lbs">lbs</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Body Fat */}
                    <div className="input-group">
                        <label className="input-label">Body fat</label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="input-field"
                                value={bodyFat}
                                onChange={(e) => setBodyFat(e.target.value)}
                                placeholder=" "
                            />
                            <div className="unit-label-static">%</div>
                        </div>
                    </div>

                    <div className="divider-custom"></div>

                    {/* Results Section */}
                    <h3 className="section-title">Results of the calculations:</h3>

                    <div className="input-group">
                        <label className="input-label">FFMI <Info size={14} className="info-icon" title="Standard Fat-Free Mass Index" /></label>
                        <div className="input-wrapper result-wrapper">
                            <input type="text" className="input-field calculated-value" value={results.ffmi} readOnly />
                            <div className="unit-label-static">{weight.unit}/m²</div>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Normalized FFMI <Info size={14} className="info-icon" title="FFMI adjusted for a standard height of 1.8m" /></label>
                        <div className="input-wrapper result-wrapper">
                            <input type="text" className="input-field calculated-value" value={results.normalizedFfmi} readOnly />
                            <div className="unit-label-static">{weight.unit}/m²</div>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Fat-free mass</label>
                        <div className="input-wrapper result-wrapper">
                            <input type="text" className="input-field calculated-value" value={results.fatFreeMass} readOnly />
                            <div className="unit-label-static">{weight.unit}</div>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Total body fat</label>
                        <div className="input-wrapper result-wrapper">
                            <input type="text" className="input-field calculated-value" value={results.totalBodyFat} readOnly />
                            <div className="unit-label-static">{weight.unit}</div>
                        </div>
                    </div>

                    <div className="calc-actions-custom-layout">
                        <div className="side-actions">
                            <button className="action-btn-styled" onClick={() => window.location.reload()}>Reload calculator</button>
                            <button className="action-btn-styled outline" onClick={handleClear}>Clear all changes</button>
                        </div>
                    </div>

                    <div className="feedback-section-new">
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

export default FFMICalculatorPage;
