import React from 'react';
import { FaBrain } from 'react-icons/fa';
const AIInsightCard = ({ insight, isLoading }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-2xl border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
      <div className="flex items-start space-x-4">
        <div className="bg-cyan-500/10 p-3 rounded-full">
          <FaBrain className="text-cyan-400" size={20} />
        </div>
        <div>
          <h3 className="font-bold text-white text-lg mb-2">Your Weekly AI Insight</h3>
          {isLoading ? (
            
            <div className="space-y-2">
              <div className="h-4 bg-slate-700 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-slate-700 rounded w-1/2 animate-pulse"></div>
            </div>
          ) : (
            <p className="text-slate-400 text-sm leading-relaxed">
              {insight}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIInsightCard;
