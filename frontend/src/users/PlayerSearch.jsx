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
  faNewspaper,
  faGamepad,
  faFlagCheckered,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { HashLink } from 'react-router-hash-link';

const get_data = () => sessionStorage.getItem("token");
const get_role = () => JSON.parse(sessionStorage.getItem("username"));
const PlayerSearch = () => {
  const token = get_data();
  const role = get_role();
  const [searchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [items, setItems] = useState([]);

  const teams = ["Mi", "Csk", "Rr", "Kkr", "Gt", "Pbks", "Rcb", "Lsg", "Dc", "Srh"];

  const handleSelect = (team) => {
    if (selectedTeams.includes(team)) {
      setSelectedTeams(selectedTeams.filter((t) => t !== team));
    } else {
      setSelectedTeams([...selectedTeams, team]);
    }
  };

  const show_data = async () => {
    try {
      const response = await fetch(`https://intelligent-ailyn-handcricket-e8842259.koyeb.app/`);
      let data = await response.json();
      if (!data.error) {
        setTimeout(() => {
          setLoading(false);
          setItems(data.data);
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
    <div  className="relative w-full bg-slate-800 flex items-center lg:hidden md:px-4 md:py-3 justify-between p-2  z-50">
  <img className="w-28 h-16" src={`Logos/Logo.webp`} alt="Logo" />
    <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
    <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className="w-8 h-8" />
  </button>

  {/* Mobile Nav Links - Dropdown */}
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
 <nav className="bg-slate-800 hidden lg:block text-white backdrop-blur-md shadow-md">
  <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
    <div className="flex items-center space-x-2">
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
      { JSON.parse(sessionStorage.getItem("role"))=="user" && <> <Link to="/playersearch" className="flex items-center space-x-3 text-white font-medium hover:text-green-500">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="w-5 h-5 text-green-500" />
          <span>Search</span>
        </Link></>}
          { JSON.parse(sessionStorage.getItem("role"))=="user" && <> <Link to="/news" className="flex items-center space-x-3 text-white font-medium hover:text-yellow-500">
          <FontAwesomeIcon icon={faNewspaper} className="w-5 h-5 text-yellow-500" />
          <span>News</span>
        </Link> </>  } 
        { JSON.parse(sessionStorage.getItem("role"))=="admin" && <>
         <Link to="/admin" className="flex items-center space-x-3 text-white font-medium hover:text-pink-500">
          <FontAwesomeIcon icon={faGamepad} className="w-5 h-5 text-pink-500" />
          <span>About</span>
        </Link>
        </>}
         { JSON.parse(sessionStorage.getItem("role")) === "admin" && (
          <Link to="/create" className="flex items-center space-x-3 text-white font-medium hover:text-yellow-500">
            <FontAwesomeIcon icon={faTrophy} className="w-5 h-5 text-yellow-500" />
            <span>Admin</span>
          </Link>
        )}
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
</nav>
<div className="overflow-x-auto scroll-smooth px-3 py-4 lg:flex lg:justify-center  lg:items-center lg:py-6">
<div className="flex gap-4 w-max lg:justify-center lg:items-center lg:gap-10">
{teams.map((team) => (
<div key={team} onClick={() => handleSelect(team)} className="relative cursor-pointer">
<img src={`Logos/${team}.webp`} className="w-16 h-16 p-2 rounded-full border border-slate-800 lg:w-24 lg:h-24" />
{selectedTeams.includes(team) && (
<FontAwesomeIcon icon={faCheckCircle} className="absolute top-0 right-0 text-green-500 bg-white rounded-full" size="lg"/>)}
</div>))}</div> </div>
<h1 className="text-green-400 text-lg font-bold shadow-green-400 text-center my-4">Players Details</h1>
<div className="w-full px-3 p-2 flex flex-row flex-wrap gap-3  md:gap-6 lg:gap-10 lg:px-12 md:my-4 md:justify-start md:items-start justify-center items-center">
  {items
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((i, index) =>
      (selectedTeams.length === 0 || selectedTeams.includes(i.team)) ? (
        <div
          key={index}
          className="flex flex-col justify-center text-center text-white font-bold bg-slate-800 rounded-md p-2"
        >
          <div className="w-full flex justify-center items-center">
            <img
              src={i.image}
              alt={i.name || "team-logo"}
              className="w-36 h-36"
            />
          </div>
          <p className="my-2">{i.name}</p>
          <div className="w-full">
            <Link to={`/profile?name=${i.name}&team=${i.team}`}>
              <button className="bg-slate-900 text-white text-base px-6 py-2 font-bold rounded-md shadow-md">
                Show Profile
              </button>
            </Link>
          </div>
        </div>
      ) : null
    )
  }
</div>

</>
}

    </>
  );
};

export default PlayerSearch;