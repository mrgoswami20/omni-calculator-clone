import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = ({ onOpenAuth }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const isHomePage = location.pathname === '/';
    const [headerSearch, setHeaderSearch] = useState('');

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

                {!isHomePage && (
                    <div className="header-search">
                        <input
                            type="text"
                            placeholder="Search calculator..."
                            value={headerSearch}
                            onChange={(e) => setHeaderSearch(e.target.value)}
                        />
                        <Search size={18} color="#436cfe" />
                    </div>
                )}

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
