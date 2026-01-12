import React, { useState } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { RotateCcw, Trash2 } from 'lucide-react';
import InputBarWithDropDownOption from '../../components/kit_components/InputBarWithDropDownOption';
import SimpleButton from '../../components/kit_components/SimpleButton';
import './CellDilutionCalculatorPage.css';

const CellDilutionCalculatorPage = () => {
    // --- Constants ---
    // User requested: [microliter (ul), milliliter (ml), centiliter (cl), liter (1)]
    const CONC_UNITS = [
        { value: 'uL', label: 'microliter (µl)' },
        { value: 'mL', label: 'milliliter (ml)' },
        { value: 'cL', label: 'centiliter (cl)' },
        { value: 'L', label: 'liter (l)' }
    ];

    const VOL_UNITS = [
        { value: 'L', label: 'Liters (L)' },
        { value: 'mL', label: 'milliliters (mL)' },
        { value: 'uL', label: 'microliters (µL)' },
        { value: 'nL', label: 'nanoliters (nL)' }
    ];

    // Factors relative to "cells / mL" (Base Unit = 1)
    // 1 cell/uL = 1000 cells/mL -> Factor 1000
    // 1 cell/mL = 1 cells/mL -> Factor 1
    // 1 cell/cL = 1 cell per 10 mL = 0.1 cells/mL -> Factor 0.1
    // 1 cell/L = 1 cell per 1000 mL = 0.001 cells/mL -> Factor 0.001
    const CONC_FACTORS = {
        'uL': 1000,
        'mL': 1,
        'cL': 0.1,
        'L': 0.001
    };

    const VOL_FACTORS = {
        'L': 1000, // Base unit mL? Let's check logic.
        // If Base vol is mL, then L factor is 1000.
        'mL': 1,
        'uL': 0.001,
        'nL': 0.000001
    };

    // --- State ---
    const [values, setValues] = useState({
        c1: '', v1: '', c2: '', v2: ''
    });

    // Units state
    const [units, setUnits] = useState({
        c1: 'mL', v1: 'mL', c2: 'mL', v2: 'mL'
    });

    const [errors, setErrors] = useState({});

    const handleReset = () => {
        setValues({ c1: '', v1: '', c2: '', v2: '' });
        setUnits({ c1: 'mL', v1: 'mL', c2: 'mL', v2: 'mL' });
        setErrors({});
    };

    // --- Helpers ---
    const getBaseValue = (val, unit, type) => {
        const factor = type === 'conc' ? CONC_FACTORS[unit] : VOL_FACTORS[unit];
        return parseFloat(val) * factor;
    };

    const fromBaseValue = (val, unit, type) => {
        const factor = type === 'conc' ? CONC_FACTORS[unit] : VOL_FACTORS[unit];
        return val / factor;
    };

    // --- Core Logic ---
    const validate = (newValues) => {
        const newErrors = {};
        if (newValues.c1 && parseFloat(newValues.c1) <= 0) newErrors.c1 = "Initial concentration must be positive!";
        if (newValues.v1 && parseFloat(newValues.v1) <= 0) newErrors.v1 = "Volume of suspension must be positive!";
        if (newValues.c2 && parseFloat(newValues.c2) <= 0) newErrors.c2 = "Final concentration must be positive!";
        if (newValues.v2 && parseFloat(newValues.v2) <= 0) newErrors.v2 = "Final volume must be positive!";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const calculate = (target, newVals = values, newUnits = units) => {
        // Find unknown
        const filled = ['c1', 'v1', 'c2', 'v2'].filter(k => newVals[k] !== '' && !isNaN(parseFloat(newVals[k])));

        if (filled.length === 3) {
            const missing = ['c1', 'v1', 'c2', 'v2'].find(k => !filled.includes(k));

            // Convert filled to base
            const base = {};
            filled.forEach(k => {
                const type = (k === 'c1' || k === 'c2') ? 'conc' : 'vol';
                base[k] = getBaseValue(newVals[k], newUnits[k], type);
            });

            let resBase = 0;
            // Solve equations C1*V1 = C2*V2  (Base units: cells/mL * mL = cells)
            // Units check: (cells/mL) * mL = cells. Consistent.

            if (missing === 'v1') resBase = (base.c2 * base.v2) / base.c1;
            else if (missing === 'c1') resBase = (base.c2 * base.v2) / base.v1;
            else if (missing === 'v2') resBase = (base.c1 * base.v1) / base.c2;
            else if (missing === 'c2') resBase = (base.c1 * base.v1) / base.v2;

            if (resBase > 0 && isFinite(resBase)) {
                const type = (missing === 'c1' || missing === 'c2') ? 'conc' : 'vol';
                const resVal = fromBaseValue(resBase, newUnits[missing], type);

                return { [missing]: parseFloat(resVal.toPrecision(6)).toString() };
            }
        }
        return {};
    };

    const handleChange = (field, value) => {
        const newValues = { ...values, [field]: value };
        validate(newValues);
        const derived = calculate(field, newValues, units);
        setValues({ ...newValues, ...derived });
    };

    const handleUnitChange = (field, unit) => {
        const newUnits = { ...units, [field]: unit };
        setUnits(newUnits);
        const derived = calculate(field, values, newUnits);
        setValues({ ...values, ...derived });
    };

    const handleReload = () => window.location.reload();

    const articleContent = (
        <div className="article-wrapper">
            <h2 id="dilution">What is the dilution formula?</h2>
            <p>
                Dilution is the process of decreasing the concentration of a solute in a solution, usually simply by mixing with more solvent like water. To dilute a solution means to add more solvent without the addition of more solute.
            </p>
            <p>The standard dilution equation is:</p>
            <div className="formula-block">
                $C_1 V_1 = C_2 V_2$
            </div>
            <p>Where:</p>
            <ul>
                <li>$C_1$ = Initial concentration (Stock)</li>
                <li>$V_1$ = Initial volume (Volume of stock to take)</li>
                <li>$C_2$ = Final concentration (Target)</li>
                <li>$V_2$ = Final volume (Target)</li>
            </ul>
            <div className="formula-block">
                {`$V_1 = \\frac{C_2 V_2}{C_1}$`}
            </div>
        </div>
    );

    return (
        <CalculatorLayout
            title="Cell Dilution Calculator"
            creators={[{ name: "Julia Kopczyńska", phd: true }]}
            reviewers={[{ name: "Anna Szczepanek", phd: true }, { name: "Steven Wooding" }]}
            lastUpdated="June 11, 2024"
            articleContent={articleContent}
            tocItems={[
                { label: "Dilution Formula", id: "dilution" }
            ]}
        >
            <div className="cell-dilution-calculator">
                <div className="calc-card">
                    {/* C1: Stock Concentration */}
                    <InputBarWithDropDownOption
                        label="Initial concentration"
                        value={values.c1}
                        onChange={(e) => handleChange('c1', e.target.value)}
                        unit={units.c1}
                        onUnitChange={(e) => handleUnitChange('c1', e.target.value)}
                        unitOptions={CONC_UNITS}
                        placeholder="0"
                        error={errors.c1}
                        unitPrefix="cells /"
                    />

                    {/* V1: Stock Volume */}
                    <InputBarWithDropDownOption
                        label="Volume for suspension"
                        value={values.v1}
                        onChange={(e) => handleChange('v1', e.target.value)}
                        unit={units.v1}
                        onUnitChange={(e) => handleUnitChange('v1', e.target.value)}
                        unitOptions={VOL_UNITS}
                        placeholder="0"
                        error={errors.v1}
                    />

                    {/* C2: Final Concentration */}
                    <InputBarWithDropDownOption
                        label="Final concentration"
                        value={values.c2}
                        onChange={(e) => handleChange('c2', e.target.value)}
                        unit={units.c2}
                        onUnitChange={(e) => handleUnitChange('c2', e.target.value)}
                        unitOptions={CONC_UNITS}
                        placeholder="0"
                        error={errors.c2}
                        unitPrefix="cells /"
                    />

                    {/* V2: Final Volume */}
                    <InputBarWithDropDownOption
                        label="Final volume"
                        value={values.v2}
                        onChange={(e) => handleChange('v2', e.target.value)}
                        unit={units.v2}
                        onUnitChange={(e) => handleUnitChange('v2', e.target.value)}
                        unitOptions={VOL_UNITS}
                        placeholder="0"
                        error={errors.v2}
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

                    <div className="feedback-section">
                        <p>Did we solve your problem today?</p>
                        <div className="feedback-btngroup">
                            <SimpleButton variant="secondary" style={{ width: 80 }}>Yes</SimpleButton>
                            <SimpleButton variant="secondary" style={{ width: 80 }}>No</SimpleButton>
                        </div>
                    </div>
                </div>
            </div>
        </CalculatorLayout>
    );
};

export default CellDilutionCalculatorPage;
