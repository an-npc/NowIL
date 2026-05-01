import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Baseball from '../assets/baseball.svg';
import Basketball from '../assets/basketball.svg';
import Football from '../assets/football.svg';
import Golf from '../assets/golf.svg';
import Soccer from '../assets/soccer.svg';
import Swimming from '../assets/swimming.svg';
import Tennis from '../assets/tennis.svg';
import Volleyball from '../assets/volleyball.svg';

// Sport Card Component
const SportCard = ({ icon, name, players, teams, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="rounded-xl p-6 text-white transition-all cursor-pointer"
      style={{
        backgroundColor: isHovered ? '#1b4332' : '#2d8659',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="flex justify-center mb-4"><img src={icon} alt={name} style={{ width: '50px', height: '50px', filter: 'brightness(0) invert(1)' }} /></div>
      <h3 className="font-bold text-sm text-center mb-3">{name}</h3>
      <div className="flex justify-center gap-3 text-xs" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
        <span>{players} players</span>
        <span>·</span>
        <span>{teams} teams</span>
      </div>
    </div>
  );
};

// Growth Card Component
const GrowthCard = ({ icon, name, growth, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="rounded-xl p-6 text-white transition-all cursor-pointer"
      style={{
        backgroundColor: isHovered ? '#1b4332' : '#2d8659',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="flex justify-center mb-3"><img src={icon} alt={name} style={{ width: '50px', height: '50px', filter: 'brightness(0) invert(1)' }} /></div>
      <h3 className="font-bold text-sm text-center mb-4">{name}</h3>
      <div className="flex justify-center items-center gap-2 text-lg font-bold pt-3" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.3)' }}>
        <span>↑</span>
        <span>{growth}%</span>
      </div>
    </div>
  );
};

// Main Sports Page Component
export default function SportsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const allSports = [
    { name: 'GYMNASTICS', players: 40, teams: 8, icon: Swimming },
    { name: 'BASEBALL', players: 80, teams: 12, icon: Baseball },
    { name: 'VOLLEYBALL', players: 20, teams: 3, icon: Volleyball },
    { name: 'FOOTBALL', players: 197, teams: 16, icon: Football },
    { name: 'BASKETBALL', players: 164, teams: 12, icon: Basketball },
    { name: 'TENNIS', players: 15, teams: 3, icon: Tennis },
    { name: 'SOCCER', players: 27, teams: 8, icon: Soccer },
    { name: 'GOLF', players: 12, teams: 6, icon: Golf },
  ];

  const fastestGrowing = [
    { name: 'FOOTBALL', growth: 50, icon: Football },
    { name: 'BASEBALL', growth: 42, icon: Baseball },
    { name: 'BASKETBALL', growth: 35, icon: Basketball },
    { name: 'GYMNASTICS', growth: 26, icon: Swimming },
    { name: 'GOLF', growth: 26, icon: Golf },
  ];

  const handleSportClick = (sportName) => {
    if (sportName === 'FOOTBALL') {
      navigate('/sports/football');
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="pt-4 px-8 pb-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-5xl font-bold text-gray-900">Sports</h1>
          <div className="relative w-96">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Try searching for your favorite player..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2 border-2 border-gray-300 rounded-full focus:outline-none focus:border-gray-400 bg-white"
            />
          </div>
        </div>

        {/* All Sports Section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">All Sports</h2>
          <div className="rounded-3xl p-8" style={{ backgroundColor: '#0f5a2b' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {allSports.map((sport, index) => (
                <SportCard
                  key={index}
                  icon={sport.icon}
                  name={sport.name}
                  players={sport.players}
                  teams={sport.teams}
                  onClick={() => handleSportClick(sport.name)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Fastest Growing Sports Section */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Fastest Growing Sports</h2>
          <div className="rounded-3xl p-8" style={{ backgroundColor: '#0f5a2b' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {fastestGrowing.map((sport, index) => (
                <GrowthCard
                  key={index}
                  icon={sport.icon}
                  name={sport.name}
                  growth={sport.growth}
                  onClick={() => handleSportClick(sport.name)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}