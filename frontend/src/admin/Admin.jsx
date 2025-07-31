import React,{useState,useEffect} from 'react'
import { FaArrowUp } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faSignOutAlt,
  faBars,
  faTimes,
  faUserShield,
  faHouse,
  faTrophy,
  faRotateRight,
  faGamepad
} from '@fortawesome/free-solid-svg-icons';
import { faLock, faUnlock } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import {HashLink} from 'react-router-hash-link'
const get_data=()=>{
  return sessionStorage.getItem("token")
}
const get_role=()=>{
  return JSON.parse(sessionStorage.getItem("role"))
}
const Admin = () => {
  const token=get_data()
  const role=get_role()
  const [showPassword, setShowPassword] = useState({});
  const [loading,setLoading]=useState(true)
  const [isOpen, setIsOpen] = useState(false);
  const [user,setUser]=useState([])
    const show_data=async(token)=>{
    try{
     const response = await fetch("https://intelligent-ailyn-handcricket-e8842259.koyeb.app/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization:`Bearer ${token}`,
      },
    });
    let data=await response.json()
    if(!data.error){
     setTimeout(()=>{
      setLoading(false)
      setUser(data.user_data)
    },2000)
    }
  }
  catch(err){
    console.log("It is an error-: ",err)
  }
  }
  useEffect(()=>{
    show_data(token)
     window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  },[token])
  const togglePassword = (idx) => {
  setShowPassword((prev) => ({
    ...prev,
    [idx]: !prev[idx],
  }));
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
  
  <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
    <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className="w-8 h-8" />
  </button>

  {/* Mobile Nav Links - Dropdown */}
  {isOpen && (
    <div className="absolute top-full left-0 w-full bg-slate-800 shadow-md backdrop-blur-md px-4 py-2 z-40">
      <div className="flex flex-col space-y-4">
        <Link to="/" className="flex items-center space-x-3 text-white font-medium hover:text-blue-500">
          <FontAwesomeIcon icon={faHouse} className="w-5 h-5 text-blue-500" />
          <span>Home</span>
        </Link>
        <Link to="/admin" className="flex items-center space-x-3 text-white font-medium hover:text-pink-500">
          <FontAwesomeIcon icon={faGamepad} className="w-5 h-5 text-pink-500" />
          <span>About</span>
        </Link>
        {role === "admin" && (
          <Link to="/create" className="flex items-center space-x-3 text-white font-medium hover:text-yellow-500">
            <FontAwesomeIcon icon={faTrophy} className="w-5 h-5 text-yellow-500" />
            <span>Admin</span>
          </Link>
        )}

        <Link to="/adminuser" className="flex items-center space-x-3 text-white font-medium hover:text-green-500">
          <FontAwesomeIcon icon={faUserShield} className="w-5 h-5 text-green-500" />
          <span>User</span>
        </Link>

        <Link to="/login" className="flex items-center space-x-3 text-white font-medium hover:text-red-600">
          <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5 text-red-500" />
          <span>Sign Out</span>
        </Link>
         <button
          onClick={() => window.location.reload()}
          className="flex items-center space-x-3 text-white font-medium hover:text-indigo-600"
        >
          <FontAwesomeIcon icon={faRotateRight} className="w-5 h-5 text-indigo-500" />
          <span>Reload</span>
        </button>
      </div>
    </div>
  )}
</div>

  {/* //* Navbar for big screens */}
     <nav className="bg-slate-800 hidden md:block text-white backdrop-blur-md shadow-md">
    <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
      <div className="flex items-center space-x-2">
        <img
          src="Logos/Logo.webp"
          alt="Logo"
          className="w-20 h-16 md:w-32 md:h-20 lg:w-36 lg:h-24 object-contain"
        />
      </div>
       <div className="hidden md:flex items-center gap-4 space-x-6">
      <Link to="/admin" className="flex items-center space-x-3 text-white font-medium hover:text-blue-500">
      <FontAwesomeIcon icon={faHouse} className="w-5 h-5 text-blue-500" />
      <span>Home</span>
      </Link>
      {role=="admin" && <>
      <Link to="/create"  className="flex items-center space-x-3 text-white font-medium hover:text-yellow-500"
      >
        <FontAwesomeIcon icon={faTrophy} className="w-5 h-5 text-yellow-500" />
        <span>Admin</span>
      </Link>
      </>}
      <Link to="/login" className="flex items-center space-x-3 text-white font-medium hover:text-red-600">
      <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5 text-red-500" />
      <span>Sign Out</span>
      </Link>
      </div>
    </div>
  </nav>
  <div className="w-full overflow-x-auto cursor-pointer">
  <table className="min-w-full table-fixed border-collapse">
    <thead>
      <tr className="bg-emerald-500 text-white">
              <th className="px-6 py-3 text-left text-sm font-semibold w-1/3">Icon</th>
        <th className="px-6 py-3 text-left text-sm font-semibold w-1/3">Username</th>
        <th className="px-6 py-3 text-left text-sm font-semibold w-1/3">Password</th>
        <th className="px-6 py-3 text-left text-sm font-semibold w-1/3">Role</th>
      </tr>
    </thead>
    <tbody>
      {user.map((user, idx) => (
        <tr key={idx} className={`${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b`}>
                <td className="px-6 py-4 whitespace-nowrap w-1/3 font-semibold">
          { user.icon!= "" ?
  <img className="w-8 h-8" src={user.icon} alt="Logo" /> :
  <img className="w-8 h-8" src={`Icons/cricket.webp`} />}
        </td>
          <td className="px-6 py-4 whitespace-nowrap w-1/3 font-semibold">{user.username}</td>

<td className="px-6 py-4 whitespace-nowrap w-1/3 flex items-center space-x-3 font-semibold">
  <FontAwesomeIcon
    icon={showPassword[idx] ? faUnlock : faLock}
    className="text-gray-500 cursor-pointer"
    onClick={() => togglePassword(idx)}
  />
  <span>
    {showPassword[idx]
      ? user.password
      : "*".repeat(user.password.length)}
  </span>
</td>

          <td className="px-6 py-4 whitespace-nowrap w-1/3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              user.role === 'admin' ? 'bg-red-100 text-red-700'
              : user.role === 'user' ? 'bg-blue-100 text-blue-700'
              : 'bg-green-100 text-green-700'
            }`}>
              {user.role[0].toUpperCase()+user.role.slice(1)}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  </>}
  </>
  )
}

export default Admin