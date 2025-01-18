'use client'

import React, { useReducer, useContext, useEffect, useMemo } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { toast } from 'react-toastify'

// Initial state for bookmarks
const initialState = {
  items: [],
}

// Bookmark reducer function
const bookmarkReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_BOOKMARK':
      return { ...state, items: addItem(state.items, action.item) }
    case 'REMOVE_BOOKMARK':
      return { ...state, items: removeItem(state.items, action.id) }
    case 'SET_ITEMS':
      return { ...state, items: action.items }
    default:
      return state
  }
}

// Utility functions for adding and removing items
const addItem = (items, item) => {
  if (!items.find(existingItem => existingItem.id === item.id)) {
    return [...items, item]
  }
  return items
}

const removeItem = (items, id) => {
  return items.filter(item => item.id !== id)
}

// Create context
const BookmarkContext = React.createContext()

export const useBookmarks = () => {
  const context = useContext(BookmarkContext)
  if (context === undefined) {
    throw new Error('useBookmarks must be used within a BookmarkProvider')
  }
  return context
}

// Provider component
export const BookmarkProvider = ({ children, userId }) => {
  const [state, dispatch] = useReducer(bookmarkReducer, initialState)
  const [isLoading, setIsLoading] = React.useState(false)

  const { data: session } = useSession()

  // Fetch bookmarks from backend
  const fetchBookmarks = async () => {
    try {
      const response = await axios.put(
        `/api/bookmarks/users/${userId || session?.id}`
      )
      dispatch({ type: 'SET_ITEMS', items: response.data })
    } catch (error) {
      console.error('Error fetching bookmarks:', error)
    }
  }

  useEffect(() => {
    if (userId || session?.id) {
      fetchBookmarks()
    }
  }, [userId])

  // Function to handle bookmark toggle (add/remove) and refetch bookmarks
  const toggleBookmark = async (listingId, id) => {
    setIsLoading(true)
    try {
      if (!id) {
        return
      }

      // Toggle bookmark by calling the API
      const response = await axios.post(`/api/bookmarks/${listingId}/${id}`)
      const { status, data } = response

      if (status === 200) {
        // Refetch bookmarks after a successful toggle
        await fetchBookmarks()
        toast.success('Bookmark updated successfully')
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const isBookmarked = id => {
    if (state?.items?.data?.length > 0) {
      return state?.items?.data?.find(bookmark => bookmark?.dwelling?.id === id)
    } else {
      return false
    }
  }

  const totalBookmarks = state?.items?.length || 0
  const value = useMemo(
    () => ({
      ...state,
      toggleBookmark,
      isBookmarked,
      totalBookmarks,
      isLoading,
    }),
    [state]
  )

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  )
}
