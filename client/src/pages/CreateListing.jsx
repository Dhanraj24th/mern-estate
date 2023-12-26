import React from 'react'
import { useState } from 'react';
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage';
import {app} from '../firebase.js';
import { reset } from 'nodemon';
export default function CreateListing() {
  const [files,setFiles]=useState([]);
  const [formData,setFormData]=useState({
    imageUrls:[]
  });
  const [loading,setloading]=useState(false);
  console.log(formData);
  const[imageUploadError,setImageUplaodError]=useState(false);
  const HandleImageSubmit=async (e)=>{
     e.preventDefault();
    console.log(files.length);
        if(files.length+formData.imageUrls.length<7&&files.length>0){
          const promises=[];
          setloading(true);
          for (let index = 0; index < files.length; index++) {
            if(files[index].size>2000000){
              return setImageUplaodError(`file size must less than 2mb ${files[index].name}`);
            }
          }
          for (let index = 0; index < files.length; index++) {
               promises.push(storeImage(files[index]));
          }
          Promise.all(promises).then((urls)=>{
            setFormData({...formData,
            imageUrls:formData.imageUrls.concat(urls)});
            setImageUplaodError(false);
          }).catch((error)=>{
            setImageUplaodError(error.message)
          });
          setloading(false);
        }else{
          setImageUplaodError("You Can Only upload 6 images per listing")
        }
  };
  const [image, setImage] = useState([{}]);
  console.log(image);
  const handleImageChange = (e) => {
    const file = e.target.files;
    const promises = [];
    if (file) {
      for (let i = 0; i < file.length; i++) {
        promises.push(imageProcess(file[i]));
      }
    }
    Promise.all(promises)
      .then((urls) => {
        setImage(urls);
      })
      .catch((error) => {
        setImageUplaodError(error.message);
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
    
   // setFiles(newfiles);
   for (const key in files) {
    if (files[key].name==name) {    
      const newfiles={...files};
      delete newfiles[key];
      setFiles(newfiles);
    }
  }
  const newfiles= Object.keys(files).filter(key => files[key].name !== name);
  console.log(newfiles);
    const newImagedata=image.filter(e=>e.name!=name);
    setImage(newImagedata);
 }
  return (
    <main className='max-w-4xl mx-auto'>
        <h1 className='text-center font-semibold text-3xl p-3 my-4'>Create a Listing</h1>
        <form className='flex flex-col sm:flex-row my-8 gap-8'>
              <div className='flex flex-col gap-4 flex-1'>
            
              <input type="text" className='rounded-lg p-3' id='name' placeholder='Name'/>
              <input type="text" className='rounded-lg p-3'id='description' placeholder='Description'/>
              <input type="text" className='rounded-lg p-3' id='address' placeholder='Address' />
                
              <div className='flex flex-wrap gap-3'>
                <label htmlFor='Sell' className='flex gap-2 items-center'><input type="checkbox" className='size-4' id='Sell'/><span>Sell</span></label>
                
                <label htmlFor='Rent' className='flex gap-2 items-center'><input type="checkbox" id='Rent' className='size-4' /><span>Rent</span></label>
                
                <label htmlFor='Parking' className='flex gap-2 items-center'><input type="checkbox" id='Parking spot' className='size-4'/><span>Parking spot</span></label>
          
                <label  className='flex gap-2 items-center' htmlFor='Furnished'><input type="checkbox" id='Furnished' className='size-4'/><span>Furnished</span></label>
                
                <label className='flex gap-2 items-center' htmlFor='Offer'><input type="checkbox" id='Offer' className='size-4'/><span>Offer</span></label>
              </div>
              
              <div className='flex flex-wrap gap-4'>
                <label htmlFor="Beds" ><input type="number" className='p-4 w-28  rounded-lg '  id="Beds"/><span className='ml-2'>Beds</span></label>
                <label htmlFor="Baths"><input type="number" className='p-4 w-28 rounded-lg ' id="Baths"/><span className='ml-2'>Baths</span></label>
                <label htmlFor="Regualar Price"><input type="number" className='p-4 w-28 rounded-lg' id="Regular Price"/><span className='ml-2'>Regular Price</span></label>  
                <label htmlFor="Baths"><input type="number" className='p-4 w-28 rounded-lg' id="Baths"/><span className='ml-2'>Discounted Price</span></label>      
              </div>
              </div>
              <div className='flex flex-col gap-3 flex-1'>
                 <h1 className='text-nowrap text-center' ><span className='font-bold'>images :</span>The first image will be the cover (max 6)</h1>         
                    <div className='flex gap-4'>
                    <input onChange={(e)=>{setFiles(e.target.files); handleImageChange(e)}} className='p-3 border border-gray-300 rounded w-full' type='file' accept='image/*' multiple/>
                    <button disabled={loading||formData.imageUrls.length>0} onClick={HandleImageSubmit} className='p-3 text-green-700 border border-green-700  rounded uppercase hover:shadow-lg disabled:opacity-80'>Upload</button> 
                      </div>
                      {imageUploadError&&<p>{imageUploadError}</p>}   
                      {image.length > 1 && (
  <div className='flex flex-wrap gap-4'>
  {image.map((obj, i) => (
    <div key={obj.name}>
      <img src={obj.url} key={obj.url} className="w-40 h-32 rounded-lg" alt={`photo ${i}`} />
      <button type='button' className='p-1 mt-2 bg-red-500 text-center w-full rounded-lg' onClick={(e) => deleteImage(obj.name,e)}>
        delete
      </button>
    </div>
  ))}
</div>

)}

                  <button type='submit' className='p-3 bg-slate-500 rounded-lg disabled:opacity-80 hover:opacity-80'>Create Listing</button>
               </div>                     
   </form>
      
    </main>
  )
}
