import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../components/CalculatorLayout';
import { Info, ChevronDown, ChevronUp, Share2, MoreHorizontal } from 'lucide-react';
import './IdealEggBoilingCalculatorPage.css';

const IdealEggBoilingCalculatorPage = () => {
    // --- State ---

    // Egg Size (Base: grams)
    const [eggSize, setEggSize] = useState('58'); // Default EU M

    // Egg Origin
    const [eggOrigin, setEggOrigin] = useState('fridge'); // 'fridge', 'room', 'custom'
    const [customTemp, setCustomTemp] = useState(4);

    // Altitude (Base: meters)
    const [altitude, setAltitude] = useState(0);
    const [altitudeUnit, setAltitudeUnit] = useState('m');

    // Pressure (Base: hPa) - Calculated from Altitude
    const [pressure, setPressure] = useState(1013.2);
    const [pressureUnit, setPressureUnit] = useState('hPa');

    // Boiling Point (Base: Celsius) - Calculated from Pressure
    const [boilingPoint, setBoilingPoint] = useState(100);
    const [boilingPointUnit, setBoilingPointUnit] = useState('C');

    // Visibility Toggles
    const [isOpenSetup, setIsOpenSetup] = useState(true);
    const [isOpenTimes, setIsOpenTimes] = useState(true);

    // Results (in seconds)
    const [timeQuarter, setTimeQuarter] = useState(0);
    const [timeSoft, setTimeSoft] = useState(0);
    const [timeHalf, setTimeHalf] = useState(0);
    const [timeHard, setTimeHard] = useState(0);

    // Result Units (Individual)
    const [unitQuarter, setUnitQuarter] = useState('min_sec');
    const [unitSoft, setUnitSoft] = useState('min_sec');
    const [unitHalf, setUnitHalf] = useState('min_sec');
    const [unitHard, setUnitHard] = useState('min_sec');

    // --- Constants ---
    const TEMP_FRIDGE = 4;
    const TEMP_ROOM = 20;
    const T_QUARTER = 45;
    const T_SOFT = 63.5;
    const T_HALF = 69;
    const T_HARD = 77;

    // --- Converters ---
    const convertAltitudeToMeters = (val, unit) => {
        const v = parseFloat(val) || 0;
        switch (unit) {
            case 'm': return v;
            case 'km': return v * 1000;
            case 'ft': return v * 0.3048;
            case 'yd': return v * 0.9144;
            case 'mi': return v * 1609.34;
            default: return v;
        }
    };

    const convertPressureFromHPa = (hPa, unit) => {
        switch (unit) {
            case 'hPa': return hPa;
            case 'Pa': return hPa * 100;
            case 'bar': return hPa * 0.001;
            case 'psi': return hPa * 0.0145038;
            case 'at': return hPa * 0.0010197;
            case 'atm': return hPa * 0.00098692;
            case 'Torr': return hPa * 0.750062;
            case 'inHg': return hPa * 0.02953;
            case 'mmHg': return hPa * 0.750062;
            default: return hPa;
        }
    };

    const convertTempFromC = (c, unit) => {
        switch (unit) {
            case 'C': return c;
            case 'F': return (c * 9 / 5) + 32;
            case 'K': return c + 273.15;
            default: return c;
        }
    };

    // --- Effects ---

    // 1. Calculate Conditions (Altitude -> Pressure -> Boiling Point)
    useEffect(() => {
        // 1. Get Altitude in Meters
        const h_m = convertAltitudeToMeters(altitude, altitudeUnit);

        // 2. Calc Pressure in hPa
        // P = 1013.25 * (1 - 2.25577e-5 * h)^5.25588
        const p_hPa = 1013.25 * Math.pow(1 - 2.25577e-5 * h_m, 5.25588);
        setPressure(p_hPa);

        // 3. Calc Boiling Point in C
        // Antoine Equation approximation valid for water range
        const p_mmHg = p_hPa * 0.750061561;
        const t_c = (1730.63 / (8.07131 - Math.log10(p_mmHg))) - 233.426;
        setBoilingPoint(t_c);

    }, [altitude, altitudeUnit]);

    // 2. Calculate Cooking Times
    useEffect(() => {
        const M = parseFloat(eggSize) || 58;

        let T_start = TEMP_FRIDGE;
        if (eggOrigin === 'room') T_start = TEMP_ROOM;
        if (eggOrigin === 'custom') T_start = parseFloat(customTemp) || 4;

        // Base calc always uses Base Units (C)
        const T_water = boilingPoint; // already in C

        const K = 0.468;
        const massFactor = Math.pow(M, 2 / 3);

        const calcTime = (T_internal) => {
            if (T_water <= T_internal) return 0;
            const ratio = (T_water - T_start) / (T_water - T_internal);
            if (ratio <= 0) return 0;
            const minutes = K * massFactor * Math.log(ratio);
            return minutes * 60; // seconds
        };

        setTimeQuarter(calcTime(T_QUARTER));
        setTimeSoft(calcTime(T_SOFT));
        setTimeHalf(calcTime(T_HALF));
        setTimeHard(calcTime(T_HARD));

    }, [eggSize, eggOrigin, customTemp, boilingPoint]);

    // --- Helpers ---
    const formatTime = (seconds, unit = 'min_sec') => {
        if (!seconds || seconds <= 0) return { val: "--", unit: "" };

        switch (unit) {
            case 'sec':
                return { val: Math.round(seconds), unit: 'sec' };
            case 'min':
                return { val: (seconds / 60).toFixed(2), unit: 'min' };
            case 'hrs':
                return { val: (seconds / 3600).toFixed(6), unit: 'hrs' };
            case 'days':
                return { val: (seconds / 86400).toFixed(6), unit: 'days' };
            case 'min_sec':
            default:
                const m = Math.floor(seconds / 60);
                const s = Math.round(seconds % 60);
                return { min: m, sec: s, isSplit: true };
        }
    };

    // Helper to format displayed numbers
    const formatNumber = (num) => {
        return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
    };

    // Helper Component for the Result Row
    const ResultRow = ({ label, time, currentUnit, onUnitChange }) => {
        const data = formatTime(time, currentUnit);

        return (
            <div className="result-row">
                <div className="label-row">
                    <label>{label} <span className="more-options">...</span></label>
                </div>
                <div className="result-container">
                    {data.isSplit ? (
                        <>
                            <div className="result-block">
                                <span className="result-val">{data.min}</span>
                                <span className="result-label">min</span>
                            </div>
                            <div className="result-divider"></div>
                            <div className="result-block">
                                <span className="result-val">{data.sec}</span>
                                <span className="result-label">sec</span>
                            </div>
                        </>
                    ) : (
                        <div className="result-block" style={{ justifyContent: 'center', paddingRight: '20px' }}>
                            <span className="result-val">{data.val}</span>
                            <span className="result-label">{data.unit}</span>
                        </div>
                    )}

                    <div className="result-chevron-box" style={{ position: 'relative' }}>
                        <select
                            className="unit-select-overlay"
                            value={currentUnit}
                            onChange={(e) => onUnitChange(e.target.value)}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                opacity: 0,
                                cursor: 'pointer'
                            }}
                        >
                            <option value="sec">seconds (sec)</option>
                            <option value="min">minutes (min)</option>
                            <option value="hrs">hours (hrs)</option>
                            <option value="days">days (days)</option>
                            <option value="min_sec">minutes / seconds (min / sec)</option>
                        </select>
                        <ChevronDown size={14} />
                    </div>
                </div>
            </div>
        );
    };

    const creators = [
        { name: "Milosz Panfil", role: "PhD" },
        { name: "Mateusz Mucha", role: "" },
    ];
    const reviewers = [
        { name: "Bogna Szyk", role: "" },
        { name: "Jack Bowater", role: "" },
        { name: "Adena Benn", role: "" }
    ];

    const tocItems = [
        "The science behind the boiling of an egg",
        "The altitude? Is it a joke?",
        "Life hacks: how to peel an egg like a pro!",
        "FAQs"
    ];

    const educationalContent = (
        <div className="educational-content">
            <p>
                Everyone cooks eggs differently. What sets this egg calculator apart is that it was created by Miłosz Panfil, Omni Calculator's chief scientist, who happens to have a Ph.D. in Quantum Physics from the University of Warsaw.
            </p>
            <p>
                If you want to boil the perfect egg according to quantum physics, use our calculator and follow these steps:
            </p>
            <ol style={{ marginLeft: '20px', lineHeight: '1.6' }}>
                <li>Bring the water to <strong>boiling point</strong>.</li>
                <li>You may <strong>add half a teaspoon of table salt</strong> to help prevent the eggs from cracking. For the same reason, it's better to use eggs that aren't taken straight out of the fridge.</li>
                <li>Be <strong>generous with the amount of water</strong>; inserting the egg lowers the temperature. We want to be sure we're at the boiling point! Once the eggs are in the water, start the timer.</li>
                <li>When the time is up, take the eggs out of the pot and rinse them with <strong>cold water</strong> to stop the boiling process.</li>
            </ol>
            <p>
                That's the recipe in a nut(egg?)shell, but what's the science behind it?
            </p>

            <div style={{ backgroundColor: '#ebf5ff', padding: '16px', borderRadius: '8px', marginTop: '20px', marginBottom: '20px', borderLeft: '4px solid #3b82f6' }}>
                <div style={{ display: 'flex', gap: '8px', fontWeight: '600', color: '#1e40af', marginBottom: '8px' }}>
                    <span style={{ fontSize: '1.2rem' }}>💡</span>
                    To learn more about boiling points, check out our <a href="#" style={{ color: '#2563eb' }}>boiling point calculator</a> and <a href="#" style={{ color: '#2563eb' }}>boiling point elevation calculator</a>.
                </div>
            </div>

            <h3>The science behind the boiling of an egg</h3>
            <p>
                When we place anything in hot water, it gets warmer, eggs included. The water begins by warming the shells of the eggs and then their interior, which consists of the white which surrounds the yolk.
            </p>
            <p>
                A soft-boiled egg should have a firm white and a runny yolk. While both the white and yolk coagulate (change from liquids to gels) in hot water, the white coagulates at a slightly lower temperature than the yolk.
            </p>
            <p>
                So, for a soft-boiled egg, we should heat the egg to a temperature where the white has already thickened, but the yolk has not. The calculator assumes that we get a perfect soft-boiled egg when it reaches a temperature of 65 °C (149 °F). So how much time does it take to heat an egg to this temperature?
            </p>
            <p>
                As soon as the eggs are in the water, the shell's temperature quickly reaches that of the boiling water. The heat then starts to spread throughout the egg.
            </p>
            <p>
                This process is controlled by a heat diffusion equation which depends on two parameters: heat conductivity and heat capacity. The heat conductivity specifies how quickly the heat spreads, while the heat capacity tells us how much heat we need to warm up the substance by one degree.
            </p>
            <p>
                From the heat diffusion equation, we can estimate the time <em>t</em> when the temperature between the white and yolk reaches 65 °C. That's when we stop heating the eggs.
            </p>
            <p>
                Because the white is still at a noticeably higher temperature (the shell has a temperature of 100 °C/212 °F), even if we take the eggs out of the water, some heat will still be transferred from the white to the yolk, meaning the yolk might coagulate. That's why we should cool down our eggs immediately after taking the eggs out of the water – so we stop the boiling process.
            </p>
            <p>
                A precise calculation of the time required to cook a perfect soft-boiled egg is difficult. The whites and yolk are complicated substances involving various types of proteins and fat molecules. Also, every egg is different, and the ratio of whites to yolk varies. Charles Williams of the University of Exeter came up with a formula involving all the main factors. The time <em>t</em> for the region between the white and yolk to get to a temperature <em>T</em> is:
            </p>

            <div style={{ textAlign: 'center', margin: '20px 0', fontSize: '1.1rem', fontFamily: 'Times New Roman, serif' }}>
                t = m<sup>2/3</sup> K log( 0.76 * (T<sub>egg</sub> - T<sub>water</sub>) / (T - T<sub>water</sub>) )
            </div>
            <p>where:</p>
            <ul style={{ marginLeft: '20px', lineHeight: '1.6' }}>
                <li><strong>m</strong> – Mass of the egg;</li>
                <li><strong>K</strong> – Factor describing thermal properties of an egg;</li>
                <li><strong>T<sub>egg</sub></strong> – Initial temperature of the egg;</li>
                <li><strong>T<sub>water</sub></strong> – Temperature of the water;</li>
                <li><strong>T</strong> – Temperature in the region between whites and yolk; and</li>
                <li><strong>ywr</strong> – Ratio of white to yolk (approx 0.76).</li>
            </ul>

            <p>
                For a soft-boiled egg, the temperature <em>T</em> should be 65 degrees Celsius (149 °F), so that's the value set in our calculator.
            </p>
            <p>
                For a hard-boiled egg, the temperature inside the egg should be higher, so the yolk coagulates (thickens). However, it cannot be too high because then the sulfur in the white reacts with the iron in the yolk and creates the greenish ferrous sulfide covering the yolk. We should keep the temperature <em>T</em> below 77 °C (170.6 °F) to avoid that.
            </p>

            <h3>The altitude? Is it a joke?</h3>
            <p>
                Why is there an altitude section in our calculator? The higher above the sea level you are, the more air pressure decreases, and therefore the boiling point of water decreases. That makes the cooking process more time-consuming. You might not even be able to cook a hard-boiled egg at high altitudes.
            </p>
            <p>
                If you are high enough, like Mount Everest high, you won't get hard-boiled eggs. At 8848 m (29,029 ft) above sea level, water boils at a disappointingly low temperature of 68 degrees Celsius (154.5 °F).
            </p>
            <p>
                For a more real-world example, the Bolivian city of El Alto, home to over 1 million people, is 4150 meters above sea level. Water boils at 85.9 °C (186.6 °F), which translates to approximately 2 minutes longer to get a soft-boiled egg compared to how long to boil an egg at sea level. That's crazy!
            </p>
            <div style={{ backgroundColor: '#ebf5ff', padding: '16px', borderRadius: '8px', marginTop: '20px', borderLeft: '4px solid #3b82f6' }}>
                <div style={{ display: 'flex', gap: '8px', fontWeight: '600', color: '#1e40af', marginBottom: '8px' }}>
                    <span style={{ fontSize: '1.2rem' }}></span>
                    Want to learn more about air pressure and boiling points? Then check out our <a href="#" style={{ color: '#2563eb' }}>air pressure at altitude calculator</a> and <a href="#" style={{ color: '#2563eb' }}>boiling point at altitude calculator</a>.
                </div>
            </div>

            <h3>Life hacks: how to peel an egg like a pro!</h3>
            <p>
                Of course, you can just crack the egg and then peel it, piece by piece, but why would you do it that way when you could just use one of these three time-saving hacks?
            </p>
            <p>
                Once your egg has cooked and cooled down just enough for you to touch it, open it up at both ends. Then, just blow it out of the shell! Just watch how this guy does it:
            </p>
            <p>
                <a href="https://www.youtube.com/watch?v=PN2gYHJNT3Y" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', fontWeight: '600' }}>Watch this on YouTube</a>
            </p>
            <p>
                If you don't have that much lung power, put the egg in a container filled with water, close it and shake really well. The peel will come off on its own.
            </p>
            <p>
                Want to try the third option? Crack the egg and roll it on the counter for a few seconds. Then, peel it while holding it in cold water. It works like a charm!
            </p>

            <h3>FAQs</h3>
            <p><strong>How long to hard boil eggs in boiling water?</strong></p>
            <p>
                A medium-sized, out-of-the-fridge egg, at zero meters altitude, takes around 9 minutes and 29 seconds to hard boil. This time will change if any of the parameters change; if the egg was at room temperature before boiling, then it would take less than 9 minutes to hard boil the same egg.
            </p>
            <p><strong>How long does it take to medium boil eggs?</strong></p>
            <p>
                Generally speaking, it takes about 5-6 minutes to medium or half-boil an egg. But there are multiple factors on which the time depends. These include:
            </p>
            <ul style={{ marginLeft: '20px', lineHeight: '1.6' }}>
                <li>Size of the egg;</li>
                <li>Temperature of the egg (Fridge or room);</li>
                <li>Altitude of the place where the egg is boiled.</li>
            </ul>
            <p>
                So, if you are boiling a medium-sized, room temperature egg and your altitude is zero meters, it should take approximately 5 minutes and 57 seconds to half or medium boil the egg.
            </p>
            <p><strong>Do eggs boil differently at different altitudes?</strong></p>
            <p>
                Yes, as absurd as it may sound, eggs boil differently at different altitudes. The higher the altitude, the lower the air pressure and, hence, the lower the boiling point of water, which means more time is required to boil an egg.
            </p>
            <p><strong>How do I hard boil 6 medium eggs?</strong></p>
            <p>
                The number of eggs doesn't change the time required to boil them, just the size of the pot and the quantity of water needed.
            </p>
            <ol style={{ marginLeft: '20px', lineHeight: '1.6' }}>
                <li>Add a generous amount of water in a pot.</li>
                <li>Bring the water to a boil. You may add some salt.</li>
                <li>Gently place the eggs in the water and note the time.</li>
                <li>Turn off the stove after 8 minutes and 4 seconds.</li>
                <li>Remove the eggs from the pot.</li>
                <li>Rinse them in cold water to stop the cooking process.</li>
            </ol>
        </div>
    );

    return (
        <CalculatorLayout
            title="Ideal Egg Boiling Calculator"
            creators={creators}
            reviewers={reviewers}
            tocItems={tocItems}
            articleContent={educationalContent}
        >
            <div className="egg-calculator">
                {/* SETTINGS CARD */}
                <div className="section-card">
                    <div className="section-header" onClick={() => setIsOpenSetup(!isOpenSetup)}>
                        {isOpenSetup ? <ChevronUp size={20} className="header-icon" /> : <ChevronDown size={20} className="header-icon" />}
                        <h4>Egg cooking setup</h4>
                        <MoreHorizontal size={20} className="header-icon" style={{ marginLeft: 'auto' }} />
                    </div>

                    {isOpenSetup && (
                        <div style={{ padding: '0 16px 16px 16px' }}>
                            {/* Egg Size */}
                            <div className="input-group">
                                <div className="label-row">
                                    <label>Egg's size <Info size={14} className="info-icon" /></label>
                                    <span className="more-options">...</span>
                                </div>
                                <div className="input-with-unit">
                                    <div className="unit-select-wrapper" style={{ flex: 1, paddingLeft: 0, border: 'none', background: 'white' }}>
                                        <select
                                            className="custom-select"
                                            value={eggSize}
                                            onChange={(e) => setEggSize(e.target.value)}
                                        >
                                            <option disabled>Select</option>
                                            <option value="71">US Jumbo (~71g)</option>
                                            <option value="64">US XL (~64g)</option>
                                            <option value="57">US L (~57g)</option>
                                            <option value="50">US M (~50g)</option>
                                            <option value="43">US S (~43g)</option>
                                            <option value="35">US Peewee (~35g)</option>
                                            <option disabled>---</option>
                                            <option value="73">EU XL (&gt;73g)</option>
                                            <option value="63">EU L (63-73g)</option>
                                            <option value="58">EU M (53-63g)</option>
                                            <option value="53">EU S (&lt;53g)</option>
                                            <option disabled>---</option>
                                            <option value="70">CA Jumbo (~70g)</option>
                                            <option value="63">CA Extra Large (~63g)</option>
                                            <option value="56">CA Large (~56g)</option>
                                            <option value="49">CA Medium (~49g)</option>
                                            <option value="42">CA Small (~42g)</option>
                                            <option value="35">CA Peewee (&lt;42g)</option>
                                        </select>
                                    </div>
                                    <ChevronDown size={14} style={{ marginRight: '12px', color: '#2563eb', pointerEvents: 'none' }} />
                                </div>
                            </div>

                            {/* Egg Origin */}
                            <div className="input-group">
                                <div className="label-row">
                                    <label>Egg's origin <span className="more-options">...</span></label>
                                </div>
                                <div className="radio-group">
                                    <div className="radio-item" onClick={() => setEggOrigin('fridge')}>
                                        <input type="radio" checked={eggOrigin === 'fridge'} readOnly />
                                        <label>Fridge</label>
                                    </div>
                                    <div className="radio-item" onClick={() => setEggOrigin('room')}>
                                        <input type="radio" checked={eggOrigin === 'room'} readOnly />
                                        <label>Room temperature</label>
                                    </div>
                                    <div className="radio-item" onClick={() => setEggOrigin('custom')}>
                                        <input type="radio" checked={eggOrigin === 'custom'} readOnly />
                                        <label>I want to specify temperature</label>
                                    </div>
                                    {eggOrigin === 'custom' && (
                                        <div className="input-with-unit" style={{ marginTop: '8px' }}>
                                            <input
                                                className="calc-input"
                                                type="number"
                                                value={customTemp}
                                                onChange={(e) => setCustomTemp(e.target.value)}
                                            />
                                            <div className="unit-static">°C</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Altitude */}
                            <div className="input-group">
                                <div className="label-row">
                                    <label>Altitude <Info size={14} className="info-icon" /></label>
                                    <span className="more-options">...</span>
                                </div>
                                <div className="input-with-unit">
                                    <input
                                        className="calc-input"
                                        type="number"
                                        value={altitude}
                                        onChange={(e) => setAltitude(e.target.value)}
                                        onWheel={(e) => e.target.blur()}
                                    />
                                    <div className="unit-select-wrapper">
                                        <select
                                            className="unit-select"
                                            value={altitudeUnit}
                                            onChange={(e) => setAltitudeUnit(e.target.value)}
                                        >
                                            <option value="m">meters (m)</option>
                                            <option value="km">kilometers (km)</option>
                                            <option value="ft">feet (ft)</option>
                                            <option value="yd">yards (yd)</option>
                                            <option value="mi">miles (mi)</option>
                                        </select>
                                        <ChevronDown size={14} className="unit-chevron" />
                                    </div>
                                </div>
                            </div>

                            {/* Air Pressure */}
                            <div className="input-group">
                                <div className="label-row">
                                    <label>Air pressure <span className="more-options">...</span></label>
                                </div>
                                <div className="input-with-unit" style={{ backgroundColor: '#f3f4f6' }}>
                                    <input
                                        className="calc-input"
                                        type="text"
                                        value={formatNumber(convertPressureFromHPa(pressure, pressureUnit))}
                                        readOnly
                                        style={{ backgroundColor: '#eff6ff', color: '#2563eb', fontWeight: '600' }}
                                    />
                                    <div className="unit-select-wrapper">
                                        <select
                                            className="unit-select"
                                            value={pressureUnit}
                                            onChange={(e) => setPressureUnit(e.target.value)}
                                        >
                                            <option value="hPa">hectopascals (hPa)</option>
                                            <option value="Pa">pascals (Pa)</option>
                                            <option value="bar">bars (bar)</option>
                                            <option value="psi">pounds per square inch (psi)</option>
                                            <option value="at">technical atmospheres (at)</option>
                                            <option value="atm">standard atmospheres (atm)</option>
                                            <option value="Torr">torr (Torr)</option>
                                            <option value="inHg">inches of mercury (inHg)</option>
                                            <option value="mmHg">millimeters of mercury (mmHg)</option>
                                        </select>
                                        <ChevronDown size={14} className="unit-chevron" />
                                    </div>
                                </div>
                            </div>

                            {/* Boiling Point */}
                            <div className="input-group">
                                <div className="label-row">
                                    <label>Boiling point of water <span className="more-options">...</span></label>
                                </div>
                                <div className="input-with-unit" style={{ backgroundColor: '#f3f4f6' }}>
                                    <input
                                        className="calc-input"
                                        type="text"
                                        value={formatNumber(convertTempFromC(boilingPoint, boilingPointUnit))}
                                        readOnly
                                        style={{ backgroundColor: '#eff6ff', color: '#2563eb', fontWeight: '600' }}
                                    />
                                    <div className="unit-select-wrapper">
                                        <select
                                            className="unit-select"
                                            value={boilingPointUnit}
                                            onChange={(e) => setBoilingPointUnit(e.target.value)}
                                        >
                                            <option value="C">Celsius (°C)</option>
                                            <option value="F">Fahrenheit (°F)</option>
                                            <option value="K">kelvins (K)</option>
                                        </select>
                                        <ChevronDown size={14} className="unit-chevron" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* RESULTS CARD */}
                <div className="section-card">
                    <div className="section-header" onClick={() => setIsOpenTimes(!isOpenTimes)}>
                        {isOpenTimes ? <ChevronUp size={20} className="header-icon" /> : <ChevronDown size={20} className="header-icon" />}
                        <h4>Egg boiling times</h4>
                    </div>

                    {isOpenTimes && (
                        <div style={{ padding: '0 16px 16px 16px' }}>
                            <ResultRow
                                label="Quarter-boiled"
                                time={timeQuarter}
                                currentUnit={unitQuarter}
                                onUnitChange={setUnitQuarter}
                            />
                            <ResultRow
                                label="Soft egg"
                                time={timeSoft}
                                currentUnit={unitSoft}
                                onUnitChange={setUnitSoft}
                            />
                            <ResultRow
                                label="Half-boiled"
                                time={timeHalf}
                                currentUnit={unitHalf}
                                onUnitChange={setUnitHalf}
                            />
                            <ResultRow
                                label="Hard egg"
                                time={timeHard}
                                currentUnit={unitHard}
                                onUnitChange={setUnitHard}
                            />
                        </div>
                    )}
                </div>

                <div className="footer-actions">
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <button type="button" className="btn-share">
                            <div style={{ backgroundColor: '#ff4f6e', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Share2 size={24} color="white" />
                            </div>
                            <span style={{ fontWeight: '600', color: '#111827' }}>Share result</span>
                        </button>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button type="button" onClick={() => window.location.reload()} className="btn-secondary">
                                Reload calculator
                            </button>
                            <button type="button" onClick={() => {
                                setEggSize('58');
                                setEggOrigin('fridge');
                                setAltitude(0);
                                setAltitudeUnit('m');
                                // Reset all units
                                setUnitQuarter('min_sec');
                                setUnitSoft('min_sec');
                                setUnitHalf('min_sec');
                                setUnitHard('min_sec');
                            }} className="btn-secondary">
                                Clear all changes
                            </button>
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem', color: '#6b7280', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
                        Did we solve your problem today?
                        <button type="button" style={{ border: '1px solid #e5e7eb', padding: '4px 12px', borderRadius: '4px', backgroundColor: 'white', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}><span>👍</span> Yes</button>
                        <button type="button" style={{ border: '1px solid #e5e7eb', padding: '4px 12px', borderRadius: '4px', backgroundColor: 'white', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}><span>👎</span> No</button>
                    </div>
                </div>
            </div>
        </CalculatorLayout>
    );
};

export default IdealEggBoilingCalculatorPage;
