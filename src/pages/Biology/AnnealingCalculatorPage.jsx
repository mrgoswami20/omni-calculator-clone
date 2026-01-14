import React, { useState, useEffect, useCallback } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { RotateCcw, Trash2 } from 'lucide-react';
import SimpleInputBar from '../../components/kit_components/SimpleInputBar';
import InputBarWithDropDownOption from '../../components/kit_components/InputBarWithDropDownOption';
import SimpleButton from '../../components/kit_components/SimpleButton';
import './AnnealingCalculatorPage.css';

const AnnealingCalculatorPage = () => {
    // --- Constants ---
    const DEFAULTS = {
        primerTm: '',
        primerTmUnit: 'C',
        targetTm: '',
        targetTmUnit: 'C',
        resultUnit: 'C'
    };

    // --- State ---
    const [primerTm, setPrimerTm] = useState(DEFAULTS.primerTm);
    const [primerTmUnit, setPrimerTmUnit] = useState(DEFAULTS.primerTmUnit);
    const [targetTm, setTargetTm] = useState(DEFAULTS.targetTm);
    const [targetTmUnit, setTargetTmUnit] = useState(DEFAULTS.targetTmUnit);
    const [result, setResult] = useState(null);
    const [resultUnit, setResultUnit] = useState(DEFAULTS.resultUnit);

    // --- Helpers ---
    const toCelsius = (val, unit) => {
        const num = parseFloat(val);
        if (isNaN(num)) return null;
        if (unit === 'C') return num;
        if (unit === 'F') return (num - 32) * 5 / 9;
        if (unit === 'K') return num - 273.15;
        return num;
    };

    const fromCelsius = (celsius, unit) => {
        if (celsius === null) return null;
        if (unit === 'C') return celsius;
        if (unit === 'F') return (celsius * 9 / 5) + 32;
        if (unit === 'K') return celsius + 273.15;
        return celsius;
    };

    const temperatureOptions = [
        { value: 'C', label: '°C' },
        { value: 'F', label: '°F' },
        { value: 'K', label: 'K' }
    ];

    // --- Calculation Logic ---
    const calculate = useCallback(() => {
        const pC = toCelsius(primerTm, primerTmUnit);
        const tC = toCelsius(targetTm, targetTmUnit);

        if (pC === null || tC === null) {
            return null;
        }

        // Standard Formula: Ta = 0.3 * Tm(primer) + 0.7 * Tm(product) - 14.9
        // This is a common optimization formula (e.g., for Taq polymerase)
        const annealingC = (0.3 * pC) + (0.7 * tC) - 14.9;

        return annealingC;
    }, [primerTm, primerTmUnit, targetTm, targetTmUnit]);

    useEffect(() => {
        const resC = calculate();
        // Update result only if valid calculation
        if (resC !== null) {
            setResult(fromCelsius(resC, resultUnit));
        } else {
            setResult(null);
        }
    }, [calculate, resultUnit]);

    // --- Handlers ---
    const handleReset = () => {
        setPrimerTm(DEFAULTS.primerTm);
        setPrimerTmUnit(DEFAULTS.primerTmUnit);
        setTargetTm(DEFAULTS.targetTm);
        setTargetTmUnit(DEFAULTS.targetTmUnit);
        setResultUnit(DEFAULTS.resultUnit);
        setResult(null);
    };

    const handleReload = () => window.location.reload();

    const articleContent = (
        <div className="article-wrapper">
            <h2 id="intro">Annealing Temperature in PCR</h2>
            <p>
                The <strong>annealing temperature ($T_a$)</strong> is a critical parameter in the Polymerase Chain Reaction (PCR). It determines the specificity of the reaction. If the temperature is too high, primers may not bind to the template DNA. If it's too low, primers may bind non-specifically, leading to amplification of unwanted DNA sequences.
            </p>

            <h2 id="formula">How is it calculated?</h2>
            <p>
                A simpler rule of thumb often used is $T_a = T_m - 5°C$, but more accurate results for standard conditions are often achieved using the formula:
            </p>
            <p style={{ textAlign: 'center', fontWeight: 'bold', margin: '24px 0' }}>
                $T_a = 0.3 \times T_m(primer) + 0.7 \times T_m(product) - 14.9$
            </p>
            <p>
                Where $T_m$ is the melting temperature. This calculator estimates the optimal annealing temperature based on the melting temperatures of your primer and product (template).
            </p>

            <h2 id="tips">PCR Optimization Tips</h2>
            <ul>
                <li><strong>Start Gradient:</strong> If possible, run a gradient PCR centered around the calculated $T_a$ to find the absolute optimum.</li>
                <li><strong>Primer Design:</strong> Ensure your forward and reverse primers have similar $T_m$ values (within 2-3°C).</li>
                <li><strong>Additives:</strong> For GC-rich templates, consider using additives like DMSO or Betaine if standard conditions require very high temperatures.</li>
            </ul>
        </div>
    );

    return (
        <CalculatorLayout
            title="Annealing Temperature Calculator"
            creators={[{ name: "Davide Borchia" }]}
            reviewers={[
                { name: "Anna Szczepanek", phd: true },
                { name: "Rijk de Wet" }
            ]}
            lastUpdated="November 19, 2024"
            articleContent={articleContent}
            tocItems={[
                { label: "Introduction to PCR", id: "intro" },
                { label: "Calculation Formula", id: "formula" },
                { label: "Optimization Tips", id: "tips" }
            ]}
        >
            <div className="annealing-calculator">
                <div className="calc-card">
                    {/* Primer Tm */}
                    <InputBarWithDropDownOption
                        label="Primer melting temperature"
                        value={primerTm}
                        onChange={(e) => setPrimerTm(e.target.value)}
                        unit={primerTmUnit}
                        onUnitChange={(e) => setPrimerTmUnit(e.target.value)}
                        unitOptions={temperatureOptions}
                        placeholder="55"
                        error={
                            primerTm !== '' && toCelsius(primerTm, primerTmUnit) <= 0
                                ? "The melting temperature must be positive."
                                : null
                        }
                    />

                    {/* Target Tm */}
                    <InputBarWithDropDownOption
                        label="Target melting temperature"
                        value={targetTm}
                        onChange={(e) => setTargetTm(e.target.value)}
                        unit={targetTmUnit}
                        onUnitChange={(e) => setTargetTmUnit(e.target.value)}
                        unitOptions={temperatureOptions}
                        placeholder="72"
                        error={
                            targetTm !== '' && toCelsius(targetTm, targetTmUnit) <= 0
                                ? "The melting temperature must be positive."
                                : null
                        }
                    />

                    {/* Result */}
                    <InputBarWithDropDownOption
                        label="Annealing temperature (Ta)"
                        value={result !== null ? result.toLocaleString('en-US', { maximumFractionDigits: 2 }) : ''}
                        onChange={() => { }} // Readonly
                        unit={resultUnit}
                        onUnitChange={(e) => setResultUnit(e.target.value)}
                        unitOptions={temperatureOptions}
                        className="result-space simple-input-readonly"
                        showInfoIcon={true}
                        error={
                            result !== null && toCelsius(result, resultUnit) <= 0
                                ? "The annealing temperature must be positive."
                                : null
                        }
                        warning={
                            result !== null && resultUnit === 'C' && (result < 50 || result > 65)
                                ? "The annealing temperature is out of the suggested range of 50 to 65 °C."
                                : (result !== null && resultUnit !== 'C' && (toCelsius(result, resultUnit) < 50 || toCelsius(result, resultUnit) > 65)
                                    ? "The annealing temperature is out of the suggested range of 50 to 65 °C."
                                    : null
                                )
                        }
                    />

                    {/* Actions */}
                    <div className="actions-section">
                        <div className="utility-buttons">
                            <SimpleButton onClick={handleReload} variant="secondary">
                                <RotateCcw size={16} style={{ marginRight: 8 }} /> Reload calculator
                            </SimpleButton>
                            <SimpleButton onClick={handleReset} variant="secondary">
                                <Trash2 size={16} style={{ marginRight: 8 }} /> Clear all changes
                            </SimpleButton>
                        </div>
                    </div>

                </div>
            </div>
        </CalculatorLayout>
    );
};

export default AnnealingCalculatorPage;
