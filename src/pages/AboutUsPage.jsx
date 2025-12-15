import React from 'react';
import SubNavigation from '../components/SubNavigation';
import './AboutUsPage.css';

const AboutUsPage = () => {
    return (
        <div className="about-us-page">
            <SubNavigation />

            <div className="about-us-page-content">
                <h1 className="about-us-title">About us</h1>

                <div className="about-section">
                    <h2 className="section-title">1. The Purpose</h2>

                    <span className="highlight-text">We make decisions more rational, one calculation at a time.</span>

                    <p>
                        Far too often, we perceive the world through the lens of our emotions, feelings, and intuition. Meanwhile, a multitude of our problems can be solved with a tiny bit of math. Buy or rent a house? How long to boil an egg? Am I overweight? What it takes to answer these questions is a clear mind, a few minutes, and a mathematical formula. Three things that we often lack, so we go with hunches instead.
                    </p>

                    <p>
                        At Omni Calculator, we knock down each and every obstacle that stands between you and an informed decision. We provide the numbers you need, making calculations fast, easy, and fun.
                    </p>

                    <p>
                        A world driven by rational decisions is a better place. It's a world where we don't waste resources as much, believe nonsense a bit less, and don't mistake opinions for facts.
                    </p>

                    <p>
                        It's the world we want to help build.
                    </p>
                </div>

                <div className="about-section">
                    <h2 className="section-title">2. The Company</h2>

                    <span className="highlight-text">Turning reality into calculators.</span>

                    <p>
                        Omni Calculator is a Polish startup that brings you hundreds of custom-built calculators. Each of them solves a real-life problem that, while tiny, is shared by millions of people across the globe. Our calculators take only seconds to use and give you precisely the numbers you need.
                    </p>

                    <p>
                        We're called Omni Calculator for a single reason – our goal is to solve all small math problems that people deal with on an everyday basis.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutUsPage;
