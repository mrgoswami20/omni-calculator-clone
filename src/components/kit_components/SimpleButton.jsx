import React from 'react';
import PropTypes from 'prop-types';

const SimpleButton = ({
    onClick,
    children,
    variant = "primary", // primary | secondary
    disabled = false,
    className = "",
    fullWidth = false,
    style = {}
}) => {
    const [isActive, setIsActive] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);

    const baseStyles = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 16px',
        height: '38px',
        borderRadius: '6px',
        fontWeight: 600,
        fontSize: '0.85rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
        userSelect: 'none',
        opacity: disabled ? 0.6 : 1,
        fontFamily: 'inherit',
        transform: isActive && !disabled ? 'translateY(1px)' : 'translateY(0)',
        width: fullWidth ? '100%' : 'auto'
    };

    const variants = {
        primary: {
            backgroundColor: '#2563eb',
            color: 'white',
            border: '1px solid #1d4ed8',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        },
        secondary: {
            backgroundColor: '#ffffff',
            color: '#1f2937',
            border: '1px solid #d1d5db',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
        }
    };

    const hoverStyles = {
        primary: {
            backgroundColor: '#1d4ed8',
            borderColor: '#1e40af'
        },
        secondary: {
            backgroundColor: '#f9fafb',
            borderColor: '#9ca3af',
            color: '#111827'
        }
    };

    const currentVariant = variants[variant] || variants.primary;
    const currentHover = hoverStyles[variant] || hoverStyles.primary;

    const mergedStyles = {
        ...baseStyles,
        ...currentVariant,
        ...(isHovered && !disabled ? currentHover : {}),
        ...style
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={className}
            style={mergedStyles}
            onMouseDown={() => setIsActive(true)}
            onMouseUp={() => setIsActive(false)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setIsActive(false);
            }}
        >
            {children}
        </button>
    );
};

SimpleButton.propTypes = {
    onClick: PropTypes.func,
    children: PropTypes.node.isRequired,
    variant: PropTypes.string,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    fullWidth: PropTypes.bool,
    style: PropTypes.object
};

export default SimpleButton;
