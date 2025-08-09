import React,{useState,useEffect} from "react";
import {HashLink} from 'react-router-hash-link'
import { FaArrowUp } from "react-icons/fa";
import {useSearchParams,Link} from "react-router-dom"
const Players = () => {
  const [searchParams] = useSearchParams();
  const [load,setLoad]=useState(true);
  const [items,setItems]=useState([]);
  const teamId = searchParams.get("team"); 
  const teams=["Mi","Csk","Rr","Kkr","Gt","Pbks","Rcb","Lsg","Dc","Srh"];
  const get_Players=async()=>{
    const res=await fetch(`https://intelligent-ailyn-handcricket-e8842259.koyeb.app/players?team=${teamId}`)
    const data=await res.json();
    setItems(data);
    setLoad(false);
  }
  useEffect(()=>{
    window.scrollTo({ top: 0, behavior: "smooth" });
  },[])
  useEffect(()=>{
    get_Players();
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
{load==false && <>
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
  <div className="flex justify-center items-center py-4">
  <h1 className="text-slate-400 text-base font-bold">Batters</h1>
  </div>
  <div className="w-full flex p-2 flex-wrap flex-row justify-center  gap-1 md:gap-6">
    {items.map((i)=>{
    if(i.role=="Batsman" || i.role=="Wicket-Keeper")
      return(<>
    <Link to={`/profile?name=${i.name}&team=${i.team}`}>
        <div className="p-1 flex flex-col gap-1 rounded-lg bg-slate-800 text-center md:text-base justify-center items-center transition duration-300 ease-in-out transform hover:bg-slate-800  hover:scale-105">
    <div className="flex justify-center items-center"> <img className="w-24 h-24 md:w-36 md:h-36"src={i.image} /></div>
   <div className="flex flex-col text-center my-2 md:text-base">
   {i.captain===false &&  <p className="text-sm font-bold text-slate-400 md:text-base">{i.name}</p>}
    {i.captain===true &&
      <p className="text-sm font-bold text-slate-400 md:text-base">{i.name} (C)</p>
    }
  </div>
        </div>
      </Link>
      </>)
    })}
  </div>
    <div className="flex justify-center items-center py-4">
  <h1 className="text-slate-400 text-base font-bold">All-Rounders</h1>
  </div>
  <div className="w-full flex p-2 flex-wrap flex-row justify-center  gap-1 md:gap-6">
    {items.map((i)=>{
    if(i.role=="All-rounder")
      return(<>
     <Link to={`/profile?name=${i.name}&team=${i.team}`}>
        <div className="p-1 flex flex-col gap-1 rounded-lg bg-slate-800 text-center justify-center items-center transition duration-300 ease-in-out transform hover:bg-slate-800  hover:scale-105">
     <div className="flex justify-center items-center"> <img className="w-24 h-24 md:w-36 md:h-36"src={i.image} /></div>
   <div className="flex flex-col text-center my-2">
   {i.captain===false &&  <p className="text-sm font-bold text-slate-400 md:text-base">{i.name}</p>}
    {i.captain===true &&
      <p className="text-sm font-bold text-slate-400 md:text-base">{i.name} (C)</p>
    }
        </div>
        </div>
        </Link>
      </>)
    })}
  </div>
    <div className="flex justify-center items-center py-4">
  <h1 className="text-slate-400 text-base font-bold">Bowlers</h1>
  </div>
  <div className="w-full flex p-2 flex-wrap flex-row justify-center  gap-1 md:gap-6">
    {items.map((i)=>{
    if(i.role=="Bowler")
      return(<>
   <Link to={`/profile?name=${i.name}&team=${i.team}`}>
        <div className="p-1 flex flex-col gap-1 rounded-lg bg-slate-800 text-center justify-center items-center transition duration-300 ease-in-out transform hover:bg-slate-800  hover:scale-105">
     <div className="flex justify-center items-center"> <img className="w-24 h-24 md:w-36 md:h-36"src={i.image} /></div>
   <div className="flex flex-col text-center my-2">
   {i.captain===false &&  <p className="text-sm font-bold text-slate-400 md:text-base">{i.name}</p>}
    {i.captain===true &&
      <p className="text-sm font-bold text-slate-400 md:text-base">{i.name} (C)</p>
    }

        </div>
        </div>
        </Link>
      </>)
    })}
  </div>
      <footer className="bg-black mt-4 text-white md:hidden">
      <div className="w-full flex justify-center  text-center flex-col p-4 mt-4">
        <h2 className="text-xl font-semibold">Quick Links</h2>
        <ul className="mt-4 flex flex-row flex-wrap justify-center gap-x-12">
    <HashLink smooth to='/#about'> <li className="text-gray-400">
       About Us</li></HashLink>
     <HashLink smooth to='/#services'> <li className="text-gray-400">Services</li></HashLink>
     <HashLink smooth to='/#gallery'><li className="text-gray-400">Gallery</li></HashLink>
        </ul>
     </div>
      <div className="w-full flex justify-center  text-center flex-col  mt-4">
        <h2 className="text-xl font-semibold">Teams</h2>
        <ul className="mt-4 flex flex-row flex-wrap justify-center gap-x-4 gap-y-4">
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
    <div class="border-t border-gray-700 mt-4 p-2 text-center text-gray-400">
      © 2025 Coder2003Anujyoti All rights reserved.
    </div>

</footer>
{/* //* Footer for big screen */}
 <footer className="bg-black text-white pt-1 hidden md:block">
      <div className="w-full flex justify-center  text-center flex-col p-4 mt-4">
        <h2 className="text-xl font-semibold">Quick Links</h2>
        <ul className="mt-4 flex flex-row flex-wrap justify-center gap-x-12">
    <HashLink smooth to='#abouts'> <li className="text-gray-400">
       About Us</li></HashLink>
     <HashLink smooth to='#servicess'> <li className="text-gray-400">Services</li></HashLink>
     <HashLink smooth to='#gallerys'><li className="text-gray-400">Gallery</li></HashLink>
        </ul>
     </div>
      <div className="w-full flex justify-center  text-center flex-col mt-4">
        <h2 className="text-xl font-semibold">Teams</h2>
        <ul className="mt-4 flex flex-row flex-wrap justify-center gap-x-6 gap-y-4 ml-2 mr-2">
        {teams.map((i)=>{
          return(<>
         <Link to={`/history?team=${i}`}><li><img className="w-16 h-16" src={`Logos/${i}.webp`}/></li></Link>
          </>)
        })}
        </ul>
      </div>
            <div className="w-full flex justify-center gap-y-2  text-center flex-col p-4 mt-4">
    <h2 className="text-xl font-semibold">Sponsors</h2>
    <div className="mt-4 flex flex-row flex-wrap justify-center gap-x-10 gap-y-4 ">
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
     <button
  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
  className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-slate-600 text-white p-2 sm:p-3 rounded-full shadow-md sm:shadow-lg  transition-all duration-300 z-50"
  aria-label="Scroll to top"
>
  <FaArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
</button>
</footer>
</>}
    </>
  );
};


export default Players;
