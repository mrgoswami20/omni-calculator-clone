import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MoreHorizontal, ChevronDown, CircleAlert } from 'lucide-react';

const InputBarWithDropDownOption = ({
    label,
    value,
    onChange,
    unit,
    onUnitChange,
    unitOptions = [],
    placeholder = "",
    name,
    type = "text",
    className = "",
    showInfoIcon = true,
    error, // New Prop: string or null
    warning, // New Prop: string or null
    unitPrefix // New Prop: string
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const styles = {
        wrapper: {
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            width: '100%',
            fontFamily: 'inherit'
        },
        labelRow: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        label: {
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: '#374151',
        },
        infoIcon: {
            color: '#9ca3af',
            cursor: 'help',
            width: '14px',
            height: '14px',
        },
        inputControl: {
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            border: error ? '1px solid #ef4444' : '1px solid #3b82f6', // Red border on error
            borderRadius: '6px',
            height: '38px',
            paddingLeft: '10px',
            paddingRight: 0,
            transition: 'all 0.2s ease-in-out',
            boxShadow: error
                ? '0 0 0 1px #ef4444'
                : (isFocused ? '0 0 0 1px #3b82f6, 0 0 0 3px rgba(59, 130, 246, 0.2)' : '0 0 0 1px #3b82f6'),
            overflow: 'hidden'
        },
        inputField: {
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '0.9rem',
            color: '#111827',
            backgroundColor: 'transparent',
            width: '100%',
        },
        selectContainer: {
            backgroundColor: '#e2e8f0',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            padding: '0 10px',
            borderLeft: error ? '1px solid #ef4444' : '1px solid #3b82f6',
            position: 'relative', // Anchor for absolute select
            minWidth: '60px', // Slightly wider for safety
            justifyContent: 'center',
            cursor: 'pointer'
        },
        // Visual text styling
        selectedText: {
            fontSize: '0.85rem',
            fontWeight: 500,
            color: error ? '#ef4444' : '#2563eb',
            marginRight: '14px', // Space for chevron
            whiteSpace: 'nowrap',
            pointerEvents: 'none' // Clicks go through to select
        },
        // Transparent Overlay
        selectOverlay: {
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0, // Invisible but clickable
            cursor: 'pointer',
            appearance: 'none',
            zIndex: 10
        },
        prefixText: {
            fontSize: '0.85rem',
            fontWeight: 500,
            color: '#374151',
            marginRight: '6px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none'
        },
        chevron: {
            position: 'absolute',
            right: '8px',
            pointerEvents: 'none',
            color: error ? '#ef4444' : '#2563eb',
            width: '14px',
            height: '14px'
        },
        errorBlock: {
            backgroundColor: '#fef2f2',
            color: '#991b1b',
            border: '1px solid #fecaca', // Subtle border
            borderRadius: '6px', // Matching input radius
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.8125rem', // Small readable text
            marginTop: '4px',
            animation: 'fadeIn 0.2s ease-in-out'
        },
        warningBlock: {
            backgroundColor: '#fefce8', // Light yellow/beige
            color: '#713f12', // Brown text
            borderRadius: '6px',
            padding: '12px',
            fontSize: '0.9rem',
            marginTop: '8px', // Slightly more space
            animation: 'fadeIn 0.2s ease-in-out'
        }
    };

    return (
        <div style={styles.wrapper} className={className}>
            {label && (
                <div style={styles.labelRow}>
                    <label style={styles.label} htmlFor={name}>{label}</label>
                    {showInfoIcon && <MoreHorizontal style={styles.infoIcon} />}
                </div>
            )}
            <div
                style={styles.inputControl}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            >
                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    style={styles.inputField}
                />

                <div style={styles.selectContainer}>
                    {/* Prefix Text */}
                    {unitPrefix && (
                        <span style={styles.prefixText}>{unitPrefix}</span>
                    )}

                    {/* Visual Representation */}
                    <span style={styles.selectedText}>
                        {unitOptions.find(opt => (opt.value || opt) === unit)?.label || unitOptions.find(opt => (opt.value || opt) === unit) || unit}
                    </span>
                    <ChevronDown style={styles.chevron} />

                    {/* Interactive Overlay */}
                    <select
                        value={unit}
                        onChange={onUnitChange}
                        style={styles.selectOverlay}
                    >
                        {unitOptions.map((opt) => (
                            <option key={opt.value || opt} value={opt.value || opt}>
                                {opt.label || opt}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Error Message Block */}
            {error && (
                <div style={styles.errorBlock}>
                    <CircleAlert size={14} color="#ef4444" />
                    {error}
                </div>
            )}

            {/* Warning Message Block */}
            {warning && (
                <div style={styles.warningBlock}>
                    {warning}
                </div>
            )}
        </div>
    );
};

InputBarWithDropDownOption.propTypes = {
    label: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired,
    unit: PropTypes.string.isRequired,
    onUnitChange: PropTypes.func.isRequired,
    unitOptions: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({ value: PropTypes.string, label: PropTypes.string })
        ])
    ).isRequired,
    placeholder: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    className: PropTypes.string,
    showInfoIcon: PropTypes.bool,
    error: PropTypes.string, // Error message to display
    warning: PropTypes.string, // Warning message to display
    unitPrefix: PropTypes.string // Optional prefix text before unit label
};

export default InputBarWithDropDownOption;
