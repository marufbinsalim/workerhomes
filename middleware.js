import { withAuth } from 'next-auth/middleware'
import createIntlMiddleware from 'next-intl/middleware'
import { NextRequest } from 'next/server'

const locales = ['en', 'de', 'pl']
const publicPages = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/pricing',
  '/bookmarks',
  '/not-found',
  '/blogs',
  '/guides',
  '/contact',
  '/listings',
  '/faqs',
  '/become-hosted',
  '/forgot-password',
  '/reset-password',
  '/privacy',
  '/terms',
  '/about',
  '/email-verified',
]

// Dynamic route patterns
const dynamicRoutes = [
  '/blogs/.*', // Matches /blogs/[slug]
  '/listings/.*', // Matches /dwellings/[slug]
]

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: 'pl',
  localeDetection: false,
})

const authMiddleware = withAuth(
  function onSuccess(req) {
    return intlMiddleware(req)
  },
  {
    callbacks: {
      authorized: ({ token }) => token != null,
    },
    pages: {
      signIn: '/login',
    },
  }
)

export default function middleware(req) {
  const publicPathnameRegex = RegExp(
    `^(/(${locales.join('|')}))?(${publicPages
      .flatMap(p => (p === '/' ? ['', '/'] : p))
      .concat(dynamicRoutes)
      .join('|')})/?$`,
    'i'
  )

  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname)

  if (isPublicPage) {
    return intlMiddleware(req)
  } else {
    return authMiddleware(req)
  }
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
}
