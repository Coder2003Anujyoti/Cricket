import React,{useState,useEffect} from "react";
import {HashLink} from 'react-router-hash-link'
import {useSearchParams,Link} from "react-router-dom"
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement, ChartDataLabels);
const Card = () => {
  const [searchParams] = useSearchParams();
  const [load,setLoad]=useState(true);
  const [items,setItems]=useState([]);
  const [bar,setBar]=useState({});
  const [pie,setPie]=useState({});
  const teamId = searchParams.get("team"); 
  const team = searchParams.get("name");
  const teams=["Mi","Csk","Rr","Kkr","Gt","Pbks","Rcb","Lsg","Dc","Srh"];
const barChartOptions = {
  plugins: {
    legend: {
      labels: {
        color: "rgb(148, 163, 184)", // Legend text color
        font: {
          weight: "bold", // Make legend text bold
        },
      },
    },
    datalabels: {
      formatter: (value, context) => {
        const data = context.dataset.data;
        if (!data || data.length === 0) return "0%"; // Prevent errors

        const total = data.reduce((acc, val) => acc + (val || 0), 0); // Handle undefined values
        if (total === 0) return "0%"; // Prevent division by zero

        const percentage = Math.round(((value / total) * 100).toFixed(1)) + "%";
        return percentage;
      },
      color: "transparent",
      font: { weight: "bold", size: 14 },
    },
  },
  scales: {
    x: {
      ticks: {
        color: "rgb(148, 163, 184)", // X-axis label color
        font: {
          weight: "bold", // Make X-axis labels bold
        },
      },
      grid: {
        color: "rgb(148, 163, 184)", // X-axis grid lines color
                font: {
          weight: "bold", // Make Y-axis labels bold
        },
      },
    },
    y: {
      ticks: {
        color: "rgb(148, 163, 184)", // Y-axis label color
        font: {
          weight: "bold", // Make Y-axis labels bold
        },
      },
      grid: {
        color: "rgb(148, 163, 184)", // Y-axis grid lines color
        font: {
          weight: "bold", // Make Y-axis labels bold
        },
      },
    },
  },
};
const pieChartOptions = {
  plugins: {
    legend: {
      labels: {
        color: "rgb(148,163,184)",
        font: { weight: "bold" },
      },
    },
    datalabels: {
      formatter: (value, context) => {
        const data = context.dataset.data;
        if (!data || data.length === 0) return "0%"; // Prevent errors

        const total = data.reduce((acc, val) => acc + (val || 0), 0); // Handle undefined values
        if (total === 0) return "0%"; // Prevent division by zero

        const percentage = Math.round(((value / total) * 100).toFixed(1)) + "%";
        return percentage;
      },
      color: "white",
      font: { weight: "bold", size: 14 },
    },
  },
};
  const get_Player=async()=>{
    const res=await fetch(`https://intelligent-ailyn-handcricket-e8842259.koyeb.app/names?team=${team}`)
    const data=await res.json();
    const barChartData = {
    labels: ["Matches", "Runs", "Wickets"],
    datasets: [
      {
        label: `Stats for ${data[0].name}`,
        data: [data[0].matches,data[0].runs, data[0].wickets],
        backgroundColor: ["#10b981", "Dodgerblue", "#ef4444"],
      },
    ],
  };

  const pieChartData = {
    labels: ["Runs", "Wickets"],
    datasets: [
      {
        data: [data[0].runs, data[0].wickets],
        backgroundColor: ["Dodgerblue", "#ef4444"],
        borderWidth: 0,
      },
    ],
  };
    setLoad(false);
    setItems(data);
    setBar(barChartData)
  setPie(pieChartData)
  }
  useEffect(()=>{
    get_Player();
  },[])
  useEffect(()=>{
    window.scrollTo({ top: 0, behavior: "smooth" });
  },[])
  return (
    <>
{
  load==true && <>
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
  </>
}
{
  load==false &&
  <>
   <div className="w-full bg-slate-800 p-1 flex md:hidden">
  <img className="w-24 h-24" src={`Logos/${teamId}.webp`} />
</div>
 <nav className="bg-slate-800 hidden md:block text-white backdrop-blur-md shadow-md">
  <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
    <div className="flex items-center space-x-2">
      <img
         src={`Logos/${teamId}.webp`}
        alt="Logo"
        className="w-20 h-16 md:w-36 md:h-28 lg:w-40 lg:h-32 object-contain"
      />
    </div>
  </div>
</nav>
  <div className="w-full flex flex-col justify-center items-center gap-y-4 lg:hidden">
  <div className="w-full flex flex-row justify-center items-center">
  <div className="flex justify-center items-center my-2">
    <img src={items[0].image} className="w-64 h-64" />
    </div>
    </div>
      <div className="w-full  flex flex-col flex-wrap justify-center items-center">
      <div className="text-center flex flex-row justify-center items-center">
   {items[0].captain==false && <h1 className="text-lg font-bold text-slate-400">Name-: {items[0].name} </h1>}
      {items[0].captain==true && <h1 className="text-lg font-bold text-slate-400">Name-: {items[0].name} (C)</h1>}
  </div>
        <div className="text-center flex flex-row justify-center items-center">
   <h1 className="text-lg font-bold text-slate-400">Role-: {items[0].role}</h1>
  </div>
          <div className="text-center flex flex-row justify-center items-center">
   <h1 className="text-lg font-bold text-slate-400">Matches-: {items[0].matches}</h1>
  </div>
  <div className="text-center flex flex-row justify-center items-center">
   <h1 className="text-lg font-bold text-slate-400">Runs-: {items[0].runs}</h1>
  </div>
        <div className="text-center flex flex-row justify-center items-center">
   <h1 className="text-lg font-bold text-slate-400">Wickets-: {items[0].wickets}</h1>
  </div>
  </div>
  <div className="text-center flex flex-row justify-center items-center">
  <img className="w-24 h-24" src={`Logos/${teamId}.webp`} />
  </div>
  </div>
       <div className="w-full flex items-center justify-center my-4 lg:hidden">
  <div className="w-full max-w-md text-black font-bold p-4 rounded flex items-center justify-center">
    <Bar data={bar} options={barChartOptions} />
  </div>
</div>
<div className="w-full my-12 hidden lg:flex flex-row justify-center items-center gap-6 p-6 rounded-2xl ">
  {/* 🖼️ Player Image */}
  <div className="w-1/3 flex justify-center">
    <img
      src={items[0].image}
      alt="Player"
      className="w-80 h-80 object-contain"
    />
  </div>

  {/* 🧾 Player Info + Logo */}
  <div className="w-1/3 flex flex-col justify-center items-center gap-6 text-slate-200">
    {/* Text Section */}
    <div className="flex flex-col justify-center items-start gap-2 bg-slate-800 w-full p-4 rounded-xl">
      <h1 className="text-2xl font-bold tracking-wide">
        Name: {items[0].name} {items[0].captain ? "(C)" : ""}
      </h1>
      <p className="text-lg font-bold">Role: {items[0].role}</p>
      <p className="text-lg font-bold">Matches: {items[0].matches}</p>
      <p className="text-lg font-bold">Runs: {items[0].runs}</p>
      <p className="text-lg font-bold">Wickets: {items[0].wickets}</p>
    </div>

    {/* Logo */}
    <div className="mt-2">
      <img
        src={`Logos/${teamId}.webp`}
        alt="Team Logo"
        className="w-28 h-28 object-contain"
      />
    </div>
  </div>

  {/* 📊 Bar Chart */}
  <div className="w-1/3 h-[300px] rounded-xl p-4">
    <Bar data={bar} options={barChartOptions} />
  </div>
</div>

              <footer className="bg-black text-white lg:hidden">
      <div className="w-full flex justify-center  text-center flex-col p-4 mt-4">
        <h2 className="text-xl font-semibold">Quick Links</h2>
        <ul className="mt-4 flex flex-row flex-wrap justify-center gap-x-12">
    <HashLink smooth to='/#about'> <li className="text-gray-400">
       About Us</li></HashLink>
     <HashLink smooth to='/#services'> <li className="text-gray-400">Services</li></HashLink>
     <HashLink smooth to='/#gallery'><li className="text-gray-400">Gallery</li></HashLink>
        </ul>
     </div>
      <div className="w-full flex justify-center  text-center flex-col mt-4">
        <h2 className="text-xl font-semibold">Teams</h2>
        <ul className="mt-4 flex flex-row flex-wrap justify-center gap-x-6 gap-y-4">
        {teams.map((i)=>{
          return(<>
         <HashLink smooth to={`/history?team=${i}`}><li><img className="w-12 h-12" src={`Logos/${i}.webp`}/></li></HashLink>
          </>)
        })}
        </ul>
      </div>
              <div className="w-full flex justify-center gap-y-2  text-center flex-col p-4 mt-4">
    <h2 className="text-xl font-semibold">Sponsors</h2>
    <div className="mt-4 flex flex-row flex-wrap justify-center gap-x-6 gap-y-4 ">
  {new Array(4).fill("").map((i,ind)=>{
  return(
  <div className="text-center">
    <img src={`sponsor/sponsor${ind+1}.png`} className="w-22 h-12"></img>
    </div>
    )
  })}
</div>
    </div>
    <div class="border-t border-gray-700 mt-4 p-2 text-center text-gray-400">
      © 2025 Coder2003Anujyoti All rights reserved.
    </div>

</footer>
  </>
}
</>
  )
};

export default Card;
