import React,{useEffect,useState} from "react";
import Fire from './Fire';
import { useSearchParams } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceGrinStars } from "@fortawesome/free-solid-svg-icons"; // Face celebration icon
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
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
const get_data=()=>{
  return sessionStorage.getItem("token")
}
const get_role=()=>{
  return JSON.parse(sessionStorage.getItem("role"))
}
const OnlineScore = () => {
const token=get_data()
  const role=get_role()
const [searchParams] = useSearchParams();
const [isOpen, setIsOpen] = useState(false);
const [loading,setLoading]=useState(true)
const matchID=searchParams.get("id")
const [items,setItems]=useState([])
const [histruns,setHistruns]=useState({});
  const [histwickets,setHistwickets]=useState({});
  const teamicons=[{team:"Csk",image:"Csk/Gaikwad.webp"},{team:"Dc",image:"Dc/Pant.webp"},{team:"Kkr",image:"Kkr/S.Iyer.webp"},{team:"Mi",image:"Mi/Hardik.webp"},{team:"Rr",image:"Rr/Samson.webp"},{team:"Gt",image:"Gt/Gill.webp"},{team:"Pbks",image:"Pbks/Dhawan.webp"},{team:"Rcb",image:"Rcb/Duplesis.webp"},{team:"Srh",image:"Srh/Cummins.webp"},{team:"Lsg",image:"Lsg/KL Rahul.webp"}]
  const show_data=async()=>{
    try{
     const response = await fetch(`https://intelligent-ailyn-handcricket-e8842259.koyeb.app/specifictournament?id=${matchID}`);
    let data=await response.json()
  let pl=data.tournaments_data;
    const filterruns=pl[0].players.sort((a,b)=>b.runs-a.runs).filter((i,ind)=>ind<6);
    const filterwickets=pl[0].players.sort((a,b)=>b.wickets-a.wickets).filter((i,ind)=>ind<6);
    const histogramRuns = {
  labels: filterruns.map((batter)=> batter.name),
  datasets: [
    {
      label: "Runs Scored",
      data: filterruns.map((batter) => batter.runs),
      backgroundColor: "#3b82f6", // Blue color
      borderWidth: 1,
      borderRadius: 5,
    },
  ],
};
const histogramWickets = {
  labels: filterwickets.map((batter) => batter.name),
  datasets: [
    {
      label: "Wickets Scored",
      data: filterwickets.map((batter) => batter.wickets),
      backgroundColor: "#3b82f6", // Blue color
      borderWidth: 1,
      borderRadius: 5,
    },
  ],
};
    if(!data.error){
     setTimeout(()=>{
      setLoading(false)
      setItems(data.tournaments_data)
      setHistruns(histogramRuns);
  setHistwickets(histogramWickets);
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
  const histogramOptions = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
      ticks: { color: "rgb(148, 163, 184)", font: { weight: "bold" } },
      grid: { color: "rgba(255, 255, 255, 0.2)" }, // Light grid lines
    },
    x: {
      ticks: { color: "rgb(148, 163, 184)", font: { weight: "bold" } },
      grid: { display: false }, // Hide vertical grid lines
    },
  },
  plugins: {
    legend: { display: false }, 
        datalabels: {
          color: "transparent",
      font: { weight: "bold", size: 14 },
    },
          
  },
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
  {/* //& Navbar for mobile */}
    <div className="relative w-full bg-slate-800 flex items-center justify-between p-2 md:hidden z-50">
  <img className="w-28 h-16" src={`Logos/Logo.webp`} alt="Logo" />
</div>
<div className="w-full flex flex-col mt-4 justify-center items-center">
      <div className="w-full flex flex-col  rounded-md flex-wrap lg:w-96 lg:h-90 md:w-96 md:h-84">
 <div className="w-full mt-2 flex flex-row">
 <div className="w-2/5 ml-2 gap-1 flex flex-col items-center justify-center">
 <img src={teamicons.filter((i)=>i.team==items[0].playerteam)[0].image} className="w-auto h-auto" />
  <img src={`Logos/${items[0].playerteam}.webp`} className="w-12 h-12"/>
 </div>
  <div className="w-1/5 ml-2 mr-2 flex flex-col items-center justify-center">
<h1 className="text-base text-white font-bold">V/S</h1>
 </div>
 <div className="w-2/5 gap-1 mr-2 flex flex-col items-center justify-center">
 <img src={teamicons.filter((i)=>i.team==items[0].computerteam)[0].image} className="w-auto h-auto" />
  <img src={`Logos/${items[0].computerteam}.webp`} className="w-12 h-12"/>
 </div>
    </div>
</div>
<div className="w-full text-center text-white font-bold flex-col text-center">
<h1 className="text-sm">{items[0].name}</h1>
<p className="text-xs">{items[0].time}</p>
</div>
</div>
    {items[0].winner.split(" ")[0]!=='Draw' &&
  <>
  <div className="w-full py-4 flex justify-center">
     <h1 className="text-sm font-extrabold text-yellow-400">Winner</h1> 
    </div>
      <div className="w-full py-4 flex justify-center">
<img src={`Logos/${items[0].winner.split(" ")[0][0].toUpperCase()+items[0].winner.split(" ")[0].slice(1).toLowerCase()}.webp`} className="w-24 h-24" />
    </div>
    </>
  }
  {
  items[0].winner.split(" ")[0]==="Draw" && <>
        <div className="w-full py-20 flex justify-center">
     <h1 className="text-xl font-extrabold text-yellow-400">Draw</h1> 
    </div>
    </>
  }
   <div className="w-full flex justify-center items-center py-12">
     <button className="p-4 rounded-lg text-base text-slate-400 font-bold bg-slate-800">Match Summary</button>
   </div>
  <div className="w-full flex justify-center items-center">
   <h1 className="text-base font-bold text-slate-400">Scorecard</h1>
   </div>
   <div className="w-full flex flex-row justify-center gap-4">
     <div className="flex p-4 flex-row gap-4">
       <img src={`Logos/${items[0].playerteam}.webp`} className="w-16 h-16" />
     <div className="flex justify-center items-center text-center"><p className="text-lg font-bold text-slate-400">{items[0].playerrun}/{items[0].playerwicket}</p></div>
     </div>
          <div className="flex p-4 flex-row gap-4">
     <div className="flex justify-center items-center text-center"><p className="text-lg font-bold text-slate-400">{items[0].computerrun}/{items[0].computerwicket}</p></div>
     <img src={`Logos/${items[0].computerteam}.webp`} className="w-16 h-16" />
     </div>
   </div>
         <div className="w-full my-4 p-4 flex flex-col gap-y-4 justify-center text-center">
          <h1 className="text-xs font-extrabold text-yellow-400">Man of the Match</h1> 
     <div className="w-full flex justify-center"><img className="w-32 h-32" src={items[0].players.sort((a,b)=>(b.runs+b.wickets)-(a.runs+a.wickets))[0].image} /></div>
     <h1 className="text-xs font-extrabold text-yellow-400">{items[0].players.sort((a,b)=>(b.runs+b.wickets)-(a.runs+a.wickets))[0].name}</h1> 
    </div>
         <div className="w-full flex justify-center items-center">
   <h1 className="text-base font-bold text-slate-400">Performance</h1>
   </div>
   <div className="flex p-4 flex-row justify-center gap-4">
       <img src={`Logos/${items[0].playerteam}.webp`} className="w-16 h-16" />
     <div className="flex justify-center items-center text-center"><p className="text-lg font-bold text-slate-400">{items[0].playerrun}/{items[0].playerwicket}</p></div>
     </div>
   <div className="w-full flex p-4 flex-wrap flex-row justify-center gap-2">
     {
       items[0].players.map((i)=>{
       if(i.team==items[0].playerteam)
         return(<>
           <div className="p-4 flex flex-col gap-1 rounded-lg bg-slate-800 text-center justify-center items-center transition duration-300 ease-in-out transform hover:bg-slate-800  hover:scale-105">
    <div className="flex justify-center items-center"><img src={i.image} className="w-16 h-16" /></div>
    <p className="text-slate-400 text-xs font-bold">{i.name}</p>
  <p className="text-slate-400 text-xs font-bold">Runs-:{i.runs}</p>
  <p className="text-slate-400 text-xs font-bold">Wickets-:{i.wickets}</p>
           </div>
         </>)
       })
     }
     </div>
       <div className="flex p-4 flex-row justify-center gap-4">
       <img src={`Logos/${items[0].computerteam}.webp`} className="w-16 h-16" />
     <div className="flex justify-center items-center text-center"><p className="text-lg font-bold text-slate-400">{items[0].computerrun}/{items[0].computerwicket}</p></div>
     </div>
   <div className="w-full flex p-4 flex-wrap flex-row justify-center gap-2">
     {
       items[0].players.map((i)=>{
      if(i.team==items[0].computerteam)
         return(<>
           <div className="p-4 flex flex-col gap-1 rounded-lg bg-slate-800 text-center justify-center items-center transition duration-300 ease-in-out transform hover:bg-slate-800  hover:scale-105">
    <div className="flex justify-center items-center"><img src={i.image} className="w-16 h-16" /></div>
    <p className="text-slate-400 text-xs font-bold">{i.name}</p>
  <p className="text-slate-400 text-xs font-bold">Runs-:{i.runs}</p>
  <p className="text-slate-400 text-xs font-bold">Wickets-:{i.wickets}</p>
           </div>
         </>)
       })
     }
     </div>
      <div className="w-full py-4 flex justify-center">
    <h1 className="text-base font-extrabold text-slate-400">Top Batters</h1>
  </div>
  <div className="w-full flex flex-row flex-wrap justify-center gap-4 ">
    
    {
      items[0].players.sort((a,b)=>b.runs-a.runs).map((i,ind)=>{
      if(ind<6)
        return(<>
 <div className="p-4 flex flex-col gap-1 rounded-lg bg-slate-800 text-center justify-center items-center transition duration-300 ease-in-out transform hover:bg-slate-800  hover:scale-105">
   <img src={i.image} className="w-16 h-16"/>
  <div className="flex justify-center items-center"><h2 className="text-xs font-bold text-slate-400 ">{i.name}</h2></div>
    <div className="flex justify-center items-center"> <h2 className="text-xs font-bold text-slate-400 ">Runs-:{i.runs}</h2></div>
   </div>
        </>)
      })
    }
    </div>
             <div className="bg-gray-900 p-6  w-full md:w-3/4 lg:w-1/2 mx-auto">
      <h2 className="text-slate-400 text-xs font-bold mb-4 text-center">Batting Analysis</h2>
      <Bar data={histruns} options={histogramOptions} />
    </div>
    <div className="w-full py-4 flex justify-center">
    <h1 className="text-base font-extrabold text-slate-400">Top Bowlers</h1>
  </div>
  <div className="w-full flex flex-row flex-wrap justify-center gap-4 ">
    {
      items[0].players.sort((a,b)=>b.wickets-a.wickets).map((i,ind)=>{
      if(ind<6)
        return(<>
 <div className="p-4 flex flex-col gap-1 rounded-lg bg-slate-800 text-center justify-center items-center transition duration-300 ease-in-out transform hover:bg-slate-800  hover:scale-105">
   <img src={i.image} className="w-16 h-16"/>
  <div className="flex justify-center items-center"><h2 className="text-xs font-bold text-slate-400 ">{i.name}</h2></div>
    <div className="flex justify-center items-center"> <h2 className="text-xs font-bold text-slate-400 ">Wickets-:{i.wickets}</h2></div>
   </div>
        </>)
      })
    }
    </div>
          <div className="bg-gray-900 p-6  w-full md:w-3/4 lg:w-1/2 mx-auto">
      <h2 className="text-slate-400 text-xs font-bold mb-4 text-center">Bowling Analysis</h2>
      <Bar data={histwickets} options={histogramOptions} />
    </div>
<Fire show={true} />
  </>
}
 </>
  );
};

export default OnlineScore;
