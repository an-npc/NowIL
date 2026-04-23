import { useState } from 'react';
import NowILLogo from './assets/Logo.svg';
import './App.css';
import { Home, User, Slack, Dribbble, Heart, Edit, Search } from 'react-feather';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Homepage from './pages/homepage';
import Index from './pages/Index';
import Guest from './pages/myguest';
import Predict from './pages/predict';
import Following from './pages/following';
import PlayersPage from './pages/players';
import SportsPage from './pages/sportspage';
import TeamsPage from './pages/teams';
import TrendingPlayersPage from './pages/trendingplayer';

let data = [
  {
    id: 1,
    rank: 1,
    athlete: 'John Doe',
    college: 'University of Nowhere',
    sport: 'Basketball',
    position: 'Guard',
    nilValue: '$1M',
    nilChange: '+$500K',
    following: true
  },
  {
    id: 2,
    rank: 2,
    athlete: 'Jane Smith',
    college: 'College of Somewhere',
    sport: 'Football',
    position: 'Quarterback',
    nilValue: '$800K',
    nilChange: '+$300K',
    following: false
  },
  {
    id: 3,
    rank: 3,
    athlete: 'Mike Johnson',
    college: 'State University',
    sport: 'Baseball',
    position: 'Pitcher',
    nilValue: '$600K',
    nilChange: '+$200K',
    following: true
  }
];

// acts as Map in my dev-port-iii

function App() {
  return (


    <Router>
      <main className='app-row'>
        <section className='menu-bar'>
          <div className='column'>
            <div className='center'><img src={NowILLogo} alt='NowIL_Logo' className='logo' /></div>
            <Link to="/">
              <div className='row'><Home /><p>home</p>
              </div>
            </Link>
            <Link to="/players">
              <div className='row'>
                <User /> <p>players</p>
              </div>
            </Link>
            <div className='row'><Slack /> <p>teams</p></div>
            <div className='row'><Dribbble /> <p>sports</p></div>
            <Link to='/following'>
              <div className='row'>
                <Heart /><p>following</p>
              </div>
            </Link>
            <Link to="/predict">
              <div className='row'>
                <Edit /> <p>predict</p>
              </div>
            </Link>
          </div>
        </section>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/guest" element={<Guest />} />
          <Route path="/predict" element={<Predict />} />
          <Route path="/following" element={<Following />} />
          <Route path="/players" element={<TrendingPlayersPage  />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App;