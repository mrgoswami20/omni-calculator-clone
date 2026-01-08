import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Info } from 'lucide-react';
import './AdjustedBodyWeightCalculatorPage.css';

const AdjustedBodyWeightCalculatorPage = () => {
    const [sex, setSex] = useState('female');
    const [height, setHeight] = useState({ value: '', unit: 'cm' });
    const [actualWeight, setActualWeight] = useState({ value: '', unit: 'kg' });
    const [results, setResults] = useState({
        ibw: '',
        ajbw: ''
    });

    const CONVERSIONS = {
        height: {
            cm: 0.393701,
            m: 39.3701,
            in: 1
        },
        weight: {
            kg: 1,
            lbs: 0.453592
        }
    };

    useEffect(() => {
        calculateResults();
    }, [sex, height, actualWeight]);

    const calculateResults = () => {
        const hVal = parseFloat(height.value);
        const wVal = parseFloat(actualWeight.value);

        if (!hVal || !wVal) {
            setResults({ ibw: '', ajbw: '' });
            return;
        }

        // 1. Convert height to inches for Robinson's formula
        const heightInches = hVal * CONVERSIONS.height[height.unit];

        // 2. Ideal Body Weight (Robinson's Formula)
        // Men: 52 kg + 1.9 kg per every inch over 5 feet (60 inches)
        // Women: 49 kg + 1.7 kg per every inch over 5 feet (60 inches)
        let ibw_kg = 0;
        const inchesOver60 = Math.max(0, heightInches - 60);

        if (sex === 'male') {
            ibw_kg = 52 + (1.9 * inchesOver60);
        } else {
            ibw_kg = 49 + (1.7 * inchesOver60);
        }

        // 3. Convert actual weight to kg
        const weight_kg = actualWeight.unit === 'kg' ? wVal : wVal * CONVERSIONS.weight.lbs;

        // 4. Adjusted Body Weight (AjBW)
        // AjBW = IBW + 0.4 * (ABW - IBW)
        const ajbw_kg = ibw_kg + 0.4 * (weight_kg - ibw_kg);

        // 5. Format results (converting back to currently selected weight unit for display)
        const displayUnit = actualWeight.unit;
        const finalIbw = displayUnit === 'kg' ? ibw_kg : ibw_kg / CONVERSIONS.weight.lbs;
        const finalAjbw = displayUnit === 'kg' ? ajbw_kg : ajbw_kg / CONVERSIONS.weight.lbs;

        setResults({
            ibw: finalIbw.toFixed(1),
            ajbw: finalAjbw.toFixed(1)
        });
    };

    const handleClear = () => {
        setHeight({ ...height, value: '' });
        setActualWeight({ ...actualWeight, value: '' });
        setResults({ ibw: '', ajbw: '' });
    };

    const articleContent = (
        <div className="article-container">
            <h2 className="article-title">What is adjusted body weight?</h2>
            <p><strong>Adjusted body weight (AjBW)</strong> is a measure used by dietitians and medical professionals to calculate nutritional requirements and medication dosages in patients who are overweight or obese.</p>
            <p>Standard calculation methods like Ideal Body Weight (IBW) can underestimate needs in larger patients, while Actual Body Weight (ABW) can overestimate them. AjBW provides a "middle ground" that accounts for the metabolic demand of non-lean tissue.</p>

            <h2 className="article-title">How to calculate adjusted body weight?</h2>
            <p>First, you need to calculate your <strong>Ideal Body Weight</strong>. This calculator uses <strong>Robinson's formula</strong>:</p>
            <ul>
                <li><strong>For men:</strong> 52 kg + 1.9 kg per every inch over 5 feet</li>
                <li><strong>For women:</strong> 49 kg + 1.7 kg per every inch over 5 feet</li>
            </ul>

            <p>Once you have your IBW, use the following <strong>adjusted body weight formula</strong>:</p>
            <div className="premium-formula-box">
                <div className="math-latex">
                    AjBW = IBW + 0.4 × (ABW - IBW)
                </div>
            </div>
            <p>Where:</p>
            <ul>
                <li><strong>AjBW</strong> is adjusted body weight;</li>
                <li><strong>IBW</strong> is ideal body weight; and</li>
                <li><strong>ABW</strong> is actual body weight.</li>
            </ul>
        </div>
    );

    return (
        <CalculatorLayout
            title="Adjusted Body Weight Calculator"
            creators={[{ name: "Maria Kluziak" }, { name: "Łucja Zaborowska", phd: true }]}
            reviewers={[{ name: "Bogna Szyk" }, { name: "Jack Bowater" }]}
            articleContent={articleContent}
        >
            <div className="adj-weight-calculator-page">
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

                    {/* Actual Weight */}
                    <div className="input-group">
                        <label className="input-label">Actual body weight</label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="input-field"
                                value={actualWeight.value}
                                onChange={(e) => setActualWeight({ ...actualWeight, value: e.target.value })}
                                placeholder=" "
                            />
                            <div className="unit-select-wrapper">
                                <select className="unit-select" value={actualWeight.unit} onChange={(e) => setActualWeight({ ...actualWeight, unit: e.target.value })}>
                                    <option value="kg">kg</option>
                                    <option value="lbs">lbs</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="divider-custom"></div>

                    {/* Results Section */}
                    <h3 className="section-title">Results of the calculations:</h3>

                    <div className="input-group">
                        <label className="input-label">Ideal body weight <Info size={14} className="info-icon" title="Weight that matches your height based on Robinson's formula." /></label>
                        <div className="input-wrapper result-wrapper">
                            <input type="text" className="input-field calculated-value" value={results.ibw} readOnly />
                            <div className="unit-label-static">{actualWeight.unit}</div>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Adjusted body weight</label>
                        <div className="input-wrapper result-wrapper">
                            <input type="text" className="input-field calculated-value" value={results.ajbw} readOnly />
                            <div className="unit-label-static">{actualWeight.unit}</div>
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

export default AdjustedBodyWeightCalculatorPage;
