import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import NowILLogo from './assets/Logo.svg';
import './App.css';
import { Home, User, Slack, Dribbble, Heart, Edit } from 'react-feather';

import Homepage from './pages/homepage';
import Guest from "./OnBoardingPage/Pages/Guest";
import LP from "./pages/landingpage"
import SportsPage from './pages/sportspage';
import TeamsPage from './pages/TeamsPage';
import PlayersPage from './pages/PlayersPage';
import TrendingPlayersPage from './pages/trendingplayerspage';
import AllTeamsPage from './pages/AllTeamsPage';
import UniTeamsTracked from './pages/UniTeamsTracked';
import AllPlayersPage from './pages/AllPlayersTracked';
import PlayerCardPage from './pages/PlayerCardPage';
import SpecificSport from './pages/SpecificSport';





// Reusable Sidebar Component
const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('home');

  const menuItems = [
    { id: 'home', label: 'home', icon: Home, path: '/homepage' },
    { id: 'players', label: 'players', icon: User, path: '/players' },
    { id: 'teams', label: 'teams', icon: Slack, path: '/teams' },
    { id: 'sports', label: 'sports', icon: Dribbble, path: '/sports' },
    { id: 'following', label: 'following', icon: Heart, path: '/following' },
    { id: 'predict', label: 'predict', icon: Edit, path: '/predict' },
  ];

  return (
    <section style={styles.menuBar}>
      <div style={styles.column}>
        <div style={styles.center}>
          <img src={NowILLogo} alt='NowIL_Logo' style={styles.logo} />
        </div>
        
        {menuItems.map((item) => {
          const Icon = item.icon;
          const [isHovered, setIsHovered] = useState(false);

          return (
            <Link 
              key={item.id}
              to={item.path}
              style={{ textDecoration: 'none' }}
              onClick={() => setActiveItem(item.id)}
            >
              <div 
                style={{
                  ...styles.row,
                  backgroundColor: isHovered ? '#0a4620' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <Icon style={styles.icon} />
                <p style={styles.label}>{item.label}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

function App() {
  return (
    <Router>
      <main style={styles.appRow}>
        <Sidebar />
        <div style={styles.routeContainer}>
          <Routes>
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/guest" element={<Guest />} />
            <Route path="/" element={<LP />} />
            <Route path="/sports" element={<SportsPage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/sports/:sportSlug" element={<SpecificSport />} />
            <Route path="/players" element={<PlayersPage />} />
            <Route path="/players/trending" element={<TrendingPlayersPage />} />
            <Route path="/teams/:teamSlug" element={<UniTeamsTracked />} />
            <Route path="/teams/all" element={<AllTeamsPage />} />
            <Route path="/teams/all/:slug" element={<UniTeamsTracked />} />
            <Route path="/following" element={<div style={{ padding: '32px' }}><h1>Following Page</h1></div>} />
            <Route path="/predict" element={<div style={{ padding: '32px' }}><h1>Predict Page</h1></div>} />
            <Route path="/players/tracked" element={<AllPlayersPage />} />
            <Route path="/players/:playerId" element={<PlayerCardPage />} />
          </Routes>
        </div>
      </main>
    </Router>
  );
}

export default App;

// Styles matching your original design
const styles = {
  appRow: {
    display: 'flex',
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
  },
  menuBar: {
    backgroundColor: '#0F5A2B',
    borderRight: '1px solid #e5e7eb',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    minHeight: '100vh',
    minWidth: '200px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '24px',
  },
  logo: {
    height: '48px',
    objectFit: 'contain',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '8px',
    color: '#ffffff',
  },
  icon: {
    width: '24px',
    height: '24px',
    strokeWidth: 2,
    color: '#ffffff',
  },
  label: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 500,
    textTransform: 'capitalize',
    color: '#ffffff',
  },
  routeContainer: {
    flex: 1,
    overflowY: 'auto',
  },
};