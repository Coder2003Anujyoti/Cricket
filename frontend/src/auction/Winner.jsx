import React,{useState,useEffect} from "react";
import Fire from './Fire';
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);
const LocalPlayers=()=>{
  const lists=localStorage.getItem('players');
  if(lists){
    return JSON.parse(lists);
  }
  else{
    return [];
}
}
const LocalComputers=()=>{
  const lists=localStorage.getItem('computers');
  if(lists){
    return JSON.parse(lists);
  }
  else{
    return [];
}
}
const LocalWinner=()=>{
  const lists=localStorage.getItem('winarray');
  if(lists){
    return JSON.parse(lists);
  }
  else{
    return [];
}
}
const Winner = ({winner,yourteam,opposteam}) => {
  const [pdata,setPdata]=useState(()=>LocalPlayers()||[]);
  const [wins,setWins]=useState(()=>LocalWinner()||[]);
  const [cdata,setCdata]=useState(()=>LocalComputers()||[]);
  const [histruns,setHistruns]=useState({});
  const [histwickets,setHistwickets]=useState({});
  const [valid,setValid]=useState(false)
  const [load,setLoad]=useState(true);
  const array=yourteam.concat(opposteam);
  const playerdata=yourteam;
const computerdata= opposteam;
const motm=array.sort((a,b)=>(b.runs+b.wickets)-(a.runs+a.wickets));
const playertotal=playerdata.reduce((total,i)=>{
  total+=(i.runs);
  return total;
},0)
const computertotal=computerdata.reduce((total,i)=>{
  total+=(i.runs);
  return total;
},0)
const playerwickets=computerdata.reduce((total,i)=>{
  total+=(i.wickets);
  return total;
},0)
const computerwickets=playerdata.reduce((total,i)=>{
  total+=(i.wickets);
  return total;
},0)
  const send_data=async(datas,gatas,rat)=>{
  if(valid==false){
    const [res,ress,gess]=await Promise.all([fetch("https://intelligent-ailyn-handcricket-e8842259.koyeb.app/players", {
    method: "POST",
    body: JSON.stringify(datas),
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
}),fetch("https://intelligent-ailyn-handcricket-e8842259.koyeb.app/records", {
    method: "POST",
    body: JSON.stringify(gatas),
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
}),fetch("https://intelligent-ailyn-handcricket-e8842259.koyeb.app/results", {
    method: "POST",
    body: JSON.stringify(rat),
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
})]) ;
 const value=await res.json();
 const values=await ress.json();
 const vals = await gess.json();
 setValid(true)
 }
  }
  useEffect(()=>{
    window.scrollTo({ top: 0, behavior: "smooth" });
  },[])
  useEffect(()=>{
  if(winner===yourteam[0].team){
   //send_data({data:array},{winner:yourteam,loser:opposteam,draw:false},{team:yourteam[0].team,opposteam:opposteam[0].team,yourstatus:"Winner",oppstatus:"Loser"})
   setLoad(false)
  }
 else if(winner===opposteam[0].team){
   //send_data({data:array},{winner:opposteam,loser:yourteam,draw:false},{team:yourteam[0].team,opposteam:opposteam[0].team,yourstatus:"Loser",oppstatus:"Winner"})
   setLoad(false)
  }
  else{
   // send_data({data:array},{winner:yourteam,loser:opposteam,draw:true},{team:yourteam[0].team,opposteam:opposteam[0].team,yourstatus:"Draw",oppstatus:"Draw"})
    setLoad(false)
  }
  
  },[])
  useEffect(()=>{
  if(winner===yourteam[0].team){
  const pl=pdata.map((i)=>{
    array.map((it)=>{
      if(i.team===it.team && i.name===it.name){
        i.runs+=it.runs;
        i.wickets+=it.wickets;
        i.matches+=1;
      }
    })
    return {...i};
  })
  const cl=cdata.map((i)=>{
    array.map((it)=>{
      if(i.team===it.team && i.name===it.name){
        i.runs+=it.runs;
        i.wickets+=it.wickets;
        i.matches+=1;
      }
    })
    return {...i};
  })
  localStorage.setItem('winarray',JSON.stringify([...wins,{win:winner,player:yourteam[0].team,computer:opposteam[0].team}]))
    localStorage.setItem('players',JSON.stringify(pl));
      localStorage.setItem('computers',JSON.stringify(cl));
   setLoad(false)
  }
 else if(winner===opposteam[0].team){
   const pl=pdata.map((i)=>{
    array.map((it)=>{
      if(i.team===it.team && i.name===it.name){
        i.runs+=it.runs;
        i.wickets+=it.wickets;
        i.matches+=1;
      }
    })
    return {...i};
  })
  const cl=cdata.map((i)=>{
    array.map((it)=>{
      if(i.team===it.team && i.name===it.name){
        i.runs+=it.runs;
        i.wickets+=it.wickets;
        i.matches+=1;
      }
    })
    return {...i};
  })
    localStorage.setItem('players',JSON.stringify(pl));
      localStorage.setItem('computers',JSON.stringify(cl));
      localStorage.setItem('winarray',JSON.stringify([...wins,{win:winner,player:yourteam[0].team,computer:opposteam[0].team}]))
   setLoad(false)
  }
  else{
    const pl=pdata.map((i)=>{
    array.map((it)=>{
      if(i.team===it.team && i.name===it.name){
        i.runs+=it.runs;
        i.wickets+=it.wickets;
        i.matches+=1;
      }
    })
    return {...i};
  })
  const cl=cdata.map((i)=>{
    array.map((it)=>{
      if(i.team===it.team && i.name===it.name){
        i.runs+=it.runs;
        i.wickets+=it.wickets;
        i.matches+=1;
      }
    })
    return {...i};
  })
    localStorage.setItem('players',JSON.stringify(pl));
      localStorage.setItem('computers',JSON.stringify(cl));
      localStorage.setItem('winarray',JSON.stringify([...wins,{win:winner,player:yourteam[0].team,computer:opposteam[0].team}]))
    setLoad(false)
  }
  
  },[])
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
useEffect(()=>{
    const filterruns=array.sort((a,b)=>b.runs-a.runs).filter((i,ind)=>ind<6);
    const filterwickets=array.sort((a,b)=>b.wickets-a.wickets).filter((i,ind)=>ind<6);
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
  setHistruns(histogramRuns);
  setHistwickets(histogramWickets);
},[])
  return (
    <>
{ load==false && <>
    {winner!=='Draw' && 
  <>
  <div className="w-full py-4 flex justify-center">
     <h1 className="text-sm font-extrabold text-yellow-400">Winner</h1> 
    </div>
      <div className="w-full py-4 flex justify-center">
<img src={`Logos/${winner}.webp`} className="w-24 h-24" />
    </div>
    </>
  }
  {
    winner==="Draw" && <>
        <div className="w-full py-20 flex justify-center">
     <h1 className="text-xl font-extrabold text-yellow-400">Draw</h1> 
    </div>
    </>
  }
 <div className="w-full flex justify-center items-center py-12">
     <button className="p-4 rounded-lg text-lg text-slate-400 font-bold bg-slate-800">Match Summary</button>
   </div>
  <div className="w-full flex justify-center items-center">
   <h1 className="text-lg font-bold text-slate-400">Scorecard</h1>
   </div>
   <div className="w-full flex flex-row justify-center gap-4">
     <div className="flex p-4 flex-row gap-4">
       <img src={`Logos/${playerdata[0].team}.webp`} className="w-16 h-16" />
     <div className="flex justify-center items-center text-center"><p className="text-lg font-bold text-slate-400">{playertotal}/{playerwickets}</p></div>
     </div>
          <div className="flex p-4 flex-row gap-4">
     <div className="flex justify-center items-center text-center"><p className="text-lg font-bold text-slate-400">{computertotal}/{computerwickets}</p></div>
     <img src={`Logos/${computerdata[0].team}.webp`} className="w-16 h-16" />
     </div>
   </div>
      <div className="w-full my-4 p-4 flex flex-col gap-y-4 justify-center text-center">
          <h1 className="text-xs font-extrabold text-yellow-400">Man of the Match</h1> 
     <div className="w-full flex justify-center"><img className="w-32 h-32" src={motm[0].image} /></div>
     <h1 className="text-xs font-extrabold text-yellow-400">{motm[0].name}</h1> 
    </div>
     <div className="w-full flex justify-center items-center">
   <h1 className="text-lg font-bold text-slate-400">Performance</h1>
   </div>
   <div className="flex p-4 flex-row justify-center gap-4">
       <img src={`Logos/${playerdata[0].team}.webp`} className="w-16 h-16" />
     <div className="flex justify-center items-center text-center"><p className="text-lg font-bold text-slate-400">{playertotal}/{playerwickets}</p></div>
     </div>
   <div className="w-full flex p-4 flex-wrap flex-row justify-center gap-2">
     {
       playerdata.map((i)=>{
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
       <img src={`Logos/${computerdata[0].team}.webp`} className="w-16 h-16" />
     <div className="flex justify-center items-center text-center"><p className="text-lg font-bold text-slate-400">{computertotal}/{computerwickets}</p></div>
     </div>
   <div className="w-full flex p-4 flex-wrap flex-row justify-center gap-2">
     {
       computerdata.map((i)=>{
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
      array.sort((a,b)=>b.runs-a.runs).map((i,ind)=>{
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
      array.sort((a,b)=>b.wickets-a.wickets).map((i,ind)=>{
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
   <Fire  show={true} />
</>
}
  </>
  );
};


export default Winner;