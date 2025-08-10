import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaMedal, FaTrophy, FaStar } from "react-icons/fa";
import {
  faMagnifyingGlass,
  faSignOutAlt,
  faBars,
  faTimes,
  faUserShield,
  faHouse,
  faTrophy,
  faMedal
} from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import { HashLink } from 'react-router-hash-link';

const get_data = () => {
  return sessionStorage.getItem("token")
}
const get_role = () => {
  return JSON.parse(sessionStorage.getItem("username"))
}

const AllLeaderBoard = () => {
  const token = get_data()
  const role = get_role()
  const [searchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])

  const show_data = async () => {
    try {
      const response = await fetch(`https://intelligent-ailyn-handcricket-e8842259.koyeb.app/allusers`);
      let data = await response.json();
      if (!data.error) {
        setTimeout(() => {
          setLoading(false)
          setItems(data.user_data)
        }, 2000)
      }
    }
    catch (err) {
      console.log("It is an error-: ", err)
    }
  }

  useEffect(() => {
    show_data()
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [token])

  return (
    <>
      {loading === true && <>
        <div className="w-full flex flex-col items-center justify-center py-40 md:py-48">
          <img src="Logos/Logo.webp" className="w-30 h-24 md:w-60 md:h-32" />
          <div className="w-full flex justify-center gap-y-2  text-center flex-col p-4 mt-4">
            <div className="mt-4 flex flex-row flex-wrap justify-center gap-x-12 gap-y-12 ">
              {new Array(4).fill("").map((i, ind) => {
                return (
                  <div className="text-center" key={ind}>
                    <img src={`sponsor/sponsor${ind + 1}.png`} className="w-22 h-14 md:w-20 md:h-16"></img>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </>}
      {loading === false && <>
        {/* // Navbar for mobile */}
        <div className="relative w-full bg-slate-800 flex items-center justify-between p-2 md:hidden z-50">
          <img className="w-28 h-16" src={`Logos/Logo.webp`} alt="Logo" />
        </div>
        <h1 className="text-green-400 text-lg font-bold shadow-green-400 text-center my-6">Team Leaderboard</h1>
        <div className="w-full text-center flex justify-center flex-col">
          {
            items.filter(it => it.role !== "admin" && it.totalScore>0).length > 0 ? (
              items
                .filter(it => it.role !== "admin" && it.totalScore>0)
                .sort((a, b) => b.totalScore - a.totalScore)
                .map((it) => (
                  <div
                    key={it.username}
                    className="flex items-center justify-center px-6 py-4 mt-1 w-full bg-slate-800"
                  >
                     
                         <div className="flex justify-center items-center">
                      {it.icon !== "" ? (
                        <img className="w-10 h-10" src={it.icon} alt="Logo" />
                      ) : (
                        <img className="w-10 h-10" src={`Icons/cricket.webp`} alt="Default" />
                      )}
                      <h1 className="text-base ml-2 font-bold text-white">{it.username}</h1>
                    </div>
                    
                    <div className="flex w-full gap-2 justify-end items-center">
                      <h1 className="text-base font-bold text-white">{it.totalScore}</h1>
                      <img src="Icons/coin.png" className="w-8 h-8 mr-2" alt="coin" />
                    </div>
                  </div>
                ))
            ) : (
              <h1 className=" text-center text-base my-44 font-bold text-white">No participation</h1>
            )
          }
        </div>
      </>}
    </>
  );
};

export default AllLeaderBoard;