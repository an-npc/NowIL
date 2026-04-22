import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Box } from '@mui/material';

export default function PlayerDetailPage() {
  const { playerId } = useParams();
  const navigate = useNavigate();

  const allPlayers = [
    {
      rank: 1,
      name: 'Arch Manning',
      college: 'UT Austin',
      sport: 'Football',
      pos: 'QB',
      nilValue: '$5.4M',
      nilChange: '-21%',
      number: 16,
      height: '6\'4"',
      weight: '230 lbs',
      hometown: 'New Orleans, LA',
      highSchool: 'Isidore Newman School',
      year: 'Junior',
      photo: null,
      gameHistory: [
        { date: '10/18', vs: 'Vanderbilt', result: 'L', score: '31-24', att: 38, yds: 232, nilValue: '$5.0M', nilChange: '-0.03%' },
        { date: '10/11', vs: 'Alabama', result: 'L', score: '48-32', att: 50, yds: 360, nilValue: '$5.2M', nilChange: '-0.02%' },
        { date: '9/27', vs: 'UT Austin', result: 'W', score: '28-11', att: 31, yds: 380, nilValue: '$5.4M', nilChange: '+0.01%' },
        { date: '9/20', vs: 'Ohio State', result: 'L', score: '46-23', att: 29, yds: 210, nilValue: '$5.3M', nilChange: '-0.05%' },
      ],
      nilHistory: [
        { month: 'Jun', value: 4.8 },
        { month: 'Jul', value: 4.9 },
        { month: 'Aug', value: 5.1 },
        { month: 'Sep', value: 5.3 },
        { month: 'Oct', value: 5.4 },
      ]
    },
    { 
      rank: 2, 
      name: 'AJ Dybantsa', 
      college: 'BYU', 
      sport: 'Basketball', 
      pos: 'SF', 
      nilValue: '$4.2M', 
      nilChange: '-5%', 
      number: 0, 
      height: '6\'9"', 
      weight: '215 lbs', 
      hometown: 'Chimacum, WA',
      highSchool: 'Port Townsend High School',
      year: 'Sophomore',
      photo: null,
      gameHistory: [
        { date: '10/18', vs: 'Gonzaga', result: 'W', score: '78-72', att: 28, yds: 24, nilValue: '$4.2M', nilChange: '-0.03%' },
        { date: '10/11', vs: 'Duke', result: 'L', score: '68-65', att: 32, yds: 18, nilValue: '$4.3M', nilChange: '-0.02%' },
        { date: '9/27', vs: 'Kansas', result: 'W', score: '82-79', att: 35, yds: 22, nilValue: '$4.4M', nilChange: '+0.01%' },
        { date: '9/20', vs: 'UCLA', result: 'L', score: '75-68', att: 30, yds: 16, nilValue: '$4.1M', nilChange: '-0.05%' },
      ],
      nilHistory: [
        { month: 'Jun', value: 3.8 },
        { month: 'Jul', value: 3.9 },
        { month: 'Aug', value: 4.0 },
        { month: 'Sep', value: 4.1 },
        { month: 'Oct', value: 4.2 },
      ]
    },
    { 
      rank: 3, 
      name: 'Jeremiah Smith', 
      college: 'Ohio State', 
      sport: 'Football', 
      pos: 'WR', 
      nilValue: '$4.2M', 
      nilChange: '0%', 
      number: 4, 
      height: '6\'3"', 
      weight: '205 lbs', 
      hometown: 'Amherst, OH',
      highSchool: 'Amherst Steele High School',
      year: 'Freshman',
      photo: null,
      gameHistory: [
        { date: '10/18', vs: 'Penn State', result: 'W', score: '35-16', att: 12, yds: 156, nilValue: '$4.2M', nilChange: '-0.03%' },
        { date: '10/11', vs: 'Michigan', result: 'L', score: '30-24', att: 8, yds: 98, nilValue: '$4.3M', nilChange: '-0.02%' },
        { date: '9/27', vs: 'Iowa', result: 'W', score: '41-21', att: 10, yds: 142, nilValue: '$4.4M', nilChange: '+0.01%' },
        { date: '9/20', vs: 'Wisconsin', result: 'W', score: '38-14', att: 11, yds: 167, nilValue: '$4.1M', nilChange: '-0.05%' },
      ],
      nilHistory: [
        { month: 'Jun', value: 3.5 },
        { month: 'Jul', value: 3.7 },
        { month: 'Aug', value: 3.9 },
        { month: 'Sep', value: 4.0 },
        { month: 'Oct', value: 4.2 },
      ]
    },
    { 
      rank: 4, 
      name: 'Garrett Nussmeier', 
      college: 'LSU', 
      sport: 'Football', 
      pos: 'QB', 
      nilValue: '$4.0M', 
      nilChange: '+6.7%', 
      number: 18, 
      height: '6\'3"', 
      weight: '215 lbs', 
      hometown: 'Lake Charles, LA',
      highSchool: 'Edward S. Marcus High School',
      year: 'Senior',
      photo: null,
      gameHistory: [
        { date: '10/18', vs: 'Vanderbilt', result: 'L', score: '31-24', att: 38, yds: 232, nilValue: '$5.0M', nilChange: '-0.03%' },
        { date: '10/11', vs: 'Alabama', result: 'L', score: '48-32', att: 50, yds: 360, nilValue: '$5.2M', nilChange: '-0.02%' },
        { date: '9/27', vs: 'UT Austin', result: 'W', score: '28-11', att: 31, yds: 380, nilValue: '$5.4M', nilChange: '+0.01%' },
        { date: '9/20', vs: 'Ohio State', result: 'L', score: '46-23', att: 29, yds: 210, nilValue: '$5.3M', nilChange: '-0.05%' },
      ],
      nilHistory: [
        { month: 'Jun', value: 3.2 },
        { month: 'Jul', value: 3.4 },
        { month: 'Aug', value: 3.6 },
        { month: 'Sep', value: 3.8 },
        { month: 'Oct', value: 4.0 },
      ]
    },
    {
      rank: 5,
      name: 'Brendan Sorsby', 
      college: 'Texas A&M', 
      sport: 'Football', 
      pos: 'QB', 
      nilValue: '$3.1M', 
      nilChange: '+29%', 
      number: 1, 
      height: '6\'2"', 
      weight: '210 lbs', 
      hometown: 'Cincinnati, OH',
      highSchool: 'Moeller High School',
      year: 'Junior',
      photo: null,
      gameHistory: [
        { date: '10/18', vs: 'Auburn', result: 'W', score: '33-20', att: 28, yds: 312, nilValue: '$3.1M', nilChange: '-0.03%' },
        { date: '10/11', vs: 'Arkansas', result: 'L', score: '42-35', att: 42, yds: 298, nilValue: '$3.2M', nilChange: '-0.02%' },
        { date: '9/27', vs: 'Mississippi', result: 'W', score: '38-17', att: 25, yds: 344, nilValue: '$3.3M', nilChange: '+0.01%' },
        { date: '9/20', vs: 'Florida', result: 'L', score: '44-28', att: 38, yds: 256, nilValue: '$3.0M', nilChange: '-0.05%' },
      ],
      nilHistory: [
        { month: 'Jun', value: 1.8 },
        { month: 'Jul', value: 2.0 },
        { month: 'Aug', value: 2.4 },
        { month: 'Sep', value: 2.7 },
        { month: 'Oct', value: 3.1 },
      ]
    }
  ];

  const player = allPlayers.find(p => p.rank === parseInt(playerId));

  const gameHistoryColumns = useMemo(
    () => [
      {
        accessorKey: 'date',
        header: 'Date',
      },
      {
        accessorKey: 'vs',
        header: 'VS',
      },
      {
        accessorKey: 'result',
        header: 'WIN/LOSS',
        Cell: ({ cell }) => {
          const value = cell.getValue();
          return (
            <span style={{ color: value === 'W' ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
              {value}
            </span>
          );
        },
      },
      {
        accessorKey: 'score',
        header: 'SCORE',
      },
      {
        accessorKey: 'att',
        header: 'ATT',
      },
      {
        accessorKey: 'yds',
        header: 'YDS',
      },
      {
        accessorKey: 'nilValue',
        header: 'NIL VALUE',
        Cell: ({ cell }) => (
          <span style={{ color: '#16a34a', fontWeight: 600 }}>
            {cell.getValue()}
          </span>
        ),
      },
      {
        accessorKey: 'nilChange',
        header: 'NIL CHANGE',
        Cell: ({ cell }) => {
          const value = cell.getValue();
          return (
            <span style={{ color: value.startsWith('+') ? '#16a34a' : '#dc2626', fontWeight: 600 }}>
              {value}
            </span>
          );
        },
      },
    ],
    [],
  );

  const gameHistoryTable = useMaterialReactTable({
    columns: gameHistoryColumns,
    data: player?.gameHistory || [],
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

  if (!player) {
    return (
      <div className="flex-1 overflow-auto">
        <div className="pt-4 px-8 pb-8">
          <h1 className="text-3xl font-bold text-gray-900">Player not found</h1>
          <button
            onClick={() => navigate('/players/tracked')}
            className="mt-4 text-blue-600 font-bold hover:text-blue-800"
          >
            ← Back to All Players
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="pt-4 px-8 pb-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => navigate('/players')}
            className="text-blue-600 font-bold hover:text-blue-800"
          >
            Players
          </button>
          <span className="text-gray-900 font-bold">&gt;</span>
          <h1 className="text-3xl font-bold text-gray-900">{player.name}</h1>
        </div>

        <div className="grid grid-cols-3 gap-8 mb-8">
          {/* Left: Player Card */}
          <div className="col-span-1">
            <div style={styles.playerCard}>
              {/* Header */}
              <div style={styles.cardHeader}>
                <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: 600 }}>
                  {player.name} | {player.college} | {player.pos} | #{player.number}
                </span>
              </div>

              {/* Player Image */}
              <div style={styles.playerImage}>
                {player.photo ? (
                  <img src={player.photo} alt={player.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>
                    👤
                  </div>
                )}
              </div>

              {/* NIL Stats */}
              <div style={styles.nilStatsContainer}>
                <div style={styles.nilStatRow}>
                  <span style={{ color: '#333', fontWeight: 500 }}>NIL Value:</span>
                  <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '1.125rem' }}>{player.nilValue}</span>
                </div>
                <div style={styles.nilStatRow}>
                  <span style={{ color: '#333', fontWeight: 500 }}>NIL Change:</span>
                  <span
                    style={{
                      color: player.nilChange.startsWith('+') ? '#16a34a' : '#dc2626',
                      fontWeight: 700,
                      fontSize: '1.125rem',
                    }}
                  >
                    {player.nilChange}
                  </span>
                </div>
              </div>

              {/* Like Button */}
              <button style={styles.likeButton}>🤍</button>
            </div>
          </div>

          {/* Right: Player Info Tabs */}
          <div className="col-span-2">
            {/* Tab Navigation */}
            <div style={styles.tabNav}>
              <button style={styles.tabActive}>BIO</button>
              <button style={styles.tabInactive}>STATS</button>
              <button style={styles.tabInactive}>BRAND</button>
            </div>

            {/* Tab Content */}
            <div style={{ ...styles.tabContent, height: '390px', overflowY: 'auto' }}>
              <div style={styles.infoGrid}>
                {/* Left Column */}
                <div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>School</span>
                    <span style={styles.infoValue}>{player.college}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Year</span>
                    <span style={styles.infoValue}>{player.year}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Position</span>
                    <span style={styles.infoValue}>{player.pos}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Number</span>
                    <span style={styles.infoValue}>#{player.number}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>High School</span>
                    <span style={styles.infoValue}>{player.highSchool}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Hometown</span>
                    <span style={styles.infoValue}>{player.hometown}</span>
                  </div>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Height/Weight</span>
                    <span style={styles.infoValue}>
                      {player.height}, {player.weight}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NIL History Chart - Full Width */}
        <div style={styles.chartContainer}>
          <h3 style={styles.chartTitle}>NIL Value History</h3>
          <ResponsiveContainer width="100%" height={420}>
            <LineChart data={player.nilHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toFixed(1)}M`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#5a3fa8"
                strokeWidth={2}
                dot={{ fill: '#5a3fa8', r: 4 }}
                activeDot={{ r: 6 }}
                name="NIL Value (Millions)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Game History Table */}
        <div style={styles.gameHistorySection}>
          <h2 style={styles.gameHistoryTitle}>Game History - Stats</h2>
          <Box sx={{ width: '100%' }}>
            <MaterialReactTable table={gameHistoryTable} />
          </Box>
        </div>
      </div>
    </div>
  );
}

const styles = {
  playerCard: {
    background: 'white',
    borderRadius: '12px',
    border: '2px solid #ddd',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    position: 'relative',
  },
  cardHeader: {
    background: '#5a3fa8',
    color: 'white',
    padding: '12px 16px',
    textAlign: 'center',
  },
  playerImage: {
    width: '100%',
    height: '280px',
    background: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  nilStatsContainer: {
    padding: '16px',
    borderTop: '3px solid #5a3fa8',
  },
  nilStatRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  likeButton: {
    position: 'absolute',
    top: '200px',
    right: '16px',
    background: 'white',
    border: '2px solid #ddd',
    borderRadius: '50%',
    width: '44px',
    height: '44px',
    fontSize: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
  },
  tabNav: {
    display: 'flex',
    background: '#5a3fa8',
    borderRadius: '12px 12px 0 0',
    overflow: 'hidden',
  },
  tabActive: {
    flex: 1,
    padding: '16px',
    background: '#5a3fa8',
    color: 'white',
    border: 'none',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  tabInactive: {
    flex: 1,
    padding: '16px',
    background: '#5a3fa8',
    color: 'white',
    border: 'none',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
    opacity: 0.7,
  },
  tabContent: {
    background: 'white',
    borderRadius: '0 0 12px 12px',
    border: '2px solid #ddd',
    borderTop: 'none',
    padding: '24px',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '32px',
  },
  infoRow: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '20px',
    borderBottom: '1px solid #eee',
    paddingBottom: '16px',
  },
  infoLabel: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#666',
    marginBottom: '8px',
  },
  infoValue: {
    fontSize: '1rem',
    fontWeight: 500,
    color: '#333',
  },
  gameHistorySection: {
    background: 'white',
    borderRadius: '12px',
    border: '2px solid #ddd',
    padding: '24px',
    overflow: 'hidden',
  },
  gameHistoryTitle: {
    fontSize: '1.125rem',
    fontWeight: 700,
    color: '#333',
    marginBottom: '16px',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  gameTable: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    background: '#f3f4f6',
    borderBottom: '2px solid #ddd',
  },
  tableHeaderCell: {
    padding: '12px 16px',
    textAlign: 'left',
    fontWeight: 600,
    fontSize: '0.875rem',
    color: '#333',
  },
  tableRow: {
    borderBottom: '1px solid #e5e7eb',
  },
  tableCell: {
    padding: '16px',
    textAlign: 'left',
    fontSize: '0.95rem',
    color: '#333',
  },
  chartContainer: {
    background: 'white',
    borderRadius: '12px',
    border: '2px solid #ddd',
    padding: '24px',
    marginBottom: '24px',
  },
  chartTitle: {
    fontSize: '1.125rem',
    fontWeight: 700,
    color: '#333',
    marginBottom: '16px',
  },
};