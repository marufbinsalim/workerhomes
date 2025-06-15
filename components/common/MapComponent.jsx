import React, { useState, useRef, useEffect, useContext } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  Autocomplete,
} from "@react-google-maps/api";
import { LocationContext } from "@/context/LocationProvider";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { FiSearch } from "react-icons/fi";

const libraries = ["places"];

const LocationFinder = ({
  locations,
  zoom = 12,
  apiKey,
  setLocations,
  locale = "en",
  defaultCenter,
  search = true,
}) => {
  const { location, address, updateLocation } = useContext(LocationContext); // Assuming locale is available here
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
    language: locale,
  });
  const t = useTranslations("hero");
  const t2 = useTranslations("listings");

  const [map, setMap] = useState(null);
  const [searchLocation, setSearchLocation] = useState(location);
  const [filteredLocations, setFilteredLocations] = useState(locations || []);
  const [autocomplete, setAutocomplete] = useState(null);
  const [inputValue, setInputValue] = useState(address || "");
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const circleRef = useRef(null);

  useEffect(() => {
    if (location) {
      setSearchLocation(location);
    }
  }, [location]);

  useEffect(() => {
    filterLocationsByZoom(currentZoom);
  }, [currentZoom, locations]);

  useEffect(() => {
    if (searchLocation && map) {
      const updatedFilteredLocations = locations.filter(
        (loc) =>
          haversineDistance(
            [searchLocation.lat, searchLocation.lng],
            [loc.lat, loc.lng]
          ) <= loc.coverageArea
      );

      setFilteredLocations(updatedFilteredLocations);
      setLocations(updatedFilteredLocations);
      if (circleRef.current) {
        circleRef.current.setMap(null);
      }

      const circle = new google.maps.Circle({
        center: searchLocation,
        radius: 50000,
        strokeColor: "#FF0000",
        strokeOpacity: 0.01,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.09,
      });

      circle.setMap(map);
      circleRef.current = circle;
      map.panTo(searchLocation);
    }
  }, [searchLocation, map, locations?.length]);

  const filterLocationsByZoom = (zoomLevel) => {
    let updatedFilteredLocations = [];

    if (zoomLevel <= 8) {
      updatedFilteredLocations = locations.filter(
        (loc) => loc.tier === "Platinum"
      );
    } else if (zoomLevel >= 8 && zoomLevel < 12) {
      updatedFilteredLocations = locations.filter((loc) =>
        ["Gold", "Silver", "Platinum"].includes(loc.tier)
      );
    } else {
      updatedFilteredLocations = locations;
    }

    const newLocations = updatedFilteredLocations.filter(
      (loc) =>
        haversineDistance(
          [searchLocation?.lat, searchLocation?.lng],
          [loc.lat, loc.lng]
        ) <= loc.coverageArea
    );

    setFilteredLocations(newLocations);
  };

  const handlePlaceChanged = () => {
    const place = autocomplete.getPlace();
    if (place.geometry) {
      const newLocation = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };

      let zipCode = "";

      if (place.address_components) {
        place.address_components.forEach((component) => {
          if (component.types.includes("postal_code")) {
            zipCode = component.long_name;
          }
        });
      }

      setSearchLocation(newLocation);
      updateLocation(newLocation, place.formatted_address, zipCode);
      setInputValue(place.formatted_address);
    } else {
      toast.warn(t2("messages.invalid"));
    }
  };

  const handleInput = (event) => {
    setInputValue(event.target.value);
  };

  const handleMarkerClick = (location) => {
    if (selectedMarker && selectedMarker.id === location.id) {
      setSelectedMarker(null);
    } else {
      setSelectedMarker(location);
    }
  };

  const handleZoomChanged = () => {
    if (map) {
      setCurrentZoom(map.getZoom());
    }
  };

  if (loadError) return <div>Error loading Google Maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  // Determine the language parameter based on locale
  const language = locale;

  return (
    <div className="tw:relative font-primary tw:h-full tw:w-full">
      {/* Google Map */}
      <GoogleMap
        onLoad={(mapInstance) => setMap(mapInstance)}
        onZoomChanged={handleZoomChanged}
        zoom={zoom}
        center={
          searchLocation ||
          (locations.length > 0
            ? { lat: locations[0].lat, lng: locations[0].lng }
            : defaultCenter || { lat: 0, lng: 0 })
        }
        mapContainerStyle={{
          height: "100%",
          width: "100%",
          paddingBottom: "50px",
        }}
        options={{
          mapTypeControl: true,
          mapTypeControlOptions: {
            position: window.google.maps.ControlPosition.TOP_RIGHT,
            style: window.google.maps.MapTypeControlStyle.DEFAULT,
          },
          streetViewControl: true, // Enable Street View
          streetViewControlOptions: {
            position: window.google.maps.ControlPosition.RIGHT_BOTTOM,
          },
          gestureHandling: "greedy", // This enables dragging on all devices
          language: locale,
        }}
      >
        {/* Center Marker */}
        {searchLocation && (
          <Marker position={searchLocation} icon={{ color: "red" }} />
        )}

        {filteredLocations.map((location) => (
          <Marker
            key={location.id}
            position={{ lat: location.lat, lng: location.lng }}
            onClick={() => handleMarkerClick(location)}
            icon={{
              url: location?.icon?.url,
              scaledSize: new google.maps.Size(
                location?.icon?.size,
                location?.icon?.size
              ),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(15, 15),
            }}
            zIndex={
              location?.tier === "Platinum"
                ? 4
                : location?.tier === "Gold"
                ? 3
                : location?.tier === "Silver"
                ? 2
                : 1
            }
          >
            {selectedMarker?.id === location.id && (
              <InfoWindow
                position={{ lat: location.lat, lng: location.lng }}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div className="tw:max-w-xs">
                  <img
                    src={location.image}
                    alt={location.name}
                    className="tw:w-full tw:h-32 tw:object-cover tw:rounded-t"
                  />
                  <div className="tw:p-3">
                    <h3 className="tw:font-bold tw:text-lg">{location.name}</h3>
                    <p className="tw:text-gray-600 tw:text-sm">
                      {location?.address}
                    </p>
                    <a
                      href={`/listings/${location?.slug}`}
                      className="tw:mt-2 tw:inline-block tw:text-blue-600 tw:hover:text-blue-800"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </InfoWindow>
            )}
          </Marker>
        ))}
      </GoogleMap>
      {search && (
        <div className="tw:absolute tw:bottom-4 tw:left-0 tw:right-0 tw:z-[20] tw:flex tw:justify-center">
          <div className="tw:relative">
            <Autocomplete
              onLoad={setAutocomplete}
              onPlaceChanged={handlePlaceChanged}
              fields={["geometry", "formatted_address"]}
            >
              <div className="tw:relative">
                <div className="tw:absolute tw:inset-y-0 tw:left-0 tw:flex tw:items-center tw:pl-3 tw:pointer-events-none">
                  <FiSearch className="tw:text-white tw:text-opacity-70 tw:w-6 tw:h-6" />
                </div>
                <input
                  type="search"
                  placeholder="See more on map"
                  className="tw:w-[199px] tw:h-[44px] tw:pl-10 tw:pr-4 tw:py-2 tw:placeholder:text-white tw:bg-[#040342] tw:shadow-[0px_4px_16px_0px_#0000000F] tw:text-white tw:placeholder:text-lg tw:placeholder:leading-none tw:placeholder:text-center tw:placeholder:align-middle"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
            </Autocomplete>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationFinder;

export const haversineDistance = (coords1, coords2) => {
  const [lat1, lon1] = coords1;
  const [lat2, lon2] = coords2;

  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};
