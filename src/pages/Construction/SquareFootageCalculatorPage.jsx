import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import '../../components/CalculatorLayout.css';

const SquareFootageCalculatorPage = () => {
    const [length, setLength] = useState('');
    const [width, setWidth] = useState('');
    const [area, setArea] = useState('');

    useEffect(() => {
        if (length && width) {
            const l = parseFloat(length);
            const w = parseFloat(width);
            setArea((l * w).toFixed(2));
        }
    }, [length, width]);

    return (
        <CalculatorLayout
            title="Square Footage Calculator"
            creators={[{ name: "Ewelina Wajs" }]}
            reviewers={[{ name: "Bogna Szyk" }]}
            tocItems={["How to calculate sq ft", "Applications"]}
        >
            <div className="calculator-card">
                <div className="input-group">
                    <label style={{ display: 'block', marginBottom: '4px' }}>Length</label>
                    <div className="input-wrapper">
                        <input type="number" value={length} onChange={(e) => setLength(e.target.value)} />
                        <div className="unit-display">ft</div>
                    </div>
                </div>
                <div className="input-group">
                    <label style={{ display: 'block', marginBottom: '4px' }}>Width</label>
                    <div className="input-wrapper">
                        <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} />
                        <div className="unit-display">ft</div>
                    </div>
                </div>
                <div className="input-group result-group">
                    <label style={{ display: 'block', marginBottom: '4px' }}>Square Footage</label>
                    <div className="input-wrapper">
                        <input type="text" value={area} readOnly className="result-input" />
                        <div className="unit-display">sq ft</div>
                    </div>
                </div>
            </div>
        </CalculatorLayout>
    );
};

export default SquareFootageCalculatorPage;
