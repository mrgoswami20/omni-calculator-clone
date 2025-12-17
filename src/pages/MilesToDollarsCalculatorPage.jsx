import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../components/CalculatorLayout';
import { Share2, ChevronDown, ChevronUp, Info } from 'lucide-react';
import './MilesToDollarsCalculatorPage.css';

const MilesToDollarsCalculatorPage = () => {
    // Section States
    const [isAirlineOpen, setIsAirlineOpen] = useState(true);
    const [isPriceOpen, setIsPriceOpen] = useState(true);
    const [isComparisonOpen, setIsComparisonOpen] = useState(true);

    // Inputs
    const [airline, setAirline] = useState('american');
    const [milesValue, setMilesValue] = useState('1.5'); // cents

    const [costInMiles, setCostInMiles] = useState('');
    const [additionalFees, setAdditionalFees] = useState('0');

    // Comparison Input
    const [cashPrice, setCashPrice] = useState('');

    // Results
    const [finalPrice, setFinalPrice] = useState('');
    const [priceDifference, setPriceDifference] = useState('');
    const [percentage, setPercentage] = useState('');

    const creators = [
        { name: "Filip Hus", role: "" },
    ];

    const reviewers = [
        { name: "Dominik Czernia", role: "PhD" },
        { name: "Adena Benn", role: "" }
    ];

    const airlines = [
        { value: 'american', label: 'American Airlines', val: 1.5 },
        { value: 'delta', label: 'Delta Air Lines', val: 1.2 },
        { value: 'united', label: 'United Airlines', val: 1.2 },
        { value: 'southwest', label: 'Southwest Airlines', val: 1.3 },
        { value: 'jetblue', label: 'JetBlue Airways', val: 1.3 },
        { value: 'alaska', label: 'Alaska Airlines', val: 1.4 },
        { value: 'british', label: 'British Airways', val: 1.0 },
        { value: 'custom', label: 'Custom', val: 0 },
    ];

    // Update miles value on airline change
    useEffect(() => {
        const selected = airlines.find(a => a.value === airline);
        if (selected && selected.value !== 'custom') {
            setMilesValue(selected.val.toString());
        }
    }, [airline]);

    // Calculate
    useEffect(() => {
        calculate();
    }, [milesValue, costInMiles, additionalFees, cashPrice]);

    const calculate = () => {
        const m_val_cents = parseFloat(milesValue);
        const c_miles = parseFloat(costInMiles);
        const fees = parseFloat(additionalFees || '0');
        const cash = parseFloat(cashPrice);

        // Check if essential inputs are valid numbers
        if (isNaN(m_val_cents) || isNaN(c_miles)) {
            setFinalPrice('');
            setPriceDifference('');
            setPercentage('');
            return;
        }

        // Final Price = (Miles * Value/100) + Fees
        const price = (c_miles * m_val_cents / 100) + fees;
        setFinalPrice(price.toLocaleString(undefined, { maximumFractionDigits: 2 }));

        // Comparison
        if (!isNaN(cash) && cashPrice !== '') {
            // Difference: Cash Price - Calculated Miles Price
            const diff = cash - price;
            setPriceDifference(diff.toLocaleString(undefined, { maximumFractionDigits: 2 }));

            if (cash !== 0) {
                const pct = (diff / cash) * 100;
                setPercentage(pct.toLocaleString(undefined, { maximumFractionDigits: 2 }));
            } else {
                setPercentage('0');
            }
        } else {
            // If cash price is empty or invalid, clear comparison results
            setPriceDifference('');
            setPercentage('');
        }
    };

    const articleContent = (
        <>
            <p>
                Our <strong>airline miles to dollars calculator</strong> estimates <strong>how much your airline miles are worth in dollars</strong>. It also helps you to choose the best option between <strong>booking with miles</strong> or <strong>booking with cash</strong>.
            </p>
        </>
    );

    return (
        <CalculatorLayout
            title="Miles to Dollars Calculator"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "Airlines and miles",
                "How to get airline miles?",
                "Fees when redeeming award flights",
                "Where to find the average price per mile?",
                "Estimated value of a mile",
                "FAQs"
            ]}
            articleContent={articleContent}
            similarCalculators={32}
        >
            <div className="calculator-card miles-to-dollars-page">

                {/* Section 1: Airline */}
                <div className="collapsible-section no-border-top">
                    <div className="collapsible-header" onClick={() => setIsAirlineOpen(!isAirlineOpen)}>
                        <div className="header-left">
                            {isAirlineOpen ? <ChevronUp size={18} color="#436cfe" /> : <ChevronDown size={18} color="#436cfe" />}
                            <span>Airline and miles value</span>
                        </div>
                    </div>
                    {isAirlineOpen && (
                        <div className="collapsible-content">
                            <div className="input-group">
                                <div className="label-row"><label>Airline <Info size={12} className="info-icon" /></label><span className="more-options">...</span></div>
                                <div className="select-wrapper">
                                    <select value={airline} onChange={(e) => setAirline(e.target.value)} className="calc-select">
                                        {airlines.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                                    </select>
                                    <ChevronDown size={14} className="select-arrow" />
                                </div>
                            </div>
                            <div className="input-group">
                                <div className="label-row"><label>Miles value <Info size={12} className="info-icon" /></label><span className="more-options">...</span></div>
                                <div className="input-wrapper">
                                    <input type="number" className="calc-input" value={milesValue} onChange={(e) => setMilesValue(e.target.value)} />
                                    <span className="unit-label-static">cents</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Section 2: Price with Miles */}
                <div className="collapsible-section">
                    <div className="collapsible-header" onClick={() => setIsPriceOpen(!isPriceOpen)}>
                        <div className="header-left">
                            {isPriceOpen ? <ChevronUp size={18} color="#436cfe" /> : <ChevronDown size={18} color="#436cfe" />}
                            <span>Price when booked with miles</span>
                        </div>
                    </div>
                    {isPriceOpen && (
                        <div className="collapsible-content">
                            <div className="input-group">
                                <div className="label-row"><label>Cost in miles</label><span className="more-options">...</span></div>
                                <div className="input-wrapper">
                                    <input type="number" className="calc-input" value={costInMiles} onChange={(e) => setCostInMiles(e.target.value)} />
                                    <span className="unit-label-static">miles</span>
                                </div>
                            </div>
                            <div className="input-group">
                                <div className="label-row"><label>Additional cost in cash and fees (if any)</label><span className="more-options">...</span></div>
                                <div className="input-wrapper">
                                    <input type="number" className="calc-input" value={additionalFees} onChange={(e) => setAdditionalFees(e.target.value)} />
                                    <span className="unit-label-static">$</span>
                                </div>
                            </div>
                            <div className="input-group">
                                <div className="label-row"><label>Final price</label><span className="more-options">...</span></div>
                                <div className="input-wrapper">
                                    <input type="text" className="calc-input" readOnly value={finalPrice} placeholder="Result" />
                                    <span className="unit-label-static">$</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Section 3: Comparison */}
                <div className="collapsible-section">
                    <div className="collapsible-header" onClick={() => setIsComparisonOpen(!isComparisonOpen)}>
                        <div className="header-left">
                            {isComparisonOpen ? <ChevronUp size={18} color="#436cfe" /> : <ChevronDown size={18} color="#436cfe" />}
                            <span>Comparison with cash only price</span>
                        </div>
                    </div>
                    {isComparisonOpen && (
                        <div className="collapsible-content">
                            <div className="input-group">
                                <div className="label-row"><label>Cost in cash</label><span className="more-options">...</span></div>
                                <div className="input-wrapper">
                                    <input type="number" className="calc-input" value={cashPrice} onChange={(e) => setCashPrice(e.target.value)} />
                                    <span className="unit-label-static">$</span>
                                </div>
                            </div>
                            {cashPrice && (
                                <>
                                    <div className="input-group">
                                        <div className="label-row"><label>Price difference <Info size={12} className="info-icon" /></label><span className="more-options">...</span></div>
                                        <div className="input-wrapper">
                                            <input type="text" className="calc-input" readOnly value={priceDifference} />
                                            <span className="unit-label-static">$</span>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <div className="label-row"><label>Percentage <Info size={12} className="info-icon" /></label><span className="more-options">...</span></div>
                                        <div className="input-wrapper">
                                            <input type="text" className="calc-input" readOnly value={percentage} />
                                            <span className="unit-label-static">%</span>
                                        </div>
                                    </div>
                                </>
                            )}
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
                            setCostInMiles('');
                            setAdditionalFees('0');
                            setCashPrice('');
                            setFinalPrice('');
                            setPriceDifference('');
                            setPercentage('');
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

export default MilesToDollarsCalculatorPage;
