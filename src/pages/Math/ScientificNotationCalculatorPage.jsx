import React, { useState } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2 } from 'lucide-react';
import '../../components/CalculatorLayout.css';

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

    return (
        <CalculatorLayout
            title="Scientific Notation Calculator"
            creators={[{ name: "Mateusz Mucha" }]}
            reviewers={[{ name: "Dominik Czernia" }]}
            tocItems={["Scientific notation definition", "E-notation"]}
        >
            <div className="calc-card">
                <div className="input-group">
                    <label style={{ display: 'block', marginBottom: '4px' }}>Number</label>
                    <div className="input-wrapper">
                        <input type="number" value={number} onChange={handleChange}  onWheel={(e) => e.target.blur()} />
                    </div>
                </div>
                <div className="input-group result-group">
                    <label style={{ display: 'block', marginBottom: '4px' }}>Scientific Notation</label>
                    <div className="input-wrapper">
                        <input type="text" value={sciNotation} readOnly className="result-input" />
                    </div>
                </div>

                <div className="calc-actions">
                    {/* <button className="share-result-btn" onClick={handleShare}>
                        <div className="share-icon-circle"><Share2 size={14} /></div>
                        Share result
                        {showShareTooltip && <span className="copied-tooltip">Copied!</span>}
                    </button> */}
                    <div className="secondary-actions">
                        <button className="secondary-btn" onClick={() => window.location.reload()}>Reload calculator</button>
                    </div>
                </div>
            </div>
        </CalculatorLayout>
    );
};

export default ScientificNotationCalculatorPage;
