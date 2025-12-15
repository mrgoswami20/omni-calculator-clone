import React from 'react';
import { Search } from 'lucide-react';
import './Hero.css';

const Hero = ({ searchTerm, setSearchTerm }) => {
    return (
        <section className="hero">
            <div className="hero-content">
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
        </section>
    );
};

export default Hero;
