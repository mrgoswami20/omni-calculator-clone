import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../components/CalculatorLayout';
import '../components/CalculatorLayout.css';

const TestGradeCalculatorPage = () => {
    const [totalQuestions, setTotalQuestions] = useState('');
    const [wrongAnswers, setWrongAnswers] = useState('');
    const [points, setPoints] = useState('');
    const [percentage, setPercentage] = useState('');
    const [grade, setGrade] = useState('');

    useEffect(() => {
        if (totalQuestions && wrongAnswers) {
            const tot = parseFloat(totalQuestions);
            const wrong = parseFloat(wrongAnswers);
            const correct = tot - wrong;
            if (tot > 0) {
                const perc = (correct / tot) * 100;
                setPoints(`${correct.toFixed(0)} / ${tot}`);
                setPercentage(`${perc.toFixed(1)}%`);

                let g = 'F';
                if (perc >= 90) g = 'A';
                else if (perc >= 80) g = 'B';
                else if (perc >= 70) g = 'C';
                else if (perc >= 60) g = 'D';
                setGrade(g);
            }
        }
    }, [totalQuestions, wrongAnswers]);

    return (
        <CalculatorLayout
            title="Test Grade Calculator"
            creators={[{ name: "Kevin Zhou" }]}
            reviewers={[{ name: "Dominik Czernia" }]}
            tocItems={["Grading scale", "How detailed is this?"]}
        >
            <div className="calculator-card">
                <div className="input-group">
                    <label style={{ display: 'block', marginBottom: '4px' }}>Total Questions</label>
                    <div className="input-wrapper">
                        <input type="number" value={totalQuestions} onChange={(e) => setTotalQuestions(e.target.value)} />
                    </div>
                </div>
                <div className="input-group">
                    <label style={{ display: 'block', marginBottom: '4px' }}>Wrong Answers</label>
                    <div className="input-wrapper">
                        <input type="number" value={wrongAnswers} onChange={(e) => setWrongAnswers(e.target.value)} />
                    </div>
                </div>

                <div className="input-group result-group">
                    <label style={{ display: 'block', marginBottom: '4px' }}>Score</label>
                    <div className="input-wrapper">
                        <input type="text" value={percentage} readOnly className="result-input" placeholder="Percentage" />
                    </div>
                </div>
                <div className="input-group result-group">
                    <label style={{ display: 'block', marginBottom: '4px' }}>Letter Grade</label>
                    <div className="input-wrapper">
                        <input type="text" value={grade} readOnly className="result-input" placeholder="Grade" />
                    </div>
                </div>
            </div>
        </CalculatorLayout>
    );
};

export default TestGradeCalculatorPage;
