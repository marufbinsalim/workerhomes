import { api, auth } from '@/config'
import { signIn } from '@/lib/services/auth'
import axios from 'axios'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import AzureProvider from 'next-auth/providers/azure-ad'
import { stripe } from './stripe'
import moment from 'moment'

export const authOptions = {
  providers: [
    AzureProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'Email address',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Enter your password',
        },
      },
      authorize: async credentials => {
        const res = await axios.post(`${api}/api/auth/local`, {
          identifier: credentials.email,
          password: credentials.password,
        })
        if (res.status === 200) {
          const { jwt, user } = res.data

          if (jwt) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
          }

          const getRole = await axios.get(
            `${api}/api/users/me?populate=role,image`,
            {
              headers: { Authorization: 'Bearer ' + jwt },
            }
          )

          if (getRole.status === 200) {
            const role = getRole.data?.role?.type
            const stripe_customer_id = getRole.data?.stripe_customer_id
            const image = getRole.data?.image?.url
            const locale = getRole?.data?.locale || 'pl'
            delete getRole.data.role
            delete getRole.data.image

            return {
              ...getRole.data,
              jwt,
              image,
              role,
              locale,
              stripe_customer_id,
            }
          } else {
            return null
          }
        } else {
          return null
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/login',
    signOut: '/',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (
        account &&
        account.provider === 'google' &&
        profile &&
        'email_verified' in profile
      ) {
        if (!profile.email_verified) return false
      }

      return true
    },
    async jwt({ token, trigger, account, user, session }) {
      if (trigger === 'update') {
        token.email = session.email
        token.name = session.name
      }

      if (account) {
        if (account.provider === 'google') {
          const strapiResponse = await fetch(
            `${api}/api/auth/${account.provider}/callback?access_token=${account.access_token}`,
            { cache: 'no-cache' }
          )

          if (!strapiResponse.ok) {
            const strapiError = await strapiResponse.json()
            throw new Error(strapiError.error.message)
          }

          const { jwt, user } = await strapiResponse.json()

          if (jwt) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
          }

          if (!user?.stripe_customer_id) {
            const stripeCustomer = await stripe.customers.create({
              email: user.email,
              name: account.username,
            })

            await axios.put(`${api}/api/users/${user.id}`, {
              stripe_customer_id: stripeCustomer.id,
              name: token.name,
              first_name: token.name,
              last_name: token.name,
            })
          }

          const getRole = await axios.get(
            `${api}/api/users/me?populate=role,image`,
            {
              headers: { Authorization: 'Bearer ' + jwt },
            }
          )

          if (getRole?.data) {
            const role = getRole.data?.role?.type
            const stripe_customer_id = getRole.data?.stripe_customer_id
            const image = getRole.data?.image?.url
            const locale = getRole?.data?.locale || 'pl'

            token.locale = locale
            token.role = role
            token.image = image
            token.stripe_customer_id = stripe_customer_id
          }

          token.jwt = jwt
          token.id = user.id
          token.name = token.name
          token.email = user.email
          token.provider = account.provider
        } else if (account.provider === 'azure-ad') {
          const strapiResponse = await fetch(
            `${api}/api/auth/${account.provider}/callback?code=${account.code}`,
            { cache: 'no-cache' }
          )

          if (!strapiResponse.ok) {
            const strapiError = await strapiResponse.json()
            throw new Error(strapiError.error.message)
          }

          const { jwt, user } = await strapiResponse.json()

          if (jwt) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
          }

          if (!user?.stripe_customer_id) {
            const stripeCustomer = await stripe.customers.create({
              email: user.email,
              name: account.username,
            })

            await axios.put(`${api}/api/users/${user.id}`, {
              stripe_customer_id: stripeCustomer.id,
              name: token.name,
              first_name: token.name,
              last_name: token.name,
            })
          }

          const getRole = await axios.get(
            `${api}/api/users/me?populate=role,image`,
            {
              headers: { Authorization: 'Bearer ' + jwt },
            }
          )

          if (getRole?.data) {
            const role = getRole.data?.role?.type
            const stripe_customer_id = getRole.data?.stripe_customer_id
            const image = getRole.data?.image?.url

            token.role = role
            token.image = image
            token.stripe_customer_id = stripe_customer_id
            token.provider = account.provider
          }

          token.jwt = jwt
          token.id = user.id
          token.name = token.name
          token.email = user.email
        } else {
          const isSignIn = user ? true : false

          if (isSignIn) {
            token.jwt = user.jwt
            token.id = user.id
            token.name = `${user?.first_name} ${user?.last_name}`
            token.username = user.username
            token.email = user.email
            token.role = user.role
            token.locale = user.locale
            token.provider = account.provider
            token.stripe_customer_id = user.stripe_customer_id
          }
        }
        if (token.id) {
          await axios.post(`${api}/api/sessions`, {
            data: {
              user: token.id,
              date: new Date(),
              time: moment(new Date()).format('HH:mm:ss:SSS'),
            },
          })
        }
      }

      return Promise.resolve(token)
    },

    async session({ token, session }) {
      const isSignIn = token ? true : false

      if (isSignIn) {
        session.jwt = token.jwt
        session.id = token.id
        session.role = token.role
        session.locale = token.locale
        session.provider = token.provider
        session.stripe_customer_id = token.stripe_customer_id
      }
      return Promise.resolve(session)
    },
  },
}
