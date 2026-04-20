import { useState } from 'react';
import NowILLogo from './assets/Logo.svg';
import './App.css';
import { Home, User, Slack, Dribbble, Heart, Edit, Search } from 'react-feather';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Homepage from './pages/homepage';
import Index from './pages/Index';
import Guest from './pages/myguest';
import Predict from './pages/predict';

// acts as Map in my dev-port-iii

function App() {
  return (


    <Router>
      <main className='app-row'>
        <section className='menu-bar'>
          <div className='column'>
            <div className='center'><img src={NowILLogo} alt='NowIL_Logo' className='logo' /></div>
            <Link to="/">
              <div className='row'><Home /><p>Home</p>
              </div>
            </Link>
            <Link to="/guest">
              <div className='row'>
                <User /> <p>Players</p>
              </div>
            </Link>
            <div className='row'><Slack /> <p>Teams</p></div>
            <div className='row'><Dribbble /> <p>Sports</p></div>
            <div className='row'><Heart /> <p>Following</p></div>
            <Link to="/predict">
              <div className='row'><Edit /> <p>Predict</p></div>
            </Link>
          </div>
        </section>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/guest" element={<Guest />} />
          <Route path="/predict" element={<Predict />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App;