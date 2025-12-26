import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, Info } from 'lucide-react';
import { periodicTable } from '../../data/periodicTable';
import './AtomicMassCalculatorPage.css';

const AtomicMassCalculatorPage = () => {
    const [protons, setProtons] = useState('6');
    const [neutrons, setNeutrons] = useState('6');
    const [massNumber, setMassNumber] = useState(12);
    const [atomicMassU, setAtomicMassU] = useState(12);
    const [atomicMassKg, setAtomicMassKg] = useState(19.926); // x 10^-27
    const [symbol, setSymbol] = useState('C');
    const [isStable, setIsStable] = useState(true);

    const creators = [
        { name: "Steven Wooding", role: "" }
    ];

    const reviewers = [
        { name: "Dominik Czernia", role: "PhD" },
        { name: "Jack Bowater", role: "" }
    ];

    // Simple stability map for demo (Element Symbol -> Array of Stable Neutron counts or Mass Numbers)
    // Ref: https://en.wikipedia.org/wiki/List_of_stable_isotopes
    const stableIsotopes = {
        H: [0, 1], // H-1, H-2 (D)
        He: [1, 2], // He-3, He-4
        Li: [3, 4], // Li-6, Li-7
        Be: [5], // Be-9
        B: [5, 6], // B-10, B-11
        C: [6, 7], // C-12, C-13
        N: [7, 8], // N-14, N-15
        O: [8, 9, 10], // O-16, O-17, O-18
        F: [10], // F-19
        Ne: [10, 11, 12], // Ne-20, Ne-21, Ne-22
        Na: [12], // Na-23
        Mg: [12, 13, 14], // Mg-24, Mg-25, Mg-26
        Al: [14], // Al-27
        Si: [14, 15, 16], // Si-28, Si-29, Si-30
        P: [16], // P-31
        S: [16, 17, 18, 20], // S-32, S-33, S-34, S-36
        Cl: [18, 20], // Cl-35, Cl-37
        Ar: [18, 20, 22] // Ar-36, Ar-38, Ar-40
        // Add more if needed, default to "Unknown stability" or "Unstable" for others
    };

    useEffect(() => {
        const calculate = () => {
            const z = parseInt(protons) || 0;
            const n = parseInt(neutrons) || 0;
            const a = z + n;

            setMassNumber(a);
            setAtomicMassU(a); // Approximation for this calculator's UI which usually sums them

            // 1 u = 1.66053906660e-27 kg
            const kgVal = (a * 1.66053906660);
            setAtomicMassKg(kgVal.toFixed(3));

            if (periodicTable[z]) {
                const sym = periodicTable[z].symbol;
                setSymbol(sym);

                // Check stability
                if (stableIsotopes[sym] && stableIsotopes[sym].includes(n)) {
                    setIsStable(true);
                } else if (stableIsotopes[sym]) {
                    setIsStable(false);
                } else {
                    // Default for elements we haven't mapped manually
                    setIsStable(true); // Being optimistic for large Z for now, or could check N/Z ratio
                }
            } else {
                setSymbol('?');
                setIsStable(false);
            }
        };

        calculate();
    }, [protons, neutrons]);

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

    const articleContent = (
        <>
            <p>
                This atomic mass calculator shows you how to find the <strong>atomic mass of an atom</strong> using the atomic mass formula and explains the atomic mass definition. It also describes the atomic mass unit and explores <strong>why an atom needs neutrons</strong>.
            </p>
        </>
    );

    return (
        <CalculatorLayout
            title="Atomic Mass Calculator"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "Atomic mass definition and atomic mass formula",
                "How to calculate atomic mass using this calculator",
                "Why do atoms need neutrons?",
                "FAQs"
            ]}
            articleContent={articleContent}
            similarCalculators={4}
        >
            <div className="calculator-card atomic-mass-page">
                {/* Inputs */}
                <div className="input-group">
                    <div className="label-row">
                        <label>Number of protons (Z)</label>
                        <span className="more-options">...</span>
                    </div>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            className="calc-input"
                            value={protons}
                            onChange={(e) => setProtons(e.target.value)}
                        />
                    </div>
                </div>

                <div className="input-group">
                    <div className="label-row">
                        <label>Number of neutrons (N)</label>
                        <span className="more-options">...</span>
                    </div>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            className="calc-input"
                            value={neutrons}
                            onChange={(e) => setNeutrons(e.target.value)}
                        />
                    </div>
                </div>

                {/* Outputs */}
                <div className="input-group">
                    <div className="label-row">
                        <label>Atomic mass</label>
                        <span className="more-options">...</span>
                    </div>
                    <div className="input-wrapper with-unit">
                        <input
                            type="number"
                            className="calc-input"
                            value={atomicMassU}
                            readOnly
                        />
                        <span className="unit-label">u <Info size={14} /></span>
                    </div>
                </div>

                <div className="input-group">
                    <div className="label-row">
                        <label>Atomic mass (SI)</label>
                        <span className="more-options">...</span>
                    </div>
                    <div className="input-wrapper with-unit scientific">
                        <input
                            type="number"
                            className="calc-input"
                            value={atomicMassKg}
                            readOnly
                        />
                        <span className="scientific-part">× 10⁻²⁷</span>
                        <span className="unit-label">kg</span>
                    </div>
                </div>

                <div className="input-group">
                    <div className="label-row">
                        <label>Mass number</label>
                        <span className="more-options">...</span>
                    </div>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            className="calc-input"
                            value={massNumber}
                            readOnly
                        />
                    </div>
                </div>

                {/* Symbol Display */}
                <div className="symbol-section">
                    <div className="label-row">
                        <label>Atomic symbol</label>
                    </div>
                    <div className="aze-display">
                        <div className="aze-numbers">
                            <span className="aze-a">{massNumber}</span>
                            <span className="aze-z">{protons}</span>
                        </div>
                        <span className="aze-sym">{symbol}</span>
                    </div>
                    {isStable !== null && (
                        <div className="stability-text">
                            This is a {isStable ? 'stable' : 'unstable'} atom.
                        </div>
                    )}
                </div>

                <div className="calc-actions">
                    <button className="share-result-btn" onClick={handleShare}>
                        <div className="share-icon-circle"><Share2 size={14} /></div>
                        Share result
                        {showShareTooltip && <span className="copied-tooltip">Copied!</span>}
                    </button>
                    <div className="secondary-actions">
                        <button className="secondary-btn">Reload calculator</button>
                        <button className="secondary-btn" onClick={() => { setProtons(''); setNeutrons(''); }}>Clear all changes</button>
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

export default AtomicMassCalculatorPage;
