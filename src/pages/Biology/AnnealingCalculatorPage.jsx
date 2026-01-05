import React, { useState } from 'react';
import SubNavigation from '../../components/SubNavigation';
import { Share2, RotateCcw, ThumbsUp, ThumbsDown, MessageSquare, Box, Code, Quote } from 'lucide-react';
import './AnnealingCalculatorPage.css';

const AnnealingCalculatorPage = () => {
    const [primerTm, setPrimerTm] = useState('');
    const [targetTm, setTargetTm] = useState('');
    const [result, setResult] = useState(null);

    // Simple placeholder logic: Ta = min(Tm_primer, Tm_target) - 5
    React.useEffect(() => {
        if (primerTm && targetTm) {
            const p = parseFloat(primerTm);
            const t = parseFloat(targetTm);
            if (!isNaN(p) && !isNaN(t)) {
                const minTm = Math.min(p, t);
                setResult((minTm - 5).toFixed(2));
            } else {
                setResult(null);
            }
        } else {
            setResult(null);
        }
    }, [primerTm, targetTm]);

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

    const handleClear = () => {
        setPrimerTm('');
        setTargetTm('');
        setResult(null);
    };

    return (
        <div className="calculator-page">
            <SubNavigation />

            <div className="calc-content-wrapper">
                <div className="calc-layout">
                    {/* Left Sidebar */}
                    <div className="left-sidebar">
                        <div className="creator-profile">
                            <div className="avatar-placeholder">
                                {/* Placeholder for creator image */}
                                <span>DB</span>
                            </div>
                            <div className="creator-info">
                                <span className="label">Creators</span>
                                <a href="#" className="creator-name">Davide Borchia</a>
                                <div className="reviewers">
                                    <span className="label">Reviewers</span>
                                    <p>Anna Szczepanek, PhD and Rijk de Wet</p>
                                </div>
                            </div>
                        </div>

                        <div className="social-proof">
                            <div className="proof-item">
                                <Box size={16} /> Based on <b>3 sources</b>
                            </div>
                            <div className="proof-item">
                                <ThumbsUp size={16} /> <b>78</b> people find this calculator helpful
                            </div>
                        </div>

                        <div className="interaction-buttons">
                            <button className="like-btn"><ThumbsUp size={18} /> 78</button>
                            <button className="dislike-btn"><ThumbsDown size={18} /></button>
                            <button className="action-btn"><MessageSquare size={18} /></button>
                            <button className="action-btn"><Share2 size={18} /></button>
                            <button className="action-btn"><Code size={18} /></button>
                            <button className="action-btn"><Quote size={18} /></button>
                        </div>

                        <div className="toc">
                            <h3>Table of contents</h3>
                            <ul>
                                <li><a href="#">An introduction to the polymerase chain reaction</a></li>
                                <li><a href="#">A brief overview of DNA structure</a></li>
                                <li><a href="#">A really brief explanation of DNA replication</a></li>
                                <li><a href="#">What is PCR?</a></li>
                                <li><a href="#">The ingredients of PCR</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Calculator Card */}
                    <div className="calculator-wrapper">
                        <div className="calculator-card">

                            <div className="input-group">
                                <div className="label-row">
                                    <label>Primer melting temperature</label>
                                    <span className="info-icon">i</span>
                                    <span className="more-options">...</span>
                                </div>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        value={primerTm}
                                        onChange={(e) => setPrimerTm(e.target.value)}
                                        placeholder=" "
                                    />
                                    <div className="unit-display">°C ▾</div>
                                </div>
                            </div>

                            <div className="input-group">
                                <div className="label-row">
                                    <label>Target melting temperature</label>
                                    <span className="more-options">...</span>
                                </div>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        value={targetTm}
                                        onChange={(e) => setTargetTm(e.target.value)}
                                        placeholder=" "
                                    />
                                    <div className="unit-display">°C ▾</div>
                                </div>
                            </div>

                            <div className="input-group result-group">
                                <div className="label-row">
                                    <label>Annealing temperature (T<sub>a</sub>)</label>
                                    <span className="more-options">...</span>
                                </div>
                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        value={result || ''}
                                        readOnly
                                        className="result-input"
                                    />
                                    <div className="unit-display">°C ▾</div>
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

                        <div className="similar-calcs">
                            <div className="similar-header">
                                <span>Check out <a href="#">7 similar</a> bio laboratory calculators</span>
                                <span className="emoji">🔬</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnnealingCalculatorPage;
