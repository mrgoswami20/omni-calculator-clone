import React, { useState } from 'react';
import { Share2 } from 'lucide-react';
import CalculatorLayout from '../../components/CalculatorLayout';
import '../../components/CalculatorLayout.css';

const ConfidenceIntervalCalculatorPage = () => {
    const [mean, setMean] = useState('');
    const [stdDev, setStdDev] = useState('');
    const [sampleSize, setSampleSize] = useState('');
    const [confidenceLevel, setConfidenceLevel] = useState(95);
    const [result, setResult] = useState('');
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

    const handleClear = () => {
        setMean('');
        setStdDev('');
        setSampleSize('');
        setResult('');
    };

    const calculate = (m, s, n, c) => {
        if (!m || !s || !n) return;
        const meanVal = parseFloat(m);
        const sVal = parseFloat(s);
        const nVal = parseFloat(n);
        const cVal = parseFloat(c) / 100;

        // Z-score for confidence level (approx)
        let z = 1.96;
        if (cVal === 0.90) z = 1.645;
        if (cVal === 0.99) z = 2.576;
        if (cVal === 0.95) z = 1.96;

        // Margin of error
        const margin = z * (sVal / Math.sqrt(nVal));
        const lower = meanVal - margin;
        const upper = meanVal + margin;

        setResult(`[${lower.toFixed(2)}, ${upper.toFixed(2)}]`);
    };

    const handleChange = (setter) => (e) => {
        const val = e.target.value;
        setter(val);
        // Trigger recalc logic simpler in effect or just check existence here
        // For simplicity, not auto-calc'ing strictly every keystroke if deps complex, but here it's fine
    };

    // Effect to auto-calc
    React.useEffect(() => {
        calculate(mean, stdDev, sampleSize, confidenceLevel);
    }, [mean, stdDev, sampleSize, confidenceLevel]);

    return (
        <CalculatorLayout
            title="Confidence Interval Calculator"
            creators={[{ name: "Małgorzata Koperska" }]}
            reviewers={[{ name: "Steven Wooding" }]}
            tocItems={["Confidence Interval Formula", "How to calculate CI"]}
        >
            <div className="calc-card">
                <div className="input-group">
                    <label style={{ display: 'block', marginBottom: '4px' }}>Sample Mean (x̄)</label>
                    <div className="input-wrapper">
                        <input type="number" value={mean} onChange={handleChange(setMean)}  onWheel={(e) => e.target.blur()} />
                    </div>
                </div>
                <div className="input-group">
                    <label style={{ display: 'block', marginBottom: '4px' }}>Standard Deviation (s)</label>
                    <div className="input-wrapper">
                        <input type="number" value={stdDev} onChange={handleChange(setStdDev)}  onWheel={(e) => e.target.blur()} />
                    </div>
                </div>
                <div className="input-group">
                    <label style={{ display: 'block', marginBottom: '4px' }}>Sample Size (n)</label>
                    <div className="input-wrapper">
                        <input type="number" value={sampleSize} onChange={handleChange(setSampleSize)}  onWheel={(e) => e.target.blur()} />
                    </div>
                </div>
                <div className="input-group">
                    <label style={{ display: 'block', marginBottom: '4px' }}>Confidence Level (%)</label>
                    <div className="input-wrapper">
                        <select
                            value={confidenceLevel}
                            onChange={handleChange(setConfidenceLevel)}
                            style={{ width: '100%', border: 'none', background: 'transparent', padding: '10px' }}
                        >
                            <option value="90">90%</option>
                            <option value="95">95%</option>
                            <option value="99">99%</option>
                        </select>
                    </div>
                </div>

                <div className="input-group result-group">
                    <label style={{ display: 'block', marginBottom: '4px' }}>Confidence Interval</label>
                    <div className="input-wrapper">
                        <input type="text" value={result} readOnly className="result-input" />
                    </div>
                </div>

                <div className="calc-actions">
                    {/* <button className="share-result-btn" onClick={handleShare} style={{ position: 'relative' }}>
                        <div className="share-icon-circle"><Share2 size={14} /></div>
                        Share result
                        {showShareTooltip && <span className="copied-tooltip" style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)' }}>Copied!</span>}
                    </button> */}
                    <div className="secondary-actions">
                        <button className="secondary-btn" onClick={() => window.location.reload()}>Reload calculator</button>
                        <button className="secondary-btn" onClick={handleClear}>Clear all changes</button>
                    </div>
                </div>

            </div>
        </CalculatorLayout >
    );
};

export default ConfidenceIntervalCalculatorPage;
