import React,{useState,useEffect,useRef} from "react";
import {Link} from 'react-router-dom'
import {HashLink} from 'react-router-hash-link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faUser, faRobot } from '@fortawesome/free-solid-svg-icons';

const get_token=()=>{
  return sessionStorage.getItem("token")
}
const get_role=()=>{
  return JSON.parse(sessionStorage.getItem("role"))
}
const get_name=()=>{
  return JSON.parse(sessionStorage.getItem("username"))
}
const Chat = () => {
const token=get_token();
const role=get_role();
const name=get_name()
const [load,setLoad]=useState(true);
const [mode,setMode]=useState("agent")
const [text,setText]=useState("")
const [val,setVal]=useState("")
const [subload,setSubload]=useState(false)
const [messages,setMessages]=useState([{
  message: "Hello, I am Cricko an AI agent! Ask me about players, teams, tournaments, or latest news.",
type: "about",
 role: "ai"
}])
const [icon,setIcon]=useState("");
const show_data=async()=>{
try{
const response = await fetch(`https://intelligent-ailyn-handcricket-e8842259.koyeb.app/userprofile?username=${name}`);
      let data=await response.json()
      if(!data.error){
       setTimeout(()=>{
        setLoad(false)
        setIcon(data.icon)
      },2000)
      }
    }
    catch(err){
      console.log("It is an error-: ",err)
    }
    }
useEffect(()=>{
   show_data()
    window.scrollTo({ top: 0, behavior: "smooth" });
  },[token])
  const handSubmit = async (val) => {
  try {
    const response = await fetch('https://intelligent-ailyn-handcricket-e8842259.koyeb.app/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question:val }),
    });

    const data = await response.json();
    setTimeout(()=>{
    setSubload(false)
     setMessages([...messages,data])
    },2000)
  } catch (error) {
    console.error("Error sending question:", error);
  }
};
useEffect(()=>{
if(subload==true){
  handSubmit(val)
  }
},[subload])
const handleSubmit=()=>{
if(text.trim()!=""){
   setMessages([...messages,{
message: text,
type: "search",
 role: "user"
   }])
   setVal(text)
    setSubload(true)
   setText("")
   }
   else{
     return;
   }
  }
  useEffect(()=>{
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  },[messages])
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
{
  load==false && <>
    <div className="relative w-full bg-slate-800 flex items-center justify-between p-2 md:hidden z-50 md:hidden">
  <img className="w-28 h-16" src={`Logos/Logo.webp`} />
  </div>
    <div className="flex justify-evenly mt-4">
  <button
    onClick={() => setMode("agent")}
    className={`px-4 py-2 font-bold ${mode === "agent" ? 'border-b border-b-white text-white' : 'text-white border-b border-b-transparent'}`}
  >
    Agent
  </button>
  <button
    onClick={() => setMode("guidelines")}
    className={`px-4 py-2 font-bold  ${mode === "guidelines" ? 'border-b border-b-white text-white' : 'text-white border-b border-b-transparent'}`}
  >
  Guidelines
  </button>
  </div>
  { mode=="agent" && <>
   <div className="flex flex-col">
  <div className="relative flex ml-8 w-72 mt-6">
  <textarea style={{ resize: "none" }} type="text" value={text} onChange={(e)=>setText(e.target.value)} placeholder="Enter Text...." className="w-full text-white bg-slate-800 border border-slate-700 font-semibold px-4 py-2 pr-10 rounded-lg shadow-md focus:outline-none border-none focus:ring-0  transition disabled:bg-slate-800 disabled:text-black text-sm placeholder-white"/>
    <button onClick={handleSubmit} disabled={subload} className="absolute right-3 top-1/3 transform -translate-y-1/2 text-sky-500 text-xl disabled:text-slate-800">
    <FontAwesomeIcon icon={faPaperPlane} />
    </button>
</div>
  <div className="flex-1 p-4 overflow-y-auto space-y-4 my-8 text-xs">
{messages.map((msg, index) =>{
if(msg.type=="about" || msg.type=="error"){ 
return(<>
<div className="flex justify-start items-start gap-3">
<img src="Icons/ai.png" className="w-8 h-8 rounded-full" />
<div className="w-full p-4 text-white font-semibold rounded-lg text-xs rounded-r-lg bg-slate-800">
<p>{msg.message}</p>
</div>
</div>
</>)}
else if(msg.type=="search"){ 
return(<>
<div className="flex justify-end items-start gap-3">
<div className="w-full p-4 text-white font-semibold rounded-lg rounded-r-lg bg-slate-800">
<p>{msg.message}</p>
</div>
{ icon!="" &&
<img src={icon} className="w-8 h-8 rounded-full" />
}
{ icon=="" &&
<img src="Icons/cricket.webp" className="w-8 h-8 rounded-full" />
}
</div>
{
  subload==true && index==messages.length-1 && <>
  <p className="text-white text-center font-bold">Loading....</p>
  </>
}
</>)}
else if(msg.type=="news"){ 
return(<>
<div className="flex justify-start items-start gap-3">
<img src="Icons/ai.png" className="w-8 h-8 rounded-full" />
    <div className="w-full bg-slate-800 flex flex-row rounded-md flex-wrap">
   <div className="w-1/2 flex flex-col justify-center items-center">
  <div className="flex flex-row gap-2 px-2">
<img src={`Logos/${msg._doc.playerteam}.webp`} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-contain" />
<h1 className="text-lg sm:text-xl font-bold text-white my-4">v/s</h1>
<img src={`Logos/${msg._doc.computerteam}.webp`} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-contain" />
  </div>
<div className="w-full flex flex-row flex-wrap justify-center items-center mt-2">
<h1 className="text-white text-center font-bold text-xs ml-2 mr-2">{msg._doc.content}</h1>
</div>
   </div>
  <div className="w-1/2 flex justify-center items-center">
  <img src={msg._doc.image} className="w-auto h-auto" />
  </div>
    </div>
    </div>
</>)}
else if(msg.type=="tournaments"){
  return(<>
<div className="flex justify-start items-start gap-3">
<img src="Icons/ai.png" className="w-8 h-8 rounded-full" />
 <div  className="w-full bg-slate-800 text-white p-5 rounded-xl shadow-lg ">
<div className="flex items-center justify-evenly">
<div className="flex flex-col items-center">
<img src={`Logos/${msg._doc.playerteam}.webp`} alt={msg._doc.playerteam} className="w-16 h-16"/>
<p className=" text-sm font-bold">{msg._doc.playerteam.toUpperCase()}</p>
<p className=" text-sm font-bold">{msg._doc.playerrun}/{msg._doc.playerwicket}</p>
</div>
  <div className="text-center">
 <h2 className="text-sm font-extrabold">V/S</h2>
</div>
<div className="flex flex-col items-center">
<img src={`Logos/${msg._doc.computerteam}.webp`} alt={msg._doc.computerteam} className="w-16 h-16"/>
<p className="text-sm font-bold">{msg._doc.computerteam.toUpperCase()}</p>
<p className=" text-sm font-bold">{msg._doc.computerrun}/{msg._doc.computerwicket}</p>
</div></div>
<div className="text-center flex flex-col gap-1 my-2">
<h2 className="text-sm font-bold">{msg._doc.winner}</h2>
<h2 className="text-xs  font-bold">{msg._doc.name}</h2>
<h2 className="text-xs font-bold">{msg._doc.time}</h2>
</div>
</div>
</div>
  </>)
}
else if(msg.type=="player"){ 
return(<>
<div className="flex justify-start items-start gap-3">
<img src="Icons/ai.png" className="w-8 h-8 rounded-full" />
    <div className="w-full bg-slate-800 flex flex-row rounded-md flex-wrap">
   <div className="w-1/2 flex flex-col justify-center items-start">
<h1 className="text-white text-center font-bold text-xs ml-4 mr-2">Name-: {msg._doc.name}</h1>
<h1 className="text-white text-center font-bold text-xs ml-4 mr-2">Role-: {msg._doc.role}</h1>
<h1 className="text-white text-center font-bold text-xs ml-4 mr-2">Matches-: {msg._doc.matches}</h1>
<h1 className="text-white text-center font-bold text-xs ml-4 mr-2">Runs-: {msg._doc.runs}</h1>
<h1 className="text-white text-center font-bold text-xs ml-4 mr-2">Wickets-: {msg._doc.wickets}</h1>
<img src={`Logos/${msg._doc.team}.webp`} alt={msg._doc.team} className="w-9 ml-4 mr-2 h-9"/>
</div>
  <div className="w-1/2 flex justify-center items-center">
  <img src={msg._doc.image} className="w-auto h-auto" />
  </div>
  </div>
    </div>
</>)}
else if(msg.type=="team"){ 
return(<>
<div className="flex justify-start items-start gap-3">
<img src="Icons/ai.png" className="w-8 h-8 rounded-full" />
<div className="w-full flex flex-col rounded-md bg-slate-800">
<div className="w-full bg-slate-800 flex flex-row rounded-md flex-wrap justify-start items-start">
<h1 className="text-white text-center font-bold text-sm ml-4 mr-2 mt-4 text-wrap">{msg._doc.team}</h1>
</div>
    <div className="w-full bg-slate-800 flex flex-row rounded-md flex-wrap">
   <div className="w-1/2 flex flex-col justify-center items-start">
<h1 className="text-white text-center font-bold text-xs ml-4 mr-2">TeamID-: {msg._doc.teamid.toUpperCase()}</h1>
<h1 className="text-white text-center font-bold text-xs ml-4 mr-2">Matches-: {msg._doc.matches}</h1>
<h1 className="text-white text-center font-bold text-xs ml-4 mr-2">Win-: {msg._doc.win}</h1>
<h1 className="text-white text-center font-bold text-xs ml-4 mr-2">Lose-: {msg._doc.lose}</h1>
</div>
  <div className="w-1/2 p-4 flex justify-center items-center">
  <img src={`Logos/${msg._doc.teamid}.webp`} className="w-28 h-28" />
  </div>
  </div>
    </div>
    </div>
</>)}    
    })}
</div>
</div>
</>
}
{
  mode=="guidelines" && <>
<ul className="text-yellow-400 text-sm list-disc pl-5 space-y-4 my-8 ml-2 mr-4 font-semibold">
  <li>
    For searching latest news and tournaments just write <strong>latest news</strong> and <strong>latest tournament</strong>.
  </li>
  <li>
    For searching news, team stats and tournaments based on any team — for example: 
    <br />
    <strong>Mumbai Indians Tournament → "Tournament Mi"</strong><br />
    <strong>News → "News Mi"</strong><br />
    <strong>Team → "Team Mi"</strong><br />
    <strong>Player → "Player Hardik Pandya"</strong>
  </li>
  <li>
    For searching latest news and tournaments about any match write  — for example:
    <br />
    <strong>Tournament Mi vs Gt</strong><br />
    <strong>News Mi vs Gt</strong>
  </li>
  <li>
    Avoid using nicknames like <strong>Thala</strong>, <strong>Hitman</strong>, and do not include numbers or special characters in your search queries.
  </li>
  <li>
    This is an intuitive-based AI agent made with ❤️ by <strong>Coder2003Anujyoti</strong>.
  </li>
</ul>
  </>
}
  </>
}
   </>
  );
};

export default Chat;
