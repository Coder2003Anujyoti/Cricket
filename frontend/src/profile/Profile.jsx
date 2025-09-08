import React,{useEffect,useState} from "react";
import { useSearchParams } from "react-router-dom";
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
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
  faRotateRight,
  faNewspaper,
  faGamepad,
  faUser,
  faHandPaper
} from '@fortawesome/free-solid-svg-icons';
import { Link,useNavigate } from "react-router-dom";
import {HashLink} from 'react-router-hash-link'
const get_data=()=>{
  return sessionStorage.getItem("token")
}
const get_role=()=>{
  return JSON.parse(sessionStorage.getItem("username"))
}
const get_close=()=>{
  return JSON.parse(sessionStorage.getItem("profileclose"))
}
const get_password=()=>{
  return JSON.parse(sessionStorage.getItem("userpassword"))
}
const get_raul=()=>{
  return JSON.parse(sessionStorage.getItem("role"))
}
const Profile = () => {
    const token=get_data()
  const role=get_role()
  const raul=get_raul()
  const password=get_password()
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [deleted,setDeleted]=useState(false)
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading,setLoading]=useState(true)
  const [items,setItems]=useState([])
  const [score,setScore]=useState(0)
  const [deletestats,setDeletestats]=useState(false)
const badges = [
  { name: "Rookie", min: 1, max: 999 },
  { name: "Player", min: 1000, max: 9999 },
  { name: "Gambler", min: 10000, max: 49999 },
  { name: "Pro", min: 50000, max: 99999 },
  { name: "High Roller", min: 100000, max: 249999 },
  { name: "Master", min: 250000, max: 499999 },
  { name: "Champion", min: 500000, max: 749999 },
  { name: "Legend", min: 750000, max: 1000000 }
];
  useEffect(() => {
  if (deleted || deletestats) {
    requestAnimationFrame(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
      });
    });
  }
}, [deleted,deletestats]);
  const handleDeleteAccount=async()=>{
    try{
  const response=await fetch("https://intelligent-ailyn-handcricket-e8842259.koyeb.app/deleteaccount",{
          method:'DELETE',
          headers:{ 'Content-Type' : "application/json" },
          body: JSON.stringify({username:role.trim().replace(/\s+/g, " "),password:password.trim()}),
        })
 const data=await response.json();
      }
    catch(err){
    console.log(err)
   toast.error(<strong  style={{ whiteSpace: 'nowrap' }}>Something went wrong</strong>);
    }
  }
  const handleDeleteStats=async()=>{
    try{
  const response=await fetch("https://intelligent-ailyn-handcricket-e8842259.koyeb.app/resetdata",{ method:'POST',})
 const data=await response.json();
      }
    catch(err){
    console.log(err)
   toast.error(<strong  style={{ whiteSpace: 'nowrap' }}>Something went wrong</strong>);
    }
  }
  const handDelete=()=>{
   navigate("/login",{ replace: true })
   handleDeleteAccount()
  }
  const handDeleteStats=()=>{
    navigate("/login",{ replace: true })
   handleDeleteStats()  
    }
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
      data.participation=data.participation.slice().reverse();
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
  data.participation=data.participation.slice().reverse();
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
    <div className="relative w-full bg-slate-800 md:flex hidden items-center justify-between p-2 z-50 lg:hidden md:px-4 md:py-3">
      <img className="w-28 h-16" src={`Logos/Logo.webp`} />
        <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className="w-8 h-8" />
      </button>
      { raul=="admin" ? <>
      {/* Mobile Nav Links - Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-slate-800 shadow-md backdrop-blur-md px-4 py-2 z-40">
          <div className="flex flex-col space-y-4">
            <Link to="/" className="flex items-center space-x-3 text-white font-medium hover:text-blue-500">
              <FontAwesomeIcon icon={faHouse} className="w-5 h-5 text-blue-500" />
              <span>Home</span>
            </Link>
                    <Link to="/admin" className="flex items-center space-x-3 text-white font-medium hover:text-pink-500">
              <FontAwesomeIcon icon={faGamepad} className="w-5 h-5 text-pink-500" />
              <span>About</span>
            </Link>
    
            {raul === "admin" && (
              <Link to="/create" className="flex items-center space-x-3 text-white font-medium hover:text-yellow-500">
                <FontAwesomeIcon icon={faTrophy} className="w-5 h-5 text-yellow-500" />
                <span>Admin</span>
              </Link>
            )}
    
            <Link to="/adminuser" className="flex items-center space-x-3 text-white font-medium hover:text-green-500 md:hidden">
              <FontAwesomeIcon icon={faUserShield} className="w-5 h-5 text-green-500" />
              <span>User</span>
            </Link>
            <Link to="/loginprofile" className="hidden items-center space-x-3 text-white font-medium hover:text-green-500 md:flex">
              <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-green-500" />
              <span>Profile</span>
            </Link>
            <Link to="/login" className="flex items-center space-x-3 text-white font-medium hover:text-red-600">
              <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5 text-red-500" />
              <span>Sign Out</span>
            </Link>
             <button
              onClick={() => window.location.reload()}
              className="flex items-center space-x-3 text-white font-medium hover:text-indigo-600"
            >
              <FontAwesomeIcon icon={faRotateRight} className="w-5 h-5 text-indigo-500" />
              <span>Reload</span>
            </button>
          </div>
        </div>
      )}
      </> : <>
        {isOpen && (
        <div className="absolute top-full left-0 w-full bg-slate-800 shadow-md backdrop-blur-md px-4 py-2 z-40">
          <div className="flex flex-col space-y-4">
                  <Link to="/" className="flex items-center space-x-3 text-white font-medium hover:text-indigo-500">
              <FontAwesomeIcon icon={faHouse} className="w-5 h-5 text-indigo-500" />
              <span>Home</span>
            </Link>
            <Link to="/useruser" className="flex items-center space-x-3 text-white font-medium hover:text-pink-500 md:hidden">
              <FontAwesomeIcon icon={faGamepad} className="w-5 h-5 text-pink-500" />
              <span>About</span>
            </Link>
          <Link to="/playersearch" className="flex items-center space-x-3 text-white font-medium hover:text-green-500">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="w-5 h-5 text-green-500" />
              <span>Search</span>
            </Link>
              <Link to="/news" className="flex items-center space-x-3 text-white font-medium hover:text-yellow-500">
              <FontAwesomeIcon icon={faNewspaper} className="w-5 h-5 text-yellow-500" />
              <span>News</span>
            </Link>         
             <Link to="/loginprofile" className="hidden items-center space-x-3 text-white font-medium hover:text-pink-500 md:flex">
              <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-pink-500" />
              <span>Profile</span>
            </Link>
            <Link to="/login" className="flex items-center space-x-3 text-white font-medium hover:text-red-600">
              <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5 text-red-500" />
              <span>Sign Out</span>
            </Link>
            <button
      onClick={() => window.location.reload()}
      className="flex items-center space-x-3 text-white font-medium hover:text-sky-600"
    >
      <FontAwesomeIcon icon={faRotateRight} className="w-5 h-5 text-sky-500" />
      <span>Reload</span>
    </button>
          </div>
        </div>
      )}
      </>
      }
    </div>
    {/* //* Navbar for big screens */}
       <nav className="bg-slate-800 hidden lg:block text-white backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-2 md:flex">
          <img
            src="Logos/Logo.webp"
            alt="Logo"
            className="w-20 h-16 md:w-32 md:h-20 lg:w-36 lg:h-24 object-contain"
          />
          </div>
         <div className="hidden lg:flex items-center gap-4 space-x-6">
           <Link to="/" className="flex items-center space-x-3 text-white font-medium hover:text-indigo-500">
              <FontAwesomeIcon icon={faHouse} className="w-5 h-5 text-indigo-500" />
              <span>Home</span>
            </Link>
          { raul=="user" && <> <Link to="/playersearch" className="flex items-center space-x-3 text-white font-medium hover:text-green-500">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="w-5 h-5 text-green-500" />
              <span>Search</span>
            </Link></>}
              { raul=="user" && <> <Link to="/news" className="flex items-center space-x-3 text-white font-medium hover:text-yellow-500">
              <FontAwesomeIcon icon={faNewspaper} className="w-5 h-5 text-yellow-500" />
              <span>News</span>
            </Link> </>  } 
            {raul=="admin" && <>
             <Link to="/admin" className="flex items-center space-x-3 text-white font-medium hover:text-pink-500">
              <FontAwesomeIcon icon={faGamepad} className="w-5 h-5 text-pink-500" />
              <span>About</span>
            </Link>
            </>}
             {raul === "admin" && (
              <Link to="/create" className="flex items-center space-x-3 text-white font-medium hover:text-yellow-500">
                <FontAwesomeIcon icon={faTrophy} className="w-5 h-5 text-yellow-500" />
                <span>Admin</span>
              </Link>
            )}
            { raul=="user" ? <Link to="/loginprofile" className="hidden items-center space-x-3 text-white font-medium hover:text-pink-500 md:flex">
              <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-pink-500" />
              <span>Profile</span>
            </Link> :  <Link to="/loginprofile" className="hidden items-center space-x-3 text-white font-medium hover:text-green-500 md:flex">
             <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-green-500" />
                                  <span>Profile</span>
                                </Link>}
            <Link to="/login" className="flex items-center space-x-3 text-white font-medium hover:text-red-600">
              <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5 text-red-500" />
              <span>Sign Out</span>
            </Link>
             <button
      onClick={() => window.location.reload()}
      className="flex items-center space-x-3 text-white font-medium hover:text-sky-600"
    >
      <FontAwesomeIcon icon={faRotateRight} className="w-5 h-5 text-sky-500" />
      <span>Reload</span>
    </button>
      </div>
      </div>
    </nav>
        <div className="relative w-full bg-slate-800 flex items-center justify-between p-2 md:hidden z-50">
  <img className="w-28 h-16" src={`Logos/Logo.webp`} alt="Logo" />
  </div>
  { raul!="admin" && <>
  <div className="w-full flex justify-end items-center gap-2 md:hidden my-2">
  <img src="Icons/coin.png" className="w-8 h-8" />
  <h1 className="font-bold text-white mr-2 text-base">{items[0].total}</h1>
  </div>
  </>
  }
  <div className="w-full flex flex-col md:flex-row">
  <div className="w-full flex mt-6 justify-center items-center md:w-1/2 md:mt-0">
          { items[0].icon!= "" ?
  <img className="w-36 h-36 lg:w-64 lg:h-64" src={items[0].icon} alt="Logo" /> :
  <img className="w-32 h-32 lg:w-60 lg:h-60" src={`Icons/cricket.webp`} />}
  </div>
  <div className="md:w-1/2 md:p-6 lg:mt-6" >
  <div className="w-full flex text-center justify-center items-center mt-4 gap-2 md:justify-start md:ml-12 ">
  <FontAwesomeIcon icon={faHandPaper} className="text-yellow-400 w-8 h-8 animate-wave" />
  <p className="font-bold text-white text-base">Hello {items[0].username}</p>
  </div>
  <div className="w-full flex flex-col text-center justify-start items-start mt-4 md:mt-6">
  <p className="font-bold ml-6 text-white text-base">Username</p>
  <div className="w-64 h-10 rounded-lg flex justify-start items-center bg-slate-800 text-white ml-6 mt-1">
    <p className="font-bold ml-4 text-white text-sm md:text-base">{items[0].username}</p>
  </div>
    <p className="font-bold ml-6 text-white text-base mt-4 md:mt-6">Password</p>
<div className="w-64 h-10 rounded-lg flex justify-between items-center bg-slate-800 text-white ml-6 mt-1 px-4">
      <p className="font-bold text-white text-sm md:text-base">
        {showPassword ? items[0].password : '*'.repeat(items[0].password.length)}
      </p>
      <button
        onClick={() => setShowPassword(!showPassword)}
        className="ml-2 focus:outline-none"
      >
        {showPassword ? <FontAwesomeIcon icon={faEyeSlash} />:  <FontAwesomeIcon icon={faEye} />}
      </button>
    </div>
     <p className="font-bold ml-6 text-white text-base mt-4 md:mt-6">Email</p>
  <div className="w-64 h-10 rounded-lg flex justify-start items-center bg-slate-800 text-white ml-6 mt-1">
    <p className="font-bold ml-4 text-white text-sm md:text-base">{items[0].email}</p>
  </div>
  </div>
  <div className="flex w-full flex-col justify-start items-start mt-4 md:mt-6">
  <p className="font-bold ml-6 text-white text-base">Choose Icons</p>
  <div className="w-full flex flex-row flex-wrap justify-start items-center gap-4 mt-3 px-6 ">
    {
      new Array(5).fill(0).map((_, ind) => (
        <img key={ind} src={`DP/DP${ind + 1}.png`} onClick={()=>show_image(ind+1)}className="w-10 h-10" alt={`DP${ind + 1}`} />
      ))
    }
  </div>
  </div>
{ (raul==="admin" || raul=="user") && <>
  <div className="w-full flex flex-col justify-center items-center my-6 md:hidden">
       <h1 className="text-green-400 text-base font-bold shadow-green-400 ml-6">Ongoing Participations</h1>
{ items[0].participation.length>0  && <>
    <div className="overflow-x-auto scroll-smooth max-w-full px-3 py-4">
  <div className="flex gap-4">
    {items[0].participation.filter((i,index)=> index < 5).map((t, idx) => (
  <div key={idx} className="min-w-[300px] max-w-[300px] bg-slate-800 text-white p-5 rounded-xl shadow-lg flex-shrink-0">
    <div className="w-full flex justify-end items-center gap-2 md:hidden">
  <img src="Icons/coin.png" className="w-6 h-6" />
  <h1 className="font-bold text-white mr-2 text-sm">{t.score}</h1>
  </div>
<div className="flex items-center justify-between gap-4 my-3">
<div className="flex flex-col items-center">
<img src={`Logos/${t.playerteam}.webp`} alt={t.playerteam} className="w-24 h-24"/>
<p className=" text-base font-bold">{t.playerteam.toUpperCase()}</p></div>
  <div className="text-center">
 <h2 className="text-base font-extrabold">V/S</h2>
</div>
<div className="flex flex-col items-center">
<img src={`Logos/${t.computerteam}.webp`} alt={t.computerteam} className="w-24 h-24"/>
<p className="text-base font-bold">{t.computerteam.toUpperCase()}</p></div></div>
<div className="text-center flex flex-col gap-2">
<h2 className="text-base font-bold">{t.matchname}</h2>
<h2 className="text-xs font-semibold">{t.matchtime}</h2>
</div>
      </div>
    ))}
  </div>
</div>
</>}
{
  items[0].participation.length==0 && <>
<div className="w-full flex justify-center items-center p-24">
 <h1 className=" text-center text-base font-bold text-white">No participations</h1>
 </div>
  </>
}
  </div>
  </>
  }
  <div className="w-full flex flex-col justify-center items-center my-6 md:hidden">
  <h1 className="text-green-400 text-base font-bold shadow-green-400 ml-6">Achievements Unlocked</h1>
  <div className="w-full mt-4 ml-2 mr-2 flex flex-row flex-wrap gap-2">
<div className="flex flex-wrap gap-3">
  {raul=="admin" && badges.filter(badge => items[0].total <= badge.min).map((badge, idx, arr) => {
return (
<img key={idx} src={`Badges/${badge.name}.webp`} alt={badge.name} className="w-28 h-20 object-contain transition-all duration-300"/>
      );
    })}
  { raul==="user" && 
    badges.map((badge, idx) => {
    const unlocked = items[0].total >= badge.min; // Check if unlocked
    return (
      <div key={idx} className="relative w-28 h-20">
        {/* Badge Image */}
        <img
          src={`Badges/${badge.name}.webp`}
          alt={badge.name}
          className={`w-full h-full object-contain transition-all duration-300  ${
            unlocked ? "" : "filter blur-sm"
          }`}
        />
        {/* Question mark overlay if locked */}
        {!unlocked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <FontAwesomeIcon icon={faQuestion} className="text-white text-2xl drop-shadow-lg" />
          </div>
        )}
      </div>
    );
  })
  }
