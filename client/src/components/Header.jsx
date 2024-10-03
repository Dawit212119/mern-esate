import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
function Header() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl p-3 mx-auto">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Mern</span>
            <span className="text-slate-700 ">Estate</span>
          </h1>
        </Link>
        <form
          action=""
          className="bg-slate-100 p-3 rounded-lg hidden sm:flex items-center "
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none w-24 sm:w-64"
          />
          <FaSearch className="text-slate-600" />
        </form>
        <ul className="flex items-center gap-4">
          <li className="hidden sm:inline text-slate-700 hover:underline">
            <Link to="/">Home</Link>
          </li>
          <li className="hidden sm:inline  text-slate-700 hover:underline">
            <Link to="about">About</Link>
          </li>
          <li className=" text-slate-700 hover:underline">
            <Link to="profile">
              {currentUser ? (
                <img
                  src={currentUser.avatar}
                  alt="profile"
                  className="rounded-full w-7 h-7 bg-transparent object-cover"
                />
              ) : (
                `Sign in`
              )}
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}

export default Header;
