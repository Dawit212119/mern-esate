export default function Search() {
  return (
    <div className=" flex flex-col  md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2">
        <form>
          <div className="flex gap-2 items-center">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              className="rounded-lg border p-3 focus:outline-none"
              type="text"
              placeholder="Search..."
            />
          </div>
          <div className="flex gap-2 mt-7 ">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input type="checkbox" className="w-5" id="all" />
              <span className="whitespace-nowrap">Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" className="w-5" id="rent" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" className="w-5" id="" sale />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" className="w-5" id="offer" />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-2 mt-7">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input type="checkbox" className="w-5" id="parking" />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" className="w-5" id="furnished" />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex gap-2 mt-7 items-center">
            <label className="font-semibold">Sort:</label>
            <select id="sort_order" className=" p-3 rounded-lg">
              <option>Latest</option>
              <option>Price high to low</option>

              <option>Price low to high</option>

              <option>Oldest</option>
            </select>
          </div>
          <button
            className="p-3 w-full bg-slate-700 rounded-lg text-white uppercase
           hover:opacity-95 disabled:opacity-50 mt-7"
          >
            search
          </button>
        </form>
      </div>
      <div className="">
        <h1 className="p-7 text-3xl text-slate-500 font-semibold">
          Listing results:{" "}
        </h1>
      </div>
    </div>
  );
}
