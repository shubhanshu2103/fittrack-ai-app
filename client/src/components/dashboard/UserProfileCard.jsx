import react from 'react';
import {  FiBarChart2 } from "react-icons/fi";
import {Link} from 'react-router-dom';

const UserProfileCard = ({ user }) => {
    // dummy data as placeholder
    
    const iconButtonStyle="bg-slate-700/50 p-3 rounded-full text-slate-300 hover:text-white hover:bg-slate-600 transition-colors duration-200";
    if (!user){
        return null
    }
    return(
        <div className ="bg-slate-800 p-6 rounded-2xl border border-slate-700 text-center flex flex-col items-center">
            <img 
            src={`https://i.pravatar.cc/150?u=${user.email}`}
            alt={user.name}
            className="w-24 h-24 rounded-full mb-4 border-4 border-cyan-500"/>
            <h2 className="text-xl font-bold text-white ">{user.name}</h2>
            <p className="text-sm text-slate-400 mb-6">{user.level}</p>
            <div className="flex item-center space-x-4">
               <Link to="/progress">
                   <button className={iconButtonStyle} aria-label="View Progress">
                       <FiBarChart2 />
                   </button>
               </Link>
            </div>
        </div>
    );
};
export default UserProfileCard;