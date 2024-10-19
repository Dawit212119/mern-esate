import { useEffect, useState } from "react";
import { useAsyncError, useLocation, useNavigate } from "react-router-dom";
import ListingItem from "../components/LisitingItem";
export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showmore, setShowMore] = useState(false);
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });
  const [listing, setListing] = useState([]);
  const [loading, setloading] = useState(false);
  console.log(sidebardata);
  console.log(listing);
  useEffect(() => {
    const urlparams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlparams.get("searchTerm") || ""; // fallback to an empty string if undefined
    const parkingFromUrl = urlparams.get("parking") === "true"; // convert "true"/"false" string to boolean
    const typeFromUrl = urlparams.get("type") || "all"; // fallback to "all" if undefined
    const orderFromUrl = urlparams.get("order") || "desc"; // fallback to "desc"
    const furnishedFromUrl = urlparams.get("furnished") === "true"; // convert to boolean
    const sortFromUrl = urlparams.get("sort") || "created_at"; // fallback to "created_at"
    const offerFromUrl = urlparams.get("offer") === "true"; // convert to boolean

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
        searchTerm: searchTermFromUrl,
        parking: parkingFromUrl,
        type: typeFromUrl,
        offer: offerFromUrl,
        sort: sortFromUrl,
        furnished: furnishedFromUrl,
        order: orderFromUrl,
      });
    }

    const fetchListing = async () => {
      setloading(true);
      setShowMore(false);
      const searchQuery = urlparams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListing(data);
      setloading(false);
    };
    fetchListing();
  }, [location.search]);

  const onShowMoreCLick = async () => {
    const numberofListings = listing.length;
    const startIndex = numberofListings;
    const urlparams = new URLSearchParams(location.search);
    urlparams.set("startIndex", startIndex);
    const searchQuery = urlparams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    console.log(data);
    setListing([...listing, ...data]);
  };

  const handlesubmit = (e) => {
    e.preventDefault();
    const urlparams = new URLSearchParams(window.location.search);
    urlparams.set("searchTerm", sidebardata.searchTerm);
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
        searchTerm: e.target.value,
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
        ...sidebardata,
        [e.target.id]: e.target.checked,
      });
    }
    if (e.target.id === "sort_order") {
      const value = e.target.value;
      const lastindexofunderscore = value.lastIndexOf("_");
      const sort = value.slice(0, lastindexofunderscore);
      const order = value.slice(lastindexofunderscore + 1);
      setSidebardata({
        ...sidebardata,
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
              id="searchTerm"
              value={sidebardata.searchTerm}
              onChange={handleChange}
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
                id="sale"
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
                checked={!!sidebardata.offer}
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
                checked={!!sidebardata.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="furnished"
                onChange={handleChange}
                checked={!!sidebardata.furnished}
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
            type="submit"
            className="p-3 w-full bg-slate-700 rounded-lg text-white uppercase
           hover:opacity-95 disabled:opacity-50 mt-7"
          >
            search
          </button>
        </form>
      </div>
      <div className=" flex-1">
        <h1 className="p-7 text-3xl text-slate-500 font-semibold">
          Listing results:
        </h1>
        <div className="flex flex-wrap gap-4">
          {!loading && Array.isArray(listing) && listing.length <= 0 && (
            <p>Listing Not found!</p>
          )}

          {loading && (
            <p className="text-center p-7 text-xl w-full text-slate-700">
              Loading...
            </p>
          )}
          {!loading &&
            listing &&
            listing.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}

          {showmore && (
            <button className="text-green-700 p-7" onClick={onShowMoreCLick}>
              Show More...
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
