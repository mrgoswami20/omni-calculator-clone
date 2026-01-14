import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, Info, ChevronDown, RotateCcw, Plus } from 'lucide-react';
import './AverageAtomicMassCalculatorPage.css';

const AverageAtomicMassCalculatorPage = () => {
    // State for number of isotopes (dropdown)
    const [numIsotopes, setNumIsotopes] = useState(2);

    // State for isotope data: array of { percent: string, mass: string }
    const [isotopes, setIsotopes] = useState([
        { percent: '', mass: '' },
        { percent: '', mass: '' }
    ]);

    const [averageMass, setAverageMass] = useState('');
    const [totalPercent, setTotalPercent] = useState(0);

    const creators = [
        { name: "Komal Rafay", role: "" }
    ];

    const reviewers = [
        { name: "Dominik Czernia", role: "PhD" },
        { name: "Jack Bowater", role: "" }
    ];

    // Handle number of isotopes change
    const handleNumIsotopesChange = (e) => {
        const newCount = parseInt(e.target.value);
        setNumIsotopes(newCount);

        // Resize array, preserving existing data where possible
        setIsotopes(prev => {
            const newArr = [...prev];
            if (newCount > prev.length) {
                // Add empty slots
                for (let i = prev.length; i < newCount; i++) {
                    newArr.push({ percent: '', mass: '' });
                }
            } else {
                // Truncate
                newArr.length = newCount;
            }
            return newArr;
        });
    };

    // Handle input change
    const handleInputChange = (index, field, value) => {
        const newIsotopes = [...isotopes];
        newIsotopes[index] = { ...newIsotopes[index], [field]: value };
        setIsotopes(newIsotopes);
    };

    // Calculate effect
    useEffect(() => {
        let totalP = 0;
        let weightedSum = 0;
        let allValid = true;
        let hasData = false;

        isotopes.forEach(iso => {
            const p = parseFloat(iso.percent);
            const m = parseFloat(iso.mass);

            if (!isNaN(p)) {
                totalP += p;
                hasData = true;
            }

            if (!isNaN(p) && !isNaN(m)) {
                weightedSum += m * (p / 100);
            } else if (iso.percent !== '' || iso.mass !== '') {
                // If one field is filled but not the other, or invalid number
                allValid = false;
            }
        });

        setTotalPercent(totalP);

        // Only show result if at least one complete row exists and user has started typing
        if (hasData && weightedSum > 0) {
            setAverageMass(weightedSum.toFixed(4)); // Standard precision
        } else {
            setAverageMass('');
        }

    }, [isotopes]);

    const [showShareTooltip, setShowShareTooltip] = useState(false);

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setShowShareTooltip(true);
            setTimeout(() => setShowShareTooltip(false), 2000);
        } catch (err) {
            console.error('Failed to copy URL:', err);
        }
    };

    const articleContent = (
        <>
            <p>
                This average atomic mass calculator allows you to calculate the atomic mass of an element based on the relative abundance of its isotopes.
            </p>
        </>
    );

    // Helpers for dynamic ordinal labels (1st, 2nd, 3rd...)
    const getOrdinal = (n) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    return (
        <CalculatorLayout
            title="Average Atomic Mass Calculator"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "Average atomic mass definition",
                "Average atomic mass calculator",
                "Average atomic mass equation",
                "How to calculate the mean",
                "FAQs"
            ]}
            articleContent={articleContent}
        >
            <div className="calc-card average-atomic-mass-page">
                {/* Num Isotopes Dropdown */}
                <div className="input-group">
                    <div className="label-row">
                        <label>How many isotopes do you have?</label>
                        <span className="more-options">...</span>
                    </div>
                    <div className="select-wrapper">
                        <select
                            value={numIsotopes}
                            onChange={handleNumIsotopesChange}
                            className="calc-select"
                        >
                            {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                        <ChevronDown className="select-arrow" size={16} />
                    </div>
                </div>

                {/* Dynamic Inputs */}
                <div className="isotopes-grid">
                    {isotopes.map((iso, idx) => (
                        <React.Fragment key={idx}>
                            {/* Percent Input */}
                            <div className="input-group">
                                <div className="label-row">
                                    <label>Percentage of {getOrdinal(idx + 1)} isotope</label>
                                    <span className="more-options">...</span>
                                </div>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        className="calc-input"
                                        value={iso.percent}
                                        onChange={(e) => handleInputChange(idx, 'percent', e.target.value)}
                                        placeholder=""
                                     onWheel={(e) => e.target.blur()} />
                                    <span className="unit-label">%</span>
                                </div>
                            </div>

                            {/* Mass Input */}
                            <div className="input-group">
                                <div className="label-row">
                                    <label>Mass of {getOrdinal(idx + 1)} isotope</label>
                                    <span className="more-options">...</span>
                                </div>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        className="calc-input"
                                        value={iso.mass}
                                        onChange={(e) => handleInputChange(idx, 'mass', e.target.value)}
                                        placeholder=""
                                     onWheel={(e) => e.target.blur()} />
                                    <span className="unit-label">amu</span>
                                </div>
                            </div>
                        </React.Fragment>
                    ))}
                </div>

                {/* Warning Box */}
                <div className="warning-box" style={{ display: totalPercent > 0 && Math.abs(totalPercent - 100) > 0.01 ? 'block' : 'none' }}>
                    Ensure the percentages sum to 100% for an accurate result.
                </div>

                {/* Result */}
                <div className="input-group result-group">
                    <div className="label-row">
                        <label>Average atomic mass</label>
                        <span className="more-options">...</span>
                    </div>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            className="calc-input result-input"
                            value={averageMass}
                            readOnly
                        />
                        <span className="unit-label">amu</span>
                    </div>
                </div>

                <div className="calc-actions">
                    {/* <button className="share-result-btn" onClick={handleShare}>
                        <div className="share-icon-circle"><Share2 size={14} /></div>
                        Share result
                        {showShareTooltip && <span className="copied-tooltip">Copied!</span>}
                    </button> */}
                    <div className="secondary-actions">
                        <button className="secondary-btn">Reload calculator</button>
                        <button className="secondary-btn" onClick={() => {
                            setNumIsotopes(2);
                            setIsotopes([{ percent: '', mass: '' }, { percent: '', mass: '' }]);
                            setAverageMass('');
                            setTotalPercent(0);
                        }}>Clear all changes</button>
                    </div>
                </div>

            </div>
        </CalculatorLayout>
    );
};

export default AverageAtomicMassCalculatorPage;
