import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Sport Card Component
const SportCard = ({ icon, name, players, teams, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="rounded-xl p-6 text-white transition-all cursor-pointer"
      style={{
        backgroundColor: isHovered ? '#3a8b56' : '#4fa86d',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="text-5xl mb-4 text-center">{icon}</div>
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
        backgroundColor: isHovered ? '#3a8b56' : '#4fa86d',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="text-4xl mb-3 text-center">{icon}</div>
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
    { name: 'GYMNASTICS', players: 40, teams: 8, icon: '🤸' },
    { name: 'BASEBALL', players: 80, teams: 12, icon: '⚾' },
    { name: 'VOLLEYBALL', players: 20, teams: 3, icon: '🏐' },
    { name: 'FOOTBALL', players: 197, teams: 16, icon: '🏈' },
    { name: 'BASKETBALL', players: 164, teams: 12, icon: '🏀' },
    { name: 'TENNIS', players: 15, teams: 3, icon: '🎾' },
    { name: 'SOCCER', players: 27, teams: 8, icon: '⚽' },
    { name: 'GOLF', players: 12, teams: 6, icon: '⛳' },
  ];

  const fastestGrowing = [
    { name: 'FOOTBALL', growth: 50, icon: '🏈' },
    { name: 'BASEBALL', growth: 42, icon: '⚾' },
    { name: 'BASKETBALL', growth: 35, icon: '🏀' },
    { name: 'GYMNASTICS', growth: 26, icon: '🤸' },
    { name: 'GOLF', growth: 26, icon: '⛳' },
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
          <div className="rounded-3xl p-8" style={{ backgroundColor: '#2d8659' }}>
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
          <div className="rounded-3xl p-8" style={{ backgroundColor: '#2d8659' }}>
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