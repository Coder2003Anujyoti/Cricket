import React,{useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { MdWarningAmber } from "react-icons/md";
import { toast, Toaster } from 'react-hot-toast';
import { useSearchParams,useLocation } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaBroadcastTower } from "react-icons/fa"; // FontAwesome
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
import {io} from "socket.io-client";
let socket;
const get_name=()=>{
  return JSON.parse(sessionStorage.getItem("username"))
}
const UserMake = () => {
const username=get_name()
const [team,setTeam]=useState([])
const [locked,setLocked]=useState(false)
const [select,setSelect]=useState([])
const [player,setPlayer]=useState([])
const [isOpen, setIsOpen] = useState(false);
const [loading,setLoading]=useState(true)
const [len,setLen]=useState(0)
const [hide,setHide]=useState(false)
const [show,setShow]=useState(true)
const [store,setStore]=useState("")
const [searchParams] = useSearchParams();
const pquery = searchParams.get("player");
  const cquery= searchParams.get("computer")
  const id= searchParams.get("id")
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    toast.dismiss(); // dismiss all toasts on route change
  }, [location]);
  useEffect(() => {
  socket = io('https://intelligent-ailyn-handcricket-e8842259.koyeb.app/');
  socket.on("gamestart",(msg)=>{
    if(msg.id==id){
    navigate(-1)
    setShow(false)
    }
    else
    setShow(true)
  })
  return ()=>{
    socket.off("gamestart")
  }
  },[])
 const adds=(i)=>{
   setSelect([...select,i.name])
   setPlayer([...player,i])
 }
 const deletes=(i)=>{
   const x=select.filter((it)=>i.name!=it)
   const y=player.filter((it)=>it.name!=i.name)
   setSelect(x)
   setPlayer(y)
 }
  const show_data=async()=>{
    try{
     const [response,res] = await Promise.all([fetch("https://intelligent-ailyn-handcricket-e8842259.koyeb.app/"),fetch("https://intelligent-ailyn-handcricket-e8842259.koyeb.app/allusers")]);
    let data=await response.json()
    let datares=await res.json();
    const mal=datares.user_data.filter((i)=>i.username==username)
    const val=mal[0].participation.filter((i)=>i.id===id)
    const c=data.data.filter((i)=>i.team==cquery || i.team==pquery)
    if(!data.error && val.length==0){
     setTimeout(()=>{
      setLoading(false)
      setTeam(c)
      setLen(val.length)
    },2000)
    }
   // alert(mal[0].selected.length)
    else if(!data.error && val.length==1){
      setTimeout(()=>{
      setLoading(false)
      setPlayer(val[0].selected)
      setLen(val.length)
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
  },[])
  const handleSubmit=async()=>{
   const response= await fetch('https://intelligent-ailyn-handcricket-e8842259.koyeb.app/addParticipation', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username ,
    participationEntry: {
      id,
      selected:player,
      players: [],
      score: 0
    }
  })
})
const data=await response.json();
if(!response.ok){
toast.error(<strong  style={{ whiteSpace: 'nowrap' }}>Something went wrong</strong>);
  setLocked(false)
}
else if(response.ok){
toast.success(<strong  style={{ whiteSpace: 'nowrap' }}>Players register successfully</strong>);
  setLocked(false)
  setHide(true)
}
  }
  const submit=()=>{
    if(!locked){
      setLocked(true)
      handleSubmit();
    }
  }
  return (
 <>
 <Toaster position="top-center" toastOptions={{
          className: 'font-bold', // Tailwind class applied to all toasts
        }}/>
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
    loading==false && show==true && <>
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
{ player.length<10 && len==0 && <>
<div className="w-full my-2 text-white font-bold text-center">
<p className="ml-4 mr-4">*You need to select {10-select.length} players</p>
</div>
<div className="w-full justify-center items-center flex flex-row gap-4 flex-wrap">
  {team.sort((a, b) => a.name.localeCompare(b.name)).map((i, index) => (
    <div key={index} className="flex justify-center flex-col text-center text-white font-bold bg-slate-800 rounded-md p-2">
    <div className="w-full flex justify-center items-center">  <img src={i.image} alt={i.name || "team-logo"} className="w-36 h-36" /></div>
  <p className="my-2">{i.name}</p>
<div className="w-full">
  {
    !select.includes(i.name) && <button onClick={()=>adds(i)} className="bg-slate-900 text-white text-base px-6 py-2 font-bold rounded-md shadow-md">Select</button>
  }
  {
    select.includes(i.name) && <button
    onClick={()=>deletes(i)} className="bg-slate-900 text-white text-base px-6 py-2 font-bold rounded-md shadow-md">Delete</button>
  }
  </div>
    </div>
  ))}
</div>
</>
}
{
 ( player.length==10 || len==1)  && <>
  {window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })}
  <div className="w-full my-2 text-white font-bold text-center text-base">
<p className="ml-4 mr-4">Your Team</p>
</div>
<div className="w-full justify-center items-center flex flex-row gap-4 flex-wrap">
  {player.sort((a, b) => a.name.localeCompare(b.name)).map((i, index) => (
    <div key={index} className="flex justify-center flex-col text-center text-white font-bold bg-slate-800 rounded-md p-2">
    <div className="w-full flex justify-center items-center">  <img src={i.image} alt={i.name || "team-logo"} className="w-36 h-36" /></div>
  <p className="my-2">{i.name}</p>
    </div>
  ))}
</div>
{ hide==false && len==0 &&
<div className="w-full my-4 flex justify-center">
<button disabled={locked} onClick={submit} className="bg-slate-800 px-6 py-2 text-white font-bold rounded-md">Save</button>
</div>
}
  </>
}
    </>
  }
{
  loading==false && show==false && <>
    <div className="flex justify-center items-center my-40 px-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full text-center border border-yellow-400">
        <MdWarningAmber className="text-6xl text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Access Restricted
        </h2>
        <p className="text-gray-600">
          <span className="font-semibold text-sky-600">Game is Live</span>.
        </p>
      </div>
    </div>
  </>
}
 </>
  );
};



export default UserMake;
