import React,{useEffect,useState} from "react";
import { useSearchParams } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaMedal, FaTrophy, FaStar } from "react-icons/fa";
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
const LeaderBoard = () => {
const token=get_data()
  const role=get_role()
const [searchParams] = useSearchParams();
const [isOpen, setIsOpen] = useState(false);
const [loading,setLoading]=useState(true)
const matchID=searchParams.get("id")
const [items,setItems]=useState([])
  const show_data=async()=>{
    try{
     const response = await fetch(`https://intelligent-ailyn-handcricket-e8842259.koyeb.app/specificuser?id=${matchID}`);
let data = await response.json();

const res = data.map((i) => {
  const k = i.participation.filter((it) => it.id === matchID);
  return {
    ...i,
    participation: k,
  };
});
    if(!data.error){
     setTimeout(()=>{
      setLoading(false)
      setItems(res)
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
        {loading==false && <>
  {/* //& Navbar for mobile */}
    <div className="relative w-full bg-slate-800 flex items-center justify-between p-2 md:hidden z-50">
  <img className="w-28 h-16" src={`Logos/Logo.webp`} alt="Logo" />
    <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
    <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className="w-8 h-8" />
  </button>

  {/* Mobile Nav Links - Dropdown */}
  {isOpen && (
    <div className="absolute top-full left-0 w-full bg-slate-800 shadow-md backdrop-blur-md px-4 py-2 z-40">
      <div className="flex flex-col space-y-4">
        <Link to="/login" className="flex items-center space-x-3 text-white font-medium hover:text-red-600">
          <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5 text-red-500" />
          <span>Sign Out</span>
        </Link>
      </div>
    </div>
  )}
</div>
{
  items
    .filter((i) => i.username === role && i.participation.length > 0)
    .length > 0 && (
      <div className="w-full text-center flex justify-center">
        {
          items
            .filter((i) => i.username === role && i.participation.length > 0)
            .map((it) => (
           <div
  key={it._id || it.username}
  className="flex items-center justify-center gap-4 px-6 py-4 mt-2 "
>
  <h1 className="text-xl font-bold text-white">
    🎉 Congratulations, <span className="text-white">{it.username}</span>!
    Your Score is <span className="text-white">{it.participation[0].score}</span>
  </h1>
</div>
            ))
        }
      </div>
    )
}
{ items.filter((i) => i.participation.length > 0).length > 0 && <>
<h1 className="text-green-400 text-lg font-bold shadow-green-400 text-center my-6">Team Leaderboard</h1>
      <div className="w-full text-center flex justify-center flex-col">
        {
          items.sort((a,b)=>b.participation[0].score-a.participation[0].score)
            .map((it) => (
           <div
  key={it._id || it.username}
  className="flex items-center justify-center  px-6 py-4 mt-1 w-full bg-slate-800"
>
<div className="flex justify-center items-center">
  <h1 className="text-xl ml-2 font-bold text-white">
{it.username}
  </h1>
  </div>
  <div className="flex w-full gap-2 justify-end items-center">
    <h1 className="text-xl font-bold text-white">
{it.participation[0].score}
  </h1>
    <img src="Icons/coin.png" className="w-8 h-8 mr-2" />
  </div>
</div>
            ))
        }
      </div>
      </>
      }
      { items.filter((i) => i.participation.length > 0).length == 0 && <>
      <h1 className=" text-center text-base my-44 font-bold text-white">No participation</h1>
      </>}
</>
}
  </>
  );
};

export default LeaderBoard;
