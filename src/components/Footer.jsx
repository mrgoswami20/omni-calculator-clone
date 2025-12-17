import React from 'react';
import { Link } from 'react-router-dom';
import {
    Facebook,
    Youtube,
    Linkedin,
    Instagram,
    Dna,
    FlaskConical,
    Hammer,
    ArrowRightLeft,
    Leaf,
    Coffee,
    DollarSign,
    Utensils,
    Heart,
    Calculator,
    Atom,
    Dumbbell,
    BarChart,
    MoreHorizontal,
    Star,
    Twitter,
    ChevronDown
} from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">

                {/* Left Side - Brand & Promo */}
                <div className="footer-brand-section">
                    <div className="brand-curve-container">
                        <svg viewBox="0 0 200 200" className="brand-curve-svg">
                            {/* Yellow Top Segment */}
                            {/* Red Right Segment */}
                            {/* The screenshot curve is actually a bit more complex/abstract. It's a large arc.
                   Let's try to match the visible segments: Yellow (top-left ish), Red (top-right), Blue (bottom-right).
                   It looks like a broken circle.
                */}
                            <defs>
                                <linearGradient id="gradYellow" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#fbbf24" />
                                    <stop offset="100%" stopColor="#d97706" />
                                </linearGradient>
                                <linearGradient id="gradRed" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#f87171" />
                                    <stop offset="100%" stopColor="#dc2626" />
                                </linearGradient>
                                <linearGradient id="gradBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#60a5fa" />
                                    <stop offset="100%" stopColor="#2563eb" />
                                </linearGradient>
                            </defs>

                            <circle cx="100" cy="100" r="80" fill="none" stroke="#e5e7eb" strokeWidth="0" />

                            <path d="M 30 150 A 90 90 0 0 1 120 40" fill="none" stroke="url(#gradYellow)" strokeWidth="20" strokeLinecap="round" />
                            <path d="M 120 40 A 90 90 0 0 1 180 120" fill="none" stroke="url(#gradRed)" strokeWidth="20" strokeLinecap="round" />
                            <path d="M 180 120 A 90 90 0 0 1 100 190" fill="none" stroke="url(#gradBlue)" strokeWidth="20" strokeLinecap="round" />
                        </svg>
                    </div>

                    <div className="brand-content">
                        <h2 className="brand-slogan">We make it<br />count!</h2>
                        <div className="footer-logo">
                            <span className="logo-omni">omni</span> calculator
                        </div>

                        <div className="social-icons">
                            <a href="#" aria-label="Facebook"><Facebook size={24} /></a>
                            <a href="#" aria-label="YouTube"><Youtube size={24} /></a>
                            <a href="#" aria-label="Twitter"><Twitter size={24} /></a>
                            <a href="#" aria-label="LinkedIn"><Linkedin size={24} /></a>
                            <a href="#" aria-label="Instagram"><Instagram size={24} /></a>
                        </div>
                    </div>
                </div>


                {/* Right Side - Links */}
                <div className="footer-links-section">
                    <div className="links-column categories-column">
                        <h3 className="column-title">Calculator Categories</h3>
                        <div className="categories-grid">
                            <Link to="/biology"><Dna size={16} /> Biology</Link>
                            <Link to="/chemistry"><FlaskConical size={16} /> Chemistry</Link>
                            <Link to="/construction"><Hammer size={16} /> Construction</Link>
                            <Link to="/conversion"><ArrowRightLeft size={16} /> Conversion</Link>
                            <Link to="/ecology"><Leaf size={16} /> Ecology</Link>
                            <Link to="/everyday-life"><Coffee size={16} /> Everyday life</Link>
                            <Link to="/finance"><DollarSign size={16} /> Finance</Link>
                            <Link to="/food"><Utensils size={16} /> Food</Link>
                            <Link to="/health"><Heart size={16} /> Health</Link>
                            <Link to="/math"><Calculator size={16} /> Math</Link>
                            <Link to="/physics"><Atom size={16} /> Physics</Link>
                            <Link to="/sports"><Dumbbell size={16} /> Sports</Link>
                            <Link to="/statistics"><BarChart size={16} /> Statistics</Link>
                            <Link to="/other"><MoreHorizontal size={16} /> Other</Link>
                            <Link to="/discover-omni"><Star size={16} /> Discover Omni</Link>
                        </div>
                    </div>

                    <div className="links-group-secondary">
                        <div className="links-column press-column">
                            <h3 className="column-title">Press</h3>
                            <a href="#">Editorial policies</a>
                            <a href="#">Partnerships</a>
                        </div>

                        <div className="links-column meet-column">
                            <h3 className="column-title">Meet Omni</h3>
                            <Link to="/about-us">About</Link>
                            <a href="#">Resource library</a>
                            <a href="#">Collections</a>
                            <a href="#">Contact</a>
                            <a href="#" className="hiring-link">We're hiring!</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="footer-bottom-content">
                    <div className="language-selector">
                        <span role="img" aria-label="US Flag">🇺🇸</span> English <ChevronDown size={14} />
                    </div>

                    <div className="legal-links">
                        <a href="#">Privacy, Cookies & Terms of Service</a>
                        <span className="copyright">Copyright by Omni Calculator sp. z o.o.</span>
                    </div>
                </div>
            </div>
        </footer >
    );
};

export default Footer;
