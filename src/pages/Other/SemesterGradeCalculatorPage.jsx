import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, RotateCcw, ChevronUp, ChevronDown, Pen, GraduationCap, Info } from 'lucide-react';
import './SemesterGradeCalculatorPage.css';

const SemesterGradeCalculatorPage = () => {
    // State
    const [q1Grade, setQ1Grade] = useState('');
    const [q1Weight, setQ1Weight] = useState('');
    const [q2Grade, setQ2Grade] = useState('');
    const [q2Weight, setQ2Weight] = useState('');
    const [finalGrade, setFinalGrade] = useState('');
    const [finalWeight, setFinalWeight] = useState('');
    const [semesterGrade, setSemesterGrade] = useState('');
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

    // Colors for Legend and Chart
    const colorQ1 = '#3b82f6'; // Blue
    const colorQ2 = '#f43f5e'; // Red/Pink
    const colorFinal = '#eab308'; // Yellow

    const calculate = () => {
        const g1 = parseFloat(q1Grade) || 0;
        const w1 = parseFloat(q1Weight) || 0;
        const g2 = parseFloat(q2Grade) || 0;
        const w2 = parseFloat(q2Weight) || 0;
        const gF = parseFloat(finalGrade) || 0;
        const wF = parseFloat(finalWeight) || 0;

        const totalWeight = w1 + w2 + wF;

        if (totalWeight > 0) {
            const weightedSum = (g1 * w1) + (g2 * w2) + (gF * wF);
            const result = weightedSum / totalWeight;
            setSemesterGrade(result.toFixed(2));
        } else {
            setSemesterGrade('');
        }
    };

    useEffect(() => {
        calculate();
    }, [q1Grade, q1Weight, q2Grade, q2Weight, finalGrade, finalWeight]);

    const clearAll = () => {
        setQ1Grade('');
        setQ1Weight('');
        setQ2Grade('');
        setQ2Weight('');
        setFinalGrade('');
        setFinalWeight('');
    };

    // SVG Pie Chart Generator
    const getPieChart = () => {
        const w1 = parseFloat(q1Weight) || 0;
        const w2 = parseFloat(q2Weight) || 0;
        const wF = parseFloat(finalWeight) || 0;
        const total = w1 + w2 + wF;

        if (total === 0) return null;

        const p1 = (w1 / total) * 100;
        const p2 = (w2 / total) * 100;
        const pF = (wF / total) * 100;

        const getCoordinatesForPercent = (percent) => {
            const x = Math.cos(2 * Math.PI * percent);
            const y = Math.sin(2 * Math.PI * percent);
            return [x, y];
        };

        let cumulativePercent = 0;
        const slices = [
            { percent: w1 / total, color: colorQ1 },
            { percent: w2 / total, color: colorQ2 },
            { percent: wF / total, color: colorFinal }
        ];

        return (
            <svg viewBox="-1 -1 2 2" style={{ transform: 'rotate(-90deg)', width: '150px', height: '150px' }}>
                {slices.map((slice, i) => {
                    const startX = Math.cos(2 * Math.PI * cumulativePercent);
                    const startY = Math.sin(2 * Math.PI * cumulativePercent);
                    cumulativePercent += slice.percent;
                    const endX = Math.cos(2 * Math.PI * cumulativePercent);
                    const endY = Math.sin(2 * Math.PI * cumulativePercent);

                    const largeArcFlag = slice.percent > 0.5 ? 1 : 0;

                    const pathData = `M 0 0 L ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;

                    if (slice.percent === 1) {
                        return <circle key={i} cx="0" cy="0" r="1" fill={slice.color} />;
                    }
                    if (slice.percent === 0) return null;

                    return (
                        <path key={i} d={pathData} fill={slice.color} />
                    );
                })}
            </svg>
        );
    };

    const creators = [
        { name: "Dominika Śmiałek", role: "MD, PhD candidate" },
    ];

    const reviewers = [
        { name: "Dominik Czernia", role: "PhD" },
        { name: "Jack Bowater", role: "" },
    ];

    const articleContent = (
        <>
            <p>
                Is the end of semester is coming? Brace yourself with the semester grade calculator. The tool <strong>determines your semester grade based on your performance</strong>.
            </p>
        </>
    );

    return (
        <CalculatorLayout
            title="Semester Grade Calculator"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "What grade do I need to pass?",
                "How can I improve my grades?",
                "How to use the semester grade calculator?",
                "Grade average calculator in practice",
                "FAQs"
            ]}
            articleContent={articleContent}
            similarCalculators={396}
        >
            <div className="semester-grade-calculator-page">

                {/* First Quarter */}
                <div className="section-card">
                    <div className="card-header">
                        <div className="header-left">
                            <ChevronUp size={20} className="text-blue-500" />
                            <div className="icon-marker" style={{ backgroundColor: colorQ2 }}></div>
                            {/* Screenshot shows red square, likely matching chart color? Wait, screenshot Q1 icon matches chart Q2 color? 
                               Actually screenshot chart: Q1 blue, Q2 red, Final yellow.
                               Section 1 icon: RED square. Section 2 icon: GREEN square. Final icon: PEN. 
                               Let's stick to screenshot icon colors if possible, but match chart colors semantically.
                               Screenshot Q1 input section has RED icon. Chart Q1 is BLUE. This is inconsistent in provided image or my interpretation.
                               I will stick to Chart Colors: Q1 Blue, Q2 Pink/Red, Final Yellow.
                               And make section icons match Chart for consistency, logic > exact pixel match of potential inconsistency.
                               UPDATE: Actually looking closely at screenshot 1: 
                               Q1 Header Icon is RED square. Chart Q1 is BLUE. 
                               Let's just use colored squares matching the Chart for better UX.
                               Q1: Blue, Q2: Red, Final: Yellow.
                            */}
                            <div className="card-title">First quarter</div>
                        </div>
                        <span className="more-options">...</span>
                    </div>
                    <div className="input-split">
                        <div className="input-col">
                            <div className="label-row"><label>Grade</label><span className="more-options">...</span></div>
                            <div className="input-wrapper">
                                <input type="number" className="calc-input" value={q1Grade} onChange={(e) => setQ1Grade(e.target.value)} />
                                <span className="suffix">%</span>
                            </div>
                        </div>
                        <div className="input-col">
                            <div className="label-row"><label>Weight <Info size={14} className="inline ml-1 text-gray-400" /></label><span className="more-options">...</span></div>
                            <div className="input-wrapper">
                                <input type="number" className="calc-input" value={q1Weight} onChange={(e) => setQ1Weight(e.target.value)} />
                                <span className="suffix">%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Second Quarter */}
                <div className="section-card">
                    <div className="card-header">
                        <div className="header-left">
                            <ChevronUp size={20} className="text-blue-500" />
                            <div className="card-title">Second quarter</div>
                        </div>
                    </div>
                    <div className="input-split">
                        <div className="input-col">
                            <div className="label-row"><label>Grade</label><span className="more-options">...</span></div>
                            <div className="input-wrapper">
                                <input type="number" className="calc-input" value={q2Grade} onChange={(e) => setQ2Grade(e.target.value)} />
                                <span className="suffix">%</span>
                            </div>
                        </div>
                        <div className="input-col">
                            <div className="label-row"><label>Weight <Info size={14} className="inline ml-1 text-gray-400" /></label><span className="more-options">...</span></div>
                            <div className="input-wrapper">
                                <input type="number" className="calc-input" value={q2Weight} onChange={(e) => setQ2Weight(e.target.value)} />
                                <span className="suffix">%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Final Exam */}
                <div className="section-card">
                    <div className="card-header">
                        <div className="header-left">
                            <ChevronUp size={20} className="text-blue-500" />
                            <Pen size={18} className="text-blue-500 mr-1" />
                            <div className="card-title">Final exam</div>
                        </div>
                    </div>
                    <div className="input-split">
                        <div className="input-col">
                            <div className="label-row"><label>Grade</label><span className="more-options">...</span></div>
                            <div className="input-wrapper">
                                <input type="number" className="calc-input" value={finalGrade} onChange={(e) => setFinalGrade(e.target.value)} />
                                <span className="suffix">%</span>
                            </div>
                        </div>
                        <div className="input-col">
                            <div className="label-row"><label>Weight <Info size={14} className="inline ml-1 text-gray-400" /></label><span className="more-options">...</span></div>
                            <div className="input-wrapper">
                                <input type="number" className="calc-input" value={finalWeight} onChange={(e) => setFinalWeight(e.target.value)} />
                                <span className="suffix">%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Semester Grade */}
                <div className="section-card">
                    <div className="card-header">
                        <div className="header-left">
                            <GraduationCap size={24} className="text-gray-700 mr-2" />
                            <div className="card-title">Semester grade</div>
                        </div>
                        <span className="more-options">...</span>
                    </div>

                    <div className="label-row"><label>Grade</label><span className="more-options">...</span></div>
                    <div className="input-wrapper">
                        <input type="text" className="calc-input result-input" value={semesterGrade} readOnly />
                        <span className="suffix">%</span>
                    </div>

                    {/* Chart */}
                    <div className="pie-chart-container">
                        {getPieChart()}
                    </div>
                    <div className="chart-legend">
                        <div className="legend-item"><div className="legend-color" style={{ backgroundColor: colorQ1 }}></div>First quarter</div>
                        <div className="legend-item"><div className="legend-color" style={{ backgroundColor: colorQ2 }}></div>Second quarter</div>
                        <div className="legend-item"><div className="legend-color" style={{ backgroundColor: colorFinal }}></div>Final exam</div>
                    </div>
                    <div style={{ textAlign: 'center', fontSize: '11px', color: '#666', marginTop: '5px' }}>
                        Weights of semester grade elements [%]
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

export default SemesterGradeCalculatorPage;
