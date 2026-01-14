import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { RefreshCcw, X, Share2 } from 'lucide-react';
import './LeanBodyMassCalculatorPage.css';

const LeanBodyMassCalculatorPage = () => {
    // --- State ---
    const [sex, setSex] = useState('male');
    const [weight, setWeight] = useState({ value: '', unit: 'kg' });
    const [height, setHeight] = useState({ value: '', unit: 'cm' });
    const [results, setResults] = useState({
        lbm: ''
    });

    const CONVERSIONS = {
        height: { cm: 1, m: 100, in: 2.54 },
        weight: { kg: 1, lbs: 0.453592 }
    };

    // --- Calculation Logic ---
    useEffect(() => {
        calculateResults();
    }, [sex, weight, height]);

    const calculateResults = () => {
        const wVal = parseFloat(weight.value);
        const hVal = parseFloat(height.value);

        if (!wVal || !hVal) {
            setResults({ lbm: '' });
            return;
        }

        // Convert to metric (kg, cm)
        const w_kg = weight.unit === 'kg' ? wVal : wVal * CONVERSIONS.weight.lbs;
        const h_cm = height.unit === 'cm' ? hVal : hVal * CONVERSIONS.height[height.unit];

        let lbm_kg = 0;

        // Boer Formula (1984)
        if (sex === 'male') {
            lbm_kg = (0.407 * w_kg) + (0.267 * h_cm) - 19.2;
        } else {
            lbm_kg = (0.252 * w_kg) + (0.473 * h_cm) - 48.3;
        }

        // Edge case: LBM cannot be negative or more than total weight
        lbm_kg = Math.max(0, Math.min(lbm_kg, w_kg));

        const displayWeightUnit = weight.unit;
        const finalLbm = displayWeightUnit === 'kg' ? lbm_kg : lbm_kg / CONVERSIONS.weight.lbs;

        setResults({
            lbm: finalLbm.toFixed(1)
        });
    };

    const handleClear = () => {
        setWeight({ ...weight, value: '' });
        setHeight({ ...height, value: '' });
        setResults({ lbm: '' });
    };

    const articleContent = (
        <div className="article-container">
            <h2 className="article-title">How to calculate lean body mass</h2>
            <p>There are multiple lean body mass equations (and they vary between sexes as well). We're using the <strong>Boer formula</strong>, which is said to be the most accurate.</p>

            <div className="premium-formula-box">
                <div className="math-latex">
                    LBM (men) = 0.407 × weight [kg] + 0.267 × height [cm] - 19.2<br />
                    LBM (women) = 0.252 × weight [kg] + 0.473 × height [cm] - 48.3
                </div>
            </div>

            <p>However, if you know your fat concentration, you can determine your exact LBM according to this simple formula:</p>
            <div className="premium-formula-box sub-formula">
                <div className="math-latex">
                    Lean Body Mass = Body Weight - (Body Weight × Body Fat %)
                </div>
            </div>

            <p>You will need to:</p>
            <ol>
                <li><strong>Measure</strong> your body weight</li>
                <li><strong>Multiply</strong> your body weight by the fat percentage</li>
                <li><strong>Subtract</strong> the result from your body weight</li>
            </ol>
        </div>
    );

    return (
        <CalculatorLayout
            title="Lean Body Mass Calculator"
            creators={[
                { name: "Mateusz Mucha" },
                { name: "Piotr Małek" },
                { name: "Łucja Zaborowska", md: true, phd: true }
            ]}
            reviewers={[
                { name: "Bogna Szyk" },
                { name: "Jack Bowater" }
            ]}
            articleContent={articleContent}
        >
            <div className="lbm-calculator-page">
                <div className="section-card">
                    {/* Sex Selector */}
                    <div className="input-group">
                        <label className="input-label">Sex</label>
                        <div className="radio-group-container">
                            <label className={`radio-option ${sex === 'male' ? 'active' : ''}`}>
                                <input type="radio" value="male" checked={sex === 'male'} onChange={() => setSex('male')} />
                                <span className="radio-circle"></span>
                                Male
                            </label>
                            <label className={`radio-option ${sex === 'female' ? 'active' : ''}`}>
                                <input type="radio" value="female" checked={sex === 'female'} onChange={() => setSex('female')} />
                                <span className="radio-circle"></span>
                                Female
                            </label>
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
                             onWheel={(e) => e.target.blur()} />
                            <div className="unit-select-wrapper">
                                <select className="unit-select" value={weight.unit} onChange={(e) => setWeight({ ...weight, unit: e.target.value })}>
                                    <option value="kg">kg</option>
                                    <option value="lbs">lbs</option>
                                </select>
                            </div>
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
                             onWheel={(e) => e.target.blur()} />
                            <div className="unit-select-wrapper">
                                <select className="unit-select" value={height.unit} onChange={(e) => setHeight({ ...height, unit: e.target.value })}>
                                    <option value="cm">cm</option>
                                    <option value="m">m</option>
                                    <option value="in">in</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="divider-custom"></div>

                    {/* Results Section */}
                    <div className="input-group">
                        <label className="input-label">Lean body mass</label>
                        <div className="input-wrapper result-wrapper">
                            <input type="text" className="input-field calculated-value" value={results.lbm} readOnly />
                            <div className="unit-label-static">{weight.unit}</div>
                        </div>
                    </div>

                    <div className="action-cluster-card">
                        {/* <button className="primary-action-btn share">
                            <Share2 size={18} />
                            <span>Share result</span>
                        </button> */}
                        <div className="secondary-action-group">
                            <button className="secondary-action-btn" onClick={() => window.location.reload()}>
                                <RefreshCcw size={16} />
                                <span>Reload calculator</span>
                            </button>
                            <button className="secondary-action-btn" onClick={handleClear}>
                                <X size={16} />
                                <span>Clear all changes</span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </CalculatorLayout>
    );
};

export default LeanBodyMassCalculatorPage;
