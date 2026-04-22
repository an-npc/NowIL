import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Player Card Component
const PlayerCard = ({ name, college, position, number, nilValue, nilChange, photo, rank }) => {
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  function formatNIL(v) {
    if (v >= 1) return `$${v.toFixed(1)}M`;
    return `$${Math.round(v * 1000)}k`;
  }

  const changeColor = nilChange >= 0 ? '#16a34a' : '#dc2626';

  return (
    <div style={styles.playerCard}>
      <div style={styles.playerCardHeader}>
        <button
          onClick={() => navigate(`/players/${rank}`)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: 600,
            flex: 1,
            textAlign: 'left',
          }}
        >
          {name} | {college} | {position} | #{number}
        </button>
        <button
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.3rem' }}
          onClick={() => setIsLiked(!isLiked)}
        >
          {isLiked ? '❤️' : '🤍'}
        </button>
      </div>

      <div style={styles.playerCardImg}>
        {photo ? (
          <img
            src={photo}
            alt={name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: '#d8d8d8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '4rem',
            }}
          >
            👤
          </div>
        )}
      </div>

      <div style={{ padding: '14px 16px' }}>
        <div style={styles.statRow}>
          <span style={{ color: '#666' }}>NIL Value:</span>
          <span style={{ fontWeight: 700 }}>{formatNIL(nilValue)}</span>
        </div>
        <div style={{ ...styles.statRow, borderBottom: 'none' }}>
          <span style={{ color: '#666' }}>NIL Change:</span>
          <span style={{ fontWeight: 700, color: changeColor }}>
            {nilChange >= 0 ? '+' : ''}{nilChange}%
          </span>
        </div>
      </div>
    </div>
  );
};

