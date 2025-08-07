import React,{useState,useEffect} from "react";
import {useSearchParams,Link} from "react-router-dom"
import {HashLink} from 'react-router-hash-link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
const Results = () => {
  const [searchParams] = useSearchParams();
  const [items,setItems]=useState([]);
  const [load,setLoad]=useState(true);
  const [loads,setLoads]=useState(false);
  const [length,setLength]=useState(0);
  const [offset,setOffset]=useState(0);
  const teamId = searchParams.get("team"); 
  const teams=["Mi","Csk","Rr","Kkr","Gt","Pbks","Rcb","Lsg","Dc","Srh"];
  const get_Details=async()=>{
    const res=await fetch(`https://intelligent-ailyn-handcricket-e8842259.koyeb.app/results?team=${teamId}&offset=${offset}&limit=5`)
    const data=await res.json();
    setItems([...items,data.data]);
    setLoad(false);
    setLoads(false);
   setLength(data.length)
  }
  const go=()=>{
    setOffset(offset+5);
    setLoads(true)
  }
  useEffect(()=>{
    window.scrollTo({ top: 0, behavior: "smooth" });
  },[])
  useEffect(()=>{
    get_Details();
  },[offset])
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
    load==false && length===0 && <>
      <div className="w-full bg-slate-800 p-1 flex ">
  <img className="w-24 h-24" src={`Logos/${teamId}.webp`} />
</div>
      <div className="flex justify-center items-center py-60">
  <h1 className="text-slate-400 text-base font-bold">No Matches</h1>
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
    <div class="border-t border-gray-700 mt-4 p-2 text-center text-gray-400">
      © 2025 Coder2003Anujyoti All rights reserved.
    </div>

</footer>
  </>
}
{
  load==false && length>0 && <>
   <div className="w-full bg-slate-800 p-1 flex ">
  <img className="w-24 h-24" src={`Logos/${teamId}.webp`} />
</div>
  <div className="w-full flex flex-col justify-center">
     <div className="flex justify-center items-center py-8"><h1 className="text-sm px-3 py-2 bg-slate-800 rounded-lg text-slate-400 font-bold">Matches Results</h1></div>
   <div className="w-full flex flex-row flex-wrap justify-center gap-x-8 gap-y-8">
    {items.map((item,ind)=>{
      return(<>
        {item.map((i)=>{return(<>
  <div className=" w-full flex flex-row justify-center gap-16 p-2 border-b border-b-slate-600"> <img src={`Logos/${teamId}.webp`} className="w-16 h-16"/>
    <div className="flex justify-center items-center"><h1 className="text-base text-yellow-400 font-bold">{i.status}</h1></div>
 <img src={`Logos/${i.name}.webp`} className="w-16 h-16" />
         </div>
        </>)})}
         {ind===items.length-1 && loads==false && offset<length-5 &&
        <div className="w-full flex justify-center">
<button
  onClick={go}
  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800 text-slate-400 text-sm font-bold shadow-md  transition-all duration-300 ease-in-out"
>
  <span>More Matches</span>
  <FontAwesomeIcon icon={faChevronDown} />
</button>
      </div>}
     {loads==true && ind===items.length-1 && <div className="w-full flex items-center justify-center text-center text-slate-400 text-sm font-bold"><p>Loading...</p></div> }
      </>)
    })}
  </div>
  </div>
      <footer className="bg-black mt-8 text-white">
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
    <div class="border-t border-gray-700 mt-4 p-2 text-center text-gray-400">
      © 2025 Coder2003Anujyoti All rights reserved.
    </div>

</footer>
    </>
}

    </>
  );
};


export default Results;

