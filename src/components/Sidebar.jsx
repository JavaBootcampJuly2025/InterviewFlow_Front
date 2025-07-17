import React from 'react';
import { NavLink } from 'react-router-dom';
import './Layout.css';

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <nav>
                <NavLink
                    to="/Dashboard"
                    className={({ isActive }) =>
                        isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link'
                    }
                    end
                >
                    Dashboard
                </NavLink>
                {/* Add more links here */}
            </nav>
        </aside>
    );
}
