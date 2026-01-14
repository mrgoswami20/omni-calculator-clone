import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { RotateCcw, Trash2, Atom, ChevronDown, ChevronUp } from 'lucide-react';
import { periodicTable } from '../../data/periodicTable';
import SimpleInputBar from '../../components/kit_components/SimpleInputBar';
import SimpleButton from '../../components/kit_components/SimpleButton';
import './AtomCalculatorPage.css';

const AtomCalculatorPage = () => {
    // State for all 6 variables
    const [atomicNumber, setAtomicNumber] = useState('');
    const [massNumber, setMassNumber] = useState('');
    const [charge, setCharge] = useState('');
    const [protons, setProtons] = useState('');
    const [neutrons, setNeutrons] = useState('');
    const [electrons, setElectrons] = useState('');
    const [isCompositionOpen, setIsCompositionOpen] = useState(false);

    const creators = [
        { name: "Anna Pawlik", role: "PhD candidate" }
    ];

    const reviewers = [
        { name: "Bogna Szyk" },
        { name: "Adena Benn" }
    ];

    // Handlers
    const updateFromProtons = (pVal) => {
        const p = parseFloat(pVal);
        if (isNaN(p)) return;

        // Update Z
        setAtomicNumber(pVal);

        // Update A if n is present
        if (neutrons !== '') {
            const n = parseFloat(neutrons);
            setMassNumber((p + n).toString());
        } else if (massNumber !== '') {
            const a = parseFloat(massNumber);
            setNeutrons((a - p).toString());
        }

        // Update q if e is present
        if (electrons !== '') {
            const e = parseFloat(electrons);
            setCharge((p - e).toString());
        } else if (charge !== '') {
            const q = parseFloat(charge);
            setElectrons((p - q).toString());
        }
    };

    const handleAtomicNumberChange = (val) => {
        setAtomicNumber(val);
        setProtons(val); // Sync P
        updateFromProtons(val);
    };

    const handleProtonsChange = (val) => {
        setProtons(val);
        setAtomicNumber(val); // Sync Z
        updateFromProtons(val);
    };

    const handleMassNumberChange = (val) => {
        setMassNumber(val);
        const a = parseFloat(val);
        const p = parseFloat(protons);

        // If we have P, update N. (n = A - p)
        if (!isNaN(a) && !isNaN(p)) {
            setNeutrons((a - p).toString());
        }
    };

    const handleNeutronsChange = (val) => {
        setNeutrons(val);
        const n = parseFloat(val);
        const p = parseFloat(protons);

        // If we have P, update A. (A = p + n)
        if (!isNaN(n) && !isNaN(p)) {
            setMassNumber((p + n).toString());
        }
    };

    const handleChargeChange = (val) => {
        setCharge(val);
        const q = parseFloat(val);
        const p = parseFloat(protons);

        // If we have P, update E. (e = p - q)
        if (!isNaN(q) && !isNaN(p)) {
            setElectrons((p - q).toString());
        }
    };

    const handleElectronsChange = (val) => {
        setElectrons(val);
        const e = parseFloat(val);
        const p = parseFloat(protons);

        // If we have P, update Q. (q = p - e)
        if (!isNaN(e) && !isNaN(p)) {
            setCharge((p - e).toString());
        }
    };

    const handleClear = () => {
        setAtomicNumber('');
        setMassNumber('');
        setCharge('');
        setProtons('');
        setNeutrons('');
        setElectrons('');
    };

    // Validation Logic
    const validateAtomicNumber = () => {
        const msgs = [];
        const z = parseFloat(atomicNumber);
        const a = parseFloat(massNumber);

        if (atomicNumber !== '') {
            if (z < 1) {
                msgs.push("You must have at least one proton.");
            }
            if (massNumber !== '' && !isNaN(a) && !isNaN(z) && z > a) {
                msgs.push("Atomic number must be equal to or less than the mass number.");
            }
        }
        return msgs;
    };

    const validateMassNumber = () => {
        const msgs = [];
        const z = parseFloat(atomicNumber);
        const a = parseFloat(massNumber);

        if (massNumber !== '') {
            if (a <= 0) {
                msgs.push("Mass number must be greater than 0.");
            }
            if (atomicNumber !== '' && !isNaN(z) && !isNaN(a) && a < z) {
                msgs.push("Mass number must be equal to or greater than the atomic number.");
            }
        }
        return msgs;
    };

    // Other simple validations
    const isProtonsInvalid = protons !== '' && parseFloat(protons) < 0;
    const isNeutronsInvalid = neutrons !== '' && parseFloat(neutrons) < 0;
    const isElectronsInvalid = electrons !== '' && parseFloat(electrons) < 0;

    const atomicNumberErrors = validateAtomicNumber();
    const massNumberErrors = validateMassNumber();

    const preventScroll = (e) => e.target.blur();

    return (
        <CalculatorLayout
            title="Atom Calculator"
            creators={creators}
            reviewers={reviewers}
            similarCalculators={11}
            tocItems={[
                "What is an atom?",
                "Atomic number, atomic mass",
                "Equations used to calculate protons, neutrons...",
                "How to calculate atomic number..."
            ]}
            articleContent={
                <>
                    <p style={{ marginBottom: '16px' }}>
                        The atom calculator is a tool for calculating the atomic number and the mass number based on the number of atom components - protons, neutrons, and electrons (or vice versa). In addition, you can define the charge of ions with known numbers of protons and electrons. This article will provide you with the following:
                    </p>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginBottom: '16px' }}>
                        <li style={{ marginBottom: '8px' }}>Definitions of:
                            <ul style={{ listStyleType: 'circle', paddingLeft: '20px', marginTop: '4px' }}>
                                <li>Atom;</li>
                                <li>Atom components;</li>
                                <li>Atomic number; and</li>
                                <li>Mass number.</li>
                            </ul>
                        </li>
                    </ul>
                </>
            }
        >
            <div className="atom-calculator-page">
                <div className="calc-card">
                    {/* Section 1: Atom Properties */}
                    <SimpleInputBar
                        label="Atomic number (Z)"
                        value={atomicNumber}
                        onChange={(e) => handleAtomicNumberChange(e.target.value)}
                        type="number"
                        errorMessages={atomicNumberErrors}
                        placeholder="1"
                        onWheel={preventScroll}
                    />

                    <SimpleInputBar
                        label="Mass number (A)"
                        value={massNumber}
                        onChange={(e) => handleMassNumberChange(e.target.value)}
                        type="number"
                        errorMessages={massNumberErrors}
                        placeholder="1"
                        onWheel={preventScroll}
                    />

                    <SimpleInputBar
                        label="Charge (q)"
                        value={charge}
                        onChange={(e) => handleChargeChange(e.target.value)}
                        type="number"
                        placeholder="0"
                        onWheel={preventScroll}
                    />

                    {/* Section 2: Atomic Composition (Collapsible toggle style) */}
                    <div
                        style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', color: '#3b82f6', fontWeight: 500, fontSize: '0.9rem', marginTop: 8 }}
                        onClick={() => setIsCompositionOpen(!isCompositionOpen)}
                    >
                        {isCompositionOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        <span>Atomic composition</span>
                    </div>

                    {isCompositionOpen && (
                        <>
                            <SimpleInputBar
                                label="Protons (p)"
                                value={protons}
                                onChange={(e) => handleProtonsChange(e.target.value)}
                                type="number"
                                error={isProtonsInvalid}
                                errorMessage="Cannot have negative protons."
                                placeholder="1"
                                onWheel={preventScroll}
                            />

                            <SimpleInputBar
                                label="Neutrons (n)"
                                value={neutrons}
                                onChange={(e) => handleNeutronsChange(e.target.value)}
                                type="number"
                                error={isNeutronsInvalid}
                                errorMessage="Cannot have negative neutrons."
                                placeholder="0"
                                onWheel={preventScroll}
                            />

                            <SimpleInputBar
                                label="Electrons (e)"
                                value={electrons}
                                onChange={(e) => handleElectronsChange(e.target.value)}
                                type="number"
                                error={isElectronsInvalid}
                                errorMessage="Cannot have negative electrons."
                                placeholder="1"
                                onWheel={preventScroll}
                            />
                        </>
                    )}

                    {/* Result Section */}
                    {atomicNumber && periodicTable[parseInt(atomicNumber)] && (
                        <div className="result-space" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div className="result-text">
                                Your element is <strong>{periodicTable[parseInt(atomicNumber)].name}</strong>
                            </div>

                            <div className="aze-notation">
                                <div className="aze-numbers">
                                    <span className="mass-number">{massNumber || '?'}</span>
                                    <span className="atomic-number">{atomicNumber}</span>
                                </div>
                                <div className="aze-symbol">
                                    {periodicTable[parseInt(atomicNumber)].symbol}
                                </div>
                            </div>

                            {massNumber && (
                                <div className="result-text">
                                    Mass: <strong>
                                        {
                                            ((parseFloat(protons || 0) * 1.00727647) +
                                                (parseFloat(neutrons || 0) * 1.00866492) +
                                                (parseFloat(electrons || 0) * 0.00054858)).toFixed(5)
                                        } u
                                    </strong>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="actions-section">
                        <div className="utility-buttons" style={{ width: '100%', flexDirection: 'row', justifyContent: 'center' }}>
                            <SimpleButton onClick={() => window.location.reload()} variant="secondary">
                                <RotateCcw size={16} style={{ marginRight: 8 }} /> Reload calculator
                            </SimpleButton>
                            <SimpleButton onClick={handleClear} variant="secondary">
                                <Trash2 size={16} style={{ marginRight: 8 }} /> Clear all changes
                            </SimpleButton>
                        </div>
                    </div>

                </div>
            </div>
        </CalculatorLayout>
    );
};

export default AtomCalculatorPage;
