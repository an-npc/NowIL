import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function SportsDetailPage() {
  const { sportSlug } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Sport data mapped by slug
  const sportDataMap = {
    football: {
      name: 'Football',
      topPlayer: {
        name: 'Arch Manning',
        college: 'UT Austin',
        position: 'QB',
        nilValue: '$5.4M',
        photo: null,
      },
      topTeam: {
        name: 'Alabama',
        logo: '🏈',
        color: '#9D0C38',
      },
      totalNilValue: '$200M',
      trendingPlayers: [
        { rank: 1, name: 'Arch Manning', college: 'UT Austin', sport: 'Football', pos: 'QB', nilValue: '$5.4M', nilChange: '-21%' },
        { rank: 2, name: 'AJ Dybantsa', college: 'BYU', sport: 'Basketball', pos: 'SF', nilValue: '$4.2M', nilChange: '-5%' },
        { rank: 3, name: 'Jeremiah Smith', college: 'Ohio State', sport: 'Football', pos: 'WR', nilValue: '$4.2M', nilChange: '0%' },
        { rank: 4, name: 'Garrett Nussmeier', college: 'LSU', sport: 'Football', pos: 'QB', nilValue: '$4.0M', nilChange: '+6.7%' },
        { rank: 5, name: 'Brendan Sorsby', college: 'Texas A&M', sport: 'Football', pos: 'QB', nilValue: '$3.1M', nilChange: '+29%' },
      ]
    },
    basketball: {
      name: 'Basketball',
      topPlayer: {
        name: 'AJ Dybantsa',
        college: 'BYU',
        position: 'SF',
        nilValue: '$4.2M',
        photo: null,
      },
      topTeam: {
        name: 'Duke',
        logo: '🏀',
        color: '#003366',
      },
      totalNilValue: '$150M',
      trendingPlayers: [
        { rank: 1, name: 'AJ Dybantsa', college: 'BYU', sport: 'Basketball', pos: 'SF', nilValue: '$4.2M', nilChange: '-5%' },
        { rank: 2, name: 'Player 2', college: 'College 2', sport: 'Basketball', pos: 'PG', nilValue: '$3.8M', nilChange: '+10%' },
        { rank: 3, name: 'Player 3', college: 'College 3', sport: 'Basketball', pos: 'C', nilValue: '$3.5M', nilChange: '+5%' },
        { rank: 4, name: 'Player 4', college: 'College 4', sport: 'Basketball', pos: 'SG', nilValue: '$3.2M', nilChange: '-2%' },
        { rank: 5, name: 'Player 5', college: 'College 5', sport: 'Basketball', pos: 'SF', nilValue: '$2.9M', nilChange: '+8%' },
      ]
    },
    baseball: {
      name: 'Baseball',
      topPlayer: {
        name: 'Player Name',
        college: 'College',
        position: 'SS',
        nilValue: '$2.1M',
        photo: null,
      },
      topTeam: {
        name: 'LSU',
        logo: '⚾',
        color: '#461D7C',
      },
      totalNilValue: '$120M',
      trendingPlayers: [
        { rank: 1, name: 'Top Player', college: 'College', sport: 'Baseball', pos: 'SS', nilValue: '$2.1M', nilChange: '+15%' },
        { rank: 2, name: 'Player 2', college: 'College 2', sport: 'Baseball', pos: 'OF', nilValue: '$1.9M', nilChange: '+8%' },
        { rank: 3, name: 'Player 3', college: 'College 3', sport: 'Baseball', pos: 'C', nilValue: '$1.7M', nilChange: '+12%' },
        { rank: 4, name: 'Player 4', college: 'College 4', sport: 'Baseball', pos: '1B', nilValue: '$1.5M', nilChange: '-3%' },
        { rank: 5, name: 'Player 5', college: 'College 5', sport: 'Baseball', pos: 'P', nilValue: '$1.3M', nilChange: '+6%' },
      ]
    },
  };

  const sportData = sportDataMap[sportSlug] || sportDataMap['football'];

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-8">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/sports')}
              className="text-2xl font-bold text-blue-500 hover:text-blue-600"
            >
              Sports
            </button>
            <span className="text-2xl font-bold text-gray-900">&gt;</span>
            <h1 className="text-4xl font-bold text-gray-900">{sportData.name}</h1>
          </div>
          <div className="relative w-96">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Try searching for your favorite sport..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2 border-2 border-gray-300 rounded-full focus:outline-none focus:border-gray-400 bg-white"
            />
          </div>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Top Player Card */}
          <div className="bg-white border-2 border-gray-300 rounded-2xl p-6">
            <div
              className="h-3 rounded-t-xl mb-4"
              style={{ backgroundColor: '#5a3fa8', marginLeft: '-24px', marginRight: '-24px', marginTop: '-24px', marginBottom: '16px' }}
            ></div>
            <h3 className="text-lg font-bold text-center mb-4">Top Player</h3>
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 bg-gray-300 rounded-lg flex items-center justify-center text-5xl mb-4">
                👤
              </div>
              <p className="font-bold text-center text-gray-900">{sportData.topPlayer.name}</p>
              <p className="text-sm text-gray-600 text-center">{sportData.topPlayer.college}</p>
            </div>
          </div>

          {/* Top Team Card */}
          <div className="bg-white border-2 border-gray-300 rounded-2xl p-6">
            <div
              className="h-3 rounded-t-xl mb-4"
              style={{ backgroundColor: '#8B3A3A', marginLeft: '-24px', marginRight: '-24px', marginTop: '-24px', marginBottom: '16px' }}
            ></div>
            <h3 className="text-lg font-bold text-center mb-4">Top Team:</h3>
            <div className="flex flex-col items-center">
              <div
                className="w-32 h-32 rounded-lg flex items-center justify-center text-5xl mb-4"
                style={{ backgroundColor: sportData.topTeam.color }}
              >
                {sportData.topTeam.logo}
              </div>
              <p className="font-bold text-center text-gray-900">{sportData.topTeam.name}</p>
            </div>
          </div>

          {/* Total NIL Value Card */}
          <div className="bg-white border-2 border-gray-300 rounded-2xl p-6">
            <div
              className="h-3 rounded-t-xl mb-4"
              style={{ backgroundColor: '#16a34a', marginLeft: '-24px', marginRight: '-24px', marginTop: '-24px', marginBottom: '16px' }}
            ></div>
            <h3 className="text-lg font-bold text-center mb-4">Total NIL Value:</h3>
            <div className="flex items-center justify-center">
              <p className="text-5xl font-bold text-gray-900 text-center">{sportData.totalNilValue}</p>
            </div>
          </div>
        </div>

        {/* Trending Players Table */}
        <div className="bg-white border-2 border-gray-300 rounded-2xl overflow-hidden">
          <div className="flex justify-between items-center px-6 py-4 border-b-2 border-gray-300 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-900">Trending Players - 2026 Season</h2>
            <button className="text-lg font-bold text-gray-900 hover:text-blue-600">View All →</button>
          </div>

          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-300">
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
              {sportData.trendingPlayers.map((player) => (
                <tr key={player.rank} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-gray-900">{player.rank}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{player.name}</td>
                  <td className="px-6 py-4 text-gray-600">{player.college}</td>
                  <td className="px-6 py-4 text-gray-600">{player.sport}</td>
                  <td className="px-6 py-4 text-gray-600">{player.pos}</td>
                  <td className="px-6 py-4 font-bold text-green-600">{player.nilValue}</td>
                  <td className={`px-6 py-4 font-bold ${player.nilChange.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
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
  );
}