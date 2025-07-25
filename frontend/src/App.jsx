import React, { useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { MdWarningAmber } from "react-icons/md";
import TeamList from "./components/TeamList";
import TeamDetails from "./components/TeamDetails";
import Players from "./components/Players.jsx";
import Stats from "./components/Stats.jsx";
import Play from "./gaming/Play.jsx";
import Results from "./components/Results";
import History from "./components/History";
import Standings from "./components/Standings";
import Card from "./components/Card.jsx";
import Auction from "./auction/Auction.jsx";
import Playgame from "./auction/Playgame.jsx";
import Tourstats from "./auction/Tourstats.jsx";
import Analysis from "./auction/Analysis.jsx";
import Matchfixtures from "./auction/Matchfixtures.jsx";
import Bid from "./tournament/Bid.jsx";
import Game from "./tournament/Game.jsx";
import Team from "./tournament/Team.jsx";
import Fixtures from "./tournament/Fixtures.jsx";
import Playerstats from "./tournament/Playerstats.jsx";
import Iplsite from "./road/Iplsite.jsx";
import Iplgame from "./road/Iplgame.jsx";
import Iplteam from "./road/Iplteam.jsx";
import Iplfixtures from "./road/Iplfixtures.jsx";
import Iplplayerstats from "./road/Iplplayerstats.jsx";
import Warning from "./Warning.jsx";
import HomeRoutes from "./HomeRoutes.jsx"
import { AuthProvider  } from './protector/useAuth.jsx'
import Protected from './protector/Protected.jsx'
import ToastCleanup from "./ToastCleanup.jsx"
const App = () => {
  const [blocked, setBlocked] = useState(false);
    useEffect(()=>{
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("username")
    sessionStorage.removeItem("role")
    },[])

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 320) {
        setBlocked(true);
      } else {
        setBlocked(false);
      }
    };

    // Initial check
    handleResize();

    // Listen for resize events
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.className = "bg-gray-900";
  }, []);

  if (blocked) {
    return (
      <div className="w-full h-screen text-white flex items-center justify-center text-center p-4">
        <div>
          <MdWarningAmber className="text-6xl text-yellow-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold">Access Restricted</h1>
          <p className="mt-2">This site is not accessible on your screen.</p>
        </div>
      </div>
    );
  }

  return (
    <>
     <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<TeamList />} />
        <Route path="/details" element={<TeamDetails />} />
        <Route path="/players" element={<Warning><Players /></Warning>} />
        <Route path="/stats" element={<Warning><Stats /></Warning>} />
        <Route path="/play" element={<Warning><Play /></Warning>} />
        <Route path="/history" element={<Warning><History /></Warning>} />
        <Route path="/standings" element={<Warning><Standings /></Warning>} />
        <Route path="/results" element={<Warning><Results /></Warning>} />
        <Route path="/profile" element={<Warning><Card /></Warning>} />
        <Route path="/auction" element={<Warning><Auction /></Warning>} />
        <Route path="/playgame" element={<Warning><Playgame /></Warning>} />
        <Route path="/analysis" element={<Warning><Analysis /></Warning>} />
        <Route path="/tourstats" element={<Warning><Tourstats /></Warning>} />
        <Route path="/matchfixtures" element={<Warning><Matchfixtures /></Warning>} />
        <Route path="/bid" element={<Warning><Bid /></Warning>} />
        <Route path="/game" element={<Warning><Game /></Warning>} />
        <Route path="/team" element={<Warning><Team /></Warning>} />
        <Route path="/fixtures" element={<Warning><Fixtures /></Warning>} />
        <Route path="/playerstats" element={<Warning><Playerstats /></Warning>} />
        <Route path="/iplsite" element={<Warning><Iplsite /></Warning>} />
        <Route path="/iplgame" element={<Warning><Iplgame /></Warning>} />
        <Route path="/iplteam" element={<Warning><Iplteam /></Warning>} />
        <Route path="/iplfixtures" element={<Warning><Iplfixtures /></Warning>} />
        <Route path="/iplplayerstats" element={<Warning><Iplplayerstats /></Warning>} />
      </Routes>
     <HomeRoutes />
    </Router>
    </AuthProvider>
    </>
  );
};

export default App;
