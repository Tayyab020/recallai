import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Fade,
  Slide,
} from '@mui/material';
import {
  PlayArrow,
  InfoOutlined,
} from '@mui/icons-material';

const NetflixHero = ({ 
  title = "Unlimited movies, TV shows, and more.",
  subtitle = "Watch anywhere. Cancel anytime.",
  description = "Ready to watch? Enter your email to create or restart your membership.",
  backgroundImage = "https://images.unsplash.com/photo-1489599808426-2a0b0b5b0b5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  showButtons = true,
  height = "80vh"
}) => {
  return (
    <Box
      sx={{
        position: 'relative',
        height: height,
        backgroundImage: `linear-gradient(
          to right,
          rgba(0, 0, 0, 0.7) 0%,
          rgba(0, 0, 0, 0.4) 50%,
          rgba(0, 0, 0, 0.7) 100%
        ), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Gradient Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.8) 100%)',
        }}
      />

      {/* Content */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Fade in timeout={1000}>
          <Box
            sx={{
              textAlign: 'center',
              color: 'white',
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            <Slide direction="up" in timeout={1200}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                  fontWeight: 700,
                  mb: 2,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
                }}
              >
                {title}
              </Typography>
            </Slide>

            <Slide direction="up" in timeout={1400}>
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                  fontWeight: 400,
                  mb: 3,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                }}
              >
                {subtitle}
              </Typography>
            </Slide>

            <Slide direction="up" in timeout={1600}>
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '1rem', sm: '1.125rem' },
                  mb: 4,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                  maxWidth: '600px',
                  mx: 'auto',
                }}
              >
                {description}
              </Typography>
            </Slide>

            {showButtons && (
              <Slide direction="up" in timeout={1800}>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    mt: 4,
                  }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<PlayArrow />}
                    sx={{
                      backgroundColor: '#E50914',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: '#F40612',
                        boxShadow: '0 4px 12px rgba(229, 9, 20, 0.4)',
                      },
                    }}
                  >
                    Play
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<InfoOutlined />}
                    sx={{
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      color: 'white',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                    }}
                  >
                    More Info
                  </Button>
                </Box>
              </Slide>
            )}
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default NetflixHero;
