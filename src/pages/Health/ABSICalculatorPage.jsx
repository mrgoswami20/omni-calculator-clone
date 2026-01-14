import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Info } from 'lucide-react';
import './ABSICalculatorPage.css';

// NHANES Smoothed Mean and SD for ABSI (Table S1 from PLoS One 2012)
// Format: [smoothed_mean, smoothed_sd]
const NHANES_DATA = {
    male: {
        2: [0.07890, 0.00384], 3: [0.07915, 0.00384], 4: [0.07937, 0.00383], 5: [0.07955, 0.00383],
        6: [0.07964, 0.00382], 7: [0.07966, 0.00382], 8: [0.07958, 0.00382], 9: [0.07942, 0.00381],
        10: [0.07917, 0.00381], 11: [0.07886, 0.00381], 12: [0.07849, 0.00380], 13: [0.07810, 0.00380],
        14: [0.07772, 0.00380], 15: [0.07739, 0.00379], 16: [0.07716, 0.00379], 17: [0.07703, 0.00378],
        18: [0.07702, 0.00378], 19: [0.07711, 0.00378], 20: [0.07728, 0.00377], 21: [0.07750, 0.00377],
        22: [0.07777, 0.00377], 23: [0.07804, 0.00376], 24: [0.07831, 0.00376], 25: [0.07858, 0.00376],
        26: [0.07882, 0.00375], 27: [0.07904, 0.00375], 28: [0.07922, 0.00374], 29: [0.07938, 0.00374],
        30: [0.07951, 0.00374], 31: [0.07963, 0.00373], 32: [0.07975, 0.00373], 33: [0.07988, 0.00373],
        34: [0.08000, 0.00372], 35: [0.08013, 0.00372], 36: [0.08027, 0.00371], 37: [0.08042, 0.00371],
        38: [0.08057, 0.00371], 39: [0.08072, 0.00370], 40: [0.08087, 0.00370], 41: [0.08102, 0.00370],
        42: [0.08117, 0.00369], 43: [0.08132, 0.00369], 44: [0.08148, 0.00368], 45: [0.08165, 0.00368],
        46: [0.08183, 0.00368], 47: [0.08201, 0.00367], 48: [0.08221, 0.00367], 49: [0.08240, 0.00367],
        50: [0.08260, 0.00366], 51: [0.08279, 0.00366], 52: [0.08297, 0.00365], 53: [0.08315, 0.00365],
        54: [0.08334, 0.00365], 55: [0.08352, 0.00364], 56: [0.08369, 0.00364], 57: [0.08386, 0.00364],
        58: [0.08403, 0.00363], 59: [0.08419, 0.00363], 60: [0.08436, 0.00362], 61: [0.08454, 0.00362],
        62: [0.08471, 0.00362], 63: [0.08489, 0.00361], 64: [0.08506, 0.00361], 65: [0.08522, 0.00360],
        66: [0.08537, 0.00360], 67: [0.08551, 0.00360], 68: [0.08565, 0.00359], 69: [0.08578, 0.00359],
        70: [0.08591, 0.00359], 71: [0.08604, 0.00358], 72: [0.08616, 0.00358], 73: [0.08629, 0.00357],
        74: [0.08641, 0.00357], 75: [0.08653, 0.00357], 76: [0.08665, 0.00356], 77: [0.08675, 0.00356],
        78: [0.08685, 0.00355], 79: [0.08695, 0.00355], 80: [0.08705, 0.00355], 81: [0.08714, 0.00354],
        82: [0.08723, 0.00354], 83: [0.08732, 0.00354], 84: [0.08742, 0.00353], 85: [0.08811, 0.00356]
    },
    female: {
        2: [0.08031, 0.00363], 3: [0.08016, 0.00366], 4: [0.08001, 0.00369], 5: [0.07985, 0.00372],
        6: [0.07969, 0.00375], 7: [0.07952, 0.00378], 8: [0.07935, 0.00380], 9: [0.07917, 0.00383],
        10: [0.07899, 0.00386], 11: [0.07881, 0.00389], 12: [0.07863, 0.00392], 13: [0.07846, 0.00395],
        14: [0.07829, 0.00397], 15: [0.07814, 0.00400], 16: [0.07799, 0.00403], 17: [0.07787, 0.00406],
        18: [0.07775, 0.00408], 19: [0.07765, 0.00411], 20: [0.07757, 0.00414], 21: [0.07750, 0.00416],
        22: [0.07744, 0.00419], 23: [0.07740, 0.00422], 24: [0.07737, 0.00424], 25: [0.07735, 0.00427],
        26: [0.07734, 0.00429], 27: [0.07735, 0.00432], 28: [0.07736, 0.00435], 29: [0.07739, 0.00437],
        30: [0.07743, 0.00440], 31: [0.07747, 0.00442], 32: [0.07752, 0.00445], 33: [0.07759, 0.00447],
        34: [0.07766, 0.00450], 35: [0.07773, 0.00452], 36: [0.07782, 0.00454], 37: [0.07790, 0.00457],
        38: [0.07800, 0.00459], 39: [0.07810, 0.00462], 40: [0.07820, 0.00464], 41: [0.07831, 0.00466],
        42: [0.07842, 0.00469], 43: [0.07854, 0.00471], 44: [0.07866, 0.00473], 45: [0.07879, 0.00476],
        46: [0.07892, 0.00478], 47: [0.07905, 0.00480], 48: [0.07919, 0.00483], 49: [0.07933, 0.00485],
        50: [0.07947, 0.00487], 51: [0.07962, 0.00489], 52: [0.07977, 0.00492], 53: [0.07992, 0.00494],
        54: [0.08007, 0.00496], 55: [0.08023, 0.00498], 56: [0.08039, 0.00501], 57: [0.08055, 0.00503],
        58: [0.08072, 0.00505], 59: [0.08088, 0.00507], 60: [0.08105, 0.00509], 61: [0.08122, 0.00511],
        62: [0.08139, 0.00514], 63: [0.08156, 0.00516], 64: [0.08174, 0.00518], 65: [0.08191, 0.00520],
        66: [0.08208, 0.00522], 67: [0.08226, 0.00524], 68: [0.08243, 0.00526], 69: [0.08261, 0.00528],
        70: [0.08278, 0.00530], 71: [0.08296, 0.00533], 72: [0.08313, 0.00535], 73: [0.08330, 0.00537],
        74: [0.08346, 0.00539], 75: [0.08363, 0.00541], 76: [0.08380, 0.00543], 77: [0.08396, 0.00545],
        78: [0.08412, 0.00547], 79: [0.08428, 0.00549], 80: [0.08444, 0.00551], 81: [0.08460, 0.00553],
        82: [0.08476, 0.00555], 83: [0.08492, 0.00557], 84: [0.08508, 0.00559], 85: [0.08533, 0.00528]
    }
};

