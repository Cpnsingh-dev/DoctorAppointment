import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const navigate = useNavigate();
    const { token, setToken, backendUrl } = useContext(AppContext);

    const [state, setState] = useState('Sign Up')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {
            if (state === 'Sign Up') {
                const { data } = await axios.post(`${backendUrl}/api/user/register`, { name, email, password })
                if (data.success) {
                    localStorage.setItem('token', data.token)
                    setToken(data.token)
                    toast.success("Account created successfully!")
                } else {
                    toast.error(data.message)
                }
            } else {
                const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password })
                if (data.success) {
                    localStorage.setItem('token', data.token)
                    setToken(data.token)
                    toast.success("Logged in successfully!")
                } else {
                    toast.error(data.message)
                }
            }
        }
        catch (error) {
            toast.error(error.response?.data?.message || error.message || "Something went wrong")
        }
    }

    useEffect(() => {
        if (token) {
            navigate('/')
        }
    }, [token, navigate])

    return (
        <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
            <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border border-zinc-200 rounded-xl text-zinc-600 text-sm shadow-lg'>
                <p className='text-2xl font-semibold text-gray-800'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
                <p className='text-gray-500'>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book appointment</p>

                {state === 'Sign Up' && (
                    <div className='w-full'>
                        <p className='text-gray-700 font-medium'>Full Name</p>
                        <input
                            className='border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-primary'
                            type="text"
                            placeholder="Enter your full name"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            required
                        />
                    </div>
                )}

                <div className='w-full'>
                    <p className='text-gray-700 font-medium'>Email</p>
                    <input
                        className='border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-primary'
                        type="email"
                        placeholder="Enter your email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        required
                    />
                </div>

                <div className='w-full'>
                    <p className='text-gray-700 font-medium'>Password</p>
                    <input
                        className='border border-zinc-300 rounded w-full p-2 mt-1 focus:outline-primary'
                        type="password"
                        placeholder="Enter your password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className='bg-primary text-white w-full py-2.5 rounded-md text-base font-medium hover:bg-opacity-90 transition-all cursor-pointer mt-2'
                >
                    {state === 'Sign Up' ? 'Create Account' : 'Login'}
                </button>

                {state === 'Sign Up' ? (
                    <p className='text-gray-500 text-xs mt-1'>
                        Already have an account?{' '}
                        <span onClick={() => setState('Login')} className='text-primary underline cursor-pointer font-medium'>
                            Login here
                        </span>
                    </p>
                ) : (
                    <p className='text-gray-500 text-xs mt-1'>
                        Create a new account?{' '}
                        <span onClick={() => setState('Sign Up')} className='text-primary underline cursor-pointer font-medium'>
                            Click here
                        </span>
                    </p>
                )}
            </div>
        </form>
    )
}

export default Login