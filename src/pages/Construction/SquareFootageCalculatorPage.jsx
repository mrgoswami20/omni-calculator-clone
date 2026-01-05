import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2 } from 'lucide-react';
import '../../components/CalculatorLayout.css';

const SquareFootageCalculatorPage = () => {
    const [length, setLength] = useState('');
    const [width, setWidth] = useState('');
    const [area, setArea] = useState('');

    useEffect(() => {
        if (length && width) {
            const l = parseFloat(length);
            const w = parseFloat(width);
        }
    }, [length, width]);

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

export default SquareFootageCalculatorPage;
