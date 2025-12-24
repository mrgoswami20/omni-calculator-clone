import React, { useState } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, Info, ChevronDown } from 'lucide-react';
import { periodicTable } from '../../data/periodicTable';
import './ElectronegativityCalculatorPage.css';

const ElectronegativityCalculatorPage = () => {
    const [element1Z, setElement1Z] = useState(''); // Default empty
    const [element2Z, setElement2Z] = useState(''); // Default empty

    const creators = [
        { name: "Komal Rafay", role: "" }
    ];

    const reviewers = [
        { name: "Dominik Czernia", role: "PhD" },
        { name: "Jack Bowater", role: "" }
    ];

    const getElement = (z) => periodicTable[z];

    // Logic extraction
    const hasData = element1Z !== '' && element2Z !== '' && getElement(element1Z)?.electronegativity != null && getElement(element2Z)?.electronegativity != null;
    const en1 = hasData ? parseFloat(getElement(element1Z).electronegativity) : 0;
    const en2 = hasData ? parseFloat(getElement(element2Z).electronegativity) : 0;

    const diff = hasData ? Math.abs(en1 - en2).toFixed(2) : '';

    let bondType = null;
    let bondColor = 'inherit';

    if (hasData) {
        const d = parseFloat(diff);
        if (d < 0.4) {
            bondType = 'nonpolar covalent bond';
            bondColor = '#10b981'; // green-500
        } else if (d <= 1.7) {
            bondType = 'polar covalent bond';
            bondColor = '#f59e0b'; // amber-500
        } else {
            bondType = 'an ionic bond';
            bondColor = '#8b5cf6'; // violet-500
        }
    }

    const articleContent = (
        <>
            <p>
                This electronegativity calculator helps you find the electronegativity difference between two elements. Based on the value of this difference, you can determine if the bond formed is ionic or covalent.
            </p>
        </>
    );

    return (
        <CalculatorLayout
            title="Electronegativity Calculator"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "Electronegativity calculator",
                "Electronegativity definition",
                "What is electropositivity?",
                "Electronegativity formula",
                "FAQs"
            ]}
            articleContent={articleContent}
            similarCalculators={3}
        >
            <div className="calculator-card electronegativity-page">
                {/* Element 1 Input */}
                <div className="input-group">
                    <div className="label-row">
                        <label>First element</label>
                        <span className="more-options">...</span>
                    </div>
                    <div className="select-wrapper">
                        <select
                            value={element1Z}
                            onChange={(e) => setElement1Z(e.target.value)}
                            className="calc-select"
                        >
                            <option value="" disabled>Select an element...</option>
                            {Object.entries(periodicTable).map(([z, el]) => (
                                <option key={z} value={z}>{el.name} ({el.symbol})</option>
                            ))}
                        </select>
                        <ChevronDown className="select-arrow" size={16} />
                    </div>
                </div>

                {/* Element 2 Input */}
                <div className="input-group">
                    <div className="label-row">
                        <label>Second element</label>
                        <span className="more-options">...</span>
                    </div>
                    <div className="select-wrapper">
                        <select
                            value={element2Z}
                            onChange={(e) => setElement2Z(e.target.value)}
                            className="calc-select"
                        >
                            <option value="" disabled>Select an element...</option>
                            {Object.entries(periodicTable).map(([z, el]) => (
                                <option key={z} value={z}>{el.name} ({el.symbol})</option>
                            ))}
                        </select>
                        <ChevronDown className="select-arrow" size={16} />
                    </div>
                </div>

                {/* EN 1 Output */}
                <div className="input-group">
                    <div className="label-row">
                        <label>Electronegativity of first element (χ) <Info size={14} /></label>
                        <span className="more-options">...</span>
                    </div>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            className="calc-input"
                            value={hasData ? getElement(element1Z)?.electronegativity : ''}
                            readOnly
                        />
                    </div>
                </div>

                {/* EN 2 Output */}
                <div className="input-group">
                    <div className="label-row">
                        <label>Electronegativity of second element (χ) <Info size={14} /></label>
                        <span className="more-options">...</span>
                    </div>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            className="calc-input"
                            value={hasData ? getElement(element2Z)?.electronegativity : ''}
                            readOnly
                        />
                    </div>
                </div>

                {/* EN Diff Output */}
                <div className="input-group result-group">
                    <div className="label-row">
                        <label>Electronegativity difference (END)</label>
                        <span className="more-options">...</span>
                    </div>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            className="calc-input result-input"
                            value={diff}
                            readOnly
                        />
                    </div>
                </div>

                {bondType && (
                    <div className="bond-result">
                        If the two elements were to form a bond, it would be: <strong style={{ color: bondColor }}>{bondType}</strong> <span style={{ fontSize: '1.2em' }}>⚛️</span>
                    </div>
                )}

                <div className="calc-actions">
                    <button className="share-result-btn">
                        <div className="share-icon-circle"><Share2 size={14} /></div>
                        Share result
                    </button>
                    <div className="secondary-actions">
                        <button className="secondary-btn">Reload calculator</button>
                        <button className="secondary-btn" onClick={() => { setElement1Z(''); setElement2Z(''); }}>Clear all changes</button>
                    </div>
                </div>

                <div className="feedback-section">
                    <p>Did we solve your problem today?</p>
                    <div className="feedback-btns">
                        <button>Yes</button>
                        <button>No</button>
                    </div>
                </div>
            </div>
        </CalculatorLayout>
    );
};

export default ElectronegativityCalculatorPage;
