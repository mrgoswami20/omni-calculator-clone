import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, ChevronDown, MoreVertical, RotateCcw } from 'lucide-react';
import './SalaryToHourlyCalculatorPage.css';

const SalaryToHourlyCalculatorPage = () => {
    // Core State: We store everything to allow independent editing, 
    // but we use 'hourly' and 'hoursPerWeek' as the source of truth for calculations when 'hoursPerWeek' changes.
    // However, since it's bidirectional, any edit triggers a full update.

    // Using strings for inputs to allow empty states
    const [values, setValues] = useState({
        hourly: '',
        hoursPerWeek: '',
        annual: '',
        monthly: '',
        weekly: '',
        biweekly: '',
        daily: '',
        perMinute: '',
        perSecond: ''
    });

    // UI State
    const [isWageAsOpen, setIsWageAsOpen] = useState(true);
    const [isOtherOpen, setIsOtherOpen] = useState(false);
    const [showShareTooltip, setShowShareTooltip] = useState(false);

    // Constants
    const WEEKS_PER_YEAR = 52;
    const MONTHS_PER_YEAR = 12;
    const DAYS_PER_WEEK = 5; // Standard assumption for "Daily"

    // formatting
    const toFixed = (val) => {
        if (val === '' || isNaN(val)) return '';
        // Avoid excessive decimals but keep precision
        return parseFloat(val.toFixed(2)).toString();
    };

    const updateAllFromHourly = (hourlyStr, hoursPerWeekStr) => {
        const hourly = parseFloat(hourlyStr);
        const hours = parseFloat(hoursPerWeekStr);

        if (isNaN(hourly) || isNaN(hours)) {
            return {
                hourly: hourlyStr,
                hoursPerWeek: hoursPerWeekStr,
                annual: '',
                monthly: '',
                weekly: '',
                biweekly: '',
                daily: '',
                perMinute: '',
                perSecond: ''
            };
        }

        const weekly = hourly * hours;
        const annual = weekly * WEEKS_PER_YEAR;
        const monthly = annual / MONTHS_PER_YEAR;
        const biweekly = weekly * 2;
        const daily = weekly / DAYS_PER_WEEK;
        const perMinute = hourly / 60;
        const perSecond = hourly / 3600;

        return {
            hourly: hourlyStr,
            hoursPerWeek: hoursPerWeekStr,
            annual: toFixed(annual),
            monthly: toFixed(monthly),
            weekly: toFixed(weekly),
            biweekly: toFixed(biweekly),
            daily: toFixed(daily),
            perMinute: toFixed(perMinute),
            perSecond: toFixed(perSecond)
        };
    };

    const handleInputChange = (field, val) => {
        // Allow updating the specific field immediately
        // Then calculate 'hourly' from it (if not hourly), then update all.

        let newValues = { ...values, [field]: val };
        const hours = parseFloat(newValues.hoursPerWeek) || 40;

        if (val === '') {
            setValues(newValues);
            return;
        }

        const numVal = parseFloat(val);
        if (isNaN(numVal)) return; // Should be handled by input type, but safety first

        let derivedHourly = 0;

        // Reverse Calculate Hourly
        switch (field) {
            case 'hourly':
                derivedHourly = numVal;
                break;
            case 'hoursPerWeek':
                // Special case: if hours change, we usually keep the Annual salary constant? 
                // Or keep Hourly constant? Omni usually keeps Hourly constant unless specified.
                // Let's keep Hourly constant and recalculate others.
                derivedHourly = parseFloat(values.hourly) || 0;
                break;
            case 'annual':
                derivedHourly = numVal / (WEEKS_PER_YEAR * hours);
                break;
            case 'monthly':
                derivedHourly = (numVal * MONTHS_PER_YEAR) / (WEEKS_PER_YEAR * hours);
                break;
            case 'weekly':
                derivedHourly = numVal / hours;
                break;
            case 'biweekly':
                derivedHourly = (numVal / 2) / hours;
                break;
            case 'daily':
                derivedHourly = (numVal * DAYS_PER_WEEK) / hours;
                break;
            case 'perMinute':
                derivedHourly = numVal * 60;
                break;
            case 'perSecond':
                derivedHourly = numVal * 3600;
                break;
            default:
                break;
        }

        if (field === 'hoursPerWeek') {
            // If hours change, we update everything based on CURRENT hourly rate (preserving rate)
            // UNLESS we want to preserve Annual? Usually preserving Rate is safer for "Salary to Hourly".
            const newData = updateAllFromHourly(values.hourly, val);
            setValues(newData);
        } else {
            const newData = updateAllFromHourly(derivedHourly, newValues.hoursPerWeek);
            // setValues(newData); // This overwrites the field we are typing in if rounding differs!
            // To prevent cursor jumping or rounding fighting, we should preserve the exact input string for the edited field.
            setValues({ ...newData, [field]: val });
        }
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setShowShareTooltip(true);
            setTimeout(() => setShowShareTooltip(false), 2000);
        } catch (err) { console.error(err); }
    };

    const handleClear = () => {
        setValues({
            hourly: '',
            hoursPerWeek: '40',
            annual: '',
            monthly: '',
            weekly: '',
            biweekly: '',
            daily: '',
            perMinute: '',
            perSecond: ''
        });
    };

    const handleReload = () => {
        setValues({
            hourly: '',
            hoursPerWeek: '',
            annual: '',
            monthly: '',
            weekly: '',
            biweekly: '',
            daily: '',
            perMinute: '',
            perSecond: ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const articleContent = (
        <div className="article-content">
            <p>
                Our <strong>salary to hourly calculator</strong> is a simple yet powerful tool that helps you convert your salary into an hourly wage (or vice versa). Whether you're paid <strong>yearly, monthly, or weekly</strong>, we'll help you find out exactly how much your time is worth per hour.
            </p>
            <h3>How to calculate hourly wage from annual salary?</h3>
            <p>
                To calculate your hourly wage from an annual salary, you need to divide your total yearly income by the number of hours you work in a year.
                <br /><br />
                <strong>Formula:</strong> <code>Hourly Rate = Annual Salary / (Hours per Week × Weeks per Year)</code>
            </p>
            <p>
                For example, if you earn $50,000 a year and work 40 hours a week for 52 weeks:
                <br />
                <code>$50,000 / (40 × 52) = $50,000 / 2,080 = $24.04 per hour</code>
            </p>
        </div>
    );

    // Reusable Input Component for Grid
    const CalcInput = ({ label, value, field, unit = 'INR' }) => (
        <div className="input-row">
            <div className="label-wrapper">
                <label>{label}</label>
                <MoreVertical size={16} className="dots-icon" />
            </div>
            <div className="field-wrapper">
                <input
                    type="number"
                    className="sc-input"
                    value={value}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    onWheel={(e) => e.target.blur()}
                />
                {unit && (
                    <div className="unit-badge">
                        <span>{unit}</span>
                        <ChevronDown size={14} />
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <CalculatorLayout
            title="Salary to Hourly Calculator"
            creators={[{ name: "Mateusz Mucha", role: "" }, { name: "Filip Derma", role: "" }]}
            reviewers={[{ name: "Bogna Szyk" }]}
            tocItems={["Salary to hourly", "Paycheck calculator", "How to calculate...", "Salary range", "FAQs"]}
            articleContent={articleContent}
        >
            <div className="salary-calculator-container">

                {/* 1. Main Card */}
                <div className="calc-card">
                    <CalcInput label="Hourly wage" value={values.hourly} field="hourly" />
                    <CalcInput label="Hours per week" value={values.hoursPerWeek} field="hoursPerWeek" unit={null} />
                    <CalcInput label="Annual salary" value={values.annual} field="annual" />
                </div>

                {/* 2. Your Wage As (Collapsible) */}
                <div className="calc-card">
                    <div className="card-header" onClick={() => setIsWageAsOpen(!isWageAsOpen)}>
                        <div className="header-title-group">
                            <div className={`chevron-circle ${isWageAsOpen ? 'open' : ''}`}>
                                <ChevronDown size={16} />
                            </div>
                            <span className="header-title">Your wage as:</span>
                        </div>
                    </div>
                    {isWageAsOpen && (
                        <div className="card-body grid-2-col">
                            <CalcInput label="Daily" value={values.daily} field="daily" />
                            <CalcInput label="Monthly" value={values.monthly} field="monthly" />
                            <CalcInput label="Weekly" value={values.weekly} field="weekly" />
                            <CalcInput label="Biweekly" value={values.biweekly} field="biweekly" />
                        </div>
                    )}
                </div>

                {/* 3. Other time intervals (Collapsible) */}
                <div className="calc-card">
                    <div className="card-header" onClick={() => setIsOtherOpen(!isOtherOpen)}>
                        <div className="header-title-group">
                            <div className={`chevron-circle ${isOtherOpen ? 'open' : ''}`}>
                                <ChevronDown size={16} />
                            </div>
                            <span className="header-title">Other time intervals</span>
                        </div>
                    </div>
                    {isOtherOpen && (
                        <div className="card-body">
                            <CalcInput label="Per minute" value={values.perMinute} field="perMinute" />
                            <CalcInput label="Per second" value={values.perSecond} field="perSecond" />
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="calc-actions">
                    <button className="share-result-btn" onClick={handleShare}>
                        <div className="share-icon-circle"><Share2 size={24} /></div>
                        <span>Share result</span>
                        {showShareTooltip && <span className="copied-tooltip">Copied!</span>}
                    </button>

                    <div className="actions-right-stack">
                        <button className="secondary-btn" onClick={handleReload}>Reload calculator</button>
                        <button className="secondary-btn clear-btn" onClick={handleClear}>Clear all changes</button>
                    </div>
                </div>

            </div>
        </CalculatorLayout>
    );
};

export default SalaryToHourlyCalculatorPage;
