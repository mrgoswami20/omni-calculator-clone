import React from 'react';
import { Link } from 'react-router-dom';
import SubNavigation from './SubNavigation';
import { MoreVertical, Info } from 'lucide-react';
import './CategoryLayout.css';

const CategoryLayout = ({ data }) => {
    if (!data) return <div>Page not found</div>;

    const { title, subtitle, description, icon: Icon, iconColor, iconFill, sections } = data;

    return (
        <div className="category-page">
            <SubNavigation />

            <div className="category-content">
                <div className="ad-banner-placeholder">
                    {/* Placeholder for top banner */}
                </div>

                <div className="main-layout">
                    <div className="left-column">
                        <div className="title-section">
                            <div className="icon-box">
                                {Icon && <Icon color={iconFill || "white"} size={24} fill={iconFill || "none"} />}
                            </div>
                            <h1>{title}</h1>
                        </div>

                        {subtitle && <p className="subtitle">{subtitle}</p>}

                        <div className="description-text">
                            <p>{description}</p>
                            <a href="#" className="read-more">Read more</a>
                        </div>

                        {sections.map((section, index) => {
                            const SectionIcon = section.icon;
                            return (
                                <div key={index} className="category-group">
                                    {(section.title || SectionIcon || section.emoji) && (
                                        <div className="group-header">
                                            {section.title && <h2>{section.title}</h2>}
                                            {section.emoji && <span className="emoji">{section.emoji}</span>}
                                            {SectionIcon && <span className="emoji"><SectionIcon size={24} color={section.iconColor || "#a16207"} /></span>}
                                        </div>
                                    )}

                                    <div className="calculator-list">
                                        {section.groups.map((group, groupIndex) => (
                                            <ul key={groupIndex}>
                                                {group.map((link, linkIndex) => (
                                                    <li key={linkIndex}>
                                                        <Link to={link.url}>{link.label}</Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="right-column">
                        <div className="info-box-placeholder">
                            {/* Right side box */}
                            <div className="info-icons">
                                <Info size={16} color="#9ca3af" />
                                <MoreVertical size={16} color="#9ca3af" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryLayout;
