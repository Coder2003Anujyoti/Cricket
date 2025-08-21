import React,{useEffect,useState} from "react";
import { useSearchParams } from "react-router-dom";
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FaArrowUp } from "react-icons/fa";
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
  faUser,
  faHandPaper
} from '@fortawesome/free-solid-svg-icons';
import { Link,useNavigate } from "react-router-dom";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import {HashLink} from 'react-router-hash-link'
const get_data=()=>{
  return sessionStorage.getItem("token")
}
const get_username=()=>{
  return JSON.parse(sessionStorage.getItem("username"))
}
const get_password=()=>{
  return JSON.parse(sessionStorage.getItem("userpassword"))
}
const get_role=()=>{
  return JSON.parse(sessionStorage.getItem("role"))
}
const ProfileHistory = () => {
const token=get_data()
  const role=get_role()
  const username=get_username()
  const password=get_password()
  const navigate = useNavigate();
const teams = ["Mi", "Csk", "Rr", "Kkr", "Gt", "Pbks", "Rcb", "Lsg", "Dc", "Srh"];
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading,setLoading]=useState(true)
  const [user,setUser]=useState([])
  const [items,setItems]=useState([])
  const [subload,setSubload]=useState(false)
  const [len,setLen]=useState(0)
  const [offset,setOffset]=useState(0)
  const [limit,setLimit]=useState(5)
  const [selectedTeams, setSelectedTeams] = useState([]);
  const show_data=async()=>{
      try{
       const response = await fetch(`https://intelligent-ailyn-handcricket-e8842259.koyeb.app/userprofilehistory?username=${username}&&offset=${offset}&&limit=${limit}`);
      let data=await response.json()
      if(!data.error){
       setTimeout(()=>{
        setLoading(false)
        setUser([data.biometrics])
        setLen(data.arraylen)
    setItems([...items,...data.participate])
        setOffset(offset+5)
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
const handleSelect = (team) => {
    if (selectedTeams.includes(team)) {
      setSelectedTeams(selectedTeams.filter((t) => t !== team));
    } else {
      setSelectedTeams([...selectedTeams, team]);
    }
  };
  useEffect(()=>{
    if(subload==true){
      show_data();
    }
  },[subload])
const go=()=>{
  setSubload(true)
}
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
    <div className="relative w-full bg-slate-800 md:flex items-center justify-between p-2 z-50 lg:hidden md:px-4 md:py-3">
      <img className="w-28 h-16" src={`Logos/Logo.webp`} />
      </div>
    <div className=" my-4 ml-4 mr-4 flex rounded-md flex-col bg-slate-800 p-2">
     <div className="w-full flex  justify-end items-center gap-2 md:hidden">
  <img src="Icons/coin.png" className="w-8 h-8" />
  <h1 className="font-bold text-white text-base">{user[0].total}</h1>
  </div>
<div className="w-full flex flex-row p-2">
<div className="w-1/2 flex items-center justify-center">
          { user[0].icon!= "" ?
  <img className="w-24 h-24 lg:w-64 lg:h-64" src={user[0].icon} alt="Logo" /> :
  <img className="w-20 h-20 lg:w-60 lg:h-60" src={`Icons/cricket.webp`} />}
</div>
<div className="w-1/2 flex flex-col items-start justify-start text-white text-sm font-bold flex-wrap">
<h1>{user[0].username}</h1>
<h1>{"*".repeat(password.length)}</h1>
<h1>Welcome {user[0].username}</h1>
</div>
</div>
    </div>
<h1 className="text-green-400 text-base font-bold shadow-green-400 ml-6 text-center">Recent Participations History</h1>
{
  items.length>0 ? <>
<div className="overflow-x-auto scroll-smooth px-3 py-4 my-2">
<div className="flex gap-4 w-max">
{teams.map((team) => (
<div key={team} onClick={() => handleSelect(team)} className="relative cursor-pointer">
<img src={`Logos/${team}.webp`} className="w-16 h-16 p-2 rounded-full border border-slate-800" />
{selectedTeams.includes(team) && (
<FontAwesomeIcon icon={faCheckCircle} className="absolute top-0 right-0 text-green-500 bg-white rounded-full" size="lg" />)}  </div> ))}
</div> </div>
<div className="w-full my-2 text-center flex justify-center items-center gap-4 flex-col">
{items.map((t, idx) => {
if (selectedTeams.length === 0 ||selectedTeams.includes(t.playerteam) ||selectedTeams.includes(t.computerteam)) {
 return (
  <div key={idx} className="min-w-[300px] max-w-[300px] bg-slate-800 text-white p-5 rounded-xl shadow-lg flex-shrink-0">
    <div className="w-full flex justify-end items-center gap-2 md:hidden">
  <img src="Icons/coin.png" className="w-6 h-6" />
  <h1 className="font-bold text-white mr-2 text-sm">{t.score}</h1>
  </div>
<div className="flex items-center justify-between gap-4 my-3">
<div className="flex flex-col items-center">
<img src={`Logos/${t.playerteam}.webp`} alt={t.playerteam} className="w-24 h-24"/>
<p className=" text-base font-bold">{t.playerteam.toUpperCase()}</p></div>
  <div className="text-center">
 <h2 className="text-base font-extrabold">V/S</h2>
</div>
<div className="flex flex-col items-center">
<img src={`Logos/${t.computerteam}.webp`} alt={t.computerteam} className="w-24 h-24"/>
<p className="text-base font-bold">{t.computerteam.toUpperCase()}</p></div></div>
<div className="text-center flex flex-col gap-2">
<h2 className="text-base font-bold">{t.matchname}</h2>
<h2 className="text-xs font-semibold">{t.matchtime}</h2>
</div>
</div>);} 
else {return null }})}
  </div>
{ offset<len && selectedTeams.length==0 && <>
{ subload==false && <>
<div className="w-full flex justify-center">
<button onClick={go} className="flex items-center my-4 gap-2 px-5 py-2.5 rounded-lg bg-slate-800 text-slate-400 text-sm font-bold shadow-md transition-all duration-300 ease-in-out">
  <span>More Participations</span>
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
  :
  <h1 className="text-center text-base my-28 font-bold text-white">No Recent Participations</h1>
}
  </>
  }
  </>
  );
};

export default ProfileHistory;
