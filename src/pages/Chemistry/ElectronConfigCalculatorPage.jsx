import React, { useState } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2 } from 'lucide-react';
import { periodicTable } from '../../data/periodicTable';
import { getElectronConfiguration } from '../../utils/electronPhysics';
import './ElectronConfigCalculatorPage.css';

const ElectronConfigCalculatorPage = () => {
    const [selectedZ, setSelectedZ] = useState('');
    const [config, setConfig] = useState(null);

    const creators = [
        { name: "Joanna Śmietańska", role: "PhD" }
    ];

    const reviewers = [
        { name: "Łucja Zaborowska", role: "MD, PhD candidate" },
        { name: "Rijk de Wet" }
    ];

    const handleSelectChange = (e) => {
        const z = e.target.value;
        setSelectedZ(z);
        if (z) {
            const calculated = getElectronConfiguration(z);
            setConfig(calculated);
        } else {
            setConfig(null);
        }
    };

    const handleClear = () => {
        setSelectedZ('');
        setConfig(null);
    };

    // Convert periodic table object to sortable array
    const elementsList = Object.entries(periodicTable)
        .map(([z, info]) => ({ z: parseInt(z), ...info }))
        .sort((a, b) => a.z - b.z);

    return (
        <CalculatorLayout
            title="Electron Configuration Calculator"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "Ground state electron configuration",
                "Electron configuration chart...",
                "How to write electron configuration...",
                "What are valence electrons?"
            ]}
        >
            <div className="calculator-card electron-config-page">
                <div className="input-group">
                    <div className="label-row">
                        <label>Element</label>
                        <span className="more-options">...</span>
                    </div>
                    <div className="input-wrapper">
                        <select
                            value={selectedZ}
                            onChange={handleSelectChange}
                            className="element-select"
                        >
                            <option value="">Select</option>
                            {elementsList.map((el) => (
                                <option key={el.z} value={el.z}>
                                    {el.z}. {el.name} ({el.symbol})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="instructions-list">
                    <ul>
                        <li>Click the field above to select an element and display its electron configuration.</li>
                        <li>Start typing its name to find it.</li>
                        <li>Elements are in order of their atomic number.</li>
                    </ul>
                </div>

                {config && (
                    <div className="result-list-section">
                        <div className="result-item">
                            <span className="result-label">Atomic number:</span>
                            <span className="result-value">{selectedZ}</span>
                        </div>

                        <div className="result-item">
                            <span className="result-label">Atomic mass:</span>
                            <span className="result-value">{periodicTable[selectedZ]?.mass || "Unknown"}</span>
                        </div>

                        <div className="result-item column-layout">
                            <span className="result-label">The electron configuration of the element is:</span>
                            <span className="result-value config-value">
                                {config.full.split(' ').map((orbital, idx) => {
                                    const match = orbital.match(/([0-9][a-z])([0-9]+)/);
                                    if (match) {
                                        return (
                                            <span key={idx}>
                                                {match[1]}<sup>{match[2]}</sup>{' '}
                                            </span>
                                        );
                                    }
                                    return <span key={idx}>{orbital} </span>;
                                })}
                            </span>
                        </div>

                        <div className="result-item column-layout">
                            <span className="result-label">The valence electrons are:</span>
                            <span className="result-value config-value">
                                {config.valence.split(' ').map((orbital, idx) => {
                                    const match = orbital.match(/([0-9][a-z])([0-9]+)/);
                                    if (match) {
                                        return (
                                            <span key={idx}>
                                                {match[1]}<sup>{match[2]}</sup>{' '}
                                            </span>
                                        );
                                    }
                                    return <span key={idx}>{orbital} </span>;
                                })}
                            </span>
                        </div>
                    </div>
                )}

                <div className="calc-actions">
                    <button className="share-result-btn">
                        <div className="share-icon-circle"><Share2 size={14} /></div>
                        Share result
                    </button>
                    <div className="secondary-actions">
                        <button className="secondary-btn">Reload calculator</button>
                        <button className="secondary-btn" onClick={handleClear}>Clear all changes</button>
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

export default ElectronConfigCalculatorPage;
