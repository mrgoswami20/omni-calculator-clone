import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Info, MoreHorizontal, Share2 } from 'lucide-react';
import './ImpliedProbabilityCalculatorPage.css';

const ImpliedProbabilityCalculatorPage = () => {
    const [sign, setSign] = useState('positive');
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
    const [odds, setOdds] = useState('');
    const [probability, setProbability] = useState('');

    useEffect(() => {
        if (odds && !isNaN(parseFloat(odds))) {
            const val = Math.abs(parseFloat(odds));
            let prob = 0;

            if (sign === 'positive') {
                // Formula: 100 / (Odds + 100)
                prob = 100 / (val + 100);
            } else {
                // Formula: Odds / (Odds + 100)
                prob = val / (val + 100);
            }

            setProbability((prob * 100).toFixed(4)); // Displaying with adequate precision
        } else {
            setProbability('');
        }
    }, [sign, odds]);

    const handleClear = () => {
        setOdds('');
        setProbability('');
        setSign('positive');
    };

    const creators = [
        { name: "Wei Bin Loo", role: "" }
    ];

    const reviewers = [
        { name: "Anna Szczepanek", role: "PhD" },
        { name: "Steven Wooding", role: "" }
    ];

    const tocItems = [
        "What is implied probability?",
        "How do American odds work?",
        "How to convert American odds to implied probability?",
        "FAQs"
    ];

    const articleContent = (
        <div className="calculator-article-content">
            <p>Welcome to the implied probability calculator! This tool helps you convert American odds (moneyline odds) into an implied probability percentage. Whether you are analyzing sports betting markets or just curious about what those +/- numbers mean in terms of raw chance, this calculator is for you.</p>

            <h2 id="what-is">What is implied probability?</h2>
            <p>Implied probability is the conversion of betting odds into a percentage. It represents the probability of an event happening as implied by the odds offered by a bookmaker. If the bookmaker's estimation is accurate, this percentage reflects the true chance of the outcome.</p>

            <h2 id="american-odds">How do American odds work?</h2>
            <p>American odds are centered around the number 100. They can be either positive (+) or negative (-).</p>
            <ul>
                <li><strong>Positive odds (e.g., +200)</strong> indicate how much profit you would make on a $100 bet. Higher positive numbers indicate a lower probability of winning (underdog).</li>
                <li><strong>Negative odds (e.g., -150)</strong> indicate how much you need to bet to make $100 profit. Lower negative numbers (e.g., -200 vs -105) indicate a higher probability of winning (favorite).</li>
            </ul>

            <h2 id="convert">How to convert American odds to implied probability?</h2>
            <p>The formulas depend on the sign of the odds:</p>
            <h3>For Positive Odds (+):</h3>
            <p><code>Implied Probability (%) = 100 / (Odds + 100) * 100%</code></p>
            <p>Example: For +100 odds (even money), P = 100 / (100 + 100) = 50%.</p>

            <h3>For Negative Odds (-):</h3>
            <p><code>Implied Probability (%) = (-Odds) / (-Odds + 100) * 100%</code></p>
            <p>Example: For -200 odds, P = 200 / (200 + 100) = 66.67%.</p>
        </div>
    );

    return (
        <CalculatorLayout
            title="Implied Probability Calculator"
            creators={creators}
            reviewers={reviewers}
            tocItems={tocItems}
            category="Statistics"
            articleContent={articleContent}
        >
            <div className="implied-probability-calculator">
                <div className="section-card">
                    <div className="input-group">
                        <div className="input-label-row">
                            <label className="input-label">Are the odds positive or negative?</label>
                            <MoreHorizontal size={16} color="#9ca3af" />
                        </div>
                        <div className="radio-group-vertical">
                            <label className="radio-item">
                                <input
                                    type="radio"
                                    checked={sign === 'positive'}
                                    onChange={() => setSign('positive')}
                                />
                                Positive
                            </label>
                            <label className="radio-item">
                                <input
                                    type="radio"
                                    checked={sign === 'negative'}
                                    onChange={() => setSign('negative')}
                                />
                                Negative
                            </label>
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="input-label-row">
                            <label className="input-label">American odds (moneyline)</label>
                            <Info size={14} color="#9ca3af" style={{ marginLeft: '4px' }} />
                            <MoreHorizontal size={16} color="#9ca3af" style={{ marginLeft: 'auto' }} />
                        </div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={odds}
                                onChange={(e) => setOdds(e.target.value)}
                                placeholder={sign === 'positive' ? "e.g. 150" : "e.g. 200"}
                                min="0"
                             onWheel={(e) => e.target.blur()} />
                        </div>
                    </div>

                    <div className="input-group result-group">
                        <div className="input-label-row">
                            <label className="input-label">Implied probability</label>
                            <MoreHorizontal size={16} color="#9ca3af" style={{ marginLeft: 'auto' }} />
                        </div>
                        <div className="input-wrapper" style={{ backgroundColor: '#f9fafb' }}>
                            <input
                                type="text"
                                className="calc-input"
                                value={probability}
                                readOnly
                                style={{ backgroundColor: 'transparent', color: '#2563eb', fontWeight: 600 }}
                            />
                            <div className="unit-display" style={{ color: '#2563eb' }}>%</div>
                        </div>
                    </div>

                    <div className="action-buttons">
                        <div className="share-btn-wrapper" style={{ flex: 1 }}>
                            {/* <button className="btn-share" onClick={handleShare} style={{ position: 'relative' }}>
                                <div className="share-icon-circle">
                                    <Share2 size={20} />
                                </div>
                                <span>Share result</span>
                                {showShareTooltip && <span className="copied-tooltip" style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)' }}>Copied!</span>}
                            </button> */}
                        </div>
                        <div className="right-actions" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button className="btn-action" onClick={() => window.location.reload()}>Reload calculator</button>
                            <button className="btn-action" onClick={handleClear}>Clear all changes</button>
                        </div>
                    </div>

                    <div style={{ marginTop: '24px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
                        Did we solve your problem today?
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '12px' }}>
                            <button className="btn-action" style={{ width: 'auto', padding: '8px 16px' }}>Yes</button>
                            <button className="btn-action" style={{ width: 'auto', padding: '8px 16px' }}>No</button>
                        </div>
                    </div>
                </div>
            </div>
        </CalculatorLayout>
    );
};

export default ImpliedProbabilityCalculatorPage;
