'use client'

import { useRef, useState, useEffect } from 'react'
import GoogleMapReact from 'google-map-react'
import { google_key } from '@/config'
import { Icon } from '@iconify/react'
import { toast } from 'react-toastify'

// Allowed countries by ISO country codes
const allowedCountries = ['DE', 'PL', 'GB'] // Germany, Poland, England

const LocationPicker = ({
  t,
  value = {
    street: '',
    city: '',
    zip_code: '',
    country: '',
    coordinates: { lat: 0, lng: 0 },
  },
  onChange,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const mapRef = useRef(null)
  const markerRef = useRef(null)

  // Fetch location details using latitude and longitude
  const fetchLocationDetails = async (lat, lng) => {
    setIsLoading(true)
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${google_key}`
    )
    setIsLoading(false)
    const data = await response.json()

    if (data.results && data.results[0]) {
      const addressComponents = data.results[0].address_components
      const countryCode = getAddressComponent(
        addressComponents,
        'country',
        true
      )

      // Check if the country code is in the allowedCountries array
      if (!allowedCountries.includes(countryCode)) {
        toast.error(t('messages.not-valid-country'))
        return
      }

      let city
      if (countryCode === 'GB') {
        city =
          getAddressComponent(addressComponents, 'postal_town') ||
          getAddressComponent(addressComponents, 'locality')
      } else {
        city = getAddressComponent(addressComponents, 'locality')
      }

      const location = {
        street:
          getAddressComponent(addressComponents, 'route') +
          ' ' +
          getAddressComponent(addressComponents, 'street_number'),
        city,
        zip_code: getAddressComponent(addressComponents, 'postal_code'),
        country: countryCode,
        coordinates: { lat, lng },
      }
      onChange(location)
    }
  }

  // Fetch coordinates based on the provided address
  const fetchCoordinates = async () => {
    const { street, city, zip_code, country } = value

    if (!street || !city) {
      onChange({ ...value, coordinates: null })
      return
    }

    const address = `${street}, ${city}, ${zip_code}, ${country}`

    setIsLoading(true)
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${google_key}`
    )
    setIsLoading(false)
    const data = await response.json()
    if (data.results && data.results[0]) {
      const addressComponents = data.results[0].address_components
      const countryCode = getAddressComponent(
        addressComponents,
        'country',
        true
      )

      if (!allowedCountries.includes(countryCode)) {
        toast.error(t('messages.not-valid-country'))
        onChange({
          ...value,
          coordinates: null,
        })
        return
      }

      const location = data.results[0].geometry.location
      const newCoordinates = { lat: location.lat, lng: location.lng }

      onChange({
        ...value,
        coordinates: newCoordinates,
      })

      if (location.lat && location.lng) {
        fetchLocationDetails(location.lat, location.lng)
      }

      // Update the marker position
      if (markerRef.current) {
        markerRef.current.setPosition(newCoordinates)
      }
    }
  }

  // Get address component, optionally returning the short name (for country code)
  const getAddressComponent = (components, type, shortName = false) => {
    const component = components.find(component =>
      component.types.includes(type)
    )
    return component
      ? shortName
        ? component.short_name
        : component.long_name
      : ''
  }

  // Handle map click and update location
  const handleMapClick = ({ lat, lng }) => {
    if (markerRef.current) {
      markerRef.current.setPosition({ lat, lng })
    }
    fetchLocationDetails(lat, lng)
  }

  // Initialize the Google map with marker
  const initializeMap = map => {
    mapRef.current = map
    if (value.coordinates && value.coordinates.lat && value.coordinates.lng) {
      const { lat, lng } = value.coordinates
      markerRef.current = new window.google.maps.Marker({
        position: { lat, lng },
        map: map,
        draggable: true,
        icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
      })

      markerRef.current.addListener('dragend', event => {
        const newLat = event.latLng.lat()
        const newLng = event.latLng.lng()
        fetchLocationDetails(newLat, newLng)
      })
    }
  }

  useEffect(() => {
    if (value.coordinates && value.coordinates.lat && value.coordinates.lng) {
      fetchLocationDetails(value.coordinates.lat, value.coordinates.lng)
    }
  }, [])

  // Handle button click to fetch coordinates
  const handleButtonClick = () => {
    fetchCoordinates()
  }

  const coordinatesSet =
    value.coordinates && value.coordinates.lat && value.coordinates.lng

  if (!google_key) return <div>{t('messages.no-api-key')}</div>

  return (
    <div>
      <div>
        <button
          type='button'
          className='button -sm -dark-1 bg-blue-1 text-white mb-2 col-auto'
          disabled={!value.street || !value.city || isLoading}
          onClick={handleButtonClick}
        >
          <Icon
            icon={isLoading ? 'line-md:loading-loop' : 'tabler:refresh'}
            className='mr-10'
            width={20}
            height={20}
          />
          {t('load')}
        </button>
      </div>
      {coordinatesSet ? (
        <div style={{ height: '500px', width: '100%' }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: google_key }}
            center={coordinatesSet ? value.coordinates : { lat: 0, lng: 0 }}
            defaultZoom={coordinatesSet ? 21 : 2}
            onClick={handleMapClick}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map }) => {
              initializeMap(map)
            }}
          />
        </div>
      ) : (
        <div className='w-100 text-center my-4'>
          <h5>{t('messages.need-to-load')}</h5>
        </div>
      )}
    </div>
  )
}

