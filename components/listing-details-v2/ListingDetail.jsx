"use client";

function ImageGrid({ images }) {
  let imagesToShow = images ? [...images].slice(0, 4) : [];

  if (!imagesToShow || imagesToShow.length === 0) {
    return (
      <p className="tw:text-center tw:text-gray-500">No images available</p>
    );
  }

  if (imagesToShow.length === 1) {
    return (
      <div className="tw:grid tw:grid-cols-1 tw:gap-4 tw:flex-[70%]">
        <img
          src={imagesToShow[0]}
          alt="img-1"
          className="tw:w-full tw:h-[600px] tw:rounded-lg tw:object-cover"
        />
      </div>
    );
  }

  if (imagesToShow.length === 2) {
    return (
      <div className="tw:grid tw:grid-cols-2 tw:gap-4 tw:flex-[70%]">
        {imagesToShow.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`img-${index}`}
            className="tw:w-full tw:h-[600px] tw:rounded-lg tw:object-cover"
          />
        ))}
      </div>
    );
  }

  if (imagesToShow.length === 3) {
    return (
      <div className="tw:flex tw:gap-4 tw:h-[600px] tw:flex-[70%]">
        {/* Left: Large image */}
        <div className="tw:flex-[2] tw:h-full">
          <img
            src={imagesToShow[0]}
            alt="img-0"
            className="tw:w-full tw:h-full tw:rounded-lg tw:object-cover"
          />
        </div>

        {/* Right: Two stacked images */}
        <div className="tw:flex tw:flex-col tw:gap-4 tw:h-full">
          <div className="tw:h-[292px]">
            <img
              src={imagesToShow[1]}
              alt="img-1"
              className="tw:w-full tw:h-full tw:rounded-lg tw:object-cover"
            />
          </div>
          <div className="tw:h-[292px]">
            <img
              src={imagesToShow[2]}
              alt="img-2"
              className="tw:w-full tw:h-full tw:rounded-lg tw:object-cover"
            />
          </div>
        </div>
      </div>
    );
  }

  if (imagesToShow.length === 4) {
    return (
      <div className="tw:flex tw:gap-4 tw:h-[600px] tw:bg-red-200 tw:flex-[70%]">
        {/* Left large image */}
        <div className="tw:flex-1 tw:h-full">
          <img
            src={imagesToShow[0]}
            alt="img-0"
            className="tw:w-full tw:h-full tw:rounded-lg tw:object-cover"
          />
        </div>

        {/* Right stacked section */}
        <div className="tw:flex-[1] tw:flex tw:flex-col tw:gap-4">
          {/* Bottom wide image */}
          <div className="tw:h-[292px]">
            <img
              src={imagesToShow[1]}
              alt="img-3"
              className="tw:w-full tw:h-full tw:rounded-lg tw:object-cover"
            />
          </div>

          {/* Top row: 2 small images */}
          <div className="tw:flex tw:gap-4 tw:h-[292px]">
            <div className="tw:flex-1">
              <img
                src={imagesToShow[2]}
                alt="img-1"
                className="tw:w-full tw:h-full tw:rounded-lg tw:object-cover"
              />
            </div>
            <div className="tw:flex-1">
              <img
                src={imagesToShow[3]}
                alt="img-2"
                className="tw:w-full tw:h-full tw:rounded-lg tw:object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default function ListingDetail({ data, locale }) {
  console.log("ListingDetail", data, locale);
  return (
    <div className="tw:text-black tw:flex tw:flex-col tw:mt-[40px] tw:px-[80px] tw:py-[80px]">
      <div className="tw:flex tw:gap-5">
        <ImageGrid
          images={[
            "https://images.pexels.com/photos/2071882/pexels-photo-2071882.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
          ]}
        />
        <div className="tw:flex-[30%]"> a sdsd</div>
      </div>
      {JSON.stringify(data, null, 2)}
    </div>
  );
}
