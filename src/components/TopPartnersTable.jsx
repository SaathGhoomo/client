import React, { useState } from 'react';

const TopPartnersTable = ({ data, loading, error }) => {
  const [sortConfig, setSortConfig] = useState({
    key: 'revenue',
    direction: 'descending'
  });

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!data) return [];
    
    const sortableData = [...data];
    if (sortConfig.key !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  const formatCurrency = (value) => {
    return `₹${value.toLocaleString()}`;
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <span className="text-gray-400">↕️</span>;
    }
    return sortConfig.direction === 'ascending' 
      ? <span className="text-blue-500">↑</span>
      : <span className="text-blue-500">↓</span>;
  };

  if (loading) {
    return (
      <div
        className="p-6 rounded-xl"
        style={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}
      >
        <div className="animate-pulse">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="p-6 rounded-xl text-center"
        style={{
          background: 'rgba(239,68,68,0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(239,68,68,0.2)'
        }}
      >
        <div className="text-red-500 text-lg mb-2">👥</div>
        <div className="text-red-700 font-medium">Failed to load partners data</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div
        className="p-6 rounded-xl text-center"
        style={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}
      >
        <div className="text-gray-500 text-lg mb-2">👥</div>
        <div className="text-gray-700 font-medium">No partners data available</div>
      </div>
    );
  }

  return (
    <div
      className="p-6 rounded-xl"
      style={{
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}
    >
      <h3 className="text-lg font-medium mb-6" style={{ color: '#1f2937' }}>
        Top Performing Partners
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ color: '#6b7280' }}>
              <th 
                className="text-left p-3 font-medium cursor-pointer hover:text-blue-500 transition-colors"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Partner Name
                  {getSortIcon('name')}
                </div>
              </th>
              <th 
                className="text-left p-3 font-medium cursor-pointer hover:text-blue-500 transition-colors"
                onClick={() => handleSort('totalBookings')}
              >
                <div className="flex items-center">
                  Total Bookings
                  {getSortIcon('totalBookings')}
                </div>
              </th>
              <th 
                className="text-left p-3 font-medium cursor-pointer hover:text-blue-500 transition-colors"
                onClick={() => handleSort('revenue')}
              >
                <div className="flex items-center">
                  Revenue Generated
                  {getSortIcon('revenue')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((partner, index) => (
              <tr 
                key={index}
                className="border-t hover:bg-blue-50/30 transition-colors"
                style={{ borderColor: 'rgba(255,255,255,0.1)' }}
              >
                <td className="p-3" style={{ color: '#1f2937' }}>
                  <div className="font-medium">{partner.name}</div>
                </td>
                <td className="p-3" style={{ color: '#4b5563' }}>
                  <div className="flex items-center">
                    <span className="mr-2">📅</span>
                    {partner.totalBookings}
                  </div>
                </td>
                <td className="p-3" style={{ color: '#059669' }}>
                  <div className="flex items-center">
                    <span className="mr-2">💰</span>
                    <span className="font-semibold">
                      {formatCurrency(partner.revenue)}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {data.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          Showing top {data.length} performing partners
        </div>
      )}
    </div>
  );
};

export default TopPartnersTable;
