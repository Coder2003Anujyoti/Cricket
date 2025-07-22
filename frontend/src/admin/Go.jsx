import React, { useState } from "react";

const teams = [
  { name: "Mi", logo: "Logos/Mi.webp" },
  { name: "Csk", logo: "https://upload.wikimedia.org/wikipedia/en/8/81/Chennai_Super_Kings_Logo.svg" },
  { name: "Rr", logo: "https://upload.wikimedia.org/wikipedia/en/6/60/Rajasthan_Royals_Logo.svg" },
  { name: "Kkr", logo: "https://upload.wikimedia.org/wikipedia/en/4/4c/Kolkata_Knight_Riders_Logo.svg" },
  { name: "Gt", logo: "https://upload.wikimedia.org/wikipedia/en/5/52/Gujarat_Titans_Logo.svg" },
  { name: "Pbks", logo: "https://upload.wikimedia.org/wikipedia/en/d/d4/Punjab_Kings_Logo.svg" },
  { name: "Rcb", logo: "https://upload.wikimedia.org/wikipedia/en/4/4f/Royal_Challengers_Bangalore_Logo.svg" },
  { name: "Lsg", logo: "https://upload.wikimedia.org/wikipedia/en/e/e1/Lucknow_Super_Giants_Logo.svg" },
  { name: "Dc", logo: "https://upload.wikimedia.org/wikipedia/en/c/ca/Delhi_Capitals_Logo.svg" },
  { name: "Srh", logo: "https://upload.wikimedia.org/wikipedia/en/8/81/Sunrisers_Hyderabad_Logo.svg" },
];

export default function TournamentForm() {
  const [tournamentName, setTournamentName] = useState("");
  const [userTeam, setUserTeam] = useState(null);
  const [computerTeam, setComputerTeam] = useState(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [computerDropdownOpen, setComputerDropdownOpen] = useState(false);

  const handleCreate = () => {
    if (tournamentName && userTeam && computerTeam) {
      alert(`Tournament: ${tournamentName}\nUser Team: ${userTeam.name}\nComputer Team: ${computerTeam.name}`);
    } else {
      alert("Please fill all fields.");
    }
  };

  const filteredComputerTeams = userTeam
    ? teams.filter((team) => team.name !== userTeam.name)
    : teams;

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white rounded-xl shadow-lg space-y-6">
      <h2 className="text-xl font-bold text-center">Create Tournament</h2>

      <input
        type="text"
        placeholder="Enter Tournament Name"
        className="w-full p-3 border rounded-md shadow-sm"
        value={tournamentName}
        onChange={(e) => setTournamentName(e.target.value)}
      />

      {/* User Team Dropdown */}
      <div className="relative">
        <label className="block mb-1 font-semibold">Your Team</label>
        <div
          className="w-full p-3 border rounded-md cursor-pointer bg-white flex items-center justify-between"
          onClick={() => {
            setUserDropdownOpen(!userDropdownOpen);
            setComputerDropdownOpen(false);
          }}
        >
          {userTeam ? (
            <div className="flex items-center gap-2">
              <img src={userTeam.logo} alt={userTeam.name} className="w-6 h-6" />
              <span>{userTeam.name}</span>
            </div>
          ) : (
            <span className="text-gray-400">Select your team</span>
          )}
          <span>▼</span>
        </div>
        {userDropdownOpen && (
          <div className="absolute z-10 bg-white w-full shadow-lg rounded mt-1 max-h-64 overflow-y-auto">
            {teams.map((team) => (
              <div
                key={team.name}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setUserTeam(team);
                  setUserDropdownOpen(false);
                }}
              >
                <img src={team.logo} alt={team.name} className="w-6 h-6" />
                <span>{team.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Computer Team Dropdown */}
      <div className="relative">
        <label className="block mb-1 font-semibold">Computer Team</label>
        <div
          className="w-full p-3 border rounded-md cursor-pointer bg-white flex items-center justify-between"
          onClick={() => {
            setComputerDropdownOpen(!computerDropdownOpen);
            setUserDropdownOpen(false);
          }}
        >
          {computerTeam ? (
            <div className="flex items-center gap-2">
              <img src={computerTeam.logo} alt={computerTeam.name} className="w-6 h-6" />
              <span>{computerTeam.name}</span>
            </div>
          ) : (
            <span className="text-gray-400">Select computer team</span>
          )}
          <span>▼</span>
        </div>
        {computerDropdownOpen && (
          <div className="absolute z-10 bg-white w-full shadow-lg rounded mt-1 max-h-64 overflow-y-auto">
            {filteredComputerTeams.map((team) => (
              <div
                key={team.name}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setComputerTeam(team);
                  setComputerDropdownOpen(false);
                }}
              >
                <img src={team.logo} alt={team.name} className="w-6 h-6" />
                <span>{team.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleCreate}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Create
      </button>
    </div>
  );
}
