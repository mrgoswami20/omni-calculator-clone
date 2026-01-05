import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, ChevronUp, Check, ChevronDown, Info } from 'lucide-react';
import './HighSchoolGPACalculatorPage.css';

const HighSchoolGPACalculatorPage = () => {
    // Basic settings
    const [weights, setWeights] = useState('equal'); // equal, different
    const [courseType, setCourseType] = useState('regular'); // regular, honors
    const [isCumulative, setIsCumulative] = useState(false);
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

    // Prior Results
    const [priorGPA, setPriorGPA] = useState('');
    const [priorCoursesCount, setPriorCoursesCount] = useState('');

    // Course Data
    // Start with 3 courses. Logic will add more as last one is filled.
    const [courses, setCourses] = useState([
        { id: 1, grade: '' },
        { id: 2, grade: '' },
        { id: 3, grade: '' },
    ]);

    const [gpa, setGpa] = useState(0);
    const [courseCount, setCourseCount] = useState(0);
    const [cumulativeGPA, setCumulativeGPA] = useState(0);

    const gradePoints = {
        'A+': 4.3, 'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D+': 1.3, 'D': 1.0, 'D-': 0.7,
        'E/F': 0.0
    };

    const gradeOptions = Object.keys(gradePoints);

    useEffect(() => {
        calculateGPA();
        handleDynamicInputs();
    }, [courses, priorGPA, priorCoursesCount, isCumulative]);

    const handleDynamicInputs = () => {
        // Find last course
        const lastCourse = courses[courses.length - 1];
        // If last course has a grade and we have less than 20 courses, add one
        if (lastCourse.grade !== '' && courses.length < 20) {
            setCourses([...courses, { id: courses.length + 1, grade: '' }]);
        }
    };

    const calculateGPA = () => {
        let totalPoints = 0;
        let count = 0;

        courses.forEach(c => {
            if (c.grade && gradePoints.hasOwnProperty(c.grade)) {
                totalPoints += gradePoints[c.grade];
                count++;
            }
        });

        setCourseCount(count);

        let currentAvg = 0;
        if (count > 0) {
            currentAvg = totalPoints / count;
            setGpa(parseFloat(currentAvg.toFixed(2)));
        } else {
            setGpa(0);
        }

        // Cumulative Calculation
        if (isCumulative) {
            const pGPA = parseFloat(priorGPA) || 0;
            const pCount = parseFloat(priorCoursesCount) || 0;

            if (pCount > 0 || count > 0) {
                const priorTotalPoints = pGPA * pCount;
                const grandTotalPoints = priorTotalPoints + totalPoints;
                const grandTotalCount = pCount + count;

                if (grandTotalCount > 0) {
                    const cumAvg = grandTotalPoints / grandTotalCount;
                    setCumulativeGPA(parseFloat(cumAvg.toFixed(2)));
                } else {
                    setCumulativeGPA(0);
                }
            } else {
                setCumulativeGPA(0);
            }
        }
    };

    const handleGradeChange = (id, val) => {
        const newCourses = courses.map(c => c.id === id ? { ...c, grade: val } : c);
        setCourses(newCourses);
    };

    const clearAll = () => {
        setCourses([
            { id: 1, grade: '' },
            { id: 2, grade: '' },
            { id: 3, grade: '' },
        ]);
        setWeights('equal');
        setIsCumulative(false);
        setPriorGPA('');
        setPriorCoursesCount('');
        setGpa(0);
        setCumulativeGPA(0);
    };

    const creators = [
        { name: "Hanna Pamuła", role: "PhD" },
    ];

    const reviewers = [
        { name: "Bogna Szyk", role: "" },
        { name: "Adena Benn", role: "" },
    ];

    const articleContent = (
        <>
            <p>
                Use our high school GPA calculator to find out your GPA score. This measure is useful to estimate your performance and assess your chances of successfully applying to the college of your dreams.
            </p>
        </>
    );

    return (
        <CalculatorLayout
            title="High School GPA Calculator"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "High school GPA scale",
                "Weighted vs unweighted GPA",
                "How to calculate high school GPA",
                "Calculate high school cumulative GPA",
                "What is a good GPA in high school?"
            ]}
            articleContent={articleContent}
            similarCalculators={62}
        >
            <div className="hs-gpa-calculator-page">

                {/* Settings Card */}
                <div className="section-card">
                    <div className="card-header">
                        <div className="header-left">
                            {/* No icon in screenshot header, just title */}
                            <div className="card-title">Course settings</div>
                        </div>
                        <span className="more-options">...</span>
                    </div>

                    <div className="radio-group">
                        <div className="group-label"><span>Courses have...</span><span className="more-options">...</span></div>
                        <div className="radio-option" onClick={() => setWeights('equal')}>
                            <div className={`radio-circle ${weights === 'equal' ? 'selected' : ''}`}></div>
                            <span className="radio-text">equal weights</span>
                        </div>
                        <div className="radio-option" onClick={() => setWeights('different')}>
                            <div className={`radio-circle ${weights === 'different' ? 'selected' : ''}`}></div>
                            <span className="radio-text">different credits</span>
                        </div>
                    </div>

                    <div className="radio-group">
                        <div className="group-label"><span>Course types</span><span className="more-options">...</span></div>
                        <div className="radio-option" onClick={() => setCourseType('regular')}>
                            <div className={`radio-circle ${courseType === 'regular' ? 'selected' : ''}`}></div>
                            <span className="radio-text">Only regular courses</span>
                        </div>
                        <div className="radio-option" onClick={() => setCourseType('honors')}>
                            <div className={`radio-circle ${courseType === 'honors' ? 'selected' : ''}`}></div>
                            <span className="radio-text">Honors / AP / IB / College</span>
                        </div>
                    </div>
                </div>

                {/* Courses Card */}
                <div className="section-card">
                    <div className="card-header">
                        <div className="header-left">
                            <ChevronUp size={20} className="text-blue-500" />
                            <div className="card-title">Courses</div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#4b5563' }}>
                        👋 You can enter up to <strong>20 courses</strong>. The next input fields appear when you enter the course grade into the last box.
                    </div>

                    {courses.map((course, idx) => (
                        <div key={course.id} className="course-row">
                            <div className="course-label">
                                <Check size={16} className="check-icon" />
                                <span>#{idx + 1} Course Grade</span>
                                <span className="more-options" style={{ marginLeft: 'auto' }}>...</span>
                            </div>
                            <div className="select-wrapper">
                                <select
                                    className="course-select"
                                    value={course.grade}
                                    onChange={(e) => handleGradeChange(course.id, e.target.value)}
                                >
                                    <option value="">Select</option>
                                    {gradeOptions.map(g => (
                                        <option key={g} value={g}>{g}</option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className="select-arrow" />
                            </div>
                        </div>
                    ))}

                    <div className="checkbox-row" onClick={() => setIsCumulative(!isCumulative)}>
                        <div className={`checkbox-box ${isCumulative ? 'checked' : ''}`} style={{
                            backgroundColor: isCumulative ? '#3b82f6' : 'transparent',
                            borderColor: isCumulative ? '#3b82f6' : '#d1d5db',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {isCumulative && <Check size={14} color="white" />}
                        </div>
                        <span className="radio-text">Calculate your cumulative GPA</span>
                    </div>
                </div>

                {/* Prior Results Card */}
                {isCumulative && (
                    <div className="section-card">
                        <div className="card-header">
                            <div className="header-left">
                                <ChevronUp size={20} className="text-blue-500" />
                                <div className="card-title">Prior results</div>
                            </div>
                        </div>

                        <div className="input-field-group">
                            <div className="label-row"><label>Prior GPA <Info size={14} className="inline ml-1 text-gray-400" /></label><span className="more-options">...</span></div>
                            <div className="input-wrapper">
                                <input type="number" className="calc-input" value={priorGPA} onChange={(e) => setPriorGPA(e.target.value)} />
                            </div>
                        </div>

                        <div className="input-field-group" style={{ marginTop: '1rem' }}>
                            <div className="label-row"><label>Previous number of courses completed</label><span className="more-options">...</span></div>
                            <div className="input-wrapper">
                                <input type="number" className="calc-input" value={priorCoursesCount} onChange={(e) => setPriorCoursesCount(e.target.value)} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Result Card */}
                <div className="section-card">
                    <div className="card-header">
                        <div className="header-left">
                            <div className="card-title">Your GPA</div>
                        </div>
                    </div>

                    <div className="result-info">
                        You've entered <strong>{courseCount}</strong> courses.
                    </div>

                    <div className="result-grade-text">
                        Your GPA is <strong>{gpa}</strong>. This is your unweighted GPA.
                    </div>

                    {isCumulative ? (
                        <div className="result-grade-text" style={{ marginTop: '0.5rem' }}>
                            Your cumulative GPA is <strong>{cumulativeGPA}</strong>.
                        </div>
                    ) : (
                        <div className="result-info" style={{ marginTop: '1rem' }}>
                            Please tick the "Calculate your cumulative GPA" checkbox for your <strong>cumulative GPA</strong>.
                        </div>
                    )}

                    <div className="calc-actions">
                        {/* <button className="share-result-btn" onClick={handleShare}>
                            <div className="share-icon-circle"><Share2 size={16} /></div>
                            Share result
                            {showShareTooltip && <span className="copied-tooltip">Copied!</span>}
                        </button> */}
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

export default HighSchoolGPACalculatorPage;
