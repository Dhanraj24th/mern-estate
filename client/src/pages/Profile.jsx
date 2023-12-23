import React from 'react'
import { useSelector } from 'react-redux'
export default function Profile() {
  const HandleProfile=(e)=>{

  }
  const currentUser=useSelector(state=>state.user);
  console.log(currentUser)
  return (
    <div className='p-7 max-w-lg mx-auto'>
    <h1 className='text-center my-10 text-3xl font-semibold'>Profile</h1>   
        <form onSubmit={HandleProfile} className='flex flex-col gap-6'>
        <img className='rounded-full size-24 self-center m-2 object-cover ' src={currentUser.currentUser.avatar}/>
    <input type="text" className='p-3 rounded-lg' placeholder='username' value={currentUser.currentUser.username} />
    <input type="text" className='p-3 rounded-lg' placeholder='email' />
    <input type="password " className='p-3 rounded-lg' placeholder='password' />
    <button type='button' className='p-3 rounded-lg bg-red-500 uppercase text-white font-semibold hover:opacity-80 disabled:opacity-80' >Update</button>
    <button type='button' className='p-3 rounded-lg bg-green-500 uppercase text-white font-semibold hover:opacity-80 disabled:opacity-80' >create Listing</button>
    </form>
    <ul className='my-4 flex justify-between text-red-600'>
      <li>Delete Account</li>
      <li>Sign Out</li>
    </ul>
    <h1 className='text-center text-green-600'>Show Listing</h1>
    </div>
  )
}
