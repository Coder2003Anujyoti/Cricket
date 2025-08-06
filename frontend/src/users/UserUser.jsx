import React,{useEffect,useState} from "react";
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
  faGamepad
} from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import {HashLink} from 'react-router-hash-link'
import { socket } from "../socket/socket"; 
const get_data=()=>{
  return sessionStorage.getItem("token")
}
const get_role=()=>{
  return JSON.parse(sessionStorage.getItem("role"))
}
const UserUser = () => {
const token=get_data()
  const role=get_role()
  const today = new Date(); 
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);
  const teams=["Mi","Csk","Rr","Kkr","Gt","Pbks","Rcb","Lsg","Dc","Srh"];
  const [isOpen, setIsOpen] = useState(false);
  const [loading,setLoading]=useState(true)
  const [items,setItems]=useState([])
  const [show,setShow]=useState("")
  const [start,setStart]=useState(false)
  const [message,setMessage]=useState("")
const [playerrun, setPlayerRun] = useState(0);
const [computerrun, setComputerRun] = useState(0);
const [playerwicket, setPlayerWicket] = useState(0);
const [computerwicket, setComputerWicket] = useState(0);
const [count,setCount]=useState(0)
const [target,setTarget]=useState(0)
const [overs, setOvers] = useState("");
const [winner,setWinner]=useState("")
  const show_data=async()=>{
    try{
     const response = await fetch("https://intelligent-ailyn-handcricket-e8842259.koyeb.app/gettournaments");
    let data=await response.json()
    if(!data.error){
     setTimeout(()=>{
      setLoading(false)
      setItems(data.tournaments_data)
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
    socket.emit("latejoin"); 
    socket.on("storelate", (msg) => {
    setShow(msg.id);
    setStart(msg.start);
    setMessage(msg.msg);
    setPlayerRun(msg.playerrun);
    setPlayerWicket(msg.playerwicket);
    setComputerRun(msg.computerrun);
    setComputerWicket(msg.computerwicket);
    setOvers(msg.overs);
    setTarget(msg.target);
    setWinner(msg.winner);
  });
  },[overs])
  useEffect(() => {
  // Request current game state immediately after connecting
 // 🔁 This triggers backend to send store[0]

  socket.on("gamestart", (msg) => {
    setShow(msg.id);
    setStart(msg.start);
  });

  socket.on("gamebeforetoss", (msg) => {
    setShow(msg.id);
    setMessage(msg.msg);
  });

  socket.on("gameplay", (msg) => {
    setShow(msg.id);
    setPlayerRun(msg.playerrun);
    setPlayerWicket(msg.playerwicket);
    setComputerRun(msg.computerrun);
    setComputerWicket(msg.computerwicket);
    setOvers(msg.overs);
  });

  socket.on("gameaddtarget", (msg) => {
    setShow(msg.id);
    setPlayerRun(msg.playerrun);
    setPlayerWicket(msg.playerwicket);
    setComputerRun(msg.computerrun);
    setComputerWicket(msg.computerwicket);
    setOvers(msg.overs);
    setTarget(msg.target);
  });

  socket.on("gameplaycomputer", (msg) => {
    setShow(msg.id);
    setComputerRun(msg.computerrun);
    setComputerWicket(msg.computerwicket);
    setOvers(msg.overs);
  });

  socket.on("gameresult", (msg) => {
    setShow(msg.id);
    setComputerRun(msg.computerrun);
    setComputerWicket(msg.computerwicket);
    setOvers(msg.overs);
    setWinner(msg.winner);
    setMessage(msg.msg);
    setTarget(msg.target);
    setStart(msg.start);
  });

  socket.on("gamecresult", (msg) => {
    setShow(msg.id);
    setPlayerRun(msg.playerrun);
    setPlayerWicket(msg.playerwicket);
    setOvers(msg.overs);
    setWinner(msg.winner);
    setMessage(msg.msg);
    setTarget(msg.target);
    setStart(msg.start);
  });

  socket.on("gameplayplayer", (msg) => {
    setShow(msg.id);
    setPlayerRun(msg.playerrun);
    setPlayerWicket(msg.playerwicket);
    setOvers(msg.overs);
  });
}, []);
  
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
              <Link to="/" className="flex items-center space-x-3 text-white font-medium hover:text-indigo-500">
          <FontAwesomeIcon icon={faHouse} className="w-5 h-5 text-indigo-500" />
          <span>Home</span>
        </Link>
    <Link to="/useruser" className="flex items-center space-x-3 text-white font-medium hover:text-pink-500">
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
<div className="w-full flex items-center">
<img src="Screen/Main.webp" />
</div>
<div className="w-full  flex flex-col justify-center md:hidden">
  <div id='adminabout' className="w-full py-2 flex-col flex justify-center border-b border-b-slate-600
  border-l-transparent border-r-transparent border-t-transparent items-center text-center">

    <h3 className="text-lg text-slate-400 font-bold">About</h3>
    <div className="w-full flex-row items-center flex-wrap flex text-center  justify-center"> <p className="text-xs text-slate-400 ml-2 mr-2 font-bold">The official IPL app is your go-to platform for tracking all the players in the Indian Premier League. This app offers an extensive list of all the players participating in the tournament, allowing fans to quickly find and explore their favourite stars.Whether you are looking for a specific player or just want to explore the talent in the IPL, the IPL app provides a simple and intuitive way to stay up-to-date with player information.
This version focuses purely on the display of player names, ideal for an app where the primary purpose is to showcase players.</p>
</div>
</div>
</div>
<div id="adminservices" className="w-full mt-2 flex justify-center flex-col md:hidden text-center border-b border-b-slate-600">
     <h3 className="text-lg text-slate-400 font-bold">Services</h3>
 <div className="w-full py-4 flex flex-wrap gap-x-6 gap-y-4 items-center justify-center    flex-col">
  <div className="flex w-full justify-center gap-x-6 flex-row flex-wrap">
   <HashLink to='/loginprofile'>
   <div className="text-center rounded-lg  bg-slate-800 p-4 flex w-36 h-36 flex flex-col justify-center text-center gap-y-2 ">
   <div className="w-full p-2 flex justify-center"><img src="Icons/cricket.webp" className="w-16 h-16"></img></div>
    <h4 className="text-lg text-slate-400 font-bold">Profile</h4>
    </div>
    </HashLink>
       <HashLink to='/online'>
   <div className="text-center rounded-lg  bg-slate-800 p-4 flex w-36 h-36 flex flex-col justify-center text-center gap-y-2 ">
   <div className="w-full p-2 flex justify-center"><img src="Icons/online.png" className="w-16 h-16"></img></div>
    <h4 className="text-lg text-slate-400 font-bold">Online</h4>
    </div>
    </HashLink>
    </div>
          <div className="flex w-full justify-center gap-x-6 flex-row flex-wrap">
 <HashLink to='/allleaderboard'>
   <div className="text-center rounded-lg  bg-slate-800 p-4 flex w-36 h-36 flex flex-col justify-center text-center gap-y-2 ">
   <div className="w-full p-2 flex justify-center"><img src="Icons/c1.png" className="w-16 h-16"></img></div>
    <h4 className="text-lg text-slate-400 font-bold">LeaderBoard</h4>
    </div>
    </HashLink>
     <HashLink to='/alltournaments'>
   <div className="text-center rounded-lg  bg-slate-800 p-4 flex w-36 h-36 flex flex-col justify-center text-center gap-y-2 ">
   <div className="w-full p-2 flex justify-center"><img src="Icons/c2.png" className="w-16 h-16"></img></div>
    <h4 className="text-lg text-slate-400 font-bold">Tournaments</h4>
    </div>
    </HashLink>
    </div>
    </div>
  { items.length > 0 && <>
     <h1 className="text-green-400 text-lg font-bold shadow-green-400">Ongoing Tournaments</h1>
    <div className="overflow-x-auto scroll-smooth px-3 py-4">
  <div className="flex gap-4">
    {items.filter((i,index)=> index < 5).sort((a,b)=>b.hasStarted-a.hasStarted).map((t, idx) => (
  <div key={idx} className="min-w-[300px] max-w-[300px] bg-slate-800 text-white p-5 rounded-xl shadow-lg flex-shrink-0">
{ ((winner=="" && show==t.matchID) && t.winner=="") && <>
{ ((show==t.matchID && start==true)|| t.hasStarted==true) &&  <>
  <span className="text-red-600 text-xl"><FaBroadcastTower /></span>
  <p className="text-white font-bold">Live</p>
  </>}
  </>
  }
<div className="flex items-center justify-between gap-4">
<div className="flex flex-col items-center">
<img src={`Logos/${t.playerteam}.webp`} alt={t.playerteam} className="w-24 h-24"/>
<p className=" text-base font-bold">{t.playerteam.toUpperCase()}</p>
{((t.matchID === show && (playerrun > 0 || playerwicket > 0)) || (t.playerrun > 0 || t.playerwicket > 0)) && 
  <>
    <p className="text-base font-bold">
      {t.matchID === show
        ? `${playerrun}/${playerwicket}`
        : `${t.playerrun}/${t.playerwicket}`}
    </p>
  </>
}
</div>
  <div className="text-center">
 <h2 className="text-base font-extrabold">V/S</h2>
</div>
<div className="flex flex-col items-center">
<img src={`Logos/${t.computerteam}.webp`} alt={t.computerteam} className="w-24 h-24"/>
<p className="text-base font-bold">{t.computerteam.toUpperCase()}</p>
{((t.matchID === show && (computerrun > 0 || computerwicket > 0)) || (t.computerrun > 0 || t.computerwicket > 0)) &&   
  <>  
    <p className="text-base font-bold">  
      {t.matchID === show
        ? `${computerrun}/${computerwicket}`  
        : `${t.computerrun}/${t.computerwicket}`}  
    </p>  
  </>  
}
</div></div>
<div className="flex justify-center items-center flex-col gap-4">
<div className="text-center flex flex-col gap-1">
{ ((winner=="" && show==t.matchID) && t.winner=="") && <>
{ ((show==t.matchID && message!="") || t.message!="") && 
<h2 className="text-base my-2 font-bold">{ (show==t.matchID && message!="") ? message : t.message}</h2>}
{( (show === t.matchID && overs!="" ) || t.overs !== "") && 
  <h2 className="text-base font-bold">Overs: {(show==t.matchID && overs!="") ? overs : t.overs}</h2>}
{ (show==t.matchID && ( t.target!=0 || target!=0)) &&  <h2 className="text-base font-bold">Target-: {(target!=0 && show==t.matchID) ? target : t.target}</h2>}
</>
}
{ ((winner!="" && show==t.matchID) || t.winner!="")  && <h2 className="text-base font-bold">{ (winner!="" && show==t.matchID) ? winner : t.winner}</h2>}
</div>
<div className="text-center flex flex-col">
<h2 className="text-base font-bold">{t.name}</h2>
<h2 className="text-xs font-semibold">{t.time}</h2>
</div>
</div>
<div className="flex justify-center gap-3 mt-4">
{ show!=t.matchID && t.hasStarted==false && t.winner==""  && 
<HashLink smooth to={`/usermake?player=${t.playerteam}&&computer=${t.computerteam}&&id=${t.matchID}`}>
<button className="bg-slate-900 text-white text-base px-6 py-2 font-bold rounded-md shadow-md">Make Team</button>
  </HashLink>
}
{ ((show==t.matchID && winner!="") || t.winner!='') && 
<HashLink smooth to={`/onlinescore?id=${t.matchID}`}>
<button className="bg-slate-900 text-white text-base px-6 py-2 font-bold rounded-md shadow-md">Score</button>
  </HashLink>
}
{ ((show==t.matchID && winner!="") || t.winner!='') &&
<HashLink smooth to={`/leaderboard?id=${t.matchID}`}>
<button className="bg-slate-900 text-white text-base px-6 py-2 font-bold rounded-md shadow-md">Leaderboard</button>
  </HashLink>
}
        </div>
      </div>
    ))}
  </div>
</div>
</>
}
</div>
  <div id="admingallery" className="w-full py-2 my-4 flex-col flex justify-center  items-center text-center md:hidden p-2 gap-2">
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
        <footer className="bg-black text-white block md:hidden">
      <div className="w-full flex justify-center  text-center flex-col p-4 mt-4">
        <h2 className="text-xl font-semibold">Quick Links</h2>
        <ul className="mt-4 flex flex-row flex-wrap justify-center gap-x-12">
    <HashLink smooth to='#adminabout'> <li className="text-gray-400">
       About Us</li></HashLink>
     <HashLink smooth to='#adminservices'> <li className="text-gray-400">Services</li></HashLink>
     <HashLink smooth to='#admingallery'><li className="text-gray-400">Gallery</li></HashLink>
        </ul>
     </div>
      <div className="w-full flex justify-center  text-center flex-col mt-4">
        <h2 className="text-xl font-semibold">Teams</h2>
        <ul className="mt-4 flex flex-row flex-wrap justify-center gap-x-6 gap-y-4">
        {teams.map((i)=>{
          return(<>
          <li>
<img className="w-12 h-12" src={`Logos/${i}.webp`}/></li>
          </>)
        })}
        </ul>
      </div>
    <div className="w-full flex justify-center gap-y-2  text-center flex-col p-4 mt-4">
    <h2 className="text-xl font-semibold">Sponsors</h2>
    <div className="mt-4 flex flex-row flex-wrap justify-center gap-x-6 gap-y-4 ">
  {new Array(4).fill("").map((i,ind)=>{
  return(
  <>
  <div className="text-center">
    <img src={`sponsor/sponsor${ind+1}.png`} className="w-22 h-12"></img>
    </div>
    </>
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
</>
}
  </>

  );
};
export default UserUser;

