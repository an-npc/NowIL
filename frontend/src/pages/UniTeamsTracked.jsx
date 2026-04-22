import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Main University Teams Tracked Page Component
export default function UniTeamsTracked() {
  const navigate = useNavigate();
  const { teamSlug } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Team data mapped by slug
  const teamDataMap = {
    lsu: {
      name: 'Louisiana State University',
      short: 'LSU',
      totalNilValue: '$365M',
      totalNilChange: '+40%',
      totalPlayersTracked: 232,
      teams: [
        { rank: 1, teamName: 'Football', sport: 'Football', coach: 'Brian Kelly', nilValue: '$185M', nilChange: '+45%', playersTracked: 45 },
        { rank: 2, teamName: 'Basketball (M)', sport: 'Basketball', coach: 'Matt McMahon', nilValue: '$65M', nilChange: '+12%', playersTracked: 18 },
        { rank: 3, teamName: 'Basketball (W)', sport: 'Basketball', coach: 'Kim Mulkey', nilValue: '$78M', nilChange: '+28%', playersTracked: 16 },
        { rank: 4, teamName: 'Baseball', sport: 'Baseball', coach: 'Jay Johnson', nilValue: '$42M', nilChange: '-5%', playersTracked: 32 },
        { rank: 5, teamName: 'Softball', sport: 'Softball', coach: 'Tonya Gipson', nilValue: '$38M', nilChange: '+8%', playersTracked: 24 },
        { rank: 6, teamName: 'Volleyball', sport: 'Volleyball', coach: 'Fran Flory', nilValue: '$22M', nilChange: '+3%', playersTracked: 14 },
        { rank: 7, teamName: 'Tennis (M)', sport: 'Tennis', coach: 'Andy Brandi', nilValue: '$18M', nilChange: '0%', playersTracked: 10 },
        { rank: 8, teamName: 'Tennis (W)', sport: 'Tennis', coach: 'Michael Sell', nilValue: '$16M', nilChange: '+2%', playersTracked: 9 },
        { rank: 9, teamName: 'Soccer (M)', sport: 'Soccer', coach: 'Nico Investigator', nilValue: '$14M', nilChange: '+1%', playersTracked: 11 },
        { rank: 10, teamName: 'Soccer (W)', sport: 'Soccer', coach: 'Sian Hudson', nilValue: '$19M', nilChange: '+5%', playersTracked: 13 },
        { rank: 11, teamName: 'Cross Country', sport: 'Cross Country', coach: 'Renato Canova', nilValue: '$12M', nilChange: '+6%', playersTracked: 8 },
        { rank: 12, teamName: 'Track & Field', sport: 'Track & Field', coach: 'Dennis Shaver', nilValue: '$28M', nilChange: '+15%', playersTracked: 22 },
        { rank: 13, teamName: 'Golf (M)', sport: 'Golf', coach: 'Chuck Winstead', nilValue: '$8M', nilChange: '+1%', playersTracked: 6 },
        { rank: 14, teamName: 'Golf (W)', sport: 'Golf', coach: 'Garrett Runion', nilValue: '$9M', nilChange: '+2%', playersTracked: 5 },
        { rank: 15, teamName: 'Gymnastics', sport: 'Gymnastics', coach: 'D-Wan Sims', nilValue: '$15M', nilChange: '+10%', playersTracked: 10 },
        { rank: 16, teamName: 'Swimming & Diving (M)', sport: 'Swimming', coach: 'Dave Geyer', nilValue: '$11M', nilChange: '+4%', playersTracked: 8 },
        { rank: 17, teamName: 'Swimming & Diving (W)', sport: 'Swimming', coach: 'Rick Bishop', nilValue: '$10M', nilChange: '+3%', playersTracked: 7 },
      ]
    },
    alabama: {
      name: 'University of Alabama',
      short: 'Alabama',
      totalNilValue: '$330M',
      totalNilChange: '-99.9%',
      totalPlayersTracked: 198,
      teams: [
        { rank: 1, teamName: 'Football', sport: 'Football', coach: 'Kalen DeBoer', nilValue: '$180M', nilChange: '-50%', playersTracked: 42 },
        { rank: 2, teamName: 'Basketball (M)', sport: 'Basketball', coach: 'Nate Oats', nilValue: '$60M', nilChange: '+8%', playersTracked: 16 },
        { rank: 3, teamName: 'Basketball (W)', sport: 'Basketball', coach: 'Kristy Curry', nilValue: '$70M', nilChange: '+35%', playersTracked: 15 },
        { rank: 4, teamName: 'Baseball', sport: 'Baseball', coach: 'Rob Vaughn', nilValue: '$40M', nilChange: '-3%', playersTracked: 28 },
        { rank: 5, teamName: 'Gymnastics', sport: 'Gymnastics', coach: 'Dana Duckworth', nilValue: '$20M', nilChange: '+12%', playersTracked: 14 },
      ]
    },
    vanderbilt: {
      name: 'Vanderbilt University',
      short: 'Vanderbilt',
      totalNilValue: '$126M',
      totalNilChange: '-3.5%',
      totalPlayersTracked: 145,
      teams: [
        { rank: 1, teamName: 'Football', sport: 'Football', coach: 'Clark Lea', nilValue: '$75M', nilChange: '-2%', playersTracked: 35 },
        { rank: 2, teamName: 'Basketball (M)', sport: 'Basketball', coach: 'Mark Byington', nilValue: '$30M', nilChange: '+5%', playersTracked: 12 },
        { rank: 3, teamName: 'Basketball (W)', sport: 'Basketball', coach: 'Stephanie White', nilValue: '$21M', nilChange: '+8%', playersTracked: 11 },
      ]
    },
    'ole-miss': {
      name: 'University of Mississippi',
      short: 'Ole Miss',
      totalNilValue: '$285M',
      totalNilChange: '+15%',
      totalPlayersTracked: 210,
      teams: [
        { rank: 1, teamName: 'Football', sport: 'Football', coach: 'Lane Kiffin', nilValue: '$165M', nilChange: '+20%', playersTracked: 48 },
        { rank: 2, teamName: 'Basketball (M)', sport: 'Basketball', coach: 'Chris Beard', nilValue: '$55M', nilChange: '+10%', playersTracked: 16 },
        { rank: 3, teamName: 'Baseball', sport: 'Baseball', coach: 'Mike Bianco', nilValue: '$45M', nilChange: '+8%', playersTracked: 30 },
      ]
    },
    florida: {
      name: 'University of Florida',
      short: 'Florida',
      totalNilValue: '$420M',
      totalNilChange: '+55%',
      totalPlayersTracked: 256,
      teams: [
        { rank: 1, teamName: 'Football', sport: 'Football', coach: 'Todd Golden', nilValue: '$210M', nilChange: '+60%', playersTracked: 50 },
        { rank: 2, teamName: 'Basketball (M)', sport: 'Basketball', coach: 'Todd Golden', nilValue: '$85M', nilChange: '+45%', playersTracked: 20 },
        { rank: 3, teamName: 'Basketball (W)', sport: 'Basketball', coach: 'Kelly Rae Finley', nilValue: '$75M', nilChange: '+50%', playersTracked: 18 },
        { rank: 4, teamName: 'Softball', sport: 'Softball', coach: 'Tim Walton', nilValue: '$50M', nilChange: '+40%', playersTracked: 22 },
      ]
    }
  };

  // Get team data from slug, default to LSU if not found
  const teamData = teamDataMap[teamSlug] || teamDataMap['lsu'];
  const lsuTeams = teamData.teams;
  const universityName = teamData.name;
  const universityShort = teamData.short;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTeams = lsuTeams.slice(startIndex, endIndex);
  const totalPages = Math.ceil(lsuTeams.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8">
        {/* Breadcrumb Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate('/teams')}
              className="text-lg font-bold text-blue-600 hover:text-blue-800"
            >
              Teams
            </button>
            <span className="text-2xl font-bold text-gray-400">&gt;</span>
            <h1 className="text-4xl font-bold text-gray-900">{universityShort}</h1>
          </div>
        </div>

        {/* University Info Card */}
        <div className="bg-white border-2 border-gray-300 rounded-2xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{universityName}</h2>
          <p className="text-gray-600 mb-4">Total Teams Tracked: <span className="font-bold text-blue-600">{lsuTeams.length}</span></p>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-gray-600 text-sm">Total NIL Value</p>
              <p className="text-2xl font-bold text-green-600">{teamData.totalNilValue}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Players Tracked</p>
              <p className="text-2xl font-bold text-blue-600">{teamData.totalPlayersTracked}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Overall NIL Change</p>
              <p className={`text-2xl font-bold ${teamData.totalNilChange.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {teamData.totalNilChange}
              </p>
            </div>
          </div>
        </div>

        {/* Teams Table */}
        <div className="bg-white border-2 border-gray-300 rounded-2xl overflow-hidden mb-8">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className="px-6 py-4 text-left font-bold text-gray-900">#</th>
                <th className="px-6 py-4 text-left font-bold text-gray-900">TEAM NAME</th>
                <th className="px-6 py-4 text-left font-bold text-gray-900">SPORT</th>
                <th className="px-6 py-4 text-left font-bold text-gray-900">COACH</th>
                <th className="px-6 py-4 text-left font-bold text-gray-900">NIL VALUE</th>
                <th className="px-6 py-4 text-left font-bold text-gray-900">NIL CHANGE</th>
                <th className="px-6 py-4 text-left font-bold text-gray-900">PLAYERS TRACKED</th>
              </tr>
            </thead>
            <tbody>
              {currentTeams.map((team) => (
                <tr key={team.rank} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-gray-900">{team.rank}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{team.teamName}</td>
                  <td className="px-6 py-4 text-gray-600">{team.sport}</td>
                  <td className="px-6 py-4 text-gray-600">{team.coach}</td>
                  <td className="px-6 py-4 font-bold text-green-600">{team.nilValue}</td>
                  <td className={`px-6 py-4 font-bold ${team.nilChange.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {team.nilChange}
                  </td>
                  <td className="px-6 py-4 font-bold text-blue-600">{team.playersTracked}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="text-4xl hover:text-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ←
          </button>

          <div className="flex gap-2 items-center">
            <span className="text-gray-700 font-bold">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => {
                    setCurrentPage(page);
                    window.scrollTo(0, 0);
                  }}
                  className={`px-3 py-2 rounded font-bold transition ${
                    currentPage === page
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="text-4xl hover:text-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}