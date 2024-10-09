export default function CreateListing() {
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl text-center font-bold my-7 ">Create a Listing</h1>
      <form className="flex flex-col sm:flex-row gap-4">
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
          />
          <textarea
            type="text"
            id="description"
            placeholder="Description"
            className="border p-3 rounded-lg focus:outline-none"
            required
          />
          <input
            type="text"
            required
            placeholder="Address"
            className="border p-3 rounded-lg focus:outline-none"
            id="address"
          />

          {/* Container for the second section */}
          <div className="flex flex-wrap gap-6">
            <div className="flex gap-4">
              <input type="checkbox" id="sell" />
              <span>Sell</span>
            </div>
            <div className="flex gap-4">
              <input type="checkbox" id="Rent" />
              <span>Rent</span>
            </div>
            <div className="flex gap-4">
              <input type="checkbox" id="parking" />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-4">
              <input type="checkbox" id="furnished" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-4">
              <input type="checkbox" id="offer" />
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
                id="bedroom"
                min="1"
                max="10"
              />
              <span>Beds</span>
            </div>
            <div className="flex gap-5 items-center">
              <input
                type="number"
                required
                className="p-3 border focus:outline-none border-gray-700 rounded-lg"
                id="bathroom"
                min="1"
                max="10"
              />
              <span>Baths</span>
            </div>
            <div className="flex gap-5 items-center">
              <input
                type="number"
                required
                className="p-3 border border-gray-700 focus:outline-none rounded-lg"
                id="regularprice"
                min="1"
                max="10"
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            <div className="flex gap-5 items-center">
              <input
                type="number"
                required
                className="p-3 border border-gray-700 rounded-lg focus:outline-none"
                id="discount"
                min="1"
                max="10"
              />
              <div className="flex flex-col items-center">
                <p>Discounted price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
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
            />
            <button
              className="border border-green-700 p-3 text-green-700
            rounded font-semibold uppercase hover:shadow-lg disabled:opacity-80"
            >
              Upload
            </button>
          </div>
          <button
            className="p-3 bg-slate-700 rounded-lg text-white uppercase
           hover:opacity-95 disabled:opacity-50"
          >
            create listing
          </button>
        </div>
      </form>
    </main>
  );
}
