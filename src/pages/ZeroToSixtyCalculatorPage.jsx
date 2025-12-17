import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../components/CalculatorLayout';
import { Share2, ChevronDown, ChevronUp, Info } from 'lucide-react';
import './ZeroToSixtyCalculatorPage.css';

const ZeroToSixtyCalculatorPage = () => {
    // Section States
    const [isPowerOpen, setIsPowerOpen] = useState(true);
    const [isDrivetrainOpen, setIsDrivetrainOpen] = useState(true);
    const [isGripOpen, setIsGripOpen] = useState(true);
    const [isResultOpen, setIsResultOpen] = useState(true);

    // Inputs
    const [power, setPower] = useState('');
    const [emptyWeight, setEmptyWeight] = useState('');
    const [payload, setPayload] = useState('0'); // Default to 0? Screenshot shows empty or maybe 0 placeholder. 
    // Wait, screenshot shows "kg" and empty box.

    // Dropdowns
    const [vehicleType, setVehicleType] = useState('car');
    const [driveType, setDriveType] = useState('fwd');
    const [motorType, setMotorType] = useState('ice_na'); // Internal Combustion Natural Aspiration
    const [gearbox, setGearbox] = useState('manual');
    const [tires, setTires] = useState('road');
    const [conditions, setConditions] = useState('dry');

    // Result
    const [timeResult, setTimeResult] = useState('');

    const creators = [
        { name: "Salam Moubarak", role: "PhD" },
    ];

    const reviewers = [
        { name: "Steven Wooding", role: "" }
    ];

    // Options
    const vehicleOptions = [
        { value: 'car', label: 'Car' },
        { value: 'motorcycle', label: 'Motorcycle' },
        { value: 'truck', label: 'Truck' },
    ];

    const driveOptions = [
        { value: 'fwd', label: 'Front Wheel Drive (FWD)' },
        { value: 'rwd', label: 'Rear Wheel Drive (RWD)' },
        { value: 'awd', label: 'All Wheel Drive (AWD)' },
    ];

    const motorOptions = [
        { value: 'ice_na', label: 'Electric' }, // Wait, screenshot says "Select", I should put sensible defaults
        { value: 'ice_turbo', label: 'Turbocharged' },
        { value: 'electric', label: 'Electric' },
        { value: 'hybrid', label: 'Hybrid' },
    ];
    // Correcting Motor Options to match general expectations if not visible:
    // Let's stick to: Naturally Aspirated, Turbocharged, Supercharged, Electric
    const motorTypeOptions = [
        { value: 'na', label: 'Naturally Aspirated (Gasoline/Diesel)' },
        { value: 'turbo', label: 'Turbocharged' },
        { value: 'super', label: 'Supercharged' },
        { value: 'electric', label: 'Electric' },
    ];

    const gearboxOptions = [
        { value: 'manual', label: 'Manual' },
        { value: 'auto', label: 'Automatic' },
        { value: 'dct', label: 'Dual Clutch (DCT)' },
        { value: 'cvt', label: 'CVT' },
    ];

    const tireOptions = [
        { value: 'road', label: 'Standard Road Tires' },
        { value: 'sport', label: 'Sport / Summer Tires' },
        { value: 'slick', label: 'Slicks / Drag Radials' },
        { value: 'offroad', label: 'Off-road / Knobby' },
    ];

    const conditionOptions = [
        { value: 'dry', label: 'Dry Asphalt' },
        { value: 'wet', label: 'Wet Asphalt' },
        { value: 'gravel', label: 'Gravel' },
        { value: 'snow', label: 'Snow / Ice' },
    ];

    // Calculation Logic
    useEffect(() => {
        if (!power || !emptyWeight) {
            setTimeResult('');
            return;
        }

        const P_hp = parseFloat(power);
        const M_empty = parseFloat(emptyWeight);
        const M_payload = parseFloat(payload || 0);

        if (isNaN(P_hp) || isNaN(M_empty)) return;

        const M_total = M_empty + M_payload; // kg
        const P_watts = P_hp * 745.7; // Watts

        // Target Speed
        const V_target = 26.8224; // 60mph in m/s

        // 1. Ideal Physics Time (Energy Limited)
        // KE = 0.5 * m * v^2
        // Power = dE/dt => t = E / P
        // But power isn't constant at wheels (torque curves, etc)
        // Empirical Formula approximation:
        // t = (Mass / Power) * Factor
        // "Rodgers Formula": t = 0.00426 * Weight(lb) / Power(hp) * speed_factor? No.
        // Simple: t = (M_total * V_target^2) / (2 * P_watts * Efficiency)

        let efficiency = 0.85; // Base loss

        // Adjust for Drivetrain loss
        if (driveType === 'awd') efficiency *= 0.90; // More loss
        else if (driveType === 'rwd') efficiency *= 0.95;
        else efficiency *= 0.95; // FWD

        // Adjust for Gearbox (Shift times)
        // Assume 2 shifts for 0-60 usually.
        let shiftTime = 0.0;
        if (gearbox === 'manual') shiftTime = 0.5 * 2;
        if (gearbox === 'auto') shiftTime = 0.2 * 2;
        if (gearbox === 'dct') shiftTime = 0.1 * 2;
        if (gearbox === 'cvt') shiftTime = 0;
        if (motorType === 'electric') shiftTime = 0; // 1 gear usually

        // Power delivery factor (Torque curve)
        let powerDelivery = 1.0;
        if (motorType === 'electric') powerDelivery = 1.0; // Instant torque
        else if (motorType === 'turbo') powerDelivery = 0.9; // Lag
        else powerDelivery = 0.85; // NA build up

        // Time Power Limited
        // T_p = (0.5 * M * V^2) / (P_avg) + ShiftTime
        // P_avg approx P_peak * powerDelivery
        const P_avg = P_watts * powerDelivery * efficiency;
        const Energy = 0.5 * M_total * V_target * V_target;
        let T_power = (Energy / P_avg) + shiftTime;


        // 2. Grip Limited Time
        // Max Accel = g * mu * Weight_on_drive_wheels / Total_Weight
        // Weight transfer helps RWD, hurts FWD.
        // Static distribution approx: FWD 60/40, RWD 50/50, AWD 100

        let mu = 1.0;
        // Tire factor
        if (tires === 'sport') mu = 1.1;
        if (tires === 'slick') mu = 1.3;
        if (tires === 'offroad') mu = 0.7;

        // Condition factor
        if (conditions === 'wet') mu *= 0.7;
        if (conditions === 'gravel') mu *= 0.5;
        if (conditions === 'snow') mu *= 0.3;

        // Drive wheels ratio (simplified dynamic load)
        let driveRatio = 0.5;
        if (vehicleType === 'motorcycle') driveRatio = 0.9; // Rear heavy on accel
        else if (driveType === 'awd') driveRatio = 1.0;
        else if (driveType === 'rwd') driveRatio = 0.65; // Weight transfer
        else if (driveType === 'fwd') driveRatio = 0.45; // Unloads front

        const g = 9.81;
        const a_max = g * mu * driveRatio;

        let T_grip = V_target / a_max;

        // Final Time is basically the slower of the two (limited by power or grip)
        // But grip limit only applies in 1st gear mostly.
        // So we can approximate: if T_grip > T_power_start, we lose time.
        // Easier approx: Max(T_power, T_grip)

        let finalTime = Math.max(T_power, T_grip);

        // Sanity check / Tweaks
        // Real cars: 
        // 1500kg, 150hp -> ~9s
        // Calc: 1500kg, 111kw. E=540kJ. T=540/111=4.8s. Too fast.
        // factor of ~1.8 needed. Why? P_avg is much lower than peak. 
        // P_avg for ICE is like 0.5-0.6 of peak during sweep.
        // Electric is higher.

        // Refining P_avg factor:
        let engineFactor = 0.55;
        if (motorType === 'turbo') engineFactor = 0.60;
        if (motorType === 'electric') engineFactor = 0.85;

        const P_real_avg = P_watts * efficiency * engineFactor;
        T_power = (Energy / P_real_avg) + shiftTime;

        finalTime = Math.max(T_power, T_grip);

        setTimeResult(finalTime.toFixed(2));

    }, [power, emptyWeight, payload, vehicleType, driveType, motorType, gearbox, tires, conditions]);


    const articleContent = (
        <>
            <p>
                In this <strong>0-60 calculator</strong>, you will learn what 0-60 means and why the 0-60 time is one of the most important parameters when it comes to <strong>car performance</strong>.
            </p>
        </>
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
            <div className="calculator-card zero-sixty-page">

                {/* Power and Weight */}
                <div className="collapsible-section no-border-top">
                    <div className="collapsible-header" onClick={() => setIsPowerOpen(!isPowerOpen)}>
                        <div className="header-left">
                            {isPowerOpen ? <ChevronUp size={18} color="#436cfe" /> : <ChevronDown size={18} color="#436cfe" />}
                            <span>Power and weight</span>
                        </div>
                    </div>
                    {isPowerOpen && (
                        <div className="collapsible-content">
                            <div className="input-group">
                                <div className="label-row"><label>Engine power <Info size={12} className="info-icon" /></label><span className="more-options">...</span></div>
                                <div className="input-wrapper">
                                    <input type="number" className="calc-input" value={power} onChange={(e) => setPower(e.target.value)} />
                                    <span className="unit-label-static">hp(I)</span>
                                </div>
                            </div>
                            <div className="input-group">
                                <div className="label-row"><label>Empty weight</label><span className="more-options">...</span></div>
                                <div className="input-wrapper">
                                    <input type="number" className="calc-input" value={emptyWeight} onChange={(e) => setEmptyWeight(e.target.value)} />
                                    <span className="unit-label-static">kg</span>
                                </div>
                            </div>
                            <div className="input-group">
                                <div className="label-row"><label>Payload weight <Info size={12} className="info-icon" /></label><span className="more-options">...</span></div>
                                <div className="input-wrapper">
                                    <input type="number" className="calc-input" value={payload} onChange={(e) => setPayload(e.target.value)} />
                                    <span className="unit-label-static">kg</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Drivetrain */}
                <div className="collapsible-section">
                    <div className="collapsible-header" onClick={() => setIsDrivetrainOpen(!isDrivetrainOpen)}>
                        <div className="header-left">
                            {isDrivetrainOpen ? <ChevronUp size={18} color="#436cfe" /> : <ChevronDown size={18} color="#436cfe" />}
                            <span>Drivetrain</span>
                        </div>
                    </div>
                    {isDrivetrainOpen && (
                        <div className="collapsible-content">
                            <div className="input-group">
                                <div className="label-row"><label>Type of vehicle</label><span className="more-options">...</span></div>
                                <div className="select-wrapper">
                                    <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)} className="calc-select">
                                        {vehicleOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                    <ChevronDown size={14} className="select-arrow" />
                                </div>
                            </div>
                            <div className="input-group">
                                <div className="label-row"><label>Drive type</label><span className="more-options">...</span></div>
                                <div className="select-wrapper">
                                    <select value={driveType} onChange={(e) => setDriveType(e.target.value)} className="calc-select">
                                        {driveOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                    <ChevronDown size={14} className="select-arrow" />
                                </div>
                            </div>
                            <div className="input-group">
                                <div className="label-row"><label>Motor</label><span className="more-options">...</span></div>
                                <div className="select-wrapper">
                                    <select value={motorType} onChange={(e) => setMotorType(e.target.value)} className="calc-select">
                                        {motorTypeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                    <ChevronDown size={14} className="select-arrow" />
                                </div>
                            </div>
                            <div className="input-group">
                                <div className="label-row"><label>Gearbox</label><span className="more-options">...</span></div>
                                <div className="select-wrapper">
                                    <select value={gearbox} onChange={(e) => setGearbox(e.target.value)} className="calc-select">
                                        {gearboxOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                    <ChevronDown size={14} className="select-arrow" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Grip */}
                <div className="collapsible-section">
                    <div className="collapsible-header" onClick={() => setIsGripOpen(!isGripOpen)}>
                        <div className="header-left">
                            {isGripOpen ? <ChevronUp size={18} color="#436cfe" /> : <ChevronDown size={18} color="#436cfe" />}
                            <span>Contact with the road (grip)</span>
                        </div>
                    </div>
                    {isGripOpen && (
                        <div className="collapsible-content">
                            <div className="input-group">
                                <div className="label-row"><label>Tires</label><span className="more-options">...</span></div>
                                <div className="select-wrapper">
                                    <select value={tires} onChange={(e) => setTires(e.target.value)} className="calc-select">
                                        {tireOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                    <ChevronDown size={14} className="select-arrow" />
                                </div>
                            </div>
                            <div className="input-group">
                                <div className="label-row"><label>Conditions</label><span className="more-options">...</span></div>
                                <div className="select-wrapper">
                                    <select value={conditions} onChange={(e) => setConditions(e.target.value)} className="calc-select">
                                        {conditionOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                    <ChevronDown size={14} className="select-arrow" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Result */}
                <div className="collapsible-section">
                    <div className="collapsible-header" onClick={() => setIsResultOpen(!isResultOpen)}>
                        <div className="header-left">
                            {isResultOpen ? <ChevronUp size={18} color="#436cfe" /> : <ChevronDown size={18} color="#436cfe" />}
                            <span>Result</span>
                        </div>
                    </div>
                    {isResultOpen && (
                        <div className="collapsible-content">
                            <div className="input-group">
                                <div className="label-row"><label>0-60 time</label><span className="more-options">...</span></div>
                                <div className="input-wrapper">
                                    <input type="text" className="calc-input" readOnly value={timeResult} placeholder="Result" />
                                    <span className="unit-label-static">sec</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="calc-actions">
                    <button className="share-result-btn">
                        <div className="share-icon-circle"><Share2 size={14} /></div>
                        Share result
                    </button>
                    <div className="secondary-actions">
                        <button className="secondary-btn">Reload calculator</button>
                        <button className="secondary-btn" onClick={() => {
                            setPower('');
                            setEmptyWeight('');
                            setTimeResult('');
                        }}>Clear all changes</button>
                    </div>
                </div>

                <div className="feedback-section">
                    <p>Did we solve your problem today?</p>
                    <div className="feedback-btns">
                        <button>Yes</button>
                        <button>No</button>
                    </div>
                </div>

            </div>
        </CalculatorLayout>
    );
};

export default ZeroToSixtyCalculatorPage;
