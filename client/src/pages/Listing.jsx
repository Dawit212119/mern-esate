import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
export default function Listing() {
  SwiperCore.use([Navigation, Autoplay]);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(false);
  const [copied, setCopied] = useState(false);
  const [listing, setListing] = useState(null);
  const params = useParams();
  console.log(params);
  useEffect(() => {
    const fetchingListing = async () => {
      try {
        setloading(true);
        const res = await fetch(`/api/listing/getlisting/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          seterror(true);
          setloading(false);
          return;
        }
        setListing(data);
        setloading(false);
      } catch (error) {
        seterror(true);
        setloading(false);
      }
    };
    fetchingListing();
  }, [params.listingid]);

  return (
    <main>
      {loading && (
        <p className="text-center text-2xl my-7 font-semibold">Loading...</p>
      )}
      {error && (
        <p className="text-red-700 text-center text-2xl my-7">
          Something went wrong!
        </p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper
            navigation
            autoplay={{
              delay: 3000, // Delay between slides in milliseconds (3 seconds)
              disableOnInteraction: false, // Keeps autoplay running after user interaction
            }}
          >
            {listing.imageUrls.map((urls) => (
              <SwiperSlide key={urls}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${urls}) no-repeat center `,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className=" fixed top-[25%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link Copied!
            </p>
          )}
          {}
          <div className="flex flex-col p-3 mx-auto max-w-4xl gap-4 my-7">
            <p className="text-2xl font-semibold">
              {listing.name} - ${" "}
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" ? "/month" : ""}
            </p>

            <p className="flex gap-2 items-center">
              <FaMapMarkerAlt className="text-green-700" /> {listing.address}
            </p>
            <div className="flex gap-4">
              <p className="bg-red-900 text-center text-white w-full max-w-[200px] rounded-md p-1 ">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 text-center text-white w-full max-w-[200px] rounded-md p-1">
                  $ {+listing.regularPrice - +listing.discountPrice} discount
                </p>
              )}
            </div>
            <p>
              <span className="font-semibold">Description</span> -{" "}
              {listing.description}
            </p>
            <ul className=" flex flex-wrap gap-4 text-green-900 text-sm font-semibold sm:gap-6">
              <li className="flex gap-1 items-center whitespace-nowrap">
                <FaBed className="text-lg" />
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} Beds`
                  : `${listing.bedrooms} Bed`}
              </li>
              <li className="flex gap-1 items-center whitespace-nowrap">
                <FaBath className="text-lg" />
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} Baths`
                  : `${listing.bathrooms} Bath`}
              </li>
              <li className="flex gap-1 items-center whitespace-nowrap">
                <FaParking className="text-lg" />
                {listing.Parking ? `Parking spot` : `No parking`}
              </li>
              <li className="flex gap-1 items-center whitespace-nowrap">
                <FaChair className="text-lg" />
                {listing.Furnished ? `Furnished` : `No Furnished`}
              </li>
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}
