import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { name, email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      toast.success('Registration successful! Please log in.');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-slate-800/50 rounded-2xl shadow-2xl border border-slate-700 text-center">
      <div>
        <h1 className="text-3xl font-bold text-white">FitTrack AI</h1>
        <p className="mt-2 text-xl text-slate-300">Create Your Account</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-6">
        <Input name="name" type="text" placeholder="Full Name" value={name} onChange={onChange} required />
        <Input name="email" type="email" placeholder="Email Address" value={email} onChange={onChange} required />
        <Input name="password" type="password" placeholder="Password" value={password} onChange={onChange} required />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>
      <p className="text-sm text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-cyan-500 hover:text-cyan-400">Log In</Link>
      </p>
    </div>
  );
};
export default RegisterPage;
