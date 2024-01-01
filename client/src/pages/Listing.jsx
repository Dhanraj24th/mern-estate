import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import {Navigation} from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import { FaBath, FaBed, FaChair, FaMapMarkedAlt, FaParking, FaShare } from 'react-icons/fa';
import { useSelector } from 'react-redux';
function Listing() {
    SwiperCore.use([Navigation]);
    const param=useParams();
    useEffect(()=>{
       getList();     
    },[])
    
    const [loadingError,setLoadingError]=useState(false);
    const [loading,setLoading]=useState(false);
    const [list,setList]=useState(false);
    const [copied,setCopied]=useState(false);
    const [contact,setContact]=useState(false);
    const params=useParams();
    const {currentUser}=useSelector((state)=>state.user);
   console.log(loading); 
console.log(list);
    const getList=async()=>{
        setLoading(true);
        try {
            const res=await fetch(`/api/listing/get/${param.listId}`,{method:'get',headers:{
                'Content-type':'application/json'
            }})
            const data=await res.json();
            if(data.success==false){
                setLoadingError(data.message);
                setLoading(false);
                return;
            }
             setLoading(false);
             setList(data);
        } catch (error) {
            setLoading(false);
            setLoadingError(error.message);
        }

    }
  return (
    <main>
      {loading&&<h1 className='text-3xl text-center items-center my-10' >Loading...</h1>}
      {loadingError&&<h1 className='text-3xl text-center items-center my-10'>Something Went Wrong !</h1>}
      {list&&!loading&&!loadingError&&(
        <div>
            <Swiper navigation>
                {list.imageUrls.map( url=>
                (
                  <SwiperSlide key={url}>
                       <div className='h-[550px]' style={{background:`url(${url}) center no-repeat`,backgroundSize:'cover' }}>
                       </div>
                  </SwiperSlide>
                )
                )}
            </Swiper>
            <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
                <FaShare className='text-slate-500'
                onClick={()=>{
                    navigator.clipboard.writeText(window.location.href);
                    setCopied(true);
                    setTimeout(()=>{
                        setCopied(false);

                    },2000);
                }}/>
            </div>
            {copied &&(<p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate p-2'>
                Link copied!
            </p>)}
            <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
                <p className='text-2xl font-semibold'>
                    {list.name}-${' '}
                    {
                    list.offer? list.discountedPrice
                                :list.regularPrice
                    }
                  {list.type =='rent' && '/ month'}
                </p>
                <p className='flex item-center mt-6 gap-2 text-slate-600 text'>
                    <FaMapMarkedAlt className='text-green-700'/>
                    {list.address}
                </p>
                <div className='flex gap-4'>
                    <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                        {list.type =='rent' ? 'For Rent' :'For Sale'}
                    </p>
                    {list.offer && (<p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                        ${+list.regularPrice - +list.discountedPrice} OFF
                    </p>)}
                </div>
                <p className='text-slate-800'>
                    <span className='font-semibold text-black'>Description - </span>
                    {list.description}
                </p>
                 <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
                    <li className='flex items-center gap-1 whitespace-nowrap'>
                        <FaBed className='text-lg'/>
                        {list.bedrooms>1 ?`${list.bedrooms} beds`
                         :`${list.bedrooms} bed` }
                    </li>
                    <li className='flex items-center gap-1 whitespace-nowrap'>
                        <FaBath className='text-lg'/>
                        {list.bathrooms >1 ? `${list.bathrooms} baths`
                                 : `${Listing.bathrooms} bath`}
                    </li>
                    <li className='flex item-center gap-1 whitespace-nowrap'>
                        <FaParking className='text-lg'/>
                        {list.parking? 'Parking Spot' :'No parking'}
                    </li>
                    <li className='flex item-center gap-1 whitespace-nowrap'>
                        {<FaChair className='text-lg'/>}
                        {list.furnished ? 'Furnished' :'Unfurnished'}
                    </li>
                 </ul>
                    {currentUser && list.userRef !== currentUser._id && !contact &&(
                        <button onClick={()=>setContact(true)} className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'>
                            Contact landlord
                        </button>
                    )}
                    {contact && <Contact list={list}/>}
            </div>
        </div>
      )}
    </main>
  )
}

export default Listing
