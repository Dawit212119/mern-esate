import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
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
} from "../redux/user/userSlice";
import { app } from "../firebase";
import { errorHandler } from "../../../api/utils/error";
// firebase storage
//      allow read;
//allow write: if  request.resource.size < 2 *1024 *1024 &&
//request.resource.contentType.matches('image/.*')

export default function Profile() {
  const [file, setfile] = useState(undefined);
  const [fileperc, setFilePerc] = useState(0);
  const [formData, setFormData] = useState({});
  const [updateSuccessPro, setUpdateSuccessPro] = useState(false);
  const [deleteUser, setdeleteuser] = useState(false);
  const dispatch = useDispatch();
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
  return (
    <div className="m-10 pr-10  ">
      <div
        className="p-3 max-w-lg bg-white mx-auto border border-gray-300 border-2 rounded-lg
     border-t-2 shadow-lg"
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
        </form>
        <div className="flex justify-between mt-10 mb-7 uppercase">
          <span
            className="  text-red-700
        cursor-pointer font-semibold"
            onClick={handleDelete}
          >
            Delete account
          </span>
          <span className="text-red-700 font-semibold cursor-pointer">
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
        <p>{}</p>
      </div>
    </div>
  );
}
