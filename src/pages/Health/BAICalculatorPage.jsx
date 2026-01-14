import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Info } from 'lucide-react';
import './BAICalculatorPage.css';

const BAICalculatorPage = () => {
    const [height, setHeight] = useState({ value: '', unit: 'cm' });
    const [hip, setHip] = useState({ value: '', unit: 'cm' });
    const [results, setResults] = useState({
        bai: ''
    });

    const CONVERSIONS = {
        height: {
            cm: 0.01,
            m: 1,
            in: 0.0254
        },
        hip: {
            cm: 1,
            m: 100,
            in: 2.54
        }
    };

    useEffect(() => {
        calculateResults();
    }, [height, hip]);

    const calculateResults = () => {
        const hVal = parseFloat(height.value);
        const hipVal = parseFloat(hip.value);

        if (!hVal || !hipVal) {
            setResults({ bai: '' });
            return;
        }

        // 1. Convert height to meters
        const height_m = hVal * CONVERSIONS.height[height.unit];

        // 2. Convert hip to centimeters
        const hip_cm = hipVal * CONVERSIONS.hip[hip.unit];

        // 3. Calculate BAI
        // BAI = (Hip Circumference (cm) / (Height (m)^1.5)) - 18
        const bai = (hip_cm / Math.pow(height_m, 1.5)) - 18;

        setResults({
            bai: bai.toFixed(1)
        });
    };

    const handleClear = () => {
        setHeight({ ...height, value: '' });
        setHip({ ...hip, value: '' });
        setResults({ bai: '' });
    };

    const articleContent = (
        <div className="article-container">
            <h2 className="article-title">What is BAI?</h2>
            <p>The <strong>Body Adiposity Index (BAI)</strong> is a method used to estimate the amount of body fat in humans. Unlike the Body Mass Index (BMI), which uses weight and height, the BAI uses <strong>hip circumference</strong> and <strong>height</strong>.</p>
            <p>It was proposed as an alternative to BMI that could be more accurate for certain populations because it doesn't require a weight measurement, making it easier to use in settings where scales are unavailable.</p>

            <h2 className="article-title">BAI calculator</h2>
            <p>To use this BAI calculator, simply follow these steps:</p>
            <ol>
                <li>Enter your <strong>height</strong>.</li>
                <li>Enter your <strong>hip circumference</strong> (measured around the widest part of your hips).</li>
                <li>The calculator will instantly show your <strong>Body Adiposity Index</strong>.</li>
            </ol>

            <h2 className="article-title">How to calculate the body fat percentage (BAI)?</h2>
            <p>The calculation of BAI relies on the following formula:</p>
            <div className="premium-formula-box">
                <div className="math-latex">
                    BAI = (hip / height<sup>1.5</sup>) - 18
                </div>
            </div>
            <p>Where:</p>
            <ul>
                <li><strong>hip</strong> is the hip circumference in centimeters; and</li>
                <li><strong>height</strong> is the person's height in meters.</li>
            </ul>

            <h2 className="article-title">Healthy body fat</h2>
            <p>While BAI is an estimate, healthy body fat percentage ranges typically vary by age and sex. Generally, for adults:</p>
            <ul>
                <li><strong>Men:</strong> 8-24% is often considered healthy.</li>
                <li><strong>Women:</strong> 21-35% is often considered healthy.</li>
            </ul>
        </div>
    );

    return (
        <CalculatorLayout
            title="BAI Calculator - Body Adiposity Index"
            creators={[{ name: "Filip Derma" }, { name: "Dominika Śmiałek", md: true, phd: true }]}
            reviewers={[{ name: "Bogna Szyk" }, { name: "Adena Benn" }]}
            articleContent={articleContent}
        >
            <div className="bai-calculator-page">
                <div className="section-card">
                    <h3 className="section-title">Your height</h3>
                    <div className="input-group">
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

                    <h3 className="section-title">Your hip circumference <Info size={14} className="info-icon" title="Measured around the widest part of the hips." /></h3>
                    <div className="input-group">
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="input-field"
                                value={hip.value}
                                onChange={(e) => setHip({ ...hip, value: e.target.value })}
                                placeholder=" "
                             onWheel={(e) => e.target.blur()} />
                            <div className="unit-select-wrapper">
                                <select className="unit-select" value={hip.unit} onChange={(e) => setHip({ ...hip, unit: e.target.value })}>
                                    <option value="cm">cm</option>
                                    <option value="m">m</option>
                                    <option value="in">in</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="divider-custom"></div>

                    <h3 className="section-title">Your body adiposity index (BAI)</h3>
                    <div className="input-group">
                        <div className="input-wrapper result-wrapper">
                            <input type="text" className="input-field calculated-value" value={results.bai} readOnly />
                            <div className="unit-label-static">%</div>
                        </div>
                    </div>

                    <div className="calc-actions-custom-layout">
                        <div className="side-actions">
                            <button className="action-btn-styled" onClick={() => window.location.reload()}>Reload calculator</button>
                            <button className="action-btn-styled outline" onClick={handleClear}>Clear all changes</button>
                        </div>
                    </div>

                </div>
            </div>
        </CalculatorLayout>
    );
};

export default BAICalculatorPage;
