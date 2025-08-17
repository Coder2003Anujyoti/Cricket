import React,{useState,useEffect} from 'react'
import { FaArrowUp } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
  faGamepad,
  faFlagCheckered,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { toast, Toaster } from 'react-hot-toast';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Link,useLocation } from "react-router-dom";
import {HashLink} from 'react-router-hash-link'
const get_data=()=>{
  return sessionStorage.getItem("token")
}
const get_role=()=>{
  return JSON.parse(sessionStorage.getItem("role"))
}
const get_name=()=>{
  return JSON.parse(sessionStorage.getItem("username"))
}
const teams = [
  { name: "Mi", logo: "Logos/Mi.webp" },
  { name: "Csk", logo: "Logos/Csk.webp" },
  { name: "Rr", logo: "Logos/Rr.webp" },
  { name: "Kkr", logo: "Logos/Kkr.webp" },
  { name: "Gt", logo: "Logos/Gt.webp" },
  { name: "Pbks", logo: "Logos/Pbks.webp" }, // Add this image in your Logos folder
  { name: "Rcb", logo: "Logos/Rcb.webp" },   // Add this image in your Logos folder
  { name: "Lsg", logo: "Logos/Lsg.webp" },
  { name: "Dc", logo: "Logos/Dc.webp" },
  { name: "Srh", logo: "Logos/Srh.webp" },
];

const UserChallenge = () => {
  const token=get_data()
  const role=get_role()
  const name=get_name()
  const [isOpen, setIsOpen] = useState(false);
  const [items,setItems]=useState([])
  const [loading,setLoading]=useState(true)
   const [subload,setSubload]=useState(false)
   const [offset,setOffset]=useState(0)
const [limit,setLimit]=useState(5)
const [len,setLen]=useState(-1)
   const location = useLocation();
   const show_data=async()=>{
    try{
      if(!token){
        console.log("error")
        return;
      }
     const response = await fetch(`https://intelligent-ailyn-handcricket-e8842259.koyeb.app/getchallenges?offset=${offset}&&limit=${limit}`, {
      method: "POST",
      body: JSON.stringify({
      username:name
  }),
    });
    let data=await response.json()
    if(!data.error && offset==0){
     setTimeout(()=>{
      setLoading(false)
      setSubload(false)
      setLen(data.total)
      setOffset(offset+5)
      setItems(data.challenges_data)
    },2000)
    }
    else if(!data.error && offset > 0){
      setTimeout(()=>{
      setLoading(false)
      setSubload(false)
      setLen(data.total)
      setOffset(offset+5)
      setItems([...items,...data.challenges_data])
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
  useEffect(()=>{
    if(subload==true){
      show_data();
    }
  },[subload])
const go=()=>{
  setSubload(true)
}
useEffect(()=>{
window.scrollTo({ top: 0, behavior: "smooth" });
},[])

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
{ loading==false && <>
     <div  className="relative w-full bg-slate-800 flex items-center lg:hidden md:px-4 md:py-3 justify-between p-2  z-50">
  <img className="w-28 h-16" src={`Logos/Logo.webp`} alt="Logo" />
    <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
    <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className="w-8 h-8" />
  </button>
  {isOpen && (
    <div className="absolute top-full left-0 w-full bg-slate-800 shadow-md backdrop-blur-md  px-4 py-2 z-40">
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
       <Link to="/userchallenge" className="flex items-center space-x-3 text-white font-medium hover:text-blue-500 md:hidden">
            <FontAwesomeIcon icon={faFlagCheckered} className="w-5 h-5 text-blue-500" />
            <span>Challenge</span>
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
</div>
    </>
    }
    </>
  )
}

export default UserChallenge