</div>
</div>

</div>
  {raul=="user" && <> <div className="w-full flex items-center flex-wrap p-4 justify-center md:justify-start md:ml-6 md:mt-6 gap-4">
  <button onClick={()=>{
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  setDeleted(true)}}
    className="w-36 py-2 md:my-7 font-bold text-white bg-slate-800 rounded-md transition">
    Delete Account
  </button>
<HashLink smooth to="/profilehistory">
    <button 
    className="w-36 py-2 md:my-7 font-bold text-white bg-slate-800 rounded-md transition md:hidden">
    Recent History
  </button>
  </HashLink>
<HashLink smooth to="/oldprofilehistory">
      <button 
    className="w-36 py-2 md:my-7 font-bold text-white bg-slate-800 rounded-md transition md:hidden">
    Old History
  </button>
</HashLink>
<HashLink smooth to="/room">
    <button 
    className="w-36 py-2 md:my-7 font-bold text-white bg-slate-800 rounded-md transition md:hidden">
    Create Room
  </button>
</HashLink>
  </div></>}
  {
    raul=="admin" && <>
  <div className="w-full flex items-center p-4 justify-center md:justify-start  md:ml-6 md:mt-6 gap-4 md:hidden">
  <button onClick={()=>{
  setDeletestats(true)}}
    className="w-36 py-2 md:my-7 font-bold text-white bg-slate-800 rounded-md transition">
    Delete Records
  </button>
  <HashLink smooth to="/email">  <button 
    className="w-36 py-2 md:my-7 font-bold text-white bg-slate-800 rounded-md transition">
  Write Email
  </button></HashLink>
  </div>
    </>
  }
