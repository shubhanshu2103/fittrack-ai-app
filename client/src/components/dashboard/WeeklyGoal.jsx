import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../api.js';
import { FiEdit2, FiSave } from 'react-icons/fi';

const WeeklyGoal = ({ user, workoutsThisWeek, onGoalUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [goal, setGoal] = useState(user?.weeklyWorkoutGoal || 4);
  const [isLoading, setIsLoading] = useState(false);

  
  useEffect(() => {
    setGoal(user?.weeklyWorkoutGoal || 4);
  }, [user]);

  const completed = workoutsThisWeek?.length || 0;
  const progressPercentage = goal > 0 ? (completed / goal) * 100 : 0;

  const handleSaveGoal = async () => {
    setIsLoading(true);
    try {
      await api.put('/user/goal', { goal: parseInt(goal, 10) });
      toast.success('Goal updated successfully!');
      setIsEditing(false);
      onGoalUpdate(); 
    } catch (error) {
      toast.error('Failed to update goal.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-white">Weekly Goal</h3>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="text-slate-400 hover:text-white">
            <FiEdit2 />
          </button>
        ) : (
          <button onClick={handleSaveGoal} disabled={isLoading} className="text-green-400 hover:text-green-300 disabled:text-slate-600">
            <FiSave />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="flex items-center gap-2">
          <input 
            type="number"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-16 p-1 bg-slate-700 text-white rounded-md text-center"
          />
          <span className="text-sm text-slate-400">workout sessions this week.</span>
        </div>
      ) : (
        <p className="text-sm text-slate-400 mb-4">
          You've completed {completed} out of {goal} sessions this week.
        </p>
      )}

      
      <div className="w-full bg-slate-700 rounded-full h-2.5 mt-4">
        <div 
          className="bg-cyan-500 h-2.5 rounded-full transition-all duration-500" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default WeeklyGoal;