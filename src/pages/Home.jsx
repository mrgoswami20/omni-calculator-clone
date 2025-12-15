import React, { useState } from 'react';
import Hero from '../components/Hero';
import CalculatorGrid from '../components/CalculatorGrid';
import FeaturedIn from '../components/FeaturedIn';
import AboutUs from '../components/AboutUs';
import MostPopular from '../components/MostPopular';

const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <>
            <Hero searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <main>
                <CalculatorGrid searchTerm={searchTerm} />
                <FeaturedIn />
                <AboutUs />
                <MostPopular />
            </main>
        </>
    );
};

export default Home;
