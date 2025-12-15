import React from 'react';
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
                            <path d="M 20 100 A 80 80 0 0 1 100 20" fill="none" stroke="#fbbf24" strokeWidth="24" strokeLinecap="round" />
                            {/* Red Right Segment */}
                            <path d="M 100 20 A 80 80 0 0 1 180 100" fill="none" stroke="#ef4444" strokeWidth="24" strokeLinecap="round" strokeDasharray="1 15" />
                            {/* The screenshot curve is actually a bit more complex/abstract. It's a large arc.
                   Let's try to match the visible segments: Yellow (top-left ish), Red (top-right), Blue (bottom-right).
                   It looks like a broken circle.
                */}
                            <circle cx="100" cy="100" r="80" fill="none" stroke="#e5e7eb" strokeWidth="0" />

                            {/* Re-drawing based on the "C" shape in screenshot */}
                            {/* Yellow squiggle */}
                            <path d="M 40 140 Q 20 100 50 60" fill="none" stroke="#fbbf24" strokeWidth="20" strokeLinecap="round" />
                            {/* This is hard to guess perfectly. Let's use the nice 3-colored arc from the brand. */}

                            {/* Let's Try a 3-part ring which looks very "Omni" */}
                            <path d="M 30 150 A 90 90 0 0 1 120 40" fill="none" stroke="#fbbf24" strokeWidth="20" strokeLinecap="round" />
                            <path d="M 120 40 A 90 90 0 0 1 180 120" fill="none" stroke="#ef4444" strokeWidth="20" strokeLinecap="round" />
                            <path d="M 180 120 A 90 90 0 0 1 100 190" fill="none" stroke="#3b82f6" strokeWidth="20" strokeLinecap="round" />
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
                            <a href="#"><Dna size={16} /> Biology</a>
                            <a href="#"><FlaskConical size={16} /> Chemistry</a>
                            <a href="#"><Hammer size={16} /> Construction</a>
                            <a href="#"><ArrowRightLeft size={16} /> Conversion</a>
                            <a href="#"><Leaf size={16} /> Ecology</a>
                            <a href="#"><Coffee size={16} /> Everyday life</a>
                            <a href="#"><DollarSign size={16} /> Finance</a>
                            <a href="#"><Utensils size={16} /> Food</a>
                            <a href="#"><Heart size={16} /> Health</a>
                            <a href="#"><Calculator size={16} /> Math</a>
                            <a href="#"><Atom size={16} /> Physics</a>
                            <a href="#"><Dumbbell size={16} /> Sports</a>
                            <a href="#"><BarChart size={16} /> Statistics</a>
                            <a href="#"><MoreHorizontal size={16} /> Other</a>
                            <a href="#"><Star size={16} /> Discover Omni</a>
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
                            <a href="#">About</a>
                            <a href="#">Resource library</a>
                            <a href="#">Collections</a>
                            <a href="#">Contact</a>
                            <a href="#">Contact</a>
                            <a href="#" className="hiring-link">We're hiring!</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="language-selector">
                    <span role="img" aria-label="US Flag">🇺🇸</span> English <ChevronDown size={14} />
                </div>

                <div className="legal-links">
                    <a href="#">Privacy, Cookies & Terms of Service</a>
                    <span className="copyright">Copyright by Omni Calculator sp. z o.o.</span>
                </div>
            </div>
        </footer >
    );
};

export default Footer;
