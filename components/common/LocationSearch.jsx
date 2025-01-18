// LocationSearch.js
import React, { useContext, useEffect, useState } from 'react'
import { useLoadScript } from '@react-google-maps/api'

import { google_key } from '@/config'
import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import { LocationContext } from '@/context/LocationProvider'

const libraries = ['places']

const SUPPORTED_COUNTRIES = ['DE', 'PL', 'GB']

const LocationSearch = ({
  defaultValue,
  onPlaceSelected,
  type = 'auto',
  revalidate,
}) => {
  const { location, address, updateLocation } = useContext(LocationContext)
  const [searchValue, setSearchValue] = useState(defaultValue?.trim() || '')
  const [selected, setSelected] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [error, setError] = useState('')
  const t = useTranslations('hero')
  const router = useRouter()
  const locale = useParams().locale

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: google_key,
    libraries,
  })

  const handleInputChange = event => {
    setSearchValue(event.target.value)
    setError('')

    if (!isLoaded) return

    const autocompleteService =
      new window.google.maps.places.AutocompleteService()

    if (event.target.value.length > 2) {
      autocompleteService.getPlacePredictions(
        {
          input: event.target.value,
          componentRestrictions: { country: SUPPORTED_COUNTRIES },
        },
        (predictions, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setSuggestions(predictions)
          } else {
            setSuggestions([])
          }
        }
      )
    } else {
      setSuggestions([])
      onPlaceSelected({
        description: '',
        selection_type: 'manual',
        address_components: [],
      })
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
            onPlaceSelected({ ...placeDetails, selection_type: 'suggestion' })
            setSelected(placeDetails)

            const formatted_address = placeDetails.formatted_address
            const coordinates = {
              lat: placeDetails.geometry.location.lat(),
              lng: placeDetails.geometry.location.lng(),
            }

            updateLocation(coordinates, formatted_address)
            setError('')
          } else {
            setError('We do not support this location.')
          }
        }
      }
    )
  }

  useEffect(() => {
    if (defaultValue) {
      setSuggestions([])
      onPlaceSelected({
        description: defaultValue,
        selection_type: 'manual',
        address_components: [
          { long_name: defaultValue, types: ['locality'] },
          { long_name: defaultValue, types: ['postal_code'] },
          { long_name: defaultValue, types: ['country'] },
          { long_name: defaultValue, types: ['route'] },
          { long_name: defaultValue, types: ['sublocality'] },
        ],
      })
    }
  }, [defaultValue])

  return (
    <div className='location-search-container'>
      {type === 'auto' ? (
        <input
          type='text'
          value={searchValue}
          onChange={handleInputChange}
          placeholder={t('search.placeholder')}
          className='location-search-input'
          onKeyDown={e => {
            if (e.key === 'Enter') {
              setSuggestions([])
              onPlaceSelected({
                description: searchValue,
                selection_type: 'manual',
                address_components: [
                  { long_name: searchValue, types: ['locality'] },
                  { long_name: searchValue, types: ['postal_code'] },
                  { long_name: searchValue, types: ['country'] },
                  { long_name: searchValue, types: ['route'] },
                  { long_name: searchValue, types: ['sublocality'] },
                ],
              })
            }
          }}
        />
      ) : (
        <div className='row x-gap-10 justify-center items-center bg-white text-14 w-100 rounded-100 px-10 py-10'>
          <div className='col-12 col-md-9'>
            <div className='relative d-flex items-center'>
              <input
                className='input bg-white border-light rounded-100 px-50 py-20 text-14 lh-12'
                type='text'
                required
                onChange={handleInputChange}
                value={searchValue}
                placeholder={t('search.placeholder')}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    setSuggestions([])
                    router.push(`/${locale}/listings`)
                  }
                }}
              />
              <button
                type='submit'
                className='absolute d-flex items-center h-full'
              >
                <i className='icon-search text-20 px-15 text-dark-1' />
              </button>
            </div>
          </div>

          <div className='col-3 md:d-none'>
            <button
              className='mainSearch__submit button -dark-1 py-20 w-100 rounded-100 bg-blue-1 text-white'
              onClick={() => router.push(`/${locale}/listings`)}
            >
              <i className='icon-search text-20 mr-10' />
              {t('search.button')}
            </button>
          </div>
        </div>
      )}

      {suggestions.length > 0 && (
        <ul className='location-search-suggestions'>
          {suggestions.map(suggestion => (
            <li
              key={suggestion.place_id}
              onClick={() => handleSuggestionClick(suggestion)}
              className='location-search-suggestion-item'
            >
              {suggestion.description}
            </li>
          ))}
        </ul>
      )}
      {error && <p className='location-search-error'>{error}</p>}
    </div>
  )
}

export default LocationSearch
