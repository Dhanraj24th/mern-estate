import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignIn() {
  const [loginData, setLoginData] = useState({});
  const [loading, setLoading] = useState(false);
  const [err, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    setLoginData({ ...loginData, [e.target.id]: e.target.value });
  };

  const submitData = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signin", {
        method: 'POST',
        body: JSON.stringify(loginData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (data.statusCode === 401||data.statusCode === 404) {
        console.log(data);
        setError(data.message);
        return;
      } else {
        setError(data.message);
        // Consider redirecting to a different page upon successful sign-in
        navigate("/"); // Change "/dashboard" to your desired route
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('An error occurred while processing your request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-7 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center my-7 font-semibold'>Sign In</h1>
      <form className='flex flex-col gap-6' onSubmit={submitData}>
        <input
          onChange={handleLogin}
          id="email"
          type="email"
          className='p-3 rounded-lg focus:outline-none'
        />
        <input
          onChange={handleLogin}
          id="password"
          type='password'
          className='p-3 rounded-lg focus:outline-none'
        />
        <button
          disabled={loading}
          className='bg-slate-700 p-3 rounded-lg text-blue-400 disabled:opacity-35'
        >
          {loading ? "Loading" : "Sign In"}
        </button>
      </form>
      <div className='my-4'>
        <p>
          Don't have an account?{' '}
          <Link to='/sign-up'>
            <span className='text-blue-400'>Sign Up</span>
          </Link>
        </p>
      </div>
      {err && <p>{err}</p>}
    </div>
  );
}
