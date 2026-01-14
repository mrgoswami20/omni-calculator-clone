import React, { useState } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, ChevronDown, MoreVertical, Info, Pin, ThumbsUp, ThumbsDown } from 'lucide-react';
import './MarginCalculatorPage.css';

// Reusable Input Component for Grid
// Reusable Input Component for Grid (Standard Style)
const CalcInput = ({ label, value, field, unit = 'INR', onChange, isPinned = false, hasInfo = false }) => (
    <div className="input-row">
        <div className="label-wrapper">
            <label>{label}</label>
            <div className="label-icons">
                {isPinned && <Pin size={14} className="pin-icon" color="#6b7280" style={{ transform: 'rotate(45deg)' }} />}
                <MoreVertical size={16} className="dots-icon" />
            </div>
        </div>
        <div className="field-wrapper">
            <input
                type="number"
                className="sc-input"
                value={value}
                onChange={(e) => onChange(field, e.target.value)}
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

const MarginCalculatorPage = () => {
    const [values, setValues] = useState({
        cost: '',
        margin: '',
        revenue: '',
        profit: ''
    });

    const [showShareTooltip, setShowShareTooltip] = useState(false);

    // Helper to round to 2 decimals max, but allow empty strings
    const toFixed = (val) => {
        if (val === '' || isNaN(val)) return '';
        // Avoid excessive decimals but keep precision
        return parseFloat(val.toFixed(2)).toString();
    };

    const handleInputChange = (field, val) => {
        let newValues = { ...values, [field]: val };

        if (val === '') {
            // If clearing a field, we might want to clear calculated fields or just leave them?
            // "Clear" logic usually implies we don't know this value anymore.
            // But checking the requested clearing logic from Salary calculator:
            // "When input cleared, dependent fields clear".
            // Here it's complex because any pairing works. 
            // Let's assume if we clear a field, we just set it to empty. 
            // If that leaves us with < 2 inputs, we can't calculate full state, so we might need to clear derived ones.
            // Let's keep it simple: just update the state.
            setValues(newValues);
            // If we have less than 2 valid inputs, we might want to clear others?
            // Actually, let's re-run calculation only if we have enough inputs.
            return;
        }

        const numVal = parseFloat(val);
        if (isNaN(numVal)) return;

        // Calculations
        // We need 2 valid inputs to calculate the rest. 
        // We prioritize based on what was just edited ('val' is the new Truth).

        let cost = parseFloat(newValues.cost);
        let margin = parseFloat(newValues.margin);
        let revenue = parseFloat(newValues.revenue);
        let profit = parseFloat(newValues.profit);

        // Helper to check validity
        const isValid = (n) => !isNaN(n) && n !== '';

        if (field === 'cost') {
            cost = numVal;
            if (isValid(margin)) {
                // Cost + Margin -> Revenue, Profit
                // Margin = (Revenue - Cost) / Revenue 
                // Margin = 1 - (Cost / Revenue)
                // Cost / Revenue = 1 - Margin
                // Revenue = Cost / (1 - Margin/100)
                revenue = cost / (1 - margin / 100);
                profit = revenue - cost;
            } else if (isValid(revenue)) {
                // Cost + Revenue -> Margin, Profit
                profit = revenue - cost;
                margin = (profit / revenue) * 100;
            } else if (isValid(profit)) {
                // Cost + Profit -> Revenue, Margin
                revenue = cost + profit;
                margin = (profit / revenue) * 100;
            }
        } else if (field === 'margin') {
            margin = numVal;
            if (isValid(cost)) {
                // Cost + Margin -> Revenue, Profit
                revenue = cost / (1 - margin / 100);
                profit = revenue - cost;
            } else if (isValid(revenue)) {
                // Revenue + Margin -> Cost, Profit
                // Margin = (Revenue - Cost) / Revenue
                // Revenue * Margin = Revenue - Cost
                // Cost = Revenue - (Revenue * Margin)
                cost = revenue * (1 - margin / 100);
                profit = revenue - cost;
            } else if (isValid(profit)) {
                // Profit + Margin -> Cost, Revenue
                // Margin = Profit / Revenue
                // Revenue = Profit / Margin
                revenue = profit / (margin / 100);
                cost = revenue - profit;
            }
        } else if (field === 'revenue') {
            revenue = numVal;
            if (isValid(cost)) {
                // Revenue + Cost -> Margin, Profit
                profit = revenue - cost;
                margin = (profit / revenue) * 100;
            } else if (isValid(margin)) {
                // Revenue + Margin -> Cost, Profit
                cost = revenue * (1 - margin / 100);
                profit = revenue - cost;
            } else if (isValid(profit)) {
                // Revenue + Profit -> Cost, Margin
                cost = revenue - profit;
                margin = (profit / revenue) * 100;
            }
        } else if (field === 'profit') {
            profit = numVal;
            if (isValid(revenue)) {
                // Profit + Revenue -> Cost, Margin
                cost = revenue - profit;
                margin = (profit / revenue) * 100;
            } else if (isValid(cost)) {
                // Profit + Cost -> Revenue, Margin
                revenue = cost + profit;
                margin = (profit / revenue) * 100;
            } else if (isValid(margin)) {
                // Profit + Margin -> Revenue, Cost
                revenue = profit / (margin / 100);
                cost = revenue - profit;
            }
        }

        // Apply string formatting for display, but keep the field currently being edited as is (string)
        // to prevent cursor jumping.
        const res = {
            cost: field === 'cost' ? val : toFixed(cost),
            margin: field === 'margin' ? val : toFixed(margin),
            revenue: field === 'revenue' ? val : toFixed(revenue),
            profit: field === 'profit' ? val : toFixed(profit),
        };

        setValues(res);
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setShowShareTooltip(true);
            setTimeout(() => setShowShareTooltip(false), 2000);
        } catch (err) { console.error(err); }
    };

    const handleReload = () => {
        setValues({
            cost: '',
            margin: '',
            revenue: '',
            profit: ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleClear = () => {
        setValues({
            cost: '',
            margin: '',
            revenue: '',
            profit: ''
        });
    };

    const articleContent = (
        <div className="article-content">
            <p>
                This <strong>margin calculator</strong> will be your best friend if you want to <strong>find out an item's revenue</strong>, assuming you know its cost and your desired profit margin percentage. That's not all, though; you can calculate any of the main variables in the sales process — <strong>cost of goods sold</strong> (how much you paid for the stuff that you sell), <strong>profit margin</strong>, <strong>revenue</strong> (how much you sell it for) and <strong>profit</strong> — from any two of the other values. In general, your profit margin determines how healthy your company is — with low margins, you're dancing on thin ice, and any change for the worse may result in big trouble. High profit margins mean there's a lot of room for errors and bad luck. Keep reading to find out how to find your profit margin and what is the gross margin formula.
            </p>
            <p>
                We have a few calculators that are similar in nature — you can check out our margin and VAT calculator (or margin and sales tax) or margin with a discount calculator.
            </p>

            <h3>How to calculate profit margin</h3>
            <p>
                1. Find out your <strong>COGS</strong> (cost of goods sold). For example $30.
                <br />
                2. Find out your <strong>revenue</strong> (how much you sell these goods for, for example, $50).
                <br />
                3. Calculate the gross profit by subtracting the cost from the revenue. <code>$50 - $30 = $20</code>.
                <br />
                4. Divide gross profit by revenue: <code>$20 / $50 = 0.4</code>.
                <br />
                5. Express it as percentages: <code>0.4 * 100 = 40%</code>.
                <br />
                This is how you calculate profit margin... or simply use our gross margin calculator!
                <br />
                As you can see, the margin is a simple percentage calculation, but, as opposed to markup, it's based on revenue, not on cost of goods sold (COGS).
            </p>
            <p>Check our markup calculator to learn the differences between margin and markup!</p>

            <h3>Gross margin formula</h3>
            <p>
                The formula for gross margin percentage is as follows:
                <br /><br />
                <code>gross margin = 100 × profit / revenue</code>
                <br />
                (when expressed as a percentage). The profit equation is:
                <br />
                <code>profit = revenue - costs</code>
                <br />
                so an alternative margin formula is:
                <br />
                <code>margin = 100 × (revenue - costs) / revenue</code>
            </p>
            <p>
                Now that you know how to calculate profit margin, here's the formula for revenue:
                <br />
                <code>revenue = 100 × profit / margin</code>
            </p>
            <p>
                And finally, to calculate how much you can pay for an item, given your margin and revenue (or profit), do the following:
                <br />
                <code>costs = revenue - margin × revenue / 100</code>
            </p>

            <h3>A note on terminology</h3>
            <p>
                All the terms (margin, profit margin, gross margin, gross profit margin) are a bit blurry, and everyone uses them in slightly different contexts. For example, costs may or may not include expenses other than COGS — usually, they don't. In this calculator, we are using these terms interchangeably, and forgive us if they're not in line with some definitions. To us, what's more important is what these terms mean to most people, and for this simple calculation the differences don't really matter. Luckily, it's likely that you already know what you need and how to treat this data. This tool will work as gross margin calculator or a profit margin calculator.
            </p>
            <p>
                So the difference is completely irrelevant for the purpose of our calculations — it doesn't matter in this case if costs include marketing or transport. Most of the time people come here from Google after having searched for different keywords. In addition to those mentioned before, they searched for profit calculator, profit margin formula, how to calculate profit, gross profit calculator (or just gp calculator), and even sales margin formula.
            </p>

            <h3>Margin vs. markup</h3>
            <p>
                The difference between gross margin and markup is small but important. The former is the ratio of profit to the sale price, and the latter is the ratio of profit to the purchase price (cost of goods sold). In layman's terms, profit is also known as either markup or margin when we're dealing with raw numbers, not percentages. It's interesting how some people prefer to calculate the markup while others think in terms of gross margin. It seems to us that markup is more intuitive, but judging by the number of people who search for markup calculator and margin calculator, the latter is a few times more popular.
            </p>

            <h3>FAQs</h3>
            <h4>What's the difference between gross and net profit margin?</h4>
            <p>
                Gross profit margin is your profit divided by revenue (the raw amount of money made). Net profit margin is profit minus the price of all other expenses (rent, wages, taxes, etc.) divided by revenue. Think of it as the money that ends up in your pocket. While gross profit margin is a useful measure, investors are more likely to look at your net profit margin, as it shows whether operating costs are being covered.
            </p>

            <h4>Can profit margin be too high?</h4>
            <p>
                While a common sense approach to economics would be to maximize revenue, it should not be spent idly — reinvest most of this money to promote growth. Pocket as little as possible, or your business will suffer in the long term! There are also certain practices that, despite short-term profit, will cost you more money in the long run, e.g., importing resources from a country likely to be subject to economic sanctions in the future or buying a property that will be underwater in 5 years.
            </p>

            <h4>What is margin in sales?</h4>
            <p>
                Your sales margin is the product of the selling price of an item or service, minus the expenses it took to get the product to be sold, expressed as a percentage. These expenses include: discounts, material and manufacturing costs, employee salaries, rent, etc.
            </p>

            <h4>How do I calculate a 20% profit margin?</h4>
            <p>
                To calculate a 20% profit margin:
                <br />
                1. Express 20% in its decimal form, 0.2.
                <br />
                2. Subtract 0.2 from 1 to get 0.8.
                <br />
                3. Divide the original price of your good by 0.8.
                <br />
                There you go. This new number is how much you should charge for a 20% profit margin.
            </p>

            <h4>What is a good margin?</h4>
            <p>
                There is no definite answer to "what is a good margin" — the answer you will get will vary depending on whom you ask, and your type of business. Firstly, you should never have a negative gross or net profit margin; otherwise, you are losing money.
                <br /><br />
                Generally, a 5% net margin is poor, 10% is okay, while 20% is considered a good margin. There is no set good margin for a new business, so check your respective industry for an idea of representative margins, but be prepared for your margin to be lower. For small businesses, employees are often your main expense.
            </p>

            <h4>How do I calculate margin in Excel?</h4>
            <p>
                While it's easier to use the Omni Margin Calculator, it is useful to know how to calculate margin in Excel:
                <br />
                1. Input the cost of goods sold (for example, into cell A1).
                <br />
                2. Input your revenue on the product (for example, into cell B1).
                <br />
                3. Calculate profit by subtracting cost from revenue (In C1, input =B1-A1) and label it “profit”.
                <br />
                4. Divide profit by revenue and multiply it by 100 (In D1, input =(C1/B1)) and label it “margin”.
                <br />
                5. Right-click on the final cell and select Format Cells.
                <br />
                6. In the Format Cells box, under Number, select Percentage and specify your desired number of decimal places.
            </p>

            <h4>How do I calculate a 10% margin?</h4>
            <p>
                To calculate a 10% profit margin:
                <br />
                1. Make 10% a decimal by dividing 10 by 100 to get 0.1.
                <br />
                2. Take 0.1 away from 1, equalling 0.9.
                <br />
                3. Divide how much your item cost by 0.9.
                <br />
                Use this new number as your sale price if you want a 10% profit margin.
            </p>

            <h4>Are margin and profit the same?</h4>
            <p>
                Although both measure the performance of a business, margin and profit are not the same. All margin metrics are given in percent values and therefore deal with relative change, which is good for comparing things that are operating on a completely different scale. Profit is explicitly in currency terms, and so provides a more absolute context — good for comparing day-to-day operations.
            </p>

            <h4>How do I calculate a 30% margin?</h4>
            <p>
                To calculate a 30% profit margin:
                <br />
                1. Turn 30% into a decimal by dividing 30 by 100, which is 0.3.
                <br />
                2. Minus 0.3 from 1 to get 0.7.
                <br />
                3. Divide the price the good cost you by 0.7.
                <br />
                The number that you receive is how much you need to sell the item for to get a 30% profit margin.
            </p>

            <h4>How do I calculate markup from margin?</h4>
            <p>
                To calculate the markup from the margin:
                <br />
                1. Turn your margin into a decimal by dividing the percentage by 100.
                <br />
                2. Subtract this decimal from 1.
                <br />
                3. Divide 1 by the result of the subtraction.
                <br />
                4. Subtract 1 from the result of the previous step.
                <br />
                You now have markup expressed in decimal form!
                <br />
                If you want to have the markup in percentage form, multiply the decimal by 100.
            </p>
        </div>
    );

    return (
        <CalculatorLayout
            title="Margin Calculator"
            creators={[{ name: "Mateusz Mucha", role: "" }, { name: "Tibor Pál", role: "PhD candidate" }]}
            reviewers={[{ name: "Bogna Szyk" }, { name: "Jack Bowater" }]}
            tocItems={[
                "How to calculate profit margin",
                "Gross margin formula",
                "A note on terminology",
                "Margin vs. markup",
                "FAQs"
            ]}
            articleContent={articleContent}
        >
            <div className="margin-calculator-container">
                <div className="calc-card">
                    <CalcInput
                        label="Cost"
                        value={values.cost}
                        field="cost"
                        unit="INR"
                        onChange={handleInputChange}
                    />
                    <CalcInput
                        label="Margin"
                        value={values.margin}
                        field="margin"
                        unit="%"
                        onChange={handleInputChange}
                        isPinned={true}
                        hasInfo={true}
                    />
                    <CalcInput
                        label="Revenue"
                        value={values.revenue}
                        field="revenue"
                        unit="INR"
                        onChange={handleInputChange}
                        hasInfo={true}
                    />
                    <CalcInput
                        label="Profit"
                        value={values.profit}
                        field="profit"
                        unit="INR"
                        onChange={handleInputChange}
                        hasInfo={true}
                    />

                    <div className="calc-divider"></div>

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

                    <div className="calc-divider"></div>

                </div>
            </div>
        </CalculatorLayout>
    );
};

export default MarginCalculatorPage;
