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
      <ToastCleanup />
      <Routes>
   <Route path="/" element={<Protected><TeamList /></Protected>} />
<Route path="/details" element={<Protected><TeamDetails /></Protected>} />
<Route path="/players" element={<Warning><Protected><Players /></Protected></Warning>} />
<Route path="/stats" element={<Warning><Protected><Stats /></Protected></Warning>} />
<Route path="/play" element={<Warning><Protected><Play /></Protected></Warning>} />
<Route path="/history" element={<Warning><Protected><History /></Protected></Warning>} />
<Route path="/standings" element={<Warning><Protected><Standings /></Protected></Warning>} />
<Route path="/results" element={<Warning><Protected><Results /></Protected></Warning>} />
<Route path="/profile" element={<Warning><Protected><Card /></Protected></Warning>} />
<Route path="/auction" element={<Warning><Protected><Auction /></Protected></Warning>} />
<Route path="/playgame" element={<Warning><Protected><Playgame /></Protected></Warning>} />
<Route path="/analysis" element={<Warning><Protected><Analysis /></Protected></Warning>} />
<Route path="/tourstats" element={<Warning><Protected><Tourstats /></Protected></Warning>} />
<Route path="/matchfixtures" element={<Warning><Protected><Matchfixtures /></Protected></Warning>} />
<Route path="/bid" element={<Warning><Protected><Bid /></Protected></Warning>} />
<Route path="/game" element={<Warning><Protected><Game /></Protected></Warning>} />
<Route path="/team" element={<Warning><Protected><Team /></Protected></Warning>} />
<Route path="/fixtures" element={<Warning><Protected><Fixtures /></Protected></Warning>} />
<Route path="/playerstats" element={<Warning><Protected><Playerstats /></Protected></Warning>} />
<Route path="/iplsite" element={<Warning><Protected><Iplsite /></Protected></Warning>} />
<Route path="/iplgame" element={<Warning><Protected><Iplgame /></Protected></Warning>} />
<Route path="/iplteam" element={<Warning><Protected><Iplteam /></Protected></Warning>} />
<Route path="/iplfixtures" element={<Warning><Protected><Iplfixtures /></Protected></Warning>} />
<Route path="/iplplayerstats" element={<Warning><Protected><Iplplayerstats /></Protected></Warning>} />
      </Routes>
     <HomeRoutes />
    </Router>
    </AuthProvider>
    </>
  );
};

export default App;
