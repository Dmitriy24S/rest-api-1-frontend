import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { object, string, TypeOf } from 'zod'

const createUserSchema = object({
  //   name: string({
  //     required_error: 'Name is required',
  //   }),
  name: string().nonempty({
    message: 'Name is required',
  }),
  password: string().min(6, 'Password too short - should be 6 chars. minimum').nonempty({
    message: 'Password is required',
  }),
  // passwordConfirm: string().nonempty({
  passwordConfirmation: string().nonempty({
    message: 'Password is required',
  }),
  email: string().email('Not a valid email').nonempty({
    message: 'Email is required',
  }),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: 'Passwords do not match',
  path: ['passwordConfirmation'],
})

type CreateUserInput = TypeOf<typeof createUserSchema>

const RegisterPage = () => {
  const router = useRouter()
  const [registrationError, setRegistrationError] = useState(null)
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  })

  const onSubmit = async (values: CreateUserInput) => {
    console.log('form values', values)
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`, values)
      router.push('/')
    } catch (error) {
      console.log('onSubmit error', error)
      // onSubmit error AxiosError {message: 'Unsupported protocol localhost:', name: 'AxiosError', code: 'ERR_BAD_REQUEST', config: {…}, stack: 'AxiosError: Unsupported protocol localhost:\n    at…dules/react-hook-form/dist/index.esm.mjs:2028:19)'}
      setRegistrationError(error.message) // ! 'error' is of type 'unknown'.ts(18046)
      // ! offline server -> Unsupported protocol localhost: // Network Error // Request failed with status code 400
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
        {registrationError && (
          <p style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
            {registrationError}
          </p>
        )}
        <div className='form-element'>
          <label htmlFor='name'>Name</label>
          <input type='text' id='name' placeholder='Jane Doe' {...register('name')} />
          <p>{errors.name?.message}</p>
        </div>
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
        <div className='form-element'>
          <label htmlFor='passwordConfirmation'>Confirm Password</label>
          <input
            type='password'
            id='passwordConfirmation'
            placeholder='******'
            {...register('passwordConfirmation')}
          />
          <p>{errors.passwordConfirmation?.message}</p>
        </div>
        <button type='submit'>Submit</button>
      </form>
    </div>
  )
}

export default RegisterPage
