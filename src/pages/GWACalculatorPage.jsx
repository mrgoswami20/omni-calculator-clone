import React, { useState } from 'react';
import CalculatorLayout from '../components/CalculatorLayout';
import { Share2, RotateCcw, X, Info, ChevronUp } from 'lucide-react';
import './GWACalculatorPage.css';

const GWACalculatorPage = () => {
    const [gradingSystem, setGradingSystem] = useState('scale_1_5'); // 'scale_1_5', 'scale_4_1', 'letter_1', 'letter_2'

    // Initial 3 courses
    const [courses, setCourses] = useState([
        { id: 1, grade: '', units: '' },
        { id: 2, grade: '', units: '' },
        { id: 3, grade: '', units: '' },
    ]);

    const handleCourseChange = (id, field, value) => {
        setCourses(courses.map(c =>
            c.id === id ? { ...c, [field]: value } : c
        ));
    };

    // Calculate GWA
    const calculateGWA = () => {
        let totalWeightedGrades = 0;
        let totalUnits = 0;
        let hasData = false;

        courses.forEach(c => {
            const grade = parseFloat(c.grade);
            const units = parseFloat(c.units);

            if (!isNaN(grade) && !isNaN(units) && units > 0) {
                totalWeightedGrades += grade * units;
                totalUnits += units;
                hasData = true;
            }
        });

        if (hasData && totalUnits > 0) {
            const gwa = totalWeightedGrades / totalUnits;
            // Round to 2 decimal places
            return Math.round(gwa * 100) / 100; // e.g. 2.375 -> 2.38
        }
        return null;
    };

    const gwa = calculateGWA();

    const clearAll = () => {
        setCourses(courses.map(c => ({ ...c, grade: '', units: '' })));
    };

    // Options for Scale 1.00-5.00
    // Based on screenshot: 2.00, 2.75. Typically steps of 0.25
    const getOptions = () => {
        if (gradingSystem === 'scale_1_5') {
            const opts = [];
            opts.push(<option key="default" value="">Select</option>);
            // 1.00 to 5.00 in steps of 0.25
            for (let i = 1.00; i <= 5.00; i += 0.25) {
                opts.push(<option key={i} value={i.toFixed(2)}>{i.toFixed(2)}</option>);
            }
            return opts;
        }
        // Simplified fallback for now as screenshot only shows 1.00-5.00 usage
        return <option value="">Select</option>;
    };

    const creators = [
        { name: "Kenneth Alambra", role: "" },
    ];

    const reviewers = [
        { name: "Steven Wooding", role: "" },
    ];

    const articleContent = (
        <>
            <p>
                The <strong>GWA Calculator</strong> (General Weighted Average) is a tool for college students to compute their overall grade based on the units of each course.
            </p>
        </>
    );

    return (
        <CalculatorLayout
            title="GWA Calculator – General Weighted Average"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "What is GWA?",
                "How to compute GWA in college",
                "Example of how to compute general weighted average in college",
                "How to use this GWA calculator",
                "FAQs"
            ]}
            articleContent={articleContent}
            similarCalculators={3}
        >
            <div className="gwa-calculator-page">

                {/* Grading System Card */}
                <div className="section-card">
                    <div className="card-header">
                        <div className="card-title">Grading system</div>
                        <span className="more-options">...</span>
                    </div>
                    <div className="radio-group">
                        <label className="radio-option">
                            <input
                                type="radio"
                                name="gradingSystem"
                                value="scale_1_5"
                                checked={gradingSystem === 'scale_1_5'}
                                onChange={(e) => setGradingSystem(e.target.value)}
                            />
                            <span className="radio-label">Grade Point Scale (1.00 - 5.00)</span>
                        </label>
                        <label className="radio-option">
                            <input
                                type="radio"
                                name="gradingSystem"
                                value="scale_4_1"
                                checked={gradingSystem === 'scale_4_1'}
                                onChange={(e) => setGradingSystem(e.target.value)}
                            />
                            <span className="radio-label">Grade Point Scale (4.00 - 1.00)</span>
                        </label>
                        <label className="radio-option">
                            <input
                                type="radio"
                                name="gradingSystem"
                                value="letter_1"
                                checked={gradingSystem === 'letter_1'}
                                onChange={(e) => setGradingSystem(e.target.value)}
                            />
                            <span className="radio-label">Letter (A, A-, B+, ...)</span>
                        </label>
                        <label className="radio-option">
                            <input
                                type="radio"
                                name="gradingSystem"
                                value="letter_2"
                                checked={gradingSystem === 'letter_2'}
                                onChange={(e) => setGradingSystem(e.target.value)}
                            />
                            <span className="radio-label">Letter (A, B+, B, ...)</span>
                        </label>
                    </div>
                </div>

                {/* Courses Card */}
                <div className="section-card">
                    <div className="card-header">
                        <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1d4ed8' }}>
                            <ChevronUp size={20} /> Courses
                        </div>
                    </div>

                    {courses.map((course) => (
                        <div className="course-row" key={course.id}>
                            <div className="input-split">
                                <div className="input-col">
                                    <div className="label-row"><label>#{course.id} Course grade</label><span className="more-options">...</span></div>
                                    <div className="input-wrapper">
                                        <select
                                            className="calc-select"
                                            value={course.grade}
                                            onChange={(e) => handleCourseChange(course.id, 'grade', e.target.value)}
                                        >
                                            {getOptions()}
                                        </select>
                                    </div>
                                </div>
                                <div className="input-col">
                                    <div className="label-row"><label>Units</label><span className="more-options">...</span></div>
                                    <div className="input-wrapper">
                                        <input
                                            type="number"
                                            className="calc-input"
                                            value={course.units}
                                            onChange={(e) => handleCourseChange(course.id, 'units', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Result Card */}
                <div className="section-card">
                    <div className="card-header">
                        <div className="card-title">Your GWA</div>
                    </div>

                    {gwa !== null ? (
                        <div className="result-text">
                            Your general weighted average is <strong>{gwa.toFixed(2)}</strong>.
                        </div>
                    ) : (
                        <div className="result-text" style={{ color: '#6b7280' }}>
                            Please enter your grades and positive values for their corresponding units to expect your GWA <strong>here</strong>.
                        </div>
                    )}

                    <div className="calc-actions">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <button className="share-result-btn" style={{ flexDirection: 'column', padding: '1.5rem 0' }}>
                                <div className="share-icon-circle" style={{ width: '40px', height: '40px', fontSize: '1.25rem' }}><Share2 size={20} /></div>
                                <span style={{ marginTop: '0.5rem' }}>Share result</span>
                            </button>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <button className="secondary-btn" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Reload calculator</button>
                                <button className="secondary-btn" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={clearAll}>Clear all changes</button>
                            </div>
                        </div>

                        <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Did we solve your problem today?</span>
                            <div>
                                <button className="feedback-btn" style={{ padding: '0.25rem 1rem', border: '1px solid #e5e7eb', borderRadius: '0.25rem', background: 'white', cursor: 'pointer', margin: '0 0.25rem' }}>Yes</button>
                                <button className="feedback-btn" style={{ padding: '0.25rem 1rem', border: '1px solid #e5e7eb', borderRadius: '0.25rem', background: 'white', cursor: 'pointer', margin: '0 0.25rem' }}>No</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </CalculatorLayout>
    );
};

export default GWACalculatorPage;
