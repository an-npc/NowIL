import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AllPlayersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const allPlayers = [
    { rank: 1, name: 'Arch Manning', college: 'UT Austin', sport: 'Football', pos: 'QB', nilValue: '$5.4M', nilChange: '-21%' },
    { rank: 2, name: 'AJ Dybantsa', college: 'BYU', sport: 'Basketball', pos: 'SF', nilValue: '$4.2M', nilChange: '-5%' },
    { rank: 3, name: 'Jeremiah Smith', college: 'Ohio State', sport: 'Football', pos: 'WR', nilValue: '$4.2M', nilChange: '0%' },
    { rank: 4, name: 'Garrett Nussmeier', college: 'LSU', sport: 'Football', pos: 'QB', nilValue: '$4.0M', nilChange: '+6.7%' },
    { rank: 5, name: 'Brendan Sorsby', college: 'Texas A&M', sport: 'Football', pos: 'QB', nilValue: '$3.1M', nilChange: '+29%' },
    { rank: 6, name: 'Ryan Williams', college: 'UA', sport: 'Football', pos: 'WR', nilValue: '$2.0M', nilChange: '-20%' },
    { rank: 7, name: 'Travis Hunter', college: 'CU', sport: 'Football', pos: 'CB', nilValue: '$2.5M', nilChange: '+8%' },
    { rank: 8, name: 'Will Anderson', college: 'Alabama', sport: 'Football', pos: 'DE', nilValue: '$2.6M', nilChange: '-3%' },
    { rank: 9, name: 'Jalen Hurts', college: 'Oklahoma', sport: 'Football', pos: 'QB', nilValue: '$3.1M', nilChange: '+18%' },
    { rank: 10, name: 'Quentin Johnston', college: 'TCU', sport: 'Football', pos: 'WR', nilValue: '$1.8M', nilChange: '+6%' },
    { rank: 11, name: 'Shedeur Sanders', college: 'Colorado', sport: 'Football', pos: 'QB', nilValue: '$3.5M', nilChange: '+12%' },
    { rank: 12, name: 'Jaylen Daniels', college: 'Arizona State', sport: 'Football', pos: 'QB', nilValue: '$2.8M', nilChange: '-8%' },
    { rank: 13, name: 'Tyler Warren', college: 'Penn State', sport: 'Football', pos: 'TE', nilValue: '$2.3M', nilChange: '+5%' },
    { rank: 14, name: 'Malachi Nelson', college: 'Oklahoma', sport: 'Football', pos: 'QB', nilValue: '$2.1M', nilChange: '+11%' },
    { rank: 15, name: 'Jaxon Smith-Njigba', college: 'Oregon', sport: 'Football', pos: 'WR', nilValue: '$3.8M', nilChange: '-15%' },
    { rank: 16, name: 'Kyle McCord', college: 'Ohio State', sport: 'Football', pos: 'QB', nilValue: '$2.4M', nilChange: '+2%' },
    { rank: 17, name: 'Donovan Edwards', college: 'Michigan', sport: 'Football', pos: 'RB', nilValue: '$1.9M', nilChange: '-4%' },
    { rank: 18, name: 'Marvin Harrison Jr', college: 'Ohio State', sport: 'Football', pos: 'WR', nilValue: '$4.1M', nilChange: '+14%' },
    { rank: 19, name: 'Brayson Ritchey', college: 'Houston', sport: 'Football', pos: 'QB', nilValue: '$1.7M', nilChange: '+3%' },
    { rank: 20, name: 'Caleb Williams', college: 'Oklahoma', sport: 'Football', pos: 'QB', nilValue: '$5.1M', nilChange: '+22%' },
    { rank: 21, name: 'Jordan Travis', college: 'Florida State', sport: 'Football', pos: 'RB', nilValue: '$2.2M', nilChange: '-6%' },
    { rank: 22, name: 'Will Levis', college: 'Tennessee', sport: 'Football', pos: 'QB', nilValue: '$3.3M', nilChange: '+9%' },
    { rank: 23, name: 'Anthony Richardson', college: 'Florida', sport: 'Football', pos: 'QB', nilValue: '$3.7M', nilChange: '+19%' },
    { rank: 24, name: 'Bryce Young', college: 'Alabama', sport: 'Football', pos: 'QB', nilValue: '$4.5M', nilChange: '-11%' },
    { rank: 25, name: 'C.J. Stroud', college: 'Ohio State', sport: 'Football', pos: 'QB', nilValue: '$4.8M', nilChange: '+25%' },
    { rank: 26, name: 'Treylon Burks', college: 'Arkansas', sport: 'Football', pos: 'WR', nilValue: '$2.6M', nilChange: '+7%' },
    { rank: 27, name: 'Alec Pierce', college: 'Cincinnati', sport: 'Football', pos: 'WR', nilValue: '$1.8M', nilChange: '-1%' },
    { rank: 28, name: 'Daxton Hill', college: 'Michigan', sport: 'Football', pos: 'S', nilValue: '$2.9M', nilChange: '+13%' },
    { rank: 29, name: 'Devon Witherspoon', college: 'Texas', sport: 'Football', pos: 'CB', nilValue: '$2.7M', nilChange: '+4%' },
    { rank: 30, name: 'Jordan Addison', college: 'Pitt', sport: 'Football', pos: 'WR', nilValue: '$3.2M', nilChange: '+17%' },
    { rank: 31, name: 'Luke Altman', college: 'Texas', sport: 'Football', pos: 'TE', nilValue: '$1.5M', nilChange: '-2%' },
    { rank: 32, name: 'Ty Gibbs', college: 'Alabama', sport: 'Football', pos: 'RB', nilValue: '$2.2M', nilChange: '+12%' },
    { rank: 33, name: 'Brent Favre', college: 'Ole Miss', sport: 'Football', pos: 'QB', nilValue: '$1.9M', nilChange: '-5%' },
    { rank: 34, name: 'Mike Johnson', college: 'State University', sport: 'Baseball', pos: 'Pitcher', nilValue: '$600K', nilChange: '+200K' },
    { rank: 35, name: 'Jane Smith', college: 'College of Somewhere', sport: 'Football', pos: 'Quarterback', nilValue: '$800K', nilChange: '+300K' },
  ];

  // Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPlayers = allPlayers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(allPlayers.length / itemsPerPage);

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
        {/* Header */}
        <h1 className="text-5xl font-bold text-gray-900 mb-8">All Tracked Players</h1>

        {/* Table */}
        <div className="bg-white border-2 border-gray-300 rounded-2xl overflow-hidden mb-8">
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
                <th className="px-6 py-4 text-left font-bold text-gray-900">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {currentPlayers.map((player) => (
                <tr key={player.rank} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-gray-900">{player.rank}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{player.name}</td>
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
                  <td className="px-6 py-4">
                    <button
                      onClick={() => navigate(`/players/${player.rank}`)}
                      className="text-blue-600 font-bold hover:text-blue-800 hover:underline"
                    >
                      View Stats →
                    </button>
                  </td>
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
            disabled={currentPage === totalPages}
            className="text-4xl hover:text-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}