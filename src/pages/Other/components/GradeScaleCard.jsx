import React from 'react';
import { ChevronDown, MoreHorizontal } from 'lucide-react';

const GradeScaleCard = ({ isOpen, onToggle, gradeRanges, onRangeChange }) => {
    return (
        <div className="section-card">
            <div
                className={`card-header ${isOpen ? 'expanded' : ''}`}
                onClick={onToggle}
            >
                <div className="header-left">
                    <div className="rotate-icon-wrapper" style={{
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s',
                        width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px solid #3b82f6', borderRadius: '50%', color: '#3b82f6'
                    }}>
                        <ChevronDown size={14} />
                    </div>
                    <div className="card-title" style={{ fontWeight: 700, fontSize: '1.1rem' }}>Grade scale</div>
                </div>
            </div>

            {isOpen && (
                <div style={{ borderTop: '1px solid #e2e8f0' }}>
                    {/* Grade Configuration List */}
                    <div className="grade-config-list">
                        {gradeRanges.map((range, index) => (
                            <div key={range.id} className="grade-config-item">
                                <div className="grade-label-row">
                                    <span>Grade {range.label} ≥</span>
                                    <MoreHorizontal size={16} className="more-menu-icon" />
                                </div>
                                <div className="grade-input-wrapper">
                                    <input
                                        type="number"
                                        className="grade-config-input"
                                        value={range.min}
                                        onChange={(e) => onRangeChange(index, e.target.value)}
                                        onWheel={(e) => e.target.blur()}
                                    />
                                    <span className="grade-input-suffix">%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GradeScaleCard;
