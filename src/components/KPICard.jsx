import React from 'react';

const KPICard = ({ title, value, icon, trend, loading, error }) => {
  const formatValue = (value) => {
    if (typeof value === 'number') {
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
      }
      return value.toLocaleString();
    }
    return value;
  };

  const getTrendIcon = (trend) => {
    if (!trend) return null;
    return trend > 0 ? '📈' : trend < 0 ? '📉' : '➡️';
  };

  const getTrendColor = (trend) => {
    if (!trend) return 'text-gray-500';
    return trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-gray-500';
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
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-3"></div>
          <div className="h-8 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3"></div>
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
        <div className="text-red-500 text-lg mb-2">⚠️</div>
        <div className="text-red-700 font-medium">Failed to load data</div>
      </div>
    );
  }

  return (
    <div
      className="p-6 rounded-xl hover:scale-105 transition-transform duration-200"
      style={{
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className="text-2xl mr-3">{icon}</span>
          <h3 className="text-lg font-medium" style={{ color: '#1f2937' }}>
            {title}
          </h3>
        </div>
        {trend !== undefined && (
          <div className={`flex items-center ${getTrendColor(trend)}`}>
            <span className="text-sm mr-1">{getTrendIcon(trend)}</span>
            <span className="text-sm font-medium">
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          </div>
        )}
      </div>
      
      <div className="text-3xl font-bold" style={{ color: '#1f2937' }}>
        {formatValue(value)}
      </div>
    </div>
  );
};

export default KPICard;
