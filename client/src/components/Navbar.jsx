import { Link } from "react-router-dom";

export default function Navbar() {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="bg-black text-white p-4 flex justify-between">
      <h1 className="text-2xl font-bold">
        AI Resume Analyzer
      </h1>

      <div className="flex gap-5">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/upload">Upload</Link>

        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}