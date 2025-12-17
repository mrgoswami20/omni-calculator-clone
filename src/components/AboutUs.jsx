import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Smile } from 'lucide-react';
import './AboutUs.css';
import YellowPerson from '../assets/Yellow omni-people.webp';
import BluePerson from '../assets/Blue omni-people.webp';
import RedPerson from '../assets/Red omni-people.webp';

const AboutUs = () => {
    return (
        <section className="about-us-section">
            <div className="about-content">
                <h2 className="about-title">About us</h2>

                <p className="about-text">
                    In a surprisingly large part, our reality consists of calculable problems. Should I buy or rent? What's my ideal calorie intake? Can I afford to take this loan? How many lemonades do I need to sell to break even? Often, we don't solve these problems because we lack knowledge, skills, time, or willingness to calculate. And then we make bad, uninformed decisions. Omni Calculator is here to change all that:
                </p>

                <h3 className="mission-statement">
                    We are working on technology that will make every<span className="asterisk">*</span> calculation-based problem trivial for anyone to solve.
                </h3>

                <div className="mission-footnote">
                    <span className="asterisk">*</span> within reason <span className="joker-emoji">🃏</span>
                </div>

                <Link to="/about-us" className="read-more-btn">
                    Read more about us <ArrowRight size={16} />
                </Link>
            </div>

            <div className="team-images-grid">
                {/* Placeholder cards simulating the team photos */}
                <div className="team-card card-yellow">
                    <div className="curve-overlay yellow-curve"></div>
                    <img src={YellowPerson} alt="Team Member" className="team-image" />
                </div>

                <div className="team-card card-blue">
                    <div className="curve-overlay blue-curve"></div>
                    <img src={BluePerson} alt="Team Member" className="team-image" />
                </div>

                <div className="team-card card-red">
                    <div className="curve-overlay red-curve"></div>
                    <img src={RedPerson} alt="Team Member" className="team-image" />
                </div>
            </div>
        </section>
    );
};

export default AboutUs;
