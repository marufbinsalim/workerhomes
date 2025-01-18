'use client'

import { useRef, useState, useEffect } from 'react'
import GoogleMapReact from 'google-map-react'
import { url, google_key } from '@/config'
import { Icon } from '@iconify/react'
import { exactPath } from '@/utils'

const LocationFinder = ({
  locations = [],
  zoom,
  showDirections = true,
  fullHeight = true,
  hasCoverageArea = false,
  locale = 'en',
}) => {
  const [loading, setLoading] = useState(true)
  const [mapCenter, setMapCenter] = useState(null)
  const [directionsVisible, setDirectionsVisible] = useState(showDirections)
  const mapRef = useRef(null)
  const markersRef = useRef([])
  const circlesRef = useRef([]) // Reference to circles
  const directionsRendererRef = useRef(null) // DirectionsRenderer ref

  const createMarker = (map, location) => {
    const marker = new window.google.maps.Marker({
      position: location.coordinates,
      map: map,
      icon: {
        url: exactPath(location?.icon?.url || '/uploads/home_e14afd668e.png'),
        scaledSize: new window.google.maps.Size(
          location?.icon?.size,
          location?.icon?.size
        ),
      },
    })

    const infoWindow = new window.google.maps.InfoWindow({
      content: `<div class="location-card">
                  <img class="location-card-img" src="${location.image}" alt="${
        location.title
      }" style="width:200px;height:150px;"/>
                  <div class='location-content'>
                  <p class="location-card-title">${location.title}</p>
                  <p class="location-card-address">${location?.address}</p>
                  <a class="location-card-link" href=${
                    url + location?.slug
                  }>View Details</a>
                  </div>
                </div>`,
    })

    marker.addListener('click', () => {
      infoWindow.open(map, marker)
    })

    marker.addListener('blur', () => {
      infoWindow.close()
    })

    markersRef.current.push(marker)
  }

  const createCircle = (map, location) => {
    if (!hasCoverageArea) return null
    const circle = new window.google.maps.Circle({
      map: map,
      center: location.coordinates,
      radius: location.coverageArea * 1000, // Convert km to meters
      strokeColor: '#FF0000',
      strokeOpacity: 0.2,
      strokeWeight: 1,
      fillColor: '#FF0000',
      fillOpacity: 0.1,
    })

    circlesRef.current.push(circle)
  }

  const loadMarkersAndCircles = map => {
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []
    circlesRef.current.forEach(circle => circle.setMap(null))
    circlesRef.current = []

    locations.forEach(location => {
      createMarker(map, location)
      createCircle(map, location)
    })
  }

  const calculateAndDisplayRoute = (map, userLocation) => {
    const directionsService = new window.google.maps.DirectionsService()
    const directionsRenderer =
      directionsRendererRef.current ||
      new window.google.maps.DirectionsRenderer()

    directionsRenderer.setMap(map)
    directionsRendererRef.current = directionsRenderer

    if (locations.length > 0) {
      const destination = locations[0].coordinates

      directionsService.route(
        {
          origin: userLocation,
          destination: destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result)
          } else {
            console.error('Directions request failed due to ' + status)
          }
        }
      )
    }
  }

  const handleToggleDirections = () => {
    if (directionsVisible) {
      directionsRendererRef.current?.setMap(null)
    } else {
      navigator.geolocation.getCurrentPosition(
        position => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          calculateAndDisplayRoute(mapRef.current, userLocation)
        },
        () => {
          console.error('Error getting user location')
        }
      )
    }
    setDirectionsVisible(!directionsVisible)
  }

  useEffect(() => {
    if (locations.length > 0) {
      setLoading(true)
      setMapCenter(locations[0].coordinates)
      if (mapRef.current) {
        loadMarkersAndCircles(mapRef.current)
        setLoading(false)
      }
    }
  }, [locations])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }

          if (mapRef.current) {
            if (showDirections) {
              calculateAndDisplayRoute(mapRef.current, userLocation)
            } else {
              // Center the map if directions are not shown
              mapRef.current.setCenter(mapCenter)
              directionsRendererRef.current?.setMap(null) // Hide the directions path
            }
          }
        },
        () => {
          console.error('Error getting user location')
        }
      )
    } else {
      console.error('Geolocation is not supported by this browser.')
    }
  }, [mapRef.current, showDirections])

  if (!google_key) return <div>Google API key not set</div>

  return (
    <div style={{ position: 'relative' }}>
      {loading && locations?.length === 0 ? (
        <div
          className='loader'
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
          }}
        >
          <Icon
            icon='eos-icons:loading'
            style={{ fontSize: '48px', color: '#000' }}
          />
        </div>
      ) : locations.length > 0 ? (
        <div style={{ height: fullHeight ? '91vh' : '50vh', width: '100%' }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: google_key, language: locale }}
            center={mapCenter}
            defaultZoom={zoom || 12}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map }) => {
              mapRef.current = map
              loadMarkersAndCircles(map)
              setLoading(false)
              if (showDirections) {
                navigator.geolocation.getCurrentPosition(
                  position => {
                    const userLocation = {
                      lat: position.coords.latitude,
                      lng: position.coords.longitude,
                    }
                    calculateAndDisplayRoute(map, userLocation)
                  },
                  () => {
                    console.error('Error getting user location')
                  }
                )
              }

              // Add built-in Google Maps controls
              map.setOptions({
                mapTypeControl: true,
                streetViewControl: true,
                mapTypeId: window.google.maps.MapTypeId.ROADMAP,
              })
            }}
          />
          <button
            onClick={handleToggleDirections}
            style={{
              position: 'absolute',
              top: '10px',
              right: '60px',
              zIndex: 1000,
              padding: '5px 10px',
              backgroundColor: '#fff',
              borderRadius: '4px',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Icon
              icon={'fluent-mdl2:map-directions'}
              className={` ${directionsVisible ? 'text-blue-1' : ''}`}
              width={20}
              height={20}
            />
          </button>
        </div>
      ) : (
        <div
          className='w-100 text-center my-4'
          style={{
            height: '91vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <h5>No locations to display</h5>
        </div>
      )}
    </div>
  )
}

export default LocationFinder
