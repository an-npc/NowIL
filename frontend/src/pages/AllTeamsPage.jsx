import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import alabamaLogo from '../assets/ua-logo.png';
import vanderbiltLogo from '../assets/v-logo.png';
import lsuLogo from '../assets/lsu-logo.png';
import olemissLogo from '../assets/olemiss.png';
import floridaLogo from '../assets/uf-logo.png';

// Main All Teams Page Component
export default function AllTeamsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const itemsPerPage = 10;

  const allUniversities = [
    { id: 1, slug: 'alabama', name: 'University of Alabama', logo: alabamaLogo, playersTracked: 45, teamsTracked: 15 },
    { id: 2, slug: 'vanderbilt', name: 'Vanderbilt University', logo: vanderbiltLogo, playersTracked: 28, teamsTracked: 12 },
    { id: 3, slug: 'lsu', name: 'Louisiana State University', logo: lsuLogo, playersTracked: 52, teamsTracked: 14 },
    { id: 4, slug: 'ole-miss', name: 'University of Mississippi', logo: olemissLogo, playersTracked: 35, teamsTracked: 13 },
    { id: 5, slug: 'florida', name: 'University of Florida', logo: floridaLogo, playersTracked: 61, teamsTracked: 16 },
    { id: 6, slug: 'georgia', name: 'University of Georgia', logo: alabamaLogo, playersTracked: 48, teamsTracked: 14 },
    { id: 7, slug: 'texas-am', name: 'Texas A&M University', logo: vanderbiltLogo, playersTracked: 39, teamsTracked: 12 },
    { id: 8, slug: 'texas', name: 'University of Texas', logo: lsuLogo, playersTracked: 55, teamsTracked: 15 },
    { id: 9, slug: 'oklahoma', name: 'Oklahoma University', logo: olemissLogo, playersTracked: 42, teamsTracked: 13 },
    { id: 10, slug: 'tennessee', name: 'University of Tennessee', logo: floridaLogo, playersTracked: 38, teamsTracked: 11 },
    { id: 11, slug: 'kentucky', name: 'University of Kentucky', logo: alabamaLogo, playersTracked: 31, teamsTracked: 10 },
    { id: 12, slug: 'auburn', name: 'University of Auburn', logo: vanderbiltLogo, playersTracked: 44, teamsTracked: 13 },
    { id: 13, slug: 'south-carolina', name: 'University of South Carolina', logo: lsuLogo, playersTracked: 36, teamsTracked: 11 },
    { id: 14, slug: 'arkansas', name: 'University of Arkansas', logo: olemissLogo, playersTracked: 33, teamsTracked: 12 },
    { id: 15, slug: 'missouri', name: 'University of Missouri', logo: floridaLogo, playersTracked: 29, teamsTracked: 10 },
    { id: 16, slug: 'ohio-state', name: 'University of Ohio', logo: alabamaLogo, playersTracked: 51, teamsTracked: 15 },
    { id: 17, slug: 'michigan-state', name: 'Michigan State University', logo: vanderbiltLogo, playersTracked: 47, teamsTracked: 14 },
    { id: 18, slug: 'wisconsin', name: 'University of Wisconsin', logo: lsuLogo, playersTracked: 40, teamsTracked: 12 },
    { id: 19, slug: 'minnesota', name: 'University of Minnesota', logo: olemissLogo, playersTracked: 32, teamsTracked: 11 },
    { id: 20, slug: 'iowa', name: 'University of Iowa', logo: floridaLogo, playersTracked: 27, teamsTracked: 9 },
  ];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUniversities = allUniversities.slice(startIndex, endIndex);
  const totalPages = Math.ceil(allUniversities.length / itemsPerPage);

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
        <h1 className="text-5xl font-bold text-gray-900 mb-8">All Teams Tracked</h1>

        {/* Table */}
        <div className="bg-white border-2 border-gray-300 rounded-2xl overflow-hidden mb-8">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className="px-6 py-4 text-left font-bold text-gray-900">#</th>
                <th className="px-6 py-4 text-left font-bold text-gray-900">LOGO</th>
                <th className="px-6 py-4 text-left font-bold text-gray-900">UNIVERSITY NAME</th>
                <th className="px-6 py-4 text-left font-bold text-gray-900">PLAYERS TRACKED</th>
                <th className="px-6 py-4 text-left font-bold text-gray-900">TEAMS TRACKED</th>
                <th className="px-6 py-4 text-left font-bold text-gray-900">VIEW TEAMS</th>
              </tr>
            </thead>
            <tbody>
              {currentUniversities.map((uni, index) => (
                <tr key={uni.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold text-gray-900">{startIndex + index + 1}</td>
                  <td className="px-6 py-4">
                    <img src={uni.logo} alt={uni.name} className="w-12 h-12 object-contain" />
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">{uni.name}</td>
                  <td className="px-6 py-4 font-bold text-blue-600">{uni.playersTracked}</td>
                  <td className="px-6 py-4 font-bold text-blue-600">{uni.teamsTracked}</td>
                  <td className="px-6 py-4">
                    <a 
                      href={`/teams/all/${uni.slug}`}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      View Teams →
                    </a>
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