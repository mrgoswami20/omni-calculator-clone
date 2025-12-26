import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, ChevronDown, ChevronUp, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import './ANOVACalculatorPage.css';

// Helper for F-Distribution CDF to calculate p-value
// Source: Adapted from simple statistical library implementations or standard approximations
// We need 1 - cdf(f, df1, df2)
const getFProbability = (f, df1, df2) => {
    if (f <= 0) return 1;
    if (df1 <= 0 || df2 <= 0) return 0;

    // Beta function log
    const logBeta = (x, y) => {
        const logGamma = (z) => {
            const c = [
                76.18009172947146,
                -86.50532032941677,
                24.01409824083091,
                -1.231739572450155,
                0.1208650973866179e-2,
                -0.5395239384953e-5
            ];
            let x = z;
            let y = z;
            let tmp = x + 5.5;
            tmp -= (x + 0.5) * Math.log(tmp);
            let ser = 1.000000000190015;
            for (let i = 0; i < 6; i++) ser += c[i] / ++y;
            return -tmp + Math.log(2.5066282746310005 * ser / x);
        };
        return logGamma(x) + logGamma(y) - logGamma(x + y);
    };

    // Regularized Incomplete Beta Function
    const betai = (a, b, x) => {
        const betacf = (a, b, x) => {
            const MAXIT = 100;
            const EPS = 3.0e-7;
            const FPMIN = 1.0e-30;
            let qab = a + b;
            let qap = a + 1.0;
            let qam = a - 1.0;
            let c = 1.0;
            let d = 1.0 - qab * x / qap;
            if (Math.abs(d) < FPMIN) d = FPMIN;
            d = 1.0 / d;
            let h = d;
            for (let m = 1; m <= MAXIT; m++) {
                let m2 = 2 * m;
                let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
                d = 1.0 + aa * d;
                if (Math.abs(d) < FPMIN) d = FPMIN;
                c = 1.0 + aa / c;
                if (Math.abs(c) < FPMIN) c = FPMIN;
                d = 1.0 / d;
                h *= d * c;
                aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
                d = 1.0 + aa * d;
                if (Math.abs(d) < FPMIN) d = FPMIN;
                c = 1.0 + aa / c;
                if (Math.abs(c) < FPMIN) c = FPMIN;
                d = 1.0 / d;
                h *= d * c;
            }
            return h;
        };

        if (x < 0.0 || x > 1.0) return 0.0;
        let bt = (x === 0.0 || x === 1.0) ? 0.0 :
            Math.exp(logBeta(a, b) * -1 + a * Math.log(x) + b * Math.log(1.0 - x));
        if (x < (a + 1.0) / (a + b + 2.0)) {
            return bt * betacf(a, b, x) / a;
        } else {
            return 1.0 - bt * betacf(b, a, 1.0 - x) / b;
        }
    };

    const x = (df1 * f) / (df1 * f + df2);
    // The integral from 0 to x of the beta density is betai(df1/2, df2/2, x)
    // The F-distribution cdf is betai(df1/2, df2/2, x * (df1 * f) / (df1 * f + df2) ?? No definitions vary.
    // Standard relation: CDF(F) = I_x(d1/2, d2/2) where x = d1*F / (d1*F + d2)
    return 1 - betai(df1 / 2, df2 / 2, x);
};


