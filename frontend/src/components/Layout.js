import React from 'react';
import { Box, Toolbar } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    const { user } = useAuth();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {user && <Navbar />}
            {user && <Toolbar />} {/* Spacer for fixed navbar - prevents overlap */}

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 2,
                    minHeight: user ? 'calc(100vh - 64px)' : '100vh',
                    backgroundColor: 'background.default'
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default Layout;