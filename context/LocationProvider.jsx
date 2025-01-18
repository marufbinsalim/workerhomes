import React, { createContext } from 'react'
import { useLocalStorage } from 'react-use'

export const LocationContext = createContext()

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useLocalStorage('location', null)
  const [address, setAddress] = useLocalStorage('address', '')
  const [zipCode, setZipCode] = useLocalStorage('zipCode', '')

  const updateLocation = (newLocation, newAddress, newZipCode) => {
    setLocation(newLocation)
    setAddress(newAddress)
    setZipCode(newZipCode)
  }

  return (
    <LocationContext.Provider
      value={{ location, address, zipCode, updateLocation }}
    >
      {children}
    </LocationContext.Provider>
  )
}
