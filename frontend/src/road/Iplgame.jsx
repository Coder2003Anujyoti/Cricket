import React,{useState,useEffect} from "react";
import { motion } from "framer-motion";
import {useSearchParams} from "react-router-dom"
import PlayerFirst from './PlayerFirst.jsx';
import ComputerFirst from './ComputerFirst.jsx';
import { useLocation } from "react-router-dom";
const LocalData=()=>{
  const lists=localStorage.getItem('iploppos');
  if(lists){
    return JSON.parse(lists);
  }
  else{
    return [];
}
}
const LocalWin=()=>{
  const lists=localStorage.getItem('iplwinnerlist');
  if(lists){
    return JSON.parse(lists);
  }
  else{
    return [];
}
}
const LocalMatch=()=>{
  const lists=localStorage.getItem('iplwinlist');
  if(lists){
    return JSON.parse(lists);
  }
  else{
    return [];
}
}
const LocalStand=()=>{
  const lists=localStorage.getItem('iplstandings');
  if(lists){
    return JSON.parse(lists);
  }
  else{
    return [];
}
}
const Iplgame = () => {
  const [searchParams] = useSearchParams();
  const [oppositionteam,setOppositionteam]=useState("")
  const [choose,setChoose]=useState(false)
  const [standing,setStanding]=useState(()=>LocalStand()||[])
  const [toggle,setToggle]=useState("");
  const [win,setWin]=useState(()=>LocalWin()||[])
  const [matches,setMatches]=useState(()=>LocalMatch()||[])
  const [load,setLoad]=useState(false);
  const [items,setItems]=useState([]);
  const [oppositionplayers,setOppositionplayers]=useState([])
  const [players,setPlayers]=useState([]);
  const [id,setId]=useState([]);
    const [toss,setToss]=useState("");
  const [playerfirst,setPlayerfirst]=useState(false);
  const [computerfirst,setComputerfirst]=useState(false);
  const teamId = searchParams.get("team"); 
  const [teams,setTeams]=useState(()=>LocalData()||[])
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const data = JSON.parse(decodeURIComponent(queryParams.get("data"))) || [];
  const team=JSON.parse(decodeURIComponent(queryParams.get("team"))) || "";
  const playerteam=data.filter((i)=>i.team===team);
  const computerteam=data.filter((i)=>i.team===oppositionteam)
  const add_Players=(i)=>{
      window.scrollTo({ top: 0, behavior: "smooth" });
    setPlayers([...players,i]);
    setId([...id,i.name]);
  }
    useEffect(()=>{
    window.scrollTo({ top: 0, behavior: "smooth" });
  },[])
  const get_Toss=()=>{
   let options=Math.floor(Math.random()*2);
    if(options==0){
      let computer_options=Math.floor(Math.random()*2);
      if(computer_options===0){
        setToss("Computer Bat");
      }
      else{
        setToss("Computer Ball");
      }
    }
    if(options===1){
      setToss("Player");
    }
  }
  useEffect(()=>{
    if(win.length===9){
      if(matches.length===9){
      const knockteam=standing.slice().sort((a,b)=>b.win-a.win).filter((i,ind)=>ind<4);
      const pos_team=knockteam.findIndex((i)=>i.name===team);
      if(pos_team==0){
        setOppositionteam(knockteam[3].name)
      }
   if(pos_team==1){
        setOppositionteam(knockteam[2].name)
      }
      if(pos_team==2){
        setOppositionteam(knockteam[1].name)
      }
      if(pos_team==3){
        setOppositionteam(knockteam[0].name)
      }
      }
      if(matches.length>9){
              setOppositionteam(matches[matches.length-1].computer)
      }
    }
        if(win.length===10){
          if(matches[matches.length-1].win!=="Draw"){
      const knockteam=standing.slice().sort((a,b)=>b.win-a.win).filter((i,ind)=>ind<4);
      const pos_team=knockteam.findIndex((i)=>i.name===team);
      if(pos_team==0){
        setOppositionteam(knockteam[1].name)
      }
   if(pos_team==1){
        setOppositionteam(knockteam[3].name)
      }
      if(pos_team==2){
        setOppositionteam(knockteam[0].name)
      }
      if(pos_team==3){
        setOppositionteam(knockteam[2].name)
      }
          }
           if(matches[matches.length-1].win==="Draw"){
              setOppositionteam(matches[matches.length-1].computer)
      }
    }
  },[matches])
  useEffect(()=>{
    if(win.length>=0 && win.length<9){
      setOppositionteam(teams[0])
    }
  },[win])
  return (
    <>
{ oppositionteam!='' && <>
     {
      id.length<10 && choose===false && <>
      { win.length===9 && <>
        <div className="w-full flex flex-col justify-center text-center gap-y-6 my-2">
          <h1 className="font-bold text-yellow-500 ml-2 mr-2">Semi-final</h1>
        </div>
</>}
    { win.length===10 && <>
        <div className="w-full flex flex-col justify-center text-center gap-y-6 my-2">
          <h1 className="font-bold text-yellow-500 ml-2 mr-2">Final</h1>
        </div>
</>}
  <div className="flex flex-col gap-y-6 my-32">
   <div className="w-full flex flex-col justify-center text-center gap-y-6 my-2">
   <h1 className="font-bold text-yellow-400 ml-2 mr-2">Welcome to IPL 2024</h1>
        </div>
<div className="flex flex-wrap gap-y-14  justify-center items-center text-white gap-x-10">
<div className="flex flex-col items-center gap-y-4">
  <img src={playerteam.filter((i,ind)=>ind===0).map((i)=>i.image)}  className="w-28 h-28" />
 <img src={`Logos/${team}.webp`} className="w-16 h-16" />
</div>
<motion.span
  animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
  transition={{ repeat: Infinity, duration: 1.2 }}
  className="text-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent"
>
  V/S
</motion.span>
  <div className="flex flex-col items-center gap-y-4">
 <img src={computerteam.filter((i,ind)=>ind===0).map((i)=>i.image)} loading="lazy"  className="w-28 h-28" />
  <img src={`Logos/${oppositionteam}.webp`}  className="w-16 h-16" />
 </div>
 </div>
  <div className="w-full flex justify-center items-center">
  <button onClick={()=>setChoose(true)} className="text-sm text-white font-extrabold p-4 bg-orange-600 rounded-bl-lg rounded-tl-lg rounded-tr-lg">Start Playing</button>
  </div>
 </div>
      </>
    }

{load==false && id.length<10 && choose===true && <>
    { win.length===9 && <>
        <div className="w-full flex flex-col justify-center text-center gap-y-6 my-2">
          <h1 className="font-bold text-yellow-500 ml-2 mr-2">Semi-final</h1>
        </div>
</>}
    { win.length===10 && <>
        <div className="w-full flex flex-col justify-center text-center gap-y-6 my-2">
          <h1 className="font-bold text-yellow-500 ml-2 mr-2">Final</h1>
        </div>
</>}
  <div className="w-full py-8 flex justify-center">
    <h1 className="text-green-400 text-2xl font-bold shadow-green-400">Choose Your Playing X</h1>
  </div>
  <div className="flex justify-center flex-row flex-wrap gap-4">
    {playerteam.map((i)=>{
    if(!id.includes(i.name))
      return(
      <>
        <div className="text-center rounded-md bg-black  transition duration-300 ease-in-out transform   hover:scale-105" onClick={()=>add_Players(i)}>
       <div className="flex justify-center items-center"> <img className="w-16 h-16" src={i.image} /></div>
        <p className="text-xs font-bold text-slate-400">{i.name}</p>
        </div>
      </>
      )
    })}
  </div>
    {id.length>0 && <>
     <div className="flex my-6 p-2 border-t border-t-slate-600 flex-col justify-center items-center text-center gap-4">
     <h1 className="text-lg text-green-400 font-bold">Your Team</h1>
       <img src={`Logos/${team}.webp`} className="w-24 h-24" />
     </div>
   <div className="w-full flex p-4 flex-wrap flex-row justify-center gap-2 ">
     {
       players.map((i)=>{
         return(<>
    <div className="p-4 flex flex-col gap-1 rounded-lg bg-slate-800 text-center justify-center items-center transition duration-300 ease-in-out transform hover:bg-slate-800  hover:scale-105">
    <div className="flex justify-center items-center"><img src={i.image} className="w-16 h-16" /></div>
    <p className="text-slate-400 text-xs font-bold">{i.name}</p>
           </div>
         </>)
       })
     }
     </div>
  </>}
</>
}
  </>
}
{ id.length===10 && toggle=="" && playerfirst===false && computerfirst===false && <>
    { win.length===9 && <>
        <div className="w-full flex flex-col justify-center text-center gap-y-6 py-6">
          <h1 className="font-bold text-yellow-500 ml-2 mr-2">Semi-final</h1>
        </div>
</>}
    { win.length===10 && <>
        <div className="w-full flex flex-col justify-center text-center gap-y-6 py-6">
          <h1 className="font-bold text-yellow-500 ml-2 mr-2">Final</h1>
        </div>
</>}

 <div className="flex p-4  flex-col justify-center items-center text-center gap-4">
     <h1 className="text-lg text-green-400 font-bold">Your Team</h1>
       <img src={`Logos/${team}.webp`} className="w-24 h-24" />
     </div>
   <div className="w-full flex p-4 flex-wrap flex-row justify-center gap-2 my-4">
     {
       players.map((i)=>{
         return(<>
    <div className="p-4 flex flex-col gap-1 rounded-lg bg-slate-800 text-center justify-center items-center transition duration-300 ease-in-out transform hover:bg-slate-800  hover:scale-105">
    <div className="flex justify-center items-center"><img src={i.image} className="w-16 h-16" /></div>
    <p className="text-slate-400 text-xs font-bold">{i.name}</p>
           </div>
         </>)
       })
     }
     </div>
      <div className="flex p-4 border-t border-t-slate-600 flex-col justify-center items-center text-center gap-4">
     <h1 className="text-lg text-green-400 font-bold">Opposition Team</h1>
       <img src={`Logos/${oppositionteam}.webp`} className="w-24 h-24" />
     </div>
   <div className="w-full flex p-4 flex-wrap flex-row justify-center gap-2 my-4">
     {
      computerteam.slice(0,10).map((i)=>{
         return(<>
    <div className="p-4 flex flex-col gap-1 rounded-lg bg-slate-800 text-center justify-center items-center transition duration-300 ease-in-out transform hover:bg-slate-800  hover:scale-105">
    <div className="flex justify-center items-center"><img src={i.image} className="w-16 h-16" /></div>
    <p className="text-slate-400 text-xs font-bold">{i.name}</p>
           </div>
         </>)
       })
     }
     </div>
      <div className="w-full flex justify-center items-center">
      <button className="p-4 font-extrabold text-slate-400 rounded-lg bg-slate-800" onClick={()=>{
            window.scrollTo({ top: 0, behavior: "smooth" });
      setToggle("Go")}}>Submit</button>
    </div>
     </>}
{ id.length==10 && toggle==="Go" && playerfirst===false && computerfirst===false && <>
  
  {
    toss==='' && <>
    <div className="w-full py-8 flex justify-center">
      <h1 className="text-green-400 text-2xl font-bold shadow-green-400">Toss the coin</h1>
    </div>
      <div className="py-8 flex w-full justify-center">
        <img src="Icons/coin.png" className="w-28 h-28" onClick={get_Toss} />
      </div>
    </>
  }
  {
    toss=="Computer Bat" && <>
      <div className="w-full py-20 flex justify-center text-center"><h1 className="text-green-400 text-2xl font-bold shadow-green-400 ml-2 mr-2">
      {oppositionteam.toUpperCase()} won toss and elected to Bat first 
      </h1></div>
    <div className="w-full flex justify-center items-center">
      <button className="p-4 font-extrabold text-slate-400 rounded-lg bg-slate-800" onClick={()=>{
      window.scrollTo({ top: 0, behavior: "smooth" });
      setComputerfirst(true)}}>Submit</button>
    </div>
    </>
  }
    {
    toss=="Computer Ball" && <>
      <div className="w-full py-20 flex justify-center text-center"><h1 className="text-green-400 text-2xl font-bold shadow-green-400 ml-2 mr-2">
      {oppositionteam.toUpperCase()} won toss and elected to Bowl first 
      </h1></div>
    <div className="w-full flex justify-center items-center">
      <button className="p-4 font-extrabold text-slate-400 rounded-lg bg-slate-800" onClick={()=>{
      window.scrollTo({ top: 0, behavior: "smooth" });
      setPlayerfirst(true)}}>Submit</button>
    </div>
    </>
  }
  {
    toss=="Player" && <>
            <div className="w-full py-20 flex justify-center text-center"><h1 className="text-green-400 text-2xl font-bold shadow-green-400">
      {team.toUpperCase()} won toss 
      </h1></div>
      <div className="w-full flex justify-center items-center flex-row gap-28">
  <div className="text-center p-4 rounded-lg bg-slate-800" onClick={()=>{
  window.scrollTo({ top: 0, behavior: "smooth" });
  setPlayerfirst(true)}}> <img className="w-16 h-16" src="Icons/Batsman.png" /></div>
  <div className="text-center p-4 rounded-lg bg-slate-800" onClick={()=>{
  window.scrollTo({ top: 0, behavior: "smooth" });
  setComputerfirst(true)}}> <img className="w-16 h-16" src="Icons/Bowler.png" /></div>
      </div>
    </>
  }
</>
}
{
  playerfirst===true && <PlayerFirst players={players} oppositionplayers={computerteam.slice(0,10)} />
}
{
  computerfirst===true && <ComputerFirst players={players} oppositionplayers={computerteam.slice(0,10)} />
}

</>
  );
};



export default Iplgame;