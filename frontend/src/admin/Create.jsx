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

const Create = () => {
  const token=get_data()
  const role=get_role()
  const [isOpen, setIsOpen] = useState(false);
  const [tournamentName, setTournamentName] = useState("");
  const [mode, setMode] = useState("create");
  const [items,setItems]=useState([])
  const [loading,setLoading]=useState(true)
  const [matchID, setMatchID] = useState("");
  const [userTeam, setUserTeam] = useState(null);
  const [matchDate, setMatchDate] = useState("");
  const [computerTeam, setComputerTeam] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [computerDropdownOpen, setComputerDropdownOpen] = useState(false);
   const [lock,setLock]=useState(false)
   const [editlock,setEditlock]=useState(false)
   const [editmatchID,setEditmatchID]=useState("")
   const [editmatchDate,setEditmatchDate]=useState("")
   const [subload,setSubload]=useState(false)
   const [offset,setOffset]=useState(0)
const [limit,setLimit]=useState(5)
const [len,setLen]=useState(-1)
const [deletenewsID,setDeletenewsID]=useState("")
  const [deletelock,setDeletelock]=useState(false)
   const location = useLocation();
   const show_data=async()=>{
    try{
      if(!token){
        console.log("error")
        return;
      }
     const response = await fetch(`https://intelligent-ailyn-handcricket-e8842259.koyeb.app/getadmintournament?offset=${offset}&&limit=${limit}`, {
      method: "GET",
      headers: {
          "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });
    let data=await response.json()
    if(!data.error && offset==0){
     setTimeout(()=>{
      setLoading(false)
      setSubload(false)
      setLen(data.total)
      setOffset(offset+5)
      setItems(data.tournaments_data)
    },2000)
    }
    else if(!data.error && offset > 0){
      setTimeout(()=>{
      setLoading(false)
      setSubload(false)
      setLen(data.total)
      setOffset(offset+5)
      setItems([...items,...data.tournaments_data])
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
const handDelete = async() => {
    if (deletenewsID) {
   // alert(new Date(matchDate).toDateString())
      //alert(`Tournament: ${tournamentName}\nMatch ID: ${matchID}\nUser Team: ${userTeam.name}\nComputer Team: ${computerTeam.name}`);
   try{
      const response = await fetch("https://intelligent-ailyn-handcricket-e8842259.koyeb.app/deletetournaments", {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`  // ✅ correctly placed
  },
  body: JSON.stringify({
    matchID:deletenewsID.trim()
  }),
});
    const data=await response.json();
    console.log(data)
    if(!response.ok){
        toast.error(<strong  style={{ whiteSpace: 'nowrap' }}>Session Timeout</strong>);
    }
    else if(response.ok){
      toast.success(<strong  style={{ whiteSpace: 'nowrap' }}>Tournament deleted successfully</strong>);
    }
  }
    catch(err){
        console.log(err)
     toast.error(<strong  style={{ whiteSpace: 'nowrap' }}>Something went wrong</strong>);
      }
      finally {
      setDeletelock(false);
      setDeletenewsID("")
      // Re-enable submit button
    }

    
    } else {
       toast.error("Invalid input");
       setDeletelock(false)
    }
  };
  const handleDelete = () => {
  if (!deletelock) {
    setDeletelock(true);
    handDelete();
  }
  }
   const handSubmit = async() => {
    if (tournamentName && matchID && userTeam && computerTeam && matchDate) {
   // alert(new Date(matchDate).toDateString())
      //alert(`Tournament: ${tournamentName}\nMatch ID: ${matchID}\nUser Team: ${userTeam.name}\nComputer Team: ${computerTeam.name}`);
   try{
      const response = await fetch("https://intelligent-ailyn-handcricket-e8842259.koyeb.app/addtournament", {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`  // ✅ correctly placed
  },
  body: JSON.stringify({
    name: tournamentName.trim(),
    playerteam: userTeam.name,
    computerteam: computerTeam.name,
    matchID: matchID.trim(),
    time:new Date(matchDate).toDateString()
  }),
});
    const data=await response.json();
    console.log(data)
    if(!response.ok){
        toast.error(<strong  style={{ whiteSpace: 'nowrap' }}>Session Timeout</strong>);
    }
    else if(response.ok){
      toast.success(<strong  style={{ whiteSpace: 'nowrap' }}>Tournament register successfully</strong>);
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
      setMatchDate("")
      setMatchID("")
      // Re-enable submit button
    }

    
    } else {
       toast.error("Invalid input");
       setLock(false)
    }
  };
  const handEdit = async() => {
    if (editmatchID && editmatchDate) {
   // alert(new Date(matchDate).toDateString())
      //alert(`Tournament: ${tournamentName}\nMatch ID: ${matchID}\nUser Team: ${userTeam.name}\nComputer Team: ${computerTeam.name}`);
   try{
      const response = await fetch("https://intelligent-ailyn-handcricket-e8842259.koyeb.app/edittournament", {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`  // ✅ correctly placed
  },
  body: JSON.stringify({
    matchID: editmatchID.trim(),
    time:new Date(editmatchDate).toDateString()
  }),
});
    const data=await response.json();
    console.log(data)
    if(!response.ok){
        toast.error(<strong  style={{ whiteSpace: 'nowrap' }}>Session Timeout</strong>);
    }
    else if(response.ok){
      toast.success(<strong  style={{ whiteSpace: 'nowrap' }}>Tournament updated successfully</strong>);
    }
  }
    catch(err){
        console.log(err)
     toast.error(<strong  style={{ whiteSpace: 'nowrap' }}>Something went wrong</strong>);
      }
      finally {
      setEditlock(false);
      setEditmatchID("")
      setEditmatchDate("")
      // Re-enable submit button
    }

    
    } else {
       toast.error("Invalid input");
       setEditlock(false)
    }
  };
  const handleCreate = () => {
  if (!lock) {
    setLock(true);
    handSubmit();
  }
};
const handleEdit=()=>{
    if (!editlock) {
    setEditlock(true);
    handEdit();
  }
}
useEffect(()=>{
window.scrollTo({ top: 0, behavior: "smooth" });
  toast.dismiss();
},[])

  const filteredComputerTeams = userTeam
    ? teams.filter((team) => team.name !== userTeam.name)
    : teams;

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
<Toaster position="top-center" toastOptions={{
              className: 'font-bold',duration:2000, // Tailwind class applied to all toasts
            }}/>
    {/* //& Navbar for mobile */}
    <div className="relative w-full bg-slate-800 flex items-center justify-between p-2 lg:hidden z-50 md:px-4 md:py-3">
  <img className="w-28 h-16" src={`Logos/Logo.webp`} alt="Logo" />
  
  <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
    <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className="w-8 h-8" />
  </button>

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
        {role === "admin" && (
          <Link to="/adminchallenge" className="flex items-center space-x-3 text-white font-medium hover:text-sky-500 md:hidden">
            <FontAwesomeIcon icon={faFlagCheckered} className="w-5 h-5 text-sky-500" />
            <span>Challenge</span>
          </Link>
        )}
        <Link to="/adminuser" className="flex items-center space-x-3 text-white font-medium hover:text-green-500 md:hidden">
          <FontAwesomeIcon icon={faUserShield} className="w-5 h-5 text-green-500" />
          <span>Users</span>
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
</div>

  {/* //* Navbar for big screens */}
     <nav className="bg-slate-800 hidden lg:block text-white backdrop-blur-md shadow-md">
    <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
      <div className="flex items-center space-x-2">
        <img
          src="Logos/Logo.webp"
          alt="Logo"
          className="w-20 h-16 md:w-32 md:h-20 lg:w-36 lg:h-24 object-contain"
        />
      </div>
       <div className="hidden md:flex items-center gap-4 space-x-6">
      <Link to="/" className="flex items-center space-x-3 text-white font-medium hover:text-blue-500">
      <FontAwesomeIcon icon={faHouse} className="w-5 h-5 text-blue-500" />
      <span>Home</span>
      </Link>
      {role=="admin" && <>
               <Link to="/admin" className="flex items-center space-x-3 text-white font-medium hover:text-pink-500">
                <FontAwesomeIcon icon={faGamepad} className="w-5 h-5 text-pink-500" />
                <span>About</span>
              </Link>
              </>}
      {role=="admin" && <>
      <Link to="/create"  className="flex items-center space-x-3 text-white font-medium hover:text-yellow-500"
      >
        <FontAwesomeIcon icon={faTrophy} className="w-5 h-5 text-yellow-500" />
        <span>Admin</span>
      </Link>
      </>}
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
  </nav>
  <div className="flex justify-evenly mt-4">
  <button
    onClick={() => setMode("create")}
    className={`px-4 py-2 font-bold ${mode === "create" ? 'border-b border-b-white text-white' : 'text-white border-b border-b-transparent'}`}
  >
    Create
  </button>
  <button
    onClick={() => setMode("edit")}
    className={`px-4 py-2 font-bold  ${mode === "edit" ? 'border-b border-b-white text-white' : 'text-white border-b border-b-transparent'}`}
  >
    Edit
  </button>
    <button
    onClick={() => setMode("view")}
    className={`px-4 py-2 font-bold  ${mode === "view" ? 'border-b border-b-white text-white' : 'text-white border-b border-b-transparent'}`}
  >
    View
  </button>
</div>
{ mode=="create" && <>
       <div className="max-w-xl w-full mx-auto mt-2 px-4 sm:px-6 py-4 rounded-xl space-y-6">

      <h2 className="text-xl font-bold text-center text-white">Create Tournament</h2>

      <input
        type="text"
        placeholder="Enter Tournament Name"
        className="w-full p-3 border font-semibold border-gray-300 rounded-md shadow-sm focus:outline-none"
        value={tournamentName}
        onChange={(e) => setTournamentName(e.target.value.replace(/\s/g,""))}
      />

      <input
        type="text"
        placeholder="Enter Match ID"
        className="w-full p-3 font-semibold border border-gray-300 rounded-md shadow-sm focus:outline-none"
        value={matchID}
        onChange={(e) => setMatchID(e.target.value.replace(/\s/g,""))}
      />
      <div className="relative md:hidden">
  {!matchDate && (
    <span className="absolute left-3 top-3 font-semibold text-gray-400 pointer-events-none">
      Enter Match Date
    </span>
  )}
  <input
    type="date"
    className="w-full p-3 font-semibold border border-gray-300 rounded-md shadow-sm focus:outline-none placeholder-transparent"
    value={matchDate}
    onChange={(e) => setMatchDate(e.target.value)}
  />
</div>
<div className="relative hidden md:block">
      {!matchDate && (
        <span className="absolute left-3 top-3 text-gray-400 font-semibold pointer-events-none">
          Enter Match Date
        </span>
      )}
      <DatePicker
        selected={matchDate}
        onChange={(date) => setMatchDate(date)}
        placeholderText="Select Match Date"
        dateFormat="dd-MM-yyyy"
        className="w-[180px] min-w-[525px] p-3 font-semibold border border-gray-300 rounded-md shadow-sm focus:outline-none"
      />
    </div>

    <div className="flex flex-col md:flex-row gap-4 w-full max-w-md mx-auto px-4">
  {/* User Team Dropdown */}
  <div className="relative w-full">
    <label className="block mb-1 font-semibold text-white md:text-black hidden">Your Team</label>
    <div
      className="w-full p-3 border font-semibold rounded-md cursor-pointer bg-white flex items-center justify-between"
      onClick={() => {
        setUserDropdownOpen(!userDropdownOpen);
        setComputerDropdownOpen(false);
      }}
    >
      {userTeam ? (
        <div className="flex items-center gap-2 font-semibold">
          <img src={userTeam.logo} alt={userTeam.name} className="w-6 h-6" />
          <span>{userTeam.name.toUpperCase()}</span>
        </div>
      ) : (
        <span className="text-gray-400">Select your team</span>
      )}
      <span className="text-gray-600">▼</span>
    </div>
    {userDropdownOpen && (
      <div className="absolute z-20 bg-white w-full max-w-xs shadow-md rounded mt-1 overflow-y-auto max-h-20 md:max-h-32 left-0">
        {teams.map((team) => (
          <div
            key={team.name}
            className="flex items-center gap-2 px-4 py-2 font-semibold hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              setUserTeam(team);
              setUserDropdownOpen(false);
            }}
          >
            <img src={team.logo} alt={team.name} className="w-6 h-6" />
            <span>{team.name.toUpperCase()}</span>
          </div>
        ))}
      </div>
    )}
  </div>

  {/* Computer Team Dropdown */}
  <div className="relative w-full">
    <label className="block mb-1 font-semibold text-white md:text-black hidden">Computer Team</label>
    <div
      className="w-full p-3 border rounded-md font-semibold cursor-pointer bg-white flex items-center justify-between"
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
        <span className="text-gray-400">Select computer team</span>
      )}
      <span className="text-gray-600">▼</span>
    </div>
    {computerDropdownOpen && (
      <div className="absolute z-20 bg-white w-full max-w-xs shadow-md rounded mt-1 overflow-y-auto max-h-20 md:max-h-32 left-0">
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
</div>

      <button
        onClick={handleCreate} disabled={lock}
        className="w-full bg-slate-800 text-white font-bold py-2 px-4 rounded-md transition duration-300"
      >
        Create
      </button>
    </div>
    </>}
    {
      mode=="edit" && <>
  <div className='flex-col flex md:flex-row md:flex-wrap'>
<div className="max-w-xl w-full mx-auto mt-2 px-4 sm:px-6 py-4 rounded-xl space-y-6">
<h2 className="text-xl font-bold text-center text-white">Edit Tournament</h2>
      <input
        type="text"
        placeholder="Enter Match ID"
        className="w-full p-3 font-semibold border border-gray-300 rounded-md shadow-sm focus:outline-none"
        value={editmatchID}
        onChange={(e) => setEditmatchID(e.target.value.replace(/\s/g,""))}
      />
<div className="relative md:hidden">
  {!editmatchDate && (
    <span className="absolute left-3 top-3 font-semibold text-gray-400 pointer-events-none">
      Enter Match Date
    </span>
  )}
  <input
    type="date"
    className="w-full p-3 font-semibold border border-gray-300 rounded-md shadow-sm focus:outline-none"
    value={editmatchDate}
    onChange={(e) => setEditmatchDate(e.target.value)}
  />
</div>
<div className="relative hidden md:block">
      {!matchDate && (
        <span className="absolute left-3 top-3 text-gray-400 font-semibold pointer-events-none">
          Enter Match Date
        </span>
      )}
      <DatePicker
        selected={matchDate}
        onChange={(date) => setMatchDate(date)}
        placeholderText="Select Match Date"
        dateFormat="dd-MM-yyyy"
        className="w-[180px] min-w-[525px] p-3 font-semibold border border-gray-300 rounded-md shadow-sm focus:outline-none"
      />
    </div>
      <button
        onClick={handleEdit} disabled={editlock}
        className="w-full bg-slate-800 text-white font-bold py-2 px-4 rounded-md  transition duration-300"
      >
        Edit
      </button>
    </div>
    <div className="max-w-xl w-full mx-auto mt-2 px-4 sm:px-6 py-4 rounded-xl  space-y-6">
<h2 className="text-xl font-bold text-center text-white ">Delete Tournament</h2>
<input type="text" value={deletenewsID}
onChange={(e)=>setDeletenewsID(e.target.value.replace(/\s/g,""))} placeholder="Enter Match ID" className="w-full p-3 font-semibold border border-gray-300 rounded-md shadow-sm focus:outline-none"/>
<button disabled={deletelock} onClick={handleDelete} className="w-full bg-slate-800 text-white font-bold  py-2 px-4 rounded-md  transition duration-300">
      Delete
      </button>
</div>
</div>
      </>
    }
    { mode=="view" && <>
  <h1 className="text-green-400 text-lg font-bold shadow-green-400 text-center my-4">Ongoing Tournaments</h1>
  { items.length>0 && <>
  <div className="w-full overflow-x-auto cursor-pointer my-2">
  <table className="min-w-full table-fixed border-collapse">
    <thead>
      <tr className="bg-emerald-500 text-white">
        <th className="px-6 py-3 text-left text-sm font-semibold w-1/3">MatchID</th>
        <th className="px-6 py-3 text-left text-sm font-semibold w-1/3">Name</th>
        <th className="px-6 py-3 text-left text-sm font-semibold w-1/3">Player</th>
      <th className="px-6 py-3 text-left text-sm font-semibold w-1/3">Computer</th>
     <th className="px-6 py-3 text-left text-sm font-semibold w-1/3">Winner</th>
     <th className="px-6 py-3 text-left text-sm font-semibold w-1/3">Date</th>
      </tr>
    </thead>
    <tbody>
      {items.map((user, idx) => (
        <tr key={idx} className={`${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b text-xs`}>
          <td className="px-6 py-4 whitespace-nowrap w-1/3 font-semibold text-xs">{user.matchID}</td>
          <td className="px-6 py-4 whitespace-nowrap w-1/3 font-semibold text-xs">{user.name}</td>
        <td className="px-6 py-4 whitespace-nowrap w-1/3 font-semibold text-xs">
        <img src={`Logos/${user.playerteam}.webp`} className="w-10 h-10" />
        </td>
        <td className="px-6 py-4 whitespace-nowrap w-1/3 font-semibold text-xs">
        <img src={`Logos/${user.computerteam}.webp`} className="w-10 h-10" />
        </td>
  {
    user.winner=="" && <>
  <td className="px-6 py-4 whitespace-nowrap w-1/3 font-semibold">TBD</td>
    </>
  }
    {
    user.winner!="" && <>
  <td className="px-6 py-4 whitespace-nowrap w-1/3 font-semibold text-xs"><img src={`Logos/${user.winner.split(" ")[0]==user.playerteam.toUpperCase() ? user.playerteam : user.computerteam}.webp`} className="w-10 h-10" /></td>
    </>
  }
  
        <td className="px-6 py-4 whitespace-nowrap w-1/3 font-semibold">
        {user.time}
        </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
</>}
{
  items.length==0 && 
    <h1 className="font-bold text-white text-center my-48">No Tournaments Found</h1>
}
                {
        offset<len && <>
        {
          subload==false && <>
      <div className="w-full flex justify-center">
<button
  onClick={go}
  className="flex items-center  gap-2 px-5 py-2.5 rounded-lg bg-slate-800 text-slate-400 text-sm font-bold shadow-md hover:shadow-lg hover:scale-105 hover:text-white transition-all duration-300 ease-in-out"
>
  <span>More Matches</span>
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
    </>
    }
    </>
  )
}

export default Create