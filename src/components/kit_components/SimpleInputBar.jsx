import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MoreHorizontal } from 'lucide-react';

const SimpleInputBar = ({
    label,
    value,
    onChange,
    placeholder = "",
    type = "text",
    name,
    className = "",
    showInfoIcon = true
}) => {
    const [isFocused, setIsFocused] = useState(false);

    const styles = {
        wrapper: {
            display: 'flex',
            flexDirection: 'column',
            gap: '4px', // Tighter gap
            width: '100%',
            fontFamily: 'inherit'
        },
        labelRow: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        label: {
            fontSize: '0.8125rem', // ~13px
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
            border: '1px solid #3b82f6',
            borderRadius: '6px', // Slightly less rounded for "pro" look
            height: '38px', // Even more compact (was 42px)
            padding: '0 10px',
            transition: 'all 0.2s ease-in-out',
            boxShadow: isFocused ? '0 0 0 1px #3b82f6, 0 0 0 3px rgba(59, 130, 246, 0.2)' : '0 0 0 1px #3b82f6',
        },
        inputField: {
            flex: 1,
            border: 'none',
            outline: 'none',
            fontSize: '0.9rem', // ~14px (Standard readable size)
            color: '#111827',
            backgroundColor: 'transparent',
            width: '100%',
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
            </div>
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
    showInfoIcon: PropTypes.bool
};

export default SimpleInputBar;
