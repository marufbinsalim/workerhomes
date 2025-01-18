import React, { useState, useEffect } from 'react'
import { useLoadScript } from '@react-google-maps/api'
import { google_key } from '@/config'

const libraries = ['places']
const SUPPORTED_COUNTRIES = ['DE', 'PL', 'GB']

const CityFinderInput = ({
  label,
  name,
  onChange,
  error,
  placeholder,
  required = false,
  value,
  setTouched,
  locale = 'en', // Add locale prop
  ...rest
}) => {
  const [searchValue, setSearchValue] = useState('')
  const [selectedCity, setSelectedCity] = useState(null)
  const [errorState, setErrorState] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [suggestions, setSuggestions] = useState([])

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: google_key,
    libraries,
  })

  // Sync searchValue with value prop
  // useEffect(() => {
  //   if (value?.cityName) {
  //     setSearchValue(value?.cityName || '')
  //   }

  //   console.log(value)
  // }, [value])

  const handleSearch = async searchTerm => {
    if (!isLoaded) return

    const autocompleteService =
      new window.google.maps.places.AutocompleteService()

    if (searchTerm.length > 2) {
      autocompleteService.getPlacePredictions(
        {
          input: searchTerm,
          componentRestrictions: { country: SUPPORTED_COUNTRIES },
          language: locale, // Set the language based on locale
        },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            // Filter suggestions to include only cities
            const citySuggestions = predictions.filter(prediction =>
              prediction.types.includes('locality')
            )
            setSuggestions(citySuggestions)
          } else {
            setSuggestions([])
          }
        }
      )
    } else {
      setSuggestions([])
      onChange && onChange(null)
    }
  }

  const handleSuggestionClick = place => {
    setSearchValue(place.description)
    setSuggestions([])

    const placesService = new window.google.maps.places.PlacesService(
      document.createElement('div')
    )

    placesService.getDetails(
      { placeId: place.place_id },
      (placeDetails, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const countryComponent = placeDetails.address_components.find(
            component => component.types.includes('country')
          )

          if (
            countryComponent &&
            SUPPORTED_COUNTRIES.includes(countryComponent.short_name)
          ) {
            const selectedCity = {
              cityName:
                placeDetails.address_components.find(comp =>
                  comp.types.includes('locality')
                )?.long_name || '',
              country: countryComponent.long_name,
              zipCode:
                placeDetails.address_components.find(comp =>
                  comp.types.includes('postal_code')
                )?.long_name || '',
              lat: placeDetails.geometry.location.lat(),
              lng: placeDetails.geometry.location.lng(),
            }

            setSelectedCity(selectedCity)
            onChange && onChange(selectedCity)
            setErrorState('')
          } else {
            setErrorState('We do not support this location.')
          }
        }
      }
    )
  }

  return (
    <div className='location-search-container'>
      <div
        className={
          errorState
            ? 'combobox-container has-error-border'
            : 'combobox-container'
        }
      >
        <label className='lh-1 text-16 text-light-1' htmlFor={name}>
          {'Select ' + label}
          {required && <span className='text-danger px-2'>*</span>}
        </label>
        <div className='combobox-input-container'>
          <input
            type='text'
            id={name}
            name={name}
            onChange={e => {
              setSearchValue(e.target.value)
              handleSearch(e.target.value)
            }}
            onClick={() => {
              setIsDropdownOpen(true)
            }}
            onBlur={e => {
              if (!e.target.value) {
                onChange(null)
                setTouched && setTouched({ [name]: true })
              }
              setTimeout(() => setIsDropdownOpen(false), 200)
            }}
            value={searchValue}
            required={required}
            placeholder={placeholder ?? 'Select a city'}
            className='combobox-input capitalize'
            {...rest}
          />
          {isDropdownOpen && (
            <div className='combobox-dropdown'>
              {suggestions.length <= 0 ? (
                <div className='combobox-dropdown-item' disabled>
                  No Items | Search for something
                </div>
              ) : (
                suggestions.map((place, index) => (
                  <div
                    key={index}
                    className={`combobox-dropdown-item capitalize ${
                      selectedCity?.cityName === place.description
                        ? 'selected'
                        : ''
                    }`}
                    onClick={() => handleSuggestionClick(place)}
                  >
                    {place.description}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      {errorState && <div className='combobox-error'>{errorState}</div>}
    </div>
  )
}

export default CityFinderInput

// import React, { useState, useEffect } from 'react'
// import { useLoadScript } from '@react-google-maps/api'
// import { google_key } from '@/config'

// const libraries = ['places']
// const SUPPORTED_COUNTRIES = ['DE', 'PL', 'GB']

// const CityFinderInput = ({
//   label,
//   name,
//   onChange,
//   error,
//   placeholder,
//   required = false,
//   value,
//   setTouched,
//   locale = 'en', // Add locale prop
//   ...rest
// }) => {
//   const [searchValue, setSearchValue] = useState('')
//   const [selectedCity, setSelectedCity] = useState(null)
//   const [errorState, setErrorState] = useState('')
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false)
//   const [suggestions, setSuggestions] = useState([])

//   const { isLoaded } = useLoadScript({
//     googleMapsApiKey: google_key,
//     libraries,
//   })

//   const handleSearch = async searchTerm => {
//     if (!isLoaded) return

//     const autocompleteService =
//       new window.google.maps.places.AutocompleteService()

//     if (searchTerm.length > 2) {
//       autocompleteService.getPlacePredictions(
//         {
//           input: searchTerm,
//           componentRestrictions: { country: SUPPORTED_COUNTRIES },
//           language: locale, // Set the language based on locale
//         },
//         (predictions, status) => {
//           if (status === window.google.maps.places.PlacesServiceStatus.OK) {
//             // Filter suggestions to include only cities
//             const citySuggestions = predictions.filter(prediction =>
//               prediction.types.includes('locality')
//             )
//             setSuggestions(citySuggestions)
//           } else {
//             setSuggestions([])
//           }
//         }
//       )
//     } else {
//       setSuggestions([])
//       onChange && onChange(null)
//     }
//   }

//   const handleSuggestionClick = place => {
//     setSearchValue(place.description)
//     setSuggestions([])

//     const placesService = new window.google.maps.places.PlacesService(
//       document.createElement('div')
//     )

//     placesService.getDetails(
//       { placeId: place.place_id },
//       (placeDetails, status) => {
//         if (status === window.google.maps.places.PlacesServiceStatus.OK) {
//           const countryComponent = placeDetails.address_components.find(
//             component => component.types.includes('country')
//           )

//           if (
//             countryComponent &&
//             SUPPORTED_COUNTRIES.includes(countryComponent.short_name)
//           ) {
//             const selectedCity = {
//               cityName:
//                 placeDetails.address_components.find(comp =>
//                   comp.types.includes('locality')
//                 )?.long_name || '',
//               country: countryComponent.long_name,
//               zipCode:
//                 placeDetails.address_components.find(comp =>
//                   comp.types.includes('postal_code')
//                 )?.long_name || '',
//               lat: placeDetails.geometry.location.lat(),
//               lng: placeDetails.geometry.location.lng(),
//             }

//             setSelectedCity(selectedCity)
//             onChange && onChange(selectedCity)
//             setErrorState('')
//           } else {
//             setErrorState('We do not support this location.')
//           }
//         }
//       }
//     )
//   }

//   return (
//     <div className='location-search-container'>
//       <div
//         className={
//           errorState
//             ? 'combobox-container has-error-border'
//             : 'combobox-container'
//         }
//       >
//         <label className='lh-1 text-16 text-light-1' htmlFor={name}>
//           {'Select ' + label}
//           {required && <span className='text-danger px-2'>*</span>}
//         </label>
//         <div className='combobox-input-container'>
//           <input
//             type='text'
//             id={name}
//             name={name}
//             onChange={e => {
//               setSearchValue(e.target.value)
//               handleSearch(e.target.value)
//             }}
//             onClick={() => {
//               setIsDropdownOpen(true)
//             }}
//             onBlur={e => {
//               if (!e.target.value) {
//                 onChange(null)
//                 setTouched && setTouched({ [name]: true })
//               }
//               setTimeout(() => setIsDropdownOpen(false), 200)
//             }}
//             value={searchValue}
//             required={required}
//             placeholder={placeholder ?? 'Select a city'}
//             className='combobox-input capitalize'
//             {...rest}
//           />
//           {isDropdownOpen && (
//             <div className='combobox-dropdown'>
//               {suggestions.length <= 0 ? (
//                 <div className='combobox-dropdown-item' disabled>
//                   No Items | Search for something
//                 </div>
//               ) : (
//                 suggestions.map((place, index) => (
//                   <div
//                     key={index}
//                     className={`combobox-dropdown-item capitalize ${
//                       selectedCity?.cityName === place.description
//                         ? 'selected'
//                         : ''
//                     }`}
//                     onClick={() => handleSuggestionClick(place)}
//                   >
//                     {place.description}
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//       {errorState && <div className='combobox-error'>{errorState}</div>}
//     </div>
//   )
// }

// export default CityFinderInput
