import React,{useState,useEffect} from "react";
import { motion } from "framer-motion";
import PlayerFirst from './PlayerFirst.jsx';
import ComputerFirst from './ComputerFirst.jsx';
import { useLocation } from "react-router-dom";
const Playgame = () => {
  const [spot,setSpot]=useState(true)
    const [toss,setToss]=useState("");
  const [playerfirst,setPlayerfirst]=useState(false);
  const [computerfirst,setComputerfirst]=useState(false);
  const [choose,setChoose]=useState(false)
  const [toggle,setToggle]=useState("");
  const [players,setPlayers]=useState([]);
  const [id,setId]=useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const player = JSON.parse(decodeURIComponent(queryParams.get("player"))) || [];
  const computer=JSON.parse(decodeURIComponent(queryParams.get("computer"))) || [];
  const playerteam = JSON.parse(decodeURIComponent(queryParams.get("playerteam"))) || "";
  const computerteam=JSON.parse(decodeURIComponent(queryParams.get("computerteam"))) || "";
  const add_Players=(i)=>{
    window.scrollTo({ top: 0, behavior: "smooth" });
    setPlayers([...players,i]);
    setId([...id,i.name]);
  }
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
  useEffect(() => {
    const timer = setTimeout(() => {
      setSpot(false); 
    }, 3000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <>
    {
  spot==true && <>
    <div className="fixed inset-0 bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center z-50 overflow-hidden">
      {/* Moving spotlights */}
      <motion.div
        className="absolute w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(255,255,255,0.08),transparent)]"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Lightning flash */}
      <motion.div
        className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          repeat: Infinity,
          duration: 0.2,
          repeatDelay: 1.7
        }}
      />

      {/* Spark particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-yellow-400 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth - window.innerWidth / 2,
            y: Math.random() * window.innerHeight - window.innerHeight / 2,
            opacity: 0
          }}
          animate={{
            y: [null, (Math.random() - 0.5) * 200],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 1.5,
            delay: Math.random() * 2,
            repeat: Infinity
          }}
        />
      ))}

      {/* Logos + V/S */}
      <div className="flex flex-col items-center gap-6 sm:gap-10 z-10">
        <motion.img
         src={`Logos/${playerteam}.webp`}
          className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 drop-shadow-[0_0_20px_gold]"
          initial={{ x: -300, opacity: 0, rotate: -30 }}
          animate={{ x: 0, opacity: 1, rotate: 0 }}
          transition={{ duration: 1 }}
        />
        <motion.span
          className="text-3xl sm:text-3xl md:text-6xl font-bold text-white glow"
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.3, 1] }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          V/S
        </motion.span>
        <motion.img
          src={`Logos/${computerteam}.webp`}
          className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 drop-shadow-[0_0_20px_skyblue]"
          initial={{ x: 300, opacity: 0, rotate: 30 }}
          animate={{ x: 0, opacity: 1, rotate: 0 }}
          transition={{ duration: 1 }}
        />
      </div>
    </div>
  </>
}
    {
      id.length<10 && choose===false && spot==false && <>
  <div className="flex flex-col gap-y-6 my-32">
   <div className="w-full flex flex-col justify-center text-center gap-y-6 my-2">
   <h1 className="font-bold text-yellow-400 ml-2 mr-2">Welcome to One v/s One Series</h1>
        </div>
<div className="flex flex-wrap gap-y-14  justify-center items-center text-white gap-x-10">
<div className="flex flex-col items-center gap-y-4">
  <img src={player.filter((i,ind)=>ind===0).map((i)=>i.image)}  className="w-28 h-28" />
 <img src={`Logos/${playerteam}.webp`} className="w-16 h-16" />
</div>
<h1 className="text-base font-bold text-white">V/S </h1>
  <div className="flex flex-col items-center gap-y-4">
 <img src={computer.filter((i,ind)=>ind===0).map((i)=>i.image)} loading="lazy"  className="w-28 h-28" />
  <img src={`Logos/${computerteam}.webp`}  className="w-16 h-16" />
 </div>
 </div>
 <div className="w-full flex justify-center items-center">
  <button onClick={()=>setChoose(true)} className="text-sm  text-white font-bold px-4 py-3 bg-sky-600 rounded-md">Start Playing</button>
  </div>
 </div>
      </>
    }
      {id.length<10 && choose===true && <>
  <div className="w-full py-8 flex justify-center">
    <h1 className="text-green-400 text-2xl font-bold shadow-green-400">Choose Your Playing X</h1>
  </div>
  <div className="flex justify-center flex-row flex-wrap gap-4">
    {player.map((i)=>{
    if(!id.includes(i.name))
      return(
      <>
        <div className="text-center rounded-md bg-black  transition duration-300 ease-in-out transform hover:bg-black  hover:scale-105" onClick={()=>add_Players(i)}>
         <div className="flex justify-center items-center">   <img className="w-16 h-16" src={i.image} /></div>
        <p className="text-xs font-bold text-slate-400">{i.name}</p>
        </div>
      </>
      )
    })}
  </div>
    {id.length>0 && <>
     <div className="flex my-6 p-2 border-t border-t-slate-600 flex-col justify-center items-center text-center gap-4">
     <h1 className="text-lg text-green-400 font-bold">Your Team</h1>
       <img src={`Logos/${playerteam}.webp`} className="w-24 h-24" />
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
{ id.length===10 && toggle=="" && playerfirst===false && computerfirst===false && <>
 <div className="flex p-4 flex-col justify-center items-center text-center gap-4">
     <h1 className="text-lg text-green-400 font-bold">Your Team</h1>
       <img src={`Logos/${playerteam}.webp`} className="w-24 h-24" />
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
       <img src={`Logos/${computerteam}.webp`} className="w-24 h-24" />
     </div>
   <div className="w-full flex p-4 flex-wrap flex-row justify-center gap-2 my-4">
     {
      computer.slice(0,10).map((i)=>{
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
{ id.length===10 && toggle==="Go" && playerfirst===false && computerfirst===false && <>
  {
    toss==='' &&  <>
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
      {computerteam.toUpperCase()} won toss and elected to Bat first 
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
      {computerteam.toUpperCase()} won toss and elected to Bowl first 
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
      {playerteam.toUpperCase()} won toss 
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
</>}
  {
  playerfirst===true && <PlayerFirst players={players} oppositionplayers={computer.slice(0,10)} />
}
{
  computerfirst===true && <ComputerFirst players={players} oppositionplayers={computer.slice(0,10)} />
}

</>
  );
};
export default Playgame;
