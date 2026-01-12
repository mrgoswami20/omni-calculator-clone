import React, { useState, useEffect, useRef } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, ChevronDown, MoreHorizontal, Check } from 'lucide-react';
import './FlightCarbonFootprintCalculatorPage.css';

const FlightCarbonFootprintCalculatorPage = () => {
    // --- State ---
    const [duration, setDuration] = useState(''); // Default empty
    const [durationUnit, setDurationUnit] = useState('hrs'); // 'hrs' | 'min'
    const [isDurationDropdownOpen, setIsDurationDropdownOpen] = useState(false);

    const [flightType, setFlightType] = useState('one-way'); // 'one-way' | 'return'

    const [occupancy, setOccupancy] = useState(''); // Default empty

    // --- Results State ---
    const [emissionsUnit, setEmissionsUnit] = useState('kg'); // 'kg' | 't' | 'lb'
    const [isEmissionsDropdownOpen, setIsEmissionsDropdownOpen] = useState(false);
    const [calculatedEmissionsKg, setCalculatedEmissionsKg] = useState(0); // Always store base calculation in KG

    const [allowanceUnit, setAllowanceUnit] = useState('%'); // '%'
    // We can keep allowance unit static or add more if needed, but usually it's % of yearly. 
    // Let's keep it simple for now as per design, but the dropdown visual implies selectability.

    // --- Constants ---
    const CO2_PER_HOUR = 90;
    const RADIATIVE_FORCING = 2;
    const YEARLY_ALLOWANCE_KG = 2500;

    // --- Calculation Effect ---
    useEffect(() => {
        let durInHours = parseFloat(duration) || 0;
        if (durationUnit === 'min') {
            durInHours = durInHours / 60;
        }

        const typeMult = flightType === 'return' ? 2 : 1;
        const occInput = parseFloat(occupancy) || 80; // default 80 if empty for calculation check? 
        // Image says "Average ... is around 80%". 
        // If user input is empty, should current result be 0 or based on 80?
        // User asked to remove default *values* from input, but calculation usually needs numbers.
        // If input is empty, showing 0 emissions is probably best until they type.

        if (!duration || !occupancy) {
            setCalculatedEmissionsKg(0);
            return;
        }

        // Formula: Duration * 90 * 2 / (Occupancy/100)
        // Also multiply by typeMult (2 for return)

        const occupancyFactor = occInput / 100;
        // Prevent div by zero
        const safeOccupancy = occupancyFactor <= 0 ? 0.8 : occupancyFactor;

        const emission = (durInHours * CO2_PER_HOUR * RADIATIVE_FORCING * typeMult) / safeOccupancy;

        setCalculatedEmissionsKg(emission);

    }, [duration, durationUnit, flightType, occupancy]);


    // --- Helper: Convert Output ---
    const getDisplayedEmissions = () => {
        if (emissionsUnit === 'kg') return calculatedEmissionsKg;
        if (emissionsUnit === 't') return calculatedEmissionsKg / 1000;
        if (emissionsUnit === 'lb') return calculatedEmissionsKg * 2.20462;
        return calculatedEmissionsKg;
    };

    const getDisplayedAllowance = () => {
        // Allowance is based on % of 2000kg
        const pct = (calculatedEmissionsKg / YEARLY_ALLOWANCE_KG) * 100;
        return pct;
    };


    // --- Handlers ---
    const handleReset = () => {
        setDuration('');
        setDurationUnit('hrs');
        setFlightType('one-way');
        setOccupancy('');
        setEmissionsUnit('kg');
    };

    const handleReload = () => {
        window.location.reload();
    };

    const handleShare = () => {
        // Mock share functionality
        const text = `I calculated my flight carbon footprint: ${getDisplayedEmissions().toFixed(1)} ${emissionsUnit}`;
        navigator.clipboard.writeText(text).then(() => {
            alert("Result copied to clipboard!");
        });
    };

    // --- Dropdown Refs (for clicking outside) ---
    // Simplified for this task: using onBlur or just open/close toggles.
    // Ideally use a proper useOnClickOutside hook, but for now simple toggle.

    // --- Article Content ---
    const articleContent = (
        <div style={{ color: '#374151', lineHeight: '1.6' }}>
            <h2>Flight emissions calculator</h2>
            <p>
                The flight emissions calculator computes the amount of the CO₂ emitted into the atmosphere during a flight. The calculations are based on the flight duration and apply both to domestic and inter-continental flights.
            </p>
            <p>
                The International Panel on Climate Change (IPCC) estimated the maximal annual amount of CO₂ that, on average, each of us can contribute and yet keep global warming under reasonable control. The calculator compares the amount of CO₂ emitted during a flight to that estimate, the flight's carbon footprint.
            </p>
            <p>
                Flying takes a lot of energy. A medium-sized airplane like Airbus A320, on its regular passenger route, burns around 300 liters of fuel per 100 km. Once divided by the number of passengers, it's 150 if the load is full, the fuel consumption goes down to a small value of 2 liters per 100 km per passenger. That's like a car; you can check it with our miles per gallon calculator.
            </p>
            <p>
                However, the distances covered by flying are much, much longer. One trip from the U.S. to Europe and back (say Orlando to Milan) is almost 8000 kilometers. Include the journey back, and you covered a distance that would take a few months of daily home-work travel to cover.
            </p>

            <h3>Flight CO₂ emission formula</h3>
            <p>
                As much as the planes are efficient, the distances traveled are large, so the emissions of CO₂ are large as well. It's estimated that from 1 kg of fuel, there is more than 3 kg CO₂ emitted. To compute the emissions, we take into account the following factors:
            </p>
            <ul>
                <li>
                    <strong>Amount of CO₂ emitted per one hour of flight per one passenger.</strong> We assume, based on the analysis of carbonindependent.org, that it is equal to <strong>90 kg/hour</strong> per passenger.
                </li>
                <li>
                    <strong>Seat occupancy:</strong> the previous value assumes that the airplane is full. This is rarely the case. Worldwide, on average, the seat occupancy on a regular passenger flight is around <strong>80%</strong>. That's the value we take.
                </li>
                <li>
                    <strong>Duration of a flight:</strong> having emissions per hour, we need the duration of the trip to compute the emission along the whole journey.
                </li>
                <li>
                    <strong>Radiative forcing factor:</strong> finally, the emission takes place high in the atmosphere, and that's precisely where we don't want the CO₂ to be because of its greenhouse effect. To account for that, we include a radiative forcing factor. We take its value to be <strong>2</strong>, based again on the analysis from carbonindependent.org.
                </li>
            </ul>
            <p>
                The final formula is:
                <br /><br />
                <code>Emitted CO2 = Duration_of_flight × Emission_per_hour_per_passenger × Radiative_forcing / Seat_occupancy</code>
            </p>
            <p>
                If you fly there and back, you have to double the emission. We can do it for you. Just change the <strong>Flight</strong> option from <strong>One-way</strong> to <strong>Return</strong>.
            </p>

            <h3>Flight carbon footprint</h3>
            <p>
                Choose your holiday destination, and you generate many tonnes of CO₂. What does it mean? To put this number into context, let's get back to the beginning.
            </p>
            <p>
                Why do we care about CO₂ emissions? Because of global warming. CO₂ is a greenhouse gas meaning that once it is high in the atmosphere, it works like a ceiling of the greenhouse: it lets the heat in but does not let it out.
            </p>
            <p>
                The IPCC estimated that to keep global warming under some control, the increase of the average temperature by 2 degrees in the year 2050, emissions per every person on the earth must stay below 2500 kg of CO₂ annually.
            </p>
        </div>
    );

    return (
        <CalculatorLayout
            title="Flight Carbon Footprint Calculator"
            creators={[{ name: "Milosz Panfil", phd: true }]}
            reviewers={[{ name: "Bogna Szyk" }, { name: "Steven Wooding" }]}
            lastUpdated="August 27, 2024"
            tocItems={["Flight CO₂ emission formula", "Flight carbon footprint"]}
            articleContent={articleContent}
        >
            <div className="flight-carbon-calculator">

                {/* --- Main Card --- */}
                <div className="calc-section-card" style={{ padding: '24px' }}>

                    {/* Duration Input */}
                    <div style={{ marginBottom: '20px' }}>
                        <div className="label-flex">
                            Duration of a flight
                            <MoreHorizontal size={16} className="more-dots" />
                        </div>
                        <div className="unified-input-group">
                            <input
                                type="number"
                                className="input-invisible"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                            />

                            {/* Interactive Dropdown for Duration */}
                            <div className="relative-dropdown-container">
                                <div
                                    className="unit-dropdown"
                                    onClick={() => setIsDurationDropdownOpen(!isDurationDropdownOpen)}
                                >
                                    {durationUnit} <ChevronDown size={14} />
                                </div>
                                {isDurationDropdownOpen && (
                                    <div className="dropdown-menu">
                                        <div className="dropdown-item" onClick={() => { setDurationUnit('hrs'); setIsDurationDropdownOpen(false); }}>hrs</div>
                                        <div className="dropdown-item" onClick={() => { setDurationUnit('min'); setIsDurationDropdownOpen(false); }}>min</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Flight Type Radio */}
                    <div style={{ marginBottom: '20px' }}>
                        <div className="label-flex">
                            Flight
                            <MoreHorizontal size={16} className="more-dots" />
                        </div>
                        <div className="flight-radio-group">
                            <label className="flight-radio-option">
                                <input
                                    type="radio"
                                    name="flightType"
                                    checked={flightType === 'one-way'}
                                    onChange={() => setFlightType('one-way')}
                                />
                                One-way
                            </label>
                            <label className="flight-radio-option">
                                <input
                                    type="radio"
                                    name="flightType"
                                    checked={flightType === 'return'}
                                    onChange={() => setFlightType('return')}
                                />
                                Return
                            </label>
                        </div>
                    </div>

                    {/* Seat Occupancy */}
                    <div style={{ marginBottom: '20px' }}>
                        <div className="label-flex">
                            Seat occupancy
                            <MoreHorizontal size={16} className="more-dots" />
                        </div>
                        <div className="unified-input-group">
                            <input
                                type="number"
                                className="input-invisible"
                                value={occupancy}
                                onChange={(e) => setOccupancy(e.target.value)}
                            />
                            <div className="unit-dropdown">
                                %
                            </div>
                        </div>
                    </div>

                    {/* CO2 Emissions Result */}
                    <div style={{ marginBottom: '20px' }}>
                        <div className="label-flex">
                            CO₂ emissions
                            <MoreHorizontal size={16} className="more-dots" />
                        </div>
                        <div className="result-field-group">
                            <input
                                type="text"
                                className="result-value-input"
                                value={getDisplayedEmissions().toLocaleString(undefined, { maximumFractionDigits: 1 })}
                                readOnly
                            />

                            {/* Output Unit Dropdown */}
                            <div className="relative-dropdown-container">
                                <div
                                    className="unit-dropdown"
                                    onClick={() => setIsEmissionsDropdownOpen(!isEmissionsDropdownOpen)}
                                >
                                    {emissionsUnit} <ChevronDown size={14} />
                                </div>
                                {isEmissionsDropdownOpen && (
                                    <div className="dropdown-menu">
                                        <div className="dropdown-item" onClick={() => { setEmissionsUnit('kg'); setIsEmissionsDropdownOpen(false); }}>kg</div>
                                        <div className="dropdown-item" onClick={() => { setEmissionsUnit('lb'); setIsEmissionsDropdownOpen(false); }}>lb</div>
                                        <div className="dropdown-item" onClick={() => { setEmissionsUnit('t'); setIsEmissionsDropdownOpen(false); }}>t</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Yearly Allowance Result */}
                    <div style={{ marginBottom: '10px' }}>
                        <div className="label-flex">
                            Yearly allowance
                            <MoreHorizontal size={16} className="more-dots" />
                        </div>
                        <div className="result-field-group">
                            <input
                                type="text"
                                className="result-value-input"
                                value={getDisplayedAllowance().toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                readOnly
                            />
                            <div className="unit-dropdown">
                                %
                            </div>
                        </div>
                    </div>

                    {/* --- Action Buttons (Specific Layout) --- */}
                    <div className="flight-actions-grid">
                        <button className="share-result-large-btn" onClick={handleShare}>
                            <div className="share-icon-circle">
                                <Share2 size={20} />
                            </div>
                            <span className="share-text">Share result</span>
                        </button>
                        <div className="right-action-stack">
                            <button className="action-btn-secondary" onClick={handleReload}>
                                Reload calculator
                            </button>
                            <button className="action-btn-secondary" onClick={handleReset}>
                                Clear all changes
                            </button>
                        </div>
                    </div>

                    {/* --- Feedback --- */}
                    <div className="feedback-box">
                        <span className="feedback-label">Did we solve your problem today?</span>
                        <div className="feedback-btn-group">
                            <button className="feedback-sm-btn">Yes</button>
                            <button className="feedback-sm-btn">No</button>
                        </div>
                    </div>

                </div>
            </div>
        </CalculatorLayout>
    );
};

export default FlightCarbonFootprintCalculatorPage;