const ABSICalculatorPage = () => {
    // --- State ---
    const [sex, setSex] = useState('female');
    const [age, setAge] = useState('');
    const [height, setHeight] = useState({ value: '', unit: 'cm' });
    const [weight, setWeight] = useState({ value: '', unit: 'kg' });
    const [waist, setWaist] = useState({ value: '', unit: 'cm' });
    const [results, setResults] = useState({
        absi: '',
        zScore: '',
        risk: ''
    });

    const CONVERSIONS = {
        height: { cm: 0.01, m: 1, 'ft-in': null },
        weight: { kg: 1, lbs: 0.453592 },
        waist: { cm: 0.01, m: 1, in: 0.0254 }
    };

    // --- Calculation Logic ---
    useEffect(() => {
        calculateResults();
    }, [sex, age, height, weight, waist]);

    const calculateResults = () => {
        const hVal = parseFloat(height.value);
        const wVal = parseFloat(weight.value);
        const waistVal = parseFloat(waist.value);
        const ageVal = parseInt(age);

        if (!hVal || !wVal || !waistVal || isNaN(ageVal)) {
            setResults({ absi: '', zScore: '', risk: '' });
            return;
        }

        // 1. Convert to metric
        let h_m = hVal * CONVERSIONS.height[height.unit];
        let w_kg = wVal * CONVERSIONS.weight[weight.unit];
        let waist_m = waistVal * CONVERSIONS.waist[waist.unit];

        if (height.unit === 'ft-in') {
            // Handle ft-in conversion if implemented separately or parsed
            // For now assuming single field for simplicity as per common pattern in this app
        }

        // 2. BMI
        const bmi = w_kg / (h_m * h_m);

        // 3. ABSI
        // ABSI = WC / (BMI^(2/3) * height^(1/2))
        const absi = waist_m / (Math.pow(bmi, 2 / 3) * Math.sqrt(h_m));

        // 4. Z-Score
        // Clamp age to 2-85
        const lookupAge = Math.min(Math.max(ageVal, 2), 85);
        const [mean, stdDev] = NHANES_DATA[sex][lookupAge];
        const zScore = (absi - mean) / stdDev;

        // 5. Risk Assessment (Generalized)
        let risk = "";
        if (zScore > 0.5) risk = "Increased mortality risk";
        else if (zScore < -0.5) risk = "Decreased mortality risk";
        else risk = "Average mortality risk";

        setResults({
            absi: absi.toFixed(6),
            zScore: zScore.toFixed(3),
            risk: risk
        });
    };

    const handleClear = () => {
        setAge('');
        setHeight({ ...height, value: '' });
        setWeight({ ...weight, value: '' });
        setWaist({ ...waist, value: '' });
        setResults({ absi: '', zScore: '', risk: '' });
    };

    const articleContent = (
        <div className="article-container">
            <h2 className="article-title">What is ABSI?</h2>
            <p><strong>A Body Shape Index (ABSI)</strong> is a metric for assessing health risks related to body fat distribution. While the well-known Body Mass Index (BMI) focuses on total body mass relative to height, ABSI accounts for <strong>waist circumference</strong>, making it a better indicator of abdominal (visceral) fat.</p>

            <h2 className="article-title">How is ABSI calculated?</h2>
            <p>The ABSI formula adjusts waist circumference (WC) for both height and weight (BMI):</p>
            <div className="premium-formula-box">
                <div className="math-latex">
                    ABSI = WC / (BMI<sup>2/3</sup> × height<sup>1/2</sup>)
                </div>
            </div>

            <h2 className="article-title">Interpreting the ABSI z-score</h2>
            <p>An individual's ABSI is compared to age and sex-specific averages from a large population study (NHANES). The resulting <strong>z-score</strong> indicates how many standard deviations your ABSI is from the mean:</p>
            <ul>
                <li><strong>Z-score &gt; 0.5:</strong> Above average risk.</li>
                <li><strong>Z-score between -0.5 and 0.5:</strong> Average risk.</li>
                <li><strong>Z-score &lt; -0.5:</strong> Below average risk.</li>
            </ul>
        </div>
    );

    return (
        <CalculatorLayout
            title="ABSI Calculator"
            creators={[{ name: "Joanna Michałowska", phd: true }]}
            reviewers={[{ name: "Dominik Czernia", phd: true }, { name: "Jack Bowater" }]}
            articleContent={articleContent}
        >
            <div className="absi-calculator-page">
                <div className="section-card">
                    <h3 className="section-title">Input data</h3>

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

                    {/* Age */}
                    <div className="input-group">
                        <label className="input-label">Age</label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="input-field"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                placeholder=" "
                             onWheel={(e) => e.target.blur()} />
                            <div className="unit-label-static">years</div>
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
                             onWheel={(e) => e.target.blur()} />
                            <div className="unit-select-wrapper">
                                <select className="unit-select" value={weight.unit} onChange={(e) => setWeight({ ...weight, unit: e.target.value })}>
                                    <option value="kg">kg</option>
                                    <option value="lbs">lbs</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Waist Circumference */}
                    <div className="input-group">
                        <label className="input-label">Waist circumference</label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="input-field"
                                value={waist.value}
                                onChange={(e) => setWaist({ ...waist, value: e.target.value })}
                                placeholder=" "
                             onWheel={(e) => e.target.blur()} />
                            <div className="unit-select-wrapper">
                                <select className="unit-select" value={waist.unit} onChange={(e) => setWaist({ ...waist, unit: e.target.value })}>
                                    <option value="cm">cm</option>
                                    <option value="m">m</option>
                                    <option value="in">in</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="divider-custom"></div>

                    {/* Results Section */}
                    <h3 className="section-title">Results</h3>

                    <div className="input-group">
                        <label className="input-label">ABSI</label>
                        <div className="input-wrapper result-wrapper">
                            <input type="text" className="input-field calculated-value" value={results.absi} readOnly />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">ABSI z-score</label>
                        <div className="input-wrapper result-wrapper">
                            <input type="text" className="input-field calculated-value" value={results.zScore} readOnly />
                        </div>
                    </div>

                    {results.risk && (
                        <div className="risk-indicator-box">
                            <p className="risk-text">{results.risk}</p>
                        </div>
                    )}

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

export default ABSICalculatorPage;
