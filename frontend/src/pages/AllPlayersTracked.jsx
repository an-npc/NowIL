import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Box } from '@mui/material';
import { fetchAPIJson } from '../api/api-funcs';

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

export default function AllPlayersPage() {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [allPlayers, setAllPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadPlayers() {
      try {
        setIsLoading(true);
        setError('');

        const params = new URLSearchParams({ limit: '1000', offset: '0' });
        const data = await fetchAPIJson('/players', params);
        const usdFormatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0,
        });

        const mapped = data.map((player, index) => ({
          rank: index + 1,
          playerId: player.player_id,
          name: `${player.first_name} ${player.last_name}`,
          college: player.school,
          sport: player.sport,
          pos: player.position,
          nilValue: usdFormatter.format(player.nil),
          nilChange: `${player.nil_delta >= 0 ? '+' : ''}${(player.nil_delta * 100).toFixed(2)}%`,
        }));

        if (isMounted) {
          setAllPlayers(mapped);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load players from the API.');
          setAllPlayers([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPlayers();

    return () => {
      isMounted = false;
    };
  }, []);

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
            View Stats →
          </button>
        ),
      },
    ],
    [navigate],
  );

  const table = useMaterialReactTable({
    columns,
    data: allPlayers,
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

  return (
    <div className="flex-1 overflow-auto">
      <div className="pt-4 px-8 pb-8">
        <h1 className="text-5xl font-bold text-gray-900 mb-8">All Tracked Players</h1>
        <Box sx={{ width: '100%' }}>
          <MaterialReactTable table={table} />
        </Box>
      </div>
    </div>
  );
}