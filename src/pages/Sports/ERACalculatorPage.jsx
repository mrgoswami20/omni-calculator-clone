import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, ChevronDown, ChevronUp } from 'lucide-react';
import './ERACalculatorPage.css';

const ERACalculatorPage = () => {

    const [earnedRuns, setEarnedRuns] = useState('');
    const [inningsPitched, setInningsPitched] = useState(''); // Whole innings (or whatever user enters)
    const [outsPitched, setOutsPitched] = useState(''); // Outs (additive)
    const [era, setEra] = useState('');

    // Default 9 innings game
    const [inningsInGame, setInningsInGame] = useState('9');

    const [isInninsOpen, setIsInninsOpen] = useState(true); // Open by default as per screenshot? Or closed? Screenshot shows open.

    const fmt = (val) => {
        if (val === '' || val === null || isNaN(val)) return '';
        // Screenshot shows 172.6 (1 decimal?). Standard is 2.
        // Screenshot: 172.6. Calculated exactly 172.636.
        // If it shows 172.6, it might be 1 decimal or just significant digits. 
        // Let's use flexible standard (up to 2 but drop trailing zeros?). 
        // Or standard 2. 172.6 could be user input? No, ERA is result.
        // 172.6 implies 1 decimal place? 
        // Let's stick to standard 2 unless requested, but the screenshot is specific.
        // "172.6"
        // Let's try to match standard behavior for calculators: usually 2 fixed. 
        // If I use toString, 172.636 -> 172.636.
        // Let's stick to 2 decimals for now.
        return parseFloat(val.toFixed(2)).toString();
    };

    const recalcEra = (er, ip, outs, gameLen) => {
        const ER = parseFloat(er);
        const IP = parseFloat(ip) || 0; // Treat empty as 0
        const O = parseFloat(outs) || 0; // Treat empty as 0
        const GL = parseFloat(gameLen) || 9;

        // Total Outs = (IP * 3) + Outs
        const totalOuts = (IP * 3) + O;

        if (!isNaN(ER) && totalOuts > 0) {
            // Effective Innings = TotalOuts / 3
            // ERA = GL * ER / Effective Innings
            // ERA = GL * ER / (TotalOuts / 3) = 3 * GL * ER / TotalOuts
            const eraVal = (3 * GL * ER) / totalOuts;

            // Format to match screenshot roughly. 172.636... -> 172.6? 
            // Omni usually shows reasonable decimals.
            // Screenshot ERA box shows "172.6".
            // Let's assume it supports flexible decimals.
            // I'll format to 2 decimals max, but let's see.
            setEra(parseFloat(eraVal.toFixed(2)).toString()); // 172.64
            // If screenshot is strictly 172.6, maybe it truncates? Or 1 decimal?
            // I'll stick to 2 for correctness unless 1 is safer.
        } else {
            setEra('');
        }
    };

    // Update handlers: Independent inputs now
    const handleEarnedRunsChange = (val) => {
        setEarnedRuns(val);
        recalcEra(val, inningsPitched, outsPitched, inningsInGame);
    };

    const handleInningsChange = (val) => {
        setInningsPitched(val);
        recalcEra(earnedRuns, val, outsPitched, inningsInGame);
    };

    const handleOutsChange = (val) => {
        setOutsPitched(val);
        recalcEra(earnedRuns, inningsPitched, val, inningsInGame);
    };

    const handleGameLenChange = (val) => {
        setInningsInGame(val);
        recalcEra(earnedRuns, inningsPitched, outsPitched, val);
    };

    const handleEraChange = (val) => {
        setEra(val);
        // Reverse calc?
        // E = 3 * GL * ER / TO.
        // If user changes ERA, what to adjust? ER? 
        // Only if other fields valid.
        const e = parseFloat(val);
        const ip = parseFloat(inningsPitched) || 0;
        const o = parseFloat(outsPitched) || 0;
        const gl = parseFloat(inningsInGame) || 9;
        const totalOuts = (ip * 3) + o;

        if (!isNaN(e) && totalOuts > 0 && gl > 0) {
            // ER = E * TO / (3 * GL)
            const er = (e * totalOuts) / (3 * gl);
            setEarnedRuns(Math.round(er).toString());
        }
    };


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

    const clearAll = () => {
        setEarnedRuns('');
        setInningsPitched('');
        setOutsPitched('');
        setEra('');
        setInningsInGame('9');
    };

    const creators = [
        { name: "Bogna Szyk", role: "" },
        { name: "Filip Derma", role: "" },
    ];

    const reviewers = [
        { name: "Steven Wooding", role: "" },
        { name: "Jack Bowater", role: "" },
    ];

    const articleContent = (
        <>
            <p>
                This <strong>ERA calculator</strong> (earned run average calculator) is a tool for every baseball enthusiast. It will help you determine the ERA of your favorite pitcher and compare him to other players.
            </p>
        </>
    );

    return (
        <CalculatorLayout
            title="ERA Calculator – Earned Run Average"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "What is ERA in baseball?",
                "How to calculate ERA",
                "Baseball history",
                "FAQs"
            ]}
            articleContent={articleContent}
            similarCalculators={80}
        >
            <div className="era-calculator-page">

                <div className="section-card">

                    <div className="input-group">
                        <div className="label-row"><label>Earned runs</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={earnedRuns}
                                onChange={(e) => handleEarnedRunsChange(e.target.value)}
                             onWheel={(e) => e.target.blur()} />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Innings pitched</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={inningsPitched}
                                onChange={(e) => handleInningsChange(e.target.value)}
                             onWheel={(e) => e.target.blur()} />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Outs pitched</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={outsPitched}
                                onChange={(e) => handleOutsChange(e.target.value)}
                             onWheel={(e) => e.target.blur()} />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>ERA</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={era}
                                onChange={(e) => handleEraChange(e.target.value)}
                                style={{ backgroundColor: '#eff6ff', color: '#1e3a8a', fontWeight: 'bold' }}
                             onWheel={(e) => e.target.blur()} />
                        </div>
                    </div>

                </div>

                {/* Collapsible Section: Innins (Matches screenshot typo/label) */}
                <div className="section-card">
                    <div className="section-header" onClick={() => setIsInninsOpen(!isInninsOpen)}>
                        <div className="section-title">
                            {isInninsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            Innins
                        </div>
                    </div>
                    {isInninsOpen && (
                        <div style={{ paddingTop: '1rem' }}>
                            <div className="input-group">
                                <div className="label-row"><label>Innings in a game</label><span className="more-options">...</span></div>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        className="calc-input"
                                        value={inningsInGame}
                                        onChange={(e) => handleGameLenChange(e.target.value)}
                                     onWheel={(e) => e.target.blur()} />
                                </div>
                            </div>

                            <div className="calc-actions" style={{ marginTop: '0' }}>
                                {/* <button className="share-result-btn" onClick={handleShare}>
                                    <div className="share-icon-circle"><Share2 size={14} /></div>
                                    Share result
                                    {showShareTooltip && <span className="copied-tooltip">Copied!</span>}
                                </button> */}
                                <div className="secondary-actions">
                                    <button className="secondary-btn">Reload calculator</button>
                                    <button className="secondary-btn" onClick={clearAll}>Clear all changes</button>
                                </div>
                            </div>

                        </div>
                    )}
                </div>



            </div>
        </CalculatorLayout>
    );
};

export default ERACalculatorPage;
