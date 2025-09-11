import React from 'react';
import { Box, Container, Typography, Fade } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import netflixTheme from '../theme/netflixTheme';
import NetflixNavbar from '../components/NetflixNavbar';
import NetflixHero from '../components/NetflixHero';
import NetflixRow from '../components/NetflixRow';

const NetflixDashboard = () => {
  // Mock data for different content rows
  const featuredContent = {
    title: "Continue Watching",
    items: [
      {
        id: 1,
        title: "Stranger Things",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.",
        genre: "Sci-Fi",
        year: "2022",
        rating: "8.7",
        duration: "50 min",
      },
      {
        id: 2,
        title: "The Crown",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the 20th century.",
        genre: "Drama",
        year: "2022",
        rating: "8.6",
        duration: "55 min",
      },
      {
        id: 3,
        title: "Ozark",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "A financial advisor drags his family from Chicago to the Missouri Ozarks, where he must launder money to appease a Mexican drug cartel.",
        genre: "Crime",
        year: "2022",
        rating: "8.2",
        duration: "60 min",
      },
    ],
  };

  const trendingNow = {
    title: "Trending Now",
    items: [
      {
        id: 4,
        title: "Wednesday",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Follows Wednesday Addams' years as a student, when she is attempting to master her emerging psychic ability, thwart a monstrous killing spree that has terrorized the local town, and solve the murder mystery that embroiled her parents.",
        genre: "Comedy",
        year: "2022",
        rating: "8.1",
        duration: "45 min",
      },
      {
        id: 5,
        title: "The Witcher",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.",
        genre: "Fantasy",
        year: "2021",
        rating: "8.2",
        duration: "60 min",
      },
      {
        id: 6,
        title: "Bridgerton",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Wealth, lust, and betrayal set in the backdrop of Regency era England, seen through the eyes of the powerful Bridgerton family.",
        genre: "Romance",
        year: "2020",
        rating: "7.3",
        duration: "60 min",
      },
    ],
  };

  const myList = {
    title: "My List",
    items: [
      {
        id: 7,
        title: "The Queen's Gambit",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Orphaned at the tender age of nine, prodigious introvert Beth Harmon discovers and masters the game of chess in 1960s USA.",
        genre: "Drama",
        year: "2020",
        rating: "8.5",
        duration: "67 min",
      },
      {
        id: 8,
        title: "Dark",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "A family saga with a supernatural twist, set in a German town, where the disappearance of two young children exposes the relationships among four families.",
        genre: "Sci-Fi",
        year: "2017",
        rating: "8.7",
        duration: "50 min",
      },
      {
        id: 9,
        title: "Money Heist",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history - stealing 2.4 billion euros from the Royal Mint of Spain.",
        genre: "Crime",
        year: "2017",
        rating: "8.3",
        duration: "70 min",
      },
    ],
  };

  const newReleases = {
    title: "New Releases",
    items: [
      {
        id: 10,
        title: "Squid Game",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits with deadly high stakes.",
        genre: "Thriller",
        year: "2021",
        rating: "8.0",
        duration: "55 min",
      },
      {
        id: 11,
        title: "The Sandman",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Upon escaping after decades of imprisonment by a mortal wizard, Dream, the personification of dreams, sets about to reclaim his lost equipment.",
        genre: "Fantasy",
        year: "2022",
        rating: "7.7",
        duration: "45 min",
      },
      {
        id: 12,
        title: "House of the Dragon",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "An internal succession war within House Targaryen at the height of its power, 172 years before the birth of Daenerys Targaryen.",
        genre: "Fantasy",
        year: "2022",
        rating: "8.5",
        duration: "65 min",
      },
    ],
  };

  return (
    <ThemeProvider theme={netflixTheme}>
      <Box sx={{ backgroundColor: '#141414', minHeight: '100vh' }}>
        <NetflixNavbar />
        
        <Fade in timeout={1000}>
          <Box>
            {/* Hero Section */}
            <NetflixHero
              title="Unlimited movies, TV shows, and more."
              subtitle="Watch anywhere. Cancel anytime."
              description="Ready to watch? Enter your email to create or restart your membership."
              backgroundImage="https://images.unsplash.com/photo-1489599808426-2a0b0b5b0b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            />

            {/* Content Rows */}
            <Box sx={{ mt: -10, position: 'relative', zIndex: 2 }}>
              <NetflixRow {...featuredContent} />
              <NetflixRow {...trendingNow} />
              <NetflixRow {...myList} />
              <NetflixRow {...newReleases} />
            </Box>
          </Box>
        </Fade>
      </Box>
    </ThemeProvider>
  );
};

export default NetflixDashboard;
