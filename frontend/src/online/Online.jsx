import React, { useState, useEffect,useRef } from "react";
import { socket } from "../socket/socket";

const get_data = () => {
  return sessionStorage.getItem("token");
};

const get_role = () => {
  return JSON.parse(sessionStorage.getItem("username"));
};
const Online = () => {
  const token = get_data();
  const role = get_role();
  const [count,setCount]=useState(0)
  const [wait, setWait] = useState(null);
  const [msg, setMsg] = useState("");
  const [teams, setTeams] = useState([]);
  const [hasStart, setHasStart] = useState(false);
  const [data, setData] = useState([]);
  const [opt,setOpt]=useState(0)
  const [imp,setImp]=useState("")
  const [choice, setChoice] = useState("");
  const buttons = [1, 2, 3, 4, 5, 6];
  const [timer, setTimer] = useState(20);
const inactivityTimeout = useRef(null);
const countdownInterval = useRef(null);

  const resetInactivityTimer = () => {
    // Clear existing interval
    if (countdownInterval.current) {
      clearInterval(countdownInterval.current);
    }
    setTimer(20);
    countdownInterval.current = setInterval(() => {
      setTimer(prev => {
        if (prev > 0) {
          return prev - 1;
        } else {
          clearInterval(countdownInterval.current);
          return 0;
        }
      });
    }, 1000);
  };
  useEffect(() => {
    if (timer === 0) {
      setImp("Connection issues...");
      socket.disconnect();
    }
  }, [timer]);
  const optio = (i) => {
  socket.emit('gomove', i);
  setOpt(i);
    clearInterval(countdownInterval.current);
  setTimer(20); // ← stop timer after move
};
  useEffect(() => {
    socket.on("wait", (mseg) => {
      setMsg(mseg);
      setWait(true);
    });
    socket.on("subwait", (mseg) => {
      setMsg(mseg);
      setWait(true);
    });
    socket.on("selectteam", (data) => {
      setWait(false);
      setTeams(data);
      resetInactivityTimer()
    });
    socket.on("startgame", (item) => {
      setHasStart(true);
      setData(item);
      setWait(false);
    });
    socket.on("makescore", (item) => {
    if(item.game.result!=""){
  clearInterval(countdownInterval.current);
    }
      setData(item);
    });
    socket.on("choiceturn", (mesg) => {
    if(mesg=="Your Turn"){
    setChoice(mesg)
    resetInactivityTimer();
    }
    else{
      setChoice(mesg)
   clearInterval(countdownInterval.current);
      setTimer(20)
    }
});
    socket.on('Left',(mseg)=>{
    setImp(mseg)
  })
    return () => {
  socket.off("Left");
  socket.off("wait");
  socket.off("subwait")
  socket.off("selectteam")
  socket.off("startgame")
  socket.off("makescore")
  socket.off("choiceturn")
  socket.disconnect();
  clearInterval(countdownInterval.current);
};
  }, []);


  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
 {wait == null && (
<div className="flex flex-col gap-4 my-64 items-center justify-center">
<img src="Icons/cricket.webp" className="w-24 h-24" />
<button onClick={() => { socket.emit("joinRoom", role); }} className="w-36 h-10  rounded-lg bg-slate-800 text-white font-bold">Join Room</button></div>)}
{ imp==="" && <>
{wait == true && (
<h1 className="text-white font-bold text-center my-48">{msg}</h1>)}
{ wait == false && (<>
{teams.length > 0 && ( <>
<div className="w-full mt-24 flex justify-center">
<h1 className="text-green-400 text-2xl font-bold shadow-green-400">Select your Team
</h1>
</div>
<div className="w-full mt-4 flex flex-wrap gap-x-6 gap-y-4 items-center justify-center  p-2 flex-row">
{teams.map((i) => {return (
<div onClick={() => { 
socket.emit("showteam", { name: role, team: i }); setTeams([]);
setTimer(20)
clearInterval(countdownInterval.current);
}}
className="text-center rounded-lg  bg-slate-800" key={i}>
<img src={`Logos/${i}.webp`} className="w-24 h-24" />
<h4 className="text-lg text-slate-400 font-bold">{i.toUpperCase()}</h4> </div> );})}
</div></>)}
{ hasStart === true  && (<>
<h1 className="text-center font-bold text-white mt-6">{data.game.turn.toUpperCase()} Bat </h1>
<div className="w-full flex flex-row justify-center py-4 gap-40">
<h1 className="text-slate-400 text-2xl font-bold shadow-slate-400">
{data.players[0].team.toUpperCase()}
</h1>
<h1 className="text-slate-400 text-2xl font-bold shadow-slate-400">
{data.players[1].team.toUpperCase()}
</h1>
</div>
<div className="w-full flex flex-row justify-center gap-12"><div className="text-center rounded-md bg-black transition duration-300 ease-in-out transform hover:bg-black hover:scale-105"> <img src={data.players[0].player} className="w-36 h-36" />
 <p className="my-2 text-xs font-bold text-slate-400">{data.players[0].name}</p>
<div className="p-4 rounded-b-sm bg-black">
<p className="text-slate-400 text-2xl font-bold shadow-slate-400">{data.players[0].choice} </p></div></div>
<div className="text-center rounded-md bg-black transition duration-300 ease-in-out transform hover:bg-black hover:scale-105">
<img src={data.players[1].player} className="w-36 h-36" /> <p className="my-2 text-xs font-bold text-slate-400">{data.players[1].name}</p>
 <div className="p-4 rounded-b-sm bg-black">
<p className="text-slate-400 text-2xl font-bold shadow-slate-400">
{data.players[1].choice}
</p>
</div>
</div>
</div>
{ data.game.result=="" && <>
{choice == "Your Turn" && (<>
<p className="text-red-400 text-center font-bold mt-2">Time left: {timer}s</p>
<div className="flex flex-row flex-wrap justify-center py-6 gap-4">
{buttons.map((i) => {return (
<div className="px-4 py-4 rounded-full bg-slate-800" key={i} >
<button onClick={()=>optio(i)} className="text-xl text-slate-400 font-bold"> {i}</button></div>)})}</div></>
)}
{choice != "Your Turn" && (<h1 className="font-bold mt-12 py-4 text-white text-center">Waiting for opposition...</h1>
)}
<div className="flex flex-row gap-x-4 text-center justify-center"><img src={`Logos/${data.game.turn}.webp`} className="w-24 h-24"/>
<div className="flex flex-row text-center items-center justify-center">
<p className="text-slate-400 text-2xl font-bold shadow-slate-400">Runs-: {data.game.scores[data.game.turn]}</p></div>
</div>
{data.game.target != -1 && (
  <p className="text-slate-400 text-center mt-4 text-2xl font-bold shadow-slate-400">
    Target-: {data.game.target}
  </p>
)}
</>}
{ data.game.result!="" && <>
  {
    data.game.result!="Match is tied" && <>
      <div className="w-full py-4 flex justify-center">
     <h1 className="text-sm font-extrabold text-yellow-400">Winner</h1> 
    </div>
      <div className="w-full py-4 flex justify-center">
<img src={`Logos/${data.game.result.split(" ")[0]}.webp`} className="w-24 h-24" />
    </div>
    </>
  }
    {
    data.game.result=="Match is tied" && 
            <div className="w-full py-20 flex justify-center">
     <h1 className="text-xl font-extrabold text-yellow-400">Draw</h1> 
    </div>
  }
     <div className="w-full flex flex-row justify-evenly">
     <div className="flex flex-col gap-2">
       <img src={`Logos/${data.players[0].team}.webp`} className="w-16 h-16" />
     <div className="flex justify-center items-center text-center"><p className="text-lg font-bold text-slate-400">Runs-: {data.game.scores[data.players[0].team]}</p></div>
     </div>
          <div className="flex flex-col gap-2">
     <img src={`Logos/${data.players[1].team}.webp`} className="w-16 h-16" />
     <div className="flex justify-center items-center text-center"><p className="text-lg font-bold text-slate-400">Runs-: {data.game.scores[data.players[1].team]}</p></div>
     </div>
   </div>
  </>}
</>)} 
</>)}
</>}
{
  imp!="" && <>
  <h1 className="text-white font-bold text-center my-48">{imp}</h1>
  </>
}
    </>
  );
};

export default Online;