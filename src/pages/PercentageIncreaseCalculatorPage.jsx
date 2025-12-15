import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../components/CalculatorLayout';
import '../components/CalculatorLayout.css';

const PercentageIncreaseCalculatorPage = () => {
    const [initialValue, setInitialValue] = useState('');
    const [finalValue, setFinalValue] = useState('');
    const [increase, setIncrease] = useState('');
    const [percentage, setPercentage] = useState('');

    useEffect(() => {
        if (initialValue && finalValue) {
            const i = parseFloat(initialValue);
            const f = parseFloat(finalValue);
            if (i !== 0) {
                const diff = f - i;
                const perc = (diff / Math.abs(i)) * 100;
                setIncrease(diff.toFixed(2));
                setPercentage(perc.toFixed(2) + '%');
            }
        }
    }, [initialValue, finalValue]);

    return (
        <CalculatorLayout
            title="Percentage Increase Calculator"
            creators={[{ name: "Mateusz Mucha" }]}
            reviewers={[{ name: "Dominik Czernia" }]}
            tocItems={["Formula", "Examples"]}
        >
            <div className="calculator-card">
                <div className="input-group">
                    <label style={{ display: 'block', marginBottom: '4px' }}>Initial Value</label>
                    <div className="input-wrapper">
                        <input type="number" value={initialValue} onChange={(e) => setInitialValue(e.target.value)} />
                    </div>
                </div>
                <div className="input-group">
                    <label style={{ display: 'block', marginBottom: '4px' }}>Final Value</label>
                    <div className="input-wrapper">
                        <input type="number" value={finalValue} onChange={(e) => setFinalValue(e.target.value)} />
                    </div>
                </div>
                <div className="input-group result-group">
                    <label style={{ display: 'block', marginBottom: '4px' }}>Absolute Change</label>
                    <div className="input-wrapper">
                        <input type="text" value={increase} readOnly className="result-input" />
                    </div>
                </div>
                <div className="input-group result-group">
                    <label style={{ display: 'block', marginBottom: '4px' }}>Percentage Increase</label>
                    <div className="input-wrapper">
                        <input type="text" value={percentage} readOnly className="result-input" />
                    </div>
                </div>
            </div>
        </CalculatorLayout>
    );
};

export default PercentageIncreaseCalculatorPage;
