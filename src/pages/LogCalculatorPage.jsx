import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../components/CalculatorLayout';
import '../components/CalculatorLayout.css';

const LogCalculatorPage = () => {
    const [base, setBase] = useState('10');
    const [number, setNumber] = useState('');
    const [result, setResult] = useState('');

    useEffect(() => {
        if (base && number) {
            const b = parseFloat(base);
            const n = parseFloat(number);
            if (b > 0 && n > 0 && b !== 1) {
                const res = Math.log(n) / Math.log(b);
                setResult(res.toString());
            } else {
                setResult('Undefined');
            }
        }
    }, [base, number]);

    return (
        <CalculatorLayout
            title="Log Calculator"
            creators={[{ name: "Kenneth Alambra" }]}
            reviewers={[{ name: "Bogna Szyk" }]}
            tocItems={["Logarithm rules", "Common logs"]}
        >
            <div className="calculator-card">
                <div className="input-group">
                    <label style={{ display: 'block', marginBottom: '4px' }}>Base (b)</label>
                    <div className="input-wrapper">
                        <input type="number" value={base} onChange={(e) => setBase(e.target.value)} />
                    </div>
                </div>
                <div className="input-group">
                    <label style={{ display: 'block', marginBottom: '4px' }}>Number (x)</label>
                    <div className="input-wrapper">
                        <input type="number" value={number} onChange={(e) => setNumber(e.target.value)} />
                    </div>
                </div>
                <div className="input-group result-group">
                    <label style={{ display: 'block', marginBottom: '4px' }}>Result</label>
                    <div className="input-wrapper">
                        <input type="text" value={result} readOnly className="result-input" />
                    </div>
                </div>
            </div>
        </CalculatorLayout>
    );
};

export default LogCalculatorPage;
