import React, { useState, useEffect } from 'react';
import { Search, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = ({ searchTerm, setSearchTerm }) => {
    const [lastUsed, setLastUsed] = useState([]);

    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem('omni_last_used') || '[]');
            // Only set if we have actual history
            if (stored.length > 0) {
                setLastUsed(stored.slice(0, 3));
            }
        } catch (e) {
            console.error("Failed to load last used", e);
        }
    }, []);

    return (
        <section className="hero">
            <div className="hero-main-wrapper">
                <div className="hero-top-content">
                    <div className="hero-text">
                        <h1>
                            Your life in <br />
                            <span className="highlight-text">3772 free </span>
                            <span className="calculator-icon">➗</span>
                            <br />
                            calculators
                        </h1>
                    </div>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search calculator..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="search-btn">
                            <Search size={22} color="#2563eb" />
                        </button>
                    </div>
                </div>

                {/* Last Used Section - Only visible if there is history */}
                {lastUsed.length > 0 && (
                    <div className="last-used-container">
                        <div className="last-used-card">
                            <div className="last-used-header">
                                <Heart className="heart-icon" size={20} />
                                <span className="last-used-label">Last used calculators</span>
                            </div>
                            <div className="last-used-list">
                                {lastUsed.map((item, idx) => (
                                    <Link to={item.url} key={idx} className="last-used-item">
                                        <span className="item-title">{item.title}</span>
                                        <ArrowRight size={14} className="item-arrow" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Hero;
