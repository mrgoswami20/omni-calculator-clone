import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, ChevronUp, Info, Check } from 'lucide-react';
import './IELTSScoreCalculatorPage.css';

const IELTSScoreCalculatorPage = () => {
    // 1. Overall Score Section
    const [listening, setListening] = useState('');
    const [reading, setReading] = useState('');
    const [speaking, setSpeaking] = useState('');
    const [writing, setWriting] = useState('');
    const [ieltsScore, setIeltsScore] = useState('');
    const [showAverage, setShowAverage] = useState(false);
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
    // Note: Screenshots show "Show average result" checkbox. Logic may differ slightly (show raw mean vs rounded band).

    // 2. Listening Points Converter
    const [listeningPoints, setListeningPoints] = useState('');
    const [listeningScoreResult, setListeningScoreResult] = useState('');

    // 3. Reading Points Converter
    const [readingType, setReadingType] = useState('general'); // general, academic
    const [readingPoints, setReadingPoints] = useState('');
    const [readingScoreResult, setReadingScoreResult] = useState('');

    // --- Scoring Logic ---

    // Overall Score
    useEffect(() => {
        const l = parseFloat(listening);
        const r = parseFloat(reading);
        const s = parseFloat(speaking);
        const w = parseFloat(writing);

        if (!isNaN(l) && !isNaN(r) && !isNaN(s) && !isNaN(w)) {
            const avg = (l + r + s + w) / 4;

            // Standard IELTS Rounding
            // Ends in .0, .125, .25, .375, .5, .625, .75, .875
            // < .25 -> down to .0
            // >= .25 && < .75 -> .5
            // >= .75 -> up to next .0

            const decimalPart = avg % 1;
            let roundedBand = Math.floor(avg);

            if (decimalPart < 0.25) {
                // keep integer
            } else if (decimalPart < 0.75) {
                roundedBand += 0.5;
            } else {
                roundedBand += 1.0;
            }

            setIeltsScore(roundedBand.toFixed(1));
        } else {
            setIeltsScore('');
        }
    }, [listening, reading, speaking, writing]);

    // Listening Points
    useEffect(() => {
        const p = parseInt(listeningPoints);
        if (!isNaN(p) && p >= 0 && p <= 40) {
            setListeningScoreResult(getListeningBand(p));
        } else {
            setListeningScoreResult('');
        }
    }, [listeningPoints]);

    // Reading Points
    useEffect(() => {
        const p = parseInt(readingPoints);
        if (!isNaN(p) && p >= 0 && p <= 40) {
            setReadingScoreResult(getReadingBand(p, readingType));
        } else {
            setReadingScoreResult('');
        }
    }, [readingPoints, readingType]);


    // --- Helpers ---

    const getListeningBand = (score) => {
        if (score >= 39) return '9.0';
        if (score >= 37) return '8.5';
        if (score >= 35) return '8.0';
        if (score >= 32) return '7.5';
        if (score >= 30) return '7.0';
        if (score >= 26) return '6.5';
        if (score >= 23) return '6.0';
        if (score >= 18) return '5.5';
        if (score >= 16) return '5.0';
        if (score >= 13) return '4.5';
        if (score >= 10) return '4.0';
        if (score >= 6) return '3.5';
        if (score >= 4) return '3.0';
        // Below typically falls off fast, simplifying low end
        return '2.5';
    };

    const getReadingBand = (score, type) => {
        if (type === 'academic') {
            if (score >= 39) return '9.0';
            if (score >= 37) return '8.5';
            if (score >= 35) return '8.0';
            if (score >= 33) return '7.5';
            if (score >= 30) return '7.0';
            if (score >= 27) return '6.5';
            if (score >= 23) return '6.0';
            if (score >= 19) return '5.5';
            if (score >= 15) return '5.0';
            if (score >= 13) return '4.5';
            if (score >= 10) return '4.0';
            if (score >= 8) return '3.5';
            if (score >= 6) return '3.0';
            if (score >= 4) return '2.5';
            return '2.0';
        } else {
            // General Training
            if (score === 40) return '9.0';
            if (score >= 39) return '8.5';
            if (score >= 37) return '8.0';
            if (score >= 36) return '7.5';
            if (score >= 34) return '7.0';
            if (score >= 32) return '6.5';
            if (score >= 30) return '6.0';
            if (score >= 27) return '5.5';
            if (score >= 23) return '5.0';
            if (score >= 19) return '4.5';
            if (score >= 15) return '4.0';
            if (score >= 12) return '3.5';
            if (score >= 9) return '3.0'; // Approx
            return '2.5';
        }
    };

    const clearAll = () => {
        setListening('');
        setReading('');
        setSpeaking('');
        setWriting('');
        setIeltsScore('');
        setListeningPoints('');
        setListeningScoreResult('');
        setReadingPoints('');
        setReadingScoreResult('');
        setReadingType('general');
        setShowAverage(false);
    };

    const creators = [
        { name: "Fabiano Guolo", role: "" },
        { name: "Dominik Czernia", role: "PhD" },
    ];

    const reviewers = [
        { name: "Hanna Pamuła", role: "PhD" },
        { name: "Steven Wooding", role: "" },
    ];

    const articleContent = (
        <>
            <p>
                Welcome to Omni's IELTS score calculator, where we help you estimate your score in the <strong>International English Language Testing System (IELTS)</strong>, an English language proficiency test for non-native English speakers.
            </p>
        </>
    );

    return (
        <CalculatorLayout
            title="IELTS Score Calculator"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "What is IELTS exam?",
                "How IELTS is scored?",
                "How to use the IELTS score calculator",
                "IELTS listening score calculator",
                "IELTS reading score calculator",
                "IELTS score range — What is a good IELTS score?",
                "IELTS to TOEFL conversion",
                "Who accepts IELTS?",
                "FAQs"
            ]}
            articleContent={articleContent}
            similarCalculators={32}
        >
            <div className="ielts-calculator-page">

                {/* Card 1: Overall Score */}
                <div className="section-card">
                    <div className="card-header">
                        <div className="header-left">
                            <ChevronUp size={20} className="text-blue-500" />
                            <div className="card-title">Find IELTS score from the scores for<br />each component</div>
                        </div>
                        {/* <span className="more-options">...</span> */}
                    </div>

                    <div className="input-split">
                        <div className="input-col">
                            <div className="label-row"><label>Listening</label><span className="more-options">...</span></div>
                            <div className="input-wrapper">
                                <input type="number" step="0.5" className="calc-input" value={listening} onChange={(e) => setListening(e.target.value)} />
                            </div>
                        </div>
                        <div className="input-col">
                            <div className="label-row"><label>Reading</label><span className="more-options">...</span></div>
                            <div className="input-wrapper">
                                <input type="number" step="0.5" className="calc-input" value={reading} onChange={(e) => setReading(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <div className="input-split">
                        <div className="input-col">
                            <div className="label-row"><label>Speaking</label><span className="more-options">...</span></div>
                            <div className="input-wrapper">
                                <input type="number" step="0.5" className="calc-input" value={speaking} onChange={(e) => setSpeaking(e.target.value)} />
                            </div>
                        </div>
                        <div className="input-col">
                            <div className="label-row"><label>Writing</label><span className="more-options">...</span></div>
                            <div className="input-wrapper">
                                <input type="number" step="0.5" className="calc-input" value={writing} onChange={(e) => setWriting(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <div className="checkbox-row" onClick={() => setShowAverage(!showAverage)}>
                        <div className={`checkbox-box ${showAverage ? 'checked' : ''}`} style={{ marginRight: '0.75rem' }}>
                            {showAverage && <Check size={14} color="white" />}
                        </div>
                        <span className="checkbox-text">Show average result</span>
                    </div>

                    <div className="label-row"><label>IELTS score <Info size={14} className="inline ml-1 text-gray-400" /></label><span className="more-options">...</span></div>
                    <div className="input-wrapper">
                        {/* Show average if requested, else band score */}
                        <input type="text" className="calc-input result-input" value={showAverage && listening && reading && speaking && writing ? ((parseFloat(listening) + parseFloat(reading) + parseFloat(speaking) + parseFloat(writing)) / 4).toFixed(3) : ieltsScore} readOnly />
                    </div>
                </div>

                {/* Card 2: Listening Score */}
                <div className="section-card">
                    <div className="card-header">
                        <div className="header-left">
                            <ChevronUp size={20} className="text-blue-500" />
                            <div className="card-title">Find listening score from points</div>
                        </div>
                    </div>

                    <div className="label-row"><label>Listening points <Info size={14} className="inline ml-1 text-gray-400" /></label><span className="more-options">...</span></div>
                    <div className="input-split">
                        <div className="input-wrapper" style={{ flex: 1 }}>
                            <input type="number" className="calc-input" value={listeningPoints} onChange={(e) => setListeningPoints(e.target.value)} />
                        </div>
                        <div className="input-wrapper" style={{ flex: 1 }}>
                            <input type="text" className="calc-input result-input" value={listeningScoreResult} placeholder="" readOnly style={{ textAlign: 'center' }} />
                        </div>
                    </div>
                    <div className="label-row" style={{ justifyContent: 'flex-end', marginTop: '-1rem', marginRight: '3.5rem' }}>
                        <label>Listening score</label><span className="more-options">...</span>
                    </div>
                </div>

                {/* Card 3: Reading Score */}
                <div className="section-card">
                    <div className="card-header">
                        <div className="header-left">
                            <ChevronUp size={20} className="text-blue-500" />
                            <div className="card-title">Find reading score from points</div>
                        </div>
                    </div>

                    <div className="radio-group">
                        <div className="radio-label">General or academic? <Info size={14} className="text-gray-400" /> <span className="more-options" style={{ marginLeft: 'auto' }}>...</span></div>
                        <div className="radio-option" onClick={() => setReadingType('general')}>
                            <div className={`radio-circle ${readingType === 'general' ? 'selected' : ''}`}></div>
                            <span className="radio-text">General</span>
                        </div>
                        <div className="radio-option" onClick={() => setReadingType('academic')}>
                            <div className={`radio-circle ${readingType === 'academic' ? 'selected' : ''}`}></div>
                            <span className="radio-text">Academic</span>
                        </div>
                    </div>

                    <div className="label-row"><label>Reading points <Info size={14} className="inline ml-1 text-gray-400" /></label><span className="more-options">...</span></div>
                    <div className="input-split">
                        <div className="input-wrapper" style={{ flex: 1 }}>
                            <input type="number" className="calc-input" value={readingPoints} onChange={(e) => setReadingPoints(e.target.value)} />
                        </div>
                        <div className="input-wrapper" style={{ flex: 1 }}>
                            <input type="text" className="calc-input result-input" value={readingScoreResult} placeholder="" readOnly style={{ textAlign: 'center' }} />
                        </div>
                    </div>
                    <div className="label-row" style={{ justifyContent: 'flex-end', marginTop: '-1rem', marginRight: '3.5rem' }}>
                        <label>Reading score</label><span className="more-options">...</span>
                    </div>

                    <div className="calc-actions">
                        <button className="share-result-btn" onClick={handleShare}>
                            <div className="share-icon-circle"><Share2 size={16} /></div>
                            Share result
                            {showShareTooltip && <span className="copied-tooltip">Copied!</span>}
                        </button>
                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                            <button className="secondary-btn" style={{ width: '100%' }}>Reload calculator</button>
                            <button className="secondary-btn" style={{ width: '100%' }} onClick={clearAll}>Clear all changes</button>
                        </div>
                        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                            <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Did we solve your problem today?</span>
                            <div>
                                <button className="feedback-btn" style={{ padding: '0.2rem 0.8rem', border: '1px solid #e5e7eb', borderRadius: '4px', background: 'white' }}>Yes</button>
                                <button className="feedback-btn" style={{ padding: '0.2rem 0.8rem', border: '1px solid #e5e7eb', borderRadius: '4px', background: 'white', marginLeft: '0.5rem' }}>No</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </CalculatorLayout>
    );
};

export default IELTSScoreCalculatorPage;
