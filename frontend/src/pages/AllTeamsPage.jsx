import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Box } from '@mui/material';
import alabamaLogo from '../assets/ua-logo.png';
import vanderbiltLogo from '../assets/v-logo.png';
import lsuLogo from '../assets/lsu-logo.png';
import olemissLogo from '../assets/olemiss.png';
import floridaLogo from '../assets/uf-logo.png';

export default function AllTeamsPage() {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

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
        Cell: ({ cell }) => (
          <img src={cell.getValue()} alt="logo" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
        ),
      },
      {
        accessorKey: 'name',
        header: 'UNIVERSITY NAME',
      },
      {
        accessorKey: 'playersTracked',
        header: 'PLAYERS TRACKED',
        Cell: ({ cell }) => (
          <span style={{ color: '#2563eb', fontWeight: 'bold' }}>
            {cell.getValue()}
          </span>
        ),
      },
      {
        accessorKey: 'teamsTracked',
        header: 'TEAMS TRACKED',
        Cell: ({ cell }) => (
          <span style={{ color: '#2563eb', fontWeight: 'bold' }}>
            {cell.getValue()}
          </span>
        ),
      },
      {
        accessorKey: 'slug',
        header: 'VIEW TEAMS',
        Cell: ({ row }) => (
          <a
            href={`/teams/all/${row.original.slug}`}
            style={{ color: '#2563eb', fontWeight: 'bold', textDecoration: 'none', cursor: 'pointer' }}
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
          >
            View Teams →
          </a>
        ),
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: allUniversities,
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
        <h1 className="text-5xl font-bold text-gray-900 mb-8">All Teams Tracked</h1>
        <Box sx={{ width: '100%' }}>
          <MaterialReactTable table={table} />
        </Box>
      </div>
    </div>
  );
}