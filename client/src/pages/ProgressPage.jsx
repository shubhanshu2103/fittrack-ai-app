// client/src/pages/ProgressPage.jsx
import React, { useState, useEffect } from 'react';
import LineChart from '../components/charts/LineChart.jsx';
import api from '../api.js';

const ProgressPage = () => {
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/stats/progress');
        setStats(res.data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Prepare data for the charts
  const chartLabels = stats.map(s => new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

  const workoutsChartData = {
    labels: chartLabels,
    datasets: [{
      label: 'Workouts',
      data: stats.map(s => s.workoutCount),
      borderColor: '#06B6D4',
      backgroundColor: 'rgba(6, 182, 212, 0.1)',
      fill: true,
      tension: 0.4,
    }],
  };

  const volumeChartData = {
    labels: chartLabels,
    datasets: [{
      label: 'Volume (kg)',
      data: stats.map(s => s.totalVolume),
      borderColor: '#06B6D4',
      backgroundColor: 'rgba(6, 182, 212, 0.1)',
      fill: true,
      tension: 0.4,
    }],
  };

  const totalWorkouts = stats.reduce((sum, s) => sum + s.workoutCount, 0);
  const totalVolume = stats.reduce((sum, s) => sum + s.totalVolume, 0);

  if (isLoading) {
    return <div className="text-center p-12">Loading Progress Data...</div>;
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-4xl font-bold">Your Progress</h1>
        <p className="text-slate-400 mt-1">Review your achievements and trends over the last 30 days.</p>
      </header>

      <div className="space-y-8">
        {/* Workouts Completed Card */}
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-4">Workouts Completed: {totalWorkouts}</h2>
          <div className="h-72">
             <LineChart chartData={workoutsChartData} />
          </div>
        </div>

        {/* Volume Lifted Card */}
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-4">Total Volume Lifted: {totalVolume.toLocaleString()} kg</h2>
          <div className="h-72">
            <LineChart chartData={volumeChartData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;