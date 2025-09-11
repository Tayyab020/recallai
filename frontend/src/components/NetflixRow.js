import React, { useRef, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Container,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import NetflixCard from './NetflixCard';

const NetflixRow = ({
  title,
  items = [],
  showArrows = true,
  cardVariant = 'default',
  maxItems = 6,
}) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });

      // Update scroll state after a short delay
      setTimeout(() => {
        if (scrollRef.current) {
          setCanScrollLeft(scrollRef.current.scrollLeft > 0);
          setCanScrollRight(
            scrollRef.current.scrollLeft < 
            scrollRef.current.scrollWidth - scrollRef.current.clientWidth
          );
        }
      }, 300);
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      setCanScrollLeft(scrollRef.current.scrollLeft > 0);
      setCanScrollRight(
        scrollRef.current.scrollLeft < 
        scrollRef.current.scrollWidth - scrollRef.current.clientWidth
      );
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Container maxWidth="xl">
        <Typography
          variant="h5"
          sx={{
            color: 'white',
            fontWeight: 600,
            mb: 2,
            pl: 1,
          }}
        >
          {title}
        </Typography>

        <Box sx={{ position: 'relative' }}>
          {/* Left Arrow */}
          {showArrows && canScrollLeft && (
            <IconButton
              onClick={() => scroll('left')}
              sx={{
                position: 'absolute',
                left: -20,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                zIndex: 10,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                },
              }}
            >
              <ChevronLeft />
            </IconButton>
          )}

          {/* Right Arrow */}
          {showArrows && canScrollRight && (
            <IconButton
              onClick={() => scroll('right')}
              sx={{
                position: 'absolute',
                right: -20,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                zIndex: 10,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                },
              }}
            >
              <ChevronRight />
            </IconButton>
          )}

          {/* Scrollable Content */}
          <Box
            ref={scrollRef}
            onScroll={handleScroll}
            sx={{
              display: 'flex',
              gap: 2,
              overflowX: 'auto',
              scrollBehavior: 'smooth',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              pb: 1,
            }}
          >
            {items.slice(0, maxItems).map((item, index) => (
              <Box
                key={item.id || index}
                sx={{
                  flex: '0 0 auto',
                  minWidth: { xs: 150, sm: 200, md: 250 },
                }}
              >
                <NetflixCard
                  title={item.title}
                  image={item.image}
                  description={item.description}
                  genre={item.genre}
                  year={item.year}
                  rating={item.rating}
                  duration={item.duration}
                  variant={cardVariant}
                  onPlay={() => console.log('Play:', item.title)}
                  onAddToList={() => console.log('Add to list:', item.title)}
                  onLike={() => console.log('Like:', item.title)}
                  onDislike={() => console.log('Dislike:', item.title)}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default NetflixRow;
