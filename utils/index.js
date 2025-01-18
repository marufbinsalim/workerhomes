import { api } from '@/config'
import moment from 'moment'
import { toast } from 'react-toastify'
import slugify from 'slugify'

import 'moment/locale/de' // German locale
import 'moment/locale/pl' // Polish locale

const changeLocale = locale => {
  const exactPath = currentPath.replace(/^\/[a-z]{2}/, '')
  router.push(`/${locale}${exactPath}`)
}

export const exactPath = path => {
  return api.replace(/\/api$/, '') + path
}

export function formatDate(input, time, locale = 'pl') {
  const date = new Date(input)

  // Map shorthand locale codes to full locale strings
  const localeMap = {
    en: 'en-US',
    de: 'de-DE',
    pl: 'pl-PL',
  }

  const selectedLocale = localeMap[locale] || 'pl-PL' // Default to Polish if locale is not found

  return date.toLocaleDateString(selectedLocale, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: time ? 'numeric' : undefined,
    minute: time ? 'numeric' : undefined,
    hour12: time,
  })
}

export const genSlug = text =>
  slugify(text, {
    replacement: '-',
    remove: undefined,
    lower: true,
    strict: false,
    locale: 'vi',
    trim: true,
  }) +
  '-' +
  new Date().getTime()

export const tryCatch =
  (fn, successMessage) =>
  async (...args) => {
    try {
      const res = await fn(...args)
      switch (res?.status) {
        case 200 || 201 || 204:
          if (successMessage) {
            toast.success(successMessage || 'Operation has been successfully.')
          }
          break
        default:
          toast.error('An error occurred:', res.message)
          break
      }
      return res
    } catch (error) {
      if (error) {
        switch (error?.response.status) {
          case 400 || 422 || 403 || 404 || 500 || 401:
            toast.error(error.response.statusText)
            break
          default:
            toast.error('An error occurred:', error.message)
            break
        }
      } else {
        toast.error('An error occurred:', error.message)
      }
    }
  }

export const getLocales = (currentLocale, translatedLocals, t) => {
  return [
    {
      label: t('default'),
      value: null,
      selected: true,
    },
    {
      label: t('en'),
      value: 'en',
    },
    {
      label: t('de'),
      value: 'de',
    },
    {
      label: t('pl'),
      value: 'pl',
    },
  ].filter(
    l =>
      l.value !== currentLocale &&
      translatedLocals?.find(m => m.locale === l.value) === undefined
  )
}

export function calculateRemainingTime(date) {
  const currentDate = moment()
  const expirationDate = moment(date)

  if (expirationDate.isSameOrBefore(currentDate)) {
    return 'Expired'
  }

  const years = expirationDate.diff(currentDate, 'years')
  currentDate.add(years, 'years')

  const months = expirationDate.diff(currentDate, 'months')
  currentDate.add(months, 'months')

  const weeks = expirationDate.diff(currentDate, 'weeks')
  currentDate.add(weeks, 'weeks')

  const days = expirationDate.diff(currentDate, 'days')

  const resultParts = []

  if (years > 0) {
    resultParts.push(`${years} ${years > 1 ? 'Ys' : 'Y'}`)
  }

  if (months > 0) {
    resultParts.push(`${months} ${months > 1 ? 'Ms' : 'M'}`)
  }

  if (weeks > 0) {
    resultParts.push(`${weeks} ${weeks > 1 ? 'Ws' : 'W'}`)
  }

  if (days > 0) {
    resultParts.push(`${days} ${days > 1 ? 'Ds' : 'D'}`)
  }

  return resultParts.join(', ')
}

export const getActiveSocialPlatforms = social => {
  if (!social) return []
  return Object.keys(social).filter(platform => social[platform])
}

export function getRandomLocations(center, radius, numberOfLocations) {
  const locations = []
  for (let i = 0; i < numberOfLocations; i++) {
    const randomPoint = getRandomPoint(center, radius)
    locations.push({
      id: i,
      lat: randomPoint.lat,
      lng: randomPoint.lng,
      name: `Home ${i + 1}`,
      address: `Address ${i + 1}, Düren, Germany`,
      coverageArea: radius, // Coverage area of 20km for each location
    })
  }
  return locations
}

function getRandomPoint(center, radius) {
  const radiusInDegrees = radius / 111 // Convert radius in km to degrees
  const randomAngle = Math.random() * 2 * Math.PI
  const randomDistance = Math.random() * radiusInDegrees
  const offsetLat = randomDistance * Math.cos(randomAngle)
  const offsetLng = randomDistance * Math.sin(randomAngle)

  return {
    lat: center.lat + offsetLat,
    lng: center.lng + offsetLng,
  }
}

export function getFromNowInLocale(locale, date) {
  // Set the locale
  moment.locale(locale)

  // Return the "from now" string
  return moment(date).fromNow()
}

export const getType = (locale, type) => {
  if (locale === 'en') {
    return type
  } else if (locale === 'pl' && type === 'SINGLE ROOMS') {
    return 'POJEDYNCZE POKOJE'
  } else if (locale === 'pl' && type === 'DOUBLE ROOMS') {
    return 'PODWÓJNE POKOJE'
  } else if (locale === 'pl' && type === 'WHOLE ACCOMMODATION') {
    return 'CAŁE MIESZKANIE'
  } else if (locale === 'pl' && type === 'DOUBLE ROOMS') {
    return 'PODWÓJNE POKOJE'
  } else if (locale === 'pl' && type === 'SHARED ROOMS') {
    return 'POKÓJ WIELOOSOBOWY'
  } else if (locale === 'de' && type === 'WHOLE ACCOMMODATION') {
    return 'GANZE UNTERKUNFT'
  } else if (locale === 'de' && type === 'DOUBLE ROOMS') {
    return 'DOPPELZIMMER'
  } else if (locale === 'de' && type === 'SHARED ROOMS') {
    return 'GEMEINSAMES ZIMMER'
  } else if (locale === 'de' && type === 'SINGLE ROOMS') {
    return 'EINZELZIMMER'
  }
}
