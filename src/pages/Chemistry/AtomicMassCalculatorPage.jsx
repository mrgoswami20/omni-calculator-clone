import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { RotateCcw, Trash2, Info, AlertCircle } from 'lucide-react';
import { periodicTable } from '../../data/periodicTable';
import SimpleInputBar from '../../components/kit_components/SimpleInputBar';
import InputBarWithDropDownOption from '../../components/kit_components/InputBarWithDropDownOption';
import SimpleButton from '../../components/kit_components/SimpleButton';
import './AtomicMassCalculatorPage.css';

const AtomicMassCalculatorPage = () => {
    const [protons, setProtons] = useState('6');
    const [neutrons, setNeutrons] = useState('6');
    const [massNumber, setMassNumber] = useState(12);
    const [atomicMassU, setAtomicMassU] = useState(12);
    const [atomicMassKg, setAtomicMassKg] = useState(19.926);
    // ^ Stores the mantissa for 10^-27 scale. e.g. 19.926 (means 19.926 x 10^-27)
    // Wait, if I want to support variable exponent, I should store the ACTUAL value in kg, or derive it.
    // Base calculation: atomicMassU * 1.6605e-27 = actual kg.
    // display = actual kg / 10^exponent.

    const [symbol, setSymbol] = useState('C');
    const [isStable, setIsStable] = useState(true);

    // Unit States
    const [massUnit, setMassUnit] = useState('u');
    const [siExponent, setSiExponent] = useState('-27'); // String for dropdown value

    const creators = [
        { name: "Steven Wooding", role: "" }
    ];

    const reviewers = [
        { name: "Dominik Czernia", role: "PhD" },
        { name: "Jack Bowater", role: "" }
    ];

    const stableIsotopes = {
        H: [0, 1], He: [1, 2], Li: [3, 4], Be: [5], B: [5, 6], C: [6, 7], N: [7, 8],
        O: [8, 9, 10], F: [10], Ne: [10, 11, 12], Na: [12], Mg: [12, 13, 14],
        Al: [14], Si: [14, 15, 16], P: [16], S: [16, 17, 18, 20], Cl: [18, 20], Ar: [18, 20, 22]
    };

    const Conversions = {
        u: 1,
        ng: 1.66053906660e-15,
        me: 1822.8885,
        mp: 0.99274,
        mn: 0.99140
    };

    const massOptions = [
        { value: 'u', label: 'atomic mass units (u)' },
        { value: 'ng', label: 'nanograms (ng)' },
        { value: 'me', label: 'electron rest masses (me)' },
        { value: 'mp', label: 'proton rest masses (mp)' },
        { value: 'mn', label: 'neutron rest masses (mn)' }
    ];

    const siOptions = [
        { value: '-28', label: '× 10⁻²⁸' }, // times 10 to the minus 28
        { value: '-27', label: '× 10⁻²⁷' }, // times 10 to the minus 27 (Default)
        { value: '-26', label: '× 10⁻²⁶' }, // times 10 to the minus 26
        { value: '-25', label: '× 10⁻²⁵' }  // times 10 to the minus 25
    ];

    const getDisplayAtomicMass = () => {
        if (atomicMassU === '' || isNaN(parseFloat(atomicMassU))) return '';
        const valInU = parseFloat(atomicMassU);
        const factor = Conversions[massUnit] || 1;
        const converted = valInU * factor;

        if (massUnit === 'ng') return converted.toExponential(6);
        return parseFloat(converted.toFixed(6));
    };

    const getDisplaySiMass = () => {
        if (atomicMassU === '' || isNaN(parseFloat(atomicMassU))) return '';
        // 1 u = 1.660539e-27 kg
        const massInKg = parseFloat(atomicMassU) * 1.66053906660e-27;

        // displayed = massInKg / 10^exp
        const exp = parseInt(siExponent);
        const factor = Math.pow(10, exp);

        const displayed = massInKg / factor;

        // Avoid floating point precision issues?
        // e.g. 1.66e-27 / 1e-27 = 1.66.

        return parseFloat(displayed.toFixed(6));
    };

    useEffect(() => {
        const calculate = () => {
            const z = parseFloat(protons);
            const n = parseFloat(neutrons);

            if (!isNaN(z) && !isNaN(n)) {
                const a = z + n;
                setMassNumber(a);
                setAtomicMassU(a);
                // We don't need to manually set atomicMassKg state anymore for display, 
                // we derive it from 'a' in getDisplaySiMass.

                const zInt = Math.round(z);
                if (periodicTable[zInt]) {
                    const sym = periodicTable[zInt].symbol;
                    setSymbol(sym);
                    if (stableIsotopes[sym] && stableIsotopes[sym].includes(n)) {
                        setIsStable(true);
                    } else if (stableIsotopes[sym]) {
                        setIsStable(false);
                    } else {
                        setIsStable(true);
                    }
                } else {
                    setSymbol('?');
                    setIsStable(false);
                }
            } else {
                setMassNumber('');
                setAtomicMassU('');
                setSymbol('?');
                setIsStable(null);
            }
        };
        calculate();
    }, [protons, neutrons]);

    const preventScroll = (e) => e.target.blur();

    const handleReload = () => window.location.reload();
    const handleClear = () => {
        setProtons('');
        setNeutrons('');
        setMassUnit('u');
        setSiExponent('-27');
    };

    // Validations (Errors - Red)
    const validateProtonsError = () => {
        if (protons === '') return null;
        const z = parseFloat(protons);
        if (isNaN(z) || z <= 0) return "Number of protons should be a positive value.";
        return null;
    };

    const validateNeutronsError = () => {
        if (neutrons === '') return null;
        const n = parseFloat(neutrons);
        if (isNaN(n) || n < 0) return "Number of neutrons should be zero or greater.";
        return null;
    };

    const validateAtomicMassUError = () => {
        if (atomicMassU === '') return null;
        const val = parseFloat(atomicMassU);
        if (val <= 0) return "Atomic mass should be a positive value.";
        return null;
    };

    // Validate derived SI mass
    const validateAtomicMassKgError = () => {
        if (atomicMassU === '') return null;
        if (parseFloat(atomicMassU) <= 0) return "Atomic mass (SI) should be a positive value.";
        return null;
    };

    const validateMassNumberError = () => {
        if (massNumber === '') return null;
        const val = parseFloat(massNumber);
        if (val <= 0) return "Mass number should be a positive value.";
        return null;
    };

    // Observations (Warnings - Blue)
    const validateProtonsWarning = () => {
        if (protons === '') return [];
        const z = parseFloat(protons);
        if (!isNaN(z) && z > 118) return ["To date, the maximum number of protons observed in an atom are 118."];
        return [];
    };

    const validateNeutronsWarning = () => {
        if (neutrons === '') return [];
        const n = parseFloat(neutrons);
        if (!isNaN(n) && n > 177) return ["To date, the maximum number of neutrons observed in an atom are 177."];
        return [];
    };

    const protonsError = validateProtonsError();
    const neutronsError = validateNeutronsError();
    const atomicMassUError = validateAtomicMassUError();
    const atomicMassKgError = validateAtomicMassKgError();
    const massNumberError = validateMassNumberError();

    const protonsWarnings = validateProtonsWarning();
    const neutronsWarnings = validateNeutronsWarning();

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
            <div className="atomic-mass-calculator-page">
                <div className="calc-card">
                    {/* Inputs */}
                    <SimpleInputBar
                        label="Number of protons (Z)"
                        value={protons}
                        onChange={(e) => setProtons(e.target.value)}
                        type="number"
                        placeholder="1"
                        onWheel={preventScroll}
                        error={!!protonsError}
                        errorMessage={protonsError}
                        warningMessages={protonsWarnings}
                    />

                    <SimpleInputBar
                        label="Number of neutrons (N)"
                        value={neutrons}
                        onChange={(e) => setNeutrons(e.target.value)}
                        type="number"
                        placeholder="0"
                        onWheel={preventScroll}
                        error={!!neutronsError}
                        errorMessage={neutronsError}
                        warningMessages={neutronsWarnings}
                    />

                    {/* Outputs */}

                    <InputBarWithDropDownOption
                        label="Atomic mass"
                        value={getDisplayAtomicMass()}
                        onChange={() => { }}
                        unit={massUnit}
                        onUnitChange={(e) => setMassUnit(e.target.value)}
                        unitOptions={massOptions}
                        error={atomicMassUError}
                    />

                    {/* Atomic Mass (SI) with Exponent Dropdown and Suffix */}
                    <InputBarWithDropDownOption
                        label="Atomic mass (SI)"
                        value={getDisplaySiMass()}
                        onChange={() => { }}
                        unit={siExponent}
                        onUnitChange={(e) => setSiExponent(e.target.value)}
                        unitOptions={siOptions}
                        outerSuffix="kg"
                        error={atomicMassKgError}
                    />


                    <SimpleInputBar
                        label="Mass number"
                        value={massNumber}
                        onChange={() => { }}
                        className="simple-input-readonly"
                        error={!!massNumberError}
                        errorMessage={massNumberError}
                        onWheel={preventScroll}
                    />

                    {/* Symbol Display */}
                    <div style={{ marginTop: 12 }}>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#374151', marginBottom: 4 }}>Atomic symbol</div>
                        <div className="aze-notation">
                            <div className="aze-numbers">
                                <span className="mass-number">{massNumber}</span>
                                <span className="atomic-number">{protons}</span>
                            </div>
                            <div className="aze-symbol">
                                {symbol}
                            </div>
                        </div>
                        {isStable !== null && (
                            <div className="stability-text">
                                This is a {isStable ? 'stable' : 'unstable'} atom.
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="actions-section">
                        <div className="utility-buttons" style={{ width: '100%', flexDirection: 'row', justifyContent: 'center' }}>
                            <SimpleButton onClick={handleReload} variant="secondary">
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

export default AtomicMassCalculatorPage;
