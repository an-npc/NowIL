import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Box } from '@mui/material';

export default function AllPlayersPage() {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

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
            onClick={() => navigate(`/players/${row.original.rank}`)}
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
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: true,
    enableSorting: false,
    state: {
      pagination,
    },
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