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
<Route path="/details" element={<Protected><TeamDetails /></Protected>} />  {/* Public */}
<Route path="/players" element={<Protected><Warning><Players /></Warning></Protected>} />
<Route path="/stats" element={<Protected><Warning><Stats /></Warning></Protected>} />
<Route path="/play" element={<Protected><Warning><Play /></Warning></Protected>} />
<Route path="/history" element={<Protected><Warning><History /></Warning></Protected>} />
<Route path="/standings" element={<Protected><Warning><Standings /></Warning></Protected>} />
<Route path="/results" element={<Protected><Warning><Results /></Warning></Protected>} />
<Route path="/profile" element={<Protected><Warning><Card /></Warning></Protected>} />
<Route path="/auction" element={<Protected><Warning><Auction /></Warning></Protected>} />
<Route path="/playgame" element={<Protected><Warning><Playgame /></Warning></Protected>} />
<Route path="/analysis" element={<Protected><Warning><Analysis /></Warning></Protected>} />
<Route path="/tourstats" element={<Protected><Warning><Tourstats /></Warning></Protected>} />
<Route path="/matchfixtures" element={<Protected><Warning><Matchfixtures /></Warning></Protected>} />
<Route path="/bid" element={<Protected><Warning><Bid /></Warning></Protected>} />
<Route path="/game" element={<Protected><Warning><Game /></Warning></Protected>} />
<Route path="/team" element={<Protected><Warning><Team /></Warning></Protected>} />
<Route path="/fixtures" element={<Protected><Warning><Fixtures /></Warning></Protected>} />
<Route path="/playerstats" element={<Protected><Warning><Playerstats /></Warning></Protected>} />
<Route path="/iplsite" element={<Protected><Warning><Iplsite /></Warning></Protected>} />
<Route path="/iplgame" element={<Protected><Warning><Iplgame /></Warning></Protected>} />
<Route path="/iplteam" element={<Protected><Warning><Iplteam /></Warning></Protected>} />
<Route path="/iplfixtures" element={<Protected><Warning><Iplfixtures /></Warning></Protected>} />
<Route path="/iplplayerstats" element={<Protected><Warning><Iplplayerstats /></Warning></Protected>} />
      </Routes>
     <HomeRoutes />
    </Router>
    </AuthProvider>
    </>
  );
};

export default App;
