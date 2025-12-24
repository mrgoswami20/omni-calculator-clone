import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './MostPopular.css';

const MostPopular = () => {
    const navigate = useNavigate();

    const calculators = [
        {
            title: "p-value Calculator",
            description: "The p-value calculator can help you find the p-value and evaluate how compatible your data is with the null hypothesis.",
            category: "Statistics",
            path: "/statistics/p-value-calculator"
        },
        {
            title: "Confidence Interval Calculator",
            description: "The confidence interval calculator finds the confidence level for your data sample.",
            category: "Statistics",
            path: "/statistics/confidence-interval-calculator"
        },
        {
            title: "Test Grade Calculator",
            description: "With this test grade calculator, you'll quickly determine the test percentage score and grade.",
            category: "Other",
            path: "/other/test-grade-calculator"
        },
        {
            title: "Log Calculator (Logarithm)",
            description: "The log calculator (logarithm) calculates the value of a logarithm with an arbitrary base.",
            category: "Math",
            path: "/math/log-calculator"
        },
        {
            title: "Sales Tax Calculator",
            description: "Sales tax calculator works out the tax imposed on the sale of goods and services.",
            category: "Finance",
            path: "/finance/sales-tax-calculator"
        },
        {
            title: "Significant Figures Calculator - Sig Fig",
            description: "Perform mathematical operations on significant figures with our calculator. Get step-by-step solutions or use the built-in sig fig counter!",
            category: "Math",
            path: "/math/sig-fig-calculator"
        },
        {
            title: "Scientific Notation Calculator",
            description: "The scientific notation calculator converts numbers to and from scientific notation, e.g. 7.5 × 10^2.",
            category: "Math",
            path: "/math/scientific-notation-calculator"
        },
        {
            title: "Square Footage Calculator",
            description: "Utilize our free square footage calculator to determine the area of diverse property shapes in square feet.",
            category: "Construction",
            path: "/construction/square-footage-calculator"
        },
        {
            title: "Percentage Increase Calculator",
            description: "Percentage increase calculator determines the percentage increase from one value to another.",
            category: "Math",
            path: "/math/percentage-increase-calculator"
        },
        {
            title: "Salary to Hourly Calculator",
            description: "Find your hourly wage instantly with our Salary to Hourly Calculator. Ideal for job seekers and employees to convert annual, monthly, or weekly salaries.",
            category: "Finance",
            path: "/finance/salary-to-hourly-calculator"
        }
    ];

    const handleCardClick = (path, title) => {
        if (path) {
            navigate(path);
        } else {
            alert(`Navigating to ${title}...`);
        }
    };

    return (
        <section className="most-popular-section">
            <h2 className="section-title">Most popular calculators</h2>

            <div className="popular-grid">
                {calculators.map((calc, index) => (
                    <div
                        key={index}
                        className="popular-card"
                        onClick={() => handleCardClick(calc.path, calc.title)}
                    >
                        <div className="card-header">
                            <h3 className="card-title">{calc.title}</h3>
                            <ArrowRight size={16} className="card-arrow" />
                        </div>

                        <p className="card-desc">{calc.description}</p>

                        <span className="card-category">{calc.category}</span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default MostPopular;
