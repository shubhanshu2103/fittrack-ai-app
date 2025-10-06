// client/src/pages/WorkoutsPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiSearch } from 'react-icons/fi';
import api from '../api.js'; 

const WorkoutsPage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await api.get('/workouts');
        setWorkouts(res.data);
      } catch (err) {
        setError('Failed to fetch workouts.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorkouts();
  }, []); 

  return (
    <div>
      
      <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold">Workout Log</h1>
          <p className="text-slate-400 mt-1">Review your past workouts and track your progress over time.</p>
        </div>
        <Link to="/log-workout" className="w-auto px-6 py-3 font-bold text-white rounded-full transition-all duration-300 bg-cyan-600 hover:bg-cyan-500 active:scale-95 flex items-center gap-2">
          <FiPlus /> New Workout
        </Link>
      </header>

      {/* Filters and Search Section (functionality can be added later) */}
      <div className="flex items-center gap-4 mb-6">
        {/* ... filter inputs ... */}
      </div>

      {/* Workouts Table */}
      <div className="bg-slate-800/50 rounded-lg border border-slate-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-800 text-sm text-slate-400">
            <tr>
              <th className="p-4">Workout</th>
              <th className="p-4">Date</th>
              <th className="p-4">Exercises</th>
              <th className="p-4 hidden md:table-cell">Total Volume (kg)</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="4" className="text-center p-8">Loading...</td></tr>
            ) : error ? (
              <tr><td colSpan="4" className="text-center p-8 text-red-500">{error}</td></tr>
            ) : workouts.length === 0 ? (
              <tr><td colSpan="4" className="text-center p-8">No workouts logged yet.</td></tr>
            ) : (
              workouts.map((workout) => {
                // Calculate total volume for the workout
                const totalVolume = workout.exercise.reduce((sum, ex) => sum + (ex.sets * ex.reps * (ex.weightKg || 0)), 0);
                
                return (
                  <tr key={workout.id} className="border-t border-slate-700 hover:bg-slate-800 transition-colors duration-200">
                    <td className="p-4 font-bold">{workout.name}</td>
                    <td className="p-4 text-slate-300">{new Date(workout.date).toLocaleDateString()}</td>
                    <td className="p-4 text-slate-300">{workout.exercise.length}</td>
                    <td className="p-4 text-slate-300 hidden md:table-cell">{totalVolume.toLocaleString()} kg</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkoutsPage;