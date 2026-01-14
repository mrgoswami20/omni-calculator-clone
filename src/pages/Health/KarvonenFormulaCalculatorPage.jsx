import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Info, RefreshCcw, X, Share2 } from 'lucide-react';
import './KarvonenFormulaCalculatorPage.css';

const KarvonenFormulaCalculatorPage = () => {
    // --- State ---
    const [restingHR, setRestingHR] = useState('');
    const [knowMaxHR, setKnowMaxHR] = useState('yes'); // 'yes' or 'no'
    const [maxHR, setMaxHR] = useState('');
    const [age, setAge] = useState('');
    const [intensity, setIntensity] = useState('70');
    const [results, setResults] = useState({
        targetHR: '',
        heartRateReserve: ''
    });

    // --- Calculation Logic ---
    useEffect(() => {
        calculateResults();
    }, [restingHR, knowMaxHR, maxHR, age, intensity]);

    const calculateResults = () => {
        const rHR = parseFloat(restingHR);
        const intense = parseFloat(intensity) / 100;

        if (isNaN(rHR)) {
            setResults({ targetHR: '', heartRateReserve: '' });
            return;
        }

        let mHR = 0;
        if (knowMaxHR === 'yes') {
            mHR = parseFloat(maxHR);
        } else {
            const ageVal = parseFloat(age);
            if (!isNaN(ageVal)) {
                // Max HR = 220 - age
                mHR = 220 - ageVal;
            }
        }

        if (!mHR || mHR <= rHR) {
            setResults({ targetHR: '', heartRateReserve: '' });
            return;
        }

        const hrr = mHR - rHR;
        const thr = (hrr * intense) + rHR;

        setResults({
            targetHR: Math.round(thr).toString(),
            heartRateReserve: hrr.toString()
        });
    };

    const handleClear = () => {
        setRestingHR('');
        setMaxHR('');
        setAge('');
        setIntensity('70');
        setResults({ targetHR: '', heartRateReserve: '' });
    };

    const articleContent = (
        <div className="article-container">
            <h2 className="article-title">How do I calculate target heart rate using the Karvonen formula?</h2>
            <p>Karvonen formula for <strong>target heart rate (THR)</strong> requires you to know a few fundamental values:</p>
            <ul>
                <li><strong>MHR</strong> — Maximum heart rate in beats per minute: <br />If you don't know your MHR, calculate it easily using your age: <code>220-Age</code>;</li>
                <li><strong>RHR</strong> — Resting heart rate in beats per minute; and</li>
                <li><strong>Intensity</strong> of the exercise given in percentage (%).</li>
            </ul>
            <p>The equation for the target heart rate reads:</p>
            <div className="premium-formula-box">
                <div className="math-latex">
                    THR = ((MHR - RHR) × Intensity) + RHR
                </div>
            </div>

            <h2 className="article-title">How do I calculate Karvonen formula for maximum heart rate?</h2>
            <p>The Karvonen formula for maximum heart rate is as simple as that:</p>
            <div className="premium-formula-box">
                <div className="math-latex">
                    Maximum heart rate = 220 - Age
                </div>
            </div>
            <p>where:</p>
            <ul>
                <li><strong>Maximum heart rate</strong> is given in beats per minute (bpm); and</li>
                <li><strong>Age</strong> is given in years.</li>
            </ul>

            <h2 className="article-title">How to use this Karvonen formula calculator?</h2>
            <p>Let's explain a few simple steps between you and the answer you're looking for:</p>
            <ol>
                <li><strong>Input your resting heart rate.</strong></li>
                <li><strong>Enter or calculate your maximum heart rate.</strong> <br /><i>Your maximum heart rate will be calculated automatically after you enter your age.</i></li>
                <li><strong>Choose the intensity of the exercise.</strong> <br />The intensity of your exercise depends on what your goals are:
                    <ul>
                        <li>For <strong>moderate</strong> exercise, choose 50-70%;</li>
                        <li>For the <strong>fat-burning zone</strong>, choose 60-80%.</li>
                    </ul>
                </li>
                <li><strong>That's it — enjoy your results! 🥳</strong></li>
            </ol>
        </div>
    );

    return (
        <CalculatorLayout
            title="Karvonen Formula Calculator"
            creators={[{ name: "Łucja Zaborowska", md: true, phd: true }]}
            reviewers={[{ name: "Anna Szczepanek", phd: true }, { name: "Adena Benn" }]}
            articleContent={articleContent}
        >
            <div className="karvonen-calculator-page">
                <div className="section-card">
                    {/* Resting Heart Rate */}
                    <div className="input-group">
                        <label className="input-label">
                            Resting heart rate <Info size={14} className="info-icon" title="Your heart rate at rest, usually measured in the morning." />
                        </label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="input-field"
                                value={restingHR}
                                onChange={(e) => setRestingHR(e.target.value)}
                                placeholder=" "
                             onWheel={(e) => e.target.blur()} />
                            <div className="unit-label-static">bpm</div>
                        </div>
                    </div>

                    {/* Know Max HR Toggle */}
                    <div className="input-group">
                        <label className="input-label">Do you know the maximum HR?</label>
                        <div className="radio-group-container">
                            <label className={`radio-option ${knowMaxHR === 'yes' ? 'active' : ''}`}>
                                <input type="radio" value="yes" checked={knowMaxHR === 'yes'} onChange={() => setKnowMaxHR('yes')} />
                                <span className="radio-circle"></span>
                                Yes
                            </label>
                            <label className={`radio-option ${knowMaxHR === 'no' ? 'active' : ''}`}>
                                <input type="radio" value="no" checked={knowMaxHR === 'no'} onChange={() => setKnowMaxHR('no')} />
                                <span className="radio-circle"></span>
                                No
                            </label>
                        </div>
                    </div>

                    {/* Conditional: Max HR or Age */}
                    {knowMaxHR === 'yes' ? (
                        <div className="input-group">
                            <label className="input-label">
                                Maximum heart rate <Info size={14} className="info-icon" title="Highest heart rate achieved during maximal effort." />
                            </label>
                            <div className="input-wrapper">
                                <input
                                    type="number"
                                    className="input-field"
                                    value={maxHR}
                                    onChange={(e) => setMaxHR(e.target.value)}
                                    placeholder=" "
                                 onWheel={(e) => e.target.blur()} />
                                <div className="unit-label-static">bpm</div>
                            </div>
                        </div>
                    ) : (
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
                    )}

                    {/* Intensity */}
                    <div className="input-group">
                        <label className="input-label">Intensity</label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="input-field"
                                value={intensity}
                                onChange={(e) => setIntensity(e.target.value)}
                                placeholder=" "
                             onWheel={(e) => e.target.blur()} />
                            <div className="unit-label-static">%</div>
                        </div>
                    </div>

                    <div className="divider-custom"></div>

                    {/* Results Section */}
                    <div className="input-group">
                        <label className="input-label">
                            Target heart rate <Info size={14} className="info-icon" title="Your training heart rate zone." />
                        </label>
                        <div className="input-wrapper result-wrapper">
                            <input type="text" className="input-field calculated-value" value={results.targetHR} readOnly />
                            <div className="unit-label-static">bpm</div>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">
                            Heart rate reserve <Info size={14} className="info-icon" title="Difference between maximum heart rate and resting heart rate." />
                        </label>
                        <div className="input-wrapper result-wrapper">
                            <input type="text" className="input-field calculated-value" value={results.heartRateReserve} readOnly />
                            <div className="unit-label-static">bpm</div>
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

export default KarvonenFormulaCalculatorPage;
