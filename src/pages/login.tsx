import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { object, string, TypeOf } from 'zod'

const createSessionSchema = object({
  email: string().email('Not a valid email').nonempty({
    message: 'Email is required',
  }),
  password: string().min(6, 'Password too short - should be 6 chars. minimum').nonempty({
    message: 'Password is required',
  }),
})

type CreateSessionInput = TypeOf<typeof createSessionSchema>

const LoginPage = () => {
  const router = useRouter()
  const [loginError, setLoginError] = useState<string | null>(null)
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateSessionInput>({
    resolver: zodResolver(createSessionSchema),
  })

  const onSubmit = async (values: CreateSessionInput) => {
    console.log('form values', values)
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/sessions`, values, {
        withCredentials: true, // cookies tokens
      })
      router.push('/')
    } catch (error) {
      // onSubmit error AxiosError {message: 'Unsupported protocol localhost:', name: 'AxiosError', code: 'ERR_BAD_REQUEST', config: {…}, stack: 'AxiosError: Unsupported protocol localhost:\n    at…dules/react-hook-form/dist/index.esm.mjs:2028:19)'}
      // setLoginError(error.message) // ! 'error' is of type 'unknown'.ts(18046)
      // ! offline server -> Unsupported protocol localhost: // Network Error // Request failed with status code 400
      if (axios.isAxiosError(error)) {
        setLoginError(error.message)
        console.log('onSubmit error.status', error.status)
        console.log('onSubmit error.response', error.response)
      } else {
        console.log('onSubmit error', error)
      }
    }
  }

  console.log('errors', errors)

  return (
    <div
      style={{
        padding: '2rem',
      }}
    >
      <Link href='/' style={{ display: 'inline' }}>
        Home
      </Link>
      <form onSubmit={handleSubmit(onSubmit)}>
        {loginError && (
          <p style={{ textAlign: 'center', marginBottom: '0.75rem' }}>{loginError}</p>
        )}
        <div className='form-element'>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            id='email'
            placeholder='jane.doe@example.com'
            {...register('email')}
          />
          <p>{errors.email?.message}</p>
        </div>
        <div className='form-element'>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            placeholder='******'
            {...register('password')}
          />
          <p>{errors.password?.message}</p>
        </div>
        <button type='submit'>Submit</button>
      </form>
    </div>
  )
}

export default LoginPage
