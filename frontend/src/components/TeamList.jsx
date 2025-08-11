import React,{useState,useEffect,useRef} from "react";
import { FaChevronLeft, FaChevronRight,FaArrowUp } from "react-icons/fa";
import {Link} from 'react-router-dom'
import {HashLink} from 'react-router-hash-link'
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
  faUser
} from '@fortawesome/free-solid-svg-icons';
const get_data2=()=>{
  return sessionStorage.getItem("token")
}
const get_role=()=>{
  return JSON.parse(sessionStorage.getItem("role"))
}
const TeamList = () => {
const token=get_data2()
  const role=get_role()
  const teams=["Mi","Csk","Rr","Kkr","Gt","Pbks","Rcb","Lsg","Dc","Srh"];
  const [load,setLoad]=useState(true);
 const [value,setValue]=useState([]);
 const [isOpen, setIsOpen] = useState(false);
 const [logos,setLogos]=useState([])
 const [closed,setClosed]=useState(false)
 const [toggle,setToggle]=useState(false);
 const scrollRef = useRef(null);
 const imageRef=useRef(null)
const get_data=async()=>{
  const response=await fetch("https://intelligent-ailyn-handcricket-e8842259.koyeb.app/");
  const item= await response.json();
  setValue(item.data)
  setLogos(item.details)
 setLoad(false)
}
  useEffect(()=>{
    setLoad(true)
    get_data();
  },[])
  useEffect(() => {
  if(closed==false){
    document.body.style.overflow = "hidden"; 
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [closed]);
  const scroll = (direction) => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };
    const scrollx = (direction) => {
    const container = imageRef.current;
    if (container) {
      const scrollAmount = 300;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
  {load==true && <>
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
{ load===false && <>
{ closed==false && <>
<div className="fixed md:hidden inset-0 flex items-center justify-center z-[100] overflow-hidden">
  {/* Blurred Background */}
  <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>

  {/* Image Container */}
{/* Image Container */}
<div className="relative z-[101] max-w-[90%] max-h-[90%]">
  {/* Close Button */}
  <button onClick={()=>setClosed(!closed)}
    className="absolute -top-4 -right-4 bg-gray-900  text-white rounded-full px-3 py-2 shadow-lg text-center font-bold transition-all duration-200 flex items-center justify-center"
  >
    <FontAwesomeIcon icon={faTimes} className="text-lg text-white font-bold" />
  </button>

  {/* Image */}
  <img
    src={`Floats/float${Math.floor(Math.random()*2)+1}.webp`}
    className="rounded-lg max-w-full max-h-full object-contain shadow-lg"
  />
</div>
</div>
</>
}
{/* //& Navbar for mobile */}
  <div className="relative w-full bg-slate-800 flex items-center justify-between p-2 z-50 lg:hidden md:px-4 md:py-3">
  <img className="w-28 h-16" src={`Logos/Logo.webp`} />
    <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
    <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className="w-8 h-8" />
  </button>
  { role=="admin" ? <>
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

        {role === "admin" && (
          <Link to="/create" className="flex items-center space-x-3 text-white font-medium hover:text-yellow-500">
            <FontAwesomeIcon icon={faTrophy} className="w-5 h-5 text-yellow-500" />
            <span>Admin</span>
          </Link>
        )}

        <Link to="/adminuser" className="flex items-center space-x-3 text-white font-medium hover:text-green-500 md:hidden">
          <FontAwesomeIcon icon={faUserShield} className="w-5 h-5 text-green-500" />
          <span>User</span>
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
      { role=="user" && <> <Link to="/playersearch" className="flex items-center space-x-3 text-white font-medium hover:text-green-500">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="w-5 h-5 text-green-500" />
          <span>Search</span>
        </Link></>}
          { role=="user" && <> <Link to="/news" className="flex items-center space-x-3 text-white font-medium hover:text-yellow-500">
          <FontAwesomeIcon icon={faNewspaper} className="w-5 h-5 text-yellow-500" />
          <span>News</span>
        </Link> </>  } 
        {role=="admin" && <>
         <Link to="/admin" className="flex items-center space-x-3 text-white font-medium hover:text-pink-500">
          <FontAwesomeIcon icon={faGamepad} className="w-5 h-5 text-pink-500" />
          <span>About</span>
        </Link>
        </>}
         {role === "admin" && (
          <Link to="/create" className="flex items-center space-x-3 text-white font-medium hover:text-yellow-500">
            <FontAwesomeIcon icon={faTrophy} className="w-5 h-5 text-yellow-500" />
            <span>Admin</span>
          </Link>
        )}
         <Link to="/loginprofile" className="flex items-center space-x-3 text-white font-medium hover:text-pink-500">
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
{/* //& About section for mobile */}
  <div className="w-full flex md:hidden items-center">
<img src="Screen/About.webp" />
</div>
<div className="w-full  flex flex-col justify-center md:hidden">
  <div id='about' className="w-full py-2 flex-col flex justify-center border-b border-b-slate-600
  border-l-transparent border-r-transparent border-t-transparent items-center text-center">

    <h3 className="text-lg text-slate-400 font-bold">About</h3>
    <div className="w-full flex-row items-center flex-wrap flex text-center  justify-center"> <p className="text-xs text-slate-400 ml-2 mr-2 font-bold">The official IPL app is your go-to platform for tracking all the players in the Indian Premier League. This app offers an extensive list of all the players participating in the tournament, allowing fans to quickly find and explore their favourite stars.Whether you are looking for a specific player or just want to explore the talent in the IPL, the IPL app provides a simple and intuitive way to stay up-to-date with player information.
This version focuses purely on the display of player names, ideal for an app where the primary purpose is to showcase players.</p>
</div>
</div>
</div>
{/* //* About section for big screens */}
<div  className="relative w-full h-full min-h-[24rem] md:flex hidden items-center justify-center overflow-hidden ">
  <img
    src="Screen/Main.webp"
    alt="Background"
    className="absolute inset-0 w-full h-full object-cover blur-sm  scale-150"
  />
  <div className="absolute inset-0 bg-slate-900/70 " />
  <div className="relative z-10 flex items-center justify-center h-full w-full">
  <div className="text-white max-w-2xl px-6 py-8 space-y-8 text-center">
    <h1 className="text-3xl md:text-5xl font-bold drop-shadow-lg">
      Welcome to Cricket Fever
    </h1>
    <p className="text-base md:text-lg font-medium leading-relaxed drop-shadow">
      Dive into the thrilling world of IPL! Track your favorite teams, view match stats, and relive unforgettable moments.
      Whether you're a hardcore fan or just getting started, this platform is your ultimate companion for the cricketing season.
    </p>
  </div>
</div>
</div>
<section id="abouts" className=" py-16 px-6 md:px-16 text-white hidden md:block">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white drop-shadow-lg">
          About </h2>
        <p className="text-lg md:text-lg font-semibold leading-relaxed text-gray-200">
          The official Cricket Fever App is your go-to platform for tracking all the players in the Indian Premier League. 
          This app offers an extensive list of all the players participating in the tournament, 
          allowing fans to quickly find and explore their favourite stars.
          Whether you are looking for a specific player or just want to explore the talent in the IPL, 
          the IPL app provides a simple and intuitive way to stay up-to-date with player information.
        This version focuses purely on the display of player names, 
          ideal for an app where the primary purpose is to showcase players.
        </p>
      </div>
    </section>
     <section id="servicess" className="py-12 px-6 text-white relative border-b  border-t border-t-slate-600 border-b-slate-600 hidden md:block">
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
        IPL Points Table
      </h2>
      <div className="absolute left-4 top-[50%] transform -translate-y-1/2 z-10 lg:block md:hidden">
        <button
          onClick={() => scroll("left")}
          className="bg-slate-900 text-white p-2 rounded-full shadow font-bold"
        >
          <FaChevronLeft />
        </button>
      </div>
      <div className="absolute right-4 top-[50%] transform -translate-y-1/2 z-10 lg:block md:hidden">
        <button
          onClick={() => scroll("right")}
          className="bg-slate-900 text-white p-2 rounded-full shadow"
        >
          <FaChevronRight />
        </button>
      </div>
      <div
        ref={scrollRef}
        className="flex space-x-6 overflow-x-auto scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-gray-800 px-2 py-4"
      >
        {logos.sort((a,b)=>b.win-a.win).map((team, index) => (
          <Link  to={`/details?team=${team.teamid}`}>
          <div
            key={team.id}
            className="relative bg-slate-800 min-w-[250px] bg-[#1b263b] rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center transition-transform duration-300"
          >
            <div className="absolute top-2 left-2 bg-slate-900 text-white text-xl font-bold px-3 py-1 rounded-full shadow">
              {index + 1}
            </div>
            <img
              src={`Logos/${team.teamid}.webp`}
              alt={team.name}
              className="w-20 h-20 object-contain mb-4"
            />
            <h3 className="text-xl font-bold mb-2 text-white text-center">
              {team.team}
            </h3>
            <div className="flex flex-col gap-6 items-center my-4">
              <div className="bg-slate-900 px-4 py-1 rounded-full text-sm font-bold text-white shadow">
                Matches: {team.matches}
              </div>
              <div className="flex flex-row gap-6 items-center">
                <div className="bg-slate-900 px-4 py-1 rounded-full text-sm font-bold text-white shadow">
                  Wins: {team.win}
                </div>
                <div className="bg-slate-900 px-4 py-1 rounded-full text-sm font-bold text-white shadow">
                  Losses: {team.lose}
                </div>
              </div>
            </div>
          </div>
          </Link>
        ))}
      </div>
    </section>
    <section id="gallerys" className="my-10 text-white relative hidden md:block">
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white text-center">
        IPL Moments Gallery
      </h2>
      <div className="absolute left-4 top-[50%] transform -translate-y-1/2 z-10 lg:block md:hidden">
        <button
          onClick={() => scrollx("left")}
          className="bg-slate-900 text-white p-2 rounded-full shadow"
        >
          <FaChevronLeft />
        </button>
      </div>
      <div className="absolute right-4 top-[50%] transform -translate-y-1/2 z-10 lg:block md:hidden">
        <button
          onClick={() => scrollx("right")}
          className="bg-slate-900 text-white p-2 rounded-full shadow"
        >
          <FaChevronRight />
        </button>
      </div>
      <div
        ref={imageRef}
        className="flex space-x-6 overflow-x-auto scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-gray-800 px-2 py-4"
      >
        {new Array(8).fill("").map((img,ind) => (
          <div
            key={img.id}
            className="min-w-[500px] h-[320px] bg-[#1b263b] rounded-2xl overflow-hidden shadow-lg transition-transform duration-300"
          >
            <img
              src={`Gallery/pic${ind+3}.jpg`}
              alt={img.alt}
              className="w-88 h-88 object-cover"
            />
          </div>
        ))}
      </div>
    </section>
    {/* //& Services for mobile */}
<div id="services" className="w-full mt-2 flex justify-center flex-col md:hidden text-center border-b border-b-slate-600">
     <h3 className="text-lg text-slate-400 font-bold">Services</h3>
    <div className="w-full py-4 flex flex-wrap gap-x-6 gap-y-4 items-center justify-center    flex-col">
  <div className="flex w-full justify-center gap-x-6 flex-row flex-wrap">
     <div onClick={()=>setToggle(!toggle)} className="text-center w-36 h-36 flex justify-center rounded-lg  bg-slate-800 p-2 flex flex-col gap-y-2 ">
   <div className="w-full  flex justify-center"><img src="Icons/partners.png" className="w-20 h-20"></img></div>
    <h4 className="text-lg text-slate-400 font-bold">Teams</h4>
    </div>
      <HashLink to='/iplsite'>
    <div className="text-center w-36 h-36 flex justify-center rounded-lg  bg-slate-800 p-2 flex flex-col gap-y-2 ">
   <div className="w-full  flex justify-center"><img src="Icons/bus.png" className="w-20 h-20"></img></div>
    <h4 className="text-lg text-slate-400 font-bold">Road to IPL</h4>
    </div>
    </HashLink>
    </div>
    </div>
{ toggle===true && <> <div className="w-full mt-2 flex justify-center">
 <h1 className="text-green-400 text-2xl font-bold shadow-green-400">Select your Team</h1></div>
<div className="w-full mt-4 flex flex-wrap gap-x-6 gap-y-4 items-center justify-center  p-2 flex-row">
  {teams.map((i)=>{
  return(
 <Link  to={`/details?team=${i}`}>
  <div className="text-center rounded-lg  bg-slate-800">
    <img src={`Logos/${i}.webp`} className="w-24 h-24"></img>
    <h4 className="text-lg text-slate-400 font-bold">{i.toUpperCase()}</h4>
    </div>
    </Link>
    )
  })}
</div>
</>}
 <div className="w-full py-4 flex flex-wrap gap-x-6 gap-y-4 items-center justify-center    flex-col">
  <div className="flex w-full justify-center gap-x-6 flex-row flex-wrap">
   <HashLink to='/auction'>
   <div className="text-center rounded-lg  bg-slate-800 p-4 flex w-36 h-36 flex flex-col justify-center text-center gap-y-2 ">
   <div className="w-full p-2 flex justify-center"><img src="Icons/V.png" className="w-16 h-16"></img></div>
    <h4 className="text-lg text-slate-400 font-bold">One Vs One</h4>
    </div>
    </HashLink>
       <HashLink to='/bid'>
   <div className="text-center rounded-lg  bg-slate-800 p-4 flex w-36 h-36 flex flex-col justify-center text-center gap-y-2 ">
   <div className="w-full p-2 flex justify-center"><img src="Icons/stadium.png" className="w-16 h-16"></img></div>
    <h4 className="text-lg text-slate-400 font-bold">Tournament</h4>
    </div>
    </HashLink>
    </div>
    </div>
    </div>
  <div id="gallery" className="w-full py-2 my-4 flex-col flex justify-center  items-center text-center md:hidden p-2 gap-2">
    <h3 className="text-lg text-slate-400 font-bold">Gallery</h3>
    <div className="w-full  flex flex-wrap gap-x-6 gap-y-4 items-center justify-center  p-2 flex-row ">
  {new Array(8).fill("").map((i,ind)=>{
  return(
  <div className="text-center rounded-lg  bg-slate-800 transition duration-300 ease-in-out transform hover:bg-slate-800  hover:scale-105">
    <img src={`Gallery/pic${ind+3}.jpg`} className="w-36 h-24 rounded-md shadow-slate-800"></img>
    </div>
    )
  })}
</div>
    </div>
    {/* //& Footer for mobile */}
    <footer className="bg-black text-white block md:hidden">
      <div className="w-full flex justify-center  text-center flex-col p-4 mt-4">
        <h2 className="text-xl font-semibold">Quick Links</h2>
        <ul className="mt-4 flex flex-row flex-wrap justify-center gap-x-12">
    <HashLink smooth to='#about'> <li className="text-gray-400">
       About Us</li></HashLink>
     <HashLink smooth to='#services'> <li className="text-gray-400">Services</li></HashLink>
     <HashLink smooth to='#gallery'><li className="text-gray-400">Gallery</li></HashLink>
        </ul>
     </div>
      <div className="w-full flex justify-center  text-center flex-col mt-4">
        <h2 className="text-xl font-semibold">Teams</h2>
        <ul className="mt-4 flex flex-row flex-wrap justify-center gap-x-6 gap-y-4">
        {teams.map((i)=>{
          return(<>
         <Link to={`/history?team=${i}`}><li><img className="w-12 h-12" src={`Logos/${i}.webp`}/></li></Link>
          </>)
        })}
        </ul>
      </div>
    <div className="w-full flex justify-center gap-y-2  text-center flex-col p-4 mt-4">
    <h2 className="text-xl font-semibold">Sponsors</h2>
    <div className="mt-4 flex flex-row flex-wrap justify-center gap-x-6 gap-y-4 ">
  {new Array(4).fill("").map((i,ind)=>{
  return(
  <div className="text-center">
    <img src={`sponsor/sponsor${ind+1}.png`} className="w-22 h-12"></img>
    </div>
    )
  })}
</div>
    </div>
    <div className="border-t border-gray-700 mt-4 p-2 text-center text-gray-400">
      © 2025 Coder2003Anujyoti All rights reserved.
    </div>
<HashLink smooth to="/chat">
     <button
  className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-slate-900 border border-slate-500 text-white p-2 sm:p-3 rounded-full shadow-md sm:shadow-lg  transition-all duration-300 z-50"
  aria-label="Scroll to top"
>
<img src="Icons/ai.png" className="w-8 h-8"/>
</button>
</HashLink>
</footer>
  {/* //* Footer for big screen */}
 <footer className="bg-black text-white pt-1 hidden md:block">
      <div className="w-full flex justify-center  text-center flex-col p-4 mt-4">
        <h2 className="text-xl font-semibold">Quick Links</h2>
        <ul className="mt-4 flex flex-row flex-wrap justify-center gap-x-12">
    <HashLink smooth to='#abouts'> <li className="text-gray-400">
       About Us</li></HashLink>
     <HashLink smooth to='#servicess'> <li className="text-gray-400">Services</li></HashLink>
     <HashLink smooth to='#gallerys'><li className="text-gray-400">Gallery</li></HashLink>
        </ul>
     </div>
      <div className="w-full flex justify-center  text-center flex-col mt-4">
        <h2 className="text-xl font-semibold">Teams</h2>
        <ul className="mt-4 flex flex-row flex-wrap justify-center gap-x-6 gap-y-4 ml-2 mr-2">
        {teams.map((i)=>{
          return(<>
        <li><img className="w-16 h-16" src={`Logos/${i}.webp`}/></li>
          </>)
        })}
        </ul>
      </div>
            <div className="w-full flex justify-center gap-y-2  text-center flex-col p-4 mt-4">
    <h2 className="text-xl font-semibold">Sponsors</h2>
    <div className="mt-4 flex flex-row flex-wrap justify-center gap-x-10 gap-y-4 ">
  {new Array(4).fill("").map((i,ind)=>{
  return(
  <div className="text-center">
    <img src={`sponsor/sponsor${ind+1}.png`} className="w-22 h-12"></img>
    </div>
    )
  })}
</div>
    </div>
    <div className="border-t border-gray-700 mt-4 p-2 text-center text-gray-400">
      © 2025 Coder2003Anujyoti All rights reserved.
    </div>
</footer>
</>}
</>
  );
};



export default TeamList;
