import React, { useState, useEffect, useCallback } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, RotateCcw, Trash2, MoreHorizontal } from 'lucide-react';
import SimpleInputBar from '../../components/kit_components/SimpleInputBar';
import InputBarWithDropDownOption from '../../components/kit_components/InputBarWithDropDownOption';
import SimpleButton from '../../components/kit_components/SimpleButton';
import './DripFaucetCalculatorPage.css';

const DripFaucetCalculatorPage = () => {
    // --- Defaults ---
    const DEFAULTS = {
        numFaucets: '',
        dripRate: '',
        dripRateUnit: 'min', // drips per: min, hour, day
        timePeriod: '',
        timePeriodUnit: 'mos', // days, weeks, months, years
        wastedWaterUnit: 'liters' // liters, gallons, ml
    };

    // --- State ---
    const [numFaucets, setNumFaucets] = useState(DEFAULTS.numFaucets);
    const [dripRate, setDripRate] = useState(DEFAULTS.dripRate);
    const [dripRateUnit, setDripRateUnit] = useState(DEFAULTS.dripRateUnit);
    const [timePeriod, setTimePeriod] = useState(DEFAULTS.timePeriod);
    const [timePeriodUnit, setTimePeriodUnit] = useState(DEFAULTS.timePeriodUnit);
    const [wastedWaterUnit, setWastedWaterUnit] = useState(DEFAULTS.wastedWaterUnit);

    const [results, setResults] = useState({
        totalDrips: 0,
        wastedWater: 0,
        potentialBaths: 0
    });

    // --- Constants ---
    const DRIP_VOLUME_ML = 0.25; // 1 drip is approx 0.25ml
    const BATH_VOLUME_L = 151.416; // 40 US gallons approx
    const DAYS_IN_MONTH = 30.4375; // 365.25 / 12

    // --- Helper: Robust Numeric Parsing ---
    const parseNum = (val) => {
        if (!val) return 0;
        const cleanVal = val.toString().replace(/[, ]/g, '');
        const parsed = parseFloat(cleanVal);
        return isNaN(parsed) ? 0 : parsed;
    };

    // --- Calculation Logic ---
    const calculate = useCallback(() => {
        const n = parseNum(numFaucets);
        const rate = parseNum(dripRate);
        const period = parseNum(timePeriod);

        if (n <= 0 || rate <= 0 || period <= 0) return { totalDrips: 0, wastedWater: 0, potentialBaths: 0 };

        // 1. Normalize drip rate to drips per minute
        let dripsPerMin = rate;
        if (dripRateUnit === 'hour') dripsPerMin = rate / 60;
        if (dripRateUnit === 'day') dripsPerMin = rate / (60 * 24);

        // 2. Normalize time period to total minutes
        let totalMinutes = period * 24 * 60; // default days
        if (timePeriodUnit === 'weeks') totalMinutes = period * 7 * 24 * 60;
        if (timePeriodUnit === 'mos') totalMinutes = period * DAYS_IN_MONTH * 24 * 60;
        if (timePeriodUnit === 'years') totalMinutes = period * 365.25 * 24 * 60;

        // 3. Totals
        const totalDrips = n * dripsPerMin * totalMinutes;

        const wastedMl = totalDrips * DRIP_VOLUME_ML;
        const wastedLiters = wastedMl / 1000;

        // 4. Unit conversion for wasted water
        let wastedWater = wastedLiters;
        if (wastedWaterUnit === 'gallons') wastedWater = wastedLiters * 0.264172;
        if (wastedWaterUnit === 'ml') wastedWater = wastedMl;

        const potentialBaths = wastedLiters / BATH_VOLUME_L;

        return { totalDrips, wastedWater, potentialBaths };
    }, [numFaucets, dripRate, dripRateUnit, timePeriod, timePeriodUnit, wastedWaterUnit]);

    useEffect(() => {
        setResults(calculate());
    }, [calculate]);

    // --- Handlers ---
    const handleReset = () => {
        setNumFaucets(DEFAULTS.numFaucets);
        setDripRate(DEFAULTS.dripRate);
        setDripRateUnit(DEFAULTS.dripRateUnit);
        setTimePeriod(DEFAULTS.timePeriod);
        setTimePeriodUnit(DEFAULTS.timePeriodUnit);
        setWastedWaterUnit(DEFAULTS.wastedWaterUnit);
    };

    const handleReload = () => window.location.reload();

    const handleShare = () => {
        const text = `Drip Faucet Leak: I'm wasting ${results.wastedWater.toLocaleString('en-US', { maximumFractionDigits: 1 })} ${wastedWaterUnit} of water! Catch those drips!`;
        navigator.clipboard.writeText(text).then(() => alert("Result copied!"));
    };

    const articleContent = (
        <div className="article-wrapper">
            <h2 id="why-leak">Why does my faucet drip?</h2>
            <p>
                There are different reasons that make your faucet leak. Knowing the cause can help you fix the problem if you have all the required tools.
            </p>
            <p>The most common reasons are:</p>
            <ul>
                <li>Malfunctioning O-Ring;</li>
                <li>Broken washers;</li>
                <li>Corroded valve seats;</li>
                <li>Loose screws;</li>
                <li>Faucet aerator not working correctly;</li>
                <li>Improper installation/loose parts; and</li>
                <li>High water pressure (if you want to learn more about the pressure in your pipes, visit the hydrostatic pressure calculator).</li>
            </ul>
            <p>
                Those are the technical basics about leaking faucets. In one of the following sections, we explain how to fix a dripping faucet, but before that, let's answer the fundamental question: <strong>how much water does a dripping faucet waste?</strong>.
            </p>

            <h2 id="how-to-use">How to use the drip faucet calculator</h2>
            <p>
                To use our tool and see how much water a dripping faucet wastes, follow the below steps:
            </p>
            <ol>
                <li>
                    <strong>Specify how many faucets are leaking</strong> in your home or other buildings.
                </li>
                <li>
                    <strong>Count the drips</strong> that are falling from one faucet per minute. This is a similar concept to the one used in medicine: we talked about it in our drip rate calculator. You can also change the units in the drip faucet calculator if you want to count drips per second, hour, or over a longer time. In our considerations, one drip is equal to 1/4 ml.
                </li>
                <li>
                    <strong>Select the time period</strong> for which you want to calculate the waste.
                </li>
                <li>
                    <strong>See the water amount</strong> that will be wasted in that time period.
                </li>
                <li>
                    Read the <strong>number of baths equivalence</strong> for the calculated volume of wasted water. We assumed one bath takes 40 US gal (approximately 150 l) of water.
                </li>
            </ol>

            <h2 id="how-to-fix">How to fix a dripping faucet</h2>
            <p>
                The impact of a dripping faucet might be small compared to other things we waste, but it could still cause tremendous damage. Our drip faucet calculator can show you how much water could be lost with just a few drops of water per minute running from the faucet to the sink.
            </p>
            <p>Here are some tips for fixing the dripping faucet:</p>
            <ul>
                <li>
                    <strong>Identify the source of the leak.</strong> Check faucets, pipes, and connections for any signs of dripping or moisture. You can go through the list point by point in the <em>why does my faucet drip</em> section above.
                </li>
                <li>
                    <strong>Replace worn-out parts.</strong> Faulty washers, gaskets, or O-rings are common cause of leaks. Replace them to ensure a tight seal.
                </li>
                <li>
                    <strong>Regular maintenance.</strong> Periodically inspect your plumbing system for leaks and perform preventive maintenance to avoid future issues.
                </li>
                <li>
                    <strong>Call a professional.</strong> If you are unsure or unable to fix the leak yourself, contact a licensed plumber who can provide expert assistance.
                </li>
            </ul>

            <h2 id="waste-water">How do we waste water?</h2>
            <p>
                Water waste and pollution is a massive problem in the current world. The special term domestic wastewater is currently used to describe water from home usage combined with chemicals, food leftovers, human wastes, etc. The way we waste water and how we save it impacts the total amount of water that should be cleaned before it goes back to usage or the ocean.
            </p>
            <p>
                If you're interested in this topic, the wastewater calculator explains how the wastewater treatment plant works!
            </p>
            <p>Here are several major water wasters in your home and some tips to reduce water waste:</p>

            <h3>Toilet</h3>
            <ul>
                <li>Make sure you have a low-flow toilet.</li>
                <li>You can place a bottle of water in the toilet tank to reduce the amount of water per flush.</li>
                <li>Check if the toilet is not leaking.</li>
            </ul>

            <h3>Shower</h3>
            <ul>
                <li>If it is possible, you should decrease the time in the shower.</li>
                <li>Check if you can have a low-flow showerhead.</li>
            </ul>

            <h3>Washing machine</h3>
            <ul>
                <li>Try to use the full capacity of the machine.</li>
                <li>Check if you have an old washing machine that can use several times the amount of water in comparison to new models. If so, change it!</li>
            </ul>

            <h3>Leaking faucet</h3>
            <p>Check how to fix a dripping faucet section above.</p>
        </div>
    );

    return (
        <CalculatorLayout
            title="Drip Faucet Calculator"
            creators={[{ name: "Volha Chamlai" }]}
            reviewers={[
                { name: "Dominik Czernia", phd: true },
                { name: "Steven Wooding" }
            ]}
            lastUpdated="July 17, 2024"
            articleContent={articleContent}
            tocItems={[
                { label: "Why does my faucet drip?", id: "why-leak" },
                { label: "How to use", id: "how-to-use" },
                { label: "How to fix a dripping faucet", id: "how-to-fix" },
                { label: "How do we waste water?", id: "waste-water" }
            ]}
        >
            <div className="drip-faucet-calculator">
                <div className="calc-card">
                    {/* Number of Faucets */}
                    <SimpleInputBar
                        label="Number of leaking faucets"
                        value={numFaucets}
                        onChange={(e) => setNumFaucets(e.target.value)}
                        placeholder="1"
                    />

                    {/* Drip Rate */}
                    <InputBarWithDropDownOption
                        label="Drips from one faucet"
                        value={dripRate}
                        onChange={(e) => setDripRate(e.target.value)}
                        unit={dripRateUnit}
                        onUnitChange={(e) => setDripRateUnit(e.target.value)}
                        unitOptions={['min', 'hour', 'day']}
                        placeholder="60"
                        className="unit-divider-slashed"
                    />

                    {/* Time Period */}
                    <InputBarWithDropDownOption
                        label="Time period"
                        value={timePeriod}
                        onChange={(e) => setTimePeriod(e.target.value)}
                        unit={timePeriodUnit}
                        onUnitChange={(e) => setTimePeriodUnit(e.target.value)}
                        unitOptions={['days', 'weeks', 'mos', 'years']}
                        placeholder="30"
                    />

                    {/* Result: Number of Drips */}
                    <SimpleInputBar
                        label="Number of drips"
                        value={results.totalDrips.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        onChange={() => { }} // Readonly
                        className="result-space simple-input-readonly"
                        showInfoIcon={true}
                    />

                    {/* Result: Wasted Water */}
                    <InputBarWithDropDownOption
                        label="Wasted water"
                        value={results.wastedWater.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                        onChange={() => { }} // Readonly
                        unit={wastedWaterUnit}
                        onUnitChange={(e) => setWastedWaterUnit(e.target.value)}
                        unitOptions={[
                            { value: 'liters', label: 'l' },
                            { value: 'gallons', label: 'gal' },
                            { value: 'ml', label: 'ml' }
                        ]}
                    />

                    {/* Result: Potential Baths */}
                    <SimpleInputBar
                        label="Number of potential baths"
                        value={results.potentialBaths.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                        onChange={() => { }}
                        className="simple-input-readonly"
                        showInfoIcon={true}
                    />

                    {/* Actions */}
                    <div className="actions-section">
                        <div className="utility-buttons" style={{ width: '100%', flexDirection: 'row', justifyContent: 'center' }}>
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

export default DripFaucetCalculatorPage;
