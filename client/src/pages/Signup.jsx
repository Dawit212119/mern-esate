import React from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          id="password"
          className="border p-3 rounded-lg"
        />
        <input
          type="text"
          placeholder="email"
          id="password"
          className="border p-3 rounded-lg"
        />
        <input
          type="text"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
        />
        <button
          className="bg-slate-700
         text-white p-3 rounded-lg 
         uppercase hover:opacity-95 
         disabled:opacity-85"
        >
          Sign Up
        </button>
      </form>
      <div className="flex gap-2 py-5">
        <p>Have an account?</p>
        <Link to="/signin">
          <span className="text-blue-700">Sign In</span>
        </Link>
      </div>
    </div>
  );
}
