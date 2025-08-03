import React,{useEffect,useState} from "react";
import { useSearchParams } from "react-router-dom";
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FaArrowUp } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faSignOutAlt,
  faBars,
  faTimes,
  faUserShield,
  faHouse,
  faTrophy,
  faHandPaper
} from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import {HashLink} from 'react-router-hash-link'
const get_data=()=>{
  return sessionStorage.getItem("token")
}
const get_role=()=>{
  return JSON.parse(sessionStorage.getItem("username"))
}
const get_raul=()=>{
  return JSON.parse(sessionStorage.getItem("role"))
}
const Profile = () => {
    const token=get_data()
  const role=get_role()
  const raul=get_raul()
  const [showPassword, setShowPassword] = useState(false);
  const [loading,setLoading]=useState(true)
  const [items,setItems]=useState([])
  const [score,setScore]=useState(0)
    const show_data=async()=>{
      try{
       const response = await fetch(`https://intelligent-ailyn-handcricket-e8842259.koyeb.app/userprofile?username=${role}`);
      let data=await response.json()
      let sc=-1
      if(data.participation.length==0){
        sc=0
      }
      else{
        sc=data.participation.reduce((acc,i)=>acc+=Number(i.score),0)
      }
      if(!data.error){
       setTimeout(()=>{
        setLoading(false)
        setItems([data])
        setScore(sc)
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
const handle=async(icon)=>{
  let response=await fetch("https://intelligent-ailyn-handcricket-e8842259.koyeb.app/adddetails",{
          method:'POST',
          headers:{ 'Content-Type' : "application/json" },
          body: JSON.stringify({username:role,icon:`DP/DP${icon}.png`}),
        })
  let data=await response.json()
        let sc=-1
      if(data.participation.length==0){
        sc=0
      }
      else{
        sc=data.participation.reduce((acc,i)=>acc+=Number(i.score),0)
      }
  setItems([data])
  setScore(sc)
  setLoading(false)
}
  const show_image=(i)=>{
  if(`DP/DP${i}.png`!=items[0].icon){
  setLoading(true)
    handle(i)
    }
    }
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
  {
    loading==false && <>
        <div className="relative w-full bg-slate-800 flex items-center justify-between p-2 md:hidden z-50">
  <img className="w-28 h-16" src={`Logos/Logo.webp`} alt="Logo" />
  </div>
  { raul!="admin" && <>
  <div className="w-full flex justify-end items-center gap-2">
  <img src="Icons/coin.png" className="w-8 h-8" />
  <h1 className="font-bold text-white mr-2 text-base">{score}</h1>
  </div>
  </>
  }
  <div className="w-full flex mt-6 justify-center items-center">
          { items[0].icon!= "" ?
  <img className="w-36 h-36" src={items[0].icon} alt="Logo" /> :
  <img className="w-36 h-36" src={`Icons/cricket.webp`} />}
  </div>
  <div className="w-full flex text-center justify-center items-center mt-3 gap-2">
  <FontAwesomeIcon icon={faHandPaper} className="text-yellow-400 w-8 h-8 animate-wave" />
  <p className="font-bold text-white text-lg">Hello {items[0].username}</p>
  </div>
  <div className="w-full flex flex-col text-center justify-start items-start mt-4">
  <p className="font-bold ml-6 text-white text-lg">Username</p>
  <div className="w-64 h-10 rounded-lg flex justify-start items-center bg-slate-800 text-white ml-6">
    <p className="font-bold ml-4 text-white text-lg">{items[0].username}</p>
  </div>
    <p className="font-bold ml-6 text-white text-lg mt-4">Password</p>
<div className="w-64 h-10 rounded-lg flex justify-between items-center bg-slate-800 text-white ml-6 px-4">
      <p className="font-bold text-white text-lg">
        {showPassword ? items[0].password : '*'.repeat(items[0].password.length)}
      </p>
      <button
        onClick={() => setShowPassword(!showPassword)}
        className="ml-2 focus:outline-none"
      >
        {showPassword ? <FontAwesomeIcon icon={faEyeSlash} />:  <FontAwesomeIcon icon={faEye} />}
      </button>
    </div>
  </div>
  <div className="flex w-full flex-col justify-start items-start mt-4">
  <p className="font-bold ml-6 text-white text-lg">Choose Icons</p>
  <div className="w-full flex flex-row flex-wrap justify-start items-center gap-4 mt-4 px-6 ">
    {
      new Array(5).fill(0).map((_, ind) => (
        <img key={ind} src={`DP/DP${ind + 1}.png`} onClick={()=>show_image(ind+1)}className="w-10 h-10" alt={`DP${ind + 1}`} />
      ))
    }
  </div>
</div>
    </>
  }
    </>
  )
}

export default Profile