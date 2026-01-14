import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { ChevronDown, ChevronUp, RefreshCcw, X, Share2 } from 'lucide-react';
import './BoardFootCalculatorPage.css';

const BoardFootCalculatorPage = () => {
    // --- State ---
    const [pieces, setPieces] = useState('1');

    // Dimension States: { val1: '', val2: '', unit: 'in' }
    const [thickness, setThickness] = useState({ val1: '', val2: '', unit: 'in' });
    const [width, setWidth] = useState({ val1: '', val2: '', unit: 'in' });
    const [length, setLength] = useState({ val1: '', val2: '', unit: 'ft-in' });

    const [price, setPrice] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [isCostOpen, setIsCostOpen] = useState(true);

    const [results, setResults] = useState({
        totalBoardFeet: '',
        totalCost: ''
    });

    // --- Data Definitions ---
    const universalUnits = [
        { label: 'millimeters (mm)', value: 'mm' },
        { label: 'centimeters (cm)', value: 'cm' },
        { label: 'meters (m)', value: 'm' },
        { label: 'inches (in)', value: 'in' },
        { label: 'feet (ft)', value: 'ft' },
        { label: 'feet / inches (ft / in)', value: 'ft-in' },
        { label: 'meters / centimeters (m / cm)', value: 'm-cm' }
    ];

    const currencies = [
        'USD', 'EUR', 'GBP', 'JPY', 'INR', 'CAD', 'AUD', 'CHF', 'CNY', 'HKD', 'NZD', 'SEK', 'KRW', 'SGD', 'NOK', 'MXN', 'RUB', 'ZAR', 'TRY', 'BRL'
    ];

    // --- Conversion Logic ---
    const toInches = (dim) => {
        const v1 = parseFloat(dim.val1) || 0;
        const v2 = parseFloat(dim.val2) || 0;

        switch (dim.unit) {
            case 'mm': return v1 / 25.4;
            case 'cm': return v1 / 2.54;
            case 'm': return v1 * 39.3701;
            case 'in': return v1;
            case 'ft': return v1 * 12;
            case 'ft-in': return (v1 * 12) + v2;
            case 'm-cm': return (v1 * 39.3701) + (v2 / 2.54);
            default: return 0;
        }
    };

    const toFeet = (dim) => {
        return toInches(dim) / 12;
    };

    // --- Main Calculation ---
    useEffect(() => {
        const qty = parseFloat(pieces) || 0;
        const tIn = toInches(thickness);
        const wIn = toInches(width);
        const lFt = toFeet(length);
        const pVal = parseFloat(price) || 0;

        if (qty <= 0 || tIn <= 0 || wIn <= 0 || lFt <= 0) {
            setResults({ totalBoardFeet: '', totalCost: '' });
            return;
        }

        // Formula: (T[in] * W[in] * L[ft]) / 12 * Qty
        const bf = (tIn * wIn * lFt) / 12 * qty;
        const tc = bf * pVal;

        setResults({
            totalBoardFeet: bf.toFixed(2),
            totalCost: tc.toLocaleString(undefined, { maximumFractionDigits: 2 })
        });
    }, [pieces, thickness, width, length, price]);

    const handleClear = () => {
        setPieces('1');
        setThickness({ val1: '', val2: '', unit: 'in' });
        setWidth({ val1: '', val2: '', unit: 'in' });
        setLength({ val1: '', val2: '', unit: 'ft-in' });
        setPrice('');
        setResults({ totalBoardFeet: '', totalCost: '' });
    };

    // --- Helper Component: Unified Input Bar ---
    const UnifiedInputBar = ({ label, state, setState, units, isResult = false }) => {
        const showTwoSegments = state.unit === 'ft-in' || state.unit === 'm-cm';
        const label1 = state.unit === 'ft-in' ? 'ft' : (state.unit === 'm-cm' ? 'm' : '');
        const label2 = state.unit === 'ft-in' ? 'in' : (state.unit === 'm-cm' ? 'cm' : '');

        return (
            <div className="input-group-premium">
                <label className="label-premium">{label}</label>
                <div className={`unified-bar ${isResult ? 'result' : ''}`}>
                    <div className="segments-container">
                        <input
                            type={isResult ? "text" : "number"}
                            className={`bar-input ${!showTwoSegments ? 'solo' : ''} ${isResult ? 'highlight' : ''}`}
                            value={state.val1}
                            onChange={(e) => setState({ ...state, val1: e.target.value })}
                            readOnly={isResult}
                            placeholder=" "
                        />
                        {showTwoSegments && <span className="inner-unit-label">{label1}</span>}

                        {showTwoSegments && (
                            <>
                                <div className="bar-inner-divider"></div>
                                <input
                                    type="number"
                                    className="bar-input"
                                    value={state.val2}
                                    onChange={(e) => setState({ ...state, val2: e.target.value })}
                                    placeholder=" "
                                 onWheel={(e) => e.target.blur()} />
                                <span className="inner-unit-label">{label2}</span>
                            </>
                        )}
                    </div>
                    {!isResult && <div className="bar-main-divider"></div>}
                    {!isResult ? (
                        <select
                            className="bar-select"
                            value={state.unit}
                            onChange={(e) => setState({ ...state, unit: e.target.value })}
                        >
                            {units.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                        </select>
                    ) : (
                        <div className="bar-static-label">{state.unit}</div>
                    )}
                </div>
            </div>
        );
    };

    const articleContent = (
        <div className="article-container">
            <h2 className="article-title">What is a board foot?</h2>
            <p>Unlike square footage, which measures area, board footage measures <strong>volume</strong>. You use it when purchasing multiple boards of lumber in various sizes.</p>
            <p>By definition, one board foot of lumber is <strong>one square foot that is one-inch thick</strong>. If you would like to convert regular volume units into board feet, use the following relation:</p>
            <div className="premium-formula-box">
                <div className="math-latex">
                    1 board foot = 144 cubic inches = 1/12 cubic foot
                </div>
            </div>

            <h2 className="article-title">How to calculate board feet?</h2>
            <p>Surprisingly, the calculations are extremely easy! All you need to do is use the board foot formula below:</p>
            <div className="premium-formula-box sub-formula">
                <div className="math-latex">
                    board feet = length (ft) × width (in) × thickness (in) / 12
                </div>
            </div>
            <p>Pay special attention to the units! The length of the wooden board should be expressed in feet, while the width and thickness — in inches.</p>

            <h2 className="article-title">Using the lumber calculator: an example</h2>
            <p>Let's assume you want to use this board foot calculator to determine the volume of a piece of wood that is 2 inches thick, 6 inches wide, and 8 feet long:</p>
            <ol>
                <li>Enter the <strong>Thickness</strong>: 2 in.</li>
                <li>Enter the <strong>Width</strong>: 6 in.</li>
                <li>Enter the <strong>Length</strong>: 8 ft.</li>
                <li>The result is: <code>(2 * 6 * 8) / 12 = 8 board feet</code>.</li>
            </ol>
        </div>
    );

    return (
        <CalculatorLayout
            title="Board Foot Calculator"
            creators={[{ name: "Bogna Szyk" }]}
            reviewers={[{ name: "Małgorzata Koperska", md: true }, { name: "Jack Bowater" }]}
            articleContent={articleContent}
        >
            <div className="bf-calculator-wrapper">
                <div className="premium-card">
                    {/* Pieces */}
                    <div className="input-group-premium">
                        <label className="label-premium">No. of pieces</label>
                        <div className="unified-bar">
                            <input
                                type="number"
                                className="bar-input solo"
                                value={pieces}
                                onChange={(e) => setPieces(e.target.value)}
                                placeholder=" "
                             onWheel={(e) => e.target.blur()} />
                        </div>
                    </div>

                    {/* Thickness, Width, Length */}
                    <UnifiedInputBar label="Thickness" state={thickness} setState={setThickness} units={universalUnits} />
                    <UnifiedInputBar label="Width" state={width} setState={setWidth} units={universalUnits} />
                    <UnifiedInputBar label="Length" state={length} setState={setLength} units={universalUnits} />

                    <div className="premium-divider"></div>

                    {/* Result */}
                    <UnifiedInputBar
                        label="Total"
                        state={{ val1: results.totalBoardFeet, unit: 'board feet' }}
                        setState={() => { }}
                        units={[]}
                        isResult={true}
                    />
                </div>

                {/* Cost Section */}
                <div className="premium-card cost-card">
                    <div className="cost-header" onClick={() => setIsCostOpen(!isCostOpen)}>
                        <div className="flex-center gap-2 text-blue-500 font-bold">
                            {isCostOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            <span>Cost</span>
                        </div>
                    </div>

                    {isCostOpen && (
                        <div className="cost-content">
                            <div className="input-group-premium">
                                <label className="label-premium">Price</label>
                                <div className="unified-bar">
                                    <input
                                        type="number"
                                        className="bar-input"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder=" "
                                     onWheel={(e) => e.target.blur()} />
                                    <div className="bar-main-divider"></div>
                                    <select
                                        className="bar-select currency-select"
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value)}
                                    >
                                        {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    <div className="per-label">/ board foot</div>
                                </div>
                            </div>

                            <UnifiedInputBar
                                label="Total cost"
                                state={{ val1: results.totalCost, unit: currency }}
                                setState={() => { }}
                                units={[]}
                                isResult={true}
                            />
                        </div>
                    )}
                </div>

                {/* Feedback */}
                <div className="feedback-container-premium">
                    <p>Did we solve your problem today?</p>
                    <div className="flex-center gap-3 mt-4">
                        <button className="feedback-pill">👍 Yes</button>
                        <button className="feedback-pill">👎 No</button>
                    </div>
                </div>
            </div>
        </CalculatorLayout>
    );
};

export default BoardFootCalculatorPage;
