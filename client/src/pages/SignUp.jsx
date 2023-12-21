import React, { useState } from 'react'
import { Link ,useNavigate} from 'react-router-dom'

export default function SignUp() {
  const [formData,setFormData]=useState({});
  const [Loding,setLoading]=useState(false);
  const [err,setError]=useState(null);
  const navigate=useNavigate();
  const handleChange=(e)=>{
       setFormData({...formData, [e.target.id]:e.target.value});
  }
  const handleSubmit=async (e)=>{
    setLoading(true)
    e.preventDefault();
    const res=await fetch('/api/auth/signup',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      body:JSON.stringify(formData),
    })
    const data =await res.json();
    setError(data.message);
    console.log(typeof(err))
    if(data.statusCode==500){
      setLoading(false);
      setError("Email or Password is already used");
      return
  }
    else{
      console.log("elseee");
      setLoading(false);
      setError(data.message);
      navigate('/sign-in');
    }
  
    setLoading(false);
    console.log(data);

  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center my-7 font-semibold '>Sign Up</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input id="username" type='text' placeholder='username' className='border p-3 rounded-xl focus:outline-none' onChange={handleChange}></input>
        <input id="email" type='email' placeholder='email' className='border p-3 rounded-xl focus:outline-none'onChange={handleChange}></input>
        <input id="password" type='password' placeholder='password' className='border p-3 rounded-xl focus:outline-none'onChange={handleChange}></input>
        <button disabled={Loding} className='bg-slate-700  p-3 rounded-xl text-fuchsia-500 -300 uppercase hover:opacity-80 disabled:opacity-80'>{Loding?"loading...." :"Sign Up"}</button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have a account ?</p>
        <Link to='/sign-in'>
          <span className='text-cyan-600'>Sign in</span>
        </Link>
        </div>
        {err&& <p className='text-red-500 mt-5' >{err}</p>}      
    </div>
  )
}
