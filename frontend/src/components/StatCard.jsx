import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, change, icon, color }) => {
  const isPositive = change !== undefined && change >= 0;
  
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <div className={`p-2 rounded-md ${color}`}>
          {icon}
        </div>
      </div>
      
      <div>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        
        {change !== undefined && (
          <div className={`flex items-center mt-1 text-sm ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositive ? 
              <TrendingUp size={16} className="mr-1" /> : 
              <TrendingDown size={16} className="mr-1" />
            }
            <span>{Math.abs(change)}% {isPositive ? 'increase' : 'decrease'} this month</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
