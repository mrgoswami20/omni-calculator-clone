import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Header.css';

import { categoryPagesData } from '../data/categoryPagesData';

const Header = ({ onOpenAuth }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    // const isHomePage = location.pathname === '/'; // Enabled search globally
    const [headerSearch, setHeaderSearch] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    // Flatten data for search
    const allCalculators = React.useMemo(() => {
        const calculators = [];
        Object.values(categoryPagesData).forEach(cat => {
            const catName = cat.title.replace(' Calculators', '');
            if (cat.sections) {
                cat.sections.forEach(sec => {
                    if (sec.groups) {
                        sec.groups.forEach(group => {
                            group.forEach(item => {
                                if (item.url && item.url !== '#') {
                                    calculators.push({
                                        name: item.label,
                                        url: item.url,
                                        category: catName
                                    });
                                }
                            });
                        });
                    }
                });
            }
            // Handle 'discover-omni' which might have different structure in other objects? 
            // categoryPagesData structure seems consistent based on file view.
            // Discover Omni has title "Discover Omni", no "Calculators" suffix.
        });
        return calculators;
    }, []);

    const filteredResults = React.useMemo(() => {
        if (!headerSearch || headerSearch.length < 2) return [];
        const lower = headerSearch.toLowerCase();
        return allCalculators.filter(calc =>
            calc.name.toLowerCase().includes(lower)
        ).slice(0, 10);
    }, [headerSearch, allCalculators]);

    const handleSearchClick = (url) => {
        navigate(url);
        setHeaderSearch('');
        setShowDropdown(false);
    };

    return (
        <header className="header">
            <div className="header-content">
                <div className="logo-container" onClick={() => navigate('/')}>
                    <div className="logo-icon">
                        <div className="circle-blue"></div>
                        <div className="circle-orange"></div>
                        <div className="circle-dark"></div>
                    </div>
                    <span className="logo-text">omni calculator</span>
                </div>

                <div className="header-search-container">
                    <div className="header-search">
                        <input
                            type="text"
                            placeholder="Search calculator..."
                            value={headerSearch}
                            onChange={(e) => {
                                setHeaderSearch(e.target.value);
                                setShowDropdown(true);
                            }}
                            onFocus={() => setShowDropdown(true)}
                            onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // Delay for click
                        />
                        <Search size={18} color="#436cfe" />
                    </div>

                    {showDropdown && filteredResults.length > 0 && (
                        <div className="search-dropdown">
                            {filteredResults.map((result, idx) => (
                                <div
                                    key={idx}
                                    className="search-item"
                                    onClick={() => handleSearchClick(result.url)}
                                >
                                    <span className="search-item-name">{result.name}</span>
                                    <span className="search-item-dot">•</span>
                                    <span className="search-item-cat">{result.category}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="auth-buttons">
                    {user ? (
                        <div className="user-profile">
                            <div className="user-avatar">
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} />
                                ) : (
                                    <User size={20} />
                                )}
                            </div>
                            <span className="user-name">{user.name}</span>
                            <button className="logout-btn" onClick={logout} title="Log out">
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <>
                            <button className="login-btn" onClick={() => onOpenAuth('login')}>Log in</button>
                            <button className="signup-btn" onClick={() => onOpenAuth('signup')}>Sign up</button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
