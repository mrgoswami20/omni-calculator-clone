import React, { useState, useEffect, useCallback } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, RotateCcw, Trash2, MoreHorizontal } from 'lucide-react';
import './KayaIdentityCalculatorPage.css';

const KayaIdentityCalculatorPage = () => {
    // --- Defaults (World 2014) ---
    const DEFAULTS = {
        population: '7270000000',
        gdpPerCapita: '10925',
        energyIntensity: '1.43',
        carbonFootprint: '0.001421'
    };

    // --- State ---
    const [population, setPopulation] = useState(DEFAULTS.population);
    const [gdpPerCapita, setGdpPerCapita] = useState(DEFAULTS.gdpPerCapita);
    const [energyIntensity, setEnergyIntensity] = useState(DEFAULTS.energyIntensity);
    const [carbonFootprint, setCarbonFootprint] = useState(DEFAULTS.carbonFootprint);
    const [impact, setImpact] = useState(0);

    // --- Helper: Robust Numeric Parsing ---
    const parseFormattedNumber = (val) => {
        if (!val) return 0;
        const cleanVal = val.toString().replace(/[, ]/g, '');
        const parsed = parseFloat(cleanVal);
        return isNaN(parsed) ? 0 : parsed;
    };

    // --- Calculation Logic ---
    const calculateImpact = useCallback(() => {
        const p = parseFormattedNumber(population);
        const g = parseFormattedNumber(gdpPerCapita);
        const e = parseFormattedNumber(energyIntensity);
        const c = parseFormattedNumber(carbonFootprint);

        if (p === 0 || g === 0 || e === 0 || c === 0) {
            return 0;
        }

        // Formula: Impact = P * G * E * C
        return p * g * e * c;
    }, [population, gdpPerCapita, energyIntensity, carbonFootprint]);

    // --- Effect: Update Impact ---
    useEffect(() => {
        setImpact(calculateImpact());
    }, [calculateImpact]);

    // --- Handlers ---
    const handleReset = () => {
        setPopulation(DEFAULTS.population);
        setGdpPerCapita(DEFAULTS.gdpPerCapita);
        setEnergyIntensity(DEFAULTS.energyIntensity);
        setCarbonFootprint(DEFAULTS.carbonFootprint);
    };

    const handleReload = () => {
        window.location.reload();
    };

    const handleShare = () => {
        if (impact === 0) {
            alert("Calculate a result before sharing!");
            return;
        }
        const text = `Kaya Identity Result: Impact (CO₂ emissions) = ${impact.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
        navigator.clipboard.writeText(text).then(() => {
            alert("Result copied to clipboard!");
        });
    };

    const articleContent = (
        <div className="article-wrapper">
            <h2>The IPAT equation</h2>
            <p>
                In 1967, a group of scientists proposed an equation to calculate the impact of the human population on the planet: what they came up with was the <strong>IPAT</strong> equation:
            </p>
            <div className="formula-box">
                <code>I = P · A · T</code>
            </div>
            <p>where:</p>
            <ul>
                <li><strong>P</strong> — Human population;</li>
                <li><strong>A</strong> — Affluence; and</li>
                <li><strong>T</strong> — Technology.</li>
            </ul>
            <p>
                Affluence is the <strong>consumption per individual</strong>, measured by energy consumption, for example. Technology is quantified by the <strong>cleanliness of an industrialized society</strong> per <strong>unit of consumption</strong>.
            </p>

            <h3 id="kaya-identity">The Kaya identity</h3>
            <p>
                The energy economist Yoichi Kaya decided to redesign the equation to make it concrete. His equation substitutes the factors with well-established and measurable quantities, which leave little space for ambiguity.
            </p>
            <div className="formula-box">
                <code>F = P · G/P · E/G · F/E</code>
            </div>
            <p>Let's check out the factors of the Kaya identity:</p>
            <ul>
                <li><strong>P</strong> is again the <strong>human population</strong>;</li>
                <li><strong>F</strong> is the value of <strong>global anthropogenic CO₂ emissions</strong>;</li>
                <li><strong>G</strong> is the <strong>GDP</strong>; and</li>
                <li><strong>E</strong> the <strong>energy consumption</strong>.</li>
            </ul>

            <h3 id="calculate">How to use our Kaya identity calculator</h3>
            <p>
                Our Kaya identity calculator allows you to easily compute the environmental impact of a human population. We set the default values of our calculator to the ones of the whole planet in the year 2014!
            </p>
            <div className="info-callout">
                <span className="emoji">🙋</span> We set the default values of our calculator to the ones of the whole planet in the year 2014!
            </div>
            <p>
                You can retrieve the value of <strong>gross domestic product per capita</strong> of a country from <a href="https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(nominal)_per_capita" target="_blank" rel="noopener noreferrer">this table</a>. The values for the <strong>population</strong> can be found on <a href="https://data.worldbank.org/indicator/SP.POP.TOTL" target="_blank" rel="noopener noreferrer">this page</a> of the world bank website.
            </p>
            <p>
                The data for the <strong>energy intensity of the GDP</strong> can be found on this page of <a href="https://ourworldindata.org/energy-intensity" target="_blank" rel="noopener noreferrer">Our World in Data</a>. The units are <code>kWh</code> per dollar.
            </p>
            <p>
                Finally, in <a href="https://www.eea.europa.eu/data-and-maps/indicators/en17-energy-intensity-of-gdp" target="_blank" rel="noopener noreferrer">this report by the EEA</a>, you can find the values of carbon dioxide equivalent emissions for European countries. Note that the measurement units are in <code>g CO₂eq. / kWh</code>.
            </p>

            <h3>Why is it important?</h3>
            <p>
                The Kaya identity is widely used by policy makers and scientists to analyze trends in CO₂ emissions and to develop strategies for reducing them. It highlights that emissions can be reduced by lowering any of the four factors: population, wealth, energy intensity, or the carbon footprint of energy.
            </p>
        </div>
    );

    return (
        <CalculatorLayout
            title="Kaya Identity Calculator"
            creators={[{ name: "Davide Borchia" }]}
            reviewers={[{ name: "Anna Szczepanek", phd: true }, { name: "Rijk de Wet" }]}
            lastUpdated="July 26, 2024"
            tocItems={[
                { label: "The IPAT equation", id: "" },
                { label: "The Kaya identity", id: "kaya-identity" },
                { label: "How to use", id: "calculate" }
            ]}
            articleContent={articleContent}
        >
            <div className="kaya-identity-calculator">
                <div className="calc-card">

                    {/* Input Groups */}
                    {[
                        { label: "Population", value: population, setter: setPopulation, placeholder: "7,270,000,000" },
                        { label: "GDP per capita", value: gdpPerCapita, setter: setGdpPerCapita, placeholder: "10,925" },
                        { label: "Energy intensity of the GDP", value: energyIntensity, setter: setEnergyIntensity, placeholder: "1.43" },
                        { label: "Energy carbon footprint", value: carbonFootprint, setter: setCarbonFootprint, placeholder: "0.001421" }
                    ].map((field, idx) => (
                        <div key={idx} className="input-field-wrapper">
                            <div className="label-row">
                                <label>{field.label}</label>
                                <MoreHorizontal size={16} className="info-icon" />
                            </div>
                            <div className="input-control">
                                <input
                                    type="text"
                                    value={field.value}
                                    onChange={(e) => field.setter(e.target.value)}
                                    placeholder={field.placeholder}
                                />
                            </div>
                        </div>
                    ))}

                    {/* Result Group */}
                    <div className="input-field-wrapper result-space">
                        <div className="label-row">
                            <label>Impact (CO₂ emissions)</label>
                            <MoreHorizontal size={16} className="info-icon" />
                        </div>
                        <div className="input-control result-mode">
                            <input
                                type="text"
                                className="result-input"
                                value={impact > 0 ? impact.toLocaleString(undefined, { maximumFractionDigits: 0 }) : ''}
                                readOnly
                                placeholder="38,154,642,000,000"
                            />
                        </div>
                    </div>

                    {/* Standardized Actions */}
                    <div className="actions-section">
                        <button className="main-share-btn" onClick={handleShare}>
                            <div className="share-circle">
                                <Share2 size={22} />
                            </div>
                            <span>Share result</span>
                        </button>
                        <div className="utility-buttons">
                            <button className="util-btn" onClick={handleReload}>
                                <RotateCcw size={16} /> Reload calculator
                            </button>
                            <button className="util-btn" onClick={handleReset}>
                                <Trash2 size={16} /> Clear all changes
                            </button>
                        </div>
                    </div>

                    {/* Feedback */}
                    <div className="feedback-section">
                        <p>Did we solve your problem today?</p>
                        <div className="feedback-btngroup">
                            <button>Yes</button>
                            <button>No</button>
                        </div>
                    </div>

                </div>
            </div>
        </CalculatorLayout>
    );
};

export default KayaIdentityCalculatorPage;
