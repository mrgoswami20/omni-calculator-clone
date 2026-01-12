import React, { useState } from 'react';
import SimpleInputBar from '../components/kit_components/SimpleInputBar';
import InputBarWithDropDownOption from '../components/kit_components/InputBarWithDropDownOption';
import SimpleButton from '../components/kit_components/SimpleButton';
import { RotateCcw, Trash2, Home } from 'lucide-react';

const KitShowcasePage = () => {
    // State for inputs
    const [simpleVal, setSimpleVal] = useState('123');
    const [dropdownVal, setDropdownVal] = useState('60');
    const [dropdownUnit, setDropdownUnit] = useState('min');
    const [dropdownVal2, setDropdownVal2] = useState('100');
    const [dropdownUnit2, setDropdownUnit2] = useState('liters');

    const containerStyle = {
        padding: '40px',
        maxWidth: '800px',
        margin: '0 auto',
        fontFamily: 'Inter, sans-serif',
        backgroundColor: '#f8fafc',
        minHeight: '100vh'
    };

    const sectionStyle = {
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    };

    const headerStyle = {
        fontSize: '1.25rem',
        fontWeight: '700',
        marginBottom: '16px',
        color: '#1e293b',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '12px'
    };

    return (
        <div style={containerStyle}>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '32px', color: '#0f172a' }}>
                UI Kit Components Showcase
            </h1>

            <div style={sectionStyle}>
                <div style={headerStyle}>1. SimpleInputBar</div>
                <p style={{ marginBottom: '16px', color: '#64748b' }}>
                    Standard input with top label and optional info icon.
                </p>
                <SimpleInputBar
                    label="Animal lives (Simple Input)"
                    value={simpleVal}
                    onChange={(e) => setSimpleVal(e.target.value)}
                    placeholder="Enter items..."
                />
            </div>

            <div style={sectionStyle}>
                <div style={headerStyle}>2. InputBarWithDropDownOption</div>
                <p style={{ marginBottom: '16px', color: '#64748b' }}>
                    Input with an integrated, grey-background unit selector on the right.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <InputBarWithDropDownOption
                        label="Drips from one faucet (Unit Selector)"
                        value={dropdownVal}
                        onChange={(e) => setDropdownVal(e.target.value)}
                        unit={dropdownUnit}
                        onUnitChange={(e) => setDropdownUnit(e.target.value)}
                        unitOptions={['min', 'hour', 'day']}
                    />

                    <InputBarWithDropDownOption
                        label="Wasted water (Object Options)"
                        value={dropdownVal2}
                        onChange={(e) => setDropdownVal2(e.target.value)}
                        unit={dropdownUnit2}
                        onUnitChange={(e) => setDropdownUnit2(e.target.value)}
                        unitOptions={[
                            { value: 'liters', label: 'l' },
                            { value: 'gallons', label: 'gal' },
                            { value: 'ml', label: 'ml' }
                        ]}
                    />
                </div>
            </div>

            <div style={sectionStyle}>
                <div style={headerStyle}>3. SimpleButton</div>
                <p style={{ marginBottom: '16px', color: '#64748b' }}>
                    Versatile buttons with support for icons and variants.
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <SimpleButton variant="secondary" onClick={() => alert('Reload clicked')}>
                        Reload calculator
                    </SimpleButton>

                    <SimpleButton variant="secondary" onClick={() => alert('Clear clicked')}>
                        <Trash2 size={16} style={{ marginRight: 8 }} />
                        Clear with Icon
                    </SimpleButton>

                    <SimpleButton variant="primary" onClick={() => alert('Primary clicked')}>
                        Primary Action
                    </SimpleButton>

                    <SimpleButton variant="secondary" disabled>
                        Disabled Button
                    </SimpleButton>
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <a href="/" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 600 }}>
                    &larr; Back to Home
                </a>
            </div>
        </div>
    );
};

export default KitShowcasePage;