// Main Players Page Component
export default function PlayersPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSport, setSelectedSport] = useState('Football');
  const navigate = useNavigate();

  const sports = ['Football', 'Basketball', 'Baseball', 'Soccer', 'Golf', 'Volleyball', 'Tennis', 'Gymnastics'];

  const trendingPlayers = [
    { rank: 1, name: 'Garrett Nussmeier', college: 'LSU', position: 'QB', number: 18, nilValue: 3.3, nilChange: -4, photo: null },
    { rank: 2, name: 'Ryan Williams', college: 'UA', position: 'WR', number: 2, nilValue: 2.0, nilChange: -20, photo: null },
    { rank: 3, name: 'Arch Manning', college: 'UT', position: 'QB', number: 16, nilValue: 2.8, nilChange: 15, photo: null },
    { rank: 4, name: 'Travis Hunter', college: 'CU', position: 'CB', number: 12, nilValue: 2.5, nilChange: 8, photo: null },
    { rank: 5, name: 'Brent Favre', college: 'Ole Miss', position: 'QB', number: 5, nilValue: 1.9, nilChange: -5, photo: null },
    { rank: 6, name: 'Ty Gibbs', college: 'Alabama', position: 'RB', number: 7, nilValue: 2.2, nilChange: 12, photo: null },
    { rank: 7, name: 'Will Anderson', college: 'Alabama', position: 'DE', number: 31, nilValue: 2.6, nilChange: -3, photo: null },
    { rank: 8, name: 'Quentin Johnston', college: 'TCU', position: 'WR', number: 1, nilValue: 1.8, nilChange: 6, photo: null },
    { rank: 9, name: 'Luke Altman', college: 'Texas', position: 'TE', number: 11, nilValue: 1.5, nilChange: -2, photo: null },
    { rank: 10, name: 'Jalen Hurts', college: 'Oklahoma', position: 'QB', number: 2, nilValue: 3.1, nilChange: 18, photo: null },
  ];

  const tableData = [
    { rank: 1, name: 'Arch Manning', college: 'UT Austin', sport: 'Football', pos: 'QB', nilValue: '$5.4M', nilChange: '-21%' },
    { rank: 2, name: 'AJ Dybantsa', college: 'BYU', sport: 'Basketball', pos: 'SF', nilValue: '$4.2M', nilChange: '-5%' },
    { rank: 3, name: 'Jeremiah Smith', college: 'Ohio State', sport: 'Football', pos: 'WR', nilValue: '$4.2M', nilChange: '0%' },
    { rank: 4, name: 'Garrett Nussmeier', college: 'LSU', sport: 'Football', pos: 'QB', nilValue: '$4.0M', nilChange: '+6.7%' },
    { rank: 5, name: 'Brendan Sorsby', college: 'Texas A&M', sport: 'Football', pos: 'QB', nilValue: '$3.1M', nilChange: '+29%' },
  ];

  const scroll = (direction) => {
    if (direction === 'left') {
      setCurrentIndex(Math.max(0, currentIndex - 1));
    } else {
      setCurrentIndex(Math.min(trendingPlayers.length - 1, currentIndex + 1));
    }
  };

  const visiblePlayers = trendingPlayers.slice(currentIndex, currentIndex + 2);

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8 flex flex-col h-full">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-5xl font-bold text-gray-900">Players</h1>
          <div className="relative w-96">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Try searching for your favorite player..."
              className="w-full pl-12 pr-4 py-2 border-2 border-gray-300 rounded-full focus:outline-none focus:border-gray-400 bg-white"
            />
          </div>
        </div>

        {/* Sport Filter Tabs */}
        <div className="mb-6 flex gap-2 flex-wrap">
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

        {/* Trending Players Section */}
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Trending Players</h2>
            <button
              onClick={() => navigate('/players/tracked')}
              className="text-lg font-bold text-blue-600 hover:text-blue-800"
            >
              View All Players Tracked →
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

            {/* Player Cards */}
            <div className="flex gap-8 justify-center" style={{ minWidth: '800px' }}>
              {visiblePlayers.map((player, index) => (
                <PlayerCard
                  key={currentIndex + index}
                  rank={player.rank}
                  name={player.name}
                  college={player.college}
                  position={player.position}
                  number={player.number}
                  nilValue={player.nilValue}
                  nilChange={player.nilChange}
                  photo={player.photo}
                />
              ))}
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => scroll('right')}
              disabled={currentIndex >= trendingPlayers.length - 2}
              className="text-5xl hover:text-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              →
            </button>
          </div>
        </div>

        {/* Top Players Table */}
        <div className="mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top Players - 2026 Season</h2>

          <div className="bg-white border-2 border-gray-300 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-300">
                  <th className="px-6 py-4 text-left font-bold text-gray-900">#</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-900">ATHLETE</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-900">COLLEGE</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-900">SPORT</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-900">POS</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-900">NIL VALUE</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-900">NIL CHANGE</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-900">FOLLOW</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((player) => (
                  <tr key={player.rank} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold text-gray-900">{player.rank}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => navigate(`/players/${player.rank}`)}
                        className="font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                      >
                        {player.name}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{player.college}</td>
                    <td className="px-6 py-4 text-gray-600">{player.sport}</td>
                    <td className="px-6 py-4 text-gray-600">{player.pos}</td>
                    <td className="px-6 py-4 font-bold text-green-600">{player.nilValue}</td>
                    <td
                      className={`px-6 py-4 font-bold ${
                        player.nilChange.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {player.nilChange}
                    </td>
                    <td className="px-6 py-4 text-2xl cursor-pointer hover:scale-110 transition">🤍</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Styles
const styles = {
  playerCard: {
    background: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
    width: '360px',
    height: '420px',
    flexShrink: 0,
    overflow: 'hidden',
    border: '1px solid #ddd',
    display: 'flex',
    flexDirection: 'column',
  },
  playerCardHeader: {
    background: '#4a1e8a',
    color: 'white',
    padding: '10px 14px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0,
  },
  playerCardImg: {
    width: '100%',
    height: '280px',
    background: '#d8d8d8',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    flex: 1,
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #eee',
    fontSize: '0.9rem',
  },
};