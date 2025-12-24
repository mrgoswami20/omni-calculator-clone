import React, { useState } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, Pin } from 'lucide-react';
import '../../components/CalculatorLayout.css';

const PValueCalculatorPage = () => {
    const [zScore, setZScore] = useState('');
    const [pValue, setPValue] = useState('');

    const calculatePValue = (z) => {
        if (!z) return;
        const zNum = parseFloat(z);
        // Approximation of one-sided p-value for Z-score
        // Using a simple sigmoid-like approximation for demo functionality
        const p = 0.5 * (1 + Math.erf(zNum / Math.sqrt(2))); // Actually this is CDF. P-value (one tailed) is 1-CDF or similar.
        // Let's use standard normal table approximation for 1-tailed right
        // Standard normal CDF
        function cdf(x) {
            var t = 1 / (1 + .2316419 * Math.abs(x));
            var d = .3989423 * Math.exp(-x * x / 2);
            var prob = d * t * (.3193815 + t * (-.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
            if (x > 0) prob = 1 - prob;
            return prob;
        }

        let pVal = cdf(zNum); // one-tailed left
        // Let's just output two-tailed for general usage as "p-value" often implies that in simple calculators
        let pTwoTailed = 2 * (1 - cdf(Math.abs(zNum)));

        setPValue(pTwoTailed.toFixed(5));
    };

    const handleZChange = (e) => {
        const val = e.target.value;
        setZScore(val);
        calculatePValue(val);
    };

    return (
        <CalculatorLayout
            title="p-value Calculator"
            creators={[{ name: "Wojciech Sowa" }]}
            reviewers={[{ name: "Bogna Szyk" }]}
            tocItems={["What is p-value?", "How to calculate p-value"]}
        >
            <div className="calculator-card">
                <div className="input-group">
                    <div className="label-row">
                        <label>Z-score</label>
                        <span className="info-icon">i</span>
                    </div>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            value={zScore}
                            onChange={handleZChange}
                            placeholder="e.g. 1.96"
                        />
                        <div className="unit-display">Z</div>
                    </div>
                </div>

                <div className="input-group result-group">
                    <div className="label-row">
                        <label>p-value (2-tailed)</label>
                        <span className="info-icon">i</span>
                    </div>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            value={pValue}
                            readOnly
                            className="result-input"
                        />
                    </div>
                </div>
            </div>
        </CalculatorLayout>
    );
};
// Add simple math erf polyfill implementation if needed, but for now simple CDF
// Math.erf is supported in modern browsers.
Math.erf = Math.erf || function (x) {
    var m = 1.00;
    var s = 1.00;
    var sum = x * 1.0;
    for (var i = 1; i < 50; i++) {
        m *= i;
        s *= -1;
        sum += (s * Math.pow(x, 2 * i + 1)) / (m * (2 * i + 1));
    }
    return 2 * sum / Math.sqrt(3.1415926535);
}

export default PValueCalculatorPage;
