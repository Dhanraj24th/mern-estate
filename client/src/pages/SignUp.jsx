import React from 'react'
import { Link } from 'react-router-dom'

export default function SignUp() {
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center my-7 font-semibold '>Sign Up</h1>
      <form className='flex flex-col gap-4'>
        <input type='text' placeholder='username' className='border p-3 rounded-xl focus:outline-none' ></input>
        <input type='email' placeholder='email' className='border p-3 rounded-xl focus:outline-none'></input>
        <input type='password' placeholder='password' className='border p-3 rounded-xl focus:outline-none'></input>
        <button className='bg-slate-700  p-3 rounded-xl text-fuchsia-500 -300 uppercase hover:opacity-80 disabled:opacity-80'>Sign Up</button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have a account ?</p>
        <Link>
          <span className='text-cyan-600'>Sign in</span>
        </Link>
        </div>      
    </div>
  )
}
