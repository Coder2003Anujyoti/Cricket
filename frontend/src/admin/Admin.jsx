import React,{useState,useEffect} from 'react'
import { FaArrowUp } from "react-icons/fa";
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
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { faLock, faUnlock } from "@fortawesome/free-solid-svg-icons";
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { faBullhorn } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import {HashLink} from 'react-router-hash-link'
import { toast, Toaster } from 'react-hot-toast';
const get_data=()=>{
  return sessionStorage.getItem("token")
}
const get_role=()=>{
  return JSON.parse(sessionStorage.getItem("role"))
}
const Admin = () => {
  const token=get_data()
  const role=get_role()
  const [showPassword, setShowPassword] = useState({});
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [mode, setMode] = useState("users");
  const [loading,setLoading]=useState(true)
  const [isOpen, setIsOpen] = useState(false);
  const [user,setUser]=useState([])
  const [newsID,setNewsID]=useState("")
  const [content,setContent]=useState("")
  const [lock,setLock]=useState(false)
  const [news,setNews]=useState([])
  const [deletenewsID,setDeletenewsID]=useState("")
  const [deletelock,setDeletelock]=useState(false)
const [editnewsID,setEditnewsID]=useState("")
const [editcontent,setEditcontent]=useState("")
const [editlock,setEditlock]=useState(false)
const [userLen, setUserLen] = useState(0);
const [newsLen, setNewsLen] = useState(0);
const [userOffset, setUserOffset] = useState(0);
const [newsOffset, setNewsOffset] = useState(0);
const [userLimit, setUserLimit] = useState(5);
const [newsLimit, setNewsLimit] = useState(5);
const [userSubload, setUserSubload] = useState(false);
const [newsSubload, setNewsSubload] = useState(false);
const teams= [
  "A","B","C","D","E","F","G","H","I","J","K","L","M",
  "N","O","P","Q","R","S","T","U","V","W","X","Y","Z"
];
const handleSelectteam = (team) => {
    if (selectedTeams.includes(team)) {
      setSelectedTeams(selectedTeams.filter((t) => t !== team));
    } else {
      setSelectedTeams([...selectedTeams, team]);
    }
  };
    const show_data=async()=>{
    try{
     const response = await fetch(`https://intelligent-ailyn-handcricket-e8842259.koyeb.app/users?offset=0&&limit=5`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:`Bearer ${token}`,
      },
    });
    let data=await response.json()
    if(!data.error){
     setTimeout(()=>{
      setLoading(false)
      setNewsSubload(false)
      setUserSubload(false)
      setUserOffset(userOffset+5)
      setNewsOffset(newsOffset+5)
      setUserLen(data.total_users)
      setNewsLen(data.total_news_posts)
      setUser(data.user_data)
      setNews(data.news_data)
    },2000)
    }
  }
  catch(err){
    console.log("It is an error-: ",err)
  }
  }
  const showuser_data=async()=>{
    try{
     const response = await fetch(`https://intelligent-ailyn-handcricket-e8842259.koyeb.app/getuserslist?offset=${userOffset}&&limit=${userLimit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:`Bearer ${token}`,
      },
    });
    let data=await response.json()
    if(!data.error){
     setTimeout(()=>{
      setLoading(false)
      setUserSubload(false)
      setUserOffset(userOffset+5)
      setUserLen(data.total_users)
      setUser([...user,...data.user_data])
    },2000)
    }
  }
  catch(err){
    console.log("It is an error-: ",err)
  }
  }
  useEffect(()=>{
    if(userSubload==true){
      showuser_data()
    }
  },[userSubload])
  const usersgo=()=>{
    setUserSubload(true)
  }
  const showposts_data=async()=>{
    try{
     const response = await fetch(`https://intelligent-ailyn-handcricket-e8842259.koyeb.app/getpostslist?offset=${newsOffset}&&limit=${newsLimit}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:`Bearer ${token}`,
      },
    });
    let data=await response.json()
    if(!data.error){
     setTimeout(()=>{
      setLoading(false)
      setNewsSubload(false)
      setNewsOffset(newsOffset+5)
      setNewsLen(data.total_news_posts)
      setNews([...news,...data.news_data])
    },2000)
    }
  }
  catch(err){
    console.log("It is an error-: ",err)
  }
  }
  useEffect(()=>{
    if(newsSubload==true){
      showposts_data()
    }
  },[newsSubload])
  const newsgo=()=>{
    setNewsSubload(true)
  }
  const handSubmit = async() => {
    if (content && newsID) {
   // alert(new Date(matchDate).toDateString())
      //alert(`Tournament: ${tournamentName}\nMatch ID: ${matchID}\nUser Team: ${userTeam.name}\nComputer Team: ${computerTeam.name}`);
   try{
      const response = await fetch("https://intelligent-ailyn-handcricket-e8842259.koyeb.app/addnews", {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`  // ✅ correctly placed
  },
  body: JSON.stringify({
    newsID:newsID.trim(),
    content:content.trim()
  }),
});
    const data=await response.json();
    console.log(data)
    if(!response.ok){
        toast.error(<strong  style={{ whiteSpace: 'nowrap' }}>Session Timeout</strong>);
    }
    else if(response.ok){
      toast.success(<strong  style={{ whiteSpace: 'nowrap' }}>Post added successfully</strong>);
    }
  }
    catch(err){
        console.log(err)
     toast.error(<strong  style={{ whiteSpace: 'nowrap' }}>Something went wrong</strong>);
      }
      finally {
      setLock(false);
      setContent("")
      setNewsID("")
      // Re-enable submit button
    }

    
    } else {
       toast.error("Invalid input");
       setLock(false)
    }
  };
  const handDelete = async() => {
    if (deletenewsID) {
   // alert(new Date(matchDate).toDateString())
      //alert(`Tournament: ${tournamentName}\nMatch ID: ${matchID}\nUser Team: ${userTeam.name}\nComputer Team: ${computerTeam.name}`);
   try{
      const response = await fetch("https://intelligent-ailyn-handcricket-e8842259.koyeb.app/deletenews", {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`  // ✅ correctly placed
  },
  body: JSON.stringify({
    newsID:deletenewsID.trim()
  }),
});
    const data=await response.json();
    console.log(data)
    if(!response.ok){
        toast.error(<strong  style={{ whiteSpace: 'nowrap' }}>Session Timeout</strong>);
    }
    else if(response.ok){
      toast.success(<strong  style={{ whiteSpace: 'nowrap' }}>Post deleted successfully</strong>);
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
  const handEdit = async() => {
    if (editcontent && editnewsID) {
   // alert(new Date(matchDate).toDateString())
      //alert(`Tournament: ${tournamentName}\nMatch ID: ${matchID}\nUser Team: ${userTeam.name}\nComputer Team: ${computerTeam.name}`);
   try{
      const response = await fetch("https://intelligent-ailyn-handcricket-e8842259.koyeb.app/editnews", {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`  // ✅ correctly placed
  },
  body: JSON.stringify({
    newsID:editnewsID.trim(),
    content:editcontent.trim()
  }),
});
    const data=await response.json();
    console.log(data)
    if(!response.ok){
        toast.error(<strong  style={{ whiteSpace: 'nowrap' }}>Session Timeout</strong>);
    }
    else if(response.ok){
      toast.success(<strong  style={{ whiteSpace: 'nowrap' }}>Post edited successfully</strong>);
    }
  }
    catch(err){
        console.log(err)
     toast.error(<strong  style={{ whiteSpace: 'nowrap' }}>Something went wrong</strong>);
      }
      finally {
      setEditlock(false);
      setEditcontent("")
      setEditnewsID("")
      // Re-enable submit button
    }

    
    } else {
       toast.error("Invalid input");
       setEditlock(false)
    }
  };
  useEffect(()=>{
    show_data()
     window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  },[token])
  const togglePassword = (idx) => {
  setShowPassword((prev) => ({
    ...prev,
    [idx]: !prev[idx],
  }));
};
const handleSubmit = () => {
  if (!lock) {
    setLock(true);
    handSubmit();
  }
};
const handleDelete = () => {
  if (!deletelock) {
    setDeletelock(true);
    handDelete();
  }
};
const handleEdit= () => {
  if (!editlock) {
    setEditlock(true);
    handEdit();
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
  {loading==false && <>
  <Toaster position="top-center" toastOptions={{className: 'font-bold', duration:2000, // Tailwind class applied to all toasts
            }}/>
  {/* //& Navbar for mobile */}
    <div className="relative w-full bg-slate-800 flex items-center justify-between p-2 lg:hidden z-50  md:px-4 md:py-3 ">
  <img className="w-28 h-16" src={`Logos/Logo.webp`} alt="Logo" />
  
  <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
    <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className="w-8 h-8" />
  </button>

  {/* Mobile Nav Links - Dropdown */}
  {isOpen && (
    <div className="absolute top-full left-0 w-full  bg-slate-800 shadow-md backdrop-blur-md px-4 py-2 z-40">
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
    onClick={() => setMode("users")}
    className={`px-4 py-2 font-bold ${mode === "users" ? 'border-b border-b-white text-white' : 'text-white border-b border-b-transparent'}`}
  >
    Users
  </button>
  <button
    onClick={() => setMode("create")}
    className={`px-4 py-2 font-bold  ${mode === "create" ? 'border-b border-b-white text-white' : 'text-white border-b border-b-transparent'}`}
  >
  Update
  </button>
    <button
    onClick={() => setMode("view")}
    className={`px-4 py-2 font-bold  ${mode === "view" ? 'border-b border-b-white text-white' : 'text-white border-b border-b-transparent'}`}
  >
    View
  </button>
</div>
{ mode=="users" && <>
 <div className="overflow-x-auto scroll-smooth px-3 py-4 my-4 lg:flex lg:justify-center lg:items-center lg:py-6">
<div className="flex gap-4 w-max md:justify-center md:items-center lg:gap-10">
{teams.map((team) => (
<div key={team} onClick={() => handleSelectteam(team)} className="relative bg-slate-800 rounded-full px-4 py-3 cursor-pointer">
<h1 className="text-white font-bold text-sm">{team}</h1>
{selectedTeams.includes(team) && (
<FontAwesomeIcon icon={faCheckCircle} className="absolute top-0 right-0 text-green-500 bg-white rounded-full" size="xs"/>)}
</div>))}</div></div>
  <h1 className="text-green-400 text-lg font-bold shadow-green-400 text-center my-4">Users List</h1>
  <div className="w-full overflow-x-auto cursor-pointer">
  <table className="min-w-full table-fixed border-collapse">
    <thead>
      <tr className="bg-emerald-500 text-white">
              <th className="px-6 py-3 text-left text-sm font-semibold w-1/3">Icon</th>
        <th className="px-6 py-3 text-left text-sm font-semibold w-1/3">Username</th>
        <th className="px-6 py-3 text-left text-sm font-semibold w-1/3">Password</th>
        <th className="px-6 py-3 text-left text-sm font-semibold w-1/3">Role</th>
 <th className="px-6 py-3 text-left text-sm font-semibold w-1/3">Participations</th>
<th className="px-6 py-3 text-left text-sm font-semibold w-1/3">Rooms</th>
<th className="px-6 py-3 text-left text-sm font-semibold w-1/3">Score</th>
      </tr>
    </thead>
    <tbody>
  {user.map((i, idx) => {
  if (selectedTeams.length === 0 || selectedTeams.includes(i.username[0].toUpperCase())) {
    return (
      <tr key={idx} className={`${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b`}>
        <td className="px-6 py-4 whitespace-nowrap w-1/3 font-semibold">
          {i.icon !== "" ? (
            <img className="w-7 h-7 md:w-10 md:h-10" src={i.icon} alt="Logo" />
          ) : (
            <img className="w-7 h-7 md:w-10 md:h-10" src={`Icons/cricket.webp`} />
          )}
        </td>
        <td className="px-6 py-4 text-xs md:text-sm whitespace-nowrap w-1/3 font-semibold">{i.username}</td>

        <td className="px-6 py-6 whitespace-nowrap w-1/3 flex items-center space-x-3 font-semibold text-xs md:text-sm text-center">
          <FontAwesomeIcon
            icon={showPassword[idx] ? faUnlock : faLock}
            className="text-gray-500 text-xs md:text-sm cursor-pointer"
            onClick={() => togglePassword(idx)}
          />
          <span>
            {showPassword[idx] ? i.password : "*".repeat(i.password.length)}
          </span>
        </td>

        <td className="px-6 py-4 whitespace-nowrap w-1/3 text-xs">
          <span
            className={`px-3 py-1 rounded-full font-medium ${
              i.role === "admin"
                ? "bg-red-100 text-red-700 text-xs"
                : i.role === "user"
                ? "bg-blue-100 text-blue-700 text-xs"
                : "bg-green-100 text-green-700 text-xs"
            }`}
          >
            {i.role[0].toUpperCase() + i.role.slice(1)}
          </span>
        </td>
        <td className="px-6 py-4 text-center text-xs md:text-sm whitespace-nowrap w-1/3 font-semibold">
          {i.participation.length}
        </td>
        <td className="px-6 text-center py-4 text-xs md:text-sm whitespace-nowrap w-1/3 font-semibold">
          {i.rooms.length}
        </td>
        <td className="px-6 text-center py-4 text-xs md:text-sm whitespace-nowrap w-1/3 font-semibold">
          {i.total}
        </td>
      </tr>
    );
  } else {
    return null;
  }
})}
    </tbody>
  </table>
</div>
 {
  userOffset<userLen  && selectedTeams.length==0 && <>
        {
          userSubload==false && <>
      <div className="w-full flex justify-center">
<button
  onClick={usersgo}
  className="flex items-center my-4 gap-2 px-5 py-2.5 rounded-lg bg-slate-800 text-slate-400 text-sm font-bold shadow-md  transition-all duration-300 ease-in-out"
>
  <span>More Users</span>
  <FontAwesomeIcon icon={faChevronDown} />
</button>
      </div>
          </>
        }
        {
          userSubload==true && <>
          <div className="w-full my-4 flex items-center justify-center text-center text-slate-400 text-sm font-bold"><p>Loading...</p></div>
          </>
        }
        </>
      }
</>
}
{ mode=="create" && <>
<div className='flex-col flex md:flex-row md:flex-wrap'>
<div className="max-w-xl w-full mx-auto mt-2 px-4 sm:px-6 py-4 rounded-xl md:shadow-lg space-y-6">
<h2 className="text-xl font-bold text-center text-white">Create Announcement</h2>
<input type="text" value={newsID}
onChange={(e)=>setNewsID(e.target.value.replace(/\s/g,""))} placeholder="Enter News ID" className="w-full p-3 font-semibold border border-gray-300 rounded-md shadow-sm focus:outline-none"/>
<textarea style={{ resize: "none" }} value={content} onChange={(e)=>setContent(e.target.value)} placeholder="Enter Announcement"
className="w-full p-3 border font-semibold border-gray-300 rounded-md shadow-sm focus:outline-none"/>
<button disabled={lock} onClick={handleSubmit} className="w-full bg-slate-800 text-white font-bold py-2 px-4 rounded-md transition duration-300">
        Create
      </button>
    </div>
<div className="max-w-xl w-full mx-auto mt-2 px-4 sm:px-6 py-4 rounded-xl space-y-6">
<h2 className="text-xl font-bold text-center text-white">Delete Announcement</h2>
<input type="text" value={deletenewsID}
onChange={(e)=>setDeletenewsID(e.target.value.replace(/\s/g,""))} placeholder="Enter News ID" className="w-full p-3 font-semibold border border-gray-300 rounded-md shadow-sm focus:outline-none"/>
<button disabled={deletelock} onClick={handleDelete} className="w-full bg-slate-800 text-white font-bold py-2 px-4 rounded-md transition duration-300">
      Delete
      </button>
</div>
</div>
    </>}
{
  mode=="view" && <>
  <div className="max-w-xl w-full mx-auto mt-2 px-4 sm:px-6 py-4 rounded-xl space-y-6">
<h2 className="text-xl font-bold text-center text-white">Edit Announcement</h2>
<input type="text" value={editnewsID}
onChange={(e)=>setEditnewsID(e.target.value.replace(/\s/g,""))} placeholder="Enter News ID" className="w-full p-3 font-semibold border border-gray-300 rounded-md shadow-sm focus:outline-none"/>
<textarea value={editcontent} style={{ resize: "none" }} onChange={(e)=>setEditcontent(e.target.value)} placeholder="Enter Announcement"
className="w-full p-3 border font-semibold border-gray-300 rounded-md shadow-sm focus:outline-none"/>
<button disabled={editlock} onClick={handleEdit} className="w-full bg-slate-800 text-white font-bold  py-2 px-4 rounded-md transition duration-300">
        Edit
      </button>
    </div>
<h1 className="text-green-400 text-lg font-bold shadow-green-400 text-center my-4">Announcements</h1>
  {
  news.length==0 && <>
  <h1 className="font-bold text-white text-center my-12">No Announcements Found</h1>
  </>
}
{
  news.length>0 && <>
  <div className="flex flex-col ml-2 mr-2 gap-4 my-4 lg:px-20 md:justify-center md:items-center md:py-3 lg:ml-16 lg:gap-10 lg:items-start lg:justify-start lg:flex-row lg:flex-wrap">
 {news.map((i)=>{
    return(<>
    <div className="w-full bg-slate-800 flex flex-col rounded-md flex-wrap lg:w-96 lg:h-90 md:w-96 md:h-84">
  <div className="w-full flex justify-start items-start p-3">
  <img src={`Logos/Logo.webp`} className="w-16 h-8" />
  <div className="w-full flex justify-end">
  <h1 className="text-white ml-2 mr-2 font-bold">{i.newsID}</h1>
  </div>
  </div>
<div className="w-full flex flex-col space-y-4">
<div className="w-full h-full flex flex-row flex-wrap justify-start items-start">
<h1 className="text-white font-bold text-sm ml-2 mr-2 mt-2">{i.content}</h1>
</div>
  <div className="w-full">
  <img src={`Screen/Main.webp`} className="w-auto h-auto rounded-b-md" />
  </div>
</div>
    </div>
    </>)
  })}
  </div>
  </>
}
 {
  newsOffset<newsLen && <>
        {
          newsSubload==false && <>
      <div className="w-full  flex justify-center">
<button
  onClick={newsgo}
  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800 text-slate-400 text-sm font-bold shadow-md  transition-all duration-300 ease-in-out"
>
  <span>More Announcements</span>
  <FontAwesomeIcon icon={faChevronDown} />
</button>
      </div>
          </>
        }
        {
          newsSubload==true && <>
          <div className="w-full flex items-center justify-center text-center text-slate-400 text-sm font-bold my-4"><p>Loading...</p></div>
          </>
        }
        </>
      }
  </>
}
  </>}
  </>
  )
}

export default Admin