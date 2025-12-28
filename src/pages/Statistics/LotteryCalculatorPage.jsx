import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, Info, ChevronDown, ChevronUp, MoreHorizontal, AlertCircle } from 'lucide-react';
import './LotteryCalculatorPage.css';

// Combinations: C(n, k) = n! / (k! * (n-k)!)
const combinations = (n, k) => {
    if (k < 0 || k > n) return 0;
    if (k === 0 || k === n) return 1;
    if (k > n / 2) k = n - k;
    let res = 1;
    for (let i = 1; i <= k; i++) {
        res = res * (n - i + 1) / i;
    }
    return res;
};

const LotteryCalculatorPage = () => {
    // Main Game Inputs
    const [poolSize, setPoolSize] = useState(''); // N
    const [drawSize, setDrawSize] = useState(''); // k
    const [matchSize, setMatchSize] = useState(''); // m

    // Results
    const [winOdds, setWinOdds] = useState(''); // 1 in X

    // Bonus Types: 'none', 'remaining', 'pool'
    // But UI shows them as collapsible sections. 
    // We'll treat them as independent calculators or modifiers?
    // The screenshot shows "Bonus ball (from remaining balls)" as a section.
    // And implies inputting "Number of matches" for bonus? Or just "Bonus ball: Yes/No"?
    // Usually standard lotto is: Match X (main) + Match Y (bonus).
    // Let's implement independent sections for "Bonus from Remaining" and "Bonus from Pool".

    // "Bonus ball (from remaining balls)"
    const [showBonusRemaining, setShowBonusRemaining] = useState(false);
    const [matchBonusRemaining, setMatchBonusRemaining] = useState(''); // How many bonus balls to match? Typically 1.
    const [bonusRemainingOdds, setBonusRemainingOdds] = useState('');

    // "Bonus balls (from bonus pool)" (Powerball)
    const [showBonusPool, setShowBonusPool] = useState(false);
    const [bonusPoolSize, setBonusPoolSize] = useState(''); // N_b
    const [bonusDrawSize, setBonusDrawSize] = useState('1'); // k_b (usually 1)
    const [bonusMatchSize, setBonusMatchSize] = useState('1'); // m_b (usually 1)
    const [bonusPoolOdds, setBonusPoolOdds] = useState('');

    const [showShareTooltip, setShowShareTooltip] = useState(false);

    // Main Logic
    useEffect(() => {
        const N = parseInt(poolSize);
        const k = parseInt(drawSize);
        const m = parseInt(matchSize);

        if (!isNaN(N) && !isNaN(k) && !isNaN(m)) {
            if (k > N || m > k) {
                setWinOdds('Impossible');
                return;
            }
            // P = (C(k,m) * C(N-k, k-m)) / C(N, k)
            const num = combinations(k, m) * combinations(N - k, k - m);
            const den = combinations(N, k);

            if (den === 0 || num === 0) {
                setWinOdds('Impossible');
            } else {
                const p = num / den;
                const odds = 1 / p; // "1 in X"
                setWinOdds(odds.toLocaleString(undefined, { maximumFractionDigits: 0 }));
            }
        } else {
            setWinOdds('');
        }
    }, [poolSize, drawSize, matchSize]);

    // Bonus Remaining Logic
    // Scenario: Match 'matchSize' main balls AND 'matchBonusRemaining' bonus balls.
    // Total drawn is still 'drawSize'? No, typically bonus is drawn *after* main draw?
    // Or is it part of the draw? 
    // "Bonus ball from remaining": e.g. 6 drawn from 49. Match 5 + Bonus.
    // Actually, usually 6 drawn, plus 1 bonus drawn from 43 remaining.
    // To win "5 + Bonus":
    // 1. Choose 5 from winning 6: C(6, 5)
    // 2. Choose 1 from Bonus (1): C(1, 1) -> The bonus ball IS one specific ball drawn from remaining.
    // 3. Choose 0 from others?
    // Total Combinations: C(49, 6) ? No.
    // This gets complex. Let's simplify to standard:
    // P = ( Combinations for Main ) * P(Bonus | Main)

    // For now, let's implement the simpler "Bonus from Pool" (Powerball) as it's cleaner.
    // And leave "Bonus from Remaining" as a placeholder or basic approximate if formula is unclear for generic N/k.

    // Let's implement Bonus Pool (Powerball style)
    useEffect(() => {
        if (!showBonusPool) {
            setBonusPoolOdds('');
            return;
        }
        const N_main = parseInt(poolSize);
        const k_main = parseInt(drawSize);
        const m_main = parseInt(matchSize);

        const N_bonus = parseInt(bonusPoolSize);
        const k_bonus = parseInt(bonusDrawSize);
        const m_bonus = parseInt(bonusMatchSize);

        if (!isNaN(N_main) && !isNaN(k_main) && !isNaN(m_main) && !isNaN(N_bonus) && !isNaN(k_bonus) && !isNaN(m_bonus)) {
            // P_total = P_main * P_bonus
            // P_main calculated same as above
            const numMain = combinations(k_main, m_main) * combinations(N_main - k_main, k_main - m_main);
            const denMain = combinations(N_main, k_main);
            const pMain = denMain > 0 ? numMain / denMain : 0;

            // P_bonus: Match m_bonus from k_bonus drawn from N_bonus
            const numBonus = combinations(k_bonus, m_bonus) * combinations(N_bonus - k_bonus, k_bonus - m_bonus);
            const denBonus = combinations(N_bonus, k_bonus);
            const pBonus = denBonus > 0 ? numBonus / denBonus : 0;

            const pTotal = pMain * pBonus;
            if (pTotal > 0) {
                const odds = 1 / pTotal;
                setBonusPoolOdds(odds.toLocaleString(undefined, { maximumFractionDigits: 0 }));
            } else {
                setBonusPoolOdds('Impossible');
            }
        }
    }, [poolSize, drawSize, matchSize, bonusPoolSize, bonusDrawSize, bonusMatchSize, showBonusPool]);


    // Bonus Remaining Logic
    useEffect(() => {
        if (!showBonusRemaining) {
            setBonusRemainingOdds('');
            return;
        }
        const N = parseInt(poolSize);
        const k = parseInt(drawSize);
        const m = parseInt(matchBonusRemaining);

        if (!isNaN(N) && !isNaN(k) && !isNaN(m)) {
            // Requirement: k picks. m main matches. 1 bonus match.
            // Remaining picks = k - m - 1.
            // Must have k - m - 1 >= 0 => m <= k - 1.
            if (m > k - 1) {
                setBonusRemainingOdds('Impossible');
                return;
            }
            if (k > N) {
                setBonusRemainingOdds('Impossible');
                return;
            }

            // Ways to pick m main winners from k winning numbers: C(k, m)
            // Ways to pick 1 bonus winner from 1 bonus number: C(1, 1) = 1
            // Ways to pick remaining (k - m - 1) from losers:
            // Losers pool size = N - (k main) - (1 bonus) = N - k - 1
            // C(N - k - 1, k - m - 1)

            const num = combinations(k, m) * 1 * combinations(N - k - 1, k - m - 1);
            const den = combinations(N, k);

            if (den === 0 || num === 0) {
                setBonusRemainingOdds('Impossible');
            } else {
                const p = num / den;
                const odds = 1 / p;
                setBonusRemainingOdds(odds.toLocaleString(undefined, { maximumFractionDigits: 0 }));
            }
        } else {
            setBonusRemainingOdds('');
        }
    }, [poolSize, drawSize, matchBonusRemaining, showBonusRemaining]);

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setShowShareTooltip(true);
            setTimeout(() => setShowShareTooltip(false), 2000);
        } catch (err) { }
    };

    const handleClear = () => {
        setPoolSize('');
        setDrawSize('');
        setMatchSize('');
        setWinOdds('');
        setShowBonusPool(false);
        setBonusPoolSize('');
        setBonusDrawSize('1');
        setBonusMatchSize('1');
        setBonusPoolOdds('');
        setShowBonusRemaining(false);
    };

    const handleWheel = (e) => e.target.blur();

    const articleContent = (
        <div>
            <p>The <strong>Lottery Calculator</strong> helps you calculate the odds of winning various lottery games. Whether it's a standard pick-6 game or one with a separate bonus ball pool (like Powerball), this tool does the math for you.</p>
        </div>
    );

    return (
        <CalculatorLayout
            title="Lottery Calculator"
            creators={[{ name: "Bagna Szyk" }]}
            reviewers={[{ name: "Steven Wooding" }]}
            tocItems={["How does the lottery odds calculator work?", "The lottery formula", "Bonus balls", "FAQs"]}
            articleContent={articleContent}
        >
            <div className="lottery-calculator-page">
                <div className="section-card">
                    {/* Main inputs */}
                    <div className="input-group">
                        <label className="input-label">Balls to be drawn <MoreHorizontal size={16} className="info-icon" /></label>
                        <input
                            type="number"
                            className="input-field"
                            value={drawSize}
                            onChange={(e) => setDrawSize(e.target.value)}
                            onWheel={handleWheel}
                            placeholder="e.g. 6"
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Number of matches <MoreHorizontal size={16} className="info-icon" /></label>
                        <input
                            type="number"
                            className={`input-field ${parseInt(matchSize) > parseInt(drawSize) || parseInt(matchSize) <= 0 ? 'input-error' : ''}`}
                            value={matchSize}
                            onChange={(e) => setMatchSize(e.target.value)}
                            onWheel={handleWheel}
                            placeholder="e.g. 6"
                        />
                        {parseInt(matchSize) > parseInt(drawSize) && (
                            <div className="error-message">
                                <AlertCircle size={16} />
                                Number of matches must be lower or equal to the number of drawn balls.
                            </div>
                        )}
                        {parseInt(matchSize) <= 0 && matchSize !== '' && (
                            <div className="error-message">
                                <AlertCircle size={16} />
                                Number of matches must be higher than 0.
                            </div>
                        )}
                    </div>

                    <div className="input-group">
                        <label className="input-label">Number of balls in the pool <MoreHorizontal size={16} className="info-icon" /></label>
                        <input
                            type="number"
                            className={`input-field ${parseInt(poolSize) <= parseInt(drawSize) ? 'input-error' : ''}`}
                            value={poolSize}
                            onChange={(e) => setPoolSize(e.target.value)}
                            onWheel={handleWheel}
                            placeholder="e.g. 49"
                        />
                        {parseInt(poolSize) <= parseInt(drawSize) && poolSize !== '' && (
                            <div className="error-message">
                                <AlertCircle size={16} />
                                Number of balls in the pool must be higher than the number of balls to be drawn.
                            </div>
                        )}
                    </div>

                    <div className="input-group">
                        <label className="input-label">Winning odds are 1 to... <MoreHorizontal size={16} className="info-icon" /></label>
                        <input
                            type="text"
                            className="input-field result-field"
                            value={winOdds}
                            readOnly
                        />
                    </div>
                </div>

                {/* Bonus Ball (From Remaining Balls) - Accordion */}
                <div className="section-card">
                    <div className="bonus-section-header" onClick={() => setShowBonusRemaining(!showBonusRemaining)}>
                        {showBonusRemaining ? <ChevronUp size={20} style={{ marginRight: 8 }} /> : <ChevronDown size={20} style={{ marginRight: 8 }} />}
                        Bonus ball (from remaining balls)
                    </div>
                    {showBonusRemaining && (
                        <div className="bonus-section-content">
                            <div className="input-group">
                                <label className="input-label">Number of matches <Info size={16} className="info-icon" /></label>
                                <input
                                    type="number"
                                    className="input-field"
                                    value={matchBonusRemaining}
                                    onChange={(e) => setMatchBonusRemaining(e.target.value)}
                                    onWheel={handleWheel}
                                    placeholder="e.g. 5"
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Winning odds are 1 to... <MoreHorizontal size={16} className="info-icon" /></label>
                                <input
                                    type="text"
                                    className="input-field result-field"
                                    value={bonusRemainingOdds}
                                    readOnly
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Bonus Ball (From Bonus Pool) - Accordion */}
                <div className="section-card">
                    <div className="bonus-section-header" onClick={() => setShowBonusPool(!showBonusPool)}>
                        {showBonusPool ? <ChevronUp size={20} style={{ marginRight: 8 }} /> : <ChevronDown size={20} style={{ marginRight: 8 }} />}
                        Bonus balls (from bonus pool)
                    </div>
                    {showBonusPool && (
                        <div className="bonus-section-content">
                            <div className="input-group">
                                <label className="input-label">Balls to be drawn (bonus) <Info size={16} className="info-icon" /></label>
                                <input
                                    type="number"
                                    className="input-field"
                                    value={bonusDrawSize}
                                    onChange={(e) => setBonusDrawSize(e.target.value)}
                                    onWheel={handleWheel}
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Matches with bonus pool <Info size={16} className="info-icon" /></label>
                                <input
                                    type="number"
                                    className="input-field"
                                    value={bonusMatchSize}
                                    onChange={(e) => setBonusMatchSize(e.target.value)}
                                    onWheel={handleWheel}
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Balls in the bonus pool <Info size={16} className="info-icon" /></label>
                                <input
                                    type="number"
                                    className="input-field"
                                    value={bonusPoolSize}
                                    onChange={(e) => setBonusPoolSize(e.target.value)}
                                    onWheel={handleWheel}
                                    placeholder="e.g. 26"
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Winning odds are 1 to... <Info size={16} className="info-icon" /></label>
                                <input
                                    type="text"
                                    className="input-field result-field"
                                    value={bonusPoolOdds}
                                    readOnly
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="section-card">
                    <div className="calc-actions-custom" style={{ marginTop: 0, borderTop: 'none', paddingTop: 0 }}>
                        <button className="share-result-btn-custom" onClick={handleShare}>
                            <div className="share-icon-circle-custom">
                                <Share2 size={24} />
                            </div>
                            Share result
                            {showShareTooltip && <span className="copied-tooltip">Copied!</span>}
                        </button>

                        <div className="secondary-actions-custom">
                            <button className="secondary-btn-custom" onClick={() => window.location.reload()}>
                                Reload calculator
                            </button>
                            <button className="secondary-btn-custom" onClick={handleClear}>
                                Clear all changes
                            </button>
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
            </div>
        </CalculatorLayout>
    );
};

export default LotteryCalculatorPage;
