import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Box } from '@mui/material';
import GNHeadshot from '../assets/GN_headshot.png';
import JAHeadshot from '../assets/JA_headshot.png';
import HBHeadshot from '../assets/HB_headshot.png';
import JCHeadshot from '../assets/JC_headshot.png';
import ADHeadshot from '../assets/AD_headshot.png';
import JBHeadshot from '../assets/JB_headshot.png';
import HDHeadshot from '../assets/HD_headshot.png';
import XAHeadshot from '../assets/XA_headshot.png';
import CCHeadshot from '../assets/CC_headshot.png';
import JCobbHeadshot from '../assets/JCobb_headshott.png';

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

export default function PlayerDetailPage() {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  const allPlayers = [
    {
      rank: 1,
      name: 'Garrett Nussmeier',
      college: 'LSU',
      sport: 'Football',
      pos: 'QB',
      nilValue: '$3.3M',
      nilChange: '-4%',
      number: 18,
      height: '6\'3"',
      weight: '215 lbs',
      hometown: 'Lake Charles, LA',
      highSchool: 'Edward S. Marcus High School',
      year: 'Senior',
      photo: GNHeadshot,
      gameHistory: [
        { date: '10/18', vs: 'Vanderbilt', result: 'L', score: '31-24', att: 38, yds: 232, nilValue: '$3.3M', nilChange: '-0.03%' },
        { date: '10/11', vs: 'Alabama', result: 'L', score: '48-32', att: 50, yds: 360, nilValue: '$3.4M', nilChange: '-0.02%' },
        { date: '9/27', vs: 'Ole Miss', result: 'W', score: '28-11', att: 31, yds: 380, nilValue: '$3.5M', nilChange: '+0.01%' },
        { date: '9/20', vs: 'Texas A&M', result: 'L', score: '46-23', att: 29, yds: 210, nilValue: '$3.2M', nilChange: '-0.05%' },
      ],
      nilHistory: [
        { month: 'Jun', value: 3.5 },
        { month: 'Jul', value: 3.5 },
        { month: 'Aug', value: 3.4 },
        { month: 'Sep', value: 3.3 },
        { month: 'Oct', value: 3.3 },
      ]
    },
    {
      rank: 2,
      name: 'Jackson Arnold',
      college: 'Oklahoma',
      sport: 'Football',
      pos: 'QB',
      nilValue: '$2.8M',
      nilChange: '+8%',
      number: 11,
      height: '6\'3"',
      weight: '219 lbs',
      hometown: 'Denton, TX',
      highSchool: 'Guyer High School',
      year: 'Junior',
      photo: JAHeadshot,
      gameHistory: [
        { date: '10/18', vs: 'Iowa State', result: 'W', score: '35-28', att: 32, yds: 285, nilValue: '$2.8M', nilChange: '-0.03%' },
        { date: '10/11', vs: 'Texas', result: 'L', score: '34-30', att: 38, yds: 315, nilValue: '$2.9M', nilChange: '-0.02%' },
        { date: '9/27', vs: 'Kansas', result: 'W', score: '42-21', att: 28, yds: 352, nilValue: '$3.0M', nilChange: '+0.01%' },
        { date: '9/20', vs: 'Baylor', result: 'W', score: '38-27', att: 35, yds: 298, nilValue: '$2.7M', nilChange: '-0.05%' },
      ],
      nilHistory: [
        { month: 'Jun', value: 2.3 },
        { month: 'Jul', value: 2.4 },
        { month: 'Aug', value: 2.6 },
        { month: 'Sep', value: 2.7 },
        { month: 'Oct', value: 2.8 },
      ]
    },
    {
      rank: 3,
      name: 'Hank Brown',
      college: 'Auburn',
      sport: 'Football',
      pos: 'QB',
      nilValue: '$2.4M',
      nilChange: '+12%',
      number: 9,
      height: '6\'2"',
      weight: '215 lbs',
      hometown: 'Nashville, TN',
      highSchool: 'Pearl-Cohn Charter School',
      year: 'Sophomore',
      photo: HBHeadshot,
      gameHistory: [
        { date: '10/18', vs: 'Missouri', result: 'W', score: '28-17', att: 26, yds: 298, nilValue: '$2.4M', nilChange: '-0.03%' },
        { date: '10/11', vs: 'Georgia', result: 'L', score: '41-14', att: 32, yds: 185, nilValue: '$2.5M', nilChange: '-0.02%' },
        { date: '9/27', vs: 'New Mexico', result: 'W', score: '38-21', att: 24, yds: 325, nilValue: '$2.6M', nilChange: '+0.01%' },
        { date: '9/20', vs: 'Kent State', result: 'W', score: '45-7', att: 20, yds: 280, nilValue: '$2.3M', nilChange: '-0.05%' },
      ],
      nilHistory: [
        { month: 'Jun', value: 1.9 },
        { month: 'Jul', value: 2.0 },
        { month: 'Aug', value: 2.1 },
        { month: 'Sep', value: 2.2 },
        { month: 'Oct', value: 2.4 },
      ]
    },
    {
      rank: 4,
      name: 'John Colvin',
      college: 'Auburn',
      sport: 'Football',
      pos: 'QB',
      nilValue: '$2.1M',
      nilChange: '+5%',
      number: 16,
      height: '6\'0"',
      weight: '194 lbs',
      hometown: 'Birmingham, AL',
      highSchool: 'Marjory Stoneman Douglas High School',
      year: 'Sophomore',
      photo: JCHeadshot,
      gameHistory: [
        { date: '10/18', vs: 'Missouri', result: 'W', score: '28-17', att: 22, yds: 268, nilValue: '$2.1M', nilChange: '-0.03%' },
        { date: '10/11', vs: 'Georgia', result: 'L', score: '41-14', att: 28, yds: 175, nilValue: '$2.2M', nilChange: '-0.02%' },
        { date: '9/27', vs: 'New Mexico', result: 'W', score: '38-21', att: 20, yds: 295, nilValue: '$2.3M', nilChange: '+0.01%' },
        { date: '9/20', vs: 'Kent State', result: 'W', score: '45-7', att: 18, yds: 250, nilValue: '$2.0M', nilChange: '-0.05%' },
      ],
      nilHistory: [
        { month: 'Jun', value: 1.8 },
        { month: 'Jul', value: 1.9 },
        { month: 'Aug', value: 2.0 },
        { month: 'Sep', value: 2.05 },
        { month: 'Oct', value: 2.1 },
      ]
    },
    {
      rank: 5,
      name: 'Ashton Daniels',
      college: 'Auburn',
      sport: 'Football',
      pos: 'QB',
      nilValue: '$2.6M',
      nilChange: '+9%',
      number: 12,
      height: '6\'2"',
      weight: '219 lbs',
      hometown: 'Buford, GA',
      highSchool: 'Buford High School',
      year: 'Senior',
      photo: ADHeadshot,
      gameHistory: [
        { date: '10/18', vs: 'Missouri', result: 'W', score: '28-17', att: 28, yds: 312, nilValue: '$2.6M', nilChange: '-0.03%' },
        { date: '10/11', vs: 'Georgia', result: 'L', score: '41-14', att: 35, yds: 242, nilValue: '$2.7M', nilChange: '-0.02%' },
        { date: '9/27', vs: 'New Mexico', result: 'W', score: '38-21', att: 26, yds: 344, nilValue: '$2.8M', nilChange: '+0.01%' },
        { date: '9/20', vs: 'Kent State', result: 'W', score: '45-7', att: 24, yds: 298, nilValue: '$2.5M', nilChange: '-0.05%' },
      ],
      nilHistory: [
        { month: 'Jun', value: 2.2 },
        { month: 'Jul', value: 2.3 },
        { month: 'Aug', value: 2.4 },
        { month: 'Sep', value: 2.5 },
        { month: 'Oct', value: 2.6 },
      ]
    },
    {
      rank: 6,
      name: 'Jackson Barkley',
      college: 'Auburn',
      sport: 'Football',
      pos: 'QB',
      nilValue: '$1.9M',
      nilChange: '+7%',
      number: 19,
      height: '6\'0"',
      weight: '206 lbs',
      hometown: 'Marietta, GA',
      highSchool: 'Marietta High School',
      year: 'Junior',
      photo: JBHeadshot,
      gameHistory: [
        { date: '10/18', vs: 'Missouri', result: 'W', score: '28-17', att: 20, yds: 251, nilValue: '$1.9M', nilChange: '-0.03%' },
        { date: '10/11', vs: 'Georgia', result: 'L', score: '41-14', att: 26, yds: 168, nilValue: '$2.0M', nilChange: '-0.02%' },
        { date: '9/27', vs: 'New Mexico', result: 'W', score: '38-21', att: 18, yds: 278, nilValue: '$2.1M', nilChange: '+0.01%' },
        { date: '9/20', vs: 'Kent State', result: 'W', score: '45-7', att: 16, yds: 232, nilValue: '$1.8M', nilChange: '-0.05%' },
      ],
      nilHistory: [
        { month: 'Jun', value: 1.6 },
        { month: 'Jul', value: 1.7 },
        { month: 'Aug', value: 1.8 },
        { month: 'Sep', value: 1.85 },
        { month: 'Oct', value: 1.9 },
      ]
    },
    {
      rank: 7,
      name: 'Hollis Davidson III',
      college: 'Auburn',
      sport: 'Football',
      pos: 'TE',
      nilValue: '$1.8M',
      nilChange: '+6%',
      number: 13,
      height: '6\'5"',
      weight: '238 lbs',
      hometown: 'Peachtree City, GA',
      highSchool: 'Starr\'s Mill High School',
      year: 'Freshman',
      photo: HDHeadshot,
      gameHistory: [
        { date: '10/18', vs: 'Missouri', result: 'W', score: '28-17', att: 6, yds: 78, nilValue: '$1.8M', nilChange: '-0.03%' },
        { date: '10/11', vs: 'Georgia', result: 'L', score: '41-14', att: 4, yds: 32, nilValue: '$1.9M', nilChange: '-0.02%' },
        { date: '9/27', vs: 'New Mexico', result: 'W', score: '38-21', att: 7, yds: 89, nilValue: '$2.0M', nilChange: '+0.01%' },
        { date: '9/20', vs: 'Kent State', result: 'W', score: '45-7', att: 5, yds: 65, nilValue: '$1.7M', nilChange: '-0.05%' },
      ],
      nilHistory: [
        { month: 'Jun', value: 1.5 },
        { month: 'Jul', value: 1.6 },
        { month: 'Aug', value: 1.7 },
        { month: 'Sep', value: 1.75 },
        { month: 'Oct', value: 1.8 },
      ]
    },
    {
      rank: 8,
      name: 'Xavier Atkins',
      college: 'LSU',
      sport: 'Football',
      pos: 'LB',
      nilValue: '$1.5M',
      nilChange: '+4%',
      number: 17,
      height: '6\'0"',
      weight: '210 lbs',
      hometown: 'Houston, TX',
      highSchool: 'Fort Bend Bush High School',
      year: 'Sophomore',
      photo: XAHeadshot,
      gameHistory: [
        { date: '10/18', vs: 'Vanderbilt', result: 'L', score: '31-24', att: 12, yds: 0, nilValue: '$1.5M', nilChange: '-0.03%' },
        { date: '10/11', vs: 'Alabama', result: 'L', score: '48-32', att: 14, yds: 0, nilValue: '$1.6M', nilChange: '-0.02%' },
        { date: '9/27', vs: 'Ole Miss', result: 'W', score: '28-11', att: 11, yds: 0, nilValue: '$1.7M', nilChange: '+0.01%' },
        { date: '9/20', vs: 'Texas A&M', result: 'L', score: '46-23', att: 10, yds: 0, nilValue: '$1.4M', nilChange: '-0.05%' },
      ],
      nilHistory: [
        { month: 'Jun', value: 1.3 },
        { month: 'Jul', value: 1.35 },
        { month: 'Aug', value: 1.4 },
        { month: 'Sep', value: 1.45 },
        { month: 'Oct', value: 1.5 },
      ]
    },
    {
      rank: 9,
      name: 'Cam Coleman',
      college: 'Auburn',
      sport: 'Football',
      pos: 'WR',
      nilValue: '$1.7M',
      nilChange: '+8%',
      number: 8,
      height: '6\'1"',
      weight: '201 lbs',
      hometown: 'Phenix City, AL',
      highSchool: 'Central High School',
      year: 'Sophomore',
      photo: CCHeadshot,
      gameHistory: [
        { date: '10/18', vs: 'Missouri', result: 'W', score: '28-17', att: 8, yds: 142, nilValue: '$1.7M', nilChange: '-0.03%' },
        { date: '10/11', vs: 'Georgia', result: 'L', score: '41-14', att: 6, yds: 89, nilValue: '$1.8M', nilChange: '-0.02%' },
        { date: '9/27', vs: 'New Mexico', result: 'W', score: '38-21', att: 9, yds: 156, nilValue: '$1.9M', nilChange: '+0.01%' },
        { date: '9/20', vs: 'Kent State', result: 'W', score: '45-7', att: 7, yds: 128, nilValue: '$1.6M', nilChange: '-0.05%' },
      ],
      nilHistory: [
        { month: 'Jun', value: 1.4 },
        { month: 'Jul', value: 1.45 },
        { month: 'Aug', value: 1.5 },
        { month: 'Sep', value: 1.6 },
        { month: 'Oct', value: 1.7 },
      ]
    },
    {
      rank: 10,
      name: 'Jeremiah Cobb',
      college: 'Auburn',
      sport: 'Football',
      pos: 'RB',
      nilValue: '$1.4M',
      nilChange: '+3%',
      number: 23,
      height: '5\'11"',
      weight: '200 lbs',
      hometown: 'Montgomery, AL',
      highSchool: 'Booker T. Washington High School',
      year: 'Junior',
      photo: JCobbHeadshot,
      gameHistory: [
        { date: '10/18', vs: 'Missouri', result: 'W', score: '28-17', att: 18, yds: 87, nilValue: '$1.4M', nilChange: '-0.03%' },
        { date: '10/11', vs: 'Georgia', result: 'L', score: '41-14', att: 14, yds: 52, nilValue: '$1.5M', nilChange: '-0.02%' },
        { date: '9/27', vs: 'New Mexico', result: 'W', score: '38-21', att: 22, yds: 112, nilValue: '$1.6M', nilChange: '+0.01%' },
        { date: '9/20', vs: 'Kent State', result: 'W', score: '45-7', att: 16, yds: 98, nilValue: '$1.3M', nilChange: '-0.05%' },
      ],
      nilHistory: [
        { month: 'Jun', value: 1.2 },
        { month: 'Jul', value: 1.25 },
        { month: 'Aug', value: 1.3 },
        { month: 'Sep', value: 1.35 },
        { month: 'Oct', value: 1.4 },
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
              <button style={styles.likeButton} onClick={() => setIsLiked(!isLiked)}>
                <Heart isLiked={isLiked} size={24} />
              </button>
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