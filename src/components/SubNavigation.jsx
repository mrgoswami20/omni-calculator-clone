import React, { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { categories } from '../data/categories';
import './SubNavigation.css';

const SubNavigation = () => {
    const location = useLocation();
    const scrollRef = useRef(null);

    // Helper to generate slug consistently
    const getSlug = (title) => title.toLowerCase().replace(/\s+/g, '-');

    const isActive = (title) => {
        const slug = getSlug(title);
        // Base case: check if current path starts with /slug
        return location.pathname.startsWith(`/${slug}`);
    };

    return (
        <div className="sub-nav-container">
            <nav className="sub-nav" ref={scrollRef}>
                {categories.map((cat) => {
                    const slug = getSlug(cat.title);
                    return (
                        <Link
                            key={cat.id}
                            to={`/${slug}`}
                            className={`sub-nav-link ${isActive(cat.title) ? 'active' : ''}`}
                        >
                            {cat.title}
                        </Link>
                    );
                })}
            </nav>
            <div className="sub-nav-underline">
                <div className="active-indicator"></div>
            </div>
        </div>
    );
};

export default SubNavigation;
