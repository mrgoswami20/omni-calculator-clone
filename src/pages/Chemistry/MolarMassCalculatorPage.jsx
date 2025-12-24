import React, { useState, useEffect } from 'react';
import CalculatorLayout from '../../components/CalculatorLayout';
import { Share2, Info, ChevronDown, Plus, Trash2 } from 'lucide-react';
import { periodicTable } from '../../data/periodicTable';
import './MolarMassCalculatorPage.css';

const MolarMassCalculatorPage = () => {
    // State for element rows: [{ elementZ: string, quantity: number }]
    const [rows, setRows] = useState([
        { elementZ: '1', quantity: 1 } // Default H, qty 1
    ]);

    const [totalMolarMass, setTotalMolarMass] = useState(0);
    const [formula, setFormula] = useState('');
    const [tableData, setTableData] = useState([]);

    const creators = [
        { name: "Joanna Śmietańska", role: "PhD" }
    ];

    const reviewers = [
        { name: "Łucja Zaborowska", role: "MD, PhD candidate" },
        { name: "Adena Benn", role: "" }
    ];

    // Add a new row
    const addRow = () => {
        setRows([...rows, { elementZ: '', quantity: 1 }]);
    };

    // Remove a row
    const removeRow = (index) => {
        const newRows = rows.filter((_, i) => i !== index);
        setRows(newRows);
    };

    // Update row data
    const updateRow = (index, field, value) => {
        const newRows = [...rows];
        newRows[index] = { ...newRows[index], [field]: value };
        setRows(newRows);
    };

    // Calculate effect
    useEffect(() => {
        let totalMass = 0;
        let newTableData = [];
        let formulaParts = [];

        rows.forEach(row => {
            const z = row.elementZ;
            const qty = parseInt(row.quantity) || 0;
            const element = periodicTable[z];

            if (element && qty > 0) {
                const mass = parseFloat(element.mass);
                const subTotal = mass * qty;
                totalMass += subTotal;

                newTableData.push({
                    symbol: element.symbol,
                    qty: qty,
                    massPerMol: mass.toFixed(4),
                    subTotal: subTotal,
                    originalQ: qty
                });

                // Build formula part
                formulaParts.push(`${element.symbol}${qty > 1 ? qty : ''}`);
            }
        });

        setTotalMolarMass(totalMass);
        setFormula(formulaParts.join(''));

        // Calculate percentages
        const finalTable = newTableData.map(item => ({
            ...item,
            pct: totalMass > 0 ? ((item.subTotal / totalMass) * 100).toFixed(0) + '%' : '0%'
        }));
        setTableData(finalTable);

    }, [rows]);

    const articleContent = (
        <>
            <p>
                Our molar mass calculator comes to the rescue if you need to quickly check the weight of 1 mole of any element or chemical compound and you are unable to use the periodic table. Simply select one by one the elements from the list and give the number of atoms in their molecular formula to get the molar mass in a flash.
            </p>
        </>
    );

    return (
        <CalculatorLayout
            title="Molar Mass Calculator"
            creators={creators}
            reviewers={reviewers}
            tocItems={[
                "What is molar mass?",
                "Molar mass vs. molecular weight",
                "How to find the molar mass formula for any compound",
                "Examples",
                "FAQs"
            ]}
            articleContent={articleContent}
        >
            <div className="calculator-card molar-mass-page">
                {/* Element Rows */}
                {rows.map((row, index) => (
                    <div key={index} className="element-row-card">
                        <div className="row-header">
                            <label>{index === 0 ? "1st Element" : index === 1 ? "2nd Element" : `${index + 1}th Element`}</label>
                            {rows.length > 1 && (
                                <button className="remove-btn" onClick={() => removeRow(index)}>
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>

                        <div className="row-inputs">
                            {/* Atom Select */}
                            <div className="input-group flex-grow">
                                <div className="label-row">
                                    <label>Atom</label>
                                    <span className="more-options">...</span>
                                </div>
                                <div className="select-wrapper">
                                    <select
                                        value={row.elementZ}
                                        onChange={(e) => updateRow(index, 'elementZ', e.target.value)}
                                        className="calc-select"
                                    >
                                        <option value="" disabled>Select</option>
                                        {Object.entries(periodicTable).map(([z, el]) => (
                                            <option key={z} value={z}>{el.name} ({el.symbol})</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="select-arrow" size={16} />
                                </div>
                            </div>

                            {/* Quantity Input */}
                            <div className="input-group qty-group">
                                <div className="label-row">
                                    <label>Quantity</label>
                                    <span className="more-options">...</span>
                                </div>
                                <div className="select-wrapper">
                                    <input
                                        type="number"
                                        min="1"
                                        className="calc-input"
                                        value={row.quantity}
                                        onChange={(e) => updateRow(index, 'quantity', e.target.value)}
                                    />
                                    <ChevronDown className="select-arrow" size={16} /> {/* Visual only as per screenshot style often used for numbers in Omni but could be select too. Using input for flexibility. */}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <button className="add-element-btn" onClick={addRow}>
                    <Plus size={16} /> Add another element
                </button>

                {/* Results Section */}
                <div className="results-container">
                    <h3>Your molecule:</h3>

                    <div className="total-mass-display">
                        1 mol = <strong>{totalMolarMass.toFixed(4)} g.</strong>
                    </div>

                    <div className="formula-display">
                        Chemical formula: <strong>{formula}</strong>
                    </div>

                    {tableData.length > 0 && (
                        <div className="breakdown-table">
                            <div className="table-header">
                                <span>Element</span>
                                <span>Qty</span>
                                <span>Mass (g/mol)</span>
                                <span>Percentage</span>
                            </div>
                            {tableData.map((row, idx) => (
                                <div key={idx} className="table-row">
                                    <span>{row.symbol}</span>
                                    <span>{row.originalQ}</span>
                                    <span>{row.massPerMol}</span>
                                    <span>{row.pct}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="calc-actions">
                    <button className="share-result-btn">
                        <div className="share-icon-circle"><Share2 size={14} /></div>
                        Share result
                    </button>
                    <div className="secondary-actions">
                        <button className="secondary-btn">Reload calculator</button>
                        <button className="secondary-btn" onClick={() => {
                            setRows([{ elementZ: '', quantity: 1 }]);
                            setTotalMolarMass(0);
                            setFormula('');
                            setTableData([]);
                        }}>Clear all changes</button>
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

export default MolarMassCalculatorPage;
