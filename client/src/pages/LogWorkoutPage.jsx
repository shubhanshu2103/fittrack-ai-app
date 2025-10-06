// client/src/pages/LogWorkoutPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api.js';
import Button from '../components/button.jsx';
import Input from '../components/input.jsx';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

const LogWorkoutPage = () => {
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState([
    { name: '', sets: '', reps: '', weightKg: '' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  
  const handleExerciseChange = (index, event) => {
    const values = [...exercises];
    values[index][event.target.name] = event.target.value;
    setExercises(values);
  };

  
  const handleAddExercise = () => {
    setExercises([...exercises, { name: '', sets: '', reps: '', weightKg: '' }]);
  };

  
  const handleRemoveExercise = (index) => {
    if (exercises.length > 1) { 
        const values = [...exercises];
        values.splice(index, 1);
        setExercises(values);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const workoutData = {
      name: workoutName,
     
      exercises: exercises
        .filter(ex => ex.name)
        .map(ex => ({
          ...ex,
          sets: parseInt(ex.sets, 10),
          reps: parseInt(ex.reps, 10),
          weightKg: parseFloat(ex.weightKg) || 0,
        })),
    };

    try {
      await api.post('/workouts', workoutData);
      toast.success('Workout logged successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to log workout. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-4xl font-bold">Log New Workout</h1>
        <p className="text-slate-400 mt-1">Add your exercises below to save your session.</p>
      </header>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
        <Input
          type="text"
          name="workoutName"
          placeholder="Workout Name (e.g., Push Day, Morning Run)"
          value={workoutName}
          onChange={(e) => setWorkoutName(e.target.value)}
          required
        />

        {/* Dynamic Exercise List */}
        <div className="space-y-4">
          {exercises.map((exercise, index) => (
            <div key={index} className="flex items-end gap-2 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 flex-grow">
                <Input name="name" placeholder="Exercise Name" value={exercise.name} onChange={e => handleExerciseChange(index, e)} required />
                <Input name="sets" type="number" placeholder="Sets" value={exercise.sets} onChange={e => handleExerciseChange(index, e)} required />
                <Input name="reps" type="number" placeholder="Reps" value={exercise.reps} onChange={e => handleExerciseChange(index, e)} required />
                <Input name="weightKg" type="number" placeholder="Weight (kg)" value={exercise.weightKg} onChange={e => handleExerciseChange(index, e)} />
              </div>
              <button type="button" onClick={() => handleRemoveExercise(index)} className="p-3 text-red-500 hover:text-red-400 disabled:text-slate-600" disabled={exercises.length === 1}>
                <FiTrash2 size={20}/>
              </button>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button type="button" onClick={handleAddExercise} className="flex items-center gap-2 font-semibold text-cyan-400 hover:text-cyan-300">
            <FiPlus /> Add Exercise
          </button>
          <Button type="submit" disabled={isLoading} className="w-auto px-8">
            {isLoading ? 'Saving...' : 'Save Workout'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LogWorkoutPage;