const ANOVACalculatorPage = () => {
    // Each group: { id, name, values: [val1, val2, val3], isOpen: true }
    const [groups, setGroups] = useState([
        { id: 1, name: "1st group", values: ["", "", ""], isOpen: true },
        { id: 2, name: "2nd group", values: ["", "", ""], isOpen: false },
        { id: 3, name: "3rd group", values: ["", "", ""], isOpen: true }
    ]);
    const [results, setResults] = useState(null);
    const [showShareTooltip, setShowShareTooltip] = useState(false);

    // Dynamic inputs management
    const handleValueChange = (groupId, index, val) => {
        const newGroups = groups.map(g => {
            if (g.id === groupId) {
                const newVals = [...g.values];
                newVals[index] = val;
                return { ...g, values: newVals };
            }
            return g;
        });
        setGroups(newGroups);
    };

    const toggleGroup = (id) => {
        setGroups(groups.map(g => g.id === id ? { ...g, isOpen: !g.isOpen } : g));
    };

    const addGroup = () => {
        const newId = groups.length > 0 ? Math.max(...groups.map(g => g.id)) + 1 : 1;
        const name = `${getOrdinal(newId)} group`;
        setGroups([...groups, { id: newId, name, values: ["", "", ""], isOpen: true }]);
    };

    const clearAll = () => {
        setGroups([
            { id: 1, name: "1st group", values: ["", "", ""], isOpen: true },
            { id: 2, name: "2nd group", values: ["", "", ""], isOpen: false },
            { id: 3, name: "3rd group", values: ["", "", ""], isOpen: true }
        ]);
        setResults(null);
    };

    // Helper for ordinals
    const getOrdinal = (n) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    // Calculation Logic
    useEffect(() => {
        // Gather valid numbers
        const cleanGroups = groups.map(g => {
            const nums = g.values.map(v => parseFloat(v)).filter(v => !isNaN(v));
            return { ...g, nums };
        });

        // Strict check: We need at least 3 groups with 3 values each to match the "text" implication?
        // actually standard ANOVA needs 2+ groups. 
        // The screenshot info says "please enter all three data points for each of the three groups".
        // This implies the specific example needs that.
        // But for general calc, we'll keep it flexible but display results if possible.

        const validGroups = cleanGroups.filter(g => g.nums.length > 0);

        if (validGroups.length < 2) {
            setResults(null);
            return;
        }

        const k = validGroups.length;
        let N = 0;
        let sumTotal = 0;
        let sumSqTotalVals = 0;

        validGroups.forEach(g => {
            const count = g.nums.length;
            const sum = g.nums.reduce((a, b) => a + b, 0);
            const sumSq = g.nums.reduce((a, b) => a + b * b, 0);

            g.count = count;
            g.sum = sum;
            g.mean = count > 0 ? sum / count : 0;
            g.sumSq = sumSq;

            N += count;
            sumTotal += sum;
            sumSqTotalVals += sumSq;
        });

        if (N <= k) {
            setResults(null);
            return;
        }

        const grandMean = sumTotal / N;

        // SS Between
        let SS_between = 0;
        validGroups.forEach(g => {
            SS_between += g.count * Math.pow(g.mean - grandMean, 2);
        });

        // SS Total
        const CF = (sumTotal * sumTotal) / N;
        const SS_total = sumSqTotalVals - CF;

        // SS Within
        const SS_within = SS_total - SS_between;

        // DF
        const df_between = k - 1;
        const df_within = N - k;
        const df_total = N - 1;

        // MS
        const MS_between = SS_between / df_between;
        const MS_within = SS_within / df_within;

        // F
        let F = 0;
        if (MS_within !== 0) {
            F = MS_between / MS_within;
        }

        // P-Value
        const pValue = getFProbability(F, df_between, df_within);

        setResults({
            SS_between, SS_within, SS_total,
            df_between, df_within, df_total,
            MS_between, MS_within,
            F,
            pValue,
            summary: validGroups
        });

    }, [groups]);


    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setShowShareTooltip(true);
            setTimeout(() => setShowShareTooltip(false), 2000);
        } catch (err) {
            console.error('Failed to copy URL:', err);
        }
    };


    const creators = [
        { name: "Dawid Siuda", role: "" },
    ];

    const reviewers = [
        { name: "Anna Szczepanek", role: "PhD" },
    ];

    const articleContent = (
        <div>
            <p>The <strong>ANOVA test Calculator</strong> calculates <strong>statistical analysis on multiple data sets</strong> to determine whether there are any statistically significant differences between the means of three or more independent groups.</p>
            <h3>What is ANOVA?</h3>
            <p>ANOVA stands for <strong>Analysis of Variance</strong>. It is a statistical method used to test differences between two or more means. It may seem odd that the technique is called "Analysis of Variance" rather than "Analysis of Means". As you can see in our calculator, variance is the basis for the computations.</p>
        </div>
    );

    return (
        <CalculatorLayout
            title="ANOVA Calculator"
            creators={creators}
            reviewers={reviewers}
            tocItems={["What is ANOVA?", "ANOVA Formula", "Types of ANOVA Test", "How to Calculate ANOVA?", "FAQs"]}
            articleContent={articleContent}
        >
            <div className="anova-calculator-page">
                {groups.map((group, gIndex) => (
                    <div className="section-card" key={group.id}>
                        <div className="section-header" onClick={() => toggleGroup(group.id)}>
                            {group.isOpen ? <ChevronUp size={20} className="header-icon" /> : <ChevronDown size={20} className="header-icon" />}
                            <h4>{group.name}</h4>
                            <MoreHorizontal size={18} color="#9ca3af" />
                        </div>
                        {group.isOpen && (
                            <div className="group-content">
                                {group.values.map((val, vIndex) => (
                                    <div className="input-row" key={vIndex}>
                                        <label className="input-label">
                                            Value #{vIndex + 1}
                                            <MoreHorizontal size={14} color="#d1d5db" />
                                        </label>
                                        <input
                                            type="number"
                                            className="input-field"
                                            value={val}
                                            onChange={(e) => handleValueChange(group.id, vIndex, e.target.value)}
                                            onWheel={(e) => e.target.blur()}
                                            placeholder=""
                                        />
                                    </div>
                                ))}
                                <div style={{ fontSize: '0.85rem', color: '#436cfe', cursor: 'pointer', marginTop: '8px' }}
                                    onClick={() => {
                                        const newGroups = [...groups];
                                        newGroups[gIndex].values.push("");
                                        setGroups(newGroups);
                                    }}
                                >
                                    + Add value
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {/* Placeholder Results / Actual Results Display area */}
                <div style={{ marginBottom: '24px', padding: '0 8px' }}>
                    <div style={{ fontWeight: 700, marginBottom: '8px', color: '#111827' }}>
                        ANOVA F-statistic: {results ? results.F.toFixed(2) : '__'}
                    </div>
                    <div style={{ fontWeight: 700, marginBottom: '16px', color: '#111827' }}>
                        ANOVA P-value: {results ? (results.pValue < 0.0001 ? '< 0.0001' : results.pValue.toFixed(2)) : '__'}
                    </div>

                    <div style={{
                        backgroundColor: '#eff6ff',
                        padding: '16px',
                        borderRadius: '8px',
                        color: '#1e3a8a',
                        fontSize: '0.9rem',
                        lineHeight: '1.5'
                    }}>
                        To compute the ANOVA F-statistic and P-value, please enter all three data points for each of the three groups.
                    </div>
                </div>



                {results && (
                    <div className="section-card">
                        <div className="section-header">
                            <h4 style={{ color: '#436cfe' }}>ANOVA Results Table</h4>
                        </div>
                        <div className="group-content">
                            <table className="results-table">
                                <thead>
                                    <tr>
                                        <th>Source</th>
                                        <th>DF</th>
                                        <th>SS</th>
                                        <th>MS</th>
                                        <th>F</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Between Groups</td>
                                        <td>{results.df_between}</td>
                                        <td>{results.SS_between.toFixed(4)}</td>
                                        <td>{results.MS_between.toFixed(4)}</td>
                                        <td>{results.F.toFixed(4)}</td>
                                    </tr>
                                    <tr>
                                        <td>Within Groups</td>
                                        <td>{results.df_within}</td>
                                        <td>{results.SS_within.toFixed(4)}</td>
                                        <td>{results.MS_within.toFixed(4)}</td>
                                        <td></td>
                                    </tr>
                                    <tr style={{ borderTop: '2px solid #e5e7eb', fontWeight: '600' }}>
                                        <td>Total</td>
                                        <td>{results.df_total}</td>
                                        <td>{results.SS_total.toFixed(4)}</td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <div className="calc-actions-custom">
                    <button className="share-result-btn-custom" onClick={handleShare}>
                        <div className="share-icon-circle-custom"><Share2 size={24} /></div>
                        Share result
                        {showShareTooltip && <span className="copied-tooltip">Copied!</span>}
                    </button>
                    <div className="secondary-actions-custom">
                        <button className="secondary-btn-custom" onClick={() => window.location.reload()}>Reload calculator</button>
                        <button className="secondary-btn-custom" onClick={clearAll}>Clear all changes</button>
                    </div>
                </div>

                <div className="feedback-section" style={{ marginTop: '2rem' }}>
                    <p>Did we solve your problem today?</p>
                    <div className="feedback-btns">
                        <button>Yes</button>
                        <button>No</button>
                    </div>
                </div>

            </div>
        </CalculatorLayout>
    );
};

export default ANOVACalculatorPage;
