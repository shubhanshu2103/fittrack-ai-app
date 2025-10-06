import React,{useState,useEffect} from 'react';
import Button from '../components/button.jsx';
import UserProfileCard from '../components/dashboard/UserProfileCard.jsx';  
import WeeklyGoal from '../components/dashboard/WeeklyGoal.jsx';
import AIInsightCard from '../components/dashboard/AIInsightCard.jsx';
import RecentActivity from '../components/dashboard/RecentActivity.jsx';
import api from '../api.js';
import { Link } from 'react-router-dom';  
const DashboardPage = () => {
  const [user, setUser] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [insight, setInsight] = useState('');
  const fetchData = async () => {
      try {
        const [userRes, workoutsRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/workouts')
        ]);
        setUser(userRes.data);
        setWorkouts(workoutsRes.data.slice(0,5));
        const insightRes = await api.post('/ai/generate-insight');
        setInsight(insightRes.data.insight); 

        
      } catch (err) {
        console.error('Failed to fetch user data', err);
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    
    fetchData();
  }, []);

  if (isLoading){
    return <div className='text-center p-12'>Loading...</div>
  }
  const oneWeekAgo= new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate()-7);
  const recentWorkouts=workouts.filter(w=>new Date(w.date)>=oneWeekAgo);



  return (
    <div>
      
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold">Hello, {user?.name}!</h1>
          <p className="text-slate-400 mt-1">Let's check your progress and get you moving.</p>
        </div>
        <Link to="/log-workout">
          <Button className="w-auto px-6">+ Log New Workout</Button>
        </Link>
      </header>

      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-slate-800 p-6 rounded-xl border border-slate-700"><AIInsightCard insight={insight} isLoading={isLoading} /></div>
           <div className="bg-slate-800 p-6 rounded-xl border border-slate-700"><RecentActivity workouts={recentWorkouts} /></div>
        </div>

        
        <div className="space-y-8">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700"><UserProfileCard user={user} /></div>
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700"><WeeklyGoal 
          user={user} 
          workoutsThisWeek={recentWorkouts} 
          onGoalUpdate={fetchData} /></div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
