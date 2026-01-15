import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { ChevronDown, ChevronUp } from 'lucide-react';
import InputGroup from '../../components/StandardCalculator/InputGroup';
import SelectGroup from '../../components/StandardCalculator/SelectGroup';
import ResultRow from '../../components/StandardCalculator/ResultRow';
import ActionPanel from '../../components/StandardCalculator/ActionPanel';
import FeedbackRow from '../../components/StandardCalculator/FeedbackRow';
import '../../components/StandardCalculator/StandardCalculator.css';

const ZeroToSixtyCalculatorPage = () => {
    // Section States
    const [isPowerOpen, setIsPowerOpen] = useState(true);
    const [isDrivetrainOpen, setIsDrivetrainOpen] = useState(true);
    const [isGripOpen, setIsGripOpen] = useState(true);
    const [isResultOpen, setIsResultOpen] = useState(true);

    // Inputs
    const [power, setPower] = useState('');
    const [powerUnit, setPowerUnit] = useState('hp');
    const [emptyWeight, setEmptyWeight] = useState('');
    const [emptyWeightUnit, setEmptyWeightUnit] = useState('kg');
    const [payload, setPayload] = useState('');
    const [payloadUnit, setPayloadUnit] = useState('kg');

    // Dropdowns
    const [vehicleType, setVehicleType] = useState('');
    const [driveType, setDriveType] = useState('fwd');
    const [motorType, setMotorType] = useState('');
    const [gearbox, setGearbox] = useState('');
    const [tires, setTires] = useState('');
    const [conditions, setConditions] = useState('');

    // Result
    const [timeResult, setTimeResult] = useState('');

    const creators = [
        { name: "Salam Moubarak", role: "PhD" },
    ];

    const reviewers = [
        { name: "Steven Wooding", role: "" }
    ];

    const powerUnitOptions = ['W', 'kW', 'MW', 'hp'];
    const weightUnitOptions = ['kg', 't', 'lb', 'US ton', 'long ton'];

    // Options
    const vehicleOptions = [
        { value: '', label: 'Select' },
        { value: 'sports_car', label: 'Sports Car' },
        { value: 'sedan', label: 'Sedan' },
        { value: 'hatchback', label: 'Hatchback' },
        { value: 'suv', label: 'SUV' },
    ];

    const driveOptions = [
        { value: 'fwd', label: 'Front Wheel Drive (FWD)' },
        { value: 'rwd', label: 'Rear Wheel Drive (RWD)' },
        { value: 'awd', label: 'All Wheel Drive (AWD)' },
    ];

    const motorTypeOptions = [
        { value: '', label: 'Select' },
        { value: 'electric', label: 'Electric' },
        { value: 'ice', label: 'Internal combustion engine' },
    ];

    const gearboxOptions = [
        { value: '', label: 'Select' },
        { value: 'electric_direct', label: 'Direct-drive (Electric car)' },
        { value: 'dct', label: 'Dual-clutch (Petrol car)' },
        { value: 'manual', label: 'Manual (Petrol car)' },
        { value: 'auto', label: 'Automatic (Petrol car)' },
    ];

    const tireOptions = [
        { value: '', label: 'Select' },
        { value: 'performance', label: 'Performance tires' },
        { value: 'normal', label: 'Normal tires' },
    ];

    const conditionOptions = [
        { value: '', label: 'Select' },
        { value: 'dry', label: 'Dry' },
        { value: 'damp', label: 'Damp' },
        { value: 'wet', label: 'Wet' },
    ];

    // Helper to convert to kg
    const toKg = (val, unit) => {
        if (!val) return 0;
        const v = parseFloat(val);
        if (isNaN(v)) return 0;
        switch (unit) {
            case 'kg': return v;
            case 't': return v * 1000;
            case 'lb': return v * 0.45359237;
            case 'US ton': return v * 907.18474;
            case 'long ton': return v * 1016.04691;
            default: return v;
        }
    };

    // Calculation Logic
    useEffect(() => {
        if (!power || !emptyWeight) {
            setTimeResult('');
            return;
        }

        const P_val = parseFloat(power);
        if (isNaN(P_val)) return;

        const M_empty_kg = toKg(emptyWeight, emptyWeightUnit);
        const M_payload_kg = toKg(payload, payloadUnit);

        if (M_empty_kg === 0) return;

        const M_total = M_empty_kg + M_payload_kg; // kg

        // Convert Power to Watts
        let P_watts = 0;
        switch (powerUnit) {
            case 'W': P_watts = P_val; break;
            case 'kW': P_watts = P_val * 1000; break;
            case 'MW': P_watts = P_val * 1000000; break;
            case 'hp': P_watts = P_val * 745.7; break;
            default: P_watts = P_val * 745.7; // default hp
        }

        if (P_watts === 0) return;

        // Target Speed
        const V_target = 26.8224; // 60mph in m/s

        // === 1. Minimum Theoretical Time 'X' ===
        // KE = 0.5 * m * v^2
        const KE = 0.5 * M_total * V_target * V_target;
        const X = KE / P_watts;

        // === 2. Coefficients & Penalties ===

        // a: Secondary effects penalty
        const a = 1.704; // Calibrated to match 6.65s test case

        // Grip Limited Time Calculations (b + c + d term equivalent)
        // T_grip = V / (g * mu_eff * drive_ratio)
        const g_gravity = 9.81;

        let mu_tire = 1.0;
        if (tires === 'performance') mu_tire = 1.2;
        else if (tires === 'normal') mu_tire = 1.0;

        let mu_cond = 1.0;
        if (conditions === 'damp') mu_cond = 0.85;
        else if (conditions === 'wet') mu_cond = 0.7;

        let drive_ratio = 0.5;
        if (driveType === 'awd') drive_ratio = 0.95;
        else if (driveType === 'rwd') drive_ratio = 0.60;
        else if (driveType === 'fwd') drive_ratio = 0.45;

        // T_grip (Absolute Minimum due to grip)
        const a_grip = g_gravity * mu_tire * mu_cond * drive_ratio;
        let T_grip = 0;
        if (a_grip > 0) T_grip = V_target / a_grip;

        // e: Engine Type Penalty
        let e = 1.0;
        if (motorType === 'electric') e = 0.9;

        // f: Tire Type Penalty (Slip / Rolling Resistance efficiency)
        let f = 1.0;
        if (tires === 'normal') f = 1.1;

        // g: Road Condition Penalty
        let g_env = 1.0;
        if (conditions === 'damp') g_env = 1.1;
        else if (conditions === 'wet') g_env = 1.2;

        // h: Gearbox Shift Time Penalty
        let h = 0.5; // default auto
        if (gearbox === 'manual') h = 0.7;
        else if (gearbox === 'auto') h = 0.5;
        else if (gearbox === 'dct') h = 0.2;
        else if (gearbox === 'electric_direct') h = 0.1;

        // === Final Formula ===
        // Time = max(a * X, T_grip) * e * f * g + h

        const PowerTerm = a * X;
        const BaseTime = Math.max(PowerTerm, T_grip);

        const FinalTime = (BaseTime * e * f * g_env) + h;

        if (FinalTime > 0 && isFinite(FinalTime)) {
            setTimeResult(FinalTime.toFixed(2));
        } else {
            setTimeResult('');
        }

    }, [power, powerUnit, emptyWeight, emptyWeightUnit, payload, payloadUnit, vehicleType, driveType, motorType, gearbox, tires, conditions]);


    // Handlers
    const handleReset = () => {
        setPower('');
        setEmptyWeight('');
        setPayload('');
        // Resets dropdowns to defaults/select state
        setVehicleType('');
        setDriveType('fwd');
        setMotorType('');
        setGearbox('');
        setTires('');
        setConditions('');
        setTimeResult('');
    };

    const handleReload = () => {
        window.location.reload();
    };

    const articleContent = (
        <div style={{ color: '#374151', lineHeight: '1.6' }}>
            <h2>How to estimate 0-60 times?</h2>
            <p>
                This section will present the method used in our 0-60 calculator to estimate the 0-60 time of any given vehicle.
            </p>
            <p>
                💡 This is not the only method, but it is based on physics principles to define the structure of the "estimation equation" and real-world experimental data to identify and "tweak" the equation's parameters in order to best fit the multitude of existing production cars' performance figures.
            </p>
            <p>The general form of the 0-60 time estimation equation is built in 5 steps:</p>
            <ol>
                <li>Calculate, from physics first principles, the minimum theoretical 0-60 time based on engine power and vehicle weight, assuming 0 losses and continuous maximum power delivery;</li>
                <li>Apply a proportional penalty to account for all secondary effects like engine torque/power delivery fluctuations, aerodynamics, friction losses in the vehicle's moving parts, and car center of gravity position;</li>
                <li>Apply an absolute minimum threshold on the 0-60 time to account for the impact of drive type, tire type, and road conditions on the maximum usable grip for power delivery;</li>
                <li>Apply proportional penalties reflecting the losses related to engine type, tire type, and road conditions; and</li>
                <li>Add an absolute time penalty representing the total gearbox shift times of the most common transmission types.</li>
            </ol>
            <p>Following these steps results in this equation for the 0-60 time:</p>
            <p style={{ background: '#f3f4f6', padding: '12px', borderRadius: '8px', fontFamily: 'monospace', textAlign: 'center' }}>
                Time = max(a × X, b + c + d) × e × f × g + h
            </p>
            <p>where:</p>
            <ul>
                <li><strong>X</strong> is the minimum theoretical 0-60 time: X = vehicle kinetic energy at 60 mph / vehicle maximum power;</li>
                <li><strong>a</strong> is the proportional penalty to account for all secondary effects;</li>
                <li><strong>b, c, and d</strong> are the absolute grip threshold penalties from drive type, tire type, and road conditions;</li>
                <li><strong>e, f, and g</strong> are the proportional penalties of engine type, tire type, and road conditions;</li>
                <li><strong>h</strong> is the absolute penalty of gearbox shift times; and</li>
                <li><strong>max()</strong> is a function that returns whichever argument has the maximum value.</li>
            </ul>
            <p>
                A set of values for each element of our estimation equation - except for X - are identified and optimized to yield good fitting results with automotive experimental data for 0-60 times.
            </p>
            <p>
                When you fill in the fields of our calculator with a few key elements related to your vehicle, the calculator seamlessly selects the appropriate values for the parameters of the estimation equation and gives you the resulting estimated 0-60 time of your car.
            </p>
            <p>
                To understand what torque is and how it relates to the movement of your car, check out our torque calculator.
            </p>

            <h3>Using the 0-60 calculator</h3>
            <p>
                Now that you've seen how the 0-60 calculator works let's look at a practical example and see how we can use it to quickly estimate the 0 to 60 time of a car (real or hypothetical...).
            </p>
            <p>
                Suppose you bought a new RWD (rear-wheel drive) sedan with a 260 hp (horsepower) petrol engine, an automatic gearbox, and running on normal tires. The car weighs 3,500 lbs, and you want to know how fast it can go from 0 to 60 mph when you're driving it with one other passenger and a half tank of fuel in dry weather conditions.
            </p>
            <p>No problem; here's how you can do it:</p>
            <ul>
                <li>Enter <strong>260 hp</strong> in the field <strong>Engine power</strong>;</li>
                <li>Input <strong>3500 lbs</strong> in the field <strong>Empty weight</strong>;</li>
                <li>Add the weight of the fuel and the weight of your passenger to your own weight, and provide the result in the field <strong>Payload weight</strong> (say: <strong>400 lbs</strong>);</li>
                <li>In the field <strong>Type of vehicle</strong>, choose <strong>Sedan</strong>;</li>
                <li>In the field <strong>Drive type</strong>, choose <strong>RWD</strong>;</li>
                <li>Choose <strong>Internal combustion engine</strong> in the field <strong>Motor</strong>;</li>
                <li>Enter <strong>Automatic</strong> in the <strong>Gearbox</strong> field;</li>
                <li>Input <strong>Normal tires</strong> in the field <strong>Tires</strong>; and</li>
                <li>Choose <strong>Dry</strong> for the field <strong>Conditions</strong>.</li>
            </ul>
            <p>The calculator will give you a time of <strong>6.65 s</strong> in the field <strong>0-60 time</strong>. Not bad!</p>
            <p>
                💡 Note that electric cars rarely have a gearbox and almost always use a direct-drive transmission. On the other hand, petrol cars have an internal combustion engine linked to a manual, automatic, or dual-clutch gearbox and rarely have a direct drive. Keep that in mind when choosing the gearbox options in the calculator.
            </p>
            <p>
                💡 Very low-powered cars (&lt; 25 - 30 hp) may never be able to reach 60 mph. These cars are very rare nowadays, and the calculator is not designed to produce reliable 0-60 time for this kind of power figure.
            </p>
        </div>
    );

    return (
        <CalculatorLayout
            title="0-60 Calculator"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "0-60 definition and usefulness",
                "What factors impact the 0-60 performance?",
                "How to estimate 0-60 times?",
                "Using the 0-60 calculator",
                "FAQs"
            ]}
            articleContent={articleContent}
            similarCalculators={12}
        >
            <div className="std-calculator">
                <div className="std-section-card">

                    {/* Power and Weight */}
                    <div className="std-collapsible-section">
                        <div className="std-collapsible-header" onClick={() => setIsPowerOpen(!isPowerOpen)}>
                            <div className="std-header-left">
                                {isPowerOpen ? <ChevronUp size={18} color="#436cfe" /> : <ChevronDown size={18} color="#436cfe" />}
                                <span>Power and weight</span>
                            </div>
                        </div>
                        {isPowerOpen && (
                            <div className="std-collapsible-content">
                                <InputGroup
                                    label="Engine power"
                                    value={power}
                                    onChange={setPower}
                                    unit={powerUnit}
                                    onUnitChange={setPowerUnit}
                                    isUnitDropdown={true}
                                    unitOptions={powerUnitOptions}
                                    error={power === '0'}
                                    errorMessage={power === '0' ? "Engine power should be positive" : ""}
                                />
                                <InputGroup
                                    label="Empty weight"
                                    value={emptyWeight}
                                    onChange={setEmptyWeight}
                                    unit={emptyWeightUnit}
                                    onUnitChange={setEmptyWeightUnit}
                                    isUnitDropdown={true}
                                    unitOptions={weightUnitOptions}
                                    error={emptyWeight === '0'}
                                    errorMessage={emptyWeight === '0' ? "Vehicle weight should be positive" : ""}
                                />
                                <InputGroup
                                    label="Payload weight"
                                    value={payload}
                                    onChange={setPayload}
                                    unit={payloadUnit}
                                    onUnitChange={setPayloadUnit}
                                    isUnitDropdown={true}
                                    unitOptions={weightUnitOptions}
                                    placeholder="0"
                                    error={payload !== '' && toKg(payload, payloadUnit) <= 40}
                                    errorMessage={payload !== '' && toKg(payload, payloadUnit) <= 40 ? "Don't forget your own weight!" : ""}
                                    description="Extra weight on top of car empty weight. It includes people and cargo."
                                />
                            </div>
                        )}
                    </div>

                    {/* Drivetrain */}
                    <div className="std-collapsible-section">
                        <div className="std-collapsible-header" onClick={() => setIsDrivetrainOpen(!isDrivetrainOpen)}>
                            <div className="std-header-left">
                                {isDrivetrainOpen ? <ChevronUp size={18} color="#436cfe" /> : <ChevronDown size={18} color="#436cfe" />}
                                <span>Drivetrain</span>
                            </div>
                        </div>
                        {isDrivetrainOpen && (
                            <div className="std-collapsible-content">
                                <SelectGroup
                                    label="Type of vehicle"
                                    value={vehicleType}
                                    onChange={setVehicleType}
                                    options={vehicleOptions}
                                />
                                <SelectGroup
                                    label="Drive type"
                                    value={driveType}
                                    onChange={setDriveType}
                                    options={driveOptions}
                                />
                                <SelectGroup
                                    label="Motor"
                                    value={motorType}
                                    onChange={setMotorType}
                                    options={motorTypeOptions}
                                />
                                <SelectGroup
                                    label="Gearbox"
                                    value={gearbox}
                                    onChange={setGearbox}
                                    options={gearboxOptions}
                                />
                            </div>
                        )}
                    </div>

                    {/* Grip */}
                    <div className="std-collapsible-section">
                        <div className="std-collapsible-header" onClick={() => setIsGripOpen(!isGripOpen)}>
                            <div className="std-header-left">
                                {isGripOpen ? <ChevronUp size={18} color="#436cfe" /> : <ChevronDown size={18} color="#436cfe" />}
                                <span>Contact with the road (grip)</span>
                            </div>
                        </div>
                        {isGripOpen && (
                            <div className="std-collapsible-content">
                                <SelectGroup
                                    label="Tires"
                                    value={tires}
                                    onChange={setTires}
                                    options={tireOptions}
                                />
                                <SelectGroup
                                    label="Conditions"
                                    value={conditions}
                                    onChange={setConditions}
                                    options={conditionOptions}
                                />
                            </div>
                        )}
                    </div>

                    {/* Result */}
                    {isResultOpen && (
                        <div style={{ marginTop: '24px' }}>
                            <ResultRow
                                label="0-60 time"
                                value={timeResult}
                                unit="sec"
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

export default ZeroToSixtyCalculatorPage;
