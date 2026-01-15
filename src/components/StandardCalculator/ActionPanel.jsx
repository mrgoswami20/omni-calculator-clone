import React from 'react';
import { Share2 } from 'lucide-react';
import './StandardCalculator.css';

const ActionPanel = ({
    onShare,
    onReload,
    onReset,
    shareText = "Share result"
}) => {
    return (
        <div className={`std-actions-grid ${!onShare ? 'std-no-share' : ''}`}>
            {onShare && (
                <button className="std-share-btn" onClick={onShare}>
                    <div className="std-share-icon">
                        <Share2 size={20} />
                    </div>
                    <span className="std-share-text">{shareText}</span>
                </button>
            )}
            <div className="std-action-stack">
                {onReload && (
                    <button className="std-action-btn-secondary" onClick={onReload}>
                        Reload calculator
                    </button>
                )}
                {onReset && (
                    <button className="std-action-btn-secondary" onClick={onReset}>
                        Clear all changes
                    </button>
                )}
            </div>
        </div>
    );
};

export default ActionPanel;
