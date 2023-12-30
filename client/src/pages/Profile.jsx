import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react';
import {app} from '../firebase.js';
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage';
import { updateUserFailure,updateUserStart,updateUserSuccess,deleteUserFailure,deleteUserStart,deleteUserSuccess, signOutUserStart, signOutUserSuccess,signOutUserFailure } from '../redux/userSlice.js';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
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
  const targetRef=useRef(null);
  const [fileUplaodError,setFileUploadError]=useState(false);
  const [UpdateSuccess, setUpdateSuccess] = useState(false);
  const fileref=useRef(null);
  const dispatch=useDispatch();
  const {loading,error}=useSelector((state)=>state.user);
  const currentUser=useSelector(state=>state.user);
  const [listData,setListData]=useState([]);
  const [listLoading,setListLoading]=useState(false);
  const [listLoadingError,setListLoadingError]=useState(false);
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
    console.log("signout")
           try {
           dispatch(signOutUserStart());
           const res= await fetch(`/api/user/signout/${currentUser.currentUser._id}`,{
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
  console.log(listData)
  const HandleListing=async (e)=>{
      e.preventDefault();
      
      setListLoading(true);
      try {
        const res=await fetch(`/api/listing/read/${currentUser.currentUser._id}`,{
          headers:{
            "content-type":"application/json"
          },
          method:'get',
        })
      const data= await res.json();
      if(data.success==false){
        setListLoading(false);
        setListLoadingError(data.message);
        return;
      }
      
      console.log(data);
     const timeout= setTimeout(() => {
        handleScroll();
      }, 1000);
      setListLoading(false);
      setListData(data);
      } catch (error) {
        setListLoading(false);
        setListLoadingError(error.message);
      }
  }
  const handleScroll = () => {
    console.log("scroller")
    if (targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const HandleListDelete=async (id,userRef)=>{
    console.log(id,userRef);
    try {
      const res=await fetch(`/api/listing/delete/${id}`,{headers: { 'content-type':"application/json"},
    body:JSON.stringify({userid:userRef}),
    method:"delete"
    }
    );
    const data=await res.json();
    if(data.success==false){
      console.log(data.message);
      return
    }
    console.log(data);
    const filterdata=listData.filter((list)=>list._id!=id);
    setListData(filterdata);
    } catch (error) {
      console.log(error);
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
     <Link to={'/create-listing'} className='p-3 rounded-lg bg-green-500 uppercase text-white font-semibold hover:opacity-80 disabled:opacity-80 text-center'>
    <button type='button'  >Create Listing</button>
    </Link>
    </form>
    <ul className='my-4 flex justify-between text-red-600'>
      <li onClick={DeleteAccount} className='cursor-pointer'>Delete Account</li>
      <li onClick={SignOut} className='cursor-pointer'>Sign Out</li>
    </ul>
    {listData.length<1&&<button onClick={(e)=>{HandleListing(e);}}  className='text-center justify-center text-green-600'>Show Listing</button>}
    {error&&<p className='text-red-500'>{error.message}</p>}
    {UpdateSuccess?<p className='text-green-500'>Update successful</p>:""}
    {listData&& listData.length > 0 &&
<div ref={targetRef} className='flex flex-col gap-5 mt-4'>
  <p className='text-center font-semibold text-2xl'>Your Listings</p>
  {
     
    listData.map((listing, key) => (
      <div key={key + listing._id} className='flex flex-row items-center border border-solid border-slate-300 rounded p-2'>
        <div className='flex mr-auto items-center '>
          <img src={listing.imageUrls[0]} className='w-20 h-12 object-contain' />
          <p className='ml-2 font-semibold font-sans'>{listing.name}</p>
        </div>
        <div className='flex flex-col items-center'>
          <button className='text-red-500 uppercase' onClick={()=>{HandleListDelete(listing._id,listing.userRef)}}>delete</button>
          <button className='text-green-500 uppercase'>edit</button>
        </div>
      </div>
    ))}
  </div>
}
     
    </div>
  )
}
