import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import alabamaLogo from '../assets/ua-logo.png';
import vanderbiltLogo from '../assets/v-logo.png';
import lsuLogo from '../assets/lsu-logo.png';
import olemissLogo from '../assets/olemiss.png';
import floridaLogo from '../assets/uf-logo.png';

// Team Card Component
const TeamCard = ({ name, location, logoUrl, nilValue, nilChange, sports, headerColor, onNameClick }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="border-2 border-gray-300 rounded-2xl overflow-hidden bg-white flex-shrink-0 h-full flex flex-col">
      {/* Card Header with university color */}
      <div className="h-16" style={{ backgroundColor: headerColor }}></div>
      
      {/* Logo Section */}
      <div className="flex items-center justify-center py-6 px-4 bg-gray-50">
        {!logoError && logoUrl ? (
          <img 
            src={logoUrl} 
            alt="University Logo" 
            className="w-20 h-20 object-contain"
            onError={() => {
              console.error(`Failed to load logo: ${logoUrl}`);
              setLogoError(true);
            }}
          />
        ) : (
          <div className="text-5xl font-bold" style={{ color: headerColor }}>
            {name.charAt(0)}
          </div>
        )}
      </div>

      {/* Team Info */}
      <div className="px-6 pb-4 flex flex-col flex-1">
        <button
          onClick={onNameClick}
          className="font-bold text-center mb-1 text-base text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
        >
          {name}
        </button>
        <p className="text-gray-600 text-xs text-center mb-4">{location}</p>

        {/* Like Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="float-right text-2xl mb-3"
        >
          {isLiked ? '❤️' : '🤍'}
        </button>
        <div className="clear-both"></div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 border-t border-gray-200 pt-3 flex-1">
          <div>
            <p className="text-gray-600 text-xs">Total NIL Value:</p>
            <p className="font-bold text-green-600 text-sm">{nilValue}</p>
          </div>
          <div>
            <p className="text-gray-600 text-xs">Total NIL Change:</p>
            <p className={`font-bold text-sm ${nilChange.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {nilChange}
            </p>
          </div>
        </div>

        {/* Featured Sports */}
        <div className="border-t border-gray-200 pt-3">
          <p className="text-xs font-bold text-gray-800 mb-2">Featured Sports:</p>
          <div className="space-y-1">
            {sports.map((sport, index) => (
              <p key={index} className="text-blue-500 text-xs hover:underline cursor-pointer">
                {sport}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Teams Page Component
export default function TeamsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState('Football');
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const sports = ['Football', 'Basketball', 'Baseball', 'Soccer', 'Golf', 'Volleyball', 'Tennis', 'Gymnastics'];

  const teams = [
    {
      name: 'University of Alabama',
      slug: 'alabama',
      location: 'Tuscaloosa, AL',
      logoUrl: alabamaLogo,
      nilValue: '$330M',
      nilChange: '-99.9%',
      headerColor: '#9D0C38',
      sports: ['Baseball', 'Football', 'Basketball', 'Gymnastics'],
    },
    {
      name: 'Vanderbilt University',
      slug: 'vanderbilt',
      location: 'Nashville, TN',
      logoUrl: vanderbiltLogo,
      nilValue: '$126M',
      nilChange: '-3.5%',
      headerColor: '#111111',
      sports: ['Baseball', 'Football', 'Basketball', 'Gymnastics'],
    },
    {
      name: 'Louisiana State University',
      slug: 'lsu',
      location: 'Baton Rouge, LA',
      logoUrl: lsuLogo,
      nilValue: '$365M',
      nilChange: '+40%',
      headerColor: '#461D7C',
      sports: ['Baseball', 'Football', 'Basketball', 'Gymnastics'],
    },
    {
      name: 'University of Mississippi',
      slug: 'ole-miss',
      location: 'Oxford, MS',
      logoUrl: olemissLogo,
      nilValue: '$285M',
      nilChange: '+15%',
      headerColor: '#003366',
      sports: ['Baseball', 'Football', 'Basketball', 'Gymnastics'],
    },
    {
      name: 'University of Florida',
      slug: 'florida',
      location: 'Gainesville, FL',
      logoUrl: floridaLogo,
      nilValue: '$420M',
      nilChange: '+55%',
      headerColor: '#0A3161',
      sports: ['Baseball', 'Football', 'Basketball', 'Gymnastics'],
    },
  ];

  const scroll = (direction) => {
    if (direction === 'left') {
      setCurrentIndex(Math.max(0, currentIndex - 1));
    } else {
      setCurrentIndex(Math.min(teams.length - 3, currentIndex + 1));
    }
  };

  const handleTeamClick = (slug) => {
    navigate(`/teams/${slug}`);
  };

  // Show 3 cards at a time
  const visibleTeams = teams.slice(currentIndex, currentIndex + 3);

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8 h-full flex flex-col">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-5xl font-bold text-gray-900">Teams</h1>
          <div className="relative w-96">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Try searching for your favorite team..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2 border-2 border-gray-300 rounded-full focus:outline-none focus:border-gray-400 bg-white"
            />
          </div>
        </div>

        {/* Sport Filter Tabs */}
        <div className="mb-8 flex gap-2 flex-wrap">
          {sports.map((sport) => (
            <button
              key={sport}
              onClick={() => setSelectedSport(sport)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedSport === sport
                  ? 'bg-gray-800 text-white'
                  : 'bg-white text-gray-600 border-2 border-gray-300 hover:border-gray-400'
              }`}
            >
              {sport}
            </button>
          ))}
        </div>

        {/* Suggested Teams Section */}
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Suggested Teams:</h2>
            <button
              onClick={() => navigate('/teams/all')}
              className="text-lg font-bold text-blue-600 hover:text-blue-800"
            >
              View All Teams →
            </button>
          </div>

          {/* Cards Container */}
          <div className="flex-1 grid grid-cols-3 gap-6 mb-8">
            {visibleTeams.map((team, index) => (
              <TeamCard
                key={currentIndex + index}
                name={team.name}
                location={team.location}
                logoUrl={team.logoUrl}
                nilValue={team.nilValue}
                nilChange={team.nilChange}
                headerColor={team.headerColor}
                sports={team.sports}
                onNameClick={() => handleTeamClick(team.slug)}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => scroll('left')}
              disabled={currentIndex === 0}
              className="text-5xl hover:text-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ←
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={currentIndex >= teams.length - 3}
              className="text-5xl hover:text-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}