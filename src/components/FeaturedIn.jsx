import React from 'react';
import './FeaturedIn.css';

const FeaturedIn = () => {
    // List of brands to display as placeholders for logos
    const brands = [
        "The Guardian", "The Washington Post", "The New York Times", "Forbes", "LAD BIBLE",
        "National Geographic", "THE TIMES", "nature", "World Economic Forum", "TechCrunch",
        "COSMOPOLITAN", "The Sun", "WIRED", "science alert", "as",
        "SPACE.com", "IFLSCIENCE!", "howstuffworks", "BUSINESS INSIDER", "NBC NEWS",
        "it", "CNN", "TNW", "Newsweek"
    ];

    return (
        <section className="featured-in-section">
            <div className="curved-header-bg">
                <div className="curve-shape"></div>
                <h2 className="featured-title">Featured in</h2>
            </div>

            <div className="logos-container">
                <div className="logos-grid">
                    {brands.map((brand, index) => (
                        <div key={index} className="logo-item" title={brand}>
                            {/* In a real app, these would be <img> tags. 
                                Using stylized text spans to approximate the look for the clone. */}
                            <span className={`brand-text brand-${index}`}>{brand}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedIn;
