import { useState } from "react";
import API from "../services/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    try {
      await API.post("/auth/register", {
        name,
        email,
        password,
      });

      window.location.href = "/";
    } catch (error) {
      alert("Register Failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="border p-10 rounded w-[400px]">
        <h1 className="text-3xl font-bold mb-5">
          Register
        </h1>

        <input
          type="text"
          placeholder="Name"
          className="border p-3 w-full mb-4"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="border p-3 w-full mb-4"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-3 w-full mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={register}
          className="bg-black text-white w-full p-3"
        >
          Register
        </button>
      </div>
    </div>
  );
}