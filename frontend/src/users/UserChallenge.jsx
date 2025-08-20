import React,{useState,useEffect} from 'react'
import { FaArrowUp } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
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
  faNewspaper,
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
const teamicons=[{team:"Csk",image:"Csk/Gaikwad.webp"},{team:"Dc",image:"Dc/Pant.webp"},{team:"Kkr",image:"Kkr/S.Iyer.webp"},{team:"Mi",image:"Mi/Hardik.webp"},{team:"Rr",image:"Rr/Samson.webp"},{team:"Gt",image:"Gt/Gill.webp"},{team:"Pbks",image:"Pbks/Dhawan.webp"},{team:"Rcb",image:"Rcb/Duplesis.webp"},{team:"Srh",image:"Srh/Cummins.webp"},{team:"Lsg",image:"Lsg/KL Rahul.webp"}]
const UserChallenge = () => {
  const token=get_data()
  const role=get_role()
  const name=get_name()
  const [users,setUsers]=useState([])
  const [participate,setParticipate]=useState([])
  const [matchID, setMatchID] = useState("");
  const [tournamentName, setTournamentName] = useState("");
  const [closed,setClosed]=useState(false)
  const [lock,setLock]=useState(false)
  const [computerTeam, setComputerTeam] = useState(null);
  const [userTeam, setUserTeam] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [computerDropdownOpen, setComputerDropdownOpen] = useState(false);
    const [mode, setMode] = useState("challenge");
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [items,setItems]=useState([])
  const [loading,setLoading]=useState(true)
   const [subload,setSubload]=useState(false)
   const [offset,setOffset]=useState(0)
const [limit,setLimit]=useState(5)
const [len,setLen]=useState(-1)

  const filteredComputerTeams = userTeam
    ? teams.filter((team) => team.name !== userTeam.name)
    : teams;
  const handleSelect = (team) => {
    if (selectedTeams.includes(team)) {
      setSelectedTeams(selectedTeams.filter((t) => t !== team));
    } else {
      setSelectedTeams([...selectedTeams, team]);
    }
  };
   const location = useLocation();
   const show_data=async()=>{
    try{
      if(!token){
        console.log("error")
        return;
      }
var data,rooms;
if(offset==0){
  let [response, roo] = await Promise.all([
 fetch( `https://intelligent-ailyn-handcricket-e8842259.koyeb.app/getchallenges?offset=${offset}&&limit=${limit}&&username=${encodeURIComponent(name)}`),
fetch(`https://intelligent-ailyn-handcricket-e8842259.koyeb.app/getprofilerooms?username=${encodeURIComponent(name)}`)]);
 [data, rooms] = await Promise.all([response.json(), roo.json()]);
}
if(offset!=0){
let res = await fetch(`https://intelligent-ailyn-handcricket-e8842259.koyeb.app/getchallenges?offset=${offset}&&limit=${limit}&&username=${encodeURIComponent(name)}`, { method: "GET" });
data = await res.json();
}
    if(!data.error && offset==0){
     setTimeout(()=>{
      setLoading(false)
      setSubload(false)
      setUsers(rooms)
      setLen(data.total)
      setOffset(offset+5)
      setItems(data.challenges_data)
      setParticipate(data.participatedIds)
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
window.scrollTo({ top: 0, behavior: "smooth" });
  toast.dismiss();
},[])
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
const handSubmit = async() => {
    if (tournamentName && matchID && userTeam && computerTeam) {
   try{
      const response = await fetch("https://intelligent-ailyn-handcricket-e8842259.koyeb.app/addprofilerooms", {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    player: tournamentName.trim(),
    computer: matchID.trim(),
    playerteam: userTeam.name,
    computerteam: computerTeam.name
  }),
});
    const data=await response.json();
    if(!response.ok){
        toast.error(<strong  style={{ whiteSpace: 'nowrap' }}>Session Timeout</strong>);
    }
    else if(response.ok){
      toast.success(<strong  style={{ whiteSpace: 'nowrap' }}>Room created successfully</strong>);
    }
  }
    catch(err){
        console.log(err)
     toast.error(<strong  style={{ whiteSpace: 'nowrap' }}>Something went wrong</strong>);
      }
      finally {
      setLock(false);
      setTournamentName("")
      setUserTeam(null)
      setComputerTeam(null)
      setUserDropdownOpen(false)
      setComputerDropdownOpen(false)
      setMatchID("")
    }
    } else {
       toast.error("Invalid input");
       setLock(false)
    }
  };
const handleCreate = () => {
  if (!lock) {
    setLock(true);
    handSubmit();
  }
};
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
  <div className="flex justify-evenly mt-4">
  <button
    onClick={() => setMode("challenge")}
    className={`px-4 py-2 font-bold ${mode === "challenge" ? 'border-b border-b-white text-white' : 'text-white border-b border-b-transparent'}`}
  >
  Challenge
  </button>
  <button
    onClick={() => {setMode("create")
    }}
    className={`px-4 py-2 font-bold  ${mode === "create" ? 'border-b border-b-white text-white' : 'text-white border-b border-b-transparent'}`}
  >
  Create
  </button>
    <button
    onClick={() => setMode("room")}
    className={`px-4 py-2 font-bold  ${mode === "room" ? 'border-b border-b-white text-white' : 'text-white border-b border-b-transparent'}`}
  >
  Room
  </button>
  </div>
{ mode=="challenge" && <>
{
  items.length>0 && <>
  <div className="overflow-x-auto scroll-smooth px-3 py-4 my-4 lg:flex lg:justify-center lg:items-center lg:py-6">
<div className="flex gap-4 w-max md:justify-center md:items-center lg:gap-10">
{teams.map((team) => (
<div key={team.name} onClick={() => handleSelect(team.name)} className="relative cursor-pointer">
<img src={`Logos/${team.name}.webp`} className="w-16 h-16 p-2 rounded-full border border-slate-800 lg:w-24 lg:h-24" />
{selectedTeams.includes(team.name) && (
<FontAwesomeIcon icon={faCheckCircle} className="absolute top-0 right-0 text-green-500 bg-white rounded-full" size="lg"/>)}
</div>))}</div></div>
  </>
}
  <h1 className="text-green-400 text-lg font-bold shadow-green-400 text-center my-4">Ongoing Challenges</h1>
  { items.length>0 && <>
 <div className="flex flex-col ml-2 mr-2 gap-4 my-4 justify-center items-center lg:px-20 md:justify-center md:items-center md:py-3 lg:ml-16 lg:gap-10 lg:items-start lg:justify-start lg:flex-row lg:flex-wrap">
 {items.map((i)=>{
  if(selectedTeams.length === 0 || selectedTeams.includes(i.playerteam) || selectedTeams.includes(i.computerteam)){
    return(<>
    <div className="w-72 h-72 bg-slate-800 flex flex-col rounded-md flex-wrap lg:w-96 lg:h-90 md:w-96 md:h-84">
 <div className="w-full mt-2 flex flex-row">
 <div className="w-2/5 ml-2 gap-1 flex flex-col items-center justify-center">
 <img src={i.playerimage} className="w-auto h-auto" />
  <img src={`Logos/${i.playerteam}.webp`} className="w-12 h-12"/>
 </div>
  <div className="w-1/5 ml-2 mr-2 flex flex-col items-center justify-center">
<h1 className="text-base text-white font-bold">V/S</h1>
 </div>
 <div className="w-2/5 gap-1 mr-2 flex flex-col items-center justify-center">
 <img src={i.computerimage} className="w-auto h-auto" />
  <img src={`Logos/${i.computerteam}.webp`} className="w-12 h-12"/>
 </div>
    </div>
<div className="w-full text-center text-white font-bold flex-col text-center">
<h1 className="text-sm">{i.name}</h1>
<p className="text-xs">{i.time}</p>
</div>
<div className="flex flex-row justify-center gap-3 mt-4">
{ !participate.includes(i.challengeID) &&
<HashLink smooth to={`/userplay?player=${encodeURIComponent(i.playerteam)}&&computer=${encodeURIComponent(i.computerteam)}&&id=${encodeURIComponent(i.challengeID)}&&name=${encodeURIComponent(i.name)}`}>
<button className="bg-slate-900 text-white text-base px-6 py-2 font-bold rounded-md shadow-md"> Play</button>
  </HashLink>
}
{ participate.includes(i.challengeID) &&
<HashLink smooth to={`/userscore?id=${i.challengeID}&&player=${i.playerteam}&&computer=${i.computerteam}`}>
<button className="bg-slate-900 text-white text-base px-6 py-2 font-bold rounded-md shadow-md">Score</button>
</HashLink>
}
<HashLink smooth to={`/leaderboard?id=${i.challengeID}`}>
  <button className="bg-slate-900 text-white text-base px-6 py-2 font-bold rounded-md shadow-md">Leaderboard</button>
    </HashLink>
        </div>
    </div>
    </>)
    }
    else{
      return null
    }
  })}
  </div>
</>}
{
  items.length==0 && 
    <h1 className="font-bold text-white text-center my-48">No Challenges Found</h1>
}
                {
  offset<len  && selectedTeams.length==0  && <>
        {
          subload==false && <>
      <div className="w-full flex justify-center">
<button
  onClick={go}
  className="flex items-center  gap-2 px-5 py-2.5 rounded-lg bg-slate-800 text-slate-400 text-sm font-bold shadow-md hover:shadow-lg hover:scale-105 hover:text-white transition-all duration-300 ease-in-out"
>
  <span>More Challenges</span>
  <FontAwesomeIcon icon={faChevronDown} />
</button>
      </div>
          </>
        }
        {
          subload==true && <>
          <div className="w-full flex items-center justify-center text-center text-slate-400 text-sm font-bold my-4"><p>Loading...</p></div>
          </>
        }
        </>
      }
  </>
  }
{ mode=="create" && <>
{ closed==false && <>
<div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
  <div className="relative bg-gray-900 text-white p-5 rounded-xl shadow-xl max-w-md w-full mx-4 animate-fadeIn">
  <button onClick={()=>setClosed(!closed)}
    className="absolute -top-0 -right-0  text-white px-3 py-2 text-center font-bold transition-all duration-200"
  >
    <FontAwesomeIcon icon={faTimes} className="text-xl text-white font-bold" />
  </button>

        <h3 className="text-lg font-bold mb-3">Room Creation Guidelines</h3>
        <ul className="list-disc font-semibold list-inside text-sm space-y-2">
          <li>⚠ Rooms are stored temporarily</li>
          <li>🗑 More than 5 rooms automatically removed the old ones</li>
          <li>🔒 Active rooms are linked to your account only</li>
          <li>🌍 Respect fair play rules while using rooms</li>
          <li>🛡 The platform is not responsible for expired rooms</li>
        </ul>
      </div>
    </div>
  </>
}
<Toaster position="top-center" toastOptions={{
className: 'font-bold',duration:2000,}}/>
<div className="max-w-xl w-full mx-auto mt-2 px-4 sm:px-6 py-4 rounded-xl space-y-6">
 <h2 className="text-xl font-bold text-center text-white">Create Room</h2>
 <input type="text" placeholder="Enter Your Username" className="w-full p-3 border font-semibold border-gray-300 rounded-md shadow-sm focus:outline-none" value={tournamentName} onChange={(e) => setTournamentName(e.target.value.replace(/\s/g,""))} />
 <input type="text" placeholder="Enter Opponent Username" className="w-full p-3 font-semibold border border-gray-300 rounded-md shadow-sm focus:outline-none"
value={matchID} onChange={(e) => setMatchID(e.target.value.replace(/\s/g,""))}
      />
<div className="relative w-full">
<label className="block mb-1 font-semibold text-white md:text-black hidden">Your Team</label>
<div className="w-full p-3 border font-semibold rounded-md cursor-pointer bg-white flex items-center justify-between"
onClick={() => { setUserDropdownOpen(!userDropdownOpen);
setComputerDropdownOpen(false);}}>
{userTeam ? (
<div className="flex items-center gap-2 font-semibold">
<img src={userTeam.logo} alt={userTeam.name} className="w-6 h-6" />
<span>{userTeam.name.toUpperCase()}</span>
</div> ) : ( <span className="text-gray-400">Select your team</span> )}
<span className="text-gray-600">▼</span>
</div>
{userDropdownOpen && (<div className="absolute z-20 bg-white w-full max-w-xs shadow-md rounded mt-1 overflow-y-auto max-h-28 md:max-h-32 left-0"> {teams.map((team) => (
<div key={team.name} className="flex items-center gap-2 px-4 py-2 font-semibold hover:bg-gray-100 cursor-pointer" onClick={() => { setUserTeam(team); setUserDropdownOpen(false);}}>
<img src={team.logo} alt={team.name} className="w-6 h-6" />
<span>{team.name.toUpperCase()}</span></div>
))} </div> )} </div>
 <div className="relative w-full">
 <label className="block mb-1 font-semibold text-white md:text-black hidden">Opppsition Team</label>
<div className="w-full p-3 border rounded-md font-semibold cursor-pointer bg-white flex items-center justify-between"
      onClick={() => {
        setComputerDropdownOpen(!computerDropdownOpen);
        setUserDropdownOpen(false);
      }}
    >
      {computerTeam ? (
        <div className="flex items-center gap-2 font-semibold">
          <img src={computerTeam.logo} alt={computerTeam.name} className="w-6 h-6" />
          <span>{computerTeam.name.toUpperCase()}</span>
        </div>
      ) : (
        <span className="text-gray-400">Select opponent team</span>
      )}
      <span className="text-gray-600">▼</span>
    </div>
    {computerDropdownOpen && (
      <div className="absolute z-20 bg-white w-full max-w-xs shadow-md rounded mt-1 overflow-y-auto max-h-28 md:max-h-32 left-0">
        {filteredComputerTeams.map((team) => (
          <div
            key={team.name}
            className="flex items-center gap-2 px-4 py-2 font-semibold hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              setComputerTeam(team);
              setComputerDropdownOpen(false);
            }}
          >
            <img src={team.logo} alt={team.name} className="w-6 h-6" />
            <span>{team.name.toUpperCase()}</span>
          </div>
        ))}
      </div>
    )}
  </div>
    <button
 disabled={lock} onClick={handleCreate}
        className="w-full bg-slate-800 text-white font-bold py-2 px-4 rounded-md transition duration-300"
      >
        Create
      </button>
      <button
 disabled={lock} onClick={()=>setClosed(false)}
        className="w-full bg-slate-800 text-white font-bold py-2 px-4 rounded-md transition duration-300"
      >
        Guidelines
      </button>
      </div>
  </>
}
{
  mode=="room" && <>
      <div className=" my-4 ml-4 mr-4 flex rounded-md flex-col bg-slate-800 p-2">
     <div className="w-full flex  justify-end items-center gap-2 md:hidden">
  <img src="Icons/coin.png" className="w-8 h-8" />
  <h1 className="font-bold text-white text-base">{users.total}</h1>
  </div>
<div className="w-full flex flex-row p-2">
<div className="w-1/2 flex items-center justify-center">
          { users.icon!= "" ?
  <img className="w-24 h-24 lg:w-64 lg:h-64" src={users.icon} alt="Logo" /> :
  <img className="w-20 h-20 lg:w-60 lg:h-60" src={`Icons/cricket.webp`} />}
</div>
<div className="w-1/2 flex flex-col items-start justify-start text-white text-sm font-bold flex-wrap">
<h1>{users.username}</h1>
<h1>{"*".repeat(users.password.length)}</h1>
<h1>Welcome {users.username}</h1>
</div>
</div>
    </div>
  <h1 className="text-green-400 text-lg font-bold shadow-green-400 text-center my-4">Ongoing Rooms</h1>
    { users.rooms.length>0 && <>
 <div className="flex flex-col ml-2 mr-2 gap-4 my-4 justify-center items-center lg:px-20 md:justify-center md:items-center md:py-3 lg:ml-16 lg:gap-10 lg:items-start lg:justify-start lg:flex-row lg:flex-wrap">
 {users.rooms.map((i)=>{
    return(<>
    <div className="w-72 h-54 p-2 bg-slate-800 flex flex-col rounded-md flex-wrap lg:w-96 lg:h-90 md:w-96 md:h-84">
 <div className="w-full mt-2 flex flex-row">
 <div className="w-2/5 ml-2 gap-1 flex flex-col items-center justify-center">
 <img src={teamicons.filter((it)=>it.team==i.playerteam)[0].image} className="w-auto h-auto" />
  <img src={`Logos/${i.playerteam}.webp`} className="w-12 h-12"/>
    <h1 className="text-sm text-white font-bold">{i.player}</h1>
 </div>
  <div className="w-1/5 ml-2 mr-2 flex flex-col items-center justify-center">
<h1 className="text-base text-white font-bold">V/S</h1>
 </div>
 <div className="w-2/5 gap-1 mr-2 flex flex-col items-center justify-center">
 <img src={teamicons.filter((it)=>it.team==i.computerteam)[0].image} className="w-auto h-auto" />
  <img src={`Logos/${i.computerteam}.webp`} className="w-12 h-12"/>
<h1 className="text-sm font-bold text-white">{i.computer}</h1>
 </div>
    </div>
<div className="flex flex-row mt-4 justify-center gap-3 ">
{ !participate.includes(i.challengeID) &&
<HashLink smooth to={`/onlinedual?id=${encodeURIComponent(name)}&&player=${encodeURIComponent(i.player)}&&playerteam=${encodeURIComponent(i.playerteam)}&&computerteam=${encodeURIComponent(i.computerteam)}`}>
<button className="bg-slate-900 text-white text-base px-6 py-2 font-bold rounded-md shadow-md"> Play</button>
  </HashLink>
}
 </div>
    </div>
    </>)
  })}
  </div>
</>}
  {
  users.rooms.length==0 && 
    <h1 className="font-bold text-white text-center my-28">No Rooms Found</h1>
}
  </>
}
    </>
    }
    </>
  )
}

export default UserChallenge

