import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../components/CalculatorLayout';
import { Share2, ChevronDown, ChevronUp, Info } from 'lucide-react';
import './MpgCalculatorPage.css';

const MpgCalculatorPage = () => {
    // Inputs
    const [distance, setDistance] = useState('');
    const [distanceUnit, setDistanceUnit] = useState('mi');

    const [fuelUsed, setFuelUsed] = useState('');
    const [fuelUnit, setFuelUnit] = useState('gal_us');

    // Result
    const [economy, setEconomy] = useState('');
    const [economyUnit, setEconomyUnit] = useState('mpg_us');

    // Collapsible states
    const [isCostOpen, setIsCostOpen] = useState(false);

    // Optional Cost Logic
    const [fuelPrice, setFuelPrice] = useState('');
    const [priceUnit, setPriceUnit] = useState('USD/gal');
    const [tripCost, setTripCost] = useState('');

    const creators = [
        { name: "Mateusz Mucha", role: "" },
        { name: "James Mathison", role: "" },
    ];

    const reviewers = [
        { name: "Bogna Szyk", role: "" },
        { name: "Jack Bowater", role: "" }
    ];

    useEffect(() => {
        calculateEconomy();
    }, [distance, distanceUnit, fuelUsed, fuelUnit, economyUnit]);

    useEffect(() => {
        calculateCost();
    }, [fuelUsed, fuelPrice, fuelUnit, priceUnit]);

    const calculateEconomy = () => {
        if (!distance || !fuelUsed) {
            setEconomy('');
            return;
        }

        const d_val = parseFloat(distance);
        const f_val = parseFloat(fuelUsed);

        if (isNaN(d_val) || isNaN(f_val) || f_val === 0) return;

        // Convert to base units: Miles and US Gallons
        let dist_miles = d_val;
        if (distanceUnit === 'km') dist_miles = d_val * 0.621371;
        if (distanceUnit === 'm') dist_miles = d_val * 0.000621371;

        let fuel_gal_us = f_val;
        if (fuelUnit === 'gal_uk') fuel_gal_us = f_val * 1.20095;
        if (fuelUnit === 'l') fuel_gal_us = f_val * 0.264172;

        // Calculate US MPG
        const mpg_us = dist_miles / fuel_gal_us;

        // Convert to target unit
        let result = mpg_us;
        if (economyUnit === 'mpg_uk') {
            result = mpg_us * 1.20095;
        } else if (economyUnit === 'km/l') {
            // MPG_US * 0.425144 = km/l
            result = mpg_us * 0.425144;
        } else if (economyUnit === 'l/100km') {
            // 235.215 / MPG_US = l/100km
            result = 235.215 / mpg_us;
        }

        setEconomy(result.toLocaleString(undefined, { maximumFractionDigits: 2 }));
    };

    const calculateCost = () => {
        if (!fuelUsed || !fuelPrice) {
            setTripCost('');
            return;
        }
        const f = parseFloat(fuelUsed);
        const p = parseFloat(fuelPrice);
        if (isNaN(f) || isNaN(p)) return;

        // Simple multiplication if units match roughly or just ignore unit mismatch for simplicity 
        // as "price per unit" implies unit matches fuel unit typically in these simple calcs.
        // Assuming Price is per selected fuel unit.

        const cost = f * p;
        setTripCost(cost.toLocaleString(undefined, { maximumFractionDigits: 2 }));
    };

    const articleContent = (
        <>
            <p>
                This <strong>MPG calculator</strong> (a.k.a. mileage and fuel efficiency calculator) is a helpful tool that allows you to <strong>calculate your fuel consumption</strong>. When you plan a trip, you'll probably want to know how much it will cost before you set off.
            </p>
        </>
    );

    return (
        <CalculatorLayout
            title="MPG Calculator"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "What is gas mileage?",
                "How to use the mileage and fuel cost calculator",
                "FAQs"
            ]}
            articleContent={articleContent}
            similarCalculators={32}
        >
            <div className="calculator-card mpg-page">

                {/* Distance */}
                <div className="input-group">
                    <div className="label-row"><label>Distance</label><span className="more-options">...</span></div>
                    <div className="input-wrapper">
                        <input type="number" className="calc-input" value={distance} onChange={(e) => setDistance(e.target.value)} />
                        <div className="unit-select-container">
                            <select value={distanceUnit} onChange={(e) => setDistanceUnit(e.target.value)} className="unit-select">
                                <option value="mi">mi</option>
                                <option value="km">km</option>
                                <option value="m">m</option>
                            </select>
                            <ChevronDown size={14} className="unit-arrow" />
                        </div>
                    </div>
                </div>

                {/* Fuel Used */}
                <div className="input-group">
                    <div className="label-row"><label>Fuel used</label><span className="more-options">...</span></div>
                    <div className="input-wrapper">
                        <input type="number" className="calc-input" value={fuelUsed} onChange={(e) => setFuelUsed(e.target.value)} />
                        <div className="unit-select-container">
                            <select value={fuelUnit} onChange={(e) => setFuelUnit(e.target.value)} className="unit-select">
                                <option value="gal_us">gal (US)</option>
                                <option value="gal_uk">gal (UK)</option>
                                <option value="l">l</option>
                            </select>
                            <ChevronDown size={14} className="unit-arrow" />
                        </div>
                    </div>
                </div>

                {/* Fuel Economy (Result) */}
                <div className="input-group">
                    <div className="label-row"><label>Fuel economy</label><span className="more-options">...</span></div>
                    <div className="input-wrapper">
                        <input type="text" className="calc-input" readOnly value={economy} placeholder="Result" />
                        <div className="unit-select-container">
                            <select value={economyUnit} onChange={(e) => setEconomyUnit(e.target.value)} className="unit-select">
                                <option value="mpg_us">US mpg</option>
                                <option value="mpg_uk">UK mpg</option>
                                <option value="km/l">km/l</option>
                                <option value="l/100km">l/100km</option>
                            </select>
                            <ChevronDown size={14} className="unit-arrow" />
                        </div>
                    </div>
                </div>

                {/* Collapsible: Fuel price and trip cost */}
                <div className="collapsible-section">
                    <div className="collapsible-header" onClick={() => setIsCostOpen(!isCostOpen)}>
                        <div className="header-left">
                            {isCostOpen ? <ChevronUp size={18} color="#436cfe" /> : <ChevronDown size={18} color="#436cfe" />}
                            <span>Fuel price and trip cost</span>
                        </div>
                    </div>
                    {isCostOpen && (
                        <div className="collapsible-content">
                            <div className="input-group">
                                <div className="label-row"><label>Fuel price</label><span className="more-options">...</span></div>
                                <div className="input-wrapper">
                                    <input type="number" className="calc-input" value={fuelPrice} onChange={(e) => setFuelPrice(e.target.value)} placeholder="Price per unit" />
                                    {/* Simplified unit for price just to show intention */}
                                    <span className="unit-label-static">/unit</span>
                                </div>
                            </div>
                            <div className="input-group">
                                <div className="label-row"><label>Trip cost</label><span className="more-options">...</span></div>
                                <div className="input-wrapper">
                                    <input type="text" className="calc-input" readOnly value={tripCost} placeholder="Total cost" />
                                    <span className="unit-label-static">$</span>
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
                            setDistance('');
                            setFuelUsed('');
                            setEconomy('');
                            setFuelPrice('');
                            setTripCost('');
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

                <div className="check-out-box">
                    Check out <strong>32 similar</strong> transportation calculators
                </div>

            </div>
        </CalculatorLayout>
    );
};

export default MpgCalculatorPage;