export default LocationPicker

// 'use client'

// import { useRef, useState, useEffect } from 'react'
// import GoogleMapReact from 'google-map-react'
// import { google_key } from '@/config'
// import { Icon } from '@iconify/react'
// import { toast } from 'react-toastify'

// // Allowed countries by ISO country codes
// const allowedCountries = ['DE', 'PL', 'GB'] // Germany, Poland, England

// const LocationPicker = ({
//   t,
//   value = {
//     street1: '',
//     street2: '',
//     city: '',
//     zip: '',
//     country: '',
//     coordinates: { lat: 0, lng: 0 },
//   },
//   onChange,
// }) => {
//   const [isLoading, setIsLoading] = useState(false)
//   const mapRef = useRef(null)
//   const markerRef = useRef(null)

//   // Fetch location details using latitude and longitude
//   const fetchLocationDetails = async (lat, lng) => {
//     setIsLoading(true)
//     const response = await fetch(
//       `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${google_key}`
//     )
//     setIsLoading(false)
//     const data = await response.json()

//     if (data.results && data.results[0]) {
//       const addressComponents = data.results[0].address_components
//       const countryCode = getAddressComponent(
//         addressComponents,
//         'country',
//         true
//       )

//       // Check if the country code is in the allowedCountries array
//       if (!allowedCountries.includes(countryCode)) {
//         toast.error(t('messages.not-valid-country'))
//         return
//       }

//       const location = {
//         street1:
//           getAddressComponent(addressComponents, 'street_address') ||
//           getAddressComponent(addressComponents, 'route'),
//         street2:
//           getAddressComponent(addressComponents, 'sublocality') ||
//           getAddressComponent(addressComponents, 'locality'),
//         city: getAddressComponent(
//           addressComponents,
//           'administrative_area_level_1'
//         ),
//         zip: getAddressComponent(addressComponents, 'postal_code'),
//         country: countryCode,
//         coordinates: { lat, lng },
//       }
//       onChange(location)
//     }
//   }

//   // Fetch coordinates based on the provided address
//   const fetchCoordinates = async () => {
//     const { street1, street2, city, zip, country } = value

//     if (!street1 || !city) {
//       onChange({ ...value, coordinates: null })
//       return
//     }

//     const address = `${street1}, ${street2 || ''}, ${city}, ${zip}, ${country}`

