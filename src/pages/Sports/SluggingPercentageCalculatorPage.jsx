import React, { useState } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2 } from 'lucide-react';
import './SluggingPercentageCalculatorPage.css';

const SluggingPercentageCalculatorPage = () => {

    const [singles, setSingles] = useState('');
    const [doubles, setDoubles] = useState('');
    const [triples, setTriples] = useState('');
    const [hr, setHr] = useState('');
    const [ab, setAb] = useState('');
    const [slg, setSlg] = useState('');

    const fmt = (val, maxDecimals = 3) => {
        if (val === '' || val === null || isNaN(val)) return '';
        // Standard baseball stats: .500
        return val.toFixed(maxDecimals).replace(/^0+/, '');
    };

    const recalc = (s1, s2, s3, h, a) => {
        const S1 = parseFloat(s1) || 0;
        const S2 = parseFloat(s2) || 0;
        const S3 = parseFloat(s3) || 0;
        const HR = parseFloat(h) || 0;
        const AB = parseFloat(a) || 0;

        // TB = 1*S1 + 2*S2 + 3*S3 + 4*HR
        const TB = S1 + (2 * S2) + (3 * S3) + (4 * HR);

        if (AB > 0) {
            const res = TB / AB;
            setSlg(fmt(res));
        } else {
            if (S1 || S2 || S3 || HR || AB) {
                setSlg('0.000'); // Or strictly empty? Usually if partial inputs exist but AB=0, result is undefined or 0? 0/0 is undef.
                // If AB is 0, technically infinite/undefined. But often displays empty.
                if (AB === 0) setSlg('');
            } else {
                setSlg('');
            }
        }
    };

    const handleChange = (setter, val, field) => {
        setter(val);
        const s1 = field === 's1' ? val : singles;
        const s2 = field === 's2' ? val : doubles;
        const s3 = field === 's3' ? val : triples;
        const h = field === 'hr' ? val : hr;
        const a = field === 'ab' ? val : ab;

        recalc(s1, s2, s3, h, a);
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
        setSingles('');
        setDoubles('');
        setTriples('');
        setHr('');
        setAb('');
        setSlg('');
    };

    const creators = [
        { name: "Rita Rain", role: "" },
    ];

    const reviewers = [
        { name: "Bagna Szyk", role: "" },
        { name: "Jack Bowater", role: "" },
    ];

    const articleContent = (
        <>
            <p>
                The <strong>slugging percentage calculator</strong> can help you evaluate the batting effectiveness of a hitter. If you were a baseball coach - how would you determine whether you should have a given player on your team?
            </p>
        </>
    );

    return (
        <CalculatorLayout
            title="Slugging Percentage Calculator"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "What is slugging percentage (SLG)?",
                "How to calculate slugging percentage",
                "SLG calculation example",
                "Records and average scores"
            ]}
            articleContent={articleContent}
            similarCalculators={33}
        >
            <div className="slugging-percentage-calculator-page">

                <div className="section-card">

                    <div className="input-group">
                        <div className="label-row"><label>Singles</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={singles}
                                onChange={(e) => handleChange(setSingles, e.target.value, 's1')}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Doubles</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={doubles}
                                onChange={(e) => handleChange(setDoubles, e.target.value, 's2')}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Triples</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={triples}
                                onChange={(e) => handleChange(setTriples, e.target.value, 's3')}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Home runs</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={hr}
                                onChange={(e) => handleChange(setHr, e.target.value, 'hr')}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>At bats</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="number"
                                className="calc-input"
                                value={ab}
                                onChange={(e) => handleChange(setAb, e.target.value, 'ab')}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="label-row"><label>Slugging percentage</label><span className="more-options">...</span></div>
                        <div className="input-wrapper">
                            <input
                                type="text"
                                className="calc-input"
                                value={slg}
                                readOnly
                                style={{ backgroundColor: '#eff6ff', color: '#1e3a8a', fontWeight: 'bold' }}
                            />
                        </div>
                    </div>

                    <div className="calc-actions">
                        <button className="share-result-btn" onClick={handleShare}>
                            <div className="share-icon-circle"><Share2 size={14} /></div>
                            Share result
                            {showShareTooltip && <span className="copied-tooltip">Copied!</span>}
                        </button>
                        <div className="secondary-actions">
                            <button className="secondary-btn">Reload calculator</button>
                            <button className="secondary-btn" onClick={clearAll}>Clear all changes</button>
                        </div>
                    </div>

                </div>

                <div className="feedback-section" style={{ marginTop: '2rem', textAlign: 'center', paddingTop: '1.5rem', borderTop: '1px solid #f3f4f6' }}>
                    <p style={{ marginBottom: '1rem', color: '#4b5563' }}>Did we solve your problem today?</p>
                    <div>
                        <button className="feedback-btn" style={{ padding: '0.5rem 1.5rem', border: '1px solid #e5e7eb', borderRadius: '0.25rem', background: 'white', cursor: 'pointer', margin: '0 0.5rem' }}>Yes</button>
                        <button className="feedback-btn" style={{ padding: '0.5rem 1.5rem', border: '1px solid #e5e7eb', borderRadius: '0.25rem', background: 'white', cursor: 'pointer', margin: '0 0.5rem' }}>No</button>
                    </div>
                </div>

            </div>
        </CalculatorLayout>
    );
};

export default SluggingPercentageCalculatorPage;
