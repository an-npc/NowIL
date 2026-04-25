import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import alabamaLogo from '../assets/ua-logo.png';
import vanderbiltLogo from '../assets/v-logo.png';
import lsuLogo from '../assets/lsu-logo.png';
import olemissLogo from '../assets/olemiss.png';
import floridaLogo from '../assets/uf-logo.png';

// Heart Icon Component
const Heart = ({ isLiked, size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={isLiked ? "#dc2626" : "none"}
    stroke={isLiked ? "#dc2626" : "#999"}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

// Search Icon Component
const SearchIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

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
          className="float-right mb-3"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Heart isLiked={isLiked} size={24} />
        </button>
        <div className="clear-both"></div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 border-t border-gray-200 pt-3 flex-1">
          <div>
            <p className="text-gray-600 text-xs">Total NIL Value:</p>
            <p className="font-bold text-sm" style={{ color: '#1db954' }}>{nilValue}</p>
          </div>
          <div>
            <p className="text-gray-600 text-xs">Total NIL Change:</p>
            <p className={`font-bold text-sm`} style={{ color: nilChange.startsWith('+') ? '#1db954' : '#dc2626' }}>
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

  const CARD_WIDTH = 350;
  const CARD_GAP = 24;
  const CARDS_VISIBLE = 3;

  const scroll = (direction) => {
    if (direction === 'left') {
      setCurrentIndex(Math.max(0, currentIndex - 1));
    } else {
      setCurrentIndex(Math.min(teams.length - CARDS_VISIBLE, currentIndex + 1));
    }
  };

  const viewportWidth = CARD_WIDTH * CARDS_VISIBLE + CARD_GAP * (CARDS_VISIBLE - 1);
  const trackOffset = currentIndex * (CARD_WIDTH + CARD_GAP);

  const handleTeamClick = (slug) => {
    navigate(`/teams/${slug}`);
  };

  // Show 3 cards at a time
  const visibleTeams = teams.slice(currentIndex, currentIndex + 3);

  return (
    <div className="flex-1 overflow-auto">
      <div className="pt-4 px-8 pb-8 h-full flex flex-col">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8 gap-8">
          <h1 className="text-5xl font-bold text-gray-900 flex-shrink-0">Teams</h1>
          <div className="relative flex-1 max-w-96">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 flex items-center justify-center" style={{ width: '20px', height: '20px' }}>
              <SearchIcon size={20} />
            </span>
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
          <div className="flex items-center justify-between gap-6 mb-8">
            {/* Left Arrow */}
            <button
              onClick={() => scroll('left')}
              disabled={currentIndex === 0}
              className="text-5xl hover:text-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              ←
            </button>

            {/* Carousel Viewport */}
            <div
              style={{
                width: `${viewportWidth}px`,
                height: '550px',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              {/* Sliding Track — all cards rendered, shifted via translateX */}
              <div
                style={{
                  display: 'flex',
                  gap: `${CARD_GAP}px`,
                  height: '100%',
                  transform: `translateX(-${trackOffset}px)`,
                  transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  willChange: 'transform',
                }}
              >
                {teams.map((team, index) => (
                  <div
                    key={index}
                    style={{
                      width: `${CARD_WIDTH}px`,
                      height: '100%',
                      flexShrink: 0,
                    }}
                  >
                    <TeamCard
                      name={team.name}
                      location={team.location}
                      logoUrl={team.logoUrl}
                      nilValue={team.nilValue}
                      nilChange={team.nilChange}
                      headerColor={team.headerColor}
                      sports={team.sports}
                      onNameClick={() => handleTeamClick(team.slug)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => scroll('right')}
              disabled={currentIndex >= teams.length - CARDS_VISIBLE}
              className="text-5xl hover:text-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}