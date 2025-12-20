import React, { useState, useEffect, useMemo } from 'react';
import CalculatorLayout from '../components/CalculatorLayout';
import { Info, Share2, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import './VampireApocalypseCalculatorPage.css';

const VampireApocalypseCalculatorPage = () => {
    // --- State ---
    const [scenario, setScenario] = useState('Stoker-King model');
    const [showDetails, setShowDetails] = useState(false);

    // Initial Parameters State (Default: Stoker-King)
    const [humanPop, setHumanPop] = useState(1650000000); // 1.65 billion
    const [humanGrowth, setHumanGrowth] = useState(1); // 1% per year

    const [vampirePop, setVampirePop] = useState(1);
    // "1,000,000 vampires kill 1% of humans per day"
    // Let's parameterize: Vampires Ref Count (1M), Kill Percent (1%)
    const [vampireAttackRef, setVampireAttackRef] = useState(1000000);
    const [vampireKillPercent, setVampireKillPercent] = useState(1.0);

    const [slayerPop, setSlayerPop] = useState(0);
    const [slayerRecruit, setSlayerRecruit] = useState(0);
    const [slayerKills, setSlayerKills] = useState(0); // Vampires killed per slayer per day? (Simplified model)

    // Simulation Result State
    const [simulationData, setSimulationData] = useState([]);
    const [extinctionTime, setExtinctionTime] = useState(null); // in months
    const [survivors, setSurvivors] = useState(null);

    // --- Scenario Logic ---
    useEffect(() => {
        if (scenario === 'Stoker-King model') {
            setHumanPop(1650000000);
            setHumanGrowth(1); // 1% annual
            setVampirePop(1);
            setVampireAttackRef(1000000);
            setVampireKillPercent(1.0);
            setSlayerPop(0);
            setSlayerRecruit(0);
            setSlayerKills(0);
        }
        // Could add other presets here (Meyer, Rice, etc.)
    }, [scenario]);

    // --- Simulation Engine ---
    useEffect(() => {
        // Run specific simulation
        const runSimulation = () => {
            let H = humanPop;
            let V = vampirePop;
            let S = slayerPop;

            const data = [];
            const maxDays = 365 * 10; // Cap at 10 years to prevent infinite loops if stable
            let finalTime = null;
            let day = 0;

            // Daily growth rate from Annual %: (1 + r)^1/365 - 1 ? Or Simple interest?
            // Screenshot says "1% per year or 0.0028% per day". 1/365 ~= 0.00273. 
            // Let's use simple daily rate equivalent approx.
            const dailyGrowthRate = (humanGrowth / 100) / 365;

            // Attack Rate constant calculation
            // K = (V / Ref) * (Percent/100) * H
            // This effectively means each Vampire kills (Percent/100 / Ref) fraction of Humans per day??
            // Wait: "1M vampires kill 1% of human pop".
            // Deaths = (V / 1,000,000) * (0.01 * H).
            // Correct.

            // Step size
            const step = 1; // 1 day

            for (day = 0; day <= maxDays; day += step) {
                if (day % 30 === 0) { // Record monthly for graph
                    data.push({ t: day / 30, h: Math.max(0, H), v: Math.max(0, V), s: Math.max(0, S) });
                }

                if (H < 1) {
                    H = 0;
                    finalTime = day / 30; // Months
                    break;
                }
                if (V < 1 && day > 0) {
                    V = 0; // Vampires eradicated
                }

                // Dynamics
                // Humans
                const growth = H * dailyGrowthRate;
                const kills = (V / vampireAttackRef) * (vampireKillPercent / 100) * H;
                const humanChange = growth - kills;

                // Vampires
                // Assumes 100% transformation per kill for Stoker-King (based on screenshot "Victim... becomes another vampire")
                const newVampires = kills;
                // Slayers killing vampires?
                // Model details not fully visible, but usually Slayers kill V.
                // Let's assume standard Lotka-Volterra for slayers if S > 0.
                // "No attacks" in screenshot for Stoker-King.
                const vDeaths = 0;

                const vampireChange = newVampires - vDeaths;

                // Update
                H += humanChange;
                V += vampireChange;
            }

            if (!finalTime && H > 0) finalTime = null; // Did not end in doom
            if (H <= 1) finalTime = day / 30;

            setSimulationData(data);
            setExtinctionTime(finalTime);
            setSurvivors(Math.floor(H));
        };

        runSimulation();
    }, [humanPop, humanGrowth, vampirePop, vampireAttackRef, vampireKillPercent, slayerPop]);

    // Graph Scaling
    const { pointsH, pointsV, maxY } = useMemo(() => {
        if (!simulationData.length) return { pointsH: "", pointsV: "", maxY: 100 };
        const maxPop = Math.max(
            ...simulationData.map(d => Math.max(d.h, d.v))
        );
        const width = 100; // viewBox units
        const height = 60;
        const maxTime = simulationData[simulationData.length - 1].t;

        const makePoints = (key) => simulationData.map(d => {
            const x = (d.t / maxTime) * width;
            const y = height - (d[key] / maxPop) * height; // Invert Y
            return `${x},${y}`;
        }).join(" ");

        return { pointsH: makePoints('h'), pointsV: makePoints('v'), maxY: maxPop };
    }, [simulationData]);


    return (
        <CalculatorLayout
            title="Vampire Apocalypse Calculator"
            creators={[{ name: "Dominik Czernia, PhD", role: "" }]}
            reviewers={[{ name: "Bagna Szyk", role: "" }]}
            similarCalculators={3}
            tocItems={["What is vampirism?", "How to use", "Predator-prey model"]}
        >
            <div className="vampire-calculator">
                {/* Scenario Selection */}
                <div className="section-card">
                    <h3>Choose scenario or prepare custom one</h3>
                    <div className="input-block">
                        <label>Select a scenario</label>
                        <div className="select-wrapper">
                            <select value={scenario} onChange={e => setScenario(e.target.value)}>
                                <option value="Stoker-King model">Stoker-King model</option>
                                <option value="Rice model">Rice model (Custom)</option>
                                <option value="Custom">Custom</option>
                            </select>
                            <ChevronDown size={16} className="arrow" />
                        </div>
                    </div>

                    {scenario === 'Stoker-King model' && (
                        <div className="scenario-desc">
                            <p>Inspired by Bram Stoker's <a href="#">Dracula</a> and Stephen King's <a href="#">Salem's Lot</a>.</p>
                            <p>In 1897 (the year Stoker's novel was first published), the world population was about 1,650 million people. In this scenario we assume only one vampire at the beginning. The vampire attacks a victim that eventually becomes another vampire.</p>
                        </div>
                    )}

                    <div className="checkbox-block">
                        <input
                            type="checkbox"
                            id="showDetails"
                            checked={showDetails}
                            onChange={e => setShowDetails(e.target.checked)}
                        />
                        <label htmlFor="showDetails">Show scenario details</label>
                    </div>
                </div>

                {/* Details Accordions (Conditional) */}
                {showDetails && (
                    <>
                        <div className="section-card">
                            <div className="section-header">
                                <ChevronUp size={20} className="header-icon" />
                                <h4>Humans</h4>
                            </div>
                            <div className="section-content">
                                <div className="input-row">
                                    <label>Initial population</label>
                                    <input type="number" value={humanPop} onChange={e => setHumanPop(parseInt(e.target.value))} />
                                </div>
                                <div className="input-row">
                                    <label>Annual population growth</label>
                                    <div className="input-with-unit">
                                        <input type="number" value={humanGrowth} onChange={e => setHumanGrowth(parseFloat(e.target.value))} />
                                        <span>%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="section-card">
                            <div className="section-header">
                                <ChevronUp size={20} className="header-icon" />
                                <h4>Vampires</h4>
                            </div>
                            <div className="section-content">
                                <div className="input-row">
                                    <label>Initial population</label>
                                    <input type="number" value={vampirePop} onChange={e => setVampirePop(parseInt(e.target.value))} />
                                </div>
                                <div className="param-desc">
                                    <strong>vs. humans:</strong> common attacks (<span>{vampireAttackRef.toLocaleString()}</span> vampires kill <span>{vampireKillPercent}%</span> of the human population per day)
                                </div>
                            </div>
                        </div>

                        {/* Slayers placeholder as per screenshot it exists */}
                        <div className="section-card">
                            <div className="section-header">
                                <ChevronDown size={20} className="header-icon" /> {/* Closed by default? */}
                                <h4>Vampire slayers</h4>
                            </div>
                        </div>
                    </>
                )}

                {/* Results & Graph */}
                <div className="section-card results-card">
                    <h3>Changes in populations</h3>
                    <div className="results-text">
                        {extinctionTime ? (
                            <p>
                                The selected scenario is an example of an <strong>epidemic outbreak</strong> that might be caused by a deadly virus 😷. The increase in vampire population inevitably leads to the demise of mankind.
                                <br /><br />
                                It's all over. The expansion of vampires is unstoppable 🧛. Bloodsuckers have control of the world, killing the last human after <strong>{extinctionTime.toFixed(1)} months</strong> ⚰️. But don't lose hope! Try to recruit some vampire slayers and save mankind 💪.
                            </p>
                        ) : (
                            <p>Humans survive! Current population: {survivors?.toLocaleString()}</p>
                        )}
                    </div>

                    <div className="chart-container">
                        <svg viewBox="0 0 120 80" className="pop-chart">
                            {/* Grid/Axes */}
                            <line x1="10" y1="70" x2="110" y2="70" stroke="#ccc" strokeWidth="0.5" />
                            <line x1="10" y1="10" x2="10" y2="70" stroke="#ccc" strokeWidth="0.5" />

                            {/* Data Lines */}
                            <polyline
                                points={simulationData.map((d, i) => `${10 + (i / simulationData.length) * 100},${70 - (d.h / maxY) * 60}`).join(' ')}
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="2"
                            />
                            <polyline
                                points={simulationData.map((d, i) => `${10 + (i / simulationData.length) * 100},${70 - (d.v / maxY) * 60}`).join(' ')}
                                fill="none"
                                stroke="#ef4444"
                                strokeWidth="2"
                            />

                            {/* Legend */}
                            <text x="50" y="78" fontSize="4" textAnchor="middle" fill="#666">Time (months)</text>
                        </svg>

                        <div className="chart-legend">
                            <div className="legend-item"><span className="dot blue"></span> People</div>
                            <div className="legend-item"><span className="dot red"></span> Vampires</div>
                            <div className="legend-item"><span className="dot yellow"></span> Slayers</div>
                        </div>
                    </div>
                </div>
            </div>
        </CalculatorLayout>
    );
};

export default VampireApocalypseCalculatorPage;
