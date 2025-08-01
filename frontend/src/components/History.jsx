import React,{useState,useEffect} from "react";
import {useSearchParams,Link} from "react-router-dom"
import {HashLink} from 'react-router-hash-link'
const History = () => {
  const [searchParams] = useSearchParams();
  const [items,setItems]=useState([]);
  const [load,setLoad]=useState(true);
  const teamId = searchParams.get("team"); 
  const teams=["Mi","Csk","Rr","Kkr","Gt","Pbks","Rcb","Lsg","Dc","Srh"];
  const get_Details=async()=>{
    const res=await fetch(`https://intelligent-ailyn-handcricket-e8842259.koyeb.app/details?team=${teamId}`)
    var data=await res.json();
    setItems(data);
    setLoad(false);
  }
  useEffect(()=>{
    window.scrollTo({ top: 0, behavior: "smooth" });
    setLoad(true)
    get_Details();
  },[teamId])
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
  <div className="w-full flex flex-col">
    <div className="w-full py-8 flex-col flex justify-center items-center text-center"><img src={`Logos/${teamId}.webp`} 
    className="w-36 h-36"/>
  <div className="w-full  flex-row flex justify-center"><p className="text-lg text-slate-400 font-bold">{items[0].team}</p></div>
  {items[0].trophies>0 && <div className="w-full  flex-row flex justify-center gap-2 p-2">{new Array(items[0].trophies).fill(1).map((i)=>{
      return(<>
        <img src="Icons/trophy.png" className="w-6 h-6" />
      </>)
    })}
    </div>}
   <div className="border-b border-b-slate-600 w-full border-l-transparent border-r-transparent border-t-transparent py-2 flex-col items-center flex-wrap flex gap-2  justify-center"><p className="text-sm text-slate-400 font-bold">Matches-: {items[0].matches}</p>
   <p className="text-sm text-slate-400 font-bold">Win-: {items[0].win}</p>
      <p className="text-sm text-slate-400 font-bold">Lose-: {items[0].lose}</p>
       <p className="text-sm text-slate-400 font-bold">Tie-: {items[0].matches-(items[0].win+items[0].lose)}</p>
    {items[0].win>0 &&   <p className="text-sm text-slate-400 font-bold">Win-Ratio-: {Math.round((items[0].win/items[0].matches).toFixed(2)*100)}%</p>}
    {items[0].win==0 &&   <p className="text-sm text-slate-400 font-bold">Win-Ratio-: 0%</p>}
   </div>
  <div className="w-full py-2 flex-col flex justify-center border-b border-b-slate-600  border-l-transparent border-r-transparent border-t-transparent items-center text-center">
    <h3 className="text-lg text-slate-400 font-bold">About</h3>
    <div className="w-full py-2 flex-row items-center flex-wrap flex text-center  justify-center"> <p className="ml-2 mr-2 text-xs text-slate-400 font-bold">{items[0].about}</p></div>
  </div>
    <div className="w-full  py-2 my-4 flex-col flex justify-center  items-center text-center p-2 gap-2">
    <h3 className="text-lg text-slate-400 font-bold">Gallery</h3>
    <div className="w-full  flex flex-wrap gap-x-6 gap-y-4 items-center justify-center  p-4 lex-row ">
  {new Array(4).fill("").map((i,ind)=>{
  return(
  <div className="text-center rounded-lg  bg-slate-800 transition duration-300 ease-in-out transform hover:bg-slate-800  hover:scale-105">
    <img src={`${teamId}/${teamId.toUpperCase()}${ind+1}.jpg`} className="w-36 h-24 rounded-md shadow-slate-800"></img>
    </div>
    )
  })}
</div>
    </div>
    <div className="w-full py-2 flex-col flex justify-center items-center  text-center">
    <div className="w-full py-4 flex-col items-center flex-wrap flex  justify-center"> <a href={items[0].site} target="_blank"><button className="text-sm text-white font-extrabold p-4 bg-orange-600 rounded-bl-lg rounded-tl-lg rounded-tr-lg ">Official Site
    </button></a></div>
  </div>
  
        </div>
        </div>
            <footer className="bg-black text-white">
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
  );
};


export default History;
