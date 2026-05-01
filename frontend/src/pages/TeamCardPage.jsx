import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { Box } from '@mui/material';
import { fetchAPIJson } from '../api/api-funcs';

export default function TeamCardPage() {
    const { teamId } = useParams();
    const navigate = useNavigate();
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [teamData, setTeamData] = useState(null);
    const [teamPlayers, setTeamPlayers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let isMounted = true;

        async function loadTeamDetails() {
            try {
                setIsLoading(true);
                setError('');

                const usdFormatter = new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    maximumFractionDigits: 0,
                });

                // Fetch team data
                const teamInfo = await fetchAPIJson(`/teams/${teamId}/data`);

                if (isMounted) {
                    setTeamData({
                        ...teamInfo,
                        total_nil_value_formatted: usdFormatter.format(teamInfo.total_nil_value || 0),
                        avg_nil_value_formatted: usdFormatter.format(teamInfo.avg_nil_value || 0),
                    });
                }

                // Fetch all players and filter by team sport/school
                const params = new URLSearchParams({ limit: '1000', offset: '0' });
                const allPlayers = await fetchAPIJson(`/players`, params);

                console.log('All players data:', allPlayers);

                // Filter players by team school and sport
                const teamPlayers = (allPlayers || []).filter(player =>
                    player.school === teamInfo.school && player.sport === teamInfo.sport
                );

                console.log(`Filtered ${teamPlayers.length} players for ${teamInfo.school} ${teamInfo.sport}`);

                const mappedPlayers = teamPlayers.map((player, index) => ({
                    rank: index + 1,
                    playerId: player.player_id,
                    name: `${player.first_name || ''} ${player.last_name || ''}`.trim(),
                    position: player.position || 'N/A',
                    nilValue: usdFormatter.format(player.nil || 0),
                    nilChange: player.nil_delta !== undefined ? `${player.nil_delta >= 0 ? '+' : ''}${(player.nil_delta * 100).toFixed(2)}%` : 'N/A',
                }));

                if (isMounted) {
                    setTeamPlayers(mappedPlayers);
                }
            } catch (err) {
                if (isMounted) {
                    setError('Failed to load team details from the API.');
                    setTeamData(null);
                    setTeamPlayers([]);
                    console.error('Error loading team details:', err);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadTeamDetails();

        return () => {
            isMounted = false;
        };
    }, [teamId]);

    const playersColumns = useMemo(
        () => [
            {
                accessorKey: 'rank',
                header: '#',
                size: 50,
            },
            {
                accessorKey: 'name',
                header: 'ATHLETE',
            },
            {
                accessorKey: 'position',
                header: 'POSITION',
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
                Cell: ({ cell }) => {
                    const value = cell.getValue();
                    return (
                        <span style={{ color: value.startsWith('+') ? '#16a34a' : '#dc2626', fontWeight: 'bold' }}>
                            {value}
                        </span>
                    );
                },
            },
            {
                accessorKey: 'rank',
                header: 'ACTION',
                Cell: ({ row }) => (
                    <button
                        onClick={() => navigate(`/players/${row.original.playerId}`)}
                        style={{ color: '#2563eb', fontWeight: 'bold', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'none' }}
                        onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                        onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                    >
                        View Profile →
                    </button>
                ),
            },
        ],
        [navigate],
    );

    const playersTable = useMaterialReactTable({
        columns: playersColumns,
        data: teamPlayers,
        state: {
            pagination,
            isLoading,
            showAlertBanner: Boolean(error),
            showProgressBars: isLoading,
        },
        muiToolbarAlertBannerProps: error
            ? {
                color: 'error',
                children: error,
            }
            : undefined,
        enableColumnActions: false,
        enableColumnFilters: false,
        enablePagination: true,
        enableSorting: false,
        onPaginationChange: setPagination,
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
        muiPaginationProps: {
            color: 'standard',
            shape: 'rounded',
            sx: {
                padding: '16px',
                '& .MuiPaginationItem-root': {
                    borderRadius: '6px',
                    color: '#5a3fa8',
                    '&.Mui-selected': {
                        backgroundColor: '#5a3fa8',
                        color: 'white',
                        fontWeight: '600',
                    },
                    '&:hover': {
                        backgroundColor: '#f5f0ff',
                    },
                },
            },
        },
    });

    if (isLoading) {
        return <div className="flex-1 overflow-auto p-8">Loading...</div>;
    }

    if (!teamData) {
        return <div className="flex-1 overflow-auto p-8">Team not found</div>;
    }

    return (
        <div className="flex-1 overflow-auto">
            <div className="pt-4 px-8 pb-8">
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
                        <h1 className="text-4xl font-bold text-gray-900">{teamData.school} {teamData.sport}</h1>
                    </div>
                </div>

                {/* Team Info Card */}
                <div className="bg-white border-2 border-gray-300 rounded-2xl p-6 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {teamData.school} - {teamData.sport}
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Location: <span className="font-bold text-gray-900">{teamData.city}, {teamData.state}</span>
                    </p>
                    <div className="grid grid-cols-3 gap-6">
                        <div>
                            <p className="text-gray-600 text-sm">Total Players</p>
                            <p className="text-2xl font-bold text-blue-600">{teamData.total_players}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Total NIL Value</p>
                            <p className="text-2xl font-bold" style={{ color: '#1db954' }}>
                                {teamData.total_nil_value_formatted}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Average NIL Value</p>
                            <p className="text-2xl font-bold" style={{ color: '#1db954' }}>
                                {teamData.avg_nil_value_formatted}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Players Table */}
                <div className="bg-white border-2 border-gray-300 rounded-2xl overflow-hidden mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 p-6 border-b-2 border-gray-300">Team Players</h2>
                    <Box sx={{ width: '100%' }}>
                        <MaterialReactTable table={playersTable} />
                    </Box>
                </div>
            </div>
        </div>
    );
}