//     setIsLoading(true)
//     const response = await fetch(
//       `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
//         address
//       )}&key=${google_key}`
//     )
//     setIsLoading(false)
//     const data = await response.json()
//     if (data.results && data.results[0]) {
//       const addressComponents = data.results[0].address_components
//       const countryCode = getAddressComponent(
//         addressComponents,
//         'country',
//         true
//       )

//       if (!allowedCountries.includes(countryCode)) {
//         toast.error(t('messages.not-valid-country'))
//         onChange({
//           ...value,
//           coordinates: null,
//         })
//         return
//       }

//       const location = data.results[0].geometry.location
//       const newCoordinates = { lat: location.lat, lng: location.lng }

//       onChange({
//         ...value,
//         coordinates: newCoordinates,
//       })

//       if (location.lat && location.lng) {
//         fetchLocationDetails(location.lat, location.lng)
//       }

//       // Update the marker position
//       if (markerRef.current) {
//         markerRef.current.setPosition(newCoordinates)
//       }
//     }
//   }

//   // Get address component, optionally returning the short name (for country code)
//   const getAddressComponent = (components, type, shortName = false) => {
//     const component = components.find(component =>
//       component.types.includes(type)
//     )
//     return component
//       ? shortName
//         ? component.short_name
//         : component.long_name
//       : null
//   }

//   // Handle map click and update location
//   const handleMapClick = ({ lat, lng }) => {
//     if (markerRef.current) {
//       markerRef.current.setPosition({ lat, lng })
//     }
//     fetchLocationDetails(lat, lng)
//   }

//   // Initialize the Google map with marker
//   const initializeMap = map => {
//     mapRef.current = map
//     if (value.coordinates && value.coordinates.lat && value.coordinates.lng) {
//       const { lat, lng } = value.coordinates
//       markerRef.current = new window.google.maps.Marker({
//         position: { lat, lng },
//         map: map,
//         draggable: true,
//         icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
//       })

//       markerRef.current.addListener('dragend', event => {
//         const newLat = event.latLng.lat()
//         const newLng = event.latLng.lng()
//         fetchLocationDetails(newLat, newLng)
//       })
//     }
//   }

//   useEffect(() => {
//     if (value.coordinates && value.coordinates.lat && value.coordinates.lng) {
//       fetchLocationDetails(value.coordinates.lat, value.coordinates.lng)
//     }
//   }, [])

//   // Handle button click to fetch coordinates
//   const handleButtonClick = () => {
//     fetchCoordinates()
//   }

//   const coordinatesSet =
//     value.coordinates && value.coordinates.lat && value.coordinates.lng

//   if (!google_key) return <div>{t('messages.no-api-key')}</div>

//   return (
//     <div>
//       <div>
//         <button
//           type='button'
//           className='button -sm -dark-1 bg-blue-1 text-white mb-2 col-auto'
//           disabled={!value.street1 || !value.city || isLoading}
//           onClick={handleButtonClick}
//         >
//           <Icon
//             icon={isLoading ? 'line-md:loading-loop' : 'tabler:refresh'}
//             className='mr-10'
//             width={20}
//             height={20}
//           />
//           {t('load')}
//         </button>
//       </div>
//       {coordinatesSet ? (
//         <div style={{ height: '500px', width: '100%' }}>
//           <GoogleMapReact
//             bootstrapURLKeys={{ key: google_key }}
//             center={coordinatesSet ? value.coordinates : { lat: 0, lng: 0 }}
//             defaultZoom={coordinatesSet ? 18 : 2}
//             onClick={handleMapClick}
//             yesIWantToUseGoogleMapApiInternals
//             onGoogleApiLoaded={({ map }) => {
//               initializeMap(map)
//             }}
//           />
//         </div>
//       ) : (
//         <div className='w-100 text-center my-4'>
//           <h5>{t('messages.need-to-load')}</h5>
//         </div>
//       )}
//     </div>
//   )
// }

// export default LocationPicker
