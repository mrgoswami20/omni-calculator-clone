import React, { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { categories } from '../data/categories';
import './SubNavigation.css';

const SubNavigation = () => {
    const location = useLocation();
    const scrollRef = useRef(null);

    const isActive = (title) => {
        const slug = title.toLowerCase().replace(/\s+/g, '-');
        return location.pathname.includes(slug);
    };

    return (
        <div className="sub-nav-container">
            <nav className="sub-nav" ref={scrollRef}>
                {categories.map((cat) => (
                    <Link
                        key={cat.id}
                        to={
                            cat.title.toLowerCase() === 'biology'
                                ? '/biology'
                                : cat.title.toLowerCase() === 'chemistry'
                                    ? '/chemistry'
                                    : cat.title.toLowerCase() === 'construction'
                                        ? '/construction'
                                        : cat.title.toLowerCase() === 'conversion'
                                            ? '/conversion'
                                            : cat.title.toLowerCase() === 'ecology'
                                                ? '/ecology'
                                                : cat.title.toLowerCase() === 'everyday life'
                                                    ? '/everyday-life'
                                                    : cat.title.toLowerCase() === 'finance'
                                                        ? '/finance'
                                                        : cat.title.toLowerCase() === 'food'
                                                            ? '/food'
                                                            : cat.title.toLowerCase() === 'health'
                                                                ? '/health'
                                                                : cat.title.toLowerCase() === 'math'
                                                                    ? '/math'
                                                                    : cat.title.toLowerCase() === 'physics'
                                                                        ? '/physics'
                                                                        : cat.title.toLowerCase() === 'sports'
                                                                            ? '/sports'
                                                                            : cat.title.toLowerCase() === 'statistics'
                                                                                ? '/statistics'
                                                                                : cat.title.toLowerCase() === 'other'
                                                                                    ? '/other'
                                                                                    : '#'
                        }
                        className={`sub-nav-link ${isActive(cat.title) ? 'active' : ''}`}
                    >
                        {cat.title}
                    </Link>
                ))}
                <Link to="#" className="sub-nav-link">Statistics</Link>
                <Link to="#" className="sub-nav-link">Other</Link>
            </nav>
            <div className="sub-nav-underline">
                <div className="active-indicator" style={{
                    /* Dynamic positioning logic could go here, for now simpler active class styling */
                }}></div>
            </div>
        </div>
    );
};

export default SubNavigation;
