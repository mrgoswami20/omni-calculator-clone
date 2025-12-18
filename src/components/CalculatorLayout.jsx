import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SubNavigation from './SubNavigation';
import { Share2, ThumbsUp, ThumbsDown, MessageSquare, Box, Code, Quote } from 'lucide-react';
import './CalculatorLayout.css'; // We'll move common styles here

const CalculatorLayout = ({
    title,
    creators,
    reviewers,
    tocItems = [],
    children,
    similarCalculators = 7,
    articleContent
}) => {
    const location = useLocation();

    useEffect(() => {
        if (title && location.pathname) {
            try {
                const stored = JSON.parse(localStorage.getItem('omni_last_used') || '[]');
                // Create new item
                const newItem = { title, url: location.pathname };

                // Remove duplicates (by URL)
                const filtered = stored.filter(item => item.url !== newItem.url);

                // Add to front and limit to 3 (User strict requirement)
                const updated = [newItem, ...filtered].slice(0, 3);

                localStorage.setItem('omni_last_used', JSON.stringify(updated));
            } catch (e) {
                console.error("Failed to update last used calculators", e);
            }
        }
    }, [title, location]);

    return (
        <div className="calculator-page">
            <SubNavigation />

            <div className="calc-content-wrapper">
                <h1 className="calc-main-title">{title}</h1>
                <div className="calc-meta-info">
                    {creators && (
                        <div className="author-info">
                            <div className="author-avatar">
                                <span>{creators[0]?.name ? creators[0].name.substring(0, 2).toUpperCase() : 'OM'}</span>
                            </div>
                            <div className="creators-text">
                                <span className="label">Creators</span>
                                <p>
                                    {creators.map((c, i) => (
                                        <span key={i}>
                                            <a href="#">{c.name}</a>{i < creators.length - 1 ? ', ' : ''}
                                        </span>
                                    ))}
                                </p>
                            </div>
                        </div>
                    )}

                    {reviewers && (
                        <div className="reviewers-info">
                            <span className="label">Reviewers</span>
                            <p>
                                {reviewers.map((r, i) => (
                                    <span key={i}>
                                        <a href="#">{r.name}</a>{i < reviewers.length - 1 ? ' and ' : ''}
                                    </span>
                                ))}
                            </p>
                        </div>
                    )}
                </div>

                <div className="calc-layout">
                    {/* Left Sidebar */}
                    <div className="left-sidebar">
                        <div className="social-proof">
                            <div className="proof-item">
                                <Box size={16} /> Based on <b>3 sources</b>
                            </div>
                            <div className="proof-item">
                                <ThumbsUp size={16} /> <b>725</b> people find this calculator helpful
                            </div>
                        </div>

                        <div className="interaction-buttons">
                            <button className="like-btn"><ThumbsUp size={18} /> 725</button>
                            <button className="dislike-btn"><ThumbsDown size={18} /></button>
                            <button className="action-btn"><MessageSquare size={18} /></button>
                            <button className="action-btn"><Share2 size={18} /></button>
                            <button className="action-btn"><Code size={18} /></button>
                            <button className="action-btn"><Quote size={18} /></button>
                        </div>

                        <div className="toc">
                            <h3>Table of contents</h3>
                            <ul>
                                {tocItems.map((item, index) => (
                                    <li key={index}><a href="#">{item}</a></li>
                                ))}
                            </ul>
                        </div>

                        {articleContent && (
                            <div className="article-content" style={{ marginTop: '32px', lineHeight: '1.6', color: '#374151' }}>
                                {articleContent}
                            </div>
                        )}
                    </div>

                    {/* Right Content Area (Standard Wrapper) */}
                    <div className="calculator-wrapper">
                        {/* Ad Banner Placeholder */}
                        <div className="ad-banner-placeholder">
                            <div className="ad-content">
                                <span>Ad Space / Banner</span>
                            </div>
                        </div>

                        {/* The Actual Calculator Card passed as children */}
                        {children}

                        <div style={{ marginTop: '24px', background: '#fffbeb', padding: '16px', borderRadius: '8px', border: '1px solid #fef3c7' }}>
                            <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>
                                Check out <a href="#" style={{ color: '#436cfe' }}>{similarCalculators} similar</a> calculators 🔬
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalculatorLayout;
