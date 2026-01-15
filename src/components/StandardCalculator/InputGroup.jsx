import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, MoreHorizontal, AlertCircle } from 'lucide-react';
import './StandardCalculator.css';

const InputGroup = ({
    label,
    value,
    onChange,
    unit,
    onUnitChange,
    unitOptions = [],
    isUnitDropdown = false,
    placeholder = "0",
    description = "",
    error = false,
    errorMessage = ""
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div style={{ marginBottom: '20px' }}>
            <div className="std-label-row">
                {label}
                <MoreHorizontal size={16} className="std-more-dots" />
            </div>
            <div className={`std-input-group ${error ? 'std-input-error' : ''}`}>
                <input
                    type="number"
                    className="std-input-invisible"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    onWheel={(e) => e.target.blur()}
                />

                {isUnitDropdown ? (
                    <div className="std-relative-container" ref={dropdownRef}>
                        <div className="std-unit-trigger" onClick={() => setIsOpen(!isOpen)}>
                            {unit} <ChevronDown size={14} />
                        </div>
                        {isOpen && (
                            <div className="std-dropdown-menu">
                                {unitOptions.map((u) => (
                                    <div
                                        key={u}
                                        className="std-dropdown-item"
                                        onClick={() => {
                                            onUnitChange(u);
                                            setIsOpen(false);
                                        }}
                                    >
                                        {u}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    unit && <div className="std-unit-static">{unit}</div>
                )}
            </div>
            {errorMessage && (
                <div className="std-error-message">
                    <AlertCircle size={16} />
                    <span>{errorMessage}</span>
                </div>
            )}
            {description && (
                <div style={{
                    marginTop: '8px',
                    fontSize: '14px',
                    color: '#374151',
                    lineHeight: '1.5'
                }}>
                    {description}
                </div>
            )}
        </div>
    );
};

export default InputGroup;