</div>
</div>
{
    deletestats==true && <>
  <div className="w-full flex flex-col text-center justify-center p-6 gap-4 items-center">
  <h1 className="text-sm font-bold text-white">Are you want to delete tournaments records</h1>
  <div className="w-full flex justify-center items-center gap-6">
  <button className="flex items-center px-6 py-2 md:my-7 font-bold text-white bg-slate-800 rounded-md transition" onClick={handDeleteStats}>Yes</button>
  <button className="flex items-center px-6 py-2 md:my-7 font-bold text-white bg-slate-800 rounded-md transition" onClick={()=>{
  window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
  setDeletestats(false)}}>No</button>
  </div>
  </div>
  </>
}
    {
  deleted==true && <>
  <div className="w-full flex flex-col text-center justify-center p-6 gap-4 items-center">
  <h1 className="text-sm font-bold text-white">Are you want to delete your account</h1>
  <div className="w-full flex justify-center items-center gap-6">
  <button className="flex items-center px-6 py-2 md:my-7 font-bold text-white bg-slate-800 rounded-md transition" onClick={handDelete}>Yes</button>
  <button className="flex items-center px-6 py-2 md:my-7 font-bold text-white bg-slate-800 rounded-md transition" onClick={()=>{
  window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
  setDeleted(false)}}>No</button>
  </div>
  </div>
  </>
  }
    </>
  }
    </>
  )
}

export default Profile