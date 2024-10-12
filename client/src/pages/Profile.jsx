import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteStart,
  deleteFailure,
  deleteSuccess,
  signOutStart,
  signOutFailure,
  signOutSuccess,
} from "../redux/user/userSlice";
import { app } from "../firebase";
import { errorHandler } from "../../../api/utils/error";
import Listing from "../../../api/model/listing.model";
import { configDotenv } from "dotenv";
// firebase storage
//      allow read;
//allow write: if  request.resource.size < 2 *1024 *1024 &&
//request.resource.contentType.matches('image/.*')

export default function Profile() {
  const [hover, sethover] = useState(false);
  const [file, setfile] = useState(undefined);
  const [fileperc, setFilePerc] = useState(0);
  const [formData, setFormData] = useState({});
  const [updateSuccessPro, setUpdateSuccessPro] = useState(false);
  const [deleteUser, setdeleteuser] = useState(false);
  const dispatch = useDispatch();
  const [userListing, setUserListing] = useState([]);
  const [showListingError, setShowListingError] = useState(false);
  const [fileUploadError, setFileUploadError] = useState(false);
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  console.log(formData);
  console.log(currentUser);
  console.log(fileperc);
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get the progress of the upload as a percentage
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
          console.log(downloadURL);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: [e.target.value] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json;
      if (data.success === false) {
        dispatch(updateFailure(error.mesage));
        return;
      }
      dispatch(updateSuccess(data));
      setUpdateSuccessPro(true);
    } catch (error) {
      dispatch(updateFailure(error.mesage));
    }
  };
  const handleDelete = async (e) => {
    try {
      dispatch(deleteStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json;
      if (data.success === false) {
        dispatch(deleteFailure(data.message));
        return;
      }
      dispatch(deleteSuccess());
      setdeleteuser(true);
      alert("Account Deleted!");
    } catch (error) {
      dispatch(deleteFailure(error.mesage));
    }
  };
  // const SignoutPopup = ({ onClose }) => {
  //   return (
  //     <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
  //       <div className="bg-white p-5 rounded shadow-lg text-center">
  //         <p>You are signing out...</p>
  //         <button
  //           onClick={onClose}
  //           className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
  //         >
  //           Close
  //         </button>
  //       </div>
  //     </div>
  //   );
  // };
  const handleSignout = async () => {
    try {
      dispatch(signOutStart());
      // setShowPopup(true);

      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutFailure(data.mesage));
      }
      dispatch(signOutSuccess());

      // setTimeout(() => {
      //   setShowPopup(false);
      //   navigate("/signin");
      // }, 2000);
    } catch (error) {
      dispatch(signOutFailure(error.mesage));
    }
  };
  const handleshowlisting = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === "false") {
        setShowListingError(true);
      }
      console.log(data);
      setUserListing(data);
    } catch (error) {
      setShowListingError(true);
    }
  };
  const handleListingDelete = async (listingid) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingid}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === "false") {
        console.log(data.mesage);
      }

      setUserListing((prev) =>
        prev.filter((listing) => listing._id !== listingid)
      );
    } catch (error) {
      console.log(error.mesage);
    }
  };
  // const handleOver = () => {
  //   if (userListing.length < 1) {
  //     sethover((e) => !e);
  //   }
  // };
  return (
    <div className="m-10 pr-10  ">
      <div
        className="p-3 max-w-lg bg-white mx-auto rounded-lg
     border-t-2 "
      >
        <h1 className="text-center  text-3xl my-7 font-semibold uppercase">
          Profile
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type="file"
            ref={fileRef}
            onChange={(e) => setfile(e.target.files[0])}
            hidden
            accept="image/.*"
          />
          <img
            onClick={() => fileRef.current.click()}
            src={formData?.avatar || currentUser?.avatar}
            alt="profile"
            className="rounded-full h-24 w-24 object-cover
        cursor-pointer self-center focus:outline-none "
          />
          <p className="self-center">
            {fileUploadError ? (
              <span className="text-red-700">
                Error Image upload (Image must be less than 2 mb)
              </span>
            ) : fileperc > 0 && fileperc < 100 ? (
              <span className="text-slate-700 font-semibold uppercase">{`Uploading ${fileperc} %`}</span>
            ) : fileperc === 100 ? (
              <span className="text-green-700">
                Image successfully uploaded!
              </span>
            ) : (
              " "
            )}
          </p>
          <input
            type="text"
            placeholder="username"
            defaultValue={currentUser?.username}
            className="border focus:outline-none p-3 rounded-lg"
            id="username"
            onChange={handleChange}
          />
          <input
            type="type"
            placeholder="email"
            id="email"
            defaultValue={currentUser?.email}
            onChange={handleChange}
            className="border p-3 rounded-lg focus:outline-none"
          />
          <input
            type="password"
            placeholder="password"
            id="password"
            onChange={handleChange}
            className="border p-3 rounded-lg focus:outline-none"
          />
          <button
            disabled={loading}
            className="bg-slate-700 p-3 rounded-lg text-white uppercase hover:opacity-95"
          >
            {loading ? "Loading..." : "Update"}
          </button>

          <Link
            className="bg-green-700 p-3 text-white uppercase text-center rounded-lg"
            to="/create-listing"
          >
            create a listing
          </Link>
        </form>
        <div className="flex justify-between mt-10 mb-7 uppercase">
          <span
            className="  text-red-700
        cursor-pointer font-semibold"
            onClick={handleDelete}
          >
            Delete account
          </span>
          <span
            className="text-red-700 font-semibold cursor-pointer"
            onClick={handleSignout}
          >
            Sign out
          </span>
        </div>
        <p
          className={`${
            updateSuccessPro ? "text-green-700" : "text-red-700"
          } mb-5`}
        >
          {updateSuccessPro ? "User is updated successfully!" : error}
        </p>
        <button
          // onMouseOver={handleOver}
          onClick={handleshowlisting}
          className="  w-full text-green-700"
        >
          Show listings
        </button>
        {/* <p className="text-center ">{hover && "You dont have any listing!"}</p> */}

        <p>{showListingError ? "Error showing listing" : ""}</p>
        {/* <p className="text-center py-7"> Your listings</p> */}

        {userListing && userListing.length > 0 && (
          <div className="flex flex-col">
            <h1 className="text-center my-7 font-semibold text-2xl">
              Your listing
            </h1>
            {userListing.map((listing) => (
              <div
                key={listing._id}
                className=" border rounded-lg p-3 flex items-center justify-between gap-4"
              >
                <Link to={`/listing/${currentUser._id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    alt="listing cover"
                    className="w-16 h-16 object-contain"
                  />
                </Link>
                <Link
                  className="font-semibold text-slate-700 flex-1 hover:underline truncate"
                  to={`/listing/${currentUser._id}`}
                >
                  <p>{listing.name}</p>
                </Link>

                <div className="flex flex-col items-center">
                  <button
                    className="text-red-700 uppercase"
                    onClick={() => handleListingDelete(listing._id)}
                  >
                    Delete
                  </button>
                  <button className="text-green-600 uppercase">Edit</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
