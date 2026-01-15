import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { ChevronDown, ChevronUp } from 'lucide-react';
import InputGroup from '../../components/StandardCalculator/InputGroup';
import SelectGroup from '../../components/StandardCalculator/SelectGroup';
import ResultRow from '../../components/StandardCalculator/ResultRow';
import ActionPanel from '../../components/StandardCalculator/ActionPanel';
import FeedbackRow from '../../components/StandardCalculator/FeedbackRow';
import '../../components/StandardCalculator/StandardCalculator.css';

const BoatSpeedCalculatorPage = () => {
    // Section States
    const [isDimensionsOpen, setIsDimensionsOpen] = useState(true);
    const [isResultOpen, setIsResultOpen] = useState(true);

    // Inputs
    const [power, setPower] = useState('');
    const [powerUnit, setPowerUnit] = useState('kW'); // Default requested
    const [displacement, setDisplacement] = useState('');
    const [displacementUnit, setDisplacementUnit] = useState('kg'); // Default requested
    const [boatType, setBoatType] = useState('');
    const [crouchC, setCrouchC] = useState('');

    // Result
    const [speed, setSpeed] = useState('');
    const [speedUnit, setSpeedUnit] = useState('km/h'); // Default requested

    const creators = [
        { name: "Rahul Dhari", role: "" },
    ];

    const reviewers = [
        { name: "Steven Wooding", role: "" }
    ];

    // Options Arrays
    const powerUnitOptions = ['W', 'kW', 'MW', 'hp']; // hp assumed mechanical/imperial based on formula usage usually, but listed as hp(I) in request? Request said 'hp(1)' probably typo for I.
    const displacementUnitOptions = ['kg', 't', 'lb', 'US ton', 'long ton'];
    const speedUnitOptions = ['m/s', 'km/h', 'mph', 'knots'];

    const boatTypes = [
        { value: '', label: 'Select', c: '' },
        { value: 'cruisers', label: 'Cruisers', c: 150 },
        { value: 'passenger_vessels', label: 'Passenger vessels', c: 150 },
        { value: 'average_runabouts', label: 'Average runabouts', c: 150 },
        { value: 'light_high_speed_cruisers', label: 'Light high-speed cruisers', c: 190 },
        { value: 'high_speed_runabouts', label: 'High speed runabouts', c: 190 },
        { value: 'racing_boats', label: 'Racing boats', c: 210 },
        { value: 'hydroplanes', label: 'Hydroplanes', c: 220 },
        { value: 'racing_catamarans', label: 'Racing catamarans', c: 210 },
        { value: 'sea_sleds', label: 'Sea sleds', c: 210 },
    ];

    // --- Handling C Update ---
    useEffect(() => {
        const selected = boatTypes.find(b => b.value === boatType);
        if (selected && selected.value !== '') {
            setCrouchC(selected.c.toString());
        } else if (boatType === '') {
            setCrouchC(''); // Clear if select is chosen
        }
    }, [boatType]);


    // --- Calculation Logic ---
    useEffect(() => {
        if (!power || !displacement || !crouchC) {
            setSpeed('');
            return;
        }

        const P_val = parseFloat(power);
        const D_val = parseFloat(displacement);
        const C_val = parseFloat(crouchC);

        if (isNaN(P_val) || isNaN(D_val) || isNaN(C_val) || D_val === 0) {
            setSpeed('');
            return;
        }

        // 1. Convert Power to Horsepower (hp - Imperial/Mechanical)
        // 1 kW = 1.34102 hp
        // 1 W = 0.00134102 hp
        // 1 MW = 1341.02 hp
        // 1 hp = 1 hp
        let P_hp = 0;
        switch (powerUnit) {
            case 'W': P_hp = P_val * 0.00134102; break;
            case 'kW': P_hp = P_val * 1.34102; break;
            case 'MW': P_hp = P_val * 1341.02; break;
            case 'hp': P_hp = P_val; break;
            default: P_hp = P_val;
        }

        // 2. Convert Displacement to Pounds (lbs)
        // 1 kg = 2.20462 lbs
        // 1 t (metric) = 2204.62 lbs
        // 1 lb = 1 lb
        // 1 US ton = 2000 lbs
        // 1 long ton (imperial) = 2240 lbs
        let D_lbs = 0;
        switch (displacementUnit) {
            case 'kg': D_lbs = D_val * 2.20462; break;
            case 't': D_lbs = D_val * 2204.62; break;
            case 'lb': D_lbs = D_val; break;
            case 'US ton': D_lbs = D_val * 2000; break;
            case 'long ton': D_lbs = D_val * 2240; break;
            default: D_lbs = D_val;
        }

        // 3. Calculate Speed in MPH
        // Formula: V_mph = C * sqrt( HP / Lbs )
        const V_mph = C_val * Math.sqrt(P_hp / D_lbs);

        // 4. Convert Speed to Selected Unit
        // 1 mph = 1.60934 km/h
        // 1 mph = 0.868976 knots
        // 1 mph = 0.44704 m/s
        let resultSpeed = 0;
        switch (speedUnit) {
            case 'mph': resultSpeed = V_mph; break;
            case 'km/h': resultSpeed = V_mph * 1.60934; break;
            case 'knots': resultSpeed = V_mph * 0.868976; break;
            case 'm/s': resultSpeed = V_mph * 0.44704; break;
            default: resultSpeed = V_mph;
        }

        if (isFinite(resultSpeed) && resultSpeed > 0) {
            setSpeed(resultSpeed.toLocaleString(undefined, { maximumFractionDigits: 2 }));
        } else {
            setSpeed('');
        }

    }, [power, powerUnit, displacement, displacementUnit, crouchC, speedUnit]);


    const handleReset = () => {
        setPower('');
        setDisplacement('');
        setBoatType('');
        setCrouchC('');
        setSpeed('');
    };

    const handleReload = () => {
        window.location.reload();
    };

    const articleContent = (
        <div style={{ color: '#374151', lineHeight: '1.6' }}>
            <p>
                The <strong>boat speed calculator</strong> determines the <strong>top speed of a boat</strong> based on the boat's <strong>power</strong> and <strong>displacement</strong>. If you wonder how fast a boat can go, this calculator will help you answer that.
            </p>
        </div>
    );

    return (
        <CalculatorLayout
            title="Boat Speed Calculator"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "What is boat speed – Calculating using Crouch's formula?",
                "What is displacement?",
                "Crouch constant",
                "How to calculate boat speed using this calculator?",
                "Example of using the boat speed calculator",
                "FAQs"
            ]}
            articleContent={articleContent}
            similarCalculators={32}
        >
            <div className="std-calculator">
                <div className="std-section-card">

                    {/* Dimensions & Power Section */}
                    <div className="std-collapsible-section">
                        <div className="std-collapsible-header" onClick={() => setIsDimensionsOpen(!isDimensionsOpen)}>
                            <div className="std-header-left">
                                {isDimensionsOpen ? <ChevronUp size={18} color="#436cfe" /> : <ChevronDown size={18} color="#436cfe" />}
                                <span>Boat Dimensions & Power</span>
                            </div>
                        </div>
                        {isDimensionsOpen && (
                            <div className="std-collapsible-content">
                                <InputGroup
                                    label="Shaft horsepower (P)"
                                    value={power}
                                    onChange={setPower}
                                    unit={powerUnit}
                                    onUnitChange={setPowerUnit}
                                    isUnitDropdown={true}
                                    unitOptions={powerUnitOptions}
                                />
                                <InputGroup
                                    label="Boat displacement (D)"
                                    value={displacement}
                                    onChange={setDisplacement}
                                    unit={displacementUnit}
                                    onUnitChange={setDisplacementUnit}
                                    isUnitDropdown={true}
                                    unitOptions={displacementUnitOptions}
                                />
                                <SelectGroup
                                    label="Boat type"
                                    value={boatType}
                                    onChange={setBoatType}
                                    options={boatTypes}
                                />
                                <InputGroup
                                    label="Crouch’s constant (C)"
                                    value={crouchC}
                                    onChange={setCrouchC}
                                    placeholder="Enter C value"
                                />
                            </div>
                        )}
                    </div>

                    {/* Result Section */}
                    {isResultOpen && (
                        <div style={{ marginTop: '24px' }}>
                            <ResultRow
                                label="Speed (S)"
                                value={speed}
                                unit={speedUnit}
                                onUnitChange={setSpeedUnit}
                                isUnitDropdown={true}
                                unitOptions={speedUnitOptions}
                            />
                        </div>
                    )}

                    <ActionPanel
                        onReload={handleReload}
                        onReset={handleReset}
                    />

                    <FeedbackRow />

                </div>
            </div>
        </CalculatorLayout>
    );
};

export default BoatSpeedCalculatorPage;
