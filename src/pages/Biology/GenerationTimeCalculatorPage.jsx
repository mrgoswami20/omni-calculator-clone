import React, { useState, useEffect, useCallback } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { RotateCcw, Trash2 } from 'lucide-react';
import SimpleInputBar from '../../components/kit_components/SimpleInputBar';
import InputBarWithDropDownOption from '../../components/kit_components/InputBarWithDropDownOption';
import SimpleButton from '../../components/kit_components/SimpleButton';
import './GenerationTimeCalculatorPage.css';

const GenerationTimeCalculatorPage = () => {
    // --- Constants ---
    const TIME_UNITS = [
        { value: 'sec', label: 'seconds (sec)' },
        { value: 'min', label: 'minutes (min)' },
        { value: 'hr', label: 'hours (hrs)' },
        { value: 'day', label: 'days (days)' },
        { value: 'wk', label: 'weeks (wks)' },
        { value: 'mo', label: 'months (mos)' },
        { value: 'yr', label: 'years (yrs)' }
    ];

    // Using standard conversions closer to original intent
    const TO_MINUTES = {
        'sec': 1 / 60,
        'min': 1,
        'hr': 60,
        'day': 1440,     // 24 * 60
        'wk': 10080,     // 7 * 24 * 60
        'mo': 43800,     // 30.4167 days approx (Standard: 365/12 * 1440? or 30 days. Let's use 30.4167 days * 1440 = 43800 for consistency with 365 days/yr)
        // Actually 365.25 * 1440 / 12 = 43830. 
        // Let's use 43800 (30.4166 days) roughly. 
        // Or simplify to 30 days = 43200?
        // Let's stick to 43830 (365.25 days / 12)
        'yr': 525960     // 365.25 * 1440
    };

    // --- State ---
    const [n0, setN0] = useState('');
    const [nt, setNt] = useState('');
    const [time, setTime] = useState('');
    const [timeUnit, setTimeUnit] = useState('hr');
    const [rate, setRate] = useState('');
    const [rateUnit, setRateUnit] = useState('hr');
    const [doublingTime, setDoublingTime] = useState('');
    const [doublingTimeUnit, setDoublingTimeUnit] = useState('hr');

    // --- Calculation Logic ---
    const toMin = (val, unit) => {
        const v = parseFloat(val);
        if (isNaN(v)) return null;
        return v * TO_MINUTES[unit];
    };

    const fromMin = (valMin, unit) => {
        if (valMin === null) return '';
        return valMin / TO_MINUTES[unit];
    };

    const calculate = useCallback(() => {
        const valN0 = parseFloat(n0);
        const valNt = parseFloat(nt);
        const valTimeMin = toMin(time, timeUnit);

        let calculatedTdMin = null;
        let calculatedR_per_min = null;

        // 1. Calculate Td and r from N0, Nt, t
        if (!isNaN(valN0) && !isNaN(valNt) && valTimeMin !== null && valTimeMin > 0) {
            if (valNt > 0 && valN0 > 0) {
                // Formula: Td = t * ln(2) / ln(Nt/N0)
                const ratio = valNt / valN0;
                if (ratio > 1) { // Growth must be positive for valid Td
                    calculatedTdMin = valTimeMin * Math.log(2) / Math.log(ratio);
                    // r (per min) = (Nt/N0)^(1/t) - 1
                    calculatedR_per_min = Math.pow(ratio, 1 / valTimeMin) - 1;
                }
            }
        }

        return { tdMin: calculatedTdMin, rPerMin: calculatedR_per_min };

    }, [n0, nt, time, timeUnit]);

    useEffect(() => {
        const { tdMin, rPerMin } = calculate();

        // Update Doubling Time
        if (tdMin !== null) {
            setDoublingTime(fromMin(tdMin, doublingTimeUnit).toFixed(2));
        } else {
            // Only clear if inputs are present but invalid calc, or rely on user clear
            if (n0 && nt && time) setDoublingTime('');
        }

        // Update Growth Rate
        if (rPerMin !== null) {
            const factor = TO_MINUTES[rateUnit];
            const r_target = Math.pow(1 + rPerMin, factor) - 1;
            setRate(r_target.toFixed(4));
        } else {
            if (n0 && nt && time) setRate('');
        }

    }, [calculate, doublingTimeUnit, rateUnit, n0, nt, time]);


    // --- Handlers ---
    const handleReset = () => {
        setN0('');
        setNt('');
        setTime('');
        setRate('');
        setDoublingTime('');
        setTimeUnit('hr');
        setRateUnit('hr');
        setDoublingTimeUnit('hr');
    };

    const handleReload = () => window.location.reload();

    const articleContent = (
        <div className="article-wrapper">
            <h2 id="exponential">What is exponential growth?</h2>
            <p>
                Exponential growth describes a process where the quantity increases at a rate proportional to its current value. In biology, this is common in bacterial populations where organisms divide via binary fission.
            </p>

            <h2 id="formula">Formulas</h2>
            <p>The core equation for exponential growth is:</p>
            <p className="formula-block">
                $N(t) = N(0) \cdot (1 + r)^t$
            </p>
            <p>Where:</p>
            <ul>
                <li>$N(t)$ is the population at time $t$.</li>
                <li>$N(0)$ is the initial population.</li>
                <li>$r$ is the growth rate per time unit.</li>
                <li>$t$ is the elapsed time.</li>
            </ul>

            <h2 id="generation">Generation Time (Doubling Time)</h2>
            <p>
                The generation time ($t_d$), or doubling time, is the time it takes for the population to double. It is calculated as:
            </p>
            <p className="formula-block">
                {`$t_d = \\frac{t \\cdot \\ln(2)}{\\ln(N(t)/N(0))}$`}
            </p>
        </div>
    );

    return (
        <CalculatorLayout
            title="Generation Time Calculator"
            creators={[{ name: "Davide Borchia" }]}
            reviewers={[{ name: "Hanna Pamula", phd: true }, { name: "Jack Bowater" }]}
            lastUpdated="June 11, 2024"
            articleContent={articleContent}
            tocItems={[
                { label: "What is exponential growth?", id: "exponential" },
                { label: "Formulas", id: "formula" },
                { label: "Generation Time", id: "generation" }
            ]}
        >
            <div className="generation-time-calculator">
                <div className="calc-card">
                    {/* N(0) */}
                    <SimpleInputBar
                        label="Initial number of bacteria — N(0)"
                        value={n0}
                        onChange={(e) => setN0(e.target.value)}
                        placeholder="100"
                    />

                    {/* N(t) */}
                    <SimpleInputBar
                        label="Final number of bacteria — N(t)"
                        value={nt}
                        onChange={(e) => setNt(e.target.value)}
                        placeholder="400"
                    />

                    {/* Time */}
                    <InputBarWithDropDownOption
                        label="Elapsed time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        unit={timeUnit}
                        onUnitChange={(e) => setTimeUnit(e.target.value)}
                        unitOptions={TIME_UNITS}
                        placeholder="2"
                    />

                    {/* Growth Rate (r) - Result/Input */}
                    <SimpleInputBar
                        label="Growth rate (r)"
                        value={rate}
                        onChange={(e) => setRate(e.target.value)}
                        placeholder="0.0"
                    />

                    {/* Doubling Time (Td) - Result */}
                    <InputBarWithDropDownOption
                        label="Doubling time (Td)"
                        value={doublingTime}
                        onChange={(e) => setDoublingTime(e.target.value)}
                        unit={doublingTimeUnit}
                        onUnitChange={(e) => setDoublingTimeUnit(e.target.value)}
                        unitOptions={TIME_UNITS}
                        placeholder="1.0"
                        className="result-space"
                        showInfoIcon={true}
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

export default GenerationTimeCalculatorPage;
