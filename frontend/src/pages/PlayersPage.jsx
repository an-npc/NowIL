import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Box } from '@mui/material';

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
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart isLiked={isLiked} size={24} />
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

// Players Table Component with Material React Table
const PlayersTableComponent = ({ tableData, navigate }) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: 'rank',
        header: '#',
        size: 50,
      },
      {
        accessorKey: 'name',
        header: 'ATHLETE',
        Cell: ({ row }) => (
          <button
            onClick={() => navigate(`/players/${row.original.rank}`)}
            className="font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
          >
            {row.original.name}
          </button>
        ),
      },
      {
        accessorKey: 'college',
        header: 'COLLEGE',
      },
      {
        accessorKey: 'sport',
        header: 'SPORT',
      },
      {
        accessorKey: 'pos',
        header: 'POS',
      },
      {
        accessorKey: 'nilValue',
        header: 'NIL VALUE',
        Cell: ({ cell }) => (
          <span style={{ color: '#16a34a', fontWeight: 'bold' }}>
            {cell.getValue()}
          </span>
        ),
      },
      {
        accessorKey: 'nilChange',
        header: 'NIL CHANGE',
        Cell: ({ cell }) => (
          <span
            style={{
              color: cell.getValue().toString().startsWith('+') ? '#16a34a' : '#dc2626',
              fontWeight: 'bold',
            }}
          >
            {cell.getValue()}
          </span>
        ),
      },
      {
        accessorKey: 'follow',
        header: 'FOLLOW',
        Cell: () => <Heart isLiked={false} size={24} />,
      },
    ],
    [navigate],
  );

  const table = useMaterialReactTable({
    columns,
    data: tableData,
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: false,
    enableSorting: false,
    muiTablePaperProps: {
      sx: {
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        border: 'none',
        borderRadius: '12px',
        overflow: 'hidden',
      },
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: '#ffffff',
        color: '#1f2937',
        fontWeight: '700',
        fontSize: '0.875rem',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        padding: '16px',
        borderBottom: '2px solid #e5e7eb',
      },
    },
    muiTableBodyCellProps: {
      sx: {
        padding: '14px 16px',
        borderBottom: '1px solid #f0f0f0',
        fontSize: '0.95rem',
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        backgroundColor: row.index % 2 === 0 ? '#ffffff' : '#fafafa',
        '&:hover': {
          backgroundColor: '#f5f0ff',
          transition: 'background-color 0.2s ease',
        },
      },
    }),
  });

  return (
    <Box sx={{ width: '100%' }}>
      <MaterialReactTable table={table} />
    </Box>
  );
};

// Main Players Page Component
export default function PlayersPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSport, setSelectedSport] = useState('Football');
  const navigate = useNavigate();

  const CARD_WIDTH = 300;
  const CARD_GAP = 24;
  const CARDS_VISIBLE = 3;

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
      setCurrentIndex(Math.min(trendingPlayers.length - CARDS_VISIBLE, currentIndex + 1));
    }
  };

  // Width of the visible carousel window: 2 cards + 1 gap between them
  const viewportWidth = CARD_WIDTH * CARDS_VISIBLE + CARD_GAP * (CARDS_VISIBLE - 1);
  // Offset moves the track left by one card+gap per step
  const trackOffset = currentIndex * (CARD_WIDTH + CARD_GAP);

  return (
    <div className="flex-1 overflow-auto">
      <div className="pt-4 px-8 pb-8 flex flex-col h-full">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6 gap-8">
          <h1 className="text-5xl font-bold text-gray-900 flex-shrink-0">Players</h1>
          <div className="relative flex-1 max-w-96">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 flex items-center justify-center" style={{ width: '20px', height: '20px' }}>
              <SearchIcon size={20} />
            </span>
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
              className={`px-6 py-2 rounded-full font-medium transition-all ${selectedSport === sport
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

            {/* Carousel Viewport */}
            <div
              style={{
                width: `${viewportWidth}px`,
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              {/* Sliding Track — all cards rendered, shifted via translateX */}
              <div
                style={{
                  display: 'flex',
                  gap: `${CARD_GAP}px`,
                  transform: `translateX(-${trackOffset}px)`,
                  transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  willChange: 'transform',
                }}
              >
                {trendingPlayers.map((player, index) => (
                  <PlayerCard
                    key={index}
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
            </div>

            {/* Right Arrow */}
            <button
              onClick={() => scroll('right')}
              disabled={currentIndex >= trendingPlayers.length - CARDS_VISIBLE}
              className="text-5xl hover:text-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              →
            </button>
          </div>

          {/* Dot Indicators */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '-16px', marginBottom: '8px' }}>
            {Array.from({ length: trendingPlayers.length - CARDS_VISIBLE + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  background: i === currentIndex ? '#4a1e8a' : '#d1d5db',
                  transition: 'background 0.2s',
                }}
              />
            ))}
          </div>
        </div>

        {/* Top Players Table */}
        <div className="mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top Players - 2026 Season</h2>
          <PlayersTableComponent tableData={tableData} navigate={navigate} />
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
    width: '300px',
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