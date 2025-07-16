import React from 'react';
import Button from './Button.jsx';
import './Layout.css';

export default function Header() {
    return (
        <header className="header">
            <div>Job Interview Tracker</div>
            <Button
                onClick={() => alert('Logging out...')}
                variant="primary"
            >
                Log out
            </Button>
        </header>
    );
}
