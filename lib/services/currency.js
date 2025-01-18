import axios from 'axios'

export const getExchange = async (from, to, amount) => {
  try {
    const { data } = await axios.get(
      `https://Exchange-Rate.proxy-production.allthingsdev.co/ExchangeRate?fromCurrency=${from}&toCurrency=${to}&amount=${amount}`,
      {
        headers: {
          'x-apihub-key': 'BeWDnL7fEvMzFeBRokFo1WGJb-DcwhPxyt7BsKedvDzSU95apG',
          'x-apihub-host': 'Exchange-Rate.allthingsdev.co',
          'x-apihub-endpoint': 'c9207840-b078-4940-be6f-ffb3034ac644',
        },
      }
    )

    return { ...data, convertedAmount: data?.convertedAmount.toFixed(2) }
  } catch (error) {
    console.log(error)
  }
}

export const getCurrency = locale => {
  return locale === 'de'
    ? {
        key: 'EUR',
        symbol: '€',
      }
    : locale === 'pl'
    ? {
        key: 'PLN',
        symbol: 'zł',
      }
    : {
        key: 'GBP',
        symbol: '£',
      }
}
