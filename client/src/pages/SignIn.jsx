import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import  {useDispatch, useSelector} from 'react-redux';
import { signInFailure,signInStart, signInSuccess } from '../redux/userSlice';
import OAuth from '../Components/OAuth';
export default function SignIn() {
  const [loginData, setLoginData] = useState({});
const {loading,error}=useSelector((state)=>state.user);
  const navigate = useNavigate();
const dispatch=useDispatch();
  const handleLogin = (e) => {
    setLoginData({ ...loginData, [e.target.id]: e.target.value });
  };

  const submitData = async (e) => {
    e.preventDefault();
      dispatch(signInStart());

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
        dispatch(signInFailure(data.message));
        return;
      } else {
        dispatch(signInSuccess(data));
        // Consider redirecting to a different page upon successful sign-in
        navigate("/"); // Change "/dashboard" to your desired route
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
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
        <OAuth/>
      </form>
      <div className='my-4'>
        <p>
          Don't have an account?{' '}
          <Link to='/sign-up'>
            <span className='text-blue-400'>Sign Up</span>
          </Link>
        </p>
      </div>
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  );
}
