import React,{useState,useEffect} from 'react'
import { FaArrowUp } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faSignOutAlt,
  faBars,
  faTimes,
  faUserShield,
  faHouse,
  faTrophy
} from '@fortawesome/free-solid-svg-icons';
import { toast, Toaster } from 'react-hot-toast';
import { Link } from "react-router-dom";
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
  console.log(token)
  const [isOpen, setIsOpen] = useState(false);
  const [tournamentName, setTournamentName] = useState("");
  const [matchID, setMatchID] = useState("");
  const [userTeam, setUserTeam] = useState(null);
  const [computerTeam, setComputerTeam] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [computerDropdownOpen, setComputerDropdownOpen] = useState(false);
   const [lock,setLock]=useState(false)
   const handSubmit = async() => {
    if (tournamentName && matchID && userTeam && computerTeam) {
      //alert(`Tournament: ${tournamentName}\nMatch ID: ${matchID}\nUser Team: ${userTeam.name}\nComputer Team: ${computerTeam.name}`);
   try{
      const response = await fetch("https://intelligent-ailyn-handcricket-e8842259.koyeb.app/addtournament", {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`  // ✅ correctly placed
  },
  body: JSON.stringify({
    name: tournamentName,
    playerteam: userTeam.name,
    computerteam: computerTeam.name,
    matchID: matchID
  }),
});
    const data=await response.json();
    console.log(data)
    if(!response.ok){
        toast.error(<strong  style={{ whiteSpace: 'nowrap' }}>Server is busy</strong>);
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
      setLock(false); // Re-enable submit button
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

  const filteredComputerTeams = userTeam
    ? teams.filter((team) => team.name !== userTeam.name)
    : teams;

  return (
    <>
    <Toaster position="top-center" toastOptions={{
              className: 'font-bold', // Tailwind class applied to all toasts
            }}/>
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
        <Link to="/admin" className="flex items-center space-x-3 text-white font-medium hover:text-blue-500">
          <FontAwesomeIcon icon={faHouse} className="w-5 h-5 text-blue-500" />
          <span>Home</span>
        </Link>

        {role === "admin" && (
          <Link to="/create" className="flex items-center space-x-3 text-white font-medium hover:text-yellow-500">
            <FontAwesomeIcon icon={faTrophy} className="w-5 h-5 text-yellow-500" />
            <span>Admin</span>
          </Link>
        )}

        <Link to="/adminuser" className="flex items-center space-x-3 text-white font-medium hover:text-indigo-600">
          <FontAwesomeIcon icon={faUserShield} className="w-5 h-5 text-green-500" />
          <span>Users</span>
        </Link>

        <Link to="/login" className="flex items-center space-x-3 text-white font-medium hover:text-red-600">
          <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5 text-red-500" />
          <span>Sign Out</span>
        </Link>
      </div>
    </div>
  )}
</div>

  {/* //* Navbar for big screens */}
     <nav className="bg-slate-800 hidden md:block text-white backdrop-blur-md shadow-md">
    <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
      <div className="flex items-center space-x-2">
        <img
          src="Logos/Logo.webp"
          alt="Logo"
          className="w-20 h-16 md:w-32 md:h-20 lg:w-36 lg:h-24 object-contain"
        />
      </div>
       <div className="hidden md:flex items-center gap-4 space-x-6">
      <Link to="/admin" className="flex items-center space-x-3 text-white font-medium hover:text-blue-500">
      <FontAwesomeIcon icon={faHouse} className="w-5 h-5 text-blue-500" />
      <span>Home</span>
      </Link>
      {role=="admin" && <>
      <Link to="/create"  className="flex items-center space-x-3 text-white font-medium hover:text-yellow-500"
      >
        <FontAwesomeIcon icon={faTrophy} className="w-5 h-5 text-yellow-500" />
        <span>Admin</span>
      </Link>
      </>}
      <Link to="/login" className="flex items-center space-x-3 text-white font-medium hover:text-red-600">
      <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5 text-red-500" />
      <span>Sign Out</span>
      </Link>
      </div>
    </div>
  </nav>
       <div className="max-w-xl w-full mx-auto mt-2 px-4 sm:px-6 py-4 md:bg-white md:mt-8  rounded-xl md:shadow-lg space-y-6">

      <h2 className="text-xl font-bold text-center text-white md:text-gray-800">Create Tournament</h2>

      <input
        type="text"
        placeholder="Enter Tournament Name"
        className="w-full p-3 border font-semibold border-gray-300 rounded-md shadow-sm focus:outline-none md:focus:ring md:focus:ring-blue-200"
        value={tournamentName}
        onChange={(e) => setTournamentName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Enter Match ID"
        className="w-full p-3 font-semibold border border-gray-300 rounded-md shadow-sm focus:outline-none md:focus:ring md:focus:ring-blue-200"
        value={matchID}
        onChange={(e) => setMatchID(e.target.value)}
      />

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
      <div className="absolute z-20 bg-white w-full max-w-xs shadow-md rounded mt-1 overflow-y-auto max-h-40 left-0">
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
      <div className="absolute z-20 bg-white w-full max-w-xs shadow-md rounded mt-1 overflow-y-auto max-h-40 left-0">
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
        className="w-full md:bg-blue-600 bg-slate-800 text-white font-bold md:font-semibold py-2 px-4 rounded-md md:hover:bg-blue-700 transition duration-300"
      >
        Create
      </button>
    </div>
    </>
  )
}

export default Create