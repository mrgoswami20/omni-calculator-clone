import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Info, ChevronDown, ChevronUp, Share2, RotateCcw } from 'lucide-react';
import './AlienCivilizationCalculatorPage.css'; // Reusing existing styles for consistency

const BlackFridayCalculatorPage = () => {
    // --- State ---
    const [dealType, setDealType] = useState('percent_off');
    const [originalPrice, setOriginalPrice] = useState('');
    const [percentDiscount, setPercentDiscount] = useState('');
    const [taxIncluded, setTaxIncluded] = useState(true);
    const [shipping, setShipping] = useState('');
    const [currency, setCurrency] = useState('INR');

    // Additional states
    const [discount2, setDiscount2] = useState('');
    const [discount3, setDiscount3] = useState('');
    const [quantity, setQuantity] = useState(''); // For "Discount on multiple units"

    // Results
    const [youPay, setYouPay] = useState(0);
    const [totalWithShipping, setTotalWithShipping] = useState(0);
    const [youSave, setYouSave] = useState(0);

    // Section Visibility
    const [isOpenDealInfo, setIsOpenDealInfo] = useState(true);
    const [isOpenResults, setIsOpenResults] = useState(true);

    const currencies = [
        "INR", "USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "HKD", "NZD", "SEK", "KRW", "SGD", "NOK", "MXN", "RUB", "ZAR", "TRY", "BRL"
    ];

    // --- Logic ---
    useEffect(() => {
        let price = parseFloat(originalPrice) || 0;
        let finalPay = 0;
        let totalVal = 0; // Value of goods received

        // Helper parse - Ensure all inputs are treated as numbers
        const d1 = parseFloat(percentDiscount) || 0;
        const d2 = parseFloat(discount2) || 0;
        const d3 = parseFloat(discount3) || 0;
        const qty = parseInt(quantity) || 1;
        const ship = parseFloat(shipping) || 0;

        switch (dealType) {
            case 'percent_off':
                // Single item, X% off
                finalPay = price * (1 - d1 / 100);
                totalVal = price;
                break;
            case 'percent_off_2nd':
                // Buy 1 full, 2nd X% off. Total items: 2.
                finalPay = price + price * (1 - d1 / 100);
                totalVal = price * 2;
                break;
            case 'percent_off_3rd':
                // Buy 2 full, 3rd X% off. Total items: 3.
                finalPay = (price * 2) + price * (1 - d1 / 100);
                totalVal = price * 3;
                break;
            case '2_for_1':
                // Pay for 1, get 2
                finalPay = price;
                totalVal = price * 2;
                break;
            case '3_for_2':
                // Pay for 2, get 3
                finalPay = price * 2;
                totalVal = price * 3;
                break;
            case '4_for_3':
                // Pay for 3, get 4
                finalPay = price * 3;
                totalVal = price * 4;
                break;
            case 'double_discount':
                // Price * (1-d1) * (1-d2)
                let p_d1 = price * (1 - d1 / 100);
                finalPay = p_d1 * (1 - d2 / 100);
                totalVal = price;
                break;
            case 'triple_discount':
                let p_t1 = price * (1 - d1 / 100);
                let p_t2 = p_t1 * (1 - d2 / 100);
                finalPay = p_t2 * (1 - d3 / 100);
                totalVal = price;
                break;
            case 'multi_units':
                // Discount on multiple units
                finalPay = (price * qty) * (1 - d1 / 100);
                totalVal = price * qty;
                break;
            default:
                finalPay = price;
                totalVal = price;
        }

        let savings = totalVal - finalPay;

        // Shipping addition (ensure strictly numeric addition)
        let total = Number(finalPay) + Number(ship);

        // Rounding
        setYouPay(finalPay.toFixed(2));
        setTotalWithShipping(total.toFixed(2));
        setYouSave(savings.toFixed(2));

    }, [dealType, originalPrice, percentDiscount, discount2, discount3, quantity, taxIncluded, shipping]);

    const creators = [
        { name: "Arturo Barrantes", role: "" },
        { name: "Hanna Pamula", role: "PhD" },
    ];
    const reviewers = [
        { name: "Bogna Szyk", role: "" },
        { name: "Jack Bowater", role: "" },
    ];

    const tocItems = [
        "Black Friday deals options",
        "What is Black Friday?",
        "When is Black Friday?",
        "Why is it called Black Friday?",
        "Is Black Friday worth it? Things to check before shopping",
        "How to not get caught by marketing tricks"
    ];

    // Helper for Currency Selector
    const CurrencySelect = () => (
        <div className="unit-select-wrapper" style={{ display: 'flex', alignItems: 'center', borderLeft: '1px solid #e5e7eb', paddingLeft: '8px' }}>
            <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                style={{ border: 'none', background: 'transparent', fontWeight: '500', color: '#2563eb', cursor: 'pointer', outline: 'none', appearance: 'none', paddingRight: '16px', maxWidth: '60px' }}
            >
                {currencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={14} style={{ position: 'absolute', right: '8px', pointerEvents: 'none', color: '#2563eb' }} />
        </div>
    );

    const educationalContent = (
        <div className="educational-content">
            <p>
                As <strong>THE</strong> day is coming, we present to you the <strong>Black Friday calculator</strong> – a super useful tool that can guide you through Black Friday deals and sales. As we've based this tool on "the queen of all sciences", we'll help you shop <strong>sensibly, not hot-headedly</strong>. In this calculator we've combined nine different types of deals: from the popular % off, through <em>2 for 1</em> or <em>3 for 2</em> offers, to common double and triple discounts, to make sure you're covered for every possible decision.
            </p>
            <p>
                You need to remember that <strong>Black Friday is a feast day not only for shoppers, but also for dealers</strong>. The offers are usually <em>really</em> convincing, as retailers pull out all the stops - with marketing tricks designed to let your guard down. Do you know that - according to some <a href="#">research</a> - <strong>87% of popular items may be found at a cheaper price another time of the year?</strong> Thus, the most important thing is not to get caught in overwhelming shopping frenzy: use your common sense, research extensively, and - of course - arm yourself with our Black Friday calculator to answer: <strong>is Black Friday worth it?</strong>
            </p>
            <div style={{ margin: '20px 0', textAlign: 'center' }}>
                <img src="https://i.imgflip.com/1r5y5d.jpg" alt="Brace Yourself Black Friday Is Coming Meme" style={{ maxWidth: '100%', borderRadius: '8px' }} />
                <div style={{ fontSize: '0.8rem', color: '#666' }}>BLACK FRIDAY IS COMING</div>
            </div>
            <p>
                We have a tool that will help you understand sale percentages. Just take a look at <a href="/math/percentage-increase-calculator">percent off calculator</a> and be at ease while shopping.
            </p>
            {/* Add more sections as per TOC if text is available */}
        </div>
    );

    return (
        <CalculatorLayout
            title="Black Friday Calculator"
            creators={creators}
            reviewers={reviewers}
            tocItems={tocItems}
            articleContent={educationalContent}
        >
            <div className="calculator-box">
                {/* Intro Card */}
                <div className="section-card" style={{ marginBottom: '16px' }}>
                    <div className="intro-text" style={{ padding: '16px', fontSize: '0.95rem', color: '#374151', lineHeight: '1.5' }}>
                        Get yourself prepared for the incoming <strong>Black Friday discounts</strong>! Use this tool to check how much you actually save on the deals. 🤑🛍️💰
                    </div>
                </div>

                {/* Main Inputs */}
                <div className="section-card">
                    <div className="section-header" onClick={() => setIsOpenDealInfo(!isOpenDealInfo)}>
                        {isOpenDealInfo ? <ChevronUp size={20} className="header-icon" /> : <ChevronDown size={20} className="header-icon" />}
                        <h4>What type of deal?</h4>
                        <span className="more-options">...</span>
                    </div>

                    {isOpenDealInfo && (
                        <div style={{ padding: '0 16px 16px 16px' }}>
                            {/* Deal Type Dropdown */}
                            <div className="input-group">
                                <div className="input-with-unit" style={{ paddingLeft: '0' }}>
                                    <select
                                        className="calc-input"
                                        value={dealType}
                                        onChange={(e) => setDealType(e.target.value)}
                                        style={{ width: '100%', paddingLeft: '12px' }}
                                    >
                                        <option value="percent_off">% off</option>
                                        <option value="percent_off_2nd">% off on 2nd product</option>
                                        <option value="percent_off_3rd">% off on 3rd product</option>
                                        <option value="2_for_1">2 for 1</option>
                                        <option value="3_for_2">3 for 2</option>
                                        <option value="4_for_3">4 for 3</option>
                                        <option value="double_discount">Double discount</option>
                                        <option value="triple_discount">Triple discount</option>
                                        <option value="multi_units">Discount on multiple units</option>
                                    </select>
                                    <ChevronDown size={14} style={{ position: 'absolute', right: '12px', pointerEvents: 'none', color: '#6b7280' }} />
                                </div>
                            </div>

                            {/* Original Price */}
                            <div className="input-group">
                                <div className="label-row">
                                    <label>Original price <Info size={14} className="info-icon" /></label>
                                    <span className="more-options">...</span>
                                </div>
                                <div className="input-with-unit">
                                    <input
                                        className="calc-input"
                                        type="number"
                                        value={originalPrice}
                                        onChange={(e) => setOriginalPrice(e.target.value)}
                                        onWheel={(e) => e.target.blur()}
                                    />
                                    <CurrencySelect />
                                </div>
                            </div>

                            {/* Dynamic Inputs */}

                            {/* Percent Discount */}
                            {(dealType === 'percent_off' || dealType === 'double_discount' || dealType === 'triple_discount' || dealType === 'percent_off_2nd' || dealType === 'percent_off_3rd' || dealType === 'multi_units') && (
                                <div className="input-group">
                                    <div className="label-row">
                                        <label>Discount <span className="more-options">...</span></label>
                                    </div>
                                    <div className="input-with-unit">
                                        <input
                                            className="calc-input"
                                            type="number"
                                            value={percentDiscount}
                                            onChange={(e) => setPercentDiscount(e.target.value)}
                                            onWheel={(e) => e.target.blur()}
                                        />
                                        <div className="unit-label-fixed">%</div>
                                    </div>
                                </div>
                            )}

                            {/* Quantity for Multi Units */}
                            {dealType === 'multi_units' && (
                                <div className="input-group">
                                    <div className="label-row">
                                        <label>Number of items <span className="more-options">...</span></label>
                                    </div>
                                    <div className="input-with-unit">
                                        <input
                                            className="calc-input"
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            onWheel={(e) => e.target.blur()}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Discount 2 */}
                            {(dealType === 'double_discount' || dealType === 'triple_discount') && (
                                <div className="input-group">
                                    <div className="label-row">
                                        <label>Discount 2 <span className="more-options">...</span></label>
                                    </div>
                                    <div className="input-with-unit">
                                        <input
                                            className="calc-input"
                                            type="number"
                                            value={discount2}
                                            onChange={(e) => setDiscount2(e.target.value)}
                                            onWheel={(e) => e.target.blur()}
                                        />
                                        <div className="unit-label-fixed">%</div>
                                    </div>
                                </div>
                            )}

                            {/* Discount 3 */}
                            {dealType === 'triple_discount' && (
                                <div className="input-group">
                                    <div className="label-row">
                                        <label>Discount 3 <span className="more-options">...</span></label>
                                    </div>
                                    <div className="input-with-unit">
                                        <input
                                            className="calc-input"
                                            type="number"
                                            value={discount3}
                                            onChange={(e) => setDiscount3(e.target.value)}
                                            onWheel={(e) => e.target.blur()}
                                        />
                                        <div className="unit-label-fixed">%</div>
                                    </div>
                                </div>
                            )}

                            {/* Tax Included Radio */}
                            <div className="input-group" style={{ marginTop: '16px' }}>
                                <div className="label-row">
                                    <label>Is tax included in price? <Info size={14} className="info-icon" /></label>
                                    <span className="more-options">...</span>
                                </div>
                                <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            checked={taxIncluded}
                                            onChange={() => setTaxIncluded(true)}
                                            style={{ accentColor: '#2563eb', width: '18px', height: '18px' }}
                                        />
                                        <span style={{ fontSize: '0.9rem' }}>Yes</span>
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            checked={!taxIncluded}
                                            onChange={() => setTaxIncluded(false)}
                                            style={{ accentColor: '#2563eb', width: '18px', height: '18px' }}
                                        />
                                        <span style={{ fontSize: '0.9rem' }}>No</span>
                                    </label>
                                </div>
                            </div>

                            {/* Shipping */}
                            <div className="input-group">
                                <div className="label-row">
                                    <label>Shipping <span className="more-options">...</span></label>
                                </div>
                                <div className="input-with-unit">
                                    <input
                                        className="calc-input"
                                        type="number"
                                        value={shipping}
                                        onChange={(e) => setShipping(e.target.value)}
                                        onWheel={(e) => e.target.blur()}
                                    />
                                    <CurrencySelect />
                                </div>
                            </div>

                        </div>
                    )}
                </div>

                {/* Results: Your deal */}
                <div className="section-card" style={{ marginTop: '16px' }}>
                    <div className="section-header" onClick={() => setIsOpenResults(!isOpenResults)}>
                        {isOpenResults ? <ChevronUp size={20} className="header-icon" /> : <ChevronDown size={20} className="header-icon" />}
                        <h4>Your deal</h4>
                    </div>
                    {isOpenResults && (
                        <div style={{ padding: '0 16px 16px 16px' }}>
                            <div className="input-group">
                                <div className="label-row">
                                    <label>You pay <span className="more-options">...</span></label>
                                </div>
                                <div className="input-with-unit">
                                    <input
                                        className="calc-input"
                                        type="number"
                                        readOnly
                                        value={youPay}
                                        style={{ backgroundColor: '#f3f4f6' }}
                                    />
                                    <CurrencySelect />
                                </div>
                            </div>

                            <div className="input-group">
                                <div className="label-row">
                                    <label>Including shipping <Info size={14} className="info-icon" /></label>
                                    <span className="more-options">...</span>
                                </div>
                                <div className="input-with-unit">
                                    <input
                                        className="calc-input"
                                        type="number"
                                        readOnly
                                        value={totalWithShipping}
                                        style={{ backgroundColor: '#f3f4f6' }}
                                    />
                                    <CurrencySelect />
                                </div>
                            </div>

                            <div className="input-group">
                                <div className="label-row">
                                    <label>You're saving <span className="more-options">...</span></label>
                                </div>
                                <div className="input-with-unit">
                                    <input
                                        className="calc-input"
                                        type="number"
                                        readOnly
                                        value={youSave}
                                        style={{ backgroundColor: '#f3f4f6' }}
                                    />
                                    <CurrencySelect />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="footer-actions" style={{ marginTop: '24px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: 'white' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <button type="button" className="btn-share" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: 'white', cursor: 'pointer', height: '100px' }}>
                            <div style={{ backgroundColor: '#ff4f6e', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Share2 size={24} color="white" />
                            </div>
                            <span style={{ fontWeight: '600', color: '#111827' }}>Share result</span>
                        </button>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button type="button" onClick={() => window.location.reload()} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: 'white', fontSize: '0.9rem', fontWeight: '500', color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                Reload calculator
                            </button>
                            <button type="button" onClick={() => {
                                setDealType('percent_off');
                                setOriginalPrice('');
                                setPercentDiscount('');
                                setShipping('');
                                setTaxIncluded(true);
                                setQuantity('');
                                setDiscount2('');
                                setDiscount3('');
                                setCurrency('INR');
                            }} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', backgroundColor: 'white', fontSize: '0.9rem', fontWeight: '500', color: '#374151', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

export default BlackFridayCalculatorPage;
