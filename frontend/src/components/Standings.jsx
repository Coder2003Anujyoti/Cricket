import React,{useState,useEffect} from "react";
import {useSearchParams,Link} from "react-router-dom"
import {HashLink} from 'react-router-hash-link'
const Standings = () => {
  const [searchParams] = useSearchParams();
  const [items,setItems]=useState([]);
  const [load,setLoad]=useState(true);
  const teamId = searchParams.get("team");
  //console.log(teamId) 
  const teams=["Mi","Csk","Rr","Kkr","Gt","Pbks","Rcb","Lsg","Dc","Srh"];
  const get_Details=async()=>{
    const res=await fetch(`https://intelligent-ailyn-handcricket-e8842259.koyeb.app/standings`)
    const data=await res.json();
    setItems(data);
    setLoad(false);
  }
  useEffect(()=>{
    window.scrollTo({ top: 0, behavior: "smooth" });
  },[])
  useEffect(()=>{
    get_Details();
  },[])
  return (
    <>
{
  load==true && <>
    <div className="w-full flex flex-col items-center justify-center py-40">
    <img src="Logos/Logo.webp" className="w-30 h-24" />
   <div className="w-full flex justify-center gap-y-2  text-center flex-col p-4 mt-4">

    <div className="mt-4 flex flex-row flex-wrap justify-center gap-x-12 gap-y-12 ">
  {new Array(4).fill("").map((i,ind)=>{
  return(
  <div className="text-center">
    <img src={`sponsor/sponsor${ind+1}.png`} className="w-22 h-14"></img>
    </div>
    )
  })}
</div>
    </div>
    </div>
  </>
}
{
  load===false && <>
          <div className="w-full bg-slate-800 p-1 flex ">
  <img className="w-24 h-24" src={`Logos/${teamId}.webp`} />
</div>
 <div className="max-w-2xl mx-auto p-4 bg-gray-900 text-white">
      <h2 className="text-center text-2xl font-bold mb-4">Points Table</h2>
      
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-600 text-gray-400">
            <th className="p-2 text-left">#</th>
            <th className="p-2 text-left">Team</th>
            <th className="p-2">M</th>
            <th className="p-2">W</th>
            <th className="p-2">L</th>
            
            <th className="p-2">Pts</th>
          </tr>
        </thead>
        <tbody>
          {items.sort((a,b)=>b.win-a.win).map((team, index) => (
            <tr key={team.id} className="border-b border-gray-700 text-center font-bold">
              <td className="p-2">{index + 1}</td>
              <td className="p-2 flex items-center font-bold">
                <img src={`Logos/${team.teamid}.webp`} alt={team.teamid} className="w-6 h-6 mr-2" />
                {team.teamid.toUpperCase()}
              </td>
              <td className="p-2">{team.matches}</td>
              <td className="p-2">{team.win}</td>
              <td className="p-2">{team.lose}</td>
              
        <td className="p-2">{2*(team.win) +1*(team.matches-(team.win+team.lose))}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
        <footer className="bg-black mt-4 text-white">
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
         <Link to={`/history?team=${i}`}><li><img className="w-12 h-12" src={`Logos/${i}.webp`}/></li></Link>
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
    <div className="border-t border-gray-700 mt-4 p-2 text-center text-gray-400">
      © 2025 Coder2003Anujyoti All rights reserved.
    </div>

</footer>
  </>
}
    </>
  );
};


export default Standings;


