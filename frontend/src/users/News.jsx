import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaBroadcastTower } from "react-icons/fa"; // FontAwesome
import { faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import {
  faMagnifyingGlass,
  faSignOutAlt,
  faBars,
  faTimes,
  faUserShield,
  faHouse,
  faTrophy,
  faNewspaper,
  faGamepad,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { HashLink } from 'react-router-hash-link';

const get_data = () => sessionStorage.getItem("token");
const get_role = () => JSON.parse(sessionStorage.getItem("username"));
const News = () => {
const token = get_data();
  const role = get_role();
const [selectedTeams, setSelectedTeams] = useState([]);
  const [searchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("news");
  const [items, setItems] = useState([]);
  const [news,setNews]=useState([])
  const [newslen,setNewslen]=useState(-1)
  const [postslen,setPostslen]=useState(-1)
  const [postOffset, setPostOffset] = useState(0);
const [postLimit, setPostLimit] = useState(5);
const [newsOffset, setNewsOffset] = useState(0);
const [newsLimit, setNewsLimit] = useState(5);

const [postLoad, setPostLoad] = useState(false);
const [newsLoad, setNewsLoad] = useState(false);
  const teams = ["Mi", "Csk", "Rr", "Kkr", "Gt", "Pbks", "Rcb", "Lsg", "Dc", "Srh"];

  const handleSelect = (team) => {
    if (selectedTeams.includes(team)) {
      setSelectedTeams(selectedTeams.filter((t) => t !== team));
    } else {
      setSelectedTeams([...selectedTeams, team]);
    }
  };
const show_data = async () => {
    try {
      const response = await fetch(`https://intelligent-ailyn-handcricket-e8842259.koyeb.app/getnews`);
      let data = await response.json();
      if (!data.error) {
        setTimeout(() => {
          setLoading(false);
          setItems(data.news_data);
          setNews(data.posts_data)
          setPostslen(data.posts_count)
          setNewslen(data.news_count)
          setNewsOffset(newsOffset+5)
          setPostOffset(postOffset+5)
          setNewsLoad(false)
          setPostLoad(false)
        }, 2000);
      }
    } catch (err) {
      console.log("It is an error: ", err);
    }
  };
  const show_news = async () => {
    try {
      const response = await fetch(`https://intelligent-ailyn-handcricket-e8842259.koyeb.app/getnewsbynews?offset=${newsOffset}&&limit=${newsLimit}`);
      let data = await response.json();
      if (!data.error) {
        setTimeout(() => {
          setLoading(false);
          setItems([...items,...data.news_data]);
          setNewslen(data.news_count)
          setNewsOffset(newsOffset+5)
          setNewsLoad(false)
        }, 2000);
      }
    } catch (err) {
      console.log("It is an error: ", err);
    }
  };
  useEffect(()=>{
    if(newsLoad==true){
      show_news()
    }
  },[newsLoad])
const newsgo=()=>{
  setNewsLoad(true)
}
const show_posts = async () => {
    try {
      const response = await fetch(`https://intelligent-ailyn-handcricket-e8842259.koyeb.app/getnewsbyposts?offset=${postOffset}&&limit=${postLimit}`);
      let data = await response.json();
      if (!data.error) {
        setTimeout(() => {
          setLoading(false);
          setNews([...news,...data.posts_data]);
          setPostslen(data.posts_count)
          setPostOffset(postOffset+5)
          setPostLoad(false)
        }, 2000);
      }
    } catch (err) {
      console.log("It is an error: ", err);
    }
  };
  useEffect(()=>{
    if(postLoad==true){
      show_posts()
    }
  },[postLoad])
const postsgo=()=>{
  setPostLoad(true)
}
  useEffect(() => {
    show_data();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [token]);
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
  {
  loading==false && <>
  {/* //& Navbar for mobile */}
    <div className="relative w-full bg-slate-800 flex items-center justify-between p-2 lg:hidden z-50 md:px-4 md:py-3">
  <img className="w-28 h-16" src={`Logos/Logo.webp`} alt="Logo" />
    <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
    <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className="w-8 h-8" />
  </button>

  {/* Mobile Nav Links - Dropdown */}
  {isOpen && (
    <div className="absolute top-full left-0 w-full bg-slate-800 shadow-md backdrop-blur-md px-4 py-2 z-40">
      <div className="flex flex-col space-y-4">
              <Link to="/" className="flex items-center space-x-3 text-white font-medium hover:text-indigo-500">
          <FontAwesomeIcon icon={faHouse} className="w-5 h-5 text-indigo-500" />
          <span>Home</span>
        </Link>
          <Link to="/useruser" className="flex items-center space-x-3 text-white font-medium hover:text-pink-500 md:hidden">
          <FontAwesomeIcon icon={faGamepad} className="w-5 h-5 text-pink-500" />
          <span>About</span>
        </Link>
      <Link to="/playersearch" className="flex items-center space-x-3 text-white font-medium hover:text-green-500">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="w-5 h-5 text-green-500" />
          <span>Search</span>
        </Link>
         
          <Link to="/news" className="flex items-center space-x-3 text-white font-medium hover:text-yellow-500">
          <FontAwesomeIcon icon={faNewspaper} className="w-5 h-5 text-yellow-500" />
          <span>News</span>
        </Link>     
         <Link to="/loginprofile" className="hidden items-center space-x-3 text-white font-medium hover:text-pink-500 md:flex">
                      <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-pink-500" />
                      <span>Profile</span>
                    </Link>
        <Link to="/login" className="flex items-center space-x-3 text-white font-medium hover:text-red-600">
          <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5 text-red-500" />
          <span>Sign Out</span>
        </Link>
        <button
  onClick={() => window.location.reload()}
  className="flex items-center space-x-3 text-white font-medium hover:text-sky-600"
>
  <FontAwesomeIcon icon={faRotateRight} className="w-5 h-5 text-sky-500" />
  <span>Reload</span>
</button>

      </div>
    </div>
  )}
</div>
<nav className="bg-slate-800 hidden lg:block text-white backdrop-blur-md shadow-md">
  <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
    <div className="flex items-center space-x-2">
      <img
        src="Logos/Logo.webp"
        alt="Logo"
        className="w-20 h-16 md:w-32 md:h-20 lg:w-36 lg:h-24 object-contain"
      />
    </div>
     <div className="hidden lg:flex items-center gap-4 space-x-6">
       <Link to="/" className="flex items-center space-x-3 text-white font-medium hover:text-indigo-500">
          <FontAwesomeIcon icon={faHouse} className="w-5 h-5 text-indigo-500" />
          <span>Home</span>
        </Link>
      { JSON.parse(sessionStorage.getItem("role"))=="user" && <> <Link to="/playersearch" className="flex items-center space-x-3 text-white font-medium hover:text-green-500">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="w-5 h-5 text-green-500" />
          <span>Search</span>
        </Link></>}
          { JSON.parse(sessionStorage.getItem("role"))=="user" && <> <Link to="/news" className="flex items-center space-x-3 text-white font-medium hover:text-yellow-500">
          <FontAwesomeIcon icon={faNewspaper} className="w-5 h-5 text-yellow-500" />
          <span>News</span>
        </Link> </>  } 
        { JSON.parse(sessionStorage.getItem("role"))=="admin" && <>
         <Link to="/admin" className="flex items-center space-x-3 text-white font-medium hover:text-pink-500">
          <FontAwesomeIcon icon={faGamepad} className="w-5 h-5 text-pink-500" />
          <span>About</span>
        </Link>
        </>}
         { JSON.parse(sessionStorage.getItem("role")) === "admin" && (
          <Link to="/create" className="flex items-center space-x-3 text-white font-medium hover:text-yellow-500">
            <FontAwesomeIcon icon={faTrophy} className="w-5 h-5 text-yellow-500" />
            <span>Admin</span>
          </Link>
        )}
        <Link to="/loginprofile" className="hidden items-center space-x-3 text-white font-medium hover:text-pink-500 md:flex">
                     <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-pink-500" />
                     <span>Profile</span>
                   </Link>
        <Link to="/login" className="flex items-center space-x-3 text-white font-medium hover:text-red-600">
          <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5 text-red-500" />
          <span>Sign Out</span>
        </Link>
         <button
  onClick={() => window.location.reload()}
  className="flex items-center space-x-3 text-white font-medium hover:text-sky-600"
>
  <FontAwesomeIcon icon={faRotateRight} className="w-5 h-5 text-sky-500" />
  <span>Reload</span>
</button>
      </div>
  </div>
</nav>
  <div className="flex justify-evenly mt-4">
  <button
    onClick={() => setMode("news")}
    className={`px-4 py-2 font-bold ${mode === "news" ? 'border-b border-b-white text-white' : 'text-white border-b border-b-transparent'}`}
  >
    News
  </button>
  <button
    onClick={() => setMode("announcements")}
    className={`px-4 py-2 font-bold  ${mode === "announcements" ? 'border-b border-b-white text-white' : 'text-white border-b border-b-transparent'}`}
  >
  Announcements
  </button>
  </div>
{ mode=="news" && <>
{
  items.length>0 && <>
  <div className="overflow-x-auto scroll-smooth px-3 py-4 my-4 lg:flex lg:justify-center lg:items-center lg:py-6">
<div className="flex gap-4 w-max md:justify-center md:items-center lg:gap-10">
{teams.map((team) => (
<div key={team} onClick={() => handleSelect(team)} className="relative cursor-pointer">
<img src={`Logos/${team}.webp`} className="w-16 h-16 p-2 rounded-full border border-slate-800 lg:w-24 lg:h-24" />
{selectedTeams.includes(team) && (
<FontAwesomeIcon icon={faCheckCircle} className="absolute top-0 right-0 text-green-500 bg-white rounded-full" size="lg"/>)}
</div>))}</div></div>
  </>
}
  <h1 className="text-green-400 text-lg font-bold shadow-green-400 text-center my-4">Tournament News</h1>
{
  items.length==0 && <>
  <h1 className="font-bold text-white text-center my-48">No News Found</h1>
  </>
}
{
  items.length>0 && <>
  <div className="flex flex-col ml-2 mr-2 gap-4 my-4 md:my-6 lg:px-20 lg:ml-16 md:ml-6 md:justify-center md:gap-8 md:items-center lg:gap-10 lg:items-start lg:justify-start lg:flex-row lg:flex-wrap">
 {items.map((i)=>{
 if(selectedTeams.length === 0 || selectedTeams.includes(i.playerteam) || selectedTeams.includes(i.computerteam)){
    return(<>
    <div className="w-full bg-slate-800 flex flex-row rounded-md flex-wrap lg:w-96 lg:h-48 md:w-96 md:h-48 md:p-2">
   <div className="w-1/2 flex flex-col justify-center items-center">
  <div className="flex flex-row gap-2">
<img src={`Logos/${i.playerteam}.webp`} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-contain" />
<h1 className="text-lg sm:text-xl font-bold text-white my-4">v/s</h1>
<img src={`Logos/${i.computerteam}.webp`} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-contain" />
  </div>
<div className="w-full flex flex-row flex-wrap justify-center items-center mt-2">
<h1 className="text-white text-center font-bold text-sm ml-2 mr-2">{i.content}</h1>
</div>
   </div>
  <div className="w-1/2 flex justify-center items-center">
  <img src={i.image} className="w-auto h-auto" />
  </div>
    </div>
    </>)
    }
    else{
      return null
    }
  })}
  </div>
  </>
}
 {
  newsOffset<newslen && selectedTeams.length==0 && <>
        {
          newsLoad==false && <>
      <div className="w-full flex justify-center">
<button
  onClick={newsgo}
  className="flex items-center my-4 gap-2 px-5 py-2.5 rounded-lg bg-slate-800 text-slate-400 text-sm font-bold shadow-md transition-all duration-300 ease-in-out"
>
  <span>More News</span>
  <FontAwesomeIcon icon={faChevronDown} />
</button>
      </div>
          </>
        }
        {
          newsLoad==true && <>
          <div className="w-full flex items-center justify-center text-center text-slate-400 text-sm font-bold my-4"><p>Loading...</p></div>
          </>
        }
        </>
      }
</>
}
{
  mode=="announcements" && <>
  <h1 className="text-green-400 text-lg font-bold shadow-green-400 text-center my-4">Announcements</h1>
  {
  news.length==0 && <>
  <h1 className="font-bold text-white text-center my-48">No Announcements Found</h1>
  </>
}
{
  news.length>0 && <>
  <div className="flex flex-col ml-2 mr-2 gap-4 my-4 lg:px-20 md:justify-center md:items-center md:py-3 lg:ml-16 lg:gap-10 lg:items-start lg:justify-start lg:flex-row lg:flex-wrap ">
 {news.map((i)=>{
    return(<>
    <div className="w-full bg-slate-800 flex flex-col rounded-md flex-wrap lg:w-96 lg:h-90 md:w-96 md:h-84">
  <div className="w-full flex justify-start items-start p-3">
  <img src={`Logos/Logo.webp`} className="w-16 h-8" />
  </div>
<div className="w-full flex flex-col space-y-4">
<div className="w-full h-full flex flex-row flex-wrap justify-start items-start">
<h1 className="text-white font-bold text-sm ml-2 mr-2 mt-2">{i.content}</h1>
</div>
  <div className="w-full">
  <img src={`Screen/Main.webp`} className="w-auto h-auto rounded-b-md" />
  </div>
</div>
    </div>
    </>)
  })}
  </div>
  </>
  }
   {
  postOffset<postslen && <>
        {
          postLoad==false && <>
      <div className="w-full flex justify-center">
<button
  onClick={postsgo}
  className="flex items-center my-4 gap-2 px-5 py-2.5 rounded-lg bg-slate-800 text-slate-400 text-sm font-bold shadow-md transition-all duration-300 ease-in-out"
>
  <span>More Announcements</span>
  <FontAwesomeIcon icon={faChevronDown} />
</button>
      </div>
          </>
        }
        {
          postLoad==true && <>
          <div className="w-full flex items-center justify-center text-center text-slate-400 text-sm font-bold my-4"><p>Loading...</p></div>
          </>
        }
        </>
      }
  </>
}
</>
}
 </>
  );
};

export default News;
