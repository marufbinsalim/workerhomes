import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ImageSlider = ({ imageUrls }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="tw:relative tw:h-[50dvh] tw:md:h-[70dvh] tw:mx-auto tw:overflow-hidden tw:rounded-2xl tw:shadow-lg tw:bg-black tw:max-w-[90vw]">
      <div
        className="tw:flex tw:transition-transform tw:duration-500 tw:ease-in-out tw:h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {imageUrls.map((url, index) => (
          <div key={index} className="tw:min-w-full tw:h-full tw:flex-shrink-0">
            <img
              src={url}
              alt={`Slide ${index}`}
              className="tw:w-full tw:h-full tw:object-contain"
            />
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      {!!imageUrls.length && (
        <button
          onClick={prevSlide}
          className="tw:absolute tw:top-1/2 tw:left-4 tw:-translate-y-1/2 tw:bg-white/90 tw:border tw:border-gray-200  tw:p-2 tw:rounded-full tw:shadow-md  tw:hover:bg-white"
        >
          <ChevronLeft className="tw:w-5 tw:h-5" />
        </button>
      )}
      {!!imageUrls.length && (
        <button
          onClick={nextSlide}
          className="tw:absolute tw:top-1/2 tw:right-4 tw:-translate-y-1/2 tw:bg-white/70 tw:p-2 tw:border tw:border-gray-200  tw:rounded-full tw:shadow-md tw:hover:bg-white"
        >
          <ChevronRight className="tw:w-5 tw:h-5" />
        </button>
      )}
    </div>
  );
};

export default ImageSlider;
