// components/LocationSearch2.js
import { useState, useEffect } from 'react'
import LocationFinder from '@/components/common/LocationFinder'

const LocationSearch2 = ({
  locations,
  zoom,
  showDirections,
  fullHeight,
  hasCoverageArea,
}) => {
  const [searchLocation, setSearchLocation] = useState({ lat: null, lng: null })
  const [searchRadius, setSearchRadius] = useState('')
  const [filteredLocations, setFilteredLocations] = useState(locations)

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const toRad = value => (value * Math.PI) / 180
    const R = 6371 // Earth's radius in km
    const dLat = toRad(lat2 - lat1)
    const dLng = toRad(lng2 - lng1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const handleSearchLocationChange = e => {
    const [lat, lng] = e.target.value.split(',').map(Number)
    setSearchLocation({ lat, lng })
  }

  const handleSearchRadiusChange = e => {
    setSearchRadius(e.target.value)
  }

  useEffect(() => {
    if (searchLocation.lat && searchLocation.lng && searchRadius) {
      const filtered = locations.filter(location => {
        const distance = calculateDistance(
          searchLocation.lat,
          searchLocation.lng,
          location.coordinates.lat,
          location.coordinates.lng
        )
        return distance <= searchRadius
      })
      setFilteredLocations(filtered)
    } else {
      setFilteredLocations(locations)
    }
  }, [searchLocation, searchRadius])

  return (
    <div>
      <h1>Find Locations</h1>
      <input
        type='text'
        placeholder='Enter search location (lat,lng)'
        onChange={handleSearchLocationChange}
      />
      <input
        type='number'
        placeholder='Enter search radius in km'
        onChange={handleSearchRadiusChange}
      />
      <LocationFinder
        locations={filteredLocations}
        zoom={zoom}
        showDirections={showDirections}
        fullHeight={fullHeight}
        hasCoverageArea={hasCoverageArea}
      />
    </div>
  )
}

export default LocationSearch2
