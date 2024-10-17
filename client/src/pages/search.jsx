import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });

  useEffect(() => {
    const urlparams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlparams.get("searchTerm");
    const parkingFromUrl = urlparams.get("parking");
    const typeFromUrl = urlparams.get("type");
    const orderFromUrl = urlparams.get("order");
    const furnishedFromUrl = urlparams.get("furnished");
    const sortFromUrl = urlparams.get("sort");
    const offerFromUrl = urlparams.get("offer");

    if (
      searchTermFromUrl ||
      parkingFromUrl ||
      typeFromUrl ||
      orderFromUrl ||
      furnishedFromUrl ||
      sortFromUrl ||
      offerFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        parking: parkingFromUrl === "true" ? "true" : "false",
        type: typeFromUrl || "all",
        offer: offerFromUrl === "true" ? "true" : "false",
        sort: sortFromUrl || "created_at",
        furnsihed: furnishedFromUrl === "true" ? "true" : "false",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListing = async () => {
      const searchQuery = urlparams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
    };
    fetchListing();
  });

  const handlesubmit = (e) => {
    const urlparams = new URLSearchParams(window.location.search);
    urlparams.set("parking", sidebardata.parking);
    urlparams.set("furnished", sidebardata.furnished);
    urlparams.set("type", sidebardata.type);
    urlparams.set("order", sidebardata.order);
    urlparams.set("offer", sidebardata.offer);
    urlparams.set("sort", sidebardata.sort);
    const searchQuery = urlparams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebardata({
        ...sidebardata,
        searchTerm: e.target.id,
      });
    }

    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebardata({
        ...sidebardata,
        type: e.target.id,
      });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebardata({
        ...setSidebardata,
        [e.target.id]: e.target.checked,
      });
    }
    if (e.target.id === "sort_order") {
      const value = e.target.value;
      const lastindexofunderscore = value.lastIndexOf(_);
      const sort = value.slice(0, lastindexofunderscore);
      const order = value.slice(lastindexofunderscore + 1);
      setSidebardata({
        ...setSidebardata,
        sort,
        order,
      });
    }
  };

  return (
    <div className=" flex flex-col  md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2">
        <form onSubmit={handlesubmit}>
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
              <input
                type="checkbox"
                className="w-5"
                id="all"
                onChange={handleChange}
                checked={sidebardata.type === "all"}
              />
              <span className="whitespace-nowrap">Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="rent"
                onChange={handleChange}
                checked={sidebardata.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id=""
                sale
                onChange={handleChange}
                checked={sidebardata.type === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="offer"
                onChange={handleChange}
                checked={sidebardata.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-2 mt-7">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="parking"
                onChange={handleChange}
                checked={sidebardata.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="furnished"
                onChange={handleChange}
                checked={sidebardata.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex gap-2 mt-7 items-center">
            <label className="font-semibold">Sort:</label>
            <select
              id="sort_order"
              className=" p-3 rounded-lg"
              onChange={handleChange}
              value={`${sidebardata.sort}_${sidebardata.order}`}
            >
              <option value="created_at_desc">Latest</option>
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="created_at_asc">Oldest</option>
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