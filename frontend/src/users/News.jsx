import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaBroadcastTower } from "react-icons/fa"; // FontAwesome
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import {
  faMagnifyingGlass,
  faSignOutAlt,
  faBars,
  faTimes,
  faUserShield,
  faHouse,
  faTrophy,
  faNewspaper
} from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { HashLink } from 'react-router-hash-link';

const get_data = () => sessionStorage.getItem("token");
const get_role = () => JSON.parse(sessionStorage.getItem("username"));
const News = () => {
const token = get_data();
  const role = get_role();
  const [searchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [items, setItems] = useState([]);
const show_data = async () => {
    try {
      const response = await fetch(`https://intelligent-ailyn-handcricket-e8842259.koyeb.app/getnews`);
      let data = await response.json();
      if (!data.error) {
        setTimeout(() => {
          setLoading(false);
          setItems(data.news_data);
        }, 2000);
      }
    } catch (err) {
      console.log("It is an error: ", err);
    }
  };

  useEffect(() => {
    show_data();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [token]);
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
              <Link to="/useruser" className="flex items-center space-x-3 text-white font-medium hover:text-indigo-500">
          <FontAwesomeIcon icon={faHouse} className="w-5 h-5 text-indigo-500" />
          <span>Home</span>
        </Link>
      <Link to="/playersearch" className="flex items-center space-x-3 text-white font-medium hover:text-green-500">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="w-5 h-5 text-green-500" />
          <span>Search</span>
        </Link>
         
          <Link to="/news" className="flex items-center space-x-3 text-white font-medium hover:text-yellow-500">
          <FontAwesomeIcon icon={faNewspaper} className="w-5 h-5 text-yellow-500" />
          <span>News</span>
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
  <h1 className="text-green-400 text-lg font-bold shadow-green-400 text-center my-4">Tournament News</h1>
{
  items.length==0 && <>
  <h1 className="font-bold text-white text-center my-48">No News Found</h1>
  </>
}
{
  items.length>0 && <>
  <div className="flex flex-col ml-2 mr-2 gap-2 my-4">
 {items.map((i)=>{
    return(<>
    <div className="w-full bg-slate-800 flex flex-row rounded-md flex-wrap">
   <div className="w-1/2 flex flex-col justify-center items-center">
  <div className="flex flex-row gap-2">
<img src={`Logos/${i.playerteam}.webp`} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-contain" />
<h1 className="text-lg sm:text-xl font-bold text-white my-4">v/s</h1>
<img src={`Logos/${i.computerteam}.webp`} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-contain" />
  </div>
<div className="w-full flex flex-row flex-wrap justify-center items-center mt-2">
<h1 className="text-white text-center font-bold text-sm">{i.content}</h1>
</div>
   </div>
  <div className="w-1/2 flex justify-center items-center">
  <img src={i.image} className="w-full h-full" />
  </div>
    </div>
    </>)
  })}
  </div>
  </>
}
</>
}
 </>
  );
};

export default News;
