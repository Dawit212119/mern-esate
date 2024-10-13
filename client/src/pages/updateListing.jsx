import { useEffect, useState } from "react";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdatingListing() {
  const { currentUser } = useSelector((state) => state.user);
  const [files, setfiles] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const handleFileChange = (e) => {
    setfiles(e.target.files); // This sets the selected files to state
  };
  const handleremoveimage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  useEffect(() => {
    const fetchListing = async () => {
      console.log(params);
      const listing = params.listingid;
      console.log(listing);
      const res = await fetch(`/api/listing/getlisting/${listing}`);
      const data = await res.json();
      if (data.success === "false") {
        console.log("error fetching to update");
      }
      setFormData(data);
      // setreturnfile(data);
      // console.log(returnfile.name);
      // console.log(data);
      console.log(formData);
    };
    fetchListing();
  }, []);

  const handleChange = (e) => {
    if (e.target.id === "sell" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleImageSubmit = () => {
    setUploading(true);
    setImageUploadError(false);
    if (files.length > 0 && files.length < 7) {
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((url) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(url),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2 mb max per image!)");
          setUploading(false);
        });
    } else if (files.length === 0) {
      setImageUploadError("Please upload at least one image!");
    } else {
      setImageUploadError("You can only upload 6 images per listing!");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("please upload at least one image!");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be lower than regular price");

      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.listingid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      console.log(data);
      if (data.success === "false") {
        setError(data.message);
        setLoading(false);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl text-center font-bold my-7 ">Update a Listing</h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        {" "}
        {/* Added gap for better spacing */}
        {/* Container for the first section */}
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            id="name"
            className="border p-3 rounded-lg focus:outline-none"
            required
            // defaultValue={returnfile.name}
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            id="description"
            placeholder="Description"
            className="border p-3 rounded-lg focus:outline-none"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            required
            placeholder="Address"
            className="border p-3 rounded-lg focus:outline-none"
            id="address"
            onChange={handleChange}
            value={formData.address}
          />

          {/* Container for the second section */}
          <div className="flex flex-wrap gap-6">
            <div className="flex gap-4">
              <input
                type="checkbox"
                id="sell"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sell"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-4">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-4">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-4">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-4">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          {/* Container for the third section */}
          <div className="flex flex-wrap gap-4 ">
            <div className="flex gap-5 items-center">
              <input
                type="number"
                required
                className="p-3 border focus:outline-none border-gray-700 rounded-lg"
                id="bedrooms"
                min="1"
                max="10"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <span>Beds</span>
            </div>
            <div className="flex gap-5 items-center">
              <input
                type="number"
                required
                className="p-3 border focus:outline-none border-gray-700 rounded-lg"
                id="bathrooms"
                min="1"
                max="10"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <span>Baths</span>
            </div>
            <div className="flex gap-5 items-center">
              <input
                type="number"
                required
                className="p-3 border border-gray-700 focus:outline-none rounded-lg"
                id="regularPrice"
                min="50"
                max="100000"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex gap-5 items-center">
                <input
                  type="number"
                  required
                  className="p-3 border border-gray-700 rounded-lg focus:outline-none"
                  id="discountPrice"
                  min="1"
                  max="10"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted price</p>
                  {formData.type === "rent" && (
                    <span className="text-xs">($ / month)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex  flex-1 flex-col gap-4">
          <p className="font-semibold p-3">
            Image:
            <span className="text-slate-500 font-normal">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex ">
            <input
              type="file"
              className="border border-gray-300 p-3 w-full rounded-lg mr-4"
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              className="border border-green-700 p-3 text-green-700
            rounded font-semibold uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "uploading..." : "upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between items-center border p-3"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-40 h-40 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleremoveimage(index)}
                  className="text-red-700 p-3 uppercase font-semibold hover:opacity-95"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 rounded-lg text-white uppercase
           hover:opacity-95 disabled:opacity-50"
          >
            {loading ? "Updating..." : "  Updating listing"}
          </button>
          {error && <p className="text-red-700 text-xs">{error}</p>}
        </div>
      </form>
    </main>
  );
}
