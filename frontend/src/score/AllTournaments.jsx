import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { HashLink } from 'react-router-hash-link';

const get_data = () => sessionStorage.getItem("token");
const get_role = () => JSON.parse(sessionStorage.getItem("username"));

const AllTournaments = () => {
  const token = get_data();
  const role = get_role();
  const [searchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [items, setItems] = useState([]);

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
      const response = await fetch(`https://intelligent-ailyn-handcricket-e8842259.koyeb.app/gettournaments`);
      let data = await response.json();
      if (!data.error) {
        setTimeout(() => {
          setLoading(false);
          setItems(data.tournaments_data);
        }, 2000);
      }
    } catch (err) {
      console.log("It is an error: ", err);
    }
  };

  useEffect(() => {
    show_data();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [token]);

  return (
    <>
      {loading ? (
        <div className="w-full flex flex-col items-center justify-center py-40 md:py-48">
          <img src="Logos/Logo.webp" className="w-30 h-24 md:w-60 md:h-32" />
          <div className="w-full flex justify-center gap-y-2 text-center flex-col p-4 mt-4">
            <div className="mt-4 flex flex-row flex-wrap justify-center gap-x-12 gap-y-12">
              {new Array(4).fill("").map((_, ind) => (
                <div key={ind} className="text-center">
                  <img src={`sponsor/sponsor${ind + 1}.png`} className="w-22 h-14 md:w-20 md:h-16" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="relative w-full bg-slate-800 flex items-center justify-between p-2 md:hidden z-50">
            <img className="w-28 h-16" src={`Logos/Logo.webp`} alt="Logo" />
          </div>

          {items.filter(it => it.winner !== "").length > 0 && (
            <div className="overflow-x-auto scroll-smooth px-3 py-4">
              <div className="flex gap-4 w-max">
                {teams.map((team) => (
                  <div key={team} onClick={() => handleSelect(team)} className="relative cursor-pointer">
                    <img src={`Logos/${team}.webp`} className="w-16 h-16 p-2 rounded-full border border-slate-800" />
                    {selectedTeams.includes(team) && (
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="absolute top-0 right-0 text-green-500 bg-white rounded-full"
                        size="lg"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <h1 className="text-green-400 text-lg font-bold shadow-green-400 text-center my-4">Tournaments History</h1>

          <div className="w-full text-center flex justify-center flex-col">
            {items.filter(it => it.winner !== "").length > 0 ? (
              items
                .filter(it => it.winner !== "")
                .reverse()
                .map((i, idx) => {
                  if (
                    selectedTeams.length === 0 ||
                    selectedTeams.includes(i.playerteam) ||
                    selectedTeams.includes(i.computerteam)
                  ) {
                    return (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 mt-4 w-full bg-slate-800 shadow-md hover:scale-[1.01] transition-transform duration-200"
                      >
                        {/* Team Logos and VS */}
                        <div className="flex justify-center sm:justify-start items-center gap-4 w-full sm:w-1/2 mb-4 sm:mb-0">
                          <img src={`Logos/${i.playerteam}.webp`} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-contain" />
                          <h1 className="text-lg sm:text-xl font-bold text-white">v/s</h1>
                          <img src={`Logos/${i.computerteam}.webp`} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-contain" />
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-row flex-wrap items-center gap-4">
                          <HashLink smooth to={`/onlinescore?id=${i.matchID}`}>
                            <button className="bg-slate-900 hover:bg-slate-700 text-white text-sm sm:text-base px-6 py-2 font-semibold rounded-md shadow">
                              Score
                            </button>
                          </HashLink>
                          <HashLink smooth to={`/leaderboard?id=${i.matchID}`}>
                            <button className="bg-slate-900 hover:bg-slate-700 text-white text-sm sm:text-base px-6 py-2 font-semibold rounded-md shadow">
                              Leaderboard
                            </button>
                          </HashLink>
                        </div>
                      </div>
                    );
                  } else {
                    return (<>
                                  <h1 className="text-center text-base my-44 font-bold text-white">No Tournaments</h1>
                    </>)
                  }
                })
            ) : (
              <h1 className="text-center text-base my-44 font-bold text-white">No Tournaments</h1>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default AllTournaments;