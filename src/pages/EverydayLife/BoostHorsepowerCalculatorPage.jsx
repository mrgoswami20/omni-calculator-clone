import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import InputGroup from '../../components/StandardCalculator/InputGroup';
import ResultRow from '../../components/StandardCalculator/ResultRow';
import ActionPanel from '../../components/StandardCalculator/ActionPanel';
import FeedbackRow from '../../components/StandardCalculator/FeedbackRow';
import '../../components/StandardCalculator/StandardCalculator.css';

const BoostHorsepowerCalculatorPage = () => {
    // Section States
    const [isOpen, setIsOpen] = useState(true);

    // Inputs
    const [originalPower, setOriginalPower] = useState('');
    const [originalPowerUnit, setOriginalPowerUnit] = useState('hp');

    const [boost, setBoost] = useState('6'); // Default from previous
    const [boostUnit, setBoostUnit] = useState('psi');

    // Result
    const [boostedPower, setBoostedPower] = useState('');
    const [boostedPowerUnit, setBoostedPowerUnit] = useState('hp');

    const creators = [
        { name: "Dawid Siuda", role: "" },
    ];

    const reviewers = [
        { name: "Anna Szczepanek", role: "PhD" },
        { name: "Rijk de Wet", role: "" }
    ];

    const powerUnitOptions = ['hp', 'kW'];
    const boostUnitOptions = ['psi', 'bar', 'kPa'];

    useEffect(() => {
        calculateBoostedPower();
    }, [originalPower, originalPowerUnit, boost, boostUnit, boostedPowerUnit]);

    const calculateBoostedPower = () => {
        if (!originalPower || !boost) {
            if (originalPower === '' || boost === '') {
                setBoostedPower('');
                return;
            }
        }

        const P_orig = parseFloat(originalPower);
        const B_val = parseFloat(boost);

        if (isNaN(P_orig) || isNaN(B_val)) return;

        // Normalize inputs to Standard Units (HP and PSI)
        // Power: hp (If kw, convert to hp)
        let P_hp = P_orig;
        if (originalPowerUnit === 'kW') P_hp = P_orig * 1.34102;

        // Boost: psi (If bar/kPa, convert to psi)
        let B_psi = B_val;
        if (boostUnit === 'bar') B_psi = B_val * 14.5038;
        if (boostUnit === 'kPa') B_psi = B_val * 0.145038;

        // Formula: P_new = P_old * (P_atm + B_psi) / P_atm
        const P_atm = 14.7; // Standard atmospheric pressure at sea level in psi

        const P_new_hp = P_hp * ((P_atm + B_psi) / P_atm);

        // Convert result to target unit
        let finalResult = P_new_hp;
        if (boostedPowerUnit === 'kW') finalResult = P_new_hp / 1.34102;

        if (isFinite(finalResult) && finalResult > 0) {
            setBoostedPower(finalResult.toLocaleString(undefined, { maximumFractionDigits: 1 }));
        } else {
            setBoostedPower('');
        }
    };

    const handleReset = () => {
        setOriginalPower('');
        setBoost('6');
        setBoostedPower('');
    };

    const handleReload = () => {
        window.location.reload();
    };

    const articleContent = (
        <div style={{ color: '#374151', lineHeight: '1.6' }}>
            <p>
                If you've ever wondered <strong>how much hp a supercharger adds</strong>, wonder no more; this <strong>boost horsepower calculator</strong> will help you calculate it in seconds!
            </p>
        </div>
    );

    return (
        <CalculatorLayout
            title="Boost Horsepower Calculator"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "How does a supercharger work?",
                "How to use this boost horsepower calculator?",
                "Supercharge vs turbocharge",
                "Other tools that might be useful for you"
            ]}
            articleContent={articleContent}
            similarCalculators={32}
        >
            <div className="std-calculator">
                <div className="std-section-card">

                    <div className="std-collapsible-section">
                        <div className="std-collapsible-header" onClick={() => setIsOpen(!isOpen)}>
                            <div className="std-header-left">
                                {isOpen ? <ChevronUp size={18} color="#436cfe" /> : <ChevronDown size={18} color="#436cfe" />}
                                <span>Horsepower boost</span>
                            </div>
                        </div>
                        {isOpen && (
                            <div className="std-collapsible-content">
                                {/* Current Engine Power */}
                                <InputGroup
                                    label={
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            Current engine power <Info size={14} style={{ color: '#9ca3af' }} />
                                        </span>
                                    }
                                    value={originalPower}
                                    onChange={setOriginalPower}
                                    unit={originalPowerUnit}
                                    onUnitChange={setOriginalPowerUnit}
                                    isUnitDropdown={true}
                                    unitOptions={powerUnitOptions}
                                />

                                {/* Boost Added */}
                                <InputGroup
                                    label={
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            Boost added <Info size={14} style={{ color: '#9ca3af' }} />
                                        </span>
                                    }
                                    value={boost}
                                    onChange={setBoost}
                                    unit={boostUnit}
                                    onUnitChange={setBoostUnit}
                                    isUnitDropdown={true}
                                    unitOptions={boostUnitOptions}
                                />

                                {/* Boosted Engine Power Result */}
                                <ResultRow
                                    label={
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            Boosted engine power <Info size={14} style={{ color: '#9ca3af' }} />
                                        </span>
                                    }
                                    value={boostedPower}
                                    unit={boostedPowerUnit}
                                    onUnitChange={setBoostedPowerUnit}
                                    isUnitDropdown={true}
                                    unitOptions={powerUnitOptions}
                                />
                            </div>
                        )}
                    </div>

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

export default BoostHorsepowerCalculatorPage;
