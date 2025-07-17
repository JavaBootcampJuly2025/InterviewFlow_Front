import React from 'react';
import { Typography, Button } from '@mui/material';

const Header = ({ user, handleLogout }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
            <Typography variant="h5" gutterBottom>
                Welcome, {user?.userName || 'User'}!
            </Typography>
            <Button
                variant="outlined"
                color="secondary"
                onClick={handleLogout}
                sx={{ mr: 4 }} // <-- adds left margin
            >
                Logout
            </Button>
        </div>
    );
};

export default Header;
