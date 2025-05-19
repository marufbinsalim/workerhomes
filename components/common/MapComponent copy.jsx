import React, { useState, useRef, useEffect, useContext } from 'react'
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  Autocomplete,
} from '@react-google-maps/api'
import { LocationContext } from '@/context/LocationProvider'
import { useTranslations } from 'next-intl'
import Link from '@/components/common/Link'
import { toast } from 'react-toastify'

const libraries = ['places']

const LocationFinder = ({
  locations,
  zoom = 12,
  apiKey,
  setLocations,
  locale = 'en',
  defaultCenter,
}) => {
  const { location, address, updateLocation } = useContext(LocationContext) // Assuming locale is available here
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
    language: locale,
  })
  const t = useTranslations('hero')
  const t2 = useTranslations('listings')

  const [map, setMap] = useState(null)
  const [searchLocation, setSearchLocation] = useState(location)
  const [filteredLocations, setFilteredLocations] = useState(locations || [])
  const [autocomplete, setAutocomplete] = useState(null)
  const [inputValue, setInputValue] = useState(address || '')
  const [selectedMarker, setSelectedMarker] = useState(null)
  const [currentZoom, setCurrentZoom] = useState(zoom)
  const circleRef = useRef(null)

  useEffect(() => {
    if (location) {
      setSearchLocation(location)
    }
  }, [location])

  useEffect(() => {
    filterLocationsByZoom(currentZoom)
  }, [currentZoom, locations])

  useEffect(() => {
    if (searchLocation && map) {
      const updatedFilteredLocations = locations.filter(
        loc =>
          haversineDistance(
            [searchLocation.lat, searchLocation.lng],
            [loc.lat, loc.lng]
          ) <= loc.coverageArea
      )

      setFilteredLocations(updatedFilteredLocations)
      setLocations(updatedFilteredLocations)
      if (circleRef.current) {
        circleRef.current.setMap(null)
      }

      const circle = new google.maps.Circle({
        center: searchLocation,
        radius: 50000,
        strokeColor: '#FF0000',
        strokeOpacity: 0.01,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.09,
      })

      circle.setMap(map)
      circleRef.current = circle
      map.panTo(searchLocation)
    }
  }, [searchLocation, map, locations?.length])

  const filterLocationsByZoom = zoomLevel => {
    let updatedFilteredLocations = []

    if (zoomLevel <= 8) {
      updatedFilteredLocations = locations.filter(
        loc => loc.tier === 'Platinum'
      )
    } else if (zoomLevel >= 8 && zoomLevel < 12) {
      updatedFilteredLocations = locations.filter(loc =>
        ['Gold', 'Silver', 'Platinum'].includes(loc.tier)
      )
    } else {
      updatedFilteredLocations = locations
    }

    const newLocations = updatedFilteredLocations.filter(
      loc =>
        haversineDistance(
          [searchLocation?.lat, searchLocation?.lng],
          [loc.lat, loc.lng]
        ) <= loc.coverageArea
    )

    setFilteredLocations(newLocations)
  }

  const handlePlaceChanged = () => {
    const place = autocomplete.getPlace()
    if (place.geometry) {
      const newLocation = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      }

      let zipCode = ''

      if (place.address_components) {
        place.address_components.forEach(component => {
          if (component.types.includes('postal_code')) {
            zipCode = component.long_name
          }
        })
      }

      setSearchLocation(newLocation)
      updateLocation(newLocation, place.formatted_address, zipCode)
      setInputValue(place.formatted_address)
    } else {
      toast.warn(t2('messages.invalid'))
    }
  }

  const handleInput = event => {
    setInputValue(event.target.value)
  }

  const handleMarkerClick = location => {
    if (selectedMarker && selectedMarker.id === location.id) {
      setSelectedMarker(null)
    } else {
      setSelectedMarker(location)
    }
  }

  const handleZoomChanged = () => {
    if (map) {
      setCurrentZoom(map.getZoom())
    }
  }

  if (loadError) return <div>Error loading Google Maps</div>
  if (!isLoaded) return <div>Loading...</div>

  // Determine the language parameter based on locale
  const language = locale

  return (
    <div>
      <Autocomplete
        onLoad={auto => setAutocomplete(auto)}
        onPlaceChanged={handlePlaceChanged}
        fields={['geometry', 'formatted_address', 'address_components']}
      >
        <input
          type='search'
          placeholder={t('search.placeholder')}
          className='location-search-input'
          value={inputValue}
          onChange={handleInput}

          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              alert('Not allowed; select your location from the dropdown')
            }
          }}
        />
      </Autocomplete>

      <GoogleMap
        onLoad={mapInstance => setMap(mapInstance)}
        onZoomChanged={handleZoomChanged}
        zoom={zoom}
        center={
          searchLocation ||
          (locations.length > 0
            ? { lat: locations[0].lat, lng: locations[0].lng }
            : defaultCenter || { lat: 0, lng: 0 })
        }
        mapContainerStyle={{ height: '86.5vh', width: '100%' }}
        options={{
          language: locale, // Set the language parameter here
        }}
      >
        {/* Center Marker */}
        {searchLocation && (
          <Marker position={searchLocation} icon={{ color: 'red' }} />
        )}

        {filteredLocations.map(location => (
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
              location?.tier === 'Platinum'
                ? 4
                : location?.tier === 'Gold'
                  ? 3
                  : location?.tier === 'Silver'
                    ? 2
                    : 1
            }
          >
            {selectedMarker?.id === location.id && (
              <InfoWindow
                position={{ lat: location.lat, lng: location.lng }}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div className='location-card'>
                  <img
                    className='location-card-img'
                    src={location.image}
                    alt={location.name}
                    style={{
                      width: '200px',
                      height: '150px',
                    }}
                  />
                  <div className='location-content'>
                    <p className='location-card-title'>{location.name}</p>
                    <p className='location-card-address'>{location?.address}</p>
                    <Link
                      className='location-card-link'
                      href={`/listings/${location?.slug}`}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </InfoWindow>
            )}
          </Marker>
        ))}
      </GoogleMap>
    </div>
  )
}

