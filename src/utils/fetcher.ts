import axios from 'axios'

// const fetcher = <T>(url: string, headers = {}) =>
//   axios
//     .get<T>(url, {
//       headers, // !
//       withCredentials: true,
//     })
//     .then((res) => res.data)

// ! Server Error AxiosError: Request failed with status code 404
// ! Uncaught AxiosError: Request failed with status code 404
// ! GET http://localhost:3000/ 500 (Internal Server Error)

// !GET http://localhost:1337/api/me 403 (Forbidden)
// ! {message: 'Request failed with status code 403', name: 'AxiosError', code: 'ERR_BAD_REQUEST', config: {…}, request: XMLHttpRequest, …}

const fetcher = async <T>(url: string, headers = {}) => {
  try {
    const { data } = await axios.get<T>(url, {
      headers,
      withCredentials: true,
    })
    // console.log('headers', headers)
    return data
  } catch (error) {
    console.log('fetcher error', error)
    return null
  }
}

export default fetcher
