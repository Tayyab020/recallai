import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Fade,
  Grow,
} from '@mui/material';
import {
  PlayArrow,
  Add,
  ThumbUp,
  ThumbDown,
  MoreVert,
} from '@mui/icons-material';

const NetflixCard = ({
  title,
  image,
  description,
  genre,
  year,
  rating,
  duration,
  onPlay,
  onAddToList,
  onLike,
  onDislike,
  variant = 'default', // 'default', 'featured', 'compact'
  showActions = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getCardStyles = () => {
    switch (variant) {
      case 'featured':
        return {
          height: { xs: 300, sm: 400, md: 500 },
          borderRadius: 2,
          overflow: 'hidden',
        };
      case 'compact':
        return {
          height: 200,
          borderRadius: 1,
          overflow: 'hidden',
        };
      default:
        return {
          height: 300,
          borderRadius: 2,
          overflow: 'hidden',
        };
    }
  };

  const getImageHeight = () => {
    switch (variant) {
      case 'featured':
        return '70%';
      case 'compact':
        return '60%';
      default:
        return '65%';
    }
  };

  return (
    <Card
      sx={{
        ...getCardStyles(),
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'scale(1.05)',
          zIndex: 10,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <CardMedia
        component="img"
        height={getImageHeight()}
        image={image}
        alt={title}
        sx={{
          objectFit: 'cover',
          transition: 'transform 0.3s ease',
          '&:hover': {
            transform: 'scale(1.1)',
          },
        }}
      />

      {/* Gradient Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 100%)',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Content */}
      <CardContent
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 100%)',
          color: 'white',
          p: 2,
        }}
      >
        <Typography
          variant={variant === 'featured' ? 'h5' : 'h6'}
          sx={{
            fontWeight: 600,
            mb: 1,
            textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {title}
        </Typography>

        {variant !== 'compact' && (
          <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
            {genre && (
              <Chip
                label={genre}
                size="small"
                sx={{
                  backgroundColor: 'rgba(229, 9, 20, 0.8)',
                  color: 'white',
                  fontSize: '0.75rem',
                }}
              />
            )}
            {year && (
              <Chip
                label={year}
                size="small"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontSize: '0.75rem',
                }}
              />
            )}
            {rating && (
              <Chip
                label={`${rating}/10`}
                size="small"
                sx={{
                  backgroundColor: 'rgba(255, 193, 7, 0.8)',
                  color: 'black',
                  fontSize: '0.75rem',
                }}
              />
            )}
          </Box>
        )}

        {description && variant !== 'compact' && (
          <Typography
            variant="body2"
            sx={{
              color: '#B3B3B3',
              textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {description}
          </Typography>
        )}
      </CardContent>

      {/* Action Buttons - Show on Hover */}
      {showActions && (
        <Fade in={isHovered} timeout={300}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              gap: 1,
            }}
          >
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onPlay && onPlay();
              }}
              sx={{
                backgroundColor: 'rgba(229, 9, 20, 0.9)',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#E50914',
                },
              }}
            >
              <PlayArrow />
            </IconButton>

            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onAddToList && onAddToList();
              }}
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                },
              }}
            >
              <Add />
            </IconButton>

            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onLike && onLike();
              }}
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                },
              }}
            >
              <ThumbUp />
            </IconButton>

            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onDislike && onDislike();
              }}
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                },
              }}
            >
              <ThumbDown />
            </IconButton>

            <IconButton
              onClick={(e) => {
                e.stopPropagation();
              }}
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                },
              }}
            >
              <MoreVert />
            </IconButton>
          </Box>
        </Fade>
      )}
    </Card>
  );
};

export default NetflixCard;
