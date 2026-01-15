import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, MoreHorizontal } from 'lucide-react';
import './StandardCalculator.css';

const SelectGroup = ({
    label,
    value,
    onChange,
    options = [],
    placeholder = "Select..."
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedLabel = options.find(o => o.value === value)?.label || value || placeholder;

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
            <div className="std-input-group std-select-group" ref={dropdownRef} onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}>
                <div className="std-input-invisible" style={{ display: 'flex', alignItems: 'center' }}>
                    {selectedLabel}
                </div>
                <div className="std-relative-container">
                    <ChevronDown size={14} style={{ color: '#6b7280' }} />
                    {isOpen && (
                        <div className="std-dropdown-menu" style={{ width: '100%', minWidth: '200px', right: '0', top: '100%' }}>
                            {options.map((opt) => (
                                <div
                                    key={opt.value}
                                    className="std-dropdown-item"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onChange(opt.value);
                                        setIsOpen(false);
                                    }}
                                >
                                    {opt.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SelectGroup;
