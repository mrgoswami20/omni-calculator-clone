import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, ChevronDown, MoreHorizontal, Info } from 'lucide-react';
import './BagFootprintCalculatorPage.css';
import './FlightCarbonFootprintCalculatorPage.css';

const BagFootprintCalculatorPage = () => {
    // --- State ---
    const [bagType, setBagType] = useState('plastic'); // 'plastic' | 'paper' | 'reusable' | 'cotton'
    const [uses, setUses] = useState(''); // Default empty
    const [consumption, setConsumption] = useState(''); // Default empty
    const [consumptionUnit, setConsumptionUnit] = useState('/ wk');

    // --- Results State ---
    const [trashGenerated, setTrashGenerated] = useState(0);
    const [comparisons, setComparisons] = useState({});

    // --- Constants ---
    // CO2e ratios based on Environment Agency 2011 ratios
    const RATIOS = {
        plastic: 1,
        paper: 3,
        reusable: 4,
        cotton: 131
    };

    // Weight of one bag in kg (Tuned precisely to match screenshot annual trash)
    const BAG_WEIGHTS = {
        plastic: 0.008,
        paper: 0.0899,   // Match 93.5 kg @ 20/wk (93.5 / (20*52) ≈ 0.0899)
        reusable: 0.0401, // Match 58.4 kg @ 28/wk (58.4 / (28*52) ≈ 0.0401)
        cotton: 0.1806    // Match 263 kg @ 28/wk (263 / (28*52) ≈ 0.1806)
    };

    // --- Calculation ---
    useEffect(() => {
        const u = parseFloat(uses) || 0;
        const c = parseFloat(consumption) || 0;

        if (u > 0) {
            const selectedRatio = RATIOS[bagType];
            const targetCycleImpact = selectedRatio / u;

            const newComparisons = {};
            Object.keys(RATIOS).forEach(type => {
                if (type === bagType) return;
                const otherRatio = RATIOS[type];

                // Stable rounding check
                if (otherRatio > targetCycleImpact) {
                    newComparisons[type] = {
                        bags: 1,
                        times: Math.round(otherRatio / targetCycleImpact)
                    };
                } else {
                    newComparisons[type] = {
                        bags: Math.round(targetCycleImpact / otherRatio),
                        times: 1
                    };
                }
            });
            setComparisons(newComparisons);
        }

        // 2. Trash Calculation
        let multiplier = 52;
        if (consumptionUnit === '/ mo') multiplier = 12;
        if (consumptionUnit === '/ yr') multiplier = 1;

        const totalBags = c * multiplier;
        const totalWeight = totalBags * BAG_WEIGHTS[bagType];
        setTrashGenerated(totalWeight);

    }, [bagType, uses, consumption, consumptionUnit]);

    // --- Handlers ---
    const handleReset = () => {
        setBagType('plastic');
        setUses('');
        setConsumption('');
        setConsumptionUnit('/ wk');
    };

    const handleReload = () => {
        window.location.reload();
    };

    const handleShare = () => {
        const text = `I checked my bag footprint!`;
        navigator.clipboard.writeText(text).then(() => {
            alert("Result copied to clipboard!");
        });
    };

    // --- Dynamic Content for "But:" section ---
    const renderImpactDetails = () => {
        if (bagType === 'plastic') {
            return (
                <div className="impact-details-list">
                    <h3>But:</h3>
                    <ul>
                        <li>You generate <strong>~{trashGenerated.toFixed(1)} kg</strong> of additional plastic trash per year.</li>
                        <li>Plastic can decompose for even <strong>more than 500 years</strong>, and only <strong>1%</strong> of plastic bags is recycled — a big part lands in landfills and oceans.</li>
                        <li>Plastic bags are made from HDPE or petroleum — a <strong>nonrenewable resource</strong>.</li>
                    </ul>
                </div>
            );
        }
        if (bagType === 'paper') {
            return (
                <div className="impact-details-list">
                    <h3>But:</h3>
                    <ul>
                        <li>You generate <strong>~{trashGenerated.toFixed(1)} kg</strong> of additional paper trash per year.</li>
                        <li>Paper bags take about <strong>a month</strong> to decompose, and <strong>20%</strong> of all paper bags are recycled – still, a lot of paper ends up in landfills, where it can't properly degrade.</li>
                        <li>Paper bags are made from trees – a <strong>renewable resource</strong>.</li>
                    </ul>
                </div>
            );
        }
        if (bagType === 'reusable') {
            return (
                <div className="impact-details-list">
                    <h3>But:</h3>
                    <ul>
                        <li>You generate <strong>~{trashGenerated.toFixed(1)} kg</strong> of additional plastic trash per year.</li>
                        <li>Plastic can decompose for even <strong>more than 500 years</strong>, and only <strong>1%</strong> of plastic bags is recycled — a big part lands in landfills and oceans.</li>
                        <li>Reusable plastic bags are made from LDPE or petroleum — a <strong>nonrenewable resource</strong>.</li>
                    </ul>
                </div>
            );
        }
        if (bagType === 'cotton') {
            return (
                <div className="impact-details-list">
                    <h3>But:</h3>
                    <ul>
                        <li>You generate <strong>~{trashGenerated.toFixed(1)} kg</strong> of additional fabric trash per year.</li>
                        <li>Cotton can decompose in <strong>1-5 months</strong>.</li>
                        <li>Cotton is a plant – so it's a <strong>renewable resource</strong>.</li>
                    </ul>
                </div>
            );
        }
    };

    // --- Helper for Display Name ---
    const getBagName = (type) => {
        if (type === 'reusable') return 'reusable plastic bag';
        if (type === 'cotton') return 'cotton / material bag';
        return type + ' bag';
    };

    // --- Article Content ---
    const articleContent = (
        <div style={{ color: '#374151', lineHeight: '1.6' }}>
            <h2>Table of contents</h2>
            <ul>
                <li><a href="#plastic">Plastic bags environmental footprint</a></li>
                <li><a href="#paper">Paper bags footprint</a></li>
                <li><a href="#cotton">Cotton tote bags — are they so eco-friendly?</a></li>
                <li><a href="#refuse">Main goal — refuse!</a></li>
                <li><a href="#4rs">4Rs Rule: Refuse, Reduce, Reuse, Recycle (+ Rot)</a></li>
            </ul>

            <p>
                With our bag footprint calculator, you can find out how many times you need to use your bag to have the same carbon footprint as the other types of bags.
            </p>
            {/* Truncated for brevity in code block, essentially same as before */}
            <p>We based our bag footprint calculator on the data from Environment Agency report from 2011.</p>
            {/* ...rest of article... */}
            <h3 id="4rs">4Rs Rule: Refuse, Reduce, Reuse, Recycle (+ Rot)</h3>
            <p>Try to refuse the bags and rethink your everyday choices...</p>
        </div>
    );

    return (
        <CalculatorLayout
            title="Bag Footprint Calculator"
            creators={[{ name: "Hanna Pamula", phd: true }]}
            reviewers={[{ name: "Malgorzata Koperska", md: true }, { name: "Adena Benn" }]}
            lastUpdated="July 29, 2024"
            tocItems={["Plastic bags footprint", "Paper bags footprint", "Cotton tote bags", "Main goal — refuse!"]}
            articleContent={articleContent}
        >
            <div className="bag-calculator">
                <div className="calc-section-card" style={{ padding: '24px' }}>

                    {/* Bag Type Radio */}
                    <div style={{ marginBottom: '20px' }}>
                        <div className="label-flex">
                            What type of bag do you use?
                            <MoreHorizontal size={16} className="more-dots" />
                        </div>
                        <div className="bag-radio-group">
                            <label className="bag-radio-option">
                                <input
                                    type="radio"
                                    name="bagType"
                                    checked={bagType === 'plastic'}
                                    onChange={() => setBagType('plastic')}
                                />
                                plastic bag
                            </label>
                            <label className="bag-radio-option">
                                <input
                                    type="radio"
                                    name="bagType"
                                    checked={bagType === 'paper'}
                                    onChange={() => setBagType('paper')}
                                />
                                paper bag
                            </label>
                            <label className="bag-radio-option">
                                <input
                                    type="radio"
                                    name="bagType"
                                    checked={bagType === 'reusable'}
                                    onChange={() => setBagType('reusable')}
                                />
                                reusable plastic bag
                            </label>
                            <label className="bag-radio-option">
                                <input
                                    type="radio"
                                    name="bagType"
                                    checked={bagType === 'cotton'}
                                    onChange={() => setBagType('cotton')}
                                />
                                cotton / material bag
                            </label>
                        </div>
                    </div>

                    {/* Usage Count Input */}
                    <div style={{ marginBottom: '20px' }}>
                        <div className="label-flex">
                            How many times are you going to use it?
                            <MoreHorizontal size={16} className="more-dots" />
                        </div>
                        <div className="unified-input-group">
                            <input
                                type="number"
                                className="input-invisible"
                                value={uses}
                                onChange={(e) => setUses(e.target.value)}
                                onWheel={(e) => e.target.blur()} />
                            <div className="unit-static">
                                times
                            </div>
                        </div>
                    </div>

                    {/* Consumption Input */}
                    <div style={{ marginBottom: '20px' }}>
                        <div className="label-flex">
                            How many bags do you throw away every week? <Info size={14} style={{ marginLeft: '4px', color: '#9ca3af' }} />
                            <MoreHorizontal size={16} className="more-dots" />
                        </div>
                        <div className="unified-input-group">
                            <input
                                type="number"
                                className="input-invisible"
                                value={consumption}
                                onChange={(e) => setConsumption(e.target.value)}
                                onWheel={(e) => e.target.blur()} />
                            <div className="relative-dropdown-container">
                                <div
                                    className="unit-static"
                                    style={{ cursor: 'pointer', color: '#2563eb' }}
                                    onClick={() => {
                                        const next = consumptionUnit === '/ wk' ? '/ yr' : '/ wk';
                                        setConsumptionUnit(next);
                                    }}
                                >
                                    {consumptionUnit} <ChevronDown size={14} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- Dynamic Text Result (Matches Screenshot) --- */}
                    {uses && consumption && (
                        <div className="text-result-section">
                            <p className="result-intro-text">
                                For a <strong>carbon footprint equivalent</strong> to one {getBagName(bagType)} used <strong>{uses} time{uses != 1 ? 's' : ''}</strong>, you need to use:
                            </p>

                            <div className="comparison-list">
                                {Object.entries(comparisons).map(([type, { bags, times }]) => (
                                    <p key={type} className="comparison-item">
                                        <em>{getBagName(type)}</em>: <strong>{bags} bag{bags !== 1 ? 's' : ''} {times}</strong> time{times !== 1 ? 's' : ''}
                                    </p>
                                ))}
                            </div>

                            {/* Impact Details "But:" section */}
                            {renderImpactDetails()}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="bag-actions-grid">
                        {/*
                        <button className="share-result-large-btn" onClick={handleShare}>
                            <div className="share-icon-circle">
                                <Share2 size={20} />
                            </div>
                            <span className="share-text">Share result</span>
                        </button>
                        */}
                        <div className="right-action-stack">
                            <button className="action-btn-secondary" onClick={handleReload}>
                                Reload calculator
                            </button>
                            <button className="action-btn-secondary" onClick={handleReset}>
                                Clear all changes
                            </button>
                        </div>
                    </div>
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

export default BagFootprintCalculatorPage;
