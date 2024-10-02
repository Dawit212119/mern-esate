import React from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);
  return (
    <header className=" bg-slate-200 shadow-md ">
      <div className="flex justify-between items-center max-w-6xl max-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">9O</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form className=" bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:64"
          />
          <FaSearch className="text-slate-600" />
        </form>
        <ul className="flex gap-4 ">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700">Home</li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700">About</li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                src={
                  currentUser.avatar ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                }
                alt="profile"
              />
            ) : (
              <li className=" text-slate-700">Sign in</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
