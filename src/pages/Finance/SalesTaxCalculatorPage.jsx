import React, { useState } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, Pin } from 'lucide-react';
import '../../components/CalculatorLayout.css'; // Ensure styles are loaded

const SalesTaxCalculatorPage = () => {
    const [salesTaxRate, setSalesTaxRate] = useState('');
    const [netPrice, setNetPrice] = useState('');
    const [grossPrice, setGrossPrice] = useState('');
    const [taxAmount, setTaxAmount] = useState('');

    const calculateFromNet = (net, rate) => {
        if (!net || !rate) return;
        const n = parseFloat(net);
        const r = parseFloat(rate);
        const tax = n * (r / 100);
        const gross = n + tax;
        setTaxAmount(tax.toFixed(2));
        setGrossPrice(gross.toFixed(2));
    };

    const calculateFromGross = (gross, rate) => {
        if (!gross || !rate) return;
        const g = parseFloat(gross);
        const r = parseFloat(rate);
        const net = g / (1 + r / 100);
        const tax = g - net;
        setNetPrice(net.toFixed(2));
        setTaxAmount(tax.toFixed(2));
    };

    const handleNetChange = (e) => {
        const val = e.target.value;
        setNetPrice(val);
        if (salesTaxRate) calculateFromNet(val, salesTaxRate);
    };

    const handleGrossChange = (e) => {
        const val = e.target.value;
        setGrossPrice(val);
        if (salesTaxRate) calculateFromGross(val, salesTaxRate);
    };

    const handleRateChange = (e) => {
        const val = e.target.value;
        setSalesTaxRate(val);
        if (netPrice) calculateFromNet(netPrice, val);
        else if (grossPrice) calculateFromGross(grossPrice, val);
    };

    const handleClear = () => {
        setSalesTaxRate('');
        setNetPrice('');
        setGrossPrice('');
        setTaxAmount('');
    };

    return (
        <CalculatorLayout
            title="Sales Tax Calculator"
            creators={[
                { name: "Tibor Pál" },
                { name: "Mateusz Mucha" },
                { name: "Piotr Małek" }
            ]}
            reviewers={[
                { name: "Bogna Szyk" },
                { name: "Jack Bowater" }
            ]}
            tocItems={[
                "How to use the sales tax calculator",
                "Sales tax definition",
                "Sales tax vs. value-added tax (VAT)",
                "History of the sales tax",
                "How to calculate sales tax",
                "Sales tax in the United States",
                "Economic implications"
            ]}
        >
            <div className="calculator-card">
                <div className="input-group">
                    <div className="label-row">
                        <label>Sales tax</label>
                        <span className="info-icon">i</span>
                        <div className="header-icons" style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                            <Pin size={14} className="pin-icon" />
                            <span className="more-options">...</span>
                        </div>
                    </div>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            value={salesTaxRate}
                            onChange={handleRateChange}
                            placeholder=" "
                        />
                        <div className="unit-display">% ▾</div>
                    </div>
                </div>

                <div className="input-group">
                    <div className="label-row">
                        <label>Net price</label>
                        <span className="info-icon">i</span>
                        <span className="more-options">...</span>
                    </div>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            value={netPrice}
                            onChange={handleNetChange}
                            placeholder=" "
                        />
                        <div className="unit-display">INR ▾</div>
                    </div>
                </div>

                <div className="input-group">
                    <div className="label-row">
                        <label>Gross price</label>
                        <span className="info-icon">i</span>
                        <span className="more-options">...</span>
                    </div>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            value={grossPrice}
                            onChange={handleGrossChange}
                            placeholder=" "
                        />
                        <div className="unit-display">INR ▾</div>
                    </div>
                </div>

                <div className="input-group result-group">
                    <div className="label-row">
                        <label>Tax amount</label>
                        <span className="info-icon">i</span>
                        <span className="more-options">...</span>
                    </div>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            value={taxAmount}
                            readOnly
                            className="result-input"
                        />
                        <div className="unit-display">INR ▾</div>
                    </div>
                </div>

                <div className="calc-actions">
                    <button className="share-result-btn">
                        <Share2 size={16} /> Share result
                    </button>
                    <div className="secondary-actions">
                        <button className="secondary-btn">Reload calculator</button>
                        <button className="secondary-btn" onClick={handleClear}>Clear all changes</button>
                    </div>
                </div>

                <div className="feedback-section">
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

export default SalesTaxCalculatorPage;