export default LocationFinder

export const haversineDistance = (coords1, coords2) => {
  const [lat1, lon1] = coords1
  const [lat2, lon2] = coords2

  const R = 6371 // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

// import React, { useState, useRef, useEffect, useContext } from 'react'
// import {
//   GoogleMap,
//   useLoadScript,
//   Marker,
//   InfoWindow,
//   Autocomplete,
// } from '@react-google-maps/api'
// import { LocationContext } from '@/context/LocationProvider'
// import { useTranslations } from 'next-intl'
// import Link from '@/components/common/Link'
// import { toast } from 'react-toastify'

// const libraries = ['places']

// const LocationFinder = ({
//   locations,
//   zoom = 12,
//   apiKey,
//   setLocations,
//   locale = 'en',
//   defaultCenter,
// }) => {
//   const { location, address, updateLocation } = useContext(LocationContext) // Assuming locale is available here
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: apiKey,
//     libraries,
//     language: locale,
//   })
//   const t = useTranslations('hero')
//   const t2 = useTranslations('listings')

//   const [map, setMap] = useState(null)
//   const [searchLocation, setSearchLocation] = useState(location)
//   const [filteredLocations, setFilteredLocations] = useState(locations || [])
//   const [autocomplete, setAutocomplete] = useState(null)
//   const [inputValue, setInputValue] = useState(address || '')
//   const [selectedMarker, setSelectedMarker] = useState(null)
//   const [currentZoom, setCurrentZoom] = useState(zoom)
//   const circleRef = useRef(null)

//   useEffect(() => {
//     if (location) {
//       setSearchLocation(location)
//     }
//   }, [location])

//   useEffect(() => {
//     filterLocationsByZoom(currentZoom)
//   }, [currentZoom, locations])

//   useEffect(() => {
//     if (searchLocation && map) {
//       const updatedFilteredLocations = locations.filter(
//         loc =>
//           haversineDistance(
//             [searchLocation.lat, searchLocation.lng],
//             [loc.lat, loc.lng]
//           ) <= loc.coverageArea
//       )

//       setFilteredLocations(updatedFilteredLocations)
//       setLocations(updatedFilteredLocations)
//       if (circleRef.current) {
//         circleRef.current.setMap(null)
//       }

//       const circle = new google.maps.Circle({
//         center: searchLocation,
//         radius: 50000,
//         strokeColor: '#FF0000',
//         strokeOpacity: 0.01,
//         strokeWeight: 2,
//         fillColor: '#FF0000',
//         fillOpacity: 0.09,
//       })

//       circle.setMap(map)
//       circleRef.current = circle
//       map.panTo(searchLocation)
//     }
//   }, [searchLocation, map, locations?.length])

//   const filterLocationsByZoom = zoomLevel => {
//     let updatedFilteredLocations = []

//     if (zoomLevel <= 8) {
//       updatedFilteredLocations = locations.filter(
//         loc => loc.tier === 'Platinum'
//       )
//     } else if (zoomLevel >= 8 && zoomLevel < 12) {
//       updatedFilteredLocations = locations.filter(loc =>
//         ['Gold', 'Silver', 'Platinum'].includes(loc.tier)
//       )
//     } else {
//       updatedFilteredLocations = locations
//     }

//     const newLocations = updatedFilteredLocations.filter(
//       loc =>
//         haversineDistance(
//           [searchLocation?.lat, searchLocation?.lng],
//           [loc.lat, loc.lng]
//         ) <= loc.coverageArea
//     )

//     setFilteredLocations(newLocations)
//   }

//   const handlePlaceChanged = () => {
//     const place = autocomplete.getPlace()
//     if (place.geometry) {
//       const newLocation = {
//         lat: place.geometry.location.lat(),
//         lng: place.geometry.location.lng(),
//       }

//       let zipCode = ''

//       if (place.address_components) {
//         place.address_components.forEach(component => {
//           if (component.types.includes('postal_code')) {
//             zipCode = component.long_name
//           }
//         })
//       }

//       setSearchLocation(newLocation)
//       updateLocation(newLocation, place.formatted_address, zipCode)
//       setInputValue(place.formatted_address)
//     } else {
//       toast.warn(t2('messages.invalid'))
//     }
//   }

//   const handleInput = event => {
//     setInputValue(event.target.value)
//   }

//   const handleMarkerClick = location => {
//     if (selectedMarker && selectedMarker.id === location.id) {
//       setSelectedMarker(null)
//     } else {
//       setSelectedMarker(location)
//     }
//   }

//   const handleZoomChanged = () => {
//     if (map) {
//       setCurrentZoom(map.getZoom())
//     }
//   }

//   if (loadError) return <div>Error loading Google Maps</div>
//   if (!isLoaded) return <div>Loading...</div>

//   // Determine the language parameter based on locale
//   const language = locale

//   return (
//     <div>
//       <Autocomplete
//         onLoad={auto => setAutocomplete(auto)}
//         onPlaceChanged={handlePlaceChanged}
//         fields={['geometry', 'formatted_address', 'address_components']}
//       >
//         <input
//           type='search'
//           placeholder={t('search.placeholder')}
//           className='location-search-input'
//           value={inputValue}
//           onChange={handleInput}
//           onKeyDown={e => {
//             if (e.key === 'Enter') {
//               e.preventDefault()
//               alert('Not allowed; select your location from the dropdown')
//             }
//           }}
//         />
//       </Autocomplete>

//       <GoogleMap
//         onLoad={mapInstance => setMap(mapInstance)}
//         onZoomChanged={handleZoomChanged}
//         zoom={zoom}
//         center={
//           searchLocation ||
//           (locations.length > 0
//             ? { lat: locations[0].lat, lng: locations[0].lng }
//             : defaultCenter || { lat: 0, lng: 0 })
//         }
//         mapContainerStyle={{ height: '86.5vh', width: '100%' }}
//         options={{
//           language: locale, // Set the language parameter here
//         }}
//       >
//         {filteredLocations.map(location => (
//           <Marker
//             key={location.id}
//             position={{ lat: location.lat, lng: location.lng }}
//             onClick={() => handleMarkerClick(location)}
//             icon={{
//               url: location?.icon?.url,
//               scaledSize: new google.maps.Size(
//                 location?.icon?.size,
//                 location?.icon?.size
//               ),
//               origin: new google.maps.Point(0, 0),
//               anchor: new google.maps.Point(15, 15),
//             }}
//             zIndex={
//               location?.tier === 'Platinum'
//                 ? 4
//                 : location?.tier === 'Gold'
//                 ? 3
//                 : location?.tier === 'Silver'
//                 ? 2
//                 : 1
//             }
//           >
//             {selectedMarker?.id === location.id && (
//               <InfoWindow
//                 position={{ lat: location.lat, lng: location.lng }}
//                 onCloseClick={() => setSelectedMarker(null)}
//               >
//                 <div className='location-card'>
//                   <img
//                     className='location-card-img'
//                     src={location.image}
//                     alt={location.name}
//                     style={{
//                       width: '200px',
//                       height: '150px',
//                     }}
//                   />
//                   <div className='location-content'>
//                     <p className='location-card-title'>{location.name}</p>
//                     <p className='location-card-address'>{location?.address}</p>
//                     <Link
//                       className='location-card-link'
//                       href={`/listings/${location?.slug}`}
//                     >
//                       View Details
//                     </Link>
//                   </div>
//                 </div>
//               </InfoWindow>
//             )}
//           </Marker>
//         ))}
//       </GoogleMap>
//     </div>
//   )
// }

// export default LocationFinder

// export const haversineDistance = (coords1, coords2) => {
//   const [lat1, lon1] = coords1
//   const [lat2, lon2] = coords2

//   const R = 6371 // Radius of the Earth in km
//   const dLat = ((lat2 - lat1) * Math.PI) / 180
//   const dLon = ((lon2 - lon1) * Math.PI) / 180

//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos((lat1 * Math.PI) / 180) *
//       Math.cos((lat2 * Math.PI) / 180) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2)

//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

//   return R * c
// }
