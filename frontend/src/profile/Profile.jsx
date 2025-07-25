import React,{useEffect,useState} from "react";
import { useSearchParams } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faSignOutAlt,
  faBars,
  faTimes,
  faUserShield,
  faHouse,
  faTrophy
} from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import {HashLink} from 'react-router-hash-link'
const get_data=()=>{
  return sessionStorage.getItem("token")
}
const get_role=()=>{
  return JSON.parse(sessionStorage.getItem("username"))
}
const Profile = () => {
    const token=get_data()
  const role=get_role()
  const [loading,setLoading]=useState(true)
  const [items,setItems]=useState([])
    const show_data=async()=>{
      try{
       const response = await fetch("http://localhost:8000/allusers");
      let data=await response.json()
      let filtereddata=data.user_data.filter((i)=>i.username==role)
      console.log(filtereddata)
      if(!data.error){
       setTimeout(()=>{
        setLoading(false)
        setItems(filtereddata)
      },2000)
      }
    }
    catch(err){
      console.log("It is an error-: ",err)
    }
    }
   useEffect(()=>{
      show_data()
       window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    },[token])
  return (
    <>
     {loading == true && <>
     <div className="w-full flex flex-col items-center justify-center py-40 md:py-48">
    <img src="Logos/Logo.webp" className="w-30 h-24 md:w-60 md:h-32" />
   <div className="w-full flex justify-center gap-y-2  text-center flex-col p-4 mt-4">

    <div className="mt-4 flex flex-row flex-wrap justify-center gap-x-12 gap-y-12 ">
  {new Array(4).fill("").map((i,ind)=>{
  return(
  <div className="text-center">
    <img src={`sponsor/sponsor${ind+1}.png`} className="w-22 h-14 md:w-20 md:h-16"></img>
    </div>
    )
  })}
</div>
    </div>
    </div>
  </>}
    </>
  )
}

export default Profile