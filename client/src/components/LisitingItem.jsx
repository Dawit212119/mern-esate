import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
export default function ListingItem({ listing }) {
  return (
    <div className="bg-white w-full sm:w-[330px] shadow-md transition-shadow rounded-lg hover:shadow-lg overflow-hidden m-4">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0]}
          alt="listing cover"
          className="object-cover h-[320px] w-full sm:h-[220px] hover:scale-105 transtion-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="text-lg font-semibold text-slate-700 truncate ">
            {listing.name}
          </p>
          <div className="flex gap-1 item-center ">
            <MdLocationOn className="w-4 h-4 text-green-600" />
            <p className="text-xs text-slate-500">{listing.address}</p>
          </div>
          <p className="text-xs text-slate-600 line-clamp-2 ">
            {listing.description}
          </p>

          <p className="text-slate-500 font-semibold mt-2">
            $
            {listing.offer
              ? listing.discountPrice.toLocaleString("en-US")
              : listing.regularPrice.toLocaleString("en-US")}
            {listing.type === "rent" ? "/month" : ""}
          </p>
          <div className="flex gap-4 text-slate-700">
            <p className="text-xs font-bold">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} Beds`
                : `${listing.bedrooms} Bed`}
            </p>
            <p className="text-xs font-bold">
              {listing.bathrooms > 1
                ? `${listing.bathrooms} Baths`
                : `${listing.bathrooms} Bath`}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
