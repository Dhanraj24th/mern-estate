import React from 'react'
import { useState } from 'react';
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage';
import {app} from '../firebase.js';
import { useEffect } from 'react';

import { useLocation } from 'react-router-dom';
export default function UpdateListing() {
  const location=useLocation();
  const recevied= location.state?.data;
  const [files,setFiles]=useState([]);
  const [uploading,setUploading]=useState(false);
  const [formData,setFormData]=useState({});
  const [loading,setloading]=useState(false);
  const [listError,setListError]=useState(" ");
  console.log(formData);
  const[imageUploadError,setImageUplaodError]=useState(true);
  
  useEffect(()=>{
    setFormData(recevied); 
    setImage(recevied.imageUrls);           
  },[])
  const HandleSubmitList=async (e) =>{
          e.preventDefault();
          if(formData.imageUrls.length<1 ){
            setImageUplaodError("select atleast one image and click upload");
            return;
          }
          if(formData.regularPrice<formData.discountedPrice){
            setListError("Discounted price must be lower Than Regular price");
            return;
          }
          setloading(true);
          try {
            const res=await fetch(`/api/listing/update/${formData._id}`,{
              method:'put',
              headers:{
                'content-type':'application/json'
              },
              body:JSON.stringify(formData)
            })
            const data =await res.json();
            setloading(false);
  
            if(data.success==false){
              setloading(false);
                setListError(data.message);
            }
           
            setloading(false);
            setListError(false);
           // navigate(`/listing/${data._id}`);
          } catch (error) {
            setloading(false);
              setListError(error.message);
          }
          
  }
  const HandleImageSubmit=async (e)=>{
     e.preventDefault();
     setloading(true);
    console.log(image.length);
        if(image.length+formData.imageUrls.length<7&&image.length>0){
          const promises=[];
         
          for (let index in files) {
            if(files[index].size>2000000){
              setloading(false);
              return setImageUplaodError(`files size must less than (2mb) :${files[index].name}`);
            }
          }
          for (let index in files) {
               promises.push(storeImage(files[index]));
          }
          Promise.all(promises).then((urls)=>{
            setFormData({...formData,
            imageUrls:formData.imageUrls.concat(urls)});
            
            setImageUplaodError(false);            
          }).catch((error)=>{
            console.log(error)
            setUploading(false);
            setImageUplaodError("image processing error");
          });
          setUploading(false);
          setloading(false);
        }else{
          setUploading(false);
          setloading(false);
          setImageUplaodError("You Can Only upload 6 images per listing")
        }
  };
  const [image, setImage] = useState(false);
  console.log(image);
  const handleImageChange = (e) => {
    const file = e.target.files;
    setloading(true);
    const promises = [];
    if (file) {
      for (let i = 0; i < file.length; i++) {
        promises.push(imageProcess(file[i]));
      }
    }
    Promise.all(promises)
      .then((urls) => {
        console.log(urls);
        setImage(urls);
      })
      .catch((error) => {
        console.log(error)
        setloading(false);
        setImageUplaodError("image processing error");
      });
    setloading(false);
  };

  const imageProcess = (file) => {
    return new Promise((resolve, reject) => {
      try {
        if (file) {
          const reader = new FileReader();

          reader.onloadend = () => {

            resolve({name:file.name,url:reader.result});
          };

          reader.readAsDataURL(file);
        } else {
          reject("file error");
        }
      } catch (error) {
        reject(error);
      }
    });
  
          
    }
  const storeImage=async(files)=>{
      
        return new Promise((resolve,reject)=>{
          const storage=getStorage(app);
          const fileName=new Date().getTime()+files.name;
          const storageRef=ref(storage,fileName);
          const uploadTask =uploadBytesResumable(storageRef,files);
          uploadTask.on(
            'state_changed',
            (snapshot)=>{
              const progress=
              (snapshot.bytesTransferred/snapshot.totalBytes)*100;
              console.log(`Upload is ${progress}% done`);
              setUploading(`Upload is ${progress}% done`);
            },
            (error)=>{
              reject(error);
            },
            ()=>{
              getDownloadURL(uploadTask.snapshot.ref).then((downlaodURL)=>{
                resolve(downlaodURL);
                
              });
            }
          )

        })
  }
  console.log(files);
 const deleteImage=(name,e)=>{
  e.preventDefault();
    console.log(name);
   const disfiles={...files};
   console.log(disfiles);
   for (const key in files) {
    if (files[key].name==name) {
        delete disfiles[key];
        break;
    }
  }
  setFiles(disfiles);
    const newImagedata=image.filter(e=>e.name!=name);
    setImage(newImagedata);
 }

 const handleChange=(e)=>{
              if(e.target.id=='sell'||e.target.id=='rent')
              {
                 setFormData({...formData,type:e.target.id})
              }
              if(e.target.id=='parking'||e.target.id=="furnished"||e.target.id=="offer"){
                 setFormData({...formData,[e.target.id]:e.target.checked})
              }
              if(e.target.type=='number'||e.target.type=="text"||e.target.type=="textarea")
              {
                setFormData({...formData,[e.target.id]:e.target.value});
              }
 }
 console.log(formData)
  return (
    <main className='max-w-4xl mx-auto'>
        <h1 className='text-center font-semibold text-3xl p-3 my-4'>Update Listing</h1>
        <form onSubmit={HandleSubmitList} className='flex flex-col sm:flex-row my-8 gap-8'>
              <div className='flex flex-col gap-4 flex-1'>
            
              <input type="text" required onChange={handleChange} className='rounded-lg p-3' id='name' placeholder='Name' value={formData.name}/>
              <textarea rows={4} required type="text" onChange={handleChange} value={formData.description} className='rounded-lg p-3 h-14 resize-none'id='description' placeholder='Description'/>
              <input type="text" required onChange={handleChange} value={formData.address} className='rounded-lg p-3' id='address' placeholder='Address' />
                
              <div className='flex flex-wrap gap-3'>
                <label htmlFor='sell' className='flex gap-2 items-center'><input onChange={handleChange} checked={formData.type=='sell'} type="checkbox" className='size-4' id='sell'/><span>Sell</span></label>
                
                <label htmlFor='rent' className='flex gap-2 items-center'><input onChange={handleChange} checked={formData.type=='rent'} type="checkbox" id='rent' className='size-4' /><span>Rent</span></label>
                
                <label htmlFor='Parking' className='flex gap-2 items-center'><input onChange={handleChange} checked={formData.parking} type="checkbox" id='parking' className='size-4'/><span>Parking spot</span></label>
          
                <label  className='flex gap-2 items-center' htmlFor='furnished'><input onChange={handleChange} checked={formData.furnished} type="checkbox" id='furnished' className='size-4'/><span>Furnished</span></label>
                
                <label className='flex gap-2 items-center' htmlFor='offer'><input onChange={handleChange} checked={formData.offer} type="checkbox" id='offer' className='size-4'/><span>Offer</span></label>
              </div>
              
              <div className='flex flex-wrap gap-4'>
                <label htmlFor="bedrooms" ><input type="number" onChange={handleChange} min={1} max={10} value={formData.bedrooms} className='p-4 w-28  rounded-lg '  id="bedrooms"/><span className='ml-2'>Beds</span></label>
                <label htmlFor="bathrooms"><input type="number" onChange={handleChange} min={1} max={10} value={formData.bathrooms} className='p-4 w-28 rounded-lg ' id="bathrooms"/><span className='ml-2'>Baths</span></label>
                <label htmlFor="regualarPrice"><input min={50} max={50000} type="number" onChange={handleChange} value={formData.regularPrice} className='p-4 w-28 rounded-lg' id="regularPrice"/><span className='ml-2'>Regular Price</span></label>  
                {formData.offer&&(<label htmlFor="discountedPrice"><input type="number" min={0} max={50000} onChange={handleChange} value={formData.discountedPrice} className='p-4 w-28 rounded-lg' id="discountedPrice"/><span className='ml-2'>Discounted Price</span></label>)}
              </div>
              </div>
              <div className='flex flex-col gap-3 flex-1'>
                 <h1 className='text-nowrap text-center' ><span className='font-bold'>images :</span>The first image will be the cover (max 6)</h1>         
                    <div className='flex gap-4'>
                    <input onChange={(e)=>{setFiles({...e.target.files}); setImageUplaodError("  "); setUploading(""); handleImageChange(e);console.log(e.target.files)}} className='p-3 border border-gray-300 rounded w-full' type='file' accept='image/*' multiple/>
                    <button disabled={loading} onClick={HandleImageSubmit} className='p-3 text-green-700 border  border-green-700  rounded uppercase hover:shadow-lg disabled:line-through'>Upload</button> 
                      </div>
                      {imageUploadError&&<p className='text-center text-red-500'>{imageUploadError}</p>}
                      {uploading&&<p className='text-center text-green-500'>{uploading}</p>}   
                      {image&&(
  <div className='flex flex-wrap max-w-full gap-5 justify-evenly items-center'>
  {image.map((obj, i) => (
    <div key={obj.name||obj}>
      <img src={obj.url||obj} key={obj.url||obj} className="w-40 h-28 rounded-lg" alt={`photo ${i}`} />
      <button type='button' disabled={loading} className='p-1 mt-2 bg-slate-600 text-center w-full rounded-lg disabled:opacity-90' onClick={(e) => deleteImage(obj.name,e)}>
        delete
      </button>
    </div>
  ))}
</div>
)}

<button type='submit' disabled={loading} className='p-3 bg-slate-500 rounded-lg disabled:opacity-80 hover:opacity-90'>{loading?"Creating....":"Update Listing"}</button>
  {listError?<p className='text-red-600 text-center' >{listError}</p>:<p className='text-center text-green-800'>"sucessfully created"</p>}
               </div>                     
   </form>
      
    </main>
  )
}
