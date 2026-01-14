import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MoreHorizontal, AlertCircle, Info } from 'lucide-react';

const SimpleInputBar = ({
    label,
    value,
    onChange,
    placeholder = "",
    type = "text",
    name,
    className = "",
    showInfoIcon = true,
    error = false,
    errorMessage = "",
    errorMessages = [],
    warningMessages = [], // New prop for blue warnings
    ...rest
}) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasError = error || errorMessages.length > 0;

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
            border: hasError ? '1px solid #ef4444' : '1px solid #3b82f6',
            borderRadius: '6px',
            height: '38px',
            padding: '0 10px',
            transition: 'all 0.2s ease-in-out',
            boxShadow: isFocused
                ? (hasError ? '0 0 0 1px #ef4444, 0 0 0 3px rgba(239, 68, 68, 0.2)' : '0 0 0 1px #3b82f6, 0 0 0 3px rgba(59, 130, 246, 0.2)')
                : (hasError ? '0 0 0 1px #ef4444' : '0 0 0 1px #3b82f6'),
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
        errorMessage: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginTop: '6px',
            padding: '10px 14px',
            backgroundColor: '#fff5f5',
            color: '#ef4444',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 500,
            animation: 'fadeIn 0.2s ease-in-out'
        },
        warningMessage: { // Blue style
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginTop: '6px',
            padding: '10px 14px',
            backgroundColor: '#eff6ff', // Light blue (blue-50)
            color: '#1e40af', // Darker blue (blue-800) or similar for text
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 400, // Regular weight as per screenshot
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
                {/* Suffix support */}
                {rest.suffix && (
                    <span style={{
                        fontSize: '0.9rem',
                        color: '#6b7280',
                        marginLeft: '8px',
                        fontWeight: 500,
                        pointerEvents: 'none'
                    }}>
                        {rest.suffix}
                    </span>
                )}
            </div>

            {/* Warning Messages (Blue) */}
            {warningMessages.length > 0 && (
                warningMessages.map((msg, idx) => (
                    <div key={`warn-${idx}`} style={styles.warningMessage}>
                        {/* No icon in screenshot? Or text only? Screenshot shows text. */}
                        <span>{msg}</span>
                    </div>
                ))
            )}

            {/* Error Messages (Red) */}
            {errorMessages.length > 0 ? (
                errorMessages.map((msg, idx) => (
                    <div key={`err-${idx}`} style={styles.errorMessage}>
                        <AlertCircle size={16} fill="#ef4444" color="white" style={{ flexShrink: 0 }} />
                        <span>{msg}</span>
                    </div>
                ))
            ) : (error && errorMessage) ? (
                <div style={styles.errorMessage}>
                    <AlertCircle size={16} fill="#ef4444" color="white" style={{ flexShrink: 0 }} />
                    <span>{errorMessage}</span>
                </div>
            ) : null}
        </div>
    );
};

SimpleInputBar.propTypes = {
    label: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string,
    className: PropTypes.string,
    showInfoIcon: PropTypes.bool,
    error: PropTypes.bool,
    errorMessage: PropTypes.string,
    errorMessages: PropTypes.arrayOf(PropTypes.string),
    warningMessages: PropTypes.arrayOf(PropTypes.string)
};

export default SimpleInputBar;
