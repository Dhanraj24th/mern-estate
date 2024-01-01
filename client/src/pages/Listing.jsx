import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import {Navigation} from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
function Listing() {
    SwiperCore.use([Navigation]);
    const param=useParams();
    useEffect(()=>{
       getList();     
    },[])
    
    const [loadingError,setLoadingError]=useState(false);
    const [loading,setLoading]=useState(false);
    const [list,setList]=useState(false);
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
      {loading&&<h1>Loading...</h1>}
      {loadingError&&<h1>{loadingError}</h1>}
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
        </div>
      )}
    </main>
  )
}

export default Listing
