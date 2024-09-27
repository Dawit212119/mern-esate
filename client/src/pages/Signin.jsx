import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signin() {
  const [formData, setformData] = useState({});
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setformData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  console.log(formData);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        console.log("Error");
        setError(data.message);
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      setError(null);
      navigate("/");
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
    }
  };
  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={isLoading}
          className="bg-slate-700
         text-white p-3 rounded-lg 
         uppercase hover:opacity-95 
         disabled:opacity-85"
        >
          {isLoading ? "Loading..." : " Sign In"}
        </button>
      </form>
      <div className="flex gap-2 py-5">
        <p>Dont have an account?</p>
        <Link to="/signup">
          <span className="text-blue-700">Sign Up</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}
