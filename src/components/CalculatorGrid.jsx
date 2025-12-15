import { useNavigate } from 'react-router-dom';
import CalculatorCard from './CalculatorCard';
import { categories } from '../data/categories';
import { Star } from 'lucide-react';
import './CalculatorGrid.css';

const CalculatorGrid = ({ searchTerm }) => {
    const navigate = useNavigate();
    const filteredCategories = categories.filter((category) =>
        category.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className="grid-section">
            <div className="grid-container">
                {filteredCategories.map((category) => (
                    <CalculatorCard
                        key={category.id}
                        title={category.title}
                        count={category.count}
                        icon={category.icon}
                    />
                ))}
                {filteredCategories.length === categories.length && (
                    <div
                        className="calculator-card discover-omni-card"
                        onClick={() => navigate('/discover-omni')}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="icon-wrapper">
                            <Star size={32} color="#436cfe" />
                        </div>
                        <h3 className="card-title">Discover Omni</h3>
                        <p className="card-count" style={{ fontSize: '0.9rem', lineHeight: '1.4' }}>
                            Amazing truths about the world revealed with calculators.
                        </p>
                    </div>
                )}
                {filteredCategories.length === 0 && (
                    <div className="no-results">
                        <p>No calculators found matching "{searchTerm}"</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CalculatorGrid;
