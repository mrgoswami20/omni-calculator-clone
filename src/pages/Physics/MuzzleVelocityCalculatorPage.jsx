import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, MoreHorizontal } from 'lucide-react';
import './MuzzleVelocityCalculatorPage.css';

const MuzzleVelocityCalculatorPage = () => {
    // Inputs
    const [mass, setMass] = useState('');
    const [massUnit, setMassUnit] = useState('gr'); // Default to grains for bullets

    const [velocity, setVelocity] = useState('');
    const [velocityUnit, setVelocityUnit] = useState('ft/s'); // Default to fps

    // Outputs
    const [energy, setEnergy] = useState('');
    const [energyUnit, setEnergyUnit] = useState('ft-lb');

    const [momentum, setMomentum] = useState('');
    const [momentumUnit, setMomentumUnit] = useState('lb·ft/s');

    const [showShareTooltip, setShowShareTooltip] = useState(false);

    // Unit Conversion Constants
    // Base Units: Mass = kg, Velocity = m/s (SI is easier for calc)
    // Actually, for ballistics, typical base is Grains and FPS.
    // Let's stick to SI (kg, m/s) for internal calculation to match previous calculators, or just convert as needed.

    // Mass Conversions (to kg)
    const GRAIN_TO_KG = 0.00006479891;
    const G_TO_KG = 0.001;
    const OZ_TO_KG = 0.0283495;
    const LBS_TO_KG = 0.453592;

    // Velocity Conversions (to m/s)
    const FPS_TO_MPS = 0.3048;
    const KMPH_TO_MPS = 0.277778;
    const MPH_TO_MPS = 0.44704;

    // Energy Conversions (from Joules)
    const J_TO_FT_LB = 0.737562;

    // Momentum Conversions (from kg·m/s (N·s))
    const NS_TO_LB_FT_S = 7.23301;

    useEffect(() => {
        calculateBallistics();
    }, [mass, massUnit, velocity, velocityUnit, energyUnit, momentumUnit]);

    const calculateBallistics = () => {
        const mVal = parseFloat(mass);
        const vVal = parseFloat(velocity);

        if (isNaN(mVal) || isNaN(vVal)) {
            setEnergy('');
            setMomentum('');
            return;
        }

        // 1. Convert Inputs to Base Units (kg and m/s)
        let massKg = mVal;
        if (massUnit === 'gr') massKg = mVal * GRAIN_TO_KG;
        else if (massUnit === 'g') massKg = mVal * G_TO_KG;
        else if (massUnit === 'oz') massKg = mVal * OZ_TO_KG;
        else if (massUnit === 'lbs') massKg = mVal * LBS_TO_KG;

        let velMps = vVal;
        if (velocityUnit === 'ft/s') velMps = vVal * FPS_TO_MPS;
        else if (velocityUnit === 'km/h') velMps = vVal * KMPH_TO_MPS;
        else if (velocityUnit === 'mph') velMps = vVal * MPH_TO_MPS;

        // 2. Calculate KE = 0.5 * m * v^2 (Joules)
        const keJoules = 0.5 * massKg * Math.pow(velMps, 2);

        // 3. Calculate Momentum = m * v (kg·m/s or N·s)
        const momNs = massKg * velMps;

        // 4. Convert Outputs
        // Energy
        let finalEnergy = keJoules;
        if (energyUnit === 'ft-lb') {
            finalEnergy = keJoules * J_TO_FT_LB;
        }
        // else J

        // Momentum
        let finalMomentum = momNs;
        if (momentumUnit === 'lb·ft/s') {
            finalMomentum = momNs * NS_TO_LB_FT_S;
        }
        // else kg·m/s (N·s)

        // 5. Format and Set State
        setEnergy(finalEnergy.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 }));
        setMomentum(finalMomentum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 3 }));
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setShowShareTooltip(true);
            setTimeout(() => setShowShareTooltip(false), 2000);
        } catch (err) { }
    };

    const handleClear = () => {
        setMass('');
        setVelocity('');
        setEnergy('');
        setMomentum('');
    };

    const articleContent = (
        <div>
            <p>
                The <strong>Muzzle Velocity Calculator</strong> allows you to calculate the kinetic energy and momentum of a projectile (such as a bullet) based on its mass and velocity.
            </p>
            <h3>Physics of Firearms</h3>
            <p>Two key properties describe a projectile's terminal ballistics performance:</p>
            <ul>
                <li><strong>Muzzle Energy</strong>: The kinetic energy of the bullet as it leaves the muzzle. It is calculated using the formula <code>KE = 0.5 &times; m &times; v<sup>2</sup></code>.</li>
                <li><strong>Momentum</strong>: The product of mass and velocity (<code>p = m &times; v</code>). It is often used to estimate the "stopping power" or recoil.</li>
            </ul>
        </div>
    );

    return (
        <CalculatorLayout
            title="Muzzle Velocity Calculator"
            creators={[{ name: "Omni Team" }]}
            reviewers={[]}
            tocItems={["What is muzzle velocity?", "Kinetic energy formula", "Momentum vs Energy"]}
            articleContent={articleContent}
        >
            <div className="muzzle-velocity-calculator-page">
                <div className="section-card">
                    {/* Mass Input */}
                    <div className="input-group">
                        <label className="input-label">Bullet Mass (m)<MoreHorizontal size={16} className="info-icon" /></label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="input-field"
                                value={mass}
                                onChange={(e) => setMass(e.target.value)}
                                placeholder="Enter mass"
                            />
                            <div className="unit-select-wrapper">
                                <select
                                    className="unit-select"
                                    value={massUnit}
                                    onChange={(e) => setMassUnit(e.target.value)}
                                >
                                    <option value="gr">grains</option>
                                    <option value="g">g</option>
                                    <option value="oz">oz</option>
                                    <option value="lbs">lbs</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Velocity Input */}
                    <div className="input-group">
                        <label className="input-label">Muzzle Velocity (v)<MoreHorizontal size={16} className="info-icon" /></label>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="input-field"
                                value={velocity}
                                onChange={(e) => setVelocity(e.target.value)}
                                placeholder="Enter velocity"
                            />
                            <div className="unit-select-wrapper">
                                <select
                                    className="unit-select"
                                    value={velocityUnit}
                                    onChange={(e) => setVelocityUnit(e.target.value)}
                                >
                                    <option value="ft/s">ft/s</option>
                                    <option value="m/s">m/s</option>
                                    <option value="km/h">km/h</option>
                                    <option value="mph">mph</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="section-card">
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '16px' }}>Ballistics Results</h3>

                    {/* Energy Output */}
                    <div className="input-group">
                        <label className="input-label">Muzzle Energy (KE)<MoreHorizontal size={16} className="info-icon" /></label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                className="input-field result-field"
                                value={energy}
                                readOnly
                                placeholder="Result"
                            />
                            <div className="unit-select-wrapper">
                                <select
                                    className="unit-select"
                                    value={energyUnit}
                                    onChange={(e) => setEnergyUnit(e.target.value)}
                                >
                                    <option value="ft-lb">ft-lb</option>
                                    <option value="J">J</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Momentum Output */}
                    <div className="input-group">
                        <label className="input-label">Momentum (p)<MoreHorizontal size={16} className="info-icon" /></label>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                className="input-field result-field"
                                value={momentum}
                                readOnly
                                placeholder="Result"
                            />
                            <div className="unit-select-wrapper">
                                <select
                                    className="unit-select"
                                    value={momentumUnit}
                                    onChange={(e) => setMomentumUnit(e.target.value)}
                                >
                                    <option value="lb·ft/s">lb·ft/s</option>
                                    <option value="kg·m/s">kg·m/s</option>
                                    <option value="N·s">N·s</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="section-card">
                    <div className="calc-actions-custom">
                        {/* <button className="share-result-btn-custom" onClick={handleShare}>
                            <div className="share-icon-circle-custom">
                                <Share2 size={24} />
                            </div>
                            Share result
                            {showShareTooltip && <span className="copied-tooltip">Copied!</span>}
                        </button> */}

                        <div className="secondary-actions-custom">
                            <button className="secondary-btn-custom" onClick={() => window.location.reload()}>
                                Reload calculator
                            </button>
                            <button className="secondary-btn-custom" onClick={handleClear}>
                                Clear all changes
                            </button>
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
            </div>
        </CalculatorLayout>
    );
};

export default MuzzleVelocityCalculatorPage;
