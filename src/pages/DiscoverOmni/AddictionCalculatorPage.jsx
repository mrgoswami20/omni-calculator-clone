import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, RotateCcw, Info, ChevronDown } from 'lucide-react';
import './AddictionCalculatorPage.css';

const AddictionCalculatorPage = () => {
    // Inputs
    const [addictionType, setAddictionType] = useState('Cigarettes');
    const [lifeLostRaw, setLifeLostRaw] = useState('14.1');
    const [lifeLostUnit, setLifeLostUnit] = useState('min');

    // Times Used
    const [timesUsed, setTimesUsed] = useState('');
    const [timesUsedUnit, setTimesUsedUnit] = useState('day'); // day, week, month, year

    // Age Started
    const [ageStarted, setAgeStarted] = useState('');
    const [ageStartedUnit, setAgeStartedUnit] = useState('years');

    const [country, setCountry] = useState('United States');

    // Outputs
    const [nonAddictLifeExpectancy, setNonAddictLifeExpectancy] = useState(79.68);
    const [nonAddictLifeExpectancyUnit, setNonAddictLifeExpectancyUnit] = useState('years / months');

    const [addictLifeExpectancy, setAddictLifeExpectancy] = useState(null);
    const [addictLifeExpectancyUnit, setAddictLifeExpectancyUnit] = useState('hours'); // Default from screenshot? Or years? Screenshot shows 'hrs', 'yrs', etc.

    const [addictionDuration, setAddictionDuration] = useState(null);
    const [addictionDurationUnit, setAddictionDurationUnit] = useState('years / months');

    const [totalLifeLost, setTotalLifeLost] = useState(null);
    const [totalLifeLostUnit, setTotalLifeLostUnit] = useState('years / months / days');


    // Constants
    const addictionPresets = {
        'Alcoholic Drinks': { loss: 15, unit: 'min' },
        'Cigarettes': { loss: 14.1, unit: 'min' },
        'Cocaine lines': { loss: 5.0, unit: 'hrs' },
        'Meth hits': { loss: 11.0, unit: 'hrs' },
        'Methadone Pills': { loss: 13.0, unit: 'hrs' },
        'Heroin shots': { loss: 22.0, unit: 'hrs' }
    };

    // Comprehensive Country List (Top 50 + generic fallback)
    const countries = {
        "United States": 79.69, "Afghanistan": 65.98, "Albania": 78.96, "Algeria": 77.50, "Argentina": 77.17,
        "Australia": 83.94, "Austria": 82.05, "Bangladesh": 74.3, "Belgium": 82.17, "Brazil": 76.57,
        "Canada": 82.96, "China": 78.08, "Colombia": 77.87, "Denmark": 81.40, "Egypt": 72.54,
        "Ethiopia": 68.7, "Finland": 82.48, "France": 83.13, "Germany": 81.88, "Greece": 82.80,
        "India": 70.42, "Indonesia": 72.3, "Iran": 77.33, "Iraq": 71.34, "Ireland": 82.81,
        "Israel": 83.49, "Italy": 84.01, "Japan": 84.62, "Kenya": 67.5, "South Korea": 83.50,
        "Mexico": 75.41, "Netherlands": 82.78, "New Zealand": 82.80, "Nigeria": 55.75, "Norway": 83.20,
        "Pakistan": 67.79, "Philippines": 71.66, "Poland": 79.27, "Russia": 72.99, "Saudi Arabia": 75.69,
        "South Africa": 64.88, "Spain": 83.99, "Sweden": 83.33, "Switzerland": 84.38, "Thailand": 77.74,
        "Turkey": 78.26, "Ukraine": 72.50, "United Kingdom": 81.77, "Vietnam": 75.77
    };

    // Update preset
    useEffect(() => {
        if (addictionPresets[addictionType]) {
            setLifeLostRaw(addictionPresets[addictionType].loss);
            setLifeLostUnit(addictionPresets[addictionType].unit);
        }
    }, [addictionType]);

    // Update Life Expectancy on Country Change
    useEffect(() => {
        if (countries[country]) {
            setNonAddictLifeExpectancy(countries[country]);
        }
    }, [country]);


    // --- Helper: Convert to Years ---
    const toYears = (val, unit) => {
        const v = parseFloat(val);
        if (isNaN(v)) return 0;
        switch (unit) {
            case 'sec': return v / (3600 * 24 * 365.25);
            case 'min': return v / (60 * 24 * 365.25);
            case 'hrs': return v / (24 * 365.25);
            case 'days': return v / 365.25;
            case 'weeks': return v / 52.1775;
            case 'months': return v / 12;
            case 'years': return v;
            default: return v;
        }
    };

    // --- Helper: Format Logic ---
    const formatValue = (valInYears, unitType) => {
        if (valInYears === null || isNaN(valInYears)) return '-';

        const y = Math.floor(valInYears);
        const remY = valInYears % 1;
        const m = Math.floor(remY * 12);
        const remM = (remY * 12) % 1;
        const d = Math.floor(remM * 30.437); // approx days in month
        const remD = (remM * 30.437) % 1;
        const h = Math.floor(remD * 24);
        const remH = (remD * 24) % 1;
        const min = Math.floor(remH * 60);

        // For simple units
        const totalSec = valInYears * 365.25 * 24 * 3600;
        const totalMin = valInYears * 365.25 * 24 * 60;
        const totalHrs = valInYears * 365.25 * 24;
        const totalDays = valInYears * 365.25;
        const totalWeeks = valInYears * 52.1775;
        const totalMonths = valInYears * 12;

        const formatNumber = (num) => {
            // Show up to 1 decimal if not integer, otherwise no decimals
            return num % 1 === 0 ? num.toLocaleString() : num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 });
        };

        switch (unitType) {
            case 'seconds': return `${formatNumber(totalSec)} sec`;
            case 'minutes': return `${formatNumber(totalMin)} min`;
            case 'hours': return `${formatNumber(totalHrs)} hrs`;
            case 'days': return `${formatNumber(totalDays)} days`;
            case 'weeks': return `${formatNumber(totalWeeks)} wks`;
            case 'months': return `${formatNumber(totalMonths)} mos`;
            case 'years': return `${formatNumber(valInYears)} yrs`;

            case 'years / months':
                return <><span className="val">{y}</span><span className="lbl">yrs</span><span className="sep">|</span><span className="val">{m}</span><span className="lbl">mos</span></>;
            case 'years / months / days':
                return <><span className="val">{y}</span><span className="lbl">yrs</span><span className="sep">|</span><span className="val">{m}</span><span className="lbl">mos</span><span className="sep">|</span><span className="val">{d}</span><span className="lbl">days</span></>;
            case 'days / hours':
                return <><span className="val">{Math.floor(totalDays)}</span><span className="lbl">days</span><span className="sep">|</span><span className="val">{Math.floor((totalDays % 1) * 24)}</span><span className="lbl">hrs</span></>;
            case 'weeks / days':
                return <><span className="val">{Math.floor(totalWeeks)}</span><span className="lbl">wks</span><span className="sep">|</span><span className="val">{Math.floor((totalWeeks % 1) * 7)}</span><span className="lbl">days</span></>;

            default: return valInYears.toFixed(2);
        }
    };


    // --- Calculation ---
    useEffect(() => {
        const usagePerYear = parseFloat(timesUsed) * (timesUsedUnit === 'day' ? 365.25 : (timesUsedUnit === 'week' ? 52.1775 : (timesUsedUnit === 'month' ? 12 : 1)));
        // Note: Logic simplified for daily input. If 'timesUsed' is simple /day.
        // User screenshot shows '/ day' as suffix, but maybe it's selectable? 
        // "Times used ... / day". It seems likely fixed to /day or simple select. I'll stick to /day for now or add simple multiplier.
        // Actually, screenshot just shows "/ day". I'll assume standard daily usage.

        const startAgeYr = toYears(ageStarted, ageStartedUnit);

        // Loss per dose in years
        let lossPerDoseYr = 0;
        if (lifeLostUnit.includes('sec')) lossPerDoseYr = parseFloat(lifeLostRaw) / (3600 * 24 * 365.25);
        else if (lifeLostUnit.includes('min')) lossPerDoseYr = parseFloat(lifeLostRaw) / (60 * 24 * 365.25);
        else if (lifeLostUnit.includes('hrs')) lossPerDoseYr = parseFloat(lifeLostRaw) / (24 * 365.25);

        // Total daily usage
        const dailyUsage = parseFloat(timesUsed) || 0; // Assuming input is per day

        const R = lossPerDoseYr * dailyUsage * 365.25; // Loss per year of life lived

        if (dailyUsage > 0 && startAgeYr > 0 && R > 0) {
            const numer = nonAddictLifeExpectancy + (startAgeYr * R);
            const denom = 1 + R;
            const L_addict = numer / denom;

            setAddictLifeExpectancy(L_addict);
            setAddictionDuration(L_addict - startAgeYr);
            setTotalLifeLost(nonAddictLifeExpectancy - L_addict);
        } else {
            setAddictLifeExpectancy(null);
            setAddictionDuration(null);
            setTotalLifeLost(null);
        }

    }, [timesUsed, ageStarted, ageStartedUnit, lifeLostRaw, lifeLostUnit, nonAddictLifeExpectancy]);


    const creators = [
        { name: "Mateusz Mucha", role: "" },
        { name: "Mariamy Chrdileli", role: "" },
    ];

    const reviewers = [
        { name: "Steven Wooding", role: "" },
        { name: "Jack Bowater", role: "" },
        { name: "Lucja Zaborowska", role: "MD, PhD candidate" },
    ];

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

    // Helper to render complex select options
    const renderUnitOptions = (types) => {
        // Types: time_short, time_long, time_mixed
        return (
            <>
                <optgroup label="Time">
                    <option value="seconds">seconds (sec)</option>
                    <option value="minutes">minutes (min)</option>
                    <option value="hours">hours (hrs)</option>
                    <option value="days">days (days)</option>
                    <option value="weeks">weeks (wks)</option>
                    <option value="months">months (mos)</option>
                    <option value="years">years (yrs)</option>
                </optgroup>
                <optgroup label="Composite">
                    <option value="years / months">years / months</option>
                    <option value="years / months / days">years / months / days</option>
                    <option value="weeks / days">weeks / days</option>
                    <option value="days / hours">days / hours</option>
                </optgroup>
            </>
        );
    };

    return (
        <CalculatorLayout
            title="Addiction Calculator"
            creators={creators}
            reviewers={reviewers}
            tocItems={["Addiction and substance use disorder", "Drugs outlined", "How does it work", "Sources & data"]}
            articleContent={<p>Addiction not only causes a great deal of suffering...</p>}
            similarCalculators={183}
        >
            <div className="addiction-calculator">
                {/* Addiction Type */}
                <div className="input-group">
                    <div className="label-row"><label>Addiction type</label><span className="more-options">...</span></div>
                    <div className="select-wrapper">
                        <select className="calc-select main-select" value={addictionType} onChange={(e) => setAddictionType(e.target.value)}>
                            {Object.keys(addictionPresets).map(k => <option key={k} value={k}>{k}</option>)}
                        </select>
                        <ChevronDown className="select-arrow" size={16} />
                    </div>
                </div>

                {/* Life Lost */}
                <div className="input-group">
                    <div className="label-row"><label>Life lost <Info size={14} className="info-icon" /></label><span className="more-options">...</span></div>
                    <div className="input-with-unit">
                        <input type="number" className="calc-input" value={lifeLostRaw} onChange={(e) => setLifeLostRaw(e.target.value)} />
                        <div className="unit-select-wrapper">
                            <select className="unit-select" value={lifeLostUnit} onChange={(e) => setLifeLostUnit(e.target.value)}>
                                <option value="min">minutes (min)</option>
                                <option value="sec">seconds (sec)</option>
                                <option value="hrs">hours (hrs)</option>
                            </select>
                            <ChevronDown className="unit-arrow" size={14} />
                        </div>
                        <span className="unit-suffix">/dose</span>
                    </div>
                </div>

                {/* Times Used */}
                <div className="input-group">
                    <div className="label-row"><label>Times used</label><span className="more-options">...</span></div>
                    <div className="input-with-unit">
                        <input type="number" className="calc-input" value={timesUsed} onChange={(e) => setTimesUsed(e.target.value)} />
                        <div className="unit-select-wrapper right-align-fix">
                            <span className="plain-suffix">/ day</span>
                        </div>
                    </div>
                </div>

                {/* Age Started */}
                <div className="input-group">
                    <div className="label-row"><label>Age started <Info size={14} className="info-icon" /></label><span className="more-options">...</span></div>
                    <div className="input-with-unit">
                        <input type="number" className="calc-input" value={ageStarted} onChange={(e) => setAgeStarted(e.target.value)} />
                        <div className="unit-select-wrapper">
                            <select className="unit-select" value={ageStartedUnit} onChange={(e) => setAgeStartedUnit(e.target.value)}>
                                {renderUnitOptions()}
                            </select>
                            <ChevronDown className="unit-arrow" size={14} />
                        </div>
                    </div>
                </div>

                {/* Country */}
                <div className="input-group">
                    <div className="label-row"><label>Country</label><span className="more-options">...</span></div>
                    <div className="select-wrapper">
                        <select className="calc-select main-select" value={country} onChange={(e) => setCountry(e.target.value)}>
                            {Object.keys(countries).sort().map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <ChevronDown className="select-arrow" size={16} />
                    </div>
                </div>

                <div className="results-divider"></div>

                {/* Non Addict Life Expectancy */}
                <div className="input-group result-group">
                    <div className="label-row"><label>Non-addict life expectancy</label><span className="more-options">...</span></div>
                    <div className="result-display-wrapper">
                        <div className="result-value">
                            {formatValue(nonAddictLifeExpectancy, nonAddictLifeExpectancyUnit)}
                        </div>
                        <div className="unit-select-wrapper simple">
                            <select className="unit-select no-bg" value={nonAddictLifeExpectancyUnit} onChange={(e) => setNonAddictLifeExpectancyUnit(e.target.value)}>
                                {renderUnitOptions()}
                            </select>
                            <ChevronDown className="unit-arrow" size={14} />
                        </div>
                    </div>
                </div>

                {/* Addict's Life Expectancy */}
                <div className="input-group result-group">
                    <div className="label-row"><label>Addict's life expectancy</label><span className="more-options">...</span></div>
                    <div className="result-display-wrapper">
                        <div className="result-value">
                            {formatValue(addictLifeExpectancy, addictLifeExpectancyUnit)}
                        </div>
                        <div className="unit-select-wrapper simple">
                            <select className="unit-select no-bg" value={addictLifeExpectancyUnit} onChange={(e) => setAddictLifeExpectancyUnit(e.target.value)}>
                                {renderUnitOptions()}
                            </select>
                            <ChevronDown className="unit-arrow" size={14} />
                        </div>
                    </div>
                </div>

                {/* Addiction Duration */}
                {addictionDuration !== null && (
                    <div className="input-group result-group">
                        <div className="label-row"><label>Addiction duration <Info size={14} className="info-icon" /></label><span className="more-options">...</span></div>
                        <div className="result-display-wrapper">
                            <div className="result-value">
                                {formatValue(addictionDuration, addictionDurationUnit)}
                            </div>
                            <div className="unit-select-wrapper simple">
                                <select className="unit-select no-bg" value={addictionDurationUnit} onChange={(e) => setAddictionDurationUnit(e.target.value)}>
                                    {renderUnitOptions()}
                                </select>
                                <ChevronDown className="unit-arrow" size={14} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Total Life Lost */}
                {totalLifeLost !== null && (
                    <div className="input-group result-group">
                        <div className="label-row"><label>Total life lost</label><span className="more-options">...</span></div>
                        <div className="result-display-wrapper">
                            <div className="result-value">
                                {formatValue(totalLifeLost, totalLifeLostUnit)}
                            </div>
                            <div className="unit-select-wrapper simple">
                                <select className="unit-select no-bg" value={totalLifeLostUnit} onChange={(e) => setTotalLifeLostUnit(e.target.value)}>
                                    {renderUnitOptions()}
                                </select>
                                <ChevronDown className="unit-arrow" size={14} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Disclaimer Section */}
                <div className="calc-notes-section">
                    <p className="calc-note">
                        Note that the calculator estimates life lost for <strong>people who continue to use stimulants</strong>. If you no longer take them, your life expectancy may be higher.
                    </p>
                    <p className="calc-disclaimer">
                        <strong>Disclaimer:</strong> We try our best to make our Omni Calculators as precise and reliable as possible. Nevertheless, the provided results are <strong>only estimations</strong>, and several factors, including age, health condition, and genetics, can differently influence the life expectancy of a substance user. Neither we nor our content providers warrant the accuracy of the information on this site. All information on this website is for informational purposes only and is not intended to and should not serve as a substitute for medical consultation, diagnosis, or treatment.
                    </p>
                </div>

                {/* Actions */}
                <div className="calc-actions">
                    <button className="share-result-btn" onClick={handleShare}>
                        <div className="share-icon-circle"><Share2 size={16} /></div>
                        <span>Share result</span>
                        {showShareTooltip && <span className="copied-tooltip">Copied!</span>}
                    </button>
                    <div className="right-actions">
                        <button className="secondary-btn">Reload calculator</button>
                        <button className="secondary-btn" onClick={() => {
                            setTimesUsed('');
                            setAgeStarted('');
                            setAddictLifeExpectancy(null);
                        }}>Clear all changes</button>
                    </div>
                </div>

            </div>
        </CalculatorLayout>
    );
};

export default AddictionCalculatorPage;
