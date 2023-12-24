import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react';
import {app} from '../firebase.js';
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage';
import { updateUserFailure,updateUserStart,updateUserSuccess,deleteUserFailure,deleteUserStart,deleteUserSuccess, signOutUserStart, signOutUserSuccess } from '../redux/userSlice.js';
import { useDispatch } from 'react-redux';
// service firebase.storage {
//   match /b/{bucket}/o {
//     match /{allPaths=**} {
//       allow read;
//       allow write :if
//       request.resource.size< 2* 1024*1024 &&
//       request.resource.contentType.matches('image/.*')
      
//     }
//   }
// }
export default function Profile() {
  const [profile,setProfile]=useState({});
  const [file,setFile]=useState(undefined);
  const [filePerc,setFilePerc]=useState(0);
  
  const [fileUplaodError,setFileUploadError]=useState(false);
  const [UpdateSuccess, setUpdateSuccess] = useState(false);
  const fileref=useRef(null);
  const dispatch=useDispatch();
  const {loading,error}=useSelector((state)=>state.user);
  const currentUser=useSelector(state=>state.user);
  let pdata;
  useEffect(()=>{
    
     // handleFileUpload(file);
  if(file&&file.size>2000000){
    console.log(file.size);
    setFileUploadError(true);
  }
  else{
    setFileUploadError(false);
    {file&&handleFileUpload(file);}
  }
    
  },[file]);

    // const handleImageChange = () => {  
    //   if (file) {
    //     const reader = new FileReader();
  
    //     reader.onload = () => {
    //       setImage(reader.result);
    //     };
  
    //     reader.readAsDataURL(file);
    //   }
    // };
   
  const handleFileUpload=(file)=>{
        const storage = getStorage(app);
    const fileName = new Date().getTime()+ file.name;
    const storageRef =ref(storage,fileName);
    const uploadTask=uploadBytesResumable(storageRef,file);
    uploadTask.on('state_changed',(snapshot)=>{
      const progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
        setFilePerc(Math.round(progress));
    },(error)=>{
      setFileUploadError(true);
    },()=>{
      getDownloadURL(uploadTask.snapshot.ref).then((downlaodURL)=>{
            setProfile({...profile,avatar:downlaodURL});
           console.log(profile);
      })
    });
  }

  const HandleProfile=(event)=>{
    setProfile({...profile,[event.target.id]:event.target.value});
  }
  const UpdateProfile=async (e)=>{
    
   e.preventDefault();
   console.log(profile);
   if(profile!==null){
   try {
    dispatch(updateUserStart());
      const res=await fetch(`/api/user/update/${currentUser.currentUser._id}`,{method:'POST',
      headers:{
         'content-type':'application/json',  
      },
      body:JSON.stringify(profile),
    });
    const data=await res.json();
    if(data.success==false){
      dispatch(updateUserFailure(data.message));
      return;
    }
    setUpdateSuccess(true);
    dispatch(updateUserSuccess(data));
   } catch (error) {
    dispatch(updateUserFailure(error.message));
   } }
  };
   const DeleteAccount=async ()=>{
          try {
                dispatch(deleteUserStart());
          const res=  await fetch(`/api/user/delete/${currentUser.currentUser._id}`,{
              method:"delete",
              headers:{
                "content-type":"application/json"
              }
            });
            const data=await res.json();
            console.log(data);  
            if(data.success==false){
              dispatch(deleteUserFailure(data.message));
              return;
            }
           dispatch(deleteUserSuccess(data));
          } catch (error) {
            console.log(error.message);
            dispatch(deleteUserFailure(error.message));
          }
   }
  const SignOut=async()=>{
          try {
            dispatch(signOutUserStart());
            const res= await fetch(`/api/user/delete/${currentUser.currentUser.id}`,{
              method:"get",
              headers:{
                "content-type":"application/json"
              }
            })
            const data =await res.json()
            if(data.success==false){
              dispatch(signOutUserFailure(data.message));
              return;
            }
            dispatch(signOutUserSuccess(data))
          } catch (error) {
            console.log(error.message);
            dispatch(deleteUserFailure(error.message));
          }
  }
  return (
    <div className='p-7 max-w-lg mx-auto'>
    <h1 className='text-center my-10 text-3xl font-semibold'>Profile</h1>
    <input type='file' onChange={(e)=>{setFile(e.target.files[0]); setFilePerc(0)}} ref={fileref} hidden accept='image/*'/> 
        <form onSubmit={UpdateProfile} className='flex flex-col gap-6' >
        <img onClick={()=>{fileref.current.click();}} className='rounded-full size-24 self-center m-2 object-cover cursor-pointer' src={profile.avatar||currentUser.currentUser.avatar}/>
        <p className='text-center'>{fileUplaodError  ?(<span className='text-red-700'>"Error Image upload <span className='text-red-800 text-sm'>img must less than 2 mb</span></span>):(filePerc>0&&filePerc<100?(<span className='text-slate-600'>{`uploading ${filePerc}%`}</span>):(filePerc==100)?(<span className='text-green-800'>Image successfully uploaded !</span>):(""))}</p>
    <input onChange={HandleProfile} type="text" className='p-3 rounded-lg' placeholder='username' defaultValue={currentUser.currentUser.username} id='username' />
    <input onChange={HandleProfile} type="text" className='p-3 rounded-lg' placeholder='email' defaultValue={currentUser.currentUser.email} id='email'/>
    <input onChange={HandleProfile} type="password" className='p-3 rounded-lg' placeholder='password' id='password'/>
    <button disabled={loading} type='submit' className='p-3 rounded-lg bg-red-500 uppercase text-white font-semibold hover:opacity-80 disabled:opacity-80' >{loading ? "Loading" : "update"}</button>

    <button type='button' className='p-3 rounded-lg bg-green-500 uppercase text-white font-semibold hover:opacity-80 disabled:opacity-80' >create Listing</button>
    </form>
    <ul className='my-4 flex justify-between text-red-600'>
      <li onClick={DeleteAccount} className='cursor-pointer'>Delete Account</li>
      <li onClick={SignOut}>Sign Out</li>
    </ul>
    <h1 className='text-center text-green-600'>Show Listing</h1>
    {error&&<p className='text-red-500'>{error.message}</p>}
    {UpdateSuccess?<p className='text-green-500'>Update successful</p>:""}
    </div>
  )
}
