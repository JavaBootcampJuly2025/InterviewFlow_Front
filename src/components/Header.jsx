import React from 'react';
import { Typography } from '@mui/material';
import MuiButton from '@mui/material/Button';

const Header = ({ user, handleLogout }) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
            <Typography variant="h5" gutterBottom>
                Welcome, {user?.userName || 'User'}!
            </Typography>
            <MuiButton variant="outlined" color="secondary" onClick={handleLogout}>
                Logout
            </MuiButton>
        </div>
    );
};

export default Header;
