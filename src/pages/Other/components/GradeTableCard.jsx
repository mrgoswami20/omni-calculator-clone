import React from 'react';
import { ChevronDown, Info, Plus, Minus } from 'lucide-react';

const GradeTableCard = ({
    isOpen,
    onToggle,
    tableData,
    wrongAnswers,
    tableStep,
    setTableStep,
    handleAdjustWrong,
    totalQuestions
}) => {
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
                    <div className="card-title" style={{ fontWeight: 700, fontSize: '1.1rem' }}>Grade table</div>
                </div>
            </div>

            {isOpen && (
                <div style={{ borderTop: '1px solid #e2e8f0' }}>
                    {/* Reference Table */}
                    <div className="grade-table-container">
                        <div className="grade-table-header">
                            <div># Right</div>
                            <div># Wrong</div>
                            <div>Percentage</div>
                            <div>Grade</div>
                        </div>
                        <div className="grade-table-body custom-scrollbar">
                            {tableData.length > 0 ? tableData.map((row, i) => {
                                let isActive = false;
                                const w = parseFloat(wrongAnswers);
                                if (!isNaN(w) && row.wrong === w) isActive = true;

                                let badgeClass = 'badge-danger';
                                if (row.grade.startsWith('A')) badgeClass = 'badge-success';
                                else if (row.grade.startsWith('B')) badgeClass = 'badge-blue';
                                else if (row.grade.startsWith('C')) badgeClass = 'badge-warning';
                                else if (row.grade.startsWith('D')) badgeClass = 'badge-danger';
                                else if (row.grade === 'F') badgeClass = 'badge-danger';

                                return (
                                    <div key={i} className={`grade-table-row ${isActive ? 'active-row' : ''}`}>
                                        <div>{row.right}</div>
                                        <div>{row.wrong}</div>
                                        <div style={{ fontWeight: 500 }}>{row.perc}</div>
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <span className={`grade-badge ${badgeClass}`}>
                                                {row.grade}
                                            </span>
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>
                                    Enter total questions to generate the table.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Adjust Section */}
                    <div className="quick-adjust-section">
                        <div className="quick-adjust-header">
                            <span>Increment by</span>
                            <Info size={14} className="text-gray-400" />
                        </div>
                        <div className="increment-control-group">
                            <div className="increment-input-wrapper">
                                <input
                                    type="number"
                                    className="increment-input"
                                    value={tableStep}
                                    onChange={(e) => setTableStep(Math.max(1, parseFloat(e.target.value) || 1))}
                                    min="0.1"
                                    step="0.1"
                                    onWheel={(e) => e.target.blur()}
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#6b7280' }}>
                                <span>Adjust Wrong:</span>
                                <div className="adjust-module">
                                    <button
                                        type="button"
                                        className="adjust-btn"
                                        onClick={(e) => { e.preventDefault(); handleAdjustWrong(-1); }}
                                        disabled={!wrongAnswers || parseFloat(wrongAnswers) <= 0}
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <div className="adjust-display">
                                        {wrongAnswers || '0'}
                                    </div>
                                    <button
                                        type="button"
                                        className="adjust-btn"
                                        onClick={(e) => { e.preventDefault(); handleAdjustWrong(1); }}
                                        disabled={!totalQuestions || (wrongAnswers !== '' && parseFloat(wrongAnswers) >= parseFloat(totalQuestions))}
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GradeTableCard;
