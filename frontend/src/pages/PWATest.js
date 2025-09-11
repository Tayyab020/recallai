import React, { useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    Button,
    Box,
    Alert,
    Card,
    CardContent,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import {
    GetApp,
    CheckCircle,
    PhoneAndroid,
    Laptop,
    Notifications,
    OfflinePin,
    Speed,
    Info
} from '@mui/icons-material';
import { usePWA } from '../contexts/PWAContext';
import InstallPrompt from '../components/InstallPrompt';

const PWATest = () => {
    const {
        deferredPrompt,
        isInstalled,
        installApp,
        isOnline,
        requestNotificationPermission
    } = usePWA();

    const [showInstallDialog, setShowInstallDialog] = useState(false);
    const [installResult, setInstallResult] = useState(null);
    const [notificationResult, setNotificationResult] = useState(null);

    const handleInstall = async () => {
        const result = await installApp();
        setInstallResult(result);
    };

    const handleNotificationPermission = async () => {
        const result = await requestNotificationPermission();
        setNotificationResult(result);
    };

    const features = [
        {
            icon: <Speed color="primary" />,
            title: 'Fast Loading',
            description: 'Optimized for quick startup and smooth performance'
        },
        {
            icon: <OfflinePin color="primary" />,
            title: 'Offline Ready',
            description: 'Works without internet connection for core features'
        },
        {
            icon: <Notifications color="primary" />,
            title: 'Push Notifications',
            description: 'Get reminder alerts even when app is closed'
        },
        {
            icon: <PhoneAndroid color="primary" />,
            title: 'Mobile Optimized',
            description: 'Responsive design that works on all devices'
        }
    ];

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom align="center">
                    📱 Progressive Web App Features
                </Typography>

                <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
                    Test and explore the PWA capabilities of Recall.AI
                </Typography>

                {/* Status Cards */}
                <Box sx={{ display: 'grid', gap: 2, mb: 4, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Laptop color="primary" />
                                <Box>
                                    <Typography variant="h6">Installation Status</Typography>
                                    <Chip
                                        label={isInstalled ? 'Installed' : deferredPrompt ? 'Available' : 'Not Available'}
                                        color={isInstalled ? 'success' : deferredPrompt ? 'primary' : 'default'}
                                        size="small"
                                    />
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Info color="primary" />
                                <Box>
                                    <Typography variant="h6">Connection Status</Typography>
                                    <Chip
                                        label={isOnline ? 'Online' : 'Offline'}
                                        color={isOnline ? 'success' : 'warning'}
                                        size="small"
                                    />
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>

                {/* Install Section */}
                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            🚀 Install App
                        </Typography>

                        {isInstalled ? (
                            <Alert severity="success" sx={{ mb: 2 }}>
                                <Typography variant="body2">
                                    ✅ App is already installed! You can access it from your desktop or home screen.
                                </Typography>
                            </Alert>
                        ) : deferredPrompt ? (
                            <Box>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    Install Recall.AI on your device for the best experience:
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    <Button
                                        variant="contained"
                                        startIcon={<GetApp />}
                                        onClick={handleInstall}
                                    >
                                        Install Now
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={() => setShowInstallDialog(true)}
                                    >
                                        Learn More
                                    </Button>
                                </Box>
                            </Box>
                        ) : (
                            <Alert severity="info">
                                <Typography variant="body2">
                                    Install prompt not available. This might be because:
                                    <br />• App is already installed
                                    <br />• Browser doesn't support PWA installation
                                    <br />• Installation criteria not met
                                </Typography>
                            </Alert>
                        )}

                        {installResult && (
                            <Alert
                                severity={installResult.success ? 'success' : 'error'}
                                sx={{ mt: 2 }}
                                onClose={() => setInstallResult(null)}
                            >
                                {installResult.message}
                            </Alert>
                        )}
                    </CardContent>
                </Card>

                {/* Notifications Section */}
                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            🔔 Push Notifications
                        </Typography>

                        <Typography variant="body2" sx={{ mb: 2 }}>
                            Enable notifications to receive reminder alerts:
                        </Typography>

                        <Button
                            variant="outlined"
                            startIcon={<Notifications />}
                            onClick={handleNotificationPermission}
                            sx={{ mb: 2 }}
                        >
                            Request Permission
                        </Button>

                        {notificationResult && (
                            <Alert
                                severity={notificationResult.success ? 'success' : 'error'}
                                onClose={() => setNotificationResult(null)}
                            >
                                {notificationResult.message}
                            </Alert>
                        )}
                    </CardContent>
                </Card>

                {/* Features List */}
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            ✨ PWA Features
                        </Typography>

                        <List>
                            {features.map((feature, index) => (
                                <ListItem key={index} sx={{ px: 0 }}>
                                    <ListItemIcon>
                                        {feature.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={feature.title}
                                        secondary={feature.description}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>

                {/* Install Instructions */}
                <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        📋 Manual Installation Instructions:
                    </Typography>
                    <Typography variant="body2" component="div">
                        <strong>Chrome/Edge:</strong> Look for the install icon in the address bar<br />
                        <strong>Firefox:</strong> Menu → Install this site as an app<br />
                        <strong>Safari:</strong> Share → Add to Home Screen<br />
                        <strong>Mobile:</strong> Add to Home Screen option in browser menu
                    </Typography>
                </Box>
            </Paper>

            {/* Install Dialog */}
            <InstallPrompt
                open={showInstallDialog}
                onClose={() => setShowInstallDialog(false)}
            />
        </Container>
    );
};

export default PWATest;