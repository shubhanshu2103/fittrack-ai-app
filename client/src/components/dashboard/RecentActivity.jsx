import React from 'react';
import { FaDumbbell, FaRunning, FaYinYang,FaSwimmer } from 'react-icons/fa'; // Icons for different activities

const getIconForworkout = (workouts)=>{
  const name=workouts.toLowerCase()
  if (name.includes('run') || name.includes('jog')){
    return <FaRunning size={20} />
  }
  if (name.includes('swim')){
    return <FaSwimmer size={20} />
  }
  if (name.includes('yoga')){
    return <FaYinYang size={20} />
  }
  return <FaDumbbell size={20} />
}



const RecentActivity = ({ workouts }) => {
  
  return (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
      <h3 className="font-bold text-white text-lg mb-4">Recent Activity</h3>
      {workouts && workouts.length>0?(
        <ul className="space-y-4">
          {workouts.map(workout => (
            <li key={workout.id} className="flex items-center space-x-4 p-3 bg-slate-900/50 rounded-lg hover:bg-slate-700/50 transition-colors duration-200 cursor-pointer">
              <div className="bg-slate-800 p-3 rounded-full text-cyan-400">
                {getIconForworkout(workout.name)}
              </div>
              <div className="flex-grow">
                <p className="font-bold text-white">{workout.name}</p>
                <p className="text-xs text-slate-400">{new Date(workout.date).toLocaleDateString('en-us',{month:'long', day:'numeric', year:'numeric'})}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-white">{workout.exercises?.length||0} exercises </p>
                
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-400 text-sm">No recent activity</p>
      )}
    </div>
  );
};

export default RecentActivity;
            
