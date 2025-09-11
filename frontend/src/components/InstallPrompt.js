import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import {
    GetApp,
    Smartphone,
    Notifications,
    OfflinePin,
    Speed
} from '@mui/icons-material';
import { usePWA } from '../contexts/PWAContext';

const InstallPrompt = ({ open, onClose }) => {
    const { installApp } = usePWA();
    const [installing, setInstalling] = useState(false);

    const handleInstall = async () => {
        setInstalling(true);
        const result = await installApp();
        setInstalling(false);

        if (result.success) {
            onClose();
        }
    };

    const benefits = [
        {
            icon: <Speed color="primary" />,
            title: 'Faster Access',
            description: 'Launch directly from your desktop or home screen'
        },
        {
            icon: <OfflinePin color="primary" />,
            title: 'Offline Support',
            description: 'Access your journal entries even without internet'
        },
        {
            icon: <Notifications color="primary" />,
            title: 'Push Notifications',
            description: 'Get reminder alerts even when the app is closed'
        },
        {
            icon: <Smartphone color="primary" />,
            title: 'Native Experience',
            description: 'Feels like a native app on your device'
        }
    ];

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2 }
            }}
        >
            <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
                <GetApp sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                <Typography variant="h5" component="div">
                    Install Recall.AI
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Get the full app experience on your device
                </Typography>
            </DialogTitle>

            <DialogContent>
                <List>
                    {benefits.map((benefit, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                            <ListItemIcon>
                                {benefit.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={benefit.title}
                                secondary={benefit.description}
                            />
                        </ListItem>
                    ))}
                </List>

                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        💡 <strong>Tip:</strong> After installation, you can access Recall.AI directly from your desktop,
                        taskbar, or home screen without opening a browser.
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button onClick={onClose} color="inherit">
                    Maybe Later
                </Button>
                <Button
                    onClick={handleInstall}
                    variant="contained"
                    startIcon={<GetApp />}
                    disabled={installing}
                    sx={{ minWidth: 120 }}
                >
                    {installing ? 'Installing...' : 'Install Now'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default InstallPrompt;