import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, Calendar, X, Clock } from 'lucide-react';
import './TimeUntilCalculatorPage.css';

const TimeUntilCalculatorPage = () => {
    // State
    // Default "From" to now. "To" is empty.
    const [fromDate, setFromDate] = useState(() => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    });
    const [toDate, setToDate] = useState('');

    const [result, setResult] = useState(null);
    const [showShareTooltip, setShowShareTooltip] = useState(false);
    const [feedbackGiven, setFeedbackGiven] = useState(false);

    // Logic
    const calculateTimeUntil = () => {
        if (!fromDate || !toDate) {
            setResult(null);
            return;
        }

        const start = new Date(fromDate);
        const end = new Date(toDate);

        // Calculate difference in milliseconds
        let diff = end.getTime() - start.getTime();
        const isPast = diff < 0;
        diff = Math.abs(diff);

        // Constants
        const MS_PER_SECOND = 1000;
        const MS_PER_MINUTE = 60 * MS_PER_SECOND;
        const MS_PER_HOUR = 60 * MS_PER_MINUTE;
        const MS_PER_DAY = 24 * MS_PER_HOUR;

        const days = Math.floor(diff / MS_PER_DAY);
        const hours = Math.floor((diff % MS_PER_DAY) / MS_PER_HOUR);
        const minutes = Math.floor((diff % MS_PER_HOUR) / MS_PER_MINUTE);
        const seconds = Math.floor((diff % MS_PER_MINUTE) / MS_PER_SECOND);

        setResult({
            isPast,
            days,
            hours,
            minutes,
            seconds,
            totalSeconds: Math.floor(diff / 1000)
        });
    };

    useEffect(() => {
        calculateTimeUntil();
    }, [fromDate, toDate]);

    // Handlers
    const handleClear = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        setFromDate(now.toISOString().slice(0, 16));
        setToDate('');
        setResult(null);
    };

    const handleReload = () => {
        handleClear();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setShowShareTooltip(true);
            setTimeout(() => setShowShareTooltip(false), 2000);
        } catch (err) { console.error(err); }
    };

    const handleFeedback = (type) => setFeedbackGiven(true);

    // Content
    const articleContent = (
        <div className="article-content">
            <p>
                Use our <strong>time until calculator</strong> to create a countdown from "now" to any date in the future. We will tell you not only the day left but also calculate how much time from now until the date in <strong>hours, minutes, and seconds</strong>. Keep reading; in this article, you will learn:
            </p>
            <ul>
                <li><a href="#how-to">How do you exactly calculate how much time until a date?</a></li>
                <li><a href="#complete-countdown">Complete our countdown for the time until a date: calculate time left until a date in hours, minutes, and seconds</a></li>
                <li><a href="#spaghetti">Calculate how much time left until spaghetti will go bad</a></li>
                <li><a href="#other">Other countdowns of time until specific dates and events</a></li>
                <li><a href="#faq">FAQs</a></li>
            </ul>
            <h3 id="how-to">How do you exactly calculate how much time until a date?</h3>
            <p>
                To calculate the time until a date, you simply need to subtract the current date (or any starting date) from the target date. The result will be a duration that you can express in various units like days, hours, or seconds.
            </p>
            {/* Extended content placeholders would go here */}
        </div>
    );

    return (
        <CalculatorLayout
            title="Time Until Calculator"
            creators={[{ name: "Davide Borchia", role: "" }]}
            reviewers={[{ name: "Komal Rafay" }]}
            tocItems={[
                "How do you exactly calculate...",
                "Complete our countdown...",
                "Calculate how much time left...",
                "Other countdowns...",
                "FAQs"
            ]}
            articleContent={articleContent}
        >
            <div className="time-until-calculator-page">
                {/* Main Input Card */}
                <div className="section-card">
                    {/* From Input */}
                    <div className="input-group">
                        <div className="label-row">
                            <label>From</label>
                            <div className="menu-dots">...</div>
                        </div>
                        <div className="date-input-wrapper">
                            <input
                                type="datetime-local"
                                className="calc-input"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                            {/* <Calendar className="date-icon" size={18} /> Native picker often has icon, but we can overlay if needed */}
                        </div>
                    </div>

                    {/* To Input */}
                    <div className="input-group">
                        <div className="label-row">
                            <label>To</label>
                            <div className="menu-dots">...</div>
                        </div>
                        <div className="date-input-wrapper">
                            <input
                                type="datetime-local"
                                className="calc-input"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                placeholder="DD/MM/YYYY hh:mm"
                            />
                        </div>
                    </div>

                    {/* Result */}
                    {result && (
                        <div className="result-display fade-in">
                            <div className="result-header">Time {result.isPast ? 'since' : 'until'}:</div>
                            <div className="result-values">
                                <div className="result-item">
                                    <span className="result-number">{result.days}</span>
                                    <span className="result-unit">days</span>
                                </div>
                                <div className="result-item">
                                    <span className="result-number">{result.hours}</span>
                                    <span className="result-unit">hours</span>
                                </div>
                                <div className="result-item">
                                    <span className="result-number">{result.minutes}</span>
                                    <span className="result-unit">minutes</span>
                                </div>
                                <div className="result-item">
                                    <span className="result-number">{result.seconds}</span>
                                    <span className="result-unit">seconds</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="calc-actions">
                    {/* <button className="share-result-btn" onClick={handleShare}>
                        <div className="share-icon-circle"><Share2 size={24} /></div>
                        <span>Share result</span>
                        {showShareTooltip && <span className="copied-tooltip">Copied!</span>}
                    </button> */}

                    <div className="actions-right-stack">
                        <button className="secondary-btn" onClick={handleReload}>Reload calculator</button>
                        <button className="secondary-btn clear-btn" onClick={handleClear}>Clear all changes</button>
                    </div>
                </div>

                {/* Feedback */}
                <div className="feedback-section">
                    {feedbackGiven ? (
                        <span className="feedback-thanks">Thanks for your feedback!</span>
                    ) : (
                        <>
                            <span className="feedback-text">Did we solve your problem today?</span>
                            <div className="feedback-buttons">
                                <button className="feedback-btn" onClick={() => handleFeedback('yes')}>Yes</button>
                                <button className="feedback-btn" onClick={() => handleFeedback('no')}>No</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </CalculatorLayout>
    );
};

export default TimeUntilCalculatorPage;
