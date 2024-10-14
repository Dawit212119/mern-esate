import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css/bundle";

export default function Listing() {
  SwiperCore.use([Navigation, Autoplay]);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(false);
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
        </div>
      )}
    </main>
  );
}
