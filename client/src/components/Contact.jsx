import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  console.log(listing);
  const [landlord, setlandlord] = useState();
  const [message, setMessage] = useState("");
  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchingUser = async () => {
      const res = await fetch(`/api/user/${listing.userRef}`);
      const data = await res.json();
      if (data.success === false) {
        console.log("error");
      }
      setlandlord(data);
      console.log(data);
    };

    fetchingUser();
  }, [listing.userRef]);

  return (
    <>
      {landlord && (
        <>
          <div className="flex flex-col gap-2">
            <p>
              Contact
              <span className="font-semibold"> {landlord.username} </span>
              for
              <span className="font-semibold"> {listing.name} </span>
            </p>
            <textarea
              name="message"
              id="message"
              rows="2"
              value={message}
              onChange={onChange}
              className="w-full p-3 rounded-lg"
              placeholder="Enter your message here..."
            />
          </div>
          <Link
            to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-slate-700 w-full p-3 text-center rounded-md text-white uppercase  hover:opacity-95"
          >
            sent message
          </Link>
        </>
      )}
    </>
  );
}
