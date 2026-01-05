import React, { useState } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2 } from 'lucide-react';
import '../../components/CalculatorLayout.css';

const SigFigCalculatorPage = () => {
    const [number, setNumber] = useState('');
    const [sigFigs, setSigFigs] = useState('');

    const calculateSigFigs = (nStr) => {
        if (!nStr) return 0;
        // Basic sig fig counting logic
        nStr = nStr.toLowerCase().trim();
        if (parseFloat(nStr) === 0) return 0; // rough check

        // Remove scientific notation part for counting
        let core = nStr;
        if (nStr.includes('e')) {
            core = nStr.split('e')[0];
        }

        // Remove decimal point
        const hasDecimal = core.includes('.');
        let clean = core.replace('.', '');

        // Remove leading zeros
        clean = clean.replace(/^0+/, '');

        // If no decimal, trailing zeros might not count (ambiguous, but often don't).
        // Omni usually counts them or asks. We'll simply count all remaining digits if decimal exists, 
        // or remove trailing zeros if no decimal.
        if (!hasDecimal) {
            clean = clean.replace(/0+$/, '');
        }

        return clean.length;
    };

    const handleChange = (e) => {
        const val = e.target.value;
        setNumber(val);
        setSigFigs(calculateSigFigs(val));
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
            title="Significant Figures Calculator"
            creators={[{ name: "Alvaro Diez" }]}
            reviewers={[{ name: "Tibor Pál" }]}
            tocItems={["What are significant figures?", "Rules"]}
        >
            <div className="calculator-card">
                <div className="input-group">
                    <label style={{ display: 'block', marginBottom: '4px' }}>Data</label>
                    <div className="input-wrapper">
                        <input type="text" value={number} onChange={handleChange} placeholder="Type a number" />
                    </div>
                </div>
                <div className="input-group result-group">
                    <label style={{ display: 'block', marginBottom: '4px' }}>Significant Figures</label>
                    <div className="input-wrapper">
                        <input type="text" value={sigFigs} readOnly className="result-input" />
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

export default SigFigCalculatorPage;
