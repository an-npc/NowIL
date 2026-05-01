import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAPIJson } from '../api/api-funcs';
import HBHeadshot from '../assets/HB_headshot.png';
import HDHeadshot from '../assets/HD_headshot.png';
import JAHeadshot from '../assets/JA_headshot.png';
import JBHeadshot from '../assets/JB_headshot.png';
import JCHeadshot from '../assets/JC_headshot.png';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

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

function generateNilHistory(currentValue) {
  const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
  const points = [currentValue];
  for (let i = 1; i < months.length; i++) {
    const prev = points[0];
    const change = prev * (Math.random() * 0.12 - 0.04);
    points.unshift(Math.max(0, Math.round(prev - change)));
  }
  return months.map((month, i) => ({ month, value: points[i] }));
}

function parseNilString(nilStr) {
  if (typeof nilStr === 'number') return nilStr;
  return parseInt(nilStr.replace(/[$,]/g, '')) || 0;
}

function formatYAxis(val) {
  if (val >= 1000000) return '$' + (val / 1000000).toFixed(1) + 'M';
  if (val >= 1000) return '$' + (val / 1000).toFixed(0) + 'k';
  return '$' + val;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    const formatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    return (
      <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '10px 14px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <p style={{ color: '#6b7280', fontSize: '0.75rem', marginBottom: '2px' }}>{label}</p>
        <p style={{ color: '#5a3fa8', fontWeight: 700, fontSize: '0.95rem' }}>{formatted}</p>
      </div>
    );
  }
  return null;
};

const HARDCODED_PLAYERS = {
  3: { name: 'Hank Brown', college: 'Auburn', sport: 'Football', pos: 'QB', number: 9, nilValue: '$54,300', nilChange: '-2%', photo: HBHeadshot },
  4: { name: 'John Colvin', college: 'Auburn', sport: 'Football', pos: 'QB', number: 16, nilValue: '$38,450', nilChange: '+3%', photo: JCHeadshot },
  6: { name: 'Jackson Barkley', college: 'Auburn', sport: 'Football', pos: 'QB', number: 19, nilValue: '$19,800', nilChange: '-5%', photo: JBHeadshot },
  7: { name: 'Hollis Davidson III', college: 'Auburn', sport: 'Football', pos: 'TE', number: 13, nilValue: '$87,000', nilChange: '+2%', photo: HDHeadshot },
};

export default function PlayerDetailPage() {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [playerData, setPlayerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadPlayerData() {
      try {
        setIsLoading(true);
        setError('');

        const idAsInt = parseInt(playerId);

        if (HARDCODED_PLAYERS[idAsInt]) {
          if (isMounted) {
            setPlayerData(HARDCODED_PLAYERS[idAsInt]);
            setIsLoading(false);
          }
          return;
        }

        const params = new URLSearchParams({ limit: '1000', offset: '0' });
        const allPlayers = await fetchAPIJson('/players', params);
        const player = allPlayers.find(p => p.player_id === idAsInt);

        if (!player) throw new Error('Player not found');

        const usdFormatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0,
        });

        if (isMounted) {
          setPlayerData({
            name: `${player.first_name} ${player.last_name}`,
            college: player.school,
            sport: player.sport,
            pos: player.position,
            nilValue: usdFormatter.format(player.nil || 0),
            nilChange: player.nil_delta !== undefined
              ? `${player.nil_delta >= 0 ? '+' : ''}${(player.nil_delta * 100).toFixed(2)}%`
              : '0%',
            photo: null,
          });
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load player data');
          console.error('Error:', err);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadPlayerData();
    return () => { isMounted = false; };
  }, [playerId]);

  const chartData = useMemo(() => {
    if (!playerData) return null;
    return generateNilHistory(parseNilString(playerData.nilValue));
  }, [playerData]);

  if (isLoading) return <div className="flex-1 overflow-auto p-8">Loading...</div>;

  if (error || !playerData) {
    return (
      <div className="flex-1 overflow-auto p-8">
        <h1 className="text-3xl font-bold text-gray-900">{error || 'Player not found'}</h1>
        <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 font-bold hover:text-blue-800">← Back</button>
      </div>
    );
  }

  const player = playerData;

  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="pt-4 px-8 pb-8">
        <div className="flex items-center gap-2 mb-8">
          <button onClick={() => navigate(-1)} className="text-blue-600 font-bold hover:text-blue-800">← Back</button>
          <span className="text-gray-900">/</span>
          <h1 className="text-3xl font-bold text-gray-900">{player.name}</h1>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Left column */}
          <div className="col-span-1">
            <div className="bg-white border-2 border-gray-300 rounded-2xl overflow-hidden">
              <div style={{ backgroundColor: '#5a3fa8', padding: '16px' }}>
                <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: 600 }}>
                  {player.pos} | {player.college}
                </span>
              </div>

              <div style={{ width: '100%', height: '300px', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {player.photo ? (
                  <img src={player.photo} alt={player.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                ) : (
                  <span style={{ fontSize: '4rem' }}>👤</span>
                )}
              </div>

              <div style={{ padding: '20px' }}>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{player.name}</h2>
                <div className="mb-4">
                  <p className="text-gray-600 text-sm">Sport</p>
                  <p className="text-lg font-semibold text-gray-900">{player.sport}</p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-600 text-sm">Position</p>
                  <p className="text-lg font-semibold text-gray-900">{player.pos}</p>
                </div>
                <div className="mb-6">
                  <p className="text-gray-600 text-sm">College</p>
                  <p className="text-lg font-semibold text-gray-900">{player.college}</p>
                </div>

                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className="w-full py-2 border-2 border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50"
                >
                  <Heart isLiked={isLiked} size={20} />
                  <span className="font-semibold text-gray-700">{isLiked ? 'Following' : 'Follow'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="col-span-2">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white border-2 border-gray-300 rounded-2xl p-6">
                <p className="text-gray-600 text-sm font-semibold mb-2">NIL VALUE</p>
                <p className="text-4xl font-bold text-green-600">{player.nilValue}</p>
              </div>
              <div className="bg-white border-2 border-gray-300 rounded-2xl p-6">
                <p className="text-gray-600 text-sm font-semibold mb-2">NIL CHANGE</p>
                <p className="text-4xl font-bold" style={{ color: player.nilChange.startsWith('+') ? '#16a34a' : '#dc2626' }}>
                  {player.nilChange}
                </p>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-300 rounded-2xl p-6 mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">School</p>
                  <p className="text-lg font-semibold text-gray-900">{player.college}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Sport</p>
                  <p className="text-lg font-semibold text-gray-900">{player.sport}</p>
                </div>
              </div>
            </div>

            {chartData && (
              <div className="bg-white border-2 border-gray-300 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">NIL Value History</h3>
                <p className="text-gray-500 text-sm mb-4">Aug 2025 – Apr 2026</p>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="nilGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#5a3fa8" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#5a3fa8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={formatYAxis} tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} width={55} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="value" stroke="#5a3fa8" strokeWidth={2.5} fill="url(#nilGradient)" dot={{ fill: '#5a3fa8', r: 4 }} activeDot={{ r: 6 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}