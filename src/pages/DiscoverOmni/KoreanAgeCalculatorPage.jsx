import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Info, ChevronDown, ChevronUp, Share2, MoreHorizontal } from 'lucide-react';
import './KoreanAgeCalculatorPage.css';

const KoreanAgeCalculatorPage = () => {
    // --- State ---
    const [method, setMethod] = useState('birthYear'); // 'birthYear' or 'currentAge'
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [birthYear, setBirthYear] = useState('');

    // For 'currentAge' method
    const [currentAge, setCurrentAge] = useState('');
    const [birthdayPassed, setBirthdayPassed] = useState('yes'); // 'yes' or 'no'

    // Result
    const [koreanAge, setKoreanAge] = useState('');

    // Toggle Sections
    const [isOpenMethod, setIsOpenMethod] = useState(true);
    const [isOpenCalculation, setIsOpenCalculation] = useState(true);

    // --- Logic ---
    useEffect(() => {
        let ageResult = '';

        if (method === 'birthYear') {
            if (birthYear && currentYear) {
                // Formula: (Current Year - Year of Birth) + 1
                const by = parseInt(birthYear);
                const cy = parseInt(currentYear);
                if (!isNaN(by) && !isNaN(cy)) {
                    ageResult = (cy - by) + 1;
                }
            }
        } else if (method === 'currentAge') {
            if (currentAge) {
                const ca = parseInt(currentAge);
                if (!isNaN(ca)) {
                    // Logic deduction:
                    // If birthday passed (e.g., I turned 25 already this year):
                    //   Born = CurrentYear - 25.
                    //   Korean Age = (CurrentYear - (CurrentYear - 25)) + 1 = 25 + 1 = 26. -> Age + 1
                    // If birthday NOT passed (e.g., I am 24, will be 25 later):
                    //   Born = CurrentYear - 24 - 1. (e.g. 2025 - 24 - 1 = 2000)
                    //   Korean Age = (CurrentYear - 2000) + 1 = 26. -> Age + 2

                    if (birthdayPassed === 'yes') {
                        ageResult = ca + 1;
                    } else {
                        ageResult = ca + 2;
                    }
                }
            }
        }

        setKoreanAge(ageResult);
    }, [method, currentYear, birthYear, currentAge, birthdayPassed]);

    // --- Handlers ---
    const handleMethodChange = (newMethod) => {
        setMethod(newMethod);
        setKoreanAge('');
        // Optional: Clear inputs when switching? Or keep them? 
        // Better to clear if they don't map 1:1, but here we can just leave them.
    };

    const handleClear = () => {
        setMethod('birthYear');
        setCurrentYear(new Date().getFullYear());
        setBirthYear('');
        setCurrentAge('');
        setBirthdayPassed('yes');
        setKoreanAge('');
    };

    // --- Content ---
    const creators = [
        { name: "Maria Kluziak", role: "" },
    ];

    const reviewers = [
        { name: "Bogna Szyk", role: "" },
        { name: "Jack Bowater", role: "" }
    ];

    const tocItems = [
        "How to use the Korean age calculator",
        "How to calculate Korean age?",
        "Calculating Korean age – example",
        "Why is age important for Koreans?",
        "FAQs"
    ];

    const educationalContent = (
        <div className="educational-content">
            <p>
                This Korean age calculator is the right place for you if you've ever found yourself wondering, "What is my Korean age?". Use it to learn how to calculate Korean age and read up on this interesting feature of Korean culture. With the help of this tool, the question "How old am I in Korea?" will no longer be a bother to answer.
            </p>
            <h3>How to use the Korean age calculator</h3>
            <p>
                Using our tool is simpler than you might think!
            </p>
            <ol>
                <li>Choose the method you want to use. You can calculate your Korean age using your <strong>year of birth</strong> or your <strong>current age</strong>.</li>
                <li>If you chose <strong>year of birth</strong>, verify the current year is correct, and then simply enter your birth year.</li>
                <li>If you chose <strong>current age</strong>, indicate whether your birthday has passed this year, then enter your age.</li>
                <li>Your <strong>Korean age</strong> will appear instantly in the result box below!</li>
            </ol>

            <h3>How to calculate Korean age?</h3>
            <p>
                Korean age is calculated differently than "international age". In Korea (historically), everyone is 1 year old at birth, and everyone gains a year on New Year's Day, not on their birthday.
            </p>
            <p>
                The formula is very simple:
            </p>
            <div style={{ textAlign: 'center', margin: '20px 0', fontSize: '1.2rem', fontWeight: 'bold' }}>
                Korean Age = (Current Year - Year of Birth) + 1
            </div>

            <h3>Calculating Korean age – example</h3>
            <p>
                Let's say you were born in <strong>2000</strong> and the current year is <strong>2025</strong>.
            </p>
            <ul>
                <li>International Age (approx): 2025 - 2000 = 25 years old.</li>
                <li>Korean Age: (2025 - 2000) + 1 = <strong>26 years old</strong>.</li>
            </ul>

            <h3>Why is age important for Koreans?</h3>
            <p>
                Age determines how people interact with one another in Korea. It dictates the level of politeness in speech (honorifics) and how to behave in social situations (like drinking etiquette or who eats first). Knowing someone's age helps establish the social hierarchy and proper relationship dynamics.
            </p>

            <h3>FAQs</h3>
            <p><strong>Is Korean age still used?</strong></p>
            <p>
                As of June 2023, South Korea officially adopted the international age system for administrative and legal purposes. However, the traditional "Korean age" is still widely used in everyday social life and informal settings.
            </p>
        </div>
    );

    return (
        <CalculatorLayout
            title="Korean Age Calculator"
            creators={creators}
            reviewers={reviewers}
            tocItems={tocItems}
            articleContent={educationalContent}
        >
            <div className="korean-age-calculator">
                {/* METHOD SELECTION CARD */}
                <div className="section-card">
                    <div className="section-header" onClick={() => setIsOpenMethod(!isOpenMethod)}>
                        {isOpenMethod ? <ChevronUp size={20} className="header-icon" /> : <ChevronDown size={20} className="header-icon" />}
                        <h4>Calculate using... <Info size={14} className="info-icon" style={{ marginLeft: '4px' }} /></h4>
                        <MoreHorizontal size={20} className="header-icon" style={{ marginLeft: 'auto' }} />
                    </div>

                    {isOpenMethod && (
                        <div style={{ padding: '0 16px 16px 16px' }}>
                            <div className="radio-group">
                                <div className="radio-item" onClick={() => handleMethodChange('birthYear')}>
                                    <input
                                        type="radio"
                                        checked={method === 'birthYear'}
                                        readOnly
                                    />
                                    <label>your year of birth</label>
                                </div>
                                <div className="radio-item" onClick={() => handleMethodChange('currentAge')}>
                                    <input
                                        type="radio"
                                        checked={method === 'currentAge'}
                                        readOnly
                                    />
                                    <label>your current age</label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* CALCULATION CARD */}
                <div className="section-card">
                    <div className="section-header" onClick={() => setIsOpenCalculation(!isOpenCalculation)}>
                        {isOpenCalculation ? <ChevronUp size={20} className="header-icon" /> : <ChevronDown size={20} className="header-icon" />}
                        <h4>Calculate your Korean age</h4>
                    </div>

                    {isOpenCalculation && (
                        <div style={{ padding: '0 16px 16px 16px' }}>
                            {method === 'birthYear' ? (
                                <>
                                    {/* Current Year */}
                                    <div className="input-group">
                                        <div className="label-row">
                                            <label>Current year <Info size={14} className="info-icon" /></label>
                                            <span className="more-options">...</span>
                                        </div>
                                        <input
                                            className="calc-input"
                                            type="number"
                                            value={currentYear}
                                            onChange={(e) => setCurrentYear(e.target.value)}
                                            onWheel={(e) => e.target.blur()}
                                        />
                                    </div>

                                    {/* Year of Birth */}
                                    <div className="input-group">
                                        <div className="label-row">
                                            <label>Year of birth <span className="more-options">...</span></label>
                                        </div>
                                        <input
                                            className="calc-input"
                                            type="number"
                                            value={birthYear}
                                            onChange={(e) => setBirthYear(e.target.value)}
                                            placeholder=""
                                            onWheel={(e) => e.target.blur()}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Birthday Passed */}
                                    <div className="input-group">
                                        <div className="label-row">
                                            <label>Has your birthday passed this year? <span className="more-options">...</span></label>
                                        </div>
                                        <div className="radio-group" style={{ flexDirection: 'column', gap: '8px' }}>
                                            <div className="radio-item" onClick={() => setBirthdayPassed('yes')}>
                                                <input
                                                    type="radio"
                                                    checked={birthdayPassed === 'yes'}
                                                    readOnly
                                                />
                                                <label>Yes</label>
                                            </div>
                                            <div className="radio-item" onClick={() => setBirthdayPassed('no')}>
                                                <input
                                                    type="radio"
                                                    checked={birthdayPassed === 'no'}
                                                    readOnly
                                                />
                                                <label>No</label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Current Age */}
                                    <div className="input-group">
                                        <div className="label-row">
                                            <label>Your current age <span className="more-options">...</span></label>
                                        </div>
                                        <input
                                            className="calc-input"
                                            type="number"
                                            value={currentAge}
                                            onChange={(e) => setCurrentAge(e.target.value)}
                                            placeholder=""
                                            onWheel={(e) => e.target.blur()}
                                        />
                                    </div>
                                </>
                            )}

                            {/* Result */}
                            <div className="input-group">
                                <div className="label-row">
                                    <label>Korean age <span className="more-options">...</span></label>
                                </div>
                                <div className="result-box">
                                    <input
                                        className="calc-input result-input"
                                        type="text"
                                        value={koreanAge}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* FOOTER ACTIONS */}
                <div className="footer-actions">
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <button type="button" className="btn-share">
                            <div style={{ backgroundColor: '#ff4f6e', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Share2 size={24} color="white" />
                            </div>
                            <span style={{ fontWeight: '600', color: '#111827' }}>Share result</span>
                        </button>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button type="button" onClick={() => window.location.reload()} className="btn-secondary">
                                Reload calculator
                            </button>
                            <button type="button" onClick={handleClear} className="btn-secondary">
                                Clear all changes
                            </button>
                        </div>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem', color: '#6b7280', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
                        Did we solve your problem today?
                        <button type="button" style={{ border: '1px solid #e5e7eb', padding: '4px 12px', borderRadius: '4px', backgroundColor: 'white', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}><span>👍</span> Yes</button>
                        <button type="button" style={{ border: '1px solid #e5e7eb', padding: '4px 12px', borderRadius: '4px', backgroundColor: 'white', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}><span>👎</span> No</button>
                    </div>
                </div>
            </div>
        </CalculatorLayout>
    );
};

export default KoreanAgeCalculatorPage;
