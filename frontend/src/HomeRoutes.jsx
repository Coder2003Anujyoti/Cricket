import React from "react";
import { Routes, Route } from "react-router-dom";
import {Link} from 'react-router-dom'
import {HashLink} from 'react-router-hash-link'
import Login from "./login/Login"
import Admin from "./admin/Admin"
import Create from "./admin/Create.jsx"
import AdminUser from "./admin/AdminUser.jsx"
import UserUser from "./users/UserUser.jsx"
import AdminPlay from "./liveplay/AdminPlay.jsx"
import OnlineScore from "./score/OnlineScore.jsx"
import LeaderBoard from "./score/LeaderBoard.jsx"
import AllLeaderBoard from "./score/AllLeaderBoard.jsx"
import AllTournaments from "./score/AllTournaments.jsx"
import Protected from './protector/Protected.jsx'
import UserMake from "./users/UserMake.jsx"
import Profile from "./profile/Profile.jsx"
import Online from "./online/Online.jsx"
import PlayerSearch from "./users/PlayerSearch.jsx"
import News from "./users/News.jsx"
import Chat from "./bot/Chat.jsx"
import Warning from "./Warning.jsx";
import Unauthorize from "./Unauthorize.jsx"
const HomeRoutes = () => {
  return (
  <>
    <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/admin" element={<Protected allowedRoles={['admin']} ><Admin /></Protected>} />
    <Route path="/create" element={<Protected allowedRoles={['admin']}><Create /></Protected>} />
    <Route path="/adminuser" element={<Warning><Protected allowedRoles={['admin']}><AdminUser /></Protected></Warning>} />
    <Route path="/useruser" element={<Warning><Protected><UserUser /></Protected></Warning>} />
   <Route path="/adminplay" element={<Warning><Protected allowedRoles={['admin']}><AdminPlay /></Protected></Warning>} />
      <Route path="/usermake" element={<Warning><Protected><UserMake /></Protected></Warning>} />
   <Route path="/onlinescore" element={<Warning><Protected><OnlineScore /></Protected></Warning>} />
      <Route path="/leaderboard" element={<Warning><Protected><LeaderBoard/></Protected></Warning>} />
      <Route path="/loginprofile" element={<Warning><Protected><Profile/></Protected></Warning>} />
 <Route path="/online" element={<Warning><Protected><Online /></Protected></Warning>} />
<Route path="/allleaderboard" element={<Warning><Protected><AllLeaderBoard /></Protected></Warning>} />
<Route path="/alltournaments" element={<Warning><Protected><AllTournaments /></Protected></Warning>} />
<Route path="/playersearch" element={<Protected><PlayerSearch /></Protected>} />
<Route path="/news" element={<Protected><News /></Protected>} />
<Route path="/chat" element={<Warning><Protected><Chat /></Protected></Warning>} />
<Route path="/unauthorize" element={<Warning><Unauthorize /></Warning>} />
    </Routes>
</>
  )
}

export default HomeRoutes