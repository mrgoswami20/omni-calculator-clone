import React, { useState } from 'react';
import CalculatorLayout from '../components/CalculatorLayout';
import '../components/CalculatorLayout.css';

const ScientificNotationCalculatorPage = () => {
    const [number, setNumber] = useState('');
    const [sciNotation, setSciNotation] = useState('');

    const handleChange = (e) => {
        const val = e.target.value;
        setNumber(val);
        if (val) {
            const num = parseFloat(val);
            if (!isNaN(num)) {
                setSciNotation(num.toExponential());
            }
        } else {
            setSciNotation('');
        }
    };

    return (
        <CalculatorLayout
            title="Scientific Notation Calculator"
            creators={[{ name: "Mateusz Mucha" }]}
            reviewers={[{ name: "Dominik Czernia" }]}
            tocItems={["Scientific notation definition", "E-notation"]}
        >
            <div className="calculator-card">
                <div className="input-group">
                    <label style={{ display: 'block', marginBottom: '4px' }}>Number</label>
                    <div className="input-wrapper">
                        <input type="number" value={number} onChange={handleChange} />
                    </div>
                </div>
                <div className="input-group result-group">
                    <label style={{ display: 'block', marginBottom: '4px' }}>Scientific Notation</label>
                    <div className="input-wrapper">
                        <input type="text" value={sciNotation} readOnly className="result-input" />
                    </div>
                </div>
            </div>
        </CalculatorLayout>
    );
};

export default ScientificNotationCalculatorPage;
