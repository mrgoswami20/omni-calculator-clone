import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../components/CalculatorLayout';
import { ChevronDown, Share2 } from 'lucide-react';
import { periodicTable } from '../data/periodicTable';
import './AtomCalculatorPage.css';

const AtomCalculatorPage = () => {
    // State for all 6 variables
    // Calculating strings to allow empty inputs
    const [atomicNumber, setAtomicNumber] = useState('');
    const [massNumber, setMassNumber] = useState('');
    const [charge, setCharge] = useState('');
    const [protons, setProtons] = useState('');
    const [neutrons, setNeutrons] = useState('');
    const [electrons, setElectrons] = useState('');

    const creators = [
        { name: "Anna Pawlik", role: "PhD candidate" }
    ];

    const reviewers = [
        { name: "Bogna Szyk" },
        { name: "Adena Benn" }
    ];

    // Handlers
    // Rule: We update the state related to the input immediately.
    // We strictly follow: Z=p.
    // For others (A, n) and (q, e), we toggle the other variable.
    // E.g. if A changes, update n (if p known). if n changes, update A (if p known).

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
            // Should we update n? Usually standard flow is Inputs -> Derived.
            // Let's assume A comes from p+n. But user might want to find n from A and p.
            // If A is already set, update n.
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
                        <li style={{ marginBottom: '8px' }}>The equations used to calculate the number of:
                            <ul style={{ listStyleType: 'circle', paddingLeft: '20px', marginTop: '4px' }}>
                                <li>Protons;</li>
                                <li>Neutrons;</li>
                                <li>Electrons;</li>
                                <li>Atomic number;</li>
                                <li>Atomic mass and</li>
                                <li>Atomic charge.</li>
                            </ul>
                        </li>
                        <li>Lastly, a short step-by-step tutorial on how to calculate:
                            <ul style={{ listStyleType: 'circle', paddingLeft: '20px', marginTop: '4px' }}>
                                <li>Atomic number;</li>
                                <li>Atomic mass; and</li>
                                <li>Charge.</li>
                            </ul>
                        </li>
                    </ul>
                </>
            }
        >
            <div className="calculator-card atom-calculator-page">
                {/* Top Section */}
                <div className="input-group">
                    <div className="label-row">
                        <label>Atomic number</label>
                        <span className="more-options">...</span>
                    </div>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            value={atomicNumber}
                            onChange={(e) => handleAtomicNumberChange(e.target.value)}
                        />
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
                            value={massNumber}
                            onChange={(e) => handleMassNumberChange(e.target.value)}
                        />
                    </div>
                </div>

                <div className="input-group">
                    <div className="label-row">
                        <label>Charge</label>
                        <span className="more-options">...</span>
                    </div>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            value={charge}
                            onChange={(e) => handleChargeChange(e.target.value)}
                        />
                    </div>
                </div>

                {/* Collapsible Section Header (Visual only for now, always open) */}
                <div className="section-header">
                    <ChevronDown size={20} className="chevron" />
                    <span>Atomic composition</span>
                </div>

                <div className="input-group">
                    <div className="label-row">
                        <label>Number of protons</label>
                        <span className="more-options">...</span>
                    </div>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            value={protons}
                            onChange={(e) => handleProtonsChange(e.target.value)}
                        />
                    </div>
                </div>

                <div className="input-group">
                    <div className="label-row">
                        <label>Number of neutrons</label>
                        <span className="more-options">...</span>
                    </div>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            value={neutrons}
                            onChange={(e) => handleNeutronsChange(e.target.value)}
                        />
                    </div>
                </div>

                <div className="input-group">
                    <div className="label-row">
                        <label>Number of electrons</label>
                        <span className="more-options">...</span>
                    </div>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            value={electrons}
                            onChange={(e) => handleElectronsChange(e.target.value)}
                        />
                    </div>
                </div>

                {atomicNumber && periodicTable[atomicNumber] && (
                    <div className="atom-result-section">
                        <div className="result-text">
                            Your element is <strong>{periodicTable[atomicNumber].name}</strong>
                        </div>

                        <div className="result-text">
                            and its AZE notation is
                        </div>

                        <div className="aze-notation">
                            <div className="aze-numbers">
                                <span className="mass-number">{massNumber || '?'}</span>
                                <span className="atomic-number">{atomicNumber}</span>
                            </div>
                            <div className="aze-symbol">
                                {periodicTable[atomicNumber].symbol}
                            </div>
                        </div>

                        {massNumber && (
                            <div className="result-text mass-text">
                                The total mass of your atom is <strong>
                                    {
                                        ((parseFloat(protons || 0) * 1.00727647) +
                                            (parseFloat(neutrons || 0) * 1.00866492) +
                                            (parseFloat(electrons || 0) * 0.00054858)).toFixed(5)
                                    } u
                                </strong>.
                            </div>
                        )}
                    </div>
                )}

                <div className="calc-actions">
                    <button className="share-result-btn">
                        <div className="share-icon-circle"><Share2 size={14} /></div>
                        Share result
                    </button>
                    <div className="secondary-actions">
                        <button className="secondary-btn">Reload calculator</button>
                        <button className="secondary-btn" onClick={handleClear}>Clear all changes</button>
                    </div>
                </div>
            </div>
        </CalculatorLayout>
    );
};

export default AtomCalculatorPage;
