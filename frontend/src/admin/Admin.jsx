import React,{useState,useEffect} from 'react'
import { FaArrowUp } from "react-icons/fa";
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
    <div className="w-full bg-slate-800 flex p-1 md:hidden ">
    <img className="w-28 h-16" src={`Logos/Logo.webp`} />
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
    </div>
  </nav>
  <div className="w-full overflow-x-auto cursor-pointer">
  <table className="min-w-full table-fixed border-collapse">
    <thead>
      <tr className="bg-emerald-500 text-white">
        <th className="px-6 py-3 text-left text-sm font-semibold w-1/3">Username</th>
        <th className="px-6 py-3 text-left text-sm font-semibold w-1/3">Password</th>
        <th className="px-6 py-3 text-left text-sm font-semibold w-1/3">Role</th>
      </tr>
    </thead>
    <tbody>
      {user.map((user, idx) => (
        <tr key={idx} className={`${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b`}>
          <td className="px-6 py-4 whitespace-nowrap w-1/3 font-semibold">{user.username}</td>

          <td className="px-6 py-4 whitespace-nowrap w-1/3 flex items-center space-x-2 font-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 1110 0v2h1a1 1 0 011 1v7a1 1 0 01-1 1H4a1 1 0 01-1-1v-7a1 1 0 011-1h1zm2-2a3 3 0 116 0v2H7V7z" clipRule="evenodd" />
            </svg>
            <span>{user.password}</span>
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