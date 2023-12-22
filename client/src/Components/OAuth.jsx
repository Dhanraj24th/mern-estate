import React from 'react'
import {GoogleAuthProvider,getAuth, signInWithPopup} from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/userSlice';
import { Navigate, useNavigate } from 'react-router-dom';
export default function OAuth() {
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const handleGoogleClick=async ()=>{
           try {
            const provider=new GoogleAuthProvider();
            const auth=getAuth(app);
            const result=await signInWithPopup(auth,provider);
            const userdata=JSON.stringify({user:result.user.displayName,email:result.user.email,photo:result.user.photoURL});
            console.log(userdata);
            const res=await fetch("/api/auth/google",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:userdata,
            })
            const data= await res.json();
            dispatch(signInSuccess(data)); 
            navigate("/");   
           } catch (error) {
            console.log(error);
           }

    }
  return (
    
     <button onClick={handleGoogleClick} type='button' className='p-3 w-full bg-red-600 rounded-lg hover:opacity-50 uppercase'>Continue with google</button>
    
  )
}
