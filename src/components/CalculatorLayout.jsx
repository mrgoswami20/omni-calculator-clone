import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SubNavigation from './SubNavigation';
import { ThumbsUp, ThumbsDown, Box } from 'lucide-react';
import './CalculatorLayout.css'; // We'll move common styles here

const CalculatorLayout = ({
    title,
    creators,
    reviewers,
    tocItems = [],
    children,
    similarCalculators = 7,
    articleContent,
    lastUpdated = "August 27, 2024" // Default or passed prop
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
                <div className="calc-layout">
                    {/* Left Sidebar / Article Area */}
                    <div className="left-sidebar">
                        <div className="calc-meta-date">Last updated: {lastUpdated}</div>
                        <h1 className="calc-main-title">{title}</h1>
                        <div className="calc-meta-info">
                            {creators && (
                                <div className="author-info">
                                    <div className="author-avatar">
                                        <img src={`https://ui-avatars.com/api/?name=${creators[0]?.name}&background=random&color=fff&size=128`} alt={creators[0]?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div className="creators-text">
                                        <span className="label">Creators</span>
                                        <p>
                                            {creators.map((c, i) => (
                                                <span key={i}>
                                                    <a href="#">{c.name}</a>{c.role && <span>, {c.role}</span>}{i < creators.length - 1 ? ', ' : ''}
                                                </span>
                                            ))}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="calc-meta-social">
                            <ThumbsUp size={16} className="meta-icon" /> <b>20 people</b> find this calculator helpful
                        </div>

                        {/* LIKE/DISLIKE BUTTONS SMALL ROW */}
                        <div className="calc-rating-row">
                            <div className="rating-btn-group">
                                <button className="rating-btn"><ThumbsUp size={16} /> 20</button>
                                <button className="rating-btn"><ThumbsDown size={16} /></button>
                            </div>
                        </div>

                        <div className="toc">
                            <h3>Table of contents</h3>
                            <ul>
                                {tocItems.map((item, index) => (
                                    <li key={index}>
                                        <a href={item.id ? `#${item.id}` : '#'}>
                                            {typeof item === 'object' ? item.label : item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {articleContent && (
                            <div className="article-content">
                                {articleContent}
                            </div>
                        )}
                    </div>

                    {/* Right Content Area (Standard Wrapper, No ads) */}
                    <div className="calculator-wrapper">
                        {/* The Actual Calculator Card passed as children */}
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalculatorLayout;
