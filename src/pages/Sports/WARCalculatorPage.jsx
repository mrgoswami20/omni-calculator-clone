import React, { useState } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, Info } from 'lucide-react';
import './WARCalculatorPage.css';

const WARCalculatorPage = () => {

    const [calcFor, setCalcFor] = useState('position player');
    const [battingRuns, setBattingRuns] = useState('');
    const [baseRunningRuns, setBaseRunningRuns] = useState('');
    const [fieldingRuns, setFieldingRuns] = useState('');
    const [positionalAdj, setPositionalAdj] = useState('');
    const [leagueAdj, setLeagueAdj] = useState('');
    const [replacementRuns, setReplacementRuns] = useState('');
    const [runsPerWin, setRunsPerWin] = useState('');
    const [war, setWar] = useState('');

    const fmt = (val) => {
        if (val === '' || val === null || isNaN(val)) return '';
        // WAR often displayed with 1 or 2 decimals
        return val.toFixed(2);
    };

    const recalc = (br, bsr, fr, pos, lg, rep, rpw) => {
        const BR = parseFloat(br) || 0;
        const BSR = parseFloat(bsr) || 0;
        const FR = parseFloat(fr) || 0;
        const POS = parseFloat(pos) || 0;
        const LG = parseFloat(lg) || 0;
        const REP = parseFloat(rep) || 0;
        const RPW = parseFloat(rpw); // Denominator needs to be non-zero

        // Numerator sum
        const numerator = BR + BSR + FR + POS + LG + REP;

        if (!isNaN(RPW) && RPW !== 0) {
            const res = numerator / RPW;
            setWar(fmt(res));
        } else {
            // If RPW is missing, we can't calculate WAR.
            setWar('');
        }
    };

    const handleChange = (setter, val, field) => {
        setter(val);
        const br = field === 'br' ? val : battingRuns;
        const bsr = field === 'bsr' ? val : baseRunningRuns;
        const fr = field === 'fr' ? val : fieldingRuns;
        const pos = field === 'pos' ? val : positionalAdj;
        const lg = field === 'lg' ? val : leagueAdj;
        const rep = field === 'rep' ? val : replacementRuns;
        const rpw = field === 'rpw' ? val : runsPerWin;

        recalc(br, bsr, fr, pos, lg, rep, rpw);
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
        setBattingRuns('');
        setBaseRunningRuns('');
        setFieldingRuns('');
        setPositionalAdj('');
        setLeagueAdj('');
        setReplacementRuns('');
        setRunsPerWin('');
        setWar('');
    };

    const creators = [
        { name: "Maria Kluziak", role: "" },
    ];

    const reviewers = [
        { name: "Bogna Szyk", role: "" },
        { name: "Jack Bowater", role: "" },
    ];

    const articleContent = (
        <>
            <p>
                This <strong>WAR calculator</strong> (or Wins Above Replacement calculator) is the right place for you if you're looking for an all-inclusive, handy sabermetric to assess a player's performance quickly.
            </p>
        </>
    );

    return (
        <CalculatorLayout
            title="WAR Calculator (Wins Above Replacement)"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "What is WAR (Wins Above Replacement)?",
                "A note on the sources used in the WAR calculator",
                "How to use the WAR calculator?",
                "How is WAR calculated?",
                "How to interpret your WAR results?",
                "Why is WAR (and other baseball statistics) useful?"
            ]}
            articleContent={articleContent}
            similarCalculators={18}
        >
            <div className="war-calculator-page">

                <div className="section-card">

                    <div className="input-group">
                        <div className="label-row"><label>Calculate WAR for:</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <select
                                className="calc-select"
                                value={calcFor}
                                onChange={(e) => setCalcFor(e.target.value)}
                            >
                                <option value="position player">position player</option>
                            </select>
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Batting runs</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={battingRuns}
                                onChange={(e) => handleChange(setBattingRuns, e.target.value, 'br')}
                             onWheel={(e) => e.target.blur()} />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Base running hits</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={baseRunningRuns}
                                onChange={(e) => handleChange(setBaseRunningRuns, e.target.value, 'bsr')}
                             onWheel={(e) => e.target.blur()} />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Fielding runs</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={fieldingRuns}
                                onChange={(e) => handleChange(setFieldingRuns, e.target.value, 'fr')}
                             onWheel={(e) => e.target.blur()} />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Positional adjustment</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={positionalAdj}
                                onChange={(e) => handleChange(setPositionalAdj, e.target.value, 'pos')}
                             onWheel={(e) => e.target.blur()} />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>League adjustment</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={leagueAdj}
                                onChange={(e) => handleChange(setLeagueAdj, e.target.value, 'lg')}
                             onWheel={(e) => e.target.blur()} />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Replacement runs</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={replacementRuns}
                                onChange={(e) => handleChange(setReplacementRuns, e.target.value, 'rep')}
                             onWheel={(e) => e.target.blur()} />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Runs per win</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={runsPerWin}
                                onChange={(e) => handleChange(setRunsPerWin, e.target.value, 'rpw')}
                             onWheel={(e) => e.target.blur()} />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>WAR <Info size={14} className="inline ml-1 text-gray-400" /></label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                className="calc-input"
                                value={war}
                                readOnly
                                style={{ backgroundColor: '#eff6ff', color: '#1e3a8a', fontWeight: 'bold' }}
                            />
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
                            <button className="secondary-btn" onClick={clearAll}>Clear all changes</button>
                        </div>
                    </div>

                </div>


            </div>
        </CalculatorLayout>
    );
};

export default WARCalculatorPage;
