import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, MoreHorizontal } from 'lucide-react';
import './StandardCalculator.css';

const ResultRow = ({
    label,
    value,
    unit,
    onUnitChange,
    unitOptions = [],
    isUnitDropdown = false
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
            <div className="std-result-group">
                <input
                    type="text"
                    className="std-result-input"
                    value={value} // Assumes value is already formatted
                    readOnly
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
        </div>
    );
};

export default ResultRow;
