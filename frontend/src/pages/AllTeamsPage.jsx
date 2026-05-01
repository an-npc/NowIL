import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Box } from '@mui/material';
import { fetchAPIJson } from '../api/api-funcs';

export default function AllTeamsPage() {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [allUniversities, setAllUniversities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadTeams() {
      try {
        setIsLoading(true);
        setError('');

        const params = new URLSearchParams({ limit: '1000', offset: '0' });
        const data = await fetchAPIJson('/teams/data', params);
        const usdFormatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0,
        });

        const mapped = data.map((team, index) => ({
          id: index + 1,
          teamId: team.team_id,
          school: team.school,
          sport: team.sport,
          logo: team.logo_url,
          totalPlayers: team.total_players,
          totalNilValue: usdFormatter.format(team.total_nil_value),
          avgNilValue: usdFormatter.format(team.avg_nil_value),
        }));

        if (isMounted) {
          setAllUniversities(mapped);
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to load teams from the API.');
          setAllUniversities([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadTeams();

    return () => {
      isMounted = false;
    };
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: '#',
        size: 50,
        Cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: 'logo',
        header: 'LOGO',
        size: 80,
        Cell: ({ row }) => (
          <button
            onClick={() => navigate(`/team/${row.original.teamId}`)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <img src={row.original.logo} alt="logo" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
          </button>
        ),
      },
      {
        accessorKey: 'school',
        header: 'SCHOOL',
        Cell: ({ row }) => (
          <button
            onClick={() => navigate(`/team/${row.original.teamId}`)}
            style={{ color: '#2563eb', fontWeight: 'bold', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'none' }}
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
          >
            {row.original.school}
          </button>
        ),
      },
      {
        accessorKey: 'sport',
        header: 'SPORT',
      },
      {
        accessorKey: 'totalPlayers',
        header: 'TOTAL PLAYERS',
        Cell: ({ cell }) => (
          <span style={{ color: '#2563eb', fontWeight: 'bold' }}>
            {cell.getValue()}
          </span>
        ),
      },
      {
        accessorKey: 'totalNilValue',
        header: 'TOTAL NIL VALUE',
        Cell: ({ cell }) => (
          <span style={{ color: '#16a34a', fontWeight: 'bold' }}>
            {cell.getValue()}
          </span>
        ),
      },
      {
        accessorKey: 'avgNilValue',
        header: 'AVG NIL VALUE',
        Cell: ({ cell }) => (
          <span style={{ color: '#16a34a', fontWeight: 'bold' }}>
            {cell.getValue()}
          </span>
        ),
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: allUniversities,
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
        <h1 className="text-5xl font-bold text-gray-900 mb-8">All Teams Tracked</h1>
        <Box sx={{ width: '100%' }}>
          <MaterialReactTable table={table} />
        </Box>
      </div>
    </div>
  );
}