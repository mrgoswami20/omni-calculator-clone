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
    error,
    warning,
    unitPrefix,
    outerSuffix, // New prop for suffix outside dropdown but inside input container
    selectedDisplayProp = 'label', // 'label' or 'value'
    ...rest // Capture rest props
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
            border: error ? '1px solid #ef4444' : '1px solid #3b82f6',
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
            position: 'relative',
            minWidth: '60px',
            justifyContent: 'center',
            cursor: 'pointer'
        },
        selectedText: {
            fontSize: '0.85rem',
            fontWeight: 500,
            color: error ? '#ef4444' : '#2563eb',
            marginRight: '14px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none'
        },
        selectOverlay: {
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
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
        outerSuffix: {
            fontSize: '0.85rem',
            fontWeight: 500,
            color: '#6b7280', // Text gray
            padding: '0 10px',
            backgroundColor: '#ffffff', // White bg
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            borderLeft: '1px solid #e5e7eb' // Optional separator? Or just space?
        },
        errorBlock: {
            backgroundColor: '#FFECEB',
            color: '#B91C1C',
            borderRadius: '8px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.85rem',
            fontWeight: 500,
            marginTop: '6px',
            animation: 'fadeIn 0.2s ease-in-out'
        },
        warningBlock: {
            backgroundColor: '#eff6ff', // Match Atomic Page Blue
            color: '#1e40af',
            borderRadius: '8px', // Match standard
            padding: '10px 14px', // Match standard
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.85rem', // Match standard
            fontWeight: 400,
            marginTop: '6px',
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
                    onWheel={(e) => e.target.blur()}
                    {...rest}
                />

                <div style={styles.selectContainer}>
                    {unitPrefix && (
                        <span style={styles.prefixText}>{unitPrefix}</span>
                    )}

                    <span style={styles.selectedText}>
                        {(() => {
                            const selectedOpt = unitOptions.find(opt => (opt.value || opt) === unit);
                            if (!selectedOpt) return unit;
                            if (selectedDisplayProp === 'value') return selectedOpt.value || selectedOpt;
                            return selectedOpt.label || selectedOpt.value || selectedOpt;
                        })()}
                    </span>
                    <ChevronDown style={styles.chevron} />

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

                {/* Outer Suffix */}
                {outerSuffix && (
                    <div style={styles.outerSuffix}>
                        {outerSuffix}
                    </div>
                )}
            </div>

            {/* Error Message Block */}
            {error && (
                <div style={styles.errorBlock}>
                    <CircleAlert size={16} fill="#ef4444" color="white" style={{ flexShrink: 0 }} />
                    <span>{error}</span>
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
    error: PropTypes.string,
    warning: PropTypes.string,
    unitPrefix: PropTypes.string,
    outerSuffix: PropTypes.string,
    selectedDisplayProp: PropTypes.oneOf(['label', 'value'])
};

export default InputBarWithDropDownOption;
