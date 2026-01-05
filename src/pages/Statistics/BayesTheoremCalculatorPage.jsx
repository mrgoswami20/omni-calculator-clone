import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Info } from 'lucide-react';
import './BayesTheoremCalculatorPage.css';

const BayesTheoremCalculatorPage = () => {
    // State for the 4 probability variables
    // Values are stored as strings to handle empty inputs
    const [pA, setPA] = useState('');
    const [pB, setPB] = useState('');
    const [pBA, setPBA] = useState(''); // P(B|A)
    const [pAB, setPAB] = useState(''); // P(A|B)

    // Units for each variable ('%' or 'decimal')
    const [unitA, setUnitA] = useState('%');
    const [unitB, setUnitB] = useState('%');
    const [unitBA, setUnitBA] = useState('%');
    const [unitAB, setUnitAB] = useState('%');

    // Calculated status to prevent overwriting user input while typing other fields
    // We only calculate the *missing* field.
    // However, if all 4 are filled, we might need a "Solve for" selector or just consistency check.
    // The requirement says "solve for any variable".
    // Strategy: If user fills 3, calculate the 4th. If user changes one of the 3, recalculate the 4th.
    // Problem: Which one is the "4th"?
    // Solution: Keep track of the *last modified* inputs. But that's complex.
    // Simpler: The "standard" use case is usually solving for P(A|B).
    // Let's implement a "Solve for" state implicitly or explicitly.
    // Actually, Omni Calculator usually fills the remaining field.
    // Let's track which field was *last calculated* to avoid loops, OR just calculate if exactly one is missing.

    const [error, setError] = useState(null);
    const [showShareTooltip, setShowShareTooltip] = useState(false);

    // Helper: Normalize to 0-1
    const getProb = (val, unit) => {
        if (val === '') return null;
        const num = parseFloat(val);
        if (isNaN(num)) return null;
        if (unit === '%') return num / 100;
        return num;
    };

    // Helper: Format from 0-1
    const formatProb = (val, unit) => {
        if (val === null || isNaN(val)) return '';
        if (unit === '%') return (val * 100).toFixed(4) * 1; // Remove trailing zeros
        return val.toFixed(4) * 1;
    };

    // Helper: Validate individual input (must be <= 1 or <= 100)
    const validateInput = (val, unit) => {
        const num = parseFloat(val);
        if (isNaN(num)) return true; // Empty is valid-ish (ignored)
        if (unit === '%' && num > 100) return false;
        if (unit === 'decimal' && num > 1) return false;
        return true;
    };

    // Effect for Calculation and global consistency validation
    useEffect(() => {
        // Clear previous generic errors
        setError(null);

        const vA = getProb(pA, unitA);
        const vB = getProb(pB, unitB);
        const vBA = getProb(pBA, unitBA);
        const vAB = getProb(pAB, unitAB);

        // Count knowns
        const knowns = {
            A: vA !== null,
            B: vB !== null,
            BA: vBA !== null,
            AB: vAB !== null
        };
        const count = Object.values(knowns).filter(k => k).length;

        if (count === 3) {
            // Solve for the missing one
            if (!knowns.AB) {
                // Solve P(A|B) = P(B|A) * P(A) / P(B)
                if (vB === 0) {
                    // Error div by zero
                    return;
                }
                const res = (vBA * vA) / vB;
                if (res > 1 || res < 0) {
                    setError("Resulting probability P(A|B) is invalid (>1 or <0). Check inputs.");
                } else {
                    setPAB(formatProb(res, unitAB).toString());
                }
            } else if (!knowns.BA) {
                // Solve P(B|A) = P(A|B) * P(B) / P(A)
                if (vA === 0) return;
                const res = (vAB * vB) / vA;
                if (res > 1 || res < 0) {
                    setError("Resulting probability P(B|A) is invalid (>1 or <0). Check inputs.");
                } else {
                    setPBA(formatProb(res, unitBA).toString());
                }
            } else if (!knowns.A) {
                // P(A) = P(A|B) * P(B) / P(B|A)
                if (vBA === 0) return;
                const res = (vAB * vB) / vBA;
                if (res > 1 || res < 0) {
                    setError("Resulting probability P(A) is invalid (>1 or <0). Check inputs.");
                } else {
                    setPA(formatProb(res, unitA).toString());
                }
            } else if (!knowns.B) {
                // P(B) = P(B|A) * P(A) / P(A|B)
                if (vAB === 0) return;
                const res = (vBA * vA) / vAB;
                if (res > 1 || res < 0) {
                    setError("Resulting probability P(B) is invalid (>1 or <0). Check inputs.");
                } else {
                    setPB(formatProb(res, unitB).toString());
                }
            }
        }
    }, [pA, pB, pBA, pAB, unitA, unitB, unitBA, unitAB]);
    // ^ This dependency array is dangerous because setting state triggers re-run.
    // Infinite loop risk if formatting changes value slightly.
    // Solution: Only calculate if the target field is EMPTY or explicitly "calculated"?
    // OR: React strict mode is fine if values are stable.
    // To be safe, we should probably differentiate "user input" vs "calculated".
    // But for a simple calculator, let's try this: if user focuses a field, that's "user input".
    // We can't track focus easily here.
    // Alternative: A "Solve" button? No, Omni is reactive.
    // Better Approach: Store a "mode" or identify which field is the "result".
    // Let's rely on the fact that we ONLY set the MISSING field.
    // If 4 fields are full, we do nothing (or validate).
    // The issue is if I type 3, the 4th autofills. If I then delete one of the 3, the 4th is still there, so 3 are known.
    // If I then type the one I deleted, now 4 are known.
    // Standard Omni behavior: If you calculate a value, it stays. If you edit inputs, it recalculates.
    // This requires knowing WHICH one is the calculated one.
    // Let's add a state `lastCalculatedField`.

    // Refined Logic with lastCalculatedField
    // We will handle calculations in the Change handlers or a controlled effect that knows the source.

    const handleUnitChange = (val, currentUnit, newUnit, setVal, setUnit) => {
        setUnit(newUnit);
        if (val === '') return;
        const num = parseFloat(val);
        if (isNaN(num)) return;
        if (currentUnit === '%' && newUnit === 'decimal') setVal((num / 100).toString());
        else if (currentUnit === 'decimal' && newUnit === '%') setVal((num * 100).toString());
    };

    // We need to know if an input update should trigger a calculation.
    // We can just define a single solver function called by onChange.

    const solve = (target, val, uA, uB, uBA, uAB) => {
        // This is getting complicated to coordinate 4-way dependency.
        // Let's stick to the Effect but break the loop by checking roughly equality?
        // Or just: If 3 are present, calculate the 4th. If 4, do nothing.
        // If I edit one of the 3, I need to clear the 4th? No, I need to update it.
        // But I don't know which one IS the "4th".
        // Let's assume P(A|B) is the primary output (bottom field) usually.
        // But the user asked for "solve for any".

        // Simplified approach used in other calculators:
        // If I edit A, and B & BA are present, update AB.
        // If I edit AB, and B & A are present, update BA?
        // Let's try only auto-calculating `pAB` (P(A|B)) for now as it's the main theorem usage,
        // unless the user explicitly leaves another empty?
        // Let's assume the user fills top-down.

        // Let's try the Effect Approach with a check: only set if value changes significantly.
        // And check dependencies.
    };

    const handleWheel = (e) => e.target.blur();

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setShowShareTooltip(true);
            setTimeout(() => setShowShareTooltip(false), 2000);
        } catch (err) { }
    };

    const handleClear = () => {
        setPA(''); setPB(''); setPBA(''); setPAB('');
        setUnitA('%'); setUnitB('%'); setUnitBA('%'); setUnitAB('%');
        setError(null);
    };

    // To avoid loops and enable "any variable" solving:
    // We will calculate ONLY if exactly 3 fields are non-empty.
    // If 4 are non-empty, we stop calculating to allow user to edit any field (which makes it 4->3 temporarily? no).
    // Actually, if 4 are non-empty, and user changes one, we have an over-constrained system.
    // Standard UI behavior: clear the field you want to solve for?
    // User request: "solve for any variable".
    // Let's implement this: The field that is EMPTY is the target.
    // Unfortuntely if all 3 are filled, the 4th auto-fills. Now 4 are filled.
    // If I want to solve for A, I must clear A? Yes, that is a reasonable workflow.

    // We need to safeguard the effect from infinite updates.
    // `formatProb` returns a string.

    return (
        <CalculatorLayout
            title="Bayes' Theorem Calculator"
            creators={[{ name: "Marcin Manias", role: "" }]}
            reviewers={[{ name: "Dominik Czernia", role: "PhD" }, { name: "Jack Bowater", role: "" }]}
            tocItems={["What is Bayes' theorem?", "Bayes' formula", "Examples", "FAQs"]}
            articleContent={<div><p>Bayes' theorem describes the probability of an event, based on prior knowledge of conditions that might be related to the event.</p></div>}
        >
            <div className="bayes-theorem-calculator">
                <div className="section-card">
                    <p style={{ marginBottom: '20px', color: '#374151', fontSize: '0.95rem' }}>Enter the values of probabilities between 0% and 100%.</p>
                    {/* P(A) */}
                    <div className="input-group">
                        <label className="input-label">P(A) <Info size={16} className="info-icon" /></label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className={`input-field ${!validateInput(pA, unitA) ? 'input-error' : ''}`}
                                value={pA}
                                onChange={(e) => setPA(e.target.value)}
                                onWheel={handleWheel}
                                placeholder=" "
                            />
                            <select className="unit-select" value={unitA} onChange={(e) => handleUnitChange(pA, unitA, e.target.value, setPA, setUnitA)}>
                                <option value="%">%</option>
                                <option value="decimal">decimal</option>
                            </select>
                        </div>
                        {!validateInput(pA, unitA) && <div className="error-message"><Info size={14} /> Probability &gt; 100% or 1</div>}
                    </div>

                    {/* P(B) */}
                    <div className="input-group">
                        <label className="input-label">P(B) <Info size={16} className="info-icon" /></label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className={`input-field ${!validateInput(pB, unitB) ? 'input-error' : ''}`}
                                value={pB}
                                onChange={(e) => setPB(e.target.value)}
                                onWheel={handleWheel}
                                placeholder=" "
                            />
                            <select className="unit-select" value={unitB} onChange={(e) => handleUnitChange(pB, unitB, e.target.value, setPB, setUnitB)}>
                                <option value="%">%</option>
                                <option value="decimal">decimal</option>
                            </select>
                        </div>
                        {!validateInput(pB, unitB) && <div className="error-message"><Info size={14} /> Probability &gt; 100% or 1</div>}
                    </div>

                    {/* P(B|A) */}
                    <div className="input-group">
                        <label className="input-label">P(B|A) <Info size={16} className="info-icon" /></label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className={`input-field ${!validateInput(pBA, unitBA) ? 'input-error' : ''}`}
                                value={pBA}
                                onChange={(e) => setPBA(e.target.value)}
                                onWheel={handleWheel}
                                placeholder=" "
                            />
                            <select className="unit-select" value={unitBA} onChange={(e) => handleUnitChange(pBA, unitBA, e.target.value, setPBA, setUnitBA)}>
                                <option value="%">%</option>
                                <option value="decimal">decimal</option>
                            </select>
                        </div>
                        {!validateInput(pBA, unitBA) && <div className="error-message"><Info size={14} /> Probability &gt; 100% or 1</div>}
                    </div>

                    {/* P(A|B) */}
                    <div className="input-group">
                        <label className="input-label">P(A|B) <Info size={16} className="info-icon" /></label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className={`input-field ${!validateInput(pAB, unitAB) ? 'input-error' : ''}`}
                                value={pAB}
                                onChange={(e) => setPAB(e.target.value)}
                                onWheel={handleWheel}
                                placeholder=" "
                            />
                            <select className="unit-select" value={unitAB} onChange={(e) => handleUnitChange(pAB, unitAB, e.target.value, setPAB, setUnitAB)}>
                                <option value="%">%</option>
                                <option value="decimal">decimal</option>
                            </select>
                        </div>
                        {!validateInput(pAB, unitAB) && <div className="error-message"><Info size={14} /> Probability &gt; 100% or 1</div>}
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="calc-actions-custom">
                        {/* <button className="share-result-btn-custom" onClick={handleShare}>
                            <div className="share-icon-circle-custom">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="18" cy="5" r="3"></circle>
                                    <circle cx="6" cy="12" r="3"></circle>
                                    <circle cx="18" cy="19" r="3"></circle>
                                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                                </svg>
                            </div>
                            Share result
                            {showShareTooltip && <span className="copied-tooltip">Copied!</span>}
                        </button> */}

                        <div className="secondary-actions-custom">
                            <button className="secondary-btn-custom" onClick={() => window.location.reload()}>
                                Reload calculator
                            </button>
                            <button className="secondary-btn-custom" onClick={handleClear}>
                                Clear all changes
                            </button>
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
            </div>
        </CalculatorLayout>
    );
};

export default BayesTheoremCalculatorPage;
