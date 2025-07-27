import React,{useState,useEffect,useRef} from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaPaperPlane } from 'react-icons/fa';
import { FaArrowUp } from "react-icons/fa";
import {HashLink} from 'react-router-hash-link'
import {socket} from "../socket/socket"
const get_name=()=>{
  return JSON.parse(sessionStorage.getItem("username"))
}
const Handcricket = () => {
const name=get_name()
const [load,setLoad]=useState(false)
const [text,setText]=useState("")
const [msg,setMsg]=useState("")
const [start,setStart]=useState(false)
const [data,setData]=useState([])
const [opt,setOpt]=useState(0)
const [imp,setImp]=useState("")
const [disable,setDisable]=useState(false)
const buttons=[1,2,3,4,5,6]
const inactivityTimeout = useRef(null);
const countdownInterval = useRef(null);
const [timer, setTimer] = useState(20);
const teams=["Mi","Csk","Rr","Kkr","Gt","Pbks","Rcb","Lsg","Dc","Srh"];
  const triggerInactivity = () => {
    setImp('Connection issues...');
    socket.disconnect()
  };
  const resetInactivityTimer = () => {
  if (!start || data.game.result !== "") return;
  if (inactivityTimeout.current) {
  clearTimeout(inactivityTimeout.current);
  }
  if (countdownInterval.current) {
  clearInterval(countdownInterval.current);
}
  inactivityTimeout.current = setTimeout(triggerInactivity,20000);
  setTimer(20);
  countdownInterval.current = setInterval(() => {
    setTimer(prev => {
      if (prev <= 1) {
        clearInterval(countdownInterval.current);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
};
useEffect(()=>{
   window.scrollTo({ top: 0, behavior: "smooth" });
 },[])
  useEffect(() => {
    socket.on('wait', (message) => {
    setMsg(message);
  });

  socket.on('startGame', (message) => {
    setStart(true);
    setMsg("")
    setData(message);
  });
  socket.on('choiceturn',(ms)=>{
    if(ms=="Your Turn"){
    setMsg(ms)
    resetInactivityTimer();
    }
    else{
      setMsg(ms)
      clearInterval(countdownInterval.current);
    clearTimeout(inactivityTimeout.current);
    setTimer(0)
    }
  })
  socket.on('makescore',(mesg)=>{
  if(mesg.game.result!=''){
  clearInterval(countdownInterval.current);
    clearTimeout(inactivityTimeout.current);
  }
    setData(mesg)
  })
  socket.on('Left',(mseg)=>{
  clearInterval(countdownInterval.current);
  clearTimeout(inactivityTimeout.current);
    setImp(mseg)
  
  })
  return () => {
    socket.off('wait')
    socket.off('Left')
    socket.disconnect()// Clean up
    clearInterval(countdownInterval.current);
    clearTimeout(inactivityTimeout.current);
  };
}, []);
useEffect(() => {
  if (start==true && data.game.result === "" && msg === "Your Turn") {
    resetInactivityTimer();
  }
}, [start, msg]);
const add_Name=(i)=>{
  if (disable==false) {
  socket.emit('joinRoom', {name:name,team:i});
    setDisable(true)
    }
}
const optio=(i)=>{
  socket.emit('gomove',i)
  clearInterval(countdownInterval.current);
  clearTimeout(inactivityTimeout.current);
  setOpt(i)
}

  return (
  <>
  { load==false && <>
{ start===false && imp=='' && <>
{ msg=='' && 
<>
<div className="w-full mt-2 flex justify-center">
   <h1 className="text-green-400 text-2xl font-bold shadow-green-400">Select your Team</h1></div>
<div className="w-full mt-4 flex flex-wrap gap-x-6 gap-y-4 items-center justify-center  p-2 flex-row">
  {teams.map((i)=>{
  return(
  <div className="text-center rounded-lg  bg-slate-800" onClick={()=>add_Name(i)}>
    <img src={`Logos/${i}.webp`} className="w-24 h-24"></img>
    <h4 className="text-lg text-slate-400 font-bold">{i.toUpperCase()}</h4>
    </div>
    )
  })}
</div>
</>
}
{ msg!="" &&
<div className="my-44 text-center text-white font-bold">
<h1>Waiting for another player..... 
</h1>
</div>
}
</>
}
{
  start==true && imp==''  && <>
  <div className="w-full my-4 font-bold text-center">
{ msg=="Your Turn" && data.game.result=='' && <h2 className="text-center font-bold text-white">
  You have {timer} seconds to choose!
</h2>}
{ data.game.result=="" && <h1 className="font-bold text-white text-center my-2">{data.game.turn} start to Bat </h1>}
<div className="w-full flex justify-center flex-wrap gap-6 my-6">
  {data.players.map((i, idx) => (
    <div key={idx} className="flex w-36 h-60 flex-col items-center bg-black rounded-lg p-4 transition duration-300 ease-in-out transform hover:scale-105">
      <h1 className="text-slate-400 text-lg font-bold mb-2">{i.team.toUpperCase()}</h1>
      <img src={`Logos/${i.team}.webp`} className="w-20 h-20 rounded-md" />
      <p className="my-2 text-xs font-bold text-slate-400">{i.name}</p>
      <div className="mt-2 bg-black rounded-b-sm px-4 py-2">
        <p className="text-slate-400 text-xl font-bold">{i.choice}</p>
      </div>
    </div>
  ))}
</div>
{ data.game.result=='' && <h1 className="text-center font-bold text-white">{msg}</h1>}
{ msg=="Your Turn" && data.game.result=='' &&
    <div className="flex flex-row flex-wrap justify-center py-6 gap-4">
      {buttons.map((i)=>{
        return(<>
          <div className="px-4 py-4 rounded-full bg-slate-800" onClick={()=>optio(i)}>
            <button className="text-xl text-slate-400 font-bold">{i}</button>
          </div>
        </>)
      })}
    </div>
    }
  {
    msg=="Opposition Turn" && data.game.result=="" &&  opt!=0 &&
    <>
    <h1 className="font-bold text-center text-white my-4">You choose {opt} </h1>
    </>
  }
  { data.game.result=='' &&
  <>
    <div className="w-full flex justify-center items-center font-bold">
    {
      data.players.map((i)=>{
        if(i.name==data.game.turn){
          return(<>
     <img src={`Logos/${i.team}.webp`} className="w-20 h-20" />
      <h1 className="text-white text-center font-bold">{data.game.turn} score-: {data.game.scores[data.game.turn]} run(s)</h1>
          </>)
        }
      })
    }
    </div>
  {data.game.innings==2 &&  <h1 className="my-2 text-white text-center font-bold">Target is {data.game.target} run(s)</h1>}
</>  }
  {
    data.game.result!='' && 
        <div className="text-center flex flex-col gap-1 justify-center items-center text-white font-bold my-10">
        <img src="Icons/trophy.png" className=" w-16 h-16"/>
    <h1>{data.game.result}</h1>
    {
      Object.entries(data.game.scores).map(([key,value])=>{
        return(<>
    <div className="flex text-center justify-center items-center gap-2">
  {
    data.players[0].name==key ?       <img src={`Logos/${data.players[0].team}.webp`} className="w-12 h-12 rounded-md" />
    : <img src={`Logos/${data.players[1].team}.webp`} className="w-12 h-12 rounded-md" />
  }
     <h1>{key} scored-: {value} run(s)</h1>
     </div>
        </>)
      })
    }
     <button className="w-28 py-2 my-6 px-2 flex justify-center items-center bg-slate-800 text-white rounded-md font-bold" onClick={()=>window.location.reload()}>Restart</button>
    </div>
  }
    </div>

  </>
    }
{
  imp!='' && 
    <div className="text-center flex flex-col gap-4 justify-center items-center font-bold my-44 text-white font-bold">
    <h1>{imp}</h1>
     <button className="w-28 py-2 my-6 px-2 flex justify-center items-center bg-slate-800 text-white rounded-md font-bold" onClick={()=>window.location.reload()}>Restart</button>
    </div>
}
</>
}
</>
  );
};


export default Handcricket